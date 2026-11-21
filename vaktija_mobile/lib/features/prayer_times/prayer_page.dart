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
    required this.collapsed,
    required this.onToggleCountdown,
  });

  final PrayerRepository repository;
  final PrayerCity city;
  final PrayerMethod? method;
  final PrayerLabels labels;
  final bool collapsed;
  final VoidCallback onToggleCountdown;

  @override
  State<PrayerPage> createState() => _PrayerPageState();
}

class _PrayerPageState extends State<PrayerPage> {
  DateTime _now = sarajevoNow();
  Future<List<PrayerTime>>? _timetable;
  Timer? _clock;

  @override
  void initState() {
    super.initState();
    _load();
    _clock = Timer.periodic(const Duration(seconds: 1), (_) {
      final now = sarajevoNow();
      setState(() {
        final newDay = dayKey(now) != dayKey(_now);
        _now = now;
        if (newDay) _load();
      });
    });
  }

  @override
  void didUpdateWidget(PrayerPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.city != oldWidget.city || widget.method != oldWidget.method) {
      _load();
    }
  }

  void _load() {
    final method = widget.method;
    _timetable = method == null
        ? null
        : widget.repository.load(widget.city, method, _now);
  }

  @override
  void dispose() {
    _clock?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => FutureBuilder(
    future: _timetable,
    builder: (context, snapshot) {
      final labels = widget.labels;
      final Widget content;
      if (snapshot.connectionState != ConnectionState.done) {
        content = _PrayerStatus(
          title: labels['loading'],
          detail: labels['loadingSubtitle'],
        );
      } else if (snapshot.hasError) {
        content = _PrayerStatus(
          title: labels['errorTitle'],
          detail: labels['errorHint'],
          action: TextButton(
            onPressed: () => setState(_load),
            child: Text(labels['retryAction']),
          ),
        );
      } else {
        content = PrayerTimetableView(
          times: snapshot.requireData,
          now: _now,
          labels: labels,
          collapsed: widget.collapsed,
          onToggleCountdown: widget.onToggleCountdown,
        );
      }

      return SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(12, 14, 12, 32),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 650),
            child: content,
          ),
        ),
      );
    },
  );
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
