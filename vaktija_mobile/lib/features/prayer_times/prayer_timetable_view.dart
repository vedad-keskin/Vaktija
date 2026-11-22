import 'dart:ui' show lerpDouble;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import '../../app/vaktija_palette.dart';
import 'timetable.dart';

const _tabular = [FontFeature.tabularFigures()];
const _trailX = 10.0;
const _trailGutter = 26.0;

class PrayerTimetableView extends StatelessWidget {
  const PrayerTimetableView({
    super.key,
    required this.times,
    required this.city,
    required this.now,
    required this.interval,
    required this.countdownFallback,
    required this.labels,
    this.fullscreen = false,
    this.headerProgress = 0,
    this.rowProgress = 0,
    this.regularScroll,
    this.regularOffset = 0,
    this.countdownKey,
    required this.onToggleFullscreen,
  });

  final List<PrayerTime> times;
  final String city;
  final DateTime now;
  final PrayerInterval? interval;
  final Widget? countdownFallback;
  final PrayerLabels labels;
  final bool fullscreen;
  final double headerProgress, rowProgress;
  final ScrollController? regularScroll;
  final double regularOffset;
  final Key? countdownKey;
  final VoidCallback onToggleFullscreen;

  @override
  Widget build(BuildContext context) {
    final fullscreenLayout = fullscreen || headerProgress > 0;
    final countdown = interval;
    final toggle = _FullscreenButton(
      fullscreen: fullscreen,
      labels: labels,
      onPressed: onToggleFullscreen,
    );
    final header = Padding(
      padding: EdgeInsets.fromLTRB(12, lerpDouble(14, 8, headerProgress)!, 12, 0),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 650),
          child: countdown != null
              ? _Countdown(
                  key: countdownKey,
                  title: labels.prayer(countdown.next),
                  date: labels.date(now),
                  city: fullscreenLayout ? city : null,
                  showDetails: headerProgress < 1,
                  interval: countdown,
                  labels: labels,
                  toggle: toggle,
                )
              : Column(
                  children: [
                    Align(alignment: Alignment.centerRight, child: toggle),
                    ?countdownFallback,
                  ],
                ),
        ),
      ),
    );
    final scroll = CustomScrollView(
      key: fullscreenLayout
          ? const ValueKey('fullscreen-prayer-timetable')
          : const PageStorageKey('regular-prayer-timetable'),
      controller: fullscreenLayout ? null : regularScroll,
      primary: false,
      slivers: [
        if (fullscreenLayout)
          SliverFloatingHeader(
            animationStyle: MediaQuery.disableAnimationsOf(context)
                ? AnimationStyle.noAnimation
                : null,
            child: ColoredBox(
              color: VaktijaPalette.of(context).surface,
              child: header,
            ),
          )
        else
          SliverToBoxAdapter(child: header),
        if (times.isNotEmpty)
          SliverLayoutBuilder(
            builder: (context, bounds) {
              final top = lerpDouble(18, 8, rowProgress)!;
              final bottom = lerpDouble(32, 12, rowProgress)!;
              return SliverPadding(
                padding: EdgeInsets.fromLTRB(12, top, 12, bottom),
                sliver: SliverToBoxAdapter(
                  child: _rows(
                    context,
                    width: bounds.crossAxisExtent - 24,
                    height:
                        bounds.viewportMainAxisExtent -
                        bounds.precedingScrollExtent -
                        top -
                        bottom,
                  ),
                ),
              );
            },
          ),
      ],
    );

    // Keep the card's starting position when the fullscreen viewport opens.
    // PageStorage restores the regular scroll position on exit.
    return ClipRect(
      child: Transform.translate(
        offset: Offset(
          0,
          fullscreenLayout ? -regularOffset * (1 - headerProgress) : 0,
        ),
        child: scroll,
      ),
    );
  }

  Widget _rows(
    BuildContext context, {
    required double width,
    required double height,
  }) {
    final wideLandscape =
        MediaQuery.orientationOf(context) == Orientation.landscape &&
        width >= 600 &&
        times.length > 1;
    final twoColumns = wideLandscape && rowProgress >= .5;
    final rowCount = twoColumns ? (times.length + 1) ~/ 2 : times.length;
    final gap = ((height / rowCount - 44) * .18).clamp(3.0, 9.0);
    final cardHeight = (height - gap * (rowCount - 1)) / rowCount;
    final density = _PrayerDensity(
      lerpDouble(
        _PrayerDensity.regularHeight,
        cardHeight.clamp(_PrayerDensity.minHeight, double.infinity),
        rowProgress,
      )!,
      lerpDouble(8, gap, rowProgress)!,
    );
    final rows = Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: twoColumns ? 900 : 650),
        child: twoColumns
            ? Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: _rail(context, times.take(rowCount), density),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _rail(context, times.skip(rowCount), density),
                  ),
                ],
              )
            : _rail(context, times, density),
      ),
    );
    // Fade the rail briefly while landscape changes between one and two columns.
    return wideLandscape
        ? Opacity(
            opacity: ((rowProgress - .5).abs() / .16).clamp(0, 1),
            child: rows,
          )
        : rows;
  }

  Widget _rail(
    BuildContext context,
    Iterable<PrayerTime> rows,
    _PrayerDensity density,
  ) {
    final countdown = interval;
    final current = countdown?.current;
    final next = countdown?.next;
    final nextOnAnotherDay = next != null && dayKey(next.at) != dayKey(now);
    final nowMinute =
        now.millisecondsSinceEpoch ~/ Duration.millisecondsPerMinute;

    bool elapsed(PrayerTime time) => !time.at.isAfter(now);

    return _PrayerTrail(
      colors: VaktijaPalette.of(context),
      spacing: density.gap,
      stops: [
        for (final time in rows)
          _PrayerStop(
            time: time,
            density: density,
            fullscreen: rowProgress > 0,
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
            progress: time == current
                ? countdown!.progress
                : (elapsed(time) ? 1 : 0),
          ),
      ],
    );
  }
}

class _FullscreenButton extends StatelessWidget {
  const _FullscreenButton({
    required this.fullscreen,
    required this.labels,
    required this.onPressed,
  });

  final bool fullscreen;
  final PrayerLabels labels;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    return IconButton(
      onPressed: onPressed,
      tooltip: fullscreen ? labels.exitFullscreen : labels.enterFullscreen,
      icon: CustomPaint(
        size: const Size.square(22),
        painter: _LucideFullscreenGlyph(fullscreen, colors.heroGold),
      ),
      style: IconButton.styleFrom(
        foregroundColor: colors.heroGold,
        backgroundColor: colors.sky,
        side: BorderSide(color: colors.heroBorder),
      ),
    );
  }
}

class _LucideFullscreenGlyph extends CustomPainter {
  const _LucideFullscreenGlyph(this.fullscreen, this.color);

  // Official Lucide 24×24 paths. See assets/branding/lucide-LICENSE.txt.
  static final _maximize2 = Path()
    ..moveTo(15, 3)
    ..lineTo(21, 3)
    ..lineTo(21, 9)
    ..moveTo(21, 3)
    ..lineTo(14, 10)
    ..moveTo(3, 21)
    ..lineTo(10, 14)
    ..moveTo(9, 21)
    ..lineTo(3, 21)
    ..lineTo(3, 15);
  static final _minimize2 = Path()
    ..moveTo(14, 10)
    ..lineTo(21, 3)
    ..moveTo(20, 10)
    ..lineTo(14, 10)
    ..lineTo(14, 4)
    ..moveTo(3, 21)
    ..lineTo(10, 14)
    ..moveTo(4, 14)
    ..lineTo(10, 14)
    ..lineTo(10, 20);

  final bool fullscreen;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    const grid = 24.0;
    final stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.save();
    canvas.scale(size.width / grid, size.height / grid);
    canvas.drawPath(fullscreen ? _minimize2 : _maximize2, stroke);
    canvas.restore();
  }

  @override
  bool shouldRepaint(_LucideFullscreenGlyph oldDelegate) =>
      fullscreen != oldDelegate.fullscreen || color != oldDelegate.color;
}

class _Countdown extends StatelessWidget {
  const _Countdown({
    super.key,
    required this.title,
    required this.date,
    required this.city,
    required this.showDetails,
    required this.interval,
    required this.labels,
    required this.toggle,
  });

  final String title, date;
  final String? city;
  final bool showDetails;
  final PrayerInterval interval;
  final PrayerLabels labels;
  final Widget toggle;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final theme = colors.dark ? 'dark' : 'light';
    final parts = interval.remainingParts;

    return LayoutBuilder(
      builder: (context, limits) {
        final artHeight = limits.maxWidth * .75;
        final radius = BorderRadius.circular(18);
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
          key: const ValueKey('prayer-countdown'),
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(color: colors.sky, borderRadius: radius),
          foregroundDecoration: BoxDecoration(
            border: Border.all(color: colors.heroBorder),
            borderRadius: radius,
          ),
          child: Stack(
            children: [
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                height: artHeight,
                child: RepaintBoundary(
                  child: _artwork(colors, 'mobile-$theme'),
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
              _content(colors, titleStyle, digits, parts),
              if (showDetails)
                Positioned(
                  left: 15,
                  right: 15,
                  bottom: artHeight * .145 - 10,
                  child: IgnorePointer(
                    child: _HorizonProgress(
                      value: interval.progress,
                      colors: colors,
                      label: labels['countdownProgressAria'],
                    ),
                  ),
                ),
              Positioned(top: 16, right: 9, child: toggle),
            ],
          ),
        );
      },
    );
  }

  Widget _artwork(VaktijaPalette colors, String theme) {
    final clearSky = colors.sky.withValues(alpha: 0);
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(
          '$prayerAssets/mosque-horizon-$theme.webp',
          fit: BoxFit.fill,
          excludeFromSemantics: true,
        ),
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
    );
  }

  Widget _content(
    VaktijaPalette colors,
    TextStyle titleStyle,
    TextStyle digits,
    List<String> parts,
  ) {
    final dateStyle = TextStyle(
      fontSize: 12.8,
      fontWeight: FontWeight.w500,
      color: colors.heroMuted,
    );
    final dateLabel = Text(date, textAlign: TextAlign.center, style: dateStyle);

    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 31, 12, 65),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 31),
            child: city == null
                ? dateLabel
                : Stack(
                    alignment: Alignment.center,
                    children: [
                      // Keep the date line's height when adding the city.
                      Opacity(opacity: 0, child: dateLabel),
                      Positioned.fill(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Text('$city · $date', style: dateStyle),
                        ),
                      ),
                    ],
                  ),
          ),
          const SizedBox(height: 13),
          if (showDetails) ...[
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
          ],
          Text(title, textAlign: TextAlign.center, style: titleStyle),
          const SizedBox(height: 9),
          Center(
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Semantics(
                label: parts.join(':'),
                excludeSemantics: true,
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
          ),
        ],
      ),
    );
  }
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

class _PrayerDensity {
  const _PrayerDensity(this.height, this.gap);

  static const minHeight = 34.0;
  static const regularHeight = 76.0;

  final double height, gap;

  double mix(double tight, double spacious) =>
      lerpDouble(
        tight,
        spacious,
        ((height - minHeight) / (regularHeight - minHeight)).clamp(0, 1),
      )!;
}

class _PrayerStop extends StatelessWidget {
  const _PrayerStop({
    required this.time,
    required this.density,
    required this.fullscreen,
    required this.name,
    required this.relative,
    required this.badge,
    required this.current,
    required this.next,
    required this.elapsed,
    required this.dimmed,
    required this.progress,
  });

  final PrayerTime time;
  final _PrayerDensity density;
  final bool fullscreen;
  final String name, relative;
  final String? badge;
  final bool current, next, elapsed, dimmed;
  final double progress;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final spacious = MediaQuery.sizeOf(context).width >= 380;
    final verticalPadding = density.mix(3, 9);
    final imageSize = density.mix(22, spacious ? 52 : 44);
    final showRelative = !fullscreen || density.height >= 52;
    final foreground = dimmed ? colors.secondary : colors.text;
    final border = next
        ? colors.gold
        : (current ? colors.accent : colors.border);
    final clock = Text(
      time.time,
      textAlign: TextAlign.right,
      maxLines: fullscreen ? 1 : null,
      style: TextStyle(
        color: next ? colors.accent : foreground,
        fontSize: density.mix(18, 24),
        fontWeight: FontWeight.w600,
        fontFeatures: _tabular,
        height: 1.15,
      ),
    );

    return Padding(
      padding: const EdgeInsets.only(left: _trailGutter),
      child: Container(
        constraints: BoxConstraints(minHeight: density.height),
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
                horizontal: density.mix(8, spacious ? 12 : 10),
                vertical: verticalPadding,
              ),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: density.height - verticalPadding * 2 - 2,
                ),
                child: Row(
                  children: [
                    Image.asset(
                      '$prayerAssets/${time.kind.name}.png',
                      width: imageSize,
                      height: fullscreen ? imageSize : null,
                      excludeFromSemantics: true,
                    ),
                    SizedBox(width: density.mix(7, spacious ? 10 : 8)),
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
                              fontSize: density.mix(12, 14),
                              fontWeight: FontWeight.w500,
                              height: density.mix(1.15, 1.3),
                            ),
                          ),
                          if (badge != null) ...[
                            SizedBox(height: density.mix(1, 4)),
                            Text(
                              badge!.toUpperCase(),
                              style: TextStyle(
                                color: next ? colors.gold : colors.accent,
                                fontSize: density.mix(8.5, 10),
                                height: showRelative ? null : 1.15,
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
                            if (fullscreen)
                              FittedBox(
                                fit: BoxFit.scaleDown,
                                alignment: Alignment.centerRight,
                                child: clock,
                              )
                            else
                              clock,
                            if (showRelative) ...[
                              SizedBox(height: density.mix(1, 3)),
                              Text(
                                relative,
                                textAlign: TextAlign.right,
                                style: TextStyle(
                                  color: colors.muted,
                                  fontSize: density.mix(10, 12),
                                ),
                              ),
                            ],
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
    );
  }
}

class _PrayerTrail extends SingleChildRenderObjectWidget {
  _PrayerTrail({
    required this.stops,
    required this.colors,
    required double spacing,
  }) : super(
         child: Column(
           crossAxisAlignment: CrossAxisAlignment.stretch,
           spacing: spacing,
           children: stops,
         ),
       );

  final List<_PrayerStop> stops;
  final VaktijaPalette colors;

  @override
  _PrayerTrailBox createRenderObject(BuildContext context) =>
      _PrayerTrailBox(stops, colors);

  @override
  void updateRenderObject(BuildContext context, _PrayerTrailBox renderObject) {
    renderObject
      ..stops = stops
      ..colors = colors
      ..markNeedsPaint();
  }
}

class _PrayerTrailBox extends RenderProxyBox {
  _PrayerTrailBox(this.stops, this.colors);

  List<_PrayerStop> stops;
  VaktijaPalette colors;

  @override
  void paint(PaintingContext context, Offset offset) {
    if (stops.isNotEmpty) {
      _paintTrail(context.canvas, offset);
    }
    super.paint(context, offset);
  }

  void _paintTrail(Canvas canvas, Offset offset) {
    final column = child! as RenderFlex;
    final x = offset.dx + _trailX;
    final centers = [
      for (
        var row = column.firstChild;
        row != null;
        row = column.childAfter(row)
      )
        offset.dy +
            (row.parentData! as FlexParentData).offset.dy +
            row.size.height / 2,
    ];
    final track = Paint()
      ..color = colors.track
      ..strokeWidth = 2;
    final gold = Paint()
      ..color = colors.trailGold
      ..strokeWidth = 2;
    // Start the dash pattern once and continue it across row boundaries.
    for (var y = centers.first; y < centers.last; y += 7) {
      canvas.drawLine(
        Offset(x, y),
        Offset(x, (y + 3).clamp(y, centers.last)),
        track,
      );
    }
    for (var index = 0; index < centers.length - 1; index++) {
      final progress = stops[index].progress;
      if (progress == 0) continue;
      final start = centers[index];
      final end = centers[index + 1];
      canvas.drawLine(
        Offset(x, start),
        Offset(x, start + (end - start) * progress),
        gold,
      );
    }

    final connector = Paint()..color = colors.border;
    for (final (index, y) in centers.indexed) {
      final center = Offset(x, y);
      canvas.drawLine(center, Offset(offset.dx + _trailGutter, y), connector);
      _paintMarker(canvas, center, stops[index], track, gold);
    }
  }

  void _paintMarker(
    Canvas canvas,
    Offset center,
    _PrayerStop stop,
    Paint track,
    Paint gold,
  ) {
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
}
