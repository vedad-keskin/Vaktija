import 'dart:async';

import 'package:flutter/foundation.dart' show setEquals;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../app/vaktija_palette.dart';
import 'prayer_reminders.dart';
import 'prayer_repository.dart';
import 'prayer_timetable_view.dart';
import 'prayer_widgets.dart';
import 'timetable.dart';

class PrayerPage extends StatefulWidget {
  const PrayerPage({
    super.key,
    required this.repository,
    required this.city,
    required this.method,
    required this.labels,
    this.reminders,
    this.fullscreen = false,
    this.fullscreenMotion,
    this.fullscreenRowsMotion,
    required this.onEnterFullscreen,
    required this.onExitFullscreen,
  });

  final PrayerRepository repository;
  final PrayerCity city;
  final PrayerMethod? method;
  final PrayerLabels labels;
  final PrayerReminders? reminders;
  final bool fullscreen;
  final Animation<double>? fullscreenMotion;
  final Animation<double>? fullscreenRowsMotion;
  final VoidCallback onEnterFullscreen, onExitFullscreen;

  @override
  State<PrayerPage> createState() => _PrayerPageState();
}

class _PrayerPageState extends State<PrayerPage> with WidgetsBindingObserver {
  late DateTime _now;
  final _days = <String, AsyncSnapshot<List<PrayerTime>>>{};
  final _regularScroll = ScrollController();
  final _countdownKey = GlobalKey();
  double _regularOffset = 0;
  Timer? _clock;
  late final _reminders =
      widget.reminders ?? PrayerReminders(widget.repository.preferences);
  late Set<String> _visibleReminders = _reminders.enabled;
  bool _savingReminders = false;
  bool _saveRequested = false;
  bool _refreshRequested = false;
  bool _requestingReminderPermission = false;
  bool _reminderPermissionGranted = false;
  int _permissionCheck = 0;

  bool get _supportsReminders =>
      widget.reminders != null || PrayerReminders.supported;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _now = widget.repository.now();
    _loadWindow();
    if (_supportsReminders) {
      unawaited(_checkReminderPermission());
      _refreshReminders(refresh: true);
    }
    _clock = Timer.periodic(const Duration(seconds: 1), (_) {
      final now = widget.repository.now();
      setState(() {
        final newDay = dayKey(now) != dayKey(_now);
        _now = now;
        if (newDay) _loadWindow(retry: true);
      });
    });
  }

  @override
  void didUpdateWidget(PrayerPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.fullscreen &&
        !oldWidget.fullscreen &&
        _regularScroll.hasClients) {
      _regularOffset = _regularScroll.offset;
    }
    if (widget.city != oldWidget.city ||
        widget.method != oldWidget.method ||
        widget.repository != oldWidget.repository) {
      _days.clear();
      _now = widget.repository.now();
      _loadWindow();
    }
    if (widget.city != oldWidget.city ||
        widget.method != oldWidget.method ||
        widget.labels.bosnian != oldWidget.labels.bosnian) {
      _refreshReminders();
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed &&
        _supportsReminders &&
        !_requestingReminderPermission) {
      unawaited(_checkReminderPermission());
      _refreshReminders(refresh: true);
    }
  }

  Future<void> _checkReminderPermission() async {
    final check = ++_permissionCheck;
    _reminderPermissionGranted = false;
    try {
      final permission = await _reminders.checkPermission();
      if (mounted && check == _permissionCheck) {
        _reminderPermissionGranted = permission == ReminderPermission.granted;
      }
    } catch (error) {
      debugPrint('Could not check prayer reminder permission: $error');
    }
  }

  void _refreshReminders({bool refresh = false}) {
    if (_supportsReminders && _visibleReminders.isNotEmpty) {
      _refreshRequested = _refreshRequested || refresh;
      _queueReminderSave();
    }
  }

  void _queueReminderSave() {
    _saveRequested = true;
    if (!_savingReminders) unawaited(_saveReminders());
  }

  Future<void> _saveReminders() async {
    _savingReminders = true;
    try {
      while (_saveRequested) {
        // A newer tap can replace the pending selection while a write is open.
        await Future<void>.delayed(Duration.zero);
        if (!mounted || widget.method == null) return;
        _saveRequested = false;
        final selection = _visibleReminders;
        final refresh = _refreshRequested;
        _refreshRequested = false;
        try {
          await PrayerWidgets.initialize();
          if (!mounted || widget.method == null) return;
          await _reminders.save(
            widget.city,
            widget.method!,
            widget.labels,
            selection,
            refresh: refresh,
          );
        } catch (error) {
          debugPrint('Could not update prayer reminders: $error');
          if (mounted &&
              identical(selection, _visibleReminders) &&
              !setEquals(selection, _reminders.enabled)) {
            setState(() => _visibleReminders = _reminders.enabled);
            _showReminderSaveError();
          }
        }
      }
    } finally {
      _savingReminders = false;
    }
  }

  void _changeReminder(String key, {required bool enabled}) {
    final selection = {..._visibleReminders};
    final changed = enabled ? selection.add(key) : selection.remove(key);
    if (!changed) return;
    setState(() => _visibleReminders = selection);
    _queueReminderSave();
  }

  void _showReminderSaveError() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          widget.labels.bosnian
              ? 'Nije moguće sačuvati obavijest.'
              : 'Could not save the reminder.',
        ),
      ),
    );
  }

  Future<void> _toggleReminder(PrayerKind kind, PrayerReminder reminder) async {
    final key = reminder.key(kind);
    final enabled = _visibleReminders.contains(key);
    if (enabled || _reminderPermissionGranted) {
      _changeReminder(key, enabled: !enabled);
      return;
    }
    if (_requestingReminderPermission) return;
    _requestingReminderPermission = true;
    _permissionCheck++;
    final bosnian = widget.labels.bosnian;
    try {
      final permission = await _reminders.requestPermission();
      if (!mounted) return;
      _reminderPermissionGranted = permission == ReminderPermission.granted;
      if (_reminderPermissionGranted) {
        _changeReminder(key, enabled: true);
        return;
      }
      final askForNotifications =
          permission == ReminderPermission.notifications;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            askForNotifications
                ? (bosnian
                      ? 'Dozvolite obavijesti za Vaktiju.'
                      : 'Allow notifications for Vaktija.')
                : (bosnian
                      ? 'Dozvolite tačne alarme za podsjetnike.'
                      : 'Allow exact alarms for prayer reminders.'),
          ),
          action: SnackBarAction(
            label: bosnian ? 'Postavke' : 'Settings',
            onPressed: () {
              if (askForNotifications) {
                unawaited(
                  const MethodChannel(
                    'vaktija/app',
                  ).invokeMethod<void>('openNotificationSettings'),
                );
              } else {
                unawaited(_toggleReminder(kind, reminder));
              }
            },
          ),
        ),
      );
    } catch (error) {
      if (mounted) _showReminderSaveError();
    } finally {
      _requestingReminderPermission = false;
    }
  }

  void _loadWindow({bool retry = false}) {
    final method = widget.method;
    if (method == null) return;
    final window = [
      for (final offset in [0, -1, 1]) sarajevoDay(_now, offset),
    ];
    final dates = window.map(dayKey).toSet();
    _days.removeWhere((key, _) => !dates.contains(key));

    for (final day in window) {
      final date = dayKey(day);
      final previous = _days[date];
      if (previous != null &&
          (!retry ||
              previous.connectionState == ConnectionState.waiting ||
              previous.data?.length == PrayerKind.values.length)) {
        continue;
      }
      final pending =
          (previous?.hasData == true
                  ? previous!
                  : const AsyncSnapshot<List<PrayerTime>>.nothing())
              .inState(ConnectionState.waiting);
      _days[date] = pending;
      unawaited(_loadDay(day, method, pending));
    }
  }

  Future<void> _loadDay(
    DateTime day,
    PrayerMethod method,
    AsyncSnapshot<List<PrayerTime>> pending,
  ) async {
    final date = dayKey(day);
    AsyncSnapshot<List<PrayerTime>> result;
    try {
      final times = await widget.repository.load(widget.city, method, day);
      result = AsyncSnapshot.withData(ConnectionState.done, times);
    } catch (error, stack) {
      result = pending.hasData
          ? pending.inState(ConnectionState.done)
          : AsyncSnapshot.withError(ConnectionState.done, error, stack);
    }
    // A response can arrive after a city, method or calendar change.
    if (mounted && identical(_days[date], pending)) {
      setState(() => _days[date] = result);
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _clock?.cancel();
    _regularScroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final labels = widget.labels;
    final date = dayKey(_now);
    final today = _days[date];
    final yesterday = _days[dayKey(sarajevoDay(_now, -1))]?.data;
    final tomorrow = _days[dayKey(sarajevoDay(_now, 1))]?.data;
    final times = calendarTimetable(
      _now,
      yesterday: yesterday,
      today: today?.data,
    );
    final interval = PrayerInterval.find(
      _now,
      yesterday: yesterday,
      today: today?.data,
      tomorrow: tomorrow,
    );
    final waiting = _days.values.any(
      (day) => day.connectionState == ConnectionState.waiting,
    );

    Widget status(bool loading, {required bool countdownOnly}) {
      if (loading) {
        return _PrayerStatus(
          title: labels['loading'],
          detail: labels['loadingSubtitle'],
        );
      }
      return _PrayerStatus(
        title: countdownOnly
            ? (labels.bosnian
                  ? 'Sljedeće vrijeme nije dostupno'
                  : 'Next prayer time unavailable')
            : labels['errorTitle'],
        detail: labels['errorHint'],
        action: TextButton(
          onPressed: () => setState(() => _loadWindow(retry: true)),
          child: Text(labels['retryAction']),
        ),
      );
    }

    final fallback = times.isEmpty
        ? status(today?.hasError != true, countdownOnly: false)
        : interval == null
        ? status(waiting, countdownOnly: true)
        : null;

    final timetable = PrayerTimetableView(
      times: times,
      city: widget.city.name,
      countdownKey: _countdownKey,
      now: _now,
      interval: interval,
      countdownFallback: fallback,
      labels: labels,
      fullscreen: widget.fullscreen,
      headerMotion: widget.fullscreenMotion,
      rowMotion: widget.fullscreenRowsMotion,
      regularScroll: _regularScroll,
      regularOffset: _regularOffset,
      reminderSelections: _supportsReminders ? _visibleReminders : const {},
      onToggleReminder: _supportsReminders && widget.method != null
          ? _toggleReminder
          : null,
      onToggleFullscreen: widget.fullscreen
          ? widget.onExitFullscreen
          : widget.onEnterFullscreen,
    );
    if (times.isNotEmpty || widget.fullscreen) return timetable;

    final motion = widget.fullscreenMotion ?? const AlwaysStoppedAnimation(0.0);
    return AnimatedBuilder(
      animation: motion,
      child: timetable,
      builder: (context, child) => motion.value == 0
          ? SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(12, 14, 12, 32),
              child: fallback,
            )
          : child!,
    );
  }
}

class _PrayerStatus extends StatelessWidget {
  const _PrayerStatus({required this.title, required this.detail, this.action});

  final String title;
  final String detail;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: colors.panel,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: colors.border),
      ),
      child: Column(
        children: [
          if (action == null) const CircularProgressIndicator(),
          const SizedBox(height: 12),
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 6),
          Text(
            detail,
            textAlign: TextAlign.center,
            style: TextStyle(color: colors.muted),
          ),
          ?action,
        ],
      ),
    );
  }
}
