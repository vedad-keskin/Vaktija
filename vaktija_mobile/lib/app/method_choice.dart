import 'package:flutter/material.dart';

import '../features/prayer_times/timetable.dart';
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
      child: Dialog(
        backgroundColor: colors.panel,
        insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        shape: RoundedRectangleBorder(
          side: BorderSide(color: colors.heroBorder),
          borderRadius: BorderRadius.circular(18),
        ),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 440),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Image.asset(
                  '$prayerAssets/dua-crescent-rosette.webp',
                  width: 64,
                  height: 64,
                  excludeFromSemantics: true,
                ),
                const SizedBox(height: 10),
                Text(
                  labels['methodIntroTitle'],
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontFamily: 'Cormorant Garamond',
                    fontSize: 33,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  labels['methodIntroDescription'],
                  textAlign: TextAlign.center,
                  style: TextStyle(color: colors.muted),
                ),
                const SizedBox(height: 18),
                for (final method in PrayerMethod.values) ...[
                  Semantics(
                    selected: _selected == method,
                    button: true,
                    child: Material(
                      color: _selected == method
                          ? colors.selected
                          : colors.surface,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(
                          color: _selected == method
                              ? colors.accent
                              : colors.border,
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
                                color: colors.accent,
                                size: 28,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      methodTitle(labels, method),
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    Text(
                                      labels[method == PrayerMethod.angle
                                          ? 'method146Summary'
                                          : 'methodIzSummary'],
                                      style: TextStyle(color: colors.muted),
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
                                color: colors.accent,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                ],
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: () => Navigator.pop(context, _selected),
                    child: Text(labels['methodIntroConfirm']),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  labels['methodIntroLater'],
                  textAlign: TextAlign.center,
                  style: TextStyle(color: colors.muted),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
