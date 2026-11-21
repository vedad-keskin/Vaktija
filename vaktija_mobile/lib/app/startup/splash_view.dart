import 'dart:math' as math;

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

class _SplashViewState extends State<SplashView>
    with SingleTickerProviderStateMixin {
  static const _holdMilliseconds = 1200;
  static const _moveMilliseconds = 300;
  static const _splashMilliseconds = _holdMilliseconds + _moveMilliseconds;

  late final _handoff =
      AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: _splashMilliseconds),
      )..addStatusListener((status) {
        if (status == AnimationStatus.completed) widget.onFinished();
      });
  Rect? _destination;

  @override
  void initState() {
    super.initState();
    if (widget.leaving) _beginHandoff();
  }

  @override
  void didUpdateWidget(SplashView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.leaving && !oldWidget.leaving) _beginHandoff();
  }

  void _beginHandoff() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (MediaQuery.disableAnimationsOf(context)) {
        widget.onFinished();
        return;
      }

      final logo = widget.headerLogo.currentContext?.findRenderObject();
      final splash = context.findRenderObject();
      if (logo is RenderBox && splash is RenderBox) {
        _destination =
            splash.globalToLocal(logo.localToGlobal(Offset.zero)) & logo.size;
      }
      _handoff.forward();
    });
  }

  @override
  void dispose() {
    _handoff.dispose();
    super.dispose();
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
            final origin = Alignment.center.inscribe(
              const Size(136, 111),
              Offset.zero & limits.biggest,
            );
            return AnimatedBuilder(
              animation: _handoff,
              child: ColoredBox(
                color: colors.surface,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Align(
                      alignment: Alignment.bottomCenter,
                      child: SizedBox(
                        width: double.infinity,
                        height: math.min(
                          limits.maxWidth * .75,
                          limits.maxHeight * .53,
                        ),
                        child: _Horizon(colors: colors),
                      ),
                    ),
                    Center(
                      child: CustomPaint(
                        size: const Size(176, 190),
                        painter: _Arch(colors.gold),
                      ),
                    ),
                  ],
                ),
              ),
              builder: (context, backdrop) {
                final progress = const Interval(
                  _holdMilliseconds / _splashMilliseconds,
                  1,
                  curve: Curves.easeInOutCubic,
                ).transform(_handoff.value);
                return Stack(
                  fit: StackFit.expand,
                  children: [
                    Opacity(opacity: 1 - progress, child: backdrop),
                    Positioned.fromRect(
                      rect: Rect.lerp(
                        origin,
                        _destination ?? origin,
                        progress,
                      )!,
                      child: Opacity(
                        opacity: _destination == null ? 1 - progress : 1,
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
}

class _MarkClipper extends CustomClipper<Rect> {
  const _MarkClipper();

  // Keep the texture edge outside the painted area of the padded PNG.
  @override
  Rect getClip(Size size) => (Offset.zero & size).deflate(size.height * .1);

  @override
  bool shouldReclip(_MarkClipper oldClipper) => false;
}

class _Horizon extends StatelessWidget {
  const _Horizon({required this.colors});

  final VaktijaPalette colors;

  @override
  Widget build(BuildContext context) {
    final theme = colors.dark ? 'dark' : 'light';
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(
          '$prayerAssets/mosque-horizon-mobile-$theme.webp',
          fit: BoxFit.cover,
          alignment: Alignment.bottomCenter,
          excludeFromSemantics: true,
        ),
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [colors.surface, colors.surface.withValues(alpha: 0)],
              stops: const [0.04, 0.48],
            ),
          ),
        ),
      ],
    );
  }
}

class _Arch extends CustomPainter {
  const _Arch(this.color);

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Size(:width, :height) = size;
    final path = Path()
      ..moveTo(1, height * .91)
      ..lineTo(1, height * .49)
      ..cubicTo(1, height * .21, width * .42, height * .17, width / 2, 1)
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
    canvas.drawPath(path, stroke);
  }

  @override
  bool shouldRepaint(_Arch oldDelegate) => color != oldDelegate.color;
}
