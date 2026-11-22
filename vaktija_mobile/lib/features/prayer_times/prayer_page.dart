import 'dart:async';

import 'package:flutter/material.dart';

import '../../app/vaktija_palette.dart';
import 'prayer_repository.dart';
import 'prayer_timetable_view.dart';
import 'timetable.dart';

class PrayerPage extends StatefulWidget {
  const PrayerPage({
    super.key,
    required this.repository,
    required this.city,
    required this.method,
    required this.labels,
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
  final bool fullscreen;
  final Animation<double>? fullscreenMotion;
  final Animation<double>? fullscreenRowsMotion;
  final VoidCallback onEnterFullscreen, onExitFullscreen;

  @override
  State<PrayerPage> createState() => _PrayerPageState();
}

class _PrayerPageState extends State<PrayerPage> {
  late DateTime _now;
  final _days = <String, AsyncSnapshot<List<PrayerTime>>>{};
  final _regularScroll = ScrollController();
  final _countdownKey = GlobalKey();
  double _regularOffset = 0;
  Timer? _clock;

  @override
  void initState() {
    super.initState();
    _now = widget.repository.now();
    _loadWindow();
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
    final times = sortTimetable([
      for (final time in [...?yesterday, ...?today?.data])
        if (dayKey(time.at) == date) time,
    ]);
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
