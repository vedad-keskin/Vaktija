import 'package:flutter/material.dart';

import '../../app/vaktija_palette.dart';
import 'timetable.dart';

const _tabular = [FontFeature.tabularFigures()];

class PrayerTimetableView extends StatelessWidget {
  const PrayerTimetableView({
    super.key,
    required this.times,
    required this.now,
    required this.interval,
    required this.countdownFallback,
    required this.labels,
    required this.collapsed,
    required this.onToggleCountdown,
  });

  final List<PrayerTime> times;
  final DateTime now;
  final PrayerInterval? interval;
  final Widget? countdownFallback;
  final PrayerLabels labels;
  final bool collapsed;
  final VoidCallback onToggleCountdown;

  @override
  Widget build(BuildContext context) {
    final countdown = interval;
    final current = countdown?.current;
    final next = countdown?.next;
    final nextOnAnotherDay = next != null && dayKey(next.at) != dayKey(now);
    final nowMinute =
        now.millisecondsSinceEpoch ~/ Duration.millisecondsPerMinute;

    bool elapsed(PrayerTime time) => !time.at.isAfter(now);

    double trailProgress(int index) {
      final time = times[index];
      return time == current ? countdown!.progress : (elapsed(time) ? 1 : 0);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (countdown != null)
          _Countdown(
            title: labels.prayer(countdown.next),
            date: labels.date(now),
            interval: countdown,
            labels: labels,
            collapsed: collapsed,
            onToggle: onToggleCountdown,
          )
        else
          ?countdownFallback,
        const SizedBox(height: 18),
        for (final (index, time) in times.indexed)
          _PrayerStop(
            time: time,
            name: labels.prayer(time),
            relative: labels.relative(
              time.at.millisecondsSinceEpoch ~/ Duration.millisecondsPerMinute -
                  nowMinute,
            ),
            badge: time == current
                ? labels['currentBadge']
                : time == next
                ? labels['nextBadge']
                : null,
            current: time == current,
            next: time == next,
            elapsed: elapsed(time),
            dimmed: !nextOnAnotherDay && elapsed(time) && time != current,
            hasPrevious: index > 0,
            hasNext: index < times.length - 1,
            previousProgress: index > 0 ? trailProgress(index - 1) : 0,
            progress: trailProgress(index),
          ),
      ],
    );
  }
}

class _Countdown extends StatelessWidget {
  const _Countdown({
    required this.title,
    required this.date,
    required this.interval,
    required this.labels,
    required this.collapsed,
    required this.onToggle,
  });

  final String title;
  final String date;
  final PrayerInterval interval;
  final PrayerLabels labels;
  final bool collapsed;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final theme = colors.dark ? 'dark' : 'light';
    final motion = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : const Duration(milliseconds: 240);
    final seconds = interval.remaining;
    final parts = [
      padTime(seconds ~/ 3600),
      padTime(seconds ~/ 60 % 60),
      padTime(seconds % 60),
    ];
    final toggleLabel =
        labels[collapsed ? 'expandCountdown' : 'collapseCountdown'];

    return LayoutBuilder(
      builder: (context, limits) {
        final artHeight = limits.maxWidth * .75;
        final titleStyle = TextStyle(
          color: colors.heroText,
          fontFamily: 'Cormorant Garamond',
          fontWeight: FontWeight.w600,
          fontSize: (limits.maxWidth * .137).clamp(40.0, 62.0),
          height: 1.07,
        );
        final digits = TextStyle(
          color: colors.heroText,
          fontWeight: FontWeight.w600,
          fontSize: 49,
          fontFeatures: _tabular,
          height: 1,
        );

        return Container(
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            color: colors.sky,
            borderRadius: BorderRadius.circular(18),
          ),
          foregroundDecoration: BoxDecoration(
            border: Border.all(color: colors.heroBorder),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Stack(
            children: [
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                height: artHeight,
                child: AnimatedOpacity(
                  duration: motion,
                  opacity: collapsed ? 0 : 1,
                  child: _artwork(colors, 'mobile-$theme'),
                ),
              ),
              Positioned(
                left: 0,
                right: 0,
                top: 0,
                height: 76,
                child: AnimatedOpacity(
                  duration: motion,
                  opacity: collapsed ? 1 : 0,
                  child: _artwork(colors, theme, compact: true),
                ),
              ),
              Positioned.fill(
                child: IgnorePointer(
                  child: Padding(
                    padding: const EdgeInsets.all(7),
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: colors.heroGold.withValues(alpha: .20),
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ),
              AnimatedCrossFade(
                duration: motion,
                sizeCurve: Curves.easeInOut,
                crossFadeState: collapsed
                    ? CrossFadeState.showSecond
                    : CrossFadeState.showFirst,
                firstChild: _expandedContent(colors, titleStyle, digits, parts),
                secondChild: GestureDetector(
                  onTap: onToggle,
                  behavior: HitTestBehavior.opaque,
                  excludeFromSemantics: true,
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(minHeight: 76),
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(17, 10, 65, 10),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              title,
                              style: titleStyle.copyWith(
                                fontSize: 23,
                                height: 1,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          ConstrainedBox(
                            constraints: BoxConstraints(
                              maxWidth: limits.maxWidth * .42,
                            ),
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Text(
                                parts.join(':'),
                                style: digits.copyWith(fontSize: 23),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              Positioned(
                left: 15,
                right: 15,
                bottom: artHeight * .145 - 10,
                child: IgnorePointer(
                  child: ExcludeSemantics(
                    excluding: collapsed,
                    child: AnimatedOpacity(
                      duration: motion,
                      opacity: collapsed ? 0 : 1,
                      child: _HorizonProgress(
                        value: interval.progress,
                        colors: colors,
                        label: labels['countdownProgressAria'],
                      ),
                    ),
                  ),
                ),
              ),
              Positioned(
                top: 16,
                right: 9,
                child: Tooltip(
                  message: toggleLabel,
                  child: Semantics(
                    button: true,
                    expanded: !collapsed,
                    child: InkResponse(
                      onTap: onToggle,
                      radius: 22,
                      child: SizedBox(
                        width: 44,
                        height: 44,
                        child: Center(
                          child: AnimatedRotation(
                            turns: collapsed ? 0 : .5,
                            duration: motion,
                            curve: Curves.easeInOut,
                            child: _Chevron(colors: colors),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _artwork(VaktijaPalette colors, String theme, {bool compact = false}) {
    final clearSky = colors.sky.withValues(alpha: 0);
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(
          '$prayerAssets/mosque-horizon-$theme.webp',
          fit: BoxFit.cover,
          alignment: Alignment.bottomCenter,
          excludeFromSemantics: true,
        ),
        if (compact)
          ColoredBox(color: colors.sky.withValues(alpha: .35))
        else ...[
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: const Alignment(0, -.1),
                radius: .69,
                colors: [
                  colors.sky.withValues(alpha: colors.dark ? .44 : .87),
                  clearSky,
                ],
                stops: const [.53, 1],
              ),
            ),
          ),
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [colors.sky, clearSky],
                stops: const [0, .28],
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _expandedContent(
    VaktijaPalette colors,
    TextStyle titleStyle,
    TextStyle digits,
    List<String> parts,
  ) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 31, 12, 65),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 31),
            child: Text(
              date,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12.8,
                fontWeight: FontWeight.w500,
                color: colors.heroMuted,
              ),
            ),
          ),
          const SizedBox(height: 13),
          Text(
            labels['nextTime'].toUpperCase(),
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 10.4,
              letterSpacing: 1.85,
              color: colors.heroGold,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 10),
          Text(title, textAlign: TextAlign.center, style: titleStyle),
          const SizedBox(height: 9),
          Center(
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (final (index, value) in parts.indexed) ...[
                    if (index > 0)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 5),
                        child: Text(
                          ':',
                          style: digits.copyWith(
                            fontSize: 40,
                            color: colors.heroGold,
                          ),
                        ),
                      ),
                    Column(
                      children: [
                        Text(value, style: digits),
                        const SizedBox(height: 9),
                        Text(
                          labels[const [
                                'countdownHours',
                                'countdownMinutes',
                                'countdownSeconds',
                              ][index]]
                              .toUpperCase(),
                          style: TextStyle(
                            color: colors.heroMuted,
                            fontSize: 10.4,
                            letterSpacing: 1.45,
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Chevron extends StatelessWidget {
  const _Chevron({required this.colors});

  final VaktijaPalette colors;

  @override
  Widget build(BuildContext context) => Container(
    height: 32,
    width: 32,
    decoration: BoxDecoration(
      shape: BoxShape.circle,
      color: colors.sky,
      border: Border.all(color: colors.heroBorder),
    ),
    child: Icon(Icons.keyboard_arrow_down, size: 19, color: colors.heroGold),
  );
}

class _HorizonProgress extends StatelessWidget {
  const _HorizonProgress({
    required this.value,
    required this.colors,
    required this.label,
  });

  final double value;
  final VaktijaPalette colors;
  final String label;

  @override
  Widget build(BuildContext context) => Semantics(
    label: label,
    value: '${(value * 100).round()}%',
    child: SizedBox(
      height: 14,
      child: LayoutBuilder(
        builder: (context, size) {
          final fill = size.maxWidth * value;
          return Stack(
            clipBehavior: Clip.none,
            children: [
              Positioned(
                left: 0,
                right: 0,
                top: 5,
                child: Container(
                  height: 4,
                  decoration: BoxDecoration(
                    color: colors.track,
                    borderRadius: BorderRadius.circular(99),
                    boxShadow: [BoxShadow(color: colors.sky, spreadRadius: 1)],
                  ),
                ),
              ),
              Positioned(
                left: 0,
                width: fill,
                top: 5,
                child: Container(
                  height: 4,
                  decoration: BoxDecoration(
                    color: colors.trailGold,
                    borderRadius: BorderRadius.circular(99),
                  ),
                ),
              ),
              Positioned(
                left: fill - 6,
                top: 1,
                child: Container(
                  height: 12,
                  width: 12,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: colors.marker,
                    border: Border.all(color: colors.trailGold, width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: colors.trailGold.withValues(alpha: .5),
                        blurRadius: 7,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    ),
  );
}

class _PrayerStop extends StatelessWidget {
  const _PrayerStop({
    required this.time,
    required this.name,
    required this.relative,
    required this.badge,
    required this.current,
    required this.next,
    required this.elapsed,
    required this.dimmed,
    required this.hasPrevious,
    required this.hasNext,
    required this.previousProgress,
    required this.progress,
  });

  final PrayerTime time;
  final String name, relative;
  final String? badge;
  final bool current, next, elapsed, dimmed, hasPrevious, hasNext;
  final double previousProgress, progress;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final spacious = MediaQuery.sizeOf(context).width >= 380;
    final foreground = dimmed ? colors.secondary : colors.text;
    final border = next
        ? colors.gold
        : (current ? colors.accent : colors.border);

    return CustomPaint(
      painter: _TrailPainter(this, colors),
      child: Padding(
        padding: EdgeInsets.only(left: 26, bottom: hasNext ? 8 : 0),
        child: Container(
          constraints: const BoxConstraints(minHeight: 76),
          decoration: BoxDecoration(
            color: next ? colors.next : null,
            gradient: next
                ? null
                : LinearGradient(
                    colors: [colors.panel, colors.surface],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: border),
          ),
          clipBehavior: Clip.antiAlias,
          child: Stack(
            children: [
              if (next)
                Positioned(
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  child: ColoredBox(color: colors.gold),
                ),
              Padding(
                padding: EdgeInsets.symmetric(
                  horizontal: spacious ? 12 : 10,
                  vertical: 9,
                ),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(minHeight: 56),
                  child: Row(
                    children: [
                      Image.asset(
                        '$prayerAssets/${time.kind.name}.png',
                        width: spacious ? 52 : 44,
                        excludeFromSemantics: true,
                      ),
                      SizedBox(width: spacious ? 10 : 8),
                      Expanded(
                        flex: 6,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              name,
                              style: TextStyle(
                                color: foreground,
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                height: 1.3,
                              ),
                            ),
                            if (badge != null) ...[
                              const SizedBox(height: 4),
                              Text(
                                badge!.toUpperCase(),
                                style: TextStyle(
                                  color: next ? colors.gold : colors.accent,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: .8,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      const SizedBox(width: 6),
                      Flexible(
                        flex: 4,
                        child: Align(
                          alignment: Alignment.centerRight,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                time.time,
                                textAlign: TextAlign.right,
                                style: TextStyle(
                                  color: next ? colors.accent : foreground,
                                  fontSize: 24,
                                  fontWeight: FontWeight.w600,
                                  fontFeatures: _tabular,
                                  height: 1.15,
                                ),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                relative,
                                textAlign: TextAlign.right,
                                style: TextStyle(
                                  color: colors.muted,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TrailPainter extends CustomPainter {
  const _TrailPainter(this.stop, this.colors);

  final _PrayerStop stop;
  final VaktijaPalette colors;

  @override
  void paint(Canvas canvas, Size size) {
    const x = 10.0;
    final middle = (size.height - (stop.hasNext ? 8 : 0)) / 2;
    final from = stop.hasPrevious ? 0.0 : middle;
    final to = stop.hasNext ? size.height : middle;
    final track = Paint()
      ..color = colors.track
      ..strokeWidth = 2;
    final gold = Paint()
      ..color = colors.trailGold
      ..strokeWidth = 2;
    final outset = (stop.previousProgress - .5).clamp(0.0, .5) * 2;
    final inset = (stop.progress * 2).clamp(0.0, 1.0);

    for (var y = from; y < to; y += 7) {
      canvas.drawLine(Offset(x, y), Offset(x, (y + 3).clamp(from, to)), track);
    }
    if (stop.hasPrevious && outset > 0) {
      canvas.drawLine(const Offset(x, 0), Offset(x, middle * outset), gold);
    }
    if (stop.hasNext && inset > 0) {
      canvas.drawLine(
        Offset(x, middle),
        Offset(x, middle + (to - middle) * inset),
        gold,
      );
    }
    canvas.drawLine(
      Offset(x, middle),
      Offset(26, middle),
      Paint()..color = colors.border,
    );

    final center = Offset(x, middle);
    if (stop.current) {
      canvas.drawCircle(
        center,
        7,
        Paint()
          ..color = colors.trailGold.withValues(alpha: .5)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3),
      );
    }
    if (stop.next) {
      canvas.drawCircle(center, 8.5, Paint()..color = colors.surface);
      canvas.drawCircle(
        center,
        8.5,
        Paint()
          ..color = colors.trailGold
          ..style = PaintingStyle.stroke,
      );
    }
    canvas.drawCircle(
      center,
      6,
      stop.elapsed || stop.next || stop.current ? gold : track,
    );
    if (!stop.elapsed || stop.current || stop.next) {
      canvas.drawCircle(
        center,
        4,
        Paint()..color = stop.current ? colors.marker : colors.surface,
      );
    }
  }

  @override
  bool shouldRepaint(_TrailPainter oldDelegate) => true;
}
