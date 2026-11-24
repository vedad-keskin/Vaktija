import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'vaktija_palette.dart';

class CreditsTrigger extends StatefulWidget {
  const CreditsTrigger({
    super.key,
    required this.onHome,
    required this.bosnian,
    required this.enabled,
    required this.child,
  });

  final VoidCallback onHome;
  final bool bosnian, enabled;
  final Widget child;

  @override
  State<CreditsTrigger> createState() => _CreditsTriggerState();
}

class _CreditsTriggerState extends State<CreditsTrigger> {
  LongPressGestureRecognizer? _hold;
  late final AppLifecycleListener _lifecycle;
  bool _open = false;

  @override
  void initState() {
    super.initState();
    _lifecycle = AppLifecycleListener(
      onStateChange: (state) {
        if (state != AppLifecycleState.resumed) {
          final pointer = _hold?.primaryPointer;
          if (pointer != null &&
              _hold?.state == GestureRecognizerState.possible) {
            GestureBinding.instance.cancelPointer(pointer);
          }
        }
      },
    );
  }

  Future<void> _showCredits() async {
    if (_open || !widget.enabled) return;
    _open = true;
    unawaited(HapticFeedback.lightImpact());
    try {
      await showDialog<void>(
        context: context,
        animationStyle: MediaQuery.disableAnimationsOf(context)
            ? AnimationStyle.noAnimation
            : const AnimationStyle(
                duration: Duration(milliseconds: 350),
                curve: Curves.easeOutCubic,
                reverseCurve: Curves.easeInCubic,
              ),
        builder: (_) => CreditsDialog(bosnian: widget.bosnian),
      );
    } finally {
      _open = false;
    }
  }

  @override
  void dispose() {
    _lifecycle.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => RawGestureDetector(
    excludeFromSemantics: true,
    gestures: {
      if (widget.enabled)
        LongPressGestureRecognizer:
            GestureRecognizerFactoryWithHandlers<LongPressGestureRecognizer>(
              () => _hold = LongPressGestureRecognizer(
                duration: const Duration(seconds: 5),
              ),
              (recognizer) => recognizer.onLongPress = _showCredits,
            ),
    },
    child: InkWell(
      onTap: widget.enabled ? widget.onHome : null,
      borderRadius: BorderRadius.circular(8),
      child: widget.child,
    ),
  );
}

class CreditsDialog extends StatefulWidget {
  const CreditsDialog({super.key, required this.bosnian});

  final bool bosnian;

  @override
  State<CreditsDialog> createState() => _CreditsDialogState();
}

const _leadArrival = .50;
const _researchArrival = .78;

class _CreditsDialogState extends State<CreditsDialog>
    with TickerProviderStateMixin {
  final _chart = GlobalKey();
  final _leadName = GlobalKey();
  final _researchName = GlobalKey();
  late final _entrance = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 3200),
  );
  late final _rotation = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 90),
  );
  late final _version = _installedVersion();

  Future<String?> _installedVersion() async {
    try {
      return await const MethodChannel(
        'vaktija/app',
      ).invokeMethod<String>('getVersion');
    } on PlatformException catch (error) {
      debugPrint('Could not read the installed app version: $error');
      return null;
    } on MissingPluginException {
      return null;
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _entrance.value = 1;
      _rotation.stop();
    } else if (_entrance.isDismissed) {
      _entrance.forward();
    }
    if (!MediaQuery.disableAnimationsOf(context) && !_rotation.isAnimating) {
      _rotation.repeat();
    }
  }

  @override
  void dispose() {
    _entrance.dispose();
    _rotation.dispose();
    super.dispose();
  }

  Widget _credit({
    required GlobalKey nameKey,
    required String name,
    required String role,
    required double inset,
    required double arrival,
    required IconData icon,
    double iconSize = 14,
    required VaktijaPalette colors,
  }) {
    final seal = _entrance.drive(
      CurveTween(
        curve: Interval(
          arrival + .04,
          arrival + .20,
          curve: Curves.easeOutCubic,
        ),
      ),
    );
    final glyph = _entrance.drive(
      CurveTween(
        curve: Interval(arrival + .12, arrival + .22, curve: Curves.easeOut),
      ),
    );
    return Padding(
      padding: EdgeInsets.only(left: inset, right: 16),
      child: FadeTransition(
        opacity: _entrance.drive(
          CurveTween(
            curve: Interval(arrival, arrival + .20, curve: Curves.easeOut),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              name,
              key: nameKey,
              style: TextStyle(
                fontFamily: 'Lilita One',
                fontFamilyFallback: const ['Paytone One', 'Vaktija Sans'],
                fontSize: 24,
                height: 1.1,
                letterSpacing: .2,
                color: colors.heroText,
              ),
            ),
            const SizedBox(height: 3),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Flexible(
                  child: Text(
                    role,
                    style: TextStyle(
                      fontFamily: 'Vaktija Sans',
                      fontSize: 12,
                      height: 1.3,
                      color: colors.heroMuted,
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                ExcludeSemantics(
                  child: CustomPaint(
                    painter: _CreditSeal(
                      progress: seal,
                      color: colors.trailGold,
                    ),
                    child: SizedBox(
                      width: 48,
                      height: 26,
                      child: Padding(
                        padding: const EdgeInsets.only(left: 22),
                        child: FadeTransition(
                          opacity: glyph,
                          child: Icon(
                            icon,
                            size: iconSize,
                            color: colors.heroGold,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _imprint(double unit, VaktijaPalette colors) => Padding(
    padding: EdgeInsets.symmetric(horizontal: 26 * unit, vertical: 12),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Image.asset(
          'assets/branding/nightfall-wordmark.png',
          key: const ValueKey('credits-studio'),
          width: 100 * unit,
          color: colors.heroText,
          semanticLabel: 'Nightfall Studio',
        ),
        const SizedBox(width: 12),
        Flexible(
          child: FutureBuilder<String?>(
            future: _version,
            builder: (context, snapshot) => Text(
              snapshot.hasData ? 'v${snapshot.data}' : '',
              key: const ValueKey('app-version'),
              textAlign: TextAlign.end,
              style: TextStyle(
                fontFamily: 'monospace',
                fontSize: 12,
                color: colors.heroMuted,
              ),
            ),
          ),
        ),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final tone = colors.dark ? 'dark' : 'light';
    return Dialog(
      backgroundColor: colors.sky,
      surfaceTintColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      constraints: const BoxConstraints(maxWidth: 360),
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: colors.heroBorder),
      ),
      child: Semantics(
        namesRoute: true,
        label: widget.bosnian ? 'Autori aplikacije' : 'App credits',
        child: LayoutBuilder(
          builder: (context, constraints) {
            final unit = constraints.maxWidth / 360;
            return Stack(
              children: [
                SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      CustomPaint(
                        key: _chart,
                        painter: _CreditsConstellation(
                          timeline: _entrance,
                          rotation: _rotation,
                          root: _chart,
                          lead: _leadName,
                          research: _researchName,
                          colors: colors,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            SizedBox(
                              height: 162 * unit,
                              child: Stack(
                                children: [
                                  Positioned(
                                    left: 145 * unit,
                                    top: 31 * unit,
                                    width: 38 * unit,
                                    height: 38 * unit,
                                    child: Image.asset(
                                      'assets/branding/logo.png',
                                      color: colors.heroText,
                                      excludeFromSemantics: true,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            _credit(
                              nameKey: _leadName,
                              name: 'Vedad Keskin',
                              role: widget.bosnian
                                  ? 'Glavni developer'
                                  : 'Lead Developer',
                              inset: 56 * unit,
                              arrival: _leadArrival,
                              icon: Icons.code_rounded,
                              colors: colors,
                            ),
                            SizedBox(height: 25 * unit),
                            _credit(
                              nameKey: _researchName,
                              name: 'Samija Bešić',
                              role: widget.bosnian
                                  ? 'Istraživanje sadržaja'
                                  : 'Content Research',
                              inset: 107 * unit,
                              arrival: _researchArrival,
                              icon: Icons.menu_book_outlined,
                              iconSize: 12,
                              colors: colors,
                            ),
                            SizedBox(height: 16 * unit),
                          ],
                        ),
                      ),
                      Divider(
                        height: 1,
                        thickness: .7,
                        color: colors.heroGold.withValues(alpha: .45),
                      ),
                      Stack(
                        children: [
                          Positioned.fill(
                            child: Opacity(
                              opacity: .65,
                              child: Image.asset(
                                'assets/prayer_times/mosque-horizon-$tone.webp',
                                fit: BoxFit.cover,
                                alignment: Alignment.bottomCenter,
                                excludeFromSemantics: true,
                              ),
                            ),
                          ),
                          _imprint(unit, colors),
                        ],
                      ),
                    ],
                  ),
                ),
                Positioned(
                  right: 3,
                  top: 3,
                  child: IconButton(
                    key: const ValueKey('credits-close'),
                    tooltip: widget.bosnian ? 'Zatvori' : 'Close',
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.close_rounded, size: 19),
                    style: IconButton.styleFrom(
                      fixedSize: const Size.square(48),
                      foregroundColor: colors.heroText,
                      backgroundColor: colors.sky,
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
}

class _CreditSeal extends CustomPainter {
  _CreditSeal({required this.progress, required this.color})
    : super(repaint: progress);

  final Animation<double> progress;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final time = progress.value;
    final line = Paint()
      ..color = color.withValues(alpha: .65)
      ..style = PaintingStyle.stroke
      ..strokeWidth = .7
      ..strokeCap = StrokeCap.round;
    const center = Offset(35, 13);
    canvas.drawLine(
      const Offset(0, 13),
      Offset(23 * (time / .3).clamp(0.0, 1.0), 13),
      line,
    );
    final sweep = ((time - .3) / .7).clamp(0.0, 1.0);
    for (final angle in [math.pi * .11, math.pi * 1.11]) {
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: 12),
        angle,
        math.pi * .78 * sweep,
        false,
        line,
      );
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: 9.5),
        angle + .18,
        math.pi * .66 * sweep,
        false,
        line,
      );
    }
    line.color = color.withValues(alpha: .5 * sweep);
    for (var i = 0; i < 4; i++) {
      final angle = math.pi / 4 + i * math.pi / 2;
      final direction = Offset(math.cos(angle), math.sin(angle));
      canvas.drawLine(center + direction * 10, center + direction * 12, line);
    }
  }

  @override
  bool shouldRepaint(_CreditSeal oldDelegate) =>
      progress != oldDelegate.progress || color != oldDelegate.color;
}

class _CreditsConstellation extends CustomPainter {
  _CreditsConstellation({
    required this.timeline,
    required this.rotation,
    required this.root,
    required this.lead,
    required this.research,
    required this.colors,
  }) : super(repaint: Listenable.merge([timeline, rotation]));

  final Animation<double> timeline;
  final Animation<double> rotation;
  final GlobalKey root, lead, research;
  final VaktijaPalette colors;

  void _dial(Canvas canvas, double time) {
    canvas.save();
    canvas.translate(164, 50);
    final line = Paint()..style = PaintingStyle.stroke;
    void stroke(double width, double opacity) {
      line.strokeWidth = width;
      line.color = colors.trailGold.withValues(alpha: opacity);
    }

    canvas.save();
    canvas.rotate(-math.pi / 10 + rotation.value * 2 * math.pi);
    stroke(.65, .46);
    canvas.drawCircle(Offset.zero, 73, line);
    for (final size in const [Size(98, 184), Size(34, 184), Size(184, 60)]) {
      canvas.drawOval(
        Rect.fromCenter(
          center: Offset.zero,
          width: size.width,
          height: size.height,
        ),
        line,
      );
    }
    canvas.restore();

    canvas.save();
    final turn = const Interval(
      0,
      .62,
      curve: Curves.easeOutCubic,
    ).transform(time);
    canvas.rotate((turn - 1) * math.pi / 36 + rotation.value * 2 * math.pi);
    stroke(.65, .64);
    canvas.drawCircle(Offset.zero, 96, line);
    canvas.drawCircle(Offset.zero, 112, line);
    stroke(1, .84);
    canvas.drawCircle(Offset.zero, 107, line);
    for (var i = 0; i < 120; i++) {
      final length = i % 10 == 0
          ? 10.0
          : i % 5 == 0
          ? 7.0
          : 3.2;
      stroke(i % 10 == 0 ? 1 : .6, i % 5 == 0 ? .90 : .56);
      canvas.drawLine(const Offset(0, -107), Offset(0, -107 + length), line);
      canvas.rotate(math.pi / 60);
    }
    canvas.restore();

    canvas.rotate(-22 * math.pi / 180);
    stroke(.8, .69);
    canvas.drawOval(
      Rect.fromCenter(center: Offset.zero, width: 296, height: 98),
      line,
    );
    canvas.drawCircle(const Offset(148, 0), 3, line);
    canvas.restore();
  }

  void _trace(Canvas canvas, List<Offset> points, double progress) {
    if (progress <= 0) return;
    final path = Path()..addPolygon(points, false);
    final metric = path.computeMetrics().first;
    final length = metric.length * progress;
    final stroke = Paint()
      ..color = colors.heroGold
      ..style = PaintingStyle.stroke
      ..strokeJoin = StrokeJoin.round
      ..strokeWidth = 1.25;
    canvas.drawPath(metric.extractPath(0, length), stroke);
    if (progress < 1) {
      final head = metric.getTangentForOffset(length)?.position;
      if (head != null)
        canvas.drawCircle(head, 2, Paint()..color = colors.marker);
    } else {
      final fill = Paint()..color = colors.sky;
      for (final point in points.skip(1).take(points.length - 2)) {
        canvas.drawCircle(point, 1.8, fill);
        canvas.drawCircle(point, 1.8, stroke);
      }
    }
  }

  void _star(Canvas canvas, Offset center, double sinceArrival) {
    if (sinceArrival < 0) return;
    canvas.save();
    canvas.translate(center.dx, center.dy);
    final gold = Paint()..color = colors.heroGold.withValues(alpha: .16);
    canvas.drawCircle(Offset.zero, 8, gold);
    final star = Path()
      ..addPolygon(const [
        Offset(0, -6),
        Offset(1.5, -1.5),
        Offset(6, 0),
        Offset(1.5, 1.5),
        Offset(0, 6),
        Offset(-1.5, 1.5),
        Offset(-6, 0),
        Offset(-1.5, -1.5),
      ], true);
    canvas.drawPath(star, gold..color = colors.heroGold);
    final pulse = sinceArrival / .20;
    if (pulse < 1) {
      gold
        ..style = PaintingStyle.stroke
        ..strokeWidth = .8
        ..color = colors.heroGold.withValues(alpha: 1 - pulse);
      canvas.drawCircle(Offset.zero, 5 + 7 * pulse, gold);
    }
    canvas.restore();
  }

  @override
  void paint(Canvas canvas, Size size) {
    final origin = root.currentContext?.findRenderObject();
    final first = lead.currentContext?.findRenderObject();
    final second = research.currentContext?.findRenderObject();
    if (origin is! RenderBox ||
        first is! RenderBox ||
        second is! RenderBox ||
        size.isEmpty)
      return;
    final unit = size.width / 360;
    // Work in chart coordinates, with the two endpoints following the actual text layout.
    Offset anchor(RenderBox name) =>
        name.localToGlobal(
          Offset(-24 * unit, name.size.height / 2),
          ancestor: origin,
        ) /
        unit;
    final a = anchor(first), b = anchor(second);
    final time = timeline.value;
    canvas.save();
    canvas.clipRect(Offset.zero & size);
    canvas.scale(unit);
    final stars = Paint()..color = colors.heroMuted.withValues(alpha: .46);
    for (var i = 0; i < 44; i++) {
      final x = (i * 137 + 19) % 359 + .5;
      final y = ((i * 71 + 17) % 281) / 281 * (size.height / unit);
      if (y > 155 && x > a.dx + 12 && x < 293) continue;
      canvas.drawCircle(Offset(x, y), i % 6 == 0 ? 1.1 : .65, stars);
    }
    _dial(canvas, time);
    const mark = Offset(164, 50);
    _trace(canvas, [
      mark,
      const Offset(138, 79),
      const Offset(104, 73),
      const Offset(78, 111),
      const Offset(40, 125),
      a,
    ], const Interval(.07, _leadArrival).transform(time));
    _trace(canvas, [
      a,
      Offset(a.dx + 7, b.dy - 33),
      Offset(b.dx - 14, b.dy - 18),
      b,
    ], const Interval(_leadArrival, _researchArrival).transform(time));
    canvas.drawCircle(mark, 30, Paint()..color = colors.sky);
    final ring = Paint()
      ..style = PaintingStyle.stroke
      ..color = colors.trailGold
      ..strokeWidth = .75;
    canvas.drawCircle(mark, 30, ring);
    canvas.drawCircle(
      mark,
      26.5,
      ring..color = colors.trailGold.withValues(alpha: .6),
    );
    _star(canvas, a, time - _leadArrival);
    _star(canvas, b, time - _researchArrival);
    canvas.restore();
  }

  @override
  bool shouldRepaint(_CreditsConstellation oldDelegate) =>
      timeline != oldDelegate.timeline ||
      rotation != oldDelegate.rotation ||
      root != oldDelegate.root ||
      lead != oldDelegate.lead ||
      research != oldDelegate.research ||
      colors.dark != oldDelegate.colors.dark;
}
