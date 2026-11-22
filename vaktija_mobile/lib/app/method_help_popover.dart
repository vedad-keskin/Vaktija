import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'vaktija_palette.dart';

class MethodHelpPopover extends StatelessWidget {
  const MethodHelpPopover({
    super.key,
    required this.explanation,
    required this.opensBelow,
  });

  final String explanation;
  final bool opensBelow;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final border = BorderSide(color: colors.heroBorder);

    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: 1),
      duration: MediaQuery.disableAnimationsOf(context)
          ? Duration.zero
          : const Duration(milliseconds: 180),
      curve: Curves.easeOut,
      builder: (context, value, child) => Opacity(
        opacity: value,
        child: Transform.translate(
          offset: Offset(0, (opensBelow ? 6 : -6) * (1 - value)),
          child: child,
        ),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.center,
        children: [
          Material(
            color: colors.panel,
            surfaceTintColor: Colors.transparent,
            shadowColor: colors.dark
                ? const Color(0x2000110c)
                : const Color(0x05334226),
            elevation: 8,
            shape: RoundedRectangleBorder(
              side: border,
              borderRadius: BorderRadius.circular(12),
            ),
            clipBehavior: Clip.antiAlias,
            child: SingleChildScrollView(
              primary: false,
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
              child: Semantics(
                liveRegion: true,
                child: Text(
                  explanation,
                  style: TextStyle(
                    color: colors.text,
                    fontSize: 13,
                    height: 1.65,
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            top: opensBelow ? -6 : null,
            bottom: opensBelow ? null : -6,
            child: Transform.rotate(
              angle: opensBelow ? math.pi / 4 : 5 * math.pi / 4,
              child: SizedBox.square(
                dimension: 12,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: colors.panel,
                    border: Border(top: border, left: border),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
