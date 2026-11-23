import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../app/vaktija_palette.dart';

const _guideSize = Size(220, 122);
final _figureEight = Path()
  ..moveTo(110, 61)
  ..cubicTo(136, 36, 159, 16, 183, 29)
  ..cubicTo(208, 42, 208, 78, 183, 91)
  ..cubicTo(159, 104, 136, 86, 110, 61)
  ..cubicTo(84, 36, 61, 16, 37, 29)
  ..cubicTo(12, 42, 12, 78, 37, 91)
  ..cubicTo(61, 104, 84, 86, 110, 61);
final _loop = _figureEight.computeMetrics().single;

class QiblaCalibrationGuide extends StatefulWidget {
  const QiblaCalibrationGuide({super.key});

  @override
  State<QiblaCalibrationGuide> createState() => _QiblaCalibrationGuideState();
}

class _QiblaCalibrationGuideState extends State<QiblaCalibrationGuide>
    with SingleTickerProviderStateMixin {
  late final _motion = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 4),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _motion.stop();
    } else {
      _motion.repeat();
    }
  }

  @override
  void dispose() {
    _motion.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    return ExcludeSemantics(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 252),
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: colors.selected.withValues(alpha: .65),
            border: Border.all(color: colors.heroGold.withValues(alpha: .26)),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            child: AspectRatio(
              aspectRatio: _guideSize.aspectRatio,
              child: RepaintBoundary(
                child: CustomPaint(
                  painter: _CalibrationGuidePainter(
                    colors.heroGold,
                    colors.sky,
                    _motion,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CalibrationGuidePainter extends CustomPainter {
  _CalibrationGuidePainter(this.gold, this.sky, this.motion)
    : super(repaint: motion);

  final Color gold;
  final Color sky;
  final Animation<double> motion;

  static final Path _dashes = () {
    final path = Path();
    for (var start = 0.0; start < _loop.length; start += 8) {
      path.addPath(_loop.extractPath(start, start + 3), Offset.zero);
    }
    return path;
  }();

  @override
  void paint(Canvas canvas, Size size) {
    canvas.scale(
      size.width / _guideSize.width,
      size.height / _guideSize.height,
    );
    final track = Paint()
      ..color = gold.withValues(alpha: .54)
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 1.5;
    canvas.drawPath(_dashes, track);

    final distance = ((motion.value + .14) % 1) * _loop.length;
    final tail = distance - 32;
    track
      ..color = gold
      ..strokeWidth = 2;
    if (tail < 0) {
      canvas.drawPath(
        _loop.extractPath(_loop.length + tail, _loop.length),
        track,
      );
    }
    canvas.drawPath(_loop.extractPath(math.max(0, tail), distance), track);

    final tangent = _loop.getTangentForOffset(distance)!;
    canvas
      ..translate(tangent.position.dx, tangent.position.dy)
      ..rotate(tangent.vector.dx * .42);
    _paintPhone(canvas, gold, sky);
  }

  @override
  bool shouldRepaint(_CalibrationGuidePainter old) =>
      old.gold != gold || old.sky != sky || old.motion != motion;
}

enum QiblaGuidanceCue {
  calibration,
  level,
  waiting,
  left,
  right,
  aligned,
  noSignal,
  north,
  noDirection,
}

const _cueSize = Size(42, 49);

class QiblaGuidanceIcon extends StatelessWidget {
  const QiblaGuidanceIcon({
    super.key,
    required this.cue,
    required this.duration,
  });

  final QiblaGuidanceCue cue;
  final Duration duration;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    return ExcludeSemantics(
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: colors.selected,
          borderRadius: BorderRadius.circular(11),
        ),
        child: SizedBox.fromSize(
          size: _cueSize,
          child: AnimatedSwitcher(
            duration: duration,
            child: KeyedSubtree(
              key: ValueKey(cue),
              child: switch (cue) {
                QiblaGuidanceCue.level => const _PhoneLevelGuide(),
                QiblaGuidanceCue.calibration => CustomPaint(
                  size: _cueSize,
                  painter: _CalibrationIconPainter(colors.heroGold, colors.sky),
                ),
                _ => CustomPaint(
                  size: _cueSize,
                  painter: _GuidanceCuePainter(cue, colors),
                ),
              },
            ),
          ),
        ),
      ),
    );
  }
}

class _PhoneLevelGuide extends StatefulWidget {
  const _PhoneLevelGuide();

  @override
  State<_PhoneLevelGuide> createState() => _PhoneLevelGuideState();
}

class _PhoneLevelGuideState extends State<_PhoneLevelGuide>
    with SingleTickerProviderStateMixin {
  late final _motion = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1250),
    value: 1,
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _motion.value = 1;
    } else if (!_motion.isAnimating) {
      _motion.value = 0;
      _motion.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _motion.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    return RepaintBoundary(
      child: CustomPaint(
        size: _cueSize,
        painter: _PhoneLevelPainter(colors, _motion),
      ),
    );
  }
}

class _PhoneLevelPainter extends CustomPainter {
  _PhoneLevelPainter(this.colors, this.motion) : super(repaint: motion);

  final VaktijaPalette colors;
  final Animation<double> motion;

  @override
  void paint(Canvas canvas, Size size) {
    final base = Paint()
      ..color = colors.heroGold.withValues(alpha: .55)
      ..strokeWidth = 1.1
      ..strokeCap = StrokeCap.round;
    final baseline = size.height - 11;
    for (var x = 6.0; x < size.width - 6; x += 5) {
      canvas.drawLine(Offset(x, baseline), Offset(x + 2, baseline), base);
    }

    void pose(double angle, Color outline, Color screen) {
      canvas
        ..save()
        ..translate(size.width - 6, baseline - 7)
        ..rotate(angle)
        ..translate(-13, 0)
        ..skew(-.26, 0)
        ..rotate(math.pi / 2)
        ..scale(.43 + angle * .30, .73);
      _paintPhone(canvas, outline, screen);
      canvas.restore();
    }

    const raised = .63;
    pose(raised, base.color, colors.selected);
    final level = const Interval(
      .12,
      .88,
      curve: Curves.easeInOut,
    ).transform(motion.value);
    pose(raised - .55 * level, colors.heroGold, colors.sky);
    canvas.drawPath(
      Path()
        ..moveTo(6, 17)
        ..quadraticBezierTo(3, 23, 6, 29)
        ..moveTo(3, 27)
        ..lineTo(6, 29)
        ..lineTo(8, 26),
      base
        ..color = colors.heroGold
        ..style = PaintingStyle.stroke
        ..strokeJoin = StrokeJoin.round,
    );
  }

  @override
  bool shouldRepaint(_PhoneLevelPainter old) =>
      old.colors.dark != colors.dark || old.motion != motion;
}

class _GuidanceCuePainter extends CustomPainter {
  const _GuidanceCuePainter(this.cue, this.colors);

  final QiblaGuidanceCue cue;
  final VaktijaPalette colors;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.translate(size.width / 2, size.height / 2);
    final ink = Paint()
      ..color = cue == QiblaGuidanceCue.aligned
          ? colors.accent
          : colors.heroGold
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    switch (cue) {
      case QiblaGuidanceCue.waiting:
        _phone(canvas, flat: true);
        for (final radius in [6.0, 10.0]) {
          canvas.drawArc(
            Rect.fromCircle(center: const Offset(0, -3), radius: radius),
            -math.pi * .76,
            math.pi * .52,
            false,
            ink,
          );
        }
      case QiblaGuidanceCue.left || QiblaGuidanceCue.right:
        _phone(canvas);
        if (cue == QiblaGuidanceCue.left) canvas.scale(-1, 1);
        canvas.drawPath(
          Path()
            ..moveTo(-12, -8)
            ..quadraticBezierTo(1, -20, 14, -5)
            ..moveTo(14, -11)
            ..lineTo(14, -5)
            ..lineTo(8, -6),
          ink,
        );
      case QiblaGuidanceCue.aligned:
        _phone(canvas, outline: ink.color);
        canvas.drawLine(const Offset(0, -7), const Offset(0, -12), ink);
        canvas.drawCircle(const Offset(0, -16), 2.5, ink);
      case QiblaGuidanceCue.north:
        canvas.drawCircle(Offset.zero, 14, ink);
        canvas.drawLine(const Offset(0, -17), const Offset(0, -12), ink);
        canvas.drawPath(
          Path()
            ..moveTo(-3.5, 5)
            ..lineTo(-3.5, -5)
            ..lineTo(3.5, 5)
            ..lineTo(3.5, -5),
          ink,
        );
      case QiblaGuidanceCue.noSignal:
        canvas.drawArc(
          Rect.fromCircle(center: Offset.zero, radius: 14),
          .28,
          2 * math.pi - .56,
          false,
          ink,
        );
        canvas.drawLine(const Offset(-4, 0), const Offset(4, 0), ink);
      case QiblaGuidanceCue.noDirection:
        canvas.drawCircle(Offset.zero, 14, ink);
      case QiblaGuidanceCue.calibration || QiblaGuidanceCue.level:
        break;
    }
  }

  void _phone(Canvas canvas, {bool flat = false, Color? outline}) {
    canvas
      ..save()
      ..translate(0, 7)
      ..rotate(flat ? math.pi / 2 : 0)
      ..scale(.58);
    _paintPhone(canvas, outline ?? colors.heroGold, colors.sky);
    canvas.restore();
  }

  @override
  bool shouldRepaint(_GuidanceCuePainter old) =>
      old.cue != cue || old.colors.dark != colors.dark;
}

class _CalibrationIconPainter extends CustomPainter {
  const _CalibrationIconPainter(this.gold, this.sky);

  final Color gold;
  final Color sky;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas
      ..translate(size.width / 2, 15)
      ..rotate(.14)
      ..scale(.53);
    _paintPhone(canvas, gold, sky);
    canvas.restore();
    canvas
      ..translate(size.width / 2 - 17.6, 24)
      ..scale(.16);
    canvas.drawPath(
      _figureEight,
      Paint()
        ..color = gold
        ..strokeWidth = 9
        ..strokeCap = StrokeCap.round
        ..style = PaintingStyle.stroke,
    );
  }

  @override
  bool shouldRepaint(_CalibrationIconPainter old) =>
      old.gold != gold || old.sky != sky;
}

void _paintPhone(Canvas canvas, Color gold, Color sky) {
  final shell = RRect.fromRectAndRadius(
    Rect.fromCenter(center: Offset.zero, width: 22, height: 36),
    const Radius.circular(5),
  );
  final paint = Paint()..color = gold;
  canvas.drawRRect(shell, paint);
  canvas.drawRRect(shell.deflate(2), paint..color = sky);
  canvas.drawRRect(
    RRect.fromRectAndRadius(
      const Rect.fromLTWH(-3.5, -12.5, 7, 1.5),
      const Radius.circular(.75),
    ),
    paint..color = gold,
  );
  canvas.drawRRect(
    RRect.fromRectAndRadius(
      const Rect.fromLTWH(-3.5, 12, 7, 1.5),
      const Radius.circular(.75),
    ),
    paint,
  );
}
