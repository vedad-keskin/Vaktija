import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'vaktija_ornaments.dart';
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

class _CreditsDialogState extends State<CreditsDialog>
    with SingleTickerProviderStateMixin {
  VaktijaPalette get _colors => VaktijaPalette.of(context);
  final _constellation = GlobalKey();
  final _logo = GlobalKey();
  final _developerIcon = GlobalKey();
  final _researchIcon = GlobalKey();
  CurvedAnimation? _pop;
  late final _entrance = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 800),
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
    final routeAnimation = ModalRoute.of(context)?.animation;
    if (routeAnimation != null && _pop?.parent != routeAnimation) {
      _pop?.dispose();
      _pop = CurvedAnimation(
        parent: routeAnimation,
        curve: Curves.easeOutBack,
        reverseCurve: Curves.easeInCubic,
      );
    }
    if (MediaQuery.disableAnimationsOf(context)) {
      _entrance.value = 1;
    } else if (_entrance.status == AnimationStatus.dismissed) {
      _entrance.forward();
    }
  }

  @override
  void dispose() {
    _pop?.dispose();
    _entrance.dispose();
    super.dispose();
  }

  Animation<double> _phase(double start, double end) => _entrance.drive(
    CurveTween(curve: Interval(start, end, curve: Curves.easeOutCubic)),
  );

  Widget _reveal(double start, double end, Widget child) {
    final progress = _phase(start, end);
    return FadeTransition(
      opacity: progress,
      child: SlideTransition(
        position: Tween(
          begin: const Offset(0, .12),
          end: Offset.zero,
        ).animate(progress),
        child: child,
      ),
    );
  }

  Widget _credit({
    required GlobalKey iconKey,
    required IconData icon,
    required String name,
    required String role,
    bool trailing = false,
  }) {
    final badge = ExcludeSemantics(
      child: SizedBox(
        key: iconKey,
        width: 34,
        height: 34,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: _colors.sky,
            shape: BoxShape.circle,
            border: Border.all(color: _colors.heroGold.withValues(alpha: .42)),
          ),
          child: Icon(icon, size: 18, color: _colors.heroGold),
        ),
      ),
    );
    final text = Expanded(
      child: Column(
        crossAxisAlignment: trailing
            ? CrossAxisAlignment.end
            : CrossAxisAlignment.start,
        children: [
          Text(
            role,
            textAlign: trailing ? TextAlign.right : TextAlign.left,
            style: TextStyle(
              fontSize: 12,
              height: 1.3,
              color: _colors.heroMuted,
            ),
          ),
          const SizedBox(height: 5),
          Text(
            name,
            textAlign: trailing ? TextAlign.right : TextAlign.left,
            style: TextStyle(
              fontFamily: 'Lilita One',
              fontFamilyFallback: const ['Paytone One', 'Vaktija Sans'],
              fontSize: 24,
              height: 1.1,
              letterSpacing: .2,
              color: _colors.heroText,
            ),
          ),
        ],
      ),
    );
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 22),
      child: Row(
        children: trailing
            ? [text, const SizedBox(width: 12), badge]
            : [badge, const SizedBox(width: 12), text],
      ),
    );
  }

  Widget _header() => Padding(
    padding: const EdgeInsets.fromLTRB(8, 12, 8, 4),
    child: Row(
      children: [
        const Expanded(child: SizedBox.shrink()),
        _reveal(.02, .35, _imprint()),
        Expanded(
          child: Align(
            alignment: Alignment.centerRight,
            child: IconButton(
              key: const ValueKey('credits-close'),
              tooltip: widget.bosnian ? 'Zatvori' : 'Close',
              onPressed: () => Navigator.of(context).pop(),
              icon: const Icon(Icons.close_rounded, size: 20),
              style: IconButton.styleFrom(
                minimumSize: const Size.square(32),
                fixedSize: const Size.square(32),
                padding: EdgeInsets.zero,
                tapTargetSize: MaterialTapTargetSize.padded,
                foregroundColor: _colors.heroGold,
                backgroundColor: _colors.sky,
                side: BorderSide(color: _colors.heroBorder),
              ),
            ),
          ),
        ),
      ],
    ),
  );

  Widget _imprint() => Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      Image.asset(
        'assets/branding/nightfall-wordmark.png',
        key: const ValueKey('credits-studio'),
        width: 128,
        height: 40,
        color: _colors.heroText,
        semanticLabel: 'Nightfall Studio',
      ),
      const SizedBox(height: 8),
      FutureBuilder<String?>(
        future: _version,
        builder: (context, snapshot) => Text(
          snapshot.hasData ? 'v${snapshot.data}' : '',
          key: const ValueKey('app-version'),
          style: TextStyle(color: _colors.heroMuted, fontSize: 12, height: 1.2),
        ),
      ),
    ],
  );

  Widget _mark() => _reveal(
    .08,
    .4,
    Image.asset(
      'assets/branding/logo.png',
      key: _logo,
      width: 40,
      height: 40,
      color: _colors.heroText,
      excludeFromSemantics: true,
    ),
  );

  @override
  Widget build(BuildContext context) {
    final pop = MediaQuery.disableAnimationsOf(context)
        ? const AlwaysStoppedAnimation(1.0)
        : _pop ?? const AlwaysStoppedAnimation(1.0);
    return SlideTransition(
      position: Tween(
        begin: const Offset(0, .03),
        end: Offset.zero,
      ).animate(pop),
      child: ScaleTransition(
        key: const ValueKey('credits-pop'),
        scale: Tween(begin: .84, end: 1.0).animate(pop),
        child: Dialog(
          backgroundColor: _colors.panel,
          surfaceTintColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 24,
          ),
          constraints: const BoxConstraints(maxWidth: 360),
          clipBehavior: Clip.antiAlias,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
            side: BorderSide(color: _colors.border),
          ),
          child: Semantics(
            namesRoute: true,
            label: widget.bosnian ? 'Autori aplikacije' : 'App credits',
            child: SizedBox(
              width: double.infinity,
              child: Stack(
                children: [
                  const Positioned.fill(child: VaktijaCardArtwork()),
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _header(),
                      Flexible(
                        child: SingleChildScrollView(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Divider(
                                height: 1,
                                color: _colors.border.withValues(alpha: .7),
                              ),
                              CustomPaint(
                                key: _constellation,
                                painter: _CreditsConstellation(
                                  timeline: _entrance,
                                  root: _constellation,
                                  logo: _logo,
                                  developer: _developerIcon,
                                  researcher: _researchIcon,
                                  colors: _colors,
                                ),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const SizedBox(height: 16),
                                    _mark(),
                                    const SizedBox(height: 28),
                                    _reveal(
                                      .3,
                                      .6,
                                      _credit(
                                        iconKey: _developerIcon,
                                        icon: Icons.code_rounded,
                                        name: 'Vedad Keskin',
                                        role: widget.bosnian
                                            ? 'Glavni developer'
                                            : 'Lead Developer',
                                      ),
                                    ),
                                    const SizedBox(height: 40),
                                    _reveal(
                                      .5,
                                      .79,
                                      _credit(
                                        iconKey: _researchIcon,
                                        icon: Icons.menu_book_outlined,
                                        name: 'Samija Bešić',
                                        role: widget.bosnian
                                            ? 'Istraživanje sadržaja'
                                            : 'Content Research',
                                        trailing: true,
                                      ),
                                    ),
                                    const SizedBox(height: 26),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CreditsConstellation extends CustomPainter {
  _CreditsConstellation({
    required this.timeline,
    required this.root,
    required this.logo,
    required this.developer,
    required this.researcher,
    required this.colors,
  }) : super(repaint: timeline);

  final Animation<double> timeline;
  final GlobalKey root, logo, developer, researcher;
  final VaktijaPalette colors;

  Offset? _center(GlobalKey key, RenderBox origin) {
    final target = key.currentContext?.findRenderObject();
    if (target is! RenderBox || !target.hasSize) return null;
    return origin.globalToLocal(
      target.localToGlobal(target.size.center(Offset.zero)),
    );
  }

  void _trace(Canvas canvas, Path path, double progress) {
    if (progress <= 0) return;
    final stroke = Paint()
      ..color = colors.heroGold.withValues(alpha: .3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = .8
      ..strokeCap = StrokeCap.round;
    for (final metric in path.computeMetrics()) {
      final length = metric.length * progress.clamp(0.0, 1.0);
      canvas.drawPath(metric.extractPath(0, length), stroke);
      if (progress < 1) {
        final head = metric.getTangentForOffset(length)?.position;
        if (head != null) {
          canvas.drawCircle(head, 1.7, Paint()..color = colors.heroGold);
        }
      }
    }
  }

  @override
  void paint(Canvas canvas, Size size) {
    final origin = root.currentContext?.findRenderObject();
    if (origin is! RenderBox || !origin.hasSize) return;
    final mark = _center(logo, origin);
    final lead = _center(developer, origin);
    final research = _center(researcher, origin);
    if (mark == null || lead == null || research == null) return;
    final progress = timeline.value;
    final stars = Paint()
      ..color = colors.heroMuted.withValues(alpha: .2 * progress);
    final span = math.max(1.0, research.dy - mark.dy);
    for (var i = 0; i < 20; i++) {
      final x = ((i * 137 + 19) % 997) / 997 * size.width;
      final y = mark.dy + ((i * 71 + 17) % 281) / 281 * span;
      if (x > 64 && x < size.width - 64 && y > mark.dy + 24) continue;
      canvas.drawCircle(Offset(x, y), i % 5 == 0 ? 1 : .5, stars);
    }
    final bend = Offset((mark.dx + lead.dx) / 2 + 22, (mark.dy + lead.dy) / 2);
    final turn = Offset(
      (lead.dx + research.dx) / 2 + 18,
      (lead.dy + research.dy) / 2 - 10,
    );
    final first = Path()
      ..moveTo(mark.dx, mark.dy)
      ..lineTo(bend.dx, bend.dy)
      ..lineTo(lead.dx, lead.dy);
    final second = Path()
      ..moveTo(lead.dx, lead.dy)
      ..lineTo(turn.dx, turn.dy)
      ..lineTo(research.dx, research.dy);
    _trace(canvas, first, (progress - .12) / .48);
    _trace(canvas, second, (progress - .27) / .5);
    final nodePaint = Paint()
      ..color = colors.heroGold.withValues(alpha: .5 * progress);
    for (final node in [bend, turn]) {
      canvas.drawRect(
        Rect.fromCenter(center: node, width: 2, height: 2),
        nodePaint,
      );
    }
    canvas.save();
    canvas.translate(mark.dx + 36, mark.dy);
    canvas.rotate(-.27);
    canvas.drawArc(
      Rect.fromCenter(center: Offset.zero, width: size.width * .43, height: 35),
      -.3,
      math.pi * 1.75,
      false,
      Paint()
        ..color = colors.accent.withValues(alpha: .1 * progress)
        ..style = PaintingStyle.stroke
        ..strokeWidth = .7,
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(_CreditsConstellation oldDelegate) =>
      timeline != oldDelegate.timeline ||
      root != oldDelegate.root ||
      logo != oldDelegate.logo ||
      developer != oldDelegate.developer ||
      researcher != oldDelegate.researcher ||
      colors.dark != oldDelegate.colors.dark;
}
