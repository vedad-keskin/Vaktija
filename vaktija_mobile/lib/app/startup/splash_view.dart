import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../features/prayer_times/timetable.dart';
import '../vaktija_palette.dart';

class SplashView extends StatefulWidget {
  const SplashView({
    super.key,
    required this.headerLogo,
    required this.onFinished,
    this.launchReady,
    this.onOpeningFrameReady,
  });

  final GlobalKey headerLogo;
  final VoidCallback onFinished;
  final Future<void>? launchReady;
  final VoidCallback? onOpeningFrameReady;

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView>
    with SingleTickerProviderStateMixin {
  static const _introMilliseconds = 1600;
  static const _totalMilliseconds = 1900;
  static const _night = VaktijaPalette(true);
  static const _mark = AssetImage('assets/branding/logo.png');
  static const _landscape = AssetImage(
    '$prayerAssets/mosque-horizon-dark.webp',
  );
  static const _portrait = AssetImage(
    'assets/branding/splash-night-horizon.webp',
  );
  static const _markSize = Size(136, 111);
  static const _archSize = Size(176, 190);
  static const _emblem = Alignment(0, -.28);

  late final _timeline =
      AnimationController(
          vsync: this,
          duration: const Duration(milliseconds: _totalMilliseconds),
          animationBehavior: AnimationBehavior.preserve,
        )
        ..addListener(_captureDestination)
        ..addStatusListener((status) {
          if (status == AnimationStatus.completed) widget.onFinished();
        });
  bool _prepared = false;
  bool _captured = false;
  Rect? _destination;

  double get _milliseconds =>
      (_timeline.value * _totalMilliseconds * 1000).round() / 1000;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_prepared) return;
    _prepared = true;
    unawaited(_begin());
  }

  Future<void> _begin() async {
    if (widget.onOpeningFrameReady case final ready?) {
      final size = MediaQuery.sizeOf(context);
      await Future.wait([
        precacheImage(_mark, context),
        precacheImage(
          size.width > size.height ? _landscape : _portrait,
          context,
        ),
      ]);
      ready();
      if (!mounted) return;
    }
    await (widget.launchReady ?? WidgetsBinding.instance.endOfFrame);
    if (mounted) _timeline.forward();
  }

  void _captureDestination() {
    if (_captured || _milliseconds < _introMilliseconds) return;
    _captured = true;
    final logo = widget.headerLogo.currentContext?.findRenderObject();
    final splash = context.findRenderObject();
    if (logo is RenderBox &&
        splash is RenderBox &&
        logo.hasSize &&
        splash.hasSize) {
      _destination =
          splash.globalToLocal(logo.localToGlobal(Offset.zero)) & logo.size;
    }
  }

  @override
  void dispose() {
    _timeline.dispose();
    super.dispose();
  }

  double _segment(double from, double to, [Curve curve = Curves.easeOutCubic]) {
    return curve.transform(
      ((_milliseconds - from) / (to - from)).clamp(0.0, 1.0),
    );
  }

  @override
  Widget build(BuildContext context) {
    final home = VaktijaPalette.of(context);
    final reduceMotion = MediaQuery.disableAnimationsOf(context);
    return Material(
      type: MaterialType.transparency,
      child: LayoutBuilder(
        builder: (context, limits) {
          final size = limits.biggest;
          final wide = size.width > size.height;
          final height = wide
              ? math.min(size.width / 3, size.height * .6)
              : math.min(size.width, size.height * .52);
          return AnimatedBuilder(
            animation: _timeline,
            child: _Backdrop(image: wide ? _landscape : _portrait),
            builder: (context, backdrop) {
              final reveal = _segment(0, 680);
              final move = reduceMotion ? 0.0 : _segment(0, 760);
              final landing = _segment(
                _introMilliseconds.toDouble(),
                _totalMilliseconds.toDouble(),
                Curves.easeInOutCubic,
              );
              final alignment = Alignment.lerp(
                Alignment.center,
                _emblem,
                move,
              )!;
              final origin = alignment.inscribe(_markSize, Offset.zero & size);
              final destination = reduceMotion ? null : _destination;
              final statusStyle = home.dark || landing < .52
                  ? SystemUiOverlayStyle.light
                  : SystemUiOverlayStyle.dark;

              return AnnotatedRegion<SystemUiOverlayStyle>(
                value: statusStyle.copyWith(
                  statusBarColor: Colors.transparent,
                  systemNavigationBarColor: _night.surface,
                  systemNavigationBarIconBrightness: Brightness.light,
                  systemNavigationBarContrastEnforced: false,
                ),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    ClipRect(
                      child: Opacity(
                        opacity: 1 - landing,
                        child: ColoredBox(
                          color: _night.surface,
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              CustomPaint(
                                painter: _Stars(
                                  color: _night.text,
                                  opacity: _segment(120, 850),
                                  time: reduceMotion ? 0 : _timeline.value,
                                ),
                              ),
                              if (!reduceMotion)
                                CustomPaint(
                                  painter: _ShootingStar(
                                    progress: _segment(
                                      700,
                                      1200,
                                      Curves.linear,
                                    ),
                                    archTop: alignment
                                        .inscribe(_archSize, Offset.zero & size)
                                        .top,
                                  ),
                                ),
                              Align(
                                alignment: Alignment.bottomCenter,
                                child: SizedBox(
                                  width: double.infinity,
                                  height: height,
                                  child: Opacity(
                                    opacity: reveal,
                                    child: Transform.translate(
                                      offset: Offset(
                                        0,
                                        reduceMotion
                                            ? 0
                                            : height * .27 * (1 - move),
                                      ),
                                      child: backdrop,
                                    ),
                                  ),
                                ),
                              ),
                              Align(
                                alignment: alignment,
                                child: Opacity(
                                  opacity: reduceMotion ? reveal : 1,
                                  child: CustomPaint(
                                    size: _archSize,
                                    painter: _Arch(
                                      _night.gold,
                                      progress: reduceMotion
                                          ? 1
                                          : _segment(
                                              110,
                                              830,
                                              Curves.easeInOutCubic,
                                            ),
                                      glint: reduceMotion
                                          ? 0
                                          : math.sin(
                                              math.pi *
                                                  _segment(
                                                    100,
                                                    430,
                                                    Curves.linear,
                                                  ),
                                            ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Positioned.fromRect(
                      rect: Rect.lerp(origin, destination ?? origin, landing)!,
                      child: Opacity(
                        opacity: destination == null ? 1 - landing : 1,
                        child: ClipRect(
                          clipper: const _MarkClipper(),
                          child: Image(
                            image: _mark,
                            fit: BoxFit.contain,
                            color: _night.text.withValues(
                              alpha: home.dark ? 1 : 1 - landing,
                            ),
                            colorBlendMode: BlendMode.srcATop,
                            semanticLabel: 'Vaktija',
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class _MarkClipper extends CustomClipper<Rect> {
  const _MarkClipper();

  // Keep the padded texture edges out of the splash.
  @override
  Rect getClip(Size size) => (Offset.zero & size).deflate(size.height * .1);

  @override
  bool shouldReclip(_MarkClipper oldClipper) => false;
}

class _Backdrop extends StatelessWidget {
  const _Backdrop({required this.image});

  final AssetImage image;

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      blendMode: BlendMode.dstIn,
      shaderCallback: (bounds) => const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Colors.transparent, Colors.white],
        stops: [0, .34],
      ).createShader(bounds),
      child: Image(
        image: image,
        fit: BoxFit.cover,
        alignment: Alignment.bottomCenter,
        excludeFromSemantics: true,
      ),
    );
  }
}

class _Stars extends CustomPainter {
  _Stars({required this.color, required this.opacity, required this.time});

  static final _points = () {
    final random = math.Random(7);
    return [
      for (var i = 0; i < 82; i++)
        (
          x: random.nextDouble(),
          y: random.nextDouble() * .78,
          radius: .5 + random.nextDouble() * 1.25,
          phase: random.nextDouble(),
        ),
    ];
  }();

  final Color color;
  final double opacity;
  final double time;

  @override
  void paint(Canvas canvas, Size size) {
    if (opacity == 0) return;
    final paint = Paint();
    for (final star in _points) {
      final shine = .5 + .5 * math.sin(2 * math.pi * (time * .8 + star.phase));
      paint.color = color.withValues(
        alpha: opacity * (1 - star.y) * (.25 + .65 * shine),
      );
      canvas.drawCircle(
        Offset(star.x * size.width, star.y * size.height),
        star.radius,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(_Stars oldDelegate) =>
      color != oldDelegate.color ||
      opacity != oldDelegate.opacity ||
      time != oldDelegate.time;
}

class _ShootingStar extends CustomPainter {
  _ShootingStar({required this.progress, required this.archTop});

  final double progress;
  final double archTop;

  @override
  void paint(Canvas canvas, Size size) {
    if (progress <= 0 || progress >= 1 || archTop <= 0) return;
    final start = Offset(size.width * .15, archTop * .34);
    final end = Offset(size.width * .72, archTop * .91);
    final head = Offset.lerp(start, end, progress)!;
    final tail = Offset.lerp(start, end, (progress - .18).clamp(0.0, 1.0))!;
    final fade = math.sin(math.pi * progress);
    canvas.drawLine(
      tail,
      head,
      Paint()
        ..shader = ui.Gradient.linear(tail, head, [
          Colors.white.withValues(alpha: 0),
          Colors.white.withValues(alpha: .7 * fade),
        ])
        ..strokeWidth = 1.6
        ..strokeCap = StrokeCap.round,
    );
  }

  @override
  bool shouldRepaint(_ShootingStar oldDelegate) =>
      progress != oldDelegate.progress || archTop != oldDelegate.archTop;
}

class _Arch extends CustomPainter {
  const _Arch(this.color, {required this.progress, required this.glint});

  final Color color;
  final double progress;
  final double glint;

  @override
  void paint(Canvas canvas, Size size) {
    final Size(:width, :height) = size;
    // Draw from the apex down both sides so motion is visible immediately.
    final left = Path()
      ..moveTo(width / 2, 1)
      ..cubicTo(width * .42, height * .17, 1, height * .21, 1, height * .49)
      ..lineTo(1, height * .91);
    final right = Path()
      ..moveTo(width / 2, 1)
      ..cubicTo(
        width * .58,
        height * .17,
        width - 1,
        height * .21,
        width - 1,
        height * .49,
      )
      ..lineTo(width - 1, height * .91);
    final stroke = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          color.withValues(alpha: .72),
          color.withValues(alpha: .32),
          color.withValues(alpha: 0),
        ],
      ).createShader(Offset.zero & size);
    for (final side in [left, right]) {
      for (final metric in side.computeMetrics()) {
        canvas.drawPath(
          metric.extractPath(0, metric.length * progress),
          stroke,
        );
      }
    }

    if (glint > 0) {
      final apex = Offset(width / 2, 1);
      canvas.drawCircle(
        apex,
        14,
        Paint()
          ..shader = RadialGradient(
            colors: [
              color.withValues(alpha: .8 * glint),
              color.withValues(alpha: 0),
            ],
          ).createShader(Rect.fromCircle(center: apex, radius: 14)),
      );
    }
  }

  @override
  bool shouldRepaint(_Arch oldDelegate) =>
      color != oldDelegate.color ||
      progress != oldDelegate.progress ||
      glint != oldDelegate.glint;
}
