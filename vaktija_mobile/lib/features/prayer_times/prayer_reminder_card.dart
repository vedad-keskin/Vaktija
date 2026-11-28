import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../app/vaktija_palette.dart';
import 'prayer_reminders.dart';
import 'timetable.dart';

const prayerReminderStripHeight = 21.0;
const prayerReminderStripWidth = 60.0;
const _ringingBell = AssetImage('$prayerAssets/ringing-bell-on.png');
const _outlineBell = AssetImage('$prayerAssets/ringing-bell-off.png');

class PrayerReminderCard extends StatefulWidget {
  const PrayerReminderCard({
    super.key,
    required this.front,
    required this.decoration,
    required this.minHeight,
    required this.name,
    required this.labels,
    required this.enabled,
    required this.onToggle,
  });

  final Widget Function(Widget bells) front;
  final BoxDecoration decoration;
  final double minHeight;
  final String name;
  final PrayerLabels labels;
  final Set<PrayerReminder> enabled;
  final ValueChanged<PrayerReminder> onToggle;

  @override
  State<PrayerReminderCard> createState() => _PrayerReminderCardState();
}

class _PrayerReminderCardState extends State<PrayerReminderCard>
    with SingleTickerProviderStateMixin {
  late final _flip = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 420),
  );

  void _showBack(bool show) {
    if (show) {
      unawaited(precacheImage(_ringingBell, context));
      unawaited(precacheImage(_outlineBell, context));
    }
    if (MediaQuery.disableAnimationsOf(context)) {
      _flip.value = show ? 1 : 0;
    } else if (show) {
      _flip.forward();
    } else {
      _flip.reverse();
    }
  }

  void _closeFromOutside(PointerEvent _) {
    if (_flip.status == AnimationStatus.forward || _flip.isCompleted) {
      _showBack(false);
    }
  }

  @override
  void dispose() {
    _flip.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final bosnian = widget.labels.bosnian;
    final heading = bosnian ? 'Obavijesti' : 'Reminders';
    final open = '${widget.name} · $heading';

    Widget face(Widget child) => SizedBox(width: double.infinity, child: child);

    final front = face(
      widget.front(
        Semantics(
          button: true,
          label: open,
          value: '${widget.enabled.length}/3',
          child: InkResponse(
            onTap: () => _showBack(true),
            highlightShape: BoxShape.rectangle,
            radius: 31,
            child: SizedBox(
              height: prayerReminderStripHeight,
              width: prayerReminderStripWidth,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  for (final reminder in PrayerReminder.values)
                    _ReminderBell(
                      reminder,
                      enabled: widget.enabled.contains(reminder),
                      size: 18,
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
    final back = face(
      Stack(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(10, 7, 9, 2),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(right: 38),
                  child: Text(
                    open,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: colors.secondary,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Expanded(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      for (final reminder in PrayerReminder.values)
                        Expanded(child: _option(reminder)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            top: 0,
            right: 0,
            child: Semantics(
              button: true,
              label: bosnian ? 'Zatvori obavijesti' : 'Close reminders',
              child: InkResponse(
                onTap: () => _showBack(false),
                child: SizedBox(
                  width: 43,
                  height: 39,
                  child: Align(
                    alignment: Alignment.topRight,
                    child: ClipPath(
                      clipper: const _FoldClipper(),
                      child: ColoredBox(
                        color: colors.gold,
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(19, 3, 3, 15),
                          child: Icon(
                            Icons.close,
                            size: 14,
                            color: colors.surface,
                          ),
                        ),
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

    final flip = ClipRect(
      child: AnimatedBuilder(
        animation: _flip,
        builder: (context, _) {
          final progress = Curves.easeInOutCubic.transform(_flip.value);
          final showBack = progress >= .5;
          final angle = math.pi * (showBack ? progress - 1 : progress);
          final scale = 1 - .055 * math.sin(progress * math.pi);
          return IgnorePointer(
            ignoring: _flip.isAnimating,
            child: Transform(
              alignment: Alignment.center,
              transform: Matrix4.identity()
                ..setEntry(3, 2, .0018)
                ..rotateY(angle)
                ..rotateZ(.025 * math.sin(progress * 2 * math.pi))
                ..scaleByDouble(scale, scale, 1, 1),
              child: Container(
                constraints: BoxConstraints(minHeight: widget.minHeight),
                decoration: widget.decoration,
                clipBehavior: Clip.antiAlias,
                child: Material(
                  type: MaterialType.transparency,
                  child: Stack(
                    children: [
                      // The live timetable face sets the size for both sides.
                      Visibility(
                        visible: !showBack,
                        maintainState: true,
                        maintainAnimation: true,
                        maintainSize: true,
                        child: front,
                      ),
                      if (showBack) Positioned.fill(child: back),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
    return TapRegion(
      behavior: HitTestBehavior.translucent,
      onTapOutside: _closeFromOutside,
      child: MouseRegion(onExit: _closeFromOutside, child: flip),
    );
  }

  Widget _option(PrayerReminder reminder) {
    final enabled = widget.enabled.contains(reminder);
    final label = reminder.label(widget.labels);
    void toggle() => widget.onToggle(reminder);
    return Semantics(
      label: label,
      toggled: enabled,
      onTap: toggle,
      child: ExcludeSemantics(
        child: InkWell(
          borderRadius: BorderRadius.circular(9),
          onTap: toggle,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 3),
            child: Row(
              spacing: 5,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _ReminderBell(
                  reminder,
                  enabled: enabled,
                  size: 25,
                  animate: true,
                ),
                Flexible(
                  child: LayoutBuilder(
                    builder: (context, bounds) => FittedBox(
                      alignment: Alignment.centerLeft,
                      fit: BoxFit.scaleDown,
                      child: ConstrainedBox(
                        constraints: BoxConstraints(maxWidth: bounds.maxWidth),
                        child: Text(
                          label,
                          style: const TextStyle(fontSize: 11, height: 1.15),
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
    );
  }
}

class _ReminderBell extends StatelessWidget {
  const _ReminderBell(
    this.reminder, {
    required this.enabled,
    required this.size,
    this.animate = false,
  });

  final PrayerReminder reminder;
  final bool enabled;
  final double size;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final bell = SizedBox.square(
      dimension: size,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image(
            image: enabled ? _ringingBell : _outlineBell,
            color: enabled ? colors.gold : colors.muted,
            colorBlendMode: BlendMode.srcIn,
            excludeFromSemantics: true,
            gaplessPlayback: true,
          ),
          if (reminder.minutes != 0)
            Align(
              alignment: const Alignment(0, .23),
              child: ExcludeSemantics(
                child: Text(
                  '${reminder.minutes}',
                  textScaler: TextScaler.noScaling,
                  style: TextStyle(
                    color: enabled ? colors.surface : colors.text,
                    fontSize: size * .44,
                    fontWeight: FontWeight.w700,
                    height: 1,
                    letterSpacing: 0,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
    if (!animate || MediaQuery.disableAnimationsOf(context)) return bell;
    final state = enabled ? 1.0 : 0.0;

    return RepaintBoundary(
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: state, end: state),
        curve: Curves.easeOutCubic,
        duration: const Duration(milliseconds: 170),
        child: bell,
        builder: (context, value, child) => Transform.rotate(
          alignment: const Alignment(0, -.55),
          angle: .14 * math.sin(value * math.pi),
          child: child,
        ),
      ),
    );
  }
}

class _FoldClipper extends CustomClipper<Path> {
  const _FoldClipper();

  @override
  Path getClip(Size size) => Path()
    ..lineTo(size.width, 0)
    ..lineTo(size.width, size.height)
    ..close();

  @override
  bool shouldReclip(_FoldClipper oldClipper) => false;
}
