import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../app/vaktija_palette.dart';

class QiblaDial extends StatelessWidget {
  const QiblaDial({
    super.key,
    required this.bearing,
    required this.heading,
    required this.aligned,
    required this.label,
  });

  final double? bearing;
  final double? heading;
  final bool aligned;
  final String label;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final radians = -(heading ?? 0) * math.pi / 180;
    final rim = aligned ? colors.accent : colors.heroGold;
    return Semantics(
      image: true,
      label: label,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final dialSize = math.min(constraints.maxWidth, 300.0);
          return SizedBox(
            width: dialSize,
            height: dialSize + 7,
            child: Stack(
              children: [
                Align(
                  alignment: Alignment.topCenter,
                  child: CustomPaint(
                    size: Size(aligned ? 18 : 12, 10),
                    painter: _Apex(rim),
                  ),
                ),
                Positioned.fill(
                  top: 7,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: colors.sky,
                      shape: BoxShape.circle,
                      border: Border.all(color: rim, width: aligned ? 3 : 1),
                      boxShadow: [
                        BoxShadow(
                          color: aligned
                              ? colors.accent.withValues(alpha: .26)
                              : Colors.black.withValues(alpha: .14),
                          blurRadius: 24,
                          offset: aligned ? Offset.zero : const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(4),
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          Transform.rotate(
                            angle: radians,
                            child: RepaintBoundary(
                              child: CustomPaint(
                                painter: _Face(
                                  colors.heroGold,
                                  colors.heroText,
                                ),
                              ),
                            ),
                          ),
                          RepaintBoundary(
                            child: CustomPaint(
                              painter: _Needle(
                                bearing == null
                                    ? null
                                    : bearing! * math.pi / 180 + radians,
                                rim,
                                colors.sky,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _Apex extends CustomPainter {
  const _Apex(this.color);

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final tip = Path()
      ..moveTo(size.width / 2, 0)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();
    canvas.drawPath(tip, Paint()..color = color);
  }

  @override
  bool shouldRepaint(_Apex old) => old.color != color;
}

class _Face extends CustomPainter {
  const _Face(this.gold, this.text);

  final Color gold;
  final Color text;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.scale(size.width / 200);
    const center = Offset(100, 100);
    final line = Paint()..style = PaintingStyle.stroke;
    void stroke(double width, double opacity) {
      line.strokeWidth = width;
      line.color = gold.withValues(alpha: opacity);
    }

    stroke(.5, .55);
    canvas.drawCircle(center, 97, line);
    stroke(.4, .15);
    canvas.drawCircle(center, 88, line);
    for (var i = 0; i < 72; i++) {
      final angle = i * math.pi / 36;
      final major = i % 18 == 0;
      final medium = i % 6 == 0;
      final along = Offset(math.sin(angle), -math.cos(angle));
      stroke(
        major
            ? 1.2
            : medium
            ? .8
            : .6,
        major
            ? 1
            : medium
            ? .8
            : .65,
      );
      canvas.drawLine(
        center + along * 89,
        center +
            along *
                (major
                    ? 79
                    : medium
                    ? 81
                    : 85),
        line,
      );
    }
    stroke(.4, .35);
    for (var i = 0; i < 120; i++) {
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: 48),
        i * math.pi / 60,
        .02,
        false,
        line,
      );
    }
    final rose = Path()
      ..addPolygon(const [
        Offset(100, 52),
        Offset(108, 80),
        Offset(134, 66),
        Offset(120, 92),
        Offset(148, 100),
        Offset(120, 108),
        Offset(134, 134),
        Offset(108, 120),
        Offset(100, 148),
        Offset(92, 120),
        Offset(66, 134),
        Offset(80, 108),
        Offset(52, 100),
        Offset(80, 92),
        Offset(66, 66),
        Offset(92, 80),
      ], true);
    canvas.drawPath(rose, Paint()..color = gold.withValues(alpha: .025));
    stroke(.5, .35);
    canvas.drawPath(rose, line);
    stroke(.4, .15);
    canvas.drawLine(const Offset(100, 52), const Offset(100, 148), line);
    canvas.drawLine(const Offset(52, 100), const Offset(148, 100), line);
    canvas.drawLine(const Offset(66, 66), const Offset(134, 134), line);
    canvas.drawLine(const Offset(66, 134), const Offset(134, 66), line);
    const positions = [
      Offset(100, 32),
      Offset(168, 100),
      Offset(100, 168),
      Offset(32, 100),
    ];
    for (var i = 0; i < positions.length; i++) {
      final label = TextPainter(
        text: TextSpan(
          text: 'NESW'[i],
          style: TextStyle(
            fontFamily: 'Vaktija Sans',
            fontSize: 9,
            fontWeight: FontWeight.w700,
            color: i == 0 ? gold : text,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      label.paint(
        canvas,
        positions[i] - Offset(label.width / 2, label.height / 2),
      );
      label.dispose();
    }
  }

  @override
  bool shouldRepaint(_Face old) => old.gold != gold || old.text != text;
}

class _Needle extends CustomPainter {
  const _Needle(this.angle, this.color, this.sky);

  final double? angle;
  final Color color;
  final Color sky;

  @override
  void paint(Canvas canvas, Size size) {
    canvas
      ..translate(size.width / 2, size.height / 2)
      ..scale(size.width / 200);
    final paint = Paint()..color = color;
    final direction = angle;
    if (direction != null) {
      canvas
        ..save()
        ..rotate(direction);
      final light = Path()
        ..addPolygon(const [Offset(0, -68), Offset(8, -22), Offset.zero], true);
      final shade = Path()
        ..addPolygon(const [
          Offset(0, -68),
          Offset(-8, -22),
          Offset.zero,
        ], true);
      canvas.drawPath(light, paint);
      canvas.drawPath(shade, paint..color = Color.lerp(sky, color, .60)!);
      canvas
        ..translate(0, -66)
        ..rotate(-direction);
      canvas.drawCircle(Offset.zero, 13.5, paint..color = sky);
      canvas.drawCircle(Offset.zero, 12.4, paint..color = color);
      final cube = Path()
        ..addPolygon(const [
          Offset(-5.4, -3),
          Offset(0, -5.4),
          Offset(5.4, -3),
          Offset(5.4, 5),
          Offset(0, 7),
          Offset(-5.4, 5),
        ], true);
      canvas.drawPath(cube, paint..color = sky);
      final bands = Path()
        ..moveTo(-5.4, -3)
        ..lineTo(0, -.5)
        ..lineTo(5.4, -3)
        ..moveTo(-5.4, -1)
        ..lineTo(0, 1.5)
        ..lineTo(5.4, -1)
        ..moveTo(0, -.5)
        ..lineTo(0, 7);
      canvas.drawPath(
        bands,
        paint
          ..color = color
          ..style = PaintingStyle.stroke
          ..strokeWidth = .75,
      );
      canvas.restore();
    }
    canvas.drawCircle(
      Offset.zero,
      6,
      paint
        ..color = color
        ..style = PaintingStyle.fill,
    );
    canvas.drawCircle(Offset.zero, 4.1, paint..color = sky);
  }

  @override
  bool shouldRepaint(_Needle old) =>
      old.angle != angle || old.color != color || old.sky != sky;
}
