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
    required this.leaving,
    required this.onFinished,
    this.onRetry,
  });

  final GlobalKey headerLogo;
  final bool leaving;
  final VoidCallback onFinished;
  final VoidCallback? onRetry;

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView> with TickerProviderStateMixin {
  static const _introMilliseconds = 1600;
  static const _markSize = Size(136, 111);
  static const _archSize = Size(176, 190);
  static const _emblem = Alignment(0, -.28);

  late final _intro =
      AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: _introMilliseconds),
      )..addStatusListener((status) {
        if (status == AnimationStatus.completed) _maybeFly();
      });
  late final _ambient = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 8),
  );
  late final _flight =
      AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 300),
      )..addStatusListener((status) {
        if (status == AnimationStatus.completed) widget.onFinished();
      });
  bool _started = false;
  bool _flying = false;
  Rect? _destination;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_started) return;
    _started = true;
    if (MediaQuery.disableAnimationsOf(context)) {
      _intro.value = 1;
    } else {
      _intro.forward();
      _ambient.repeat();
    }
  }

  @override
  void didUpdateWidget(SplashView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.leaving && !oldWidget.leaving) _maybeFly();
  }

  void _maybeFly() {
    if (_flying || !widget.leaving || !_intro.isCompleted) return;
    _flying = true;
    _captureAndFly();
  }

  void _captureAndFly([int tries = 0]) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (MediaQuery.disableAnimationsOf(context)) {
        widget.onFinished();
        return;
      }

      final logo = widget.headerLogo.currentContext?.findRenderObject();
      final splash = context.findRenderObject();
      if (logo is RenderBox &&
          splash is RenderBox &&
          logo.hasSize &&
          splash.hasSize) {
        setState(() {
          _destination =
              splash.globalToLocal(logo.localToGlobal(Offset.zero)) & logo.size;
        });
        _flight.forward();
      } else if (tries < 8) {
        _captureAndFly(tries + 1);
      } else {
        _flight.forward();
      }
    });
  }

  @override
  void dispose() {
    _intro.dispose();
    _ambient.dispose();
    _flight.dispose();
    super.dispose();
  }

  double _segment(double from, double to, [Curve curve = Curves.easeOutCubic]) {
    final ms = _intro.value * _introMilliseconds;
    return curve.transform(((ms - from) / (to - from)).clamp(0.0, 1.0));
  }

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final systemStyle = colors.dark
        ? SystemUiOverlayStyle.light
        : SystemUiOverlayStyle.dark;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: systemStyle.copyWith(
        statusBarColor: Colors.transparent,
        systemNavigationBarColor: const Color(0xff041e1b),
        systemNavigationBarIconBrightness: Brightness.light,
        systemNavigationBarContrastEnforced: false,
      ),
      child: Material(
        type: MaterialType.transparency,
        child: LayoutBuilder(
          builder: (context, limits) {
            return AnimatedBuilder(
              animation: Listenable.merge([_intro, _ambient, _flight]),
              child: _Backdrop(colors: colors, size: limits.biggest),
              builder: (context, backdrop) {
                final progress = Curves.easeInOutCubic.transform(_flight.value);
                final scene = _segment(0, 500);
                final settle = _segment(0, 1200, Curves.easeOutCubic);
                final markIn = _segment(100, 600);
                final origin = _emblem.inscribe(
                  _markSize,
                  Offset.zero & limits.biggest,
                );
                final markRect = Rect.fromCenter(
                  center: origin.center.translate(0, 12 * (1 - markIn)),
                  width: _markSize.width * (.94 + .06 * markIn),
                  height: _markSize.height * (.94 + .06 * markIn),
                );
                return Stack(
                  fit: StackFit.expand,
                  children: [
                    Opacity(
                      opacity: 1 - progress,
                      child: ColoredBox(
                        color: colors.surface,
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            Opacity(
                              opacity: scene,
                              child: Transform.scale(
                                scale: 1.04 - .04 * settle,
                                child: backdrop,
                              ),
                            ),
                            if (colors.dark)
                              CustomPaint(
                                painter: _ShootingStar(
                                  progress: _shootingProgress(),
                                ),
                              ),
                            Align(
                              alignment: _emblem,
                              child: CustomPaint(
                                size: _archSize,
                                painter: _Arch(
                                  colors.gold,
                                  progress: _segment(
                                    100,
                                    800,
                                    Curves.easeInOutCubic,
                                  ),
                                  glint: math.sin(
                                    math.pi * _segment(0, 250, Curves.linear),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    Positioned.fromRect(
                      rect: Rect.lerp(
                        markRect,
                        _destination ?? markRect,
                        progress,
                      )!,
                      child: Opacity(
                        opacity:
                            markIn * (_destination == null ? 1 - progress : 1),
                        child: ClipRect(
                          clipper: const _MarkClipper(),
                          child: Image.asset(
                            'assets/branding/logo.png',
                            fit: BoxFit.contain,
                            color: colors.text,
                            semanticLabel: 'Vaktija',
                          ),
                        ),
                      ),
                    ),
                    if (widget.onRetry case final retry?)
                      SafeArea(
                        minimum: const EdgeInsets.only(bottom: 32),
                        child: Align(
                          alignment: Alignment.bottomCenter,
                          child: FilledButton(
                            onPressed: retry,
                            child: const Text('Try again'),
                          ),
                        ),
                      ),
                  ],
                );
              },
            );
          },
        ),
      ),
    );
  }

  /// One streak during the intro, then a quieter occasional one while waiting.
  double _shootingProgress() {
    final intro = _segment(700, 1200, Curves.linear);
    if (intro > 0 && intro < 1) return intro;
    if (!_intro.isCompleted) return 0;
    final loop = (_ambient.value * 2) % 1;
    return loop < .18 ? Curves.easeInOut.transform(loop / .18) : 0;
  }
}

class _MarkClipper extends CustomClipper<Rect> {
  const _MarkClipper();

  // Keep the texture edge outside the painted area of the padded PNG.
  @override
  Rect getClip(Size size) => (Offset.zero & size).deflate(size.height * .1);

  @override
  bool shouldReclip(_MarkClipper oldClipper) => false;
}

class _Backdrop extends StatelessWidget {
  const _Backdrop({required this.colors, required this.size});

  final VaktijaPalette colors;
  final Size size;

  @override
  Widget build(BuildContext context) {
    final theme = colors.dark ? 'dark' : 'light';
    if (size.width <= size.height) {
      return Image.asset(
        'assets/branding/splash-mosque-$theme.webp',
        fit: BoxFit.cover,
        excludeFromSemantics: true,
      );
    }

    return DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            colors.surface,
            colors.dark ? const Color(0xff02231f) : const Color(0xfff9f6ec),
          ],
        ),
      ),
      child: Align(
        alignment: Alignment.bottomCenter,
        child: SizedBox(
          width: double.infinity,
          height: math.min(size.width / 3, size.height * .6),
          child: ShaderMask(
            blendMode: BlendMode.dstIn,
            shaderCallback: (bounds) => const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Colors.transparent, Colors.white],
              stops: [0, .38],
            ).createShader(bounds),
            child: Image.asset(
              '$prayerAssets/mosque-horizon-$theme.webp',
              fit: BoxFit.cover,
              alignment: Alignment.bottomCenter,
              excludeFromSemantics: true,
            ),
          ),
        ),
      ),
    );
  }
}

class _ShootingStar extends CustomPainter {
  _ShootingStar({required this.progress});

  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    if (progress <= 0 || progress >= 1) return;
    final start = Offset(size.width * .15, size.height * .12);
    final end = Offset(size.width * .72, size.height * .38);
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
      progress != oldDelegate.progress;
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
