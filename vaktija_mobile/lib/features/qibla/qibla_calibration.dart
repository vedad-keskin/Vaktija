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

class QiblaCalibrationIcon extends StatelessWidget {
  const QiblaCalibrationIcon({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    return ExcludeSemantics(
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: colors.selected,
          borderRadius: BorderRadius.circular(11),
        ),
        child: CustomPaint(
          size: const Size(42, 49),
          painter: _CalibrationIconPainter(colors.heroGold, colors.sky),
        ),
      ),
    );
  }
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
