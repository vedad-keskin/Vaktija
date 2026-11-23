import 'package:flutter/material.dart';

import '../features/prayer_times/timetable.dart';
import 'vaktija_dialog.dart';
import 'vaktija_palette.dart';

String methodTitle(PrayerLabels labels, PrayerMethod method) =>
    labels[method == PrayerMethod.angle ? 'method146Label' : 'methodIzLabel'];

class MethodIcon extends StatelessWidget {
  const MethodIcon({
    super.key,
    required this.method,
    required this.color,
    required this.size,
  });

  final PrayerMethod method;
  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) => Image.asset(
    '$prayerAssets/${method == PrayerMethod.angle ? '14-6-prayer-method-icon.webp' : 'iz-logo.png'}',
    width: size,
    height: size,
    color: color,
    filterQuality: FilterQuality.low,
    excludeFromSemantics: true,
  );
}

class MethodChoice extends StatefulWidget {
  const MethodChoice({super.key, required this.labels});

  final PrayerLabels labels;

  @override
  State<MethodChoice> createState() => _MethodChoiceState();
}

class _MethodChoiceState extends State<MethodChoice> {
  PrayerMethod _selected = PrayerMethod.angle;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final labels = widget.labels;

    return PopScope<PrayerMethod>(
      canPop: false,
      child: VaktijaDialog(
        title: labels['methodIntroTitle'],
        content: Column(
          children: [
            Text(
              labels['methodIntroDescription'],
              textAlign: TextAlign.center,
              style: TextStyle(
                color: colors.heroMuted,
                fontSize: 15,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 16),
            for (final method in PrayerMethod.values) ...[
              Semantics(
                selected: _selected == method,
                button: true,
                child: Material(
                  color: _selected == method
                      ? colors.heroGold.withValues(alpha: .16)
                      : colors.sky.withValues(alpha: .94),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: BorderSide(
                      color: _selected == method
                          ? colors.heroGold
                          : colors.heroGold.withValues(alpha: .35),
                    ),
                  ),
                  child: InkWell(
                    onTap: () => setState(() => _selected = method),
                    borderRadius: BorderRadius.circular(12),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          MethodIcon(
                            method: method,
                            color: colors.heroGold,
                            size: 28,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  methodTitle(labels, method),
                                  style: TextStyle(
                                    color: colors.heroText,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  labels[method == PrayerMethod.angle
                                      ? 'method146Summary'
                                      : 'methodIzSummary'],
                                  style: TextStyle(color: colors.heroMuted),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 6),
                          Icon(
                            _selected == method
                                ? Icons.radio_button_checked
                                : Icons.radio_button_unchecked,
                            size: 19,
                            color: colors.heroGold,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 10),
            ],
            const SizedBox(height: 6),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: colors.heroGold,
                  foregroundColor: colors.sky,
                  minimumSize: const Size.fromHeight(48),
                  textStyle: const TextStyle(fontWeight: FontWeight.w700),
                ),
                onPressed: () => Navigator.pop(context, _selected),
                child: Text(labels['methodIntroConfirm']),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              labels['methodIntroLater'],
              textAlign: TextAlign.center,
              style: TextStyle(color: colors.heroMuted),
            ),
          ],
        ),
      ),
    );
  }
}
