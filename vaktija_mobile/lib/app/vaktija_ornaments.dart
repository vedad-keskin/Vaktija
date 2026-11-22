import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'vaktija_palette.dart';

const vaktijaRosetteAsset = 'assets/prayer_times/dua-crescent-rosette.webp';

class VaktijaCardArtwork extends StatelessWidget {
  const VaktijaCardArtwork({super.key, this.cornerWidth, this.wide = false});

  final double? cornerWidth;
  final bool wide;

  @override
  Widget build(BuildContext context) {
    final tone = VaktijaPalette.of(context).dark ? 'dark' : 'light';
    final art = wide ? tone : 'mobile-$tone';
    return IgnorePointer(
      child: Stack(
        children: [
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Opacity(
              opacity: wide ? .35 : .25,
              child: ShaderMask(
                blendMode: BlendMode.dstIn,
                shaderCallback: (bounds) => const LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Colors.transparent, Colors.black],
                  stops: [0, .65],
                ).createShader(bounds),
                child: AspectRatio(
                  aspectRatio: wide ? 3 : 4 / 3,
                  child: Image.asset(
                    'assets/prayer_times/mosque-horizon-$art.webp',
                    fit: BoxFit.cover,
                    alignment: Alignment.bottomCenter,
                    excludeFromSemantics: true,
                  ),
                ),
              ),
            ),
          ),
          if (cornerWidth case final double width)
            for (final right in [false, true])
              Positioned(
                left: right ? null : 0,
                right: right ? 0 : null,
                bottom: 0,
                width: width,
                child: Opacity(
                  opacity: .8,
                  child: Transform.flip(
                    flipX: right,
                    flipY: true,
                    child: Image.asset(
                      'assets/duas/dua-card-corner.webp',
                      excludeFromSemantics: true,
                    ),
                  ),
                ),
              ),
        ],
      ),
    );
  }
}

class VaktijaDivider extends StatelessWidget {
  const VaktijaDivider({super.key, required this.width, this.card = false});

  final double width;
  final bool card;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    return ExcludeSemantics(
      child: Center(
        child: SizedBox(
          width: width,
          height: 8,
          child: Stack(
            alignment: Alignment.center,
            children: [
              Container(
                height: 1,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.transparent,
                      colors.gold,
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
              Transform.rotate(
                angle: math.pi / 4,
                child: Container(
                  width: 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: card ? colors.sky : colors.surface,
                    border: Border.all(color: colors.gold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
