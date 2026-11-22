import 'package:flutter/material.dart';

import 'vaktija_ornaments.dart';
import 'vaktija_palette.dart';

class VaktijaDialog extends StatelessWidget {
  const VaktijaDialog({
    super.key,
    required this.title,
    required this.content,
    this.actions = const [],
  });

  final String title;
  final Widget content;
  final List<Widget> actions;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final radius = BorderRadius.circular(22);
    return Dialog(
      backgroundColor: colors.sky,
      surfaceTintColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      constraints: const BoxConstraints(maxWidth: 420),
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: radius,
        side: BorderSide(color: colors.heroBorder),
      ),
      child: SizedBox(
        width: 420,
        child: Stack(
          children: [
            const Positioned.fill(child: VaktijaCardArtwork()),
            Positioned.fill(
              child: IgnorePointer(
                child: Padding(
                  padding: const EdgeInsets.all(6),
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: colors.heroGold.withValues(alpha: .24),
                      ),
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 17),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Flexible(
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
                          Image.asset(
                            vaktijaRosetteAsset,
                            width: 47,
                            height: 47,
                            excludeFromSemantics: true,
                          ),
                          const SizedBox(height: 8),
                          Semantics(
                            namesRoute: true,
                            child: Text(
                              title,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontFamily: 'Cormorant Garamond',
                                fontSize: 33,
                                height: 1.06,
                                fontWeight: FontWeight.w600,
                                color: colors.heroText,
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          const VaktijaDivider(width: 150, card: true),
                          const SizedBox(height: 14),
                          content,
                        ],
                      ),
                    ),
                  ),
                  if (actions.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    OverflowBar(
                      alignment: MainAxisAlignment.center,
                      overflowAlignment: OverflowBarAlignment.center,
                      spacing: 10,
                      overflowSpacing: 8,
                      children: actions,
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
