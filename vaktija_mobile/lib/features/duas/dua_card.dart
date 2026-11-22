import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../app/vaktija_ornaments.dart';
import '../../app/vaktija_palette.dart';
import 'dua_catalog.dart';

const duaDisplayFont = 'Cormorant Garamond';

class DuaCard extends StatelessWidget {
  const DuaCard({
    super.key,
    required this.dua,
    required this.language,
    required this.labels,
    required this.saved,
    required this.onBookmark,
  });

  final Dua dua;
  final String language;
  final DuaLabels labels;
  final bool saved;
  final VoidCallback onBookmark;

  bool get _bosnian => language == 'bs';

  Future<void> _copy(BuildContext context, String text) async {
    try {
      await Clipboard.setData(ClipboardData(text: text));
    } catch (_) {
      if (context.mounted) {
        await showDuaError(
          context,
          _bosnian ? 'Tekst nije moguće kopirati.' : 'Couldn’t copy the text.',
          language,
        );
      }
      return;
    }
    await HapticFeedback.lightImpact();
  }

  Widget _copyable(
    BuildContext context,
    String Function() text,
    Widget child, {
    bool wholeDua = false,
  }) => Semantics(
    hint: wholeDua
        ? (_bosnian
              ? 'Zadržite za kopiranje cijelog teksta'
              : 'Hold to copy the whole entry')
        : (_bosnian ? 'Zadržite za kopiranje teksta' : 'Hold to copy the text'),
    child: GestureDetector(
      behavior: HitTestBehavior.opaque,
      onLongPress: () => _copy(context, text()),
      child: child,
    ),
  );

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final title = dua.title[language]!;
    final bookmarkLabel = labels[saved ? 'duasUnsave' : 'duasSave']!;
    final radius = BorderRadius.circular(16);

    return LayoutBuilder(
      builder: (context, bounds) {
        final wide = bounds.maxWidth >= 600;
        final corner = math.min(wide ? 260.0 : 190.0, bounds.maxWidth / 2);
        return Container(
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(color: colors.sky, borderRadius: radius),
          foregroundDecoration: BoxDecoration(
            border: Border.all(color: colors.heroBorder),
            borderRadius: radius,
          ),
          child: Stack(
            children: [
              Positioned.fill(
                child: VaktijaCardArtwork(cornerWidth: corner, wide: wide),
              ),
              Positioned.fill(
                child: IgnorePointer(
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      border: Border.all(color: colors.surface, width: 5),
                      borderRadius: radius,
                    ),
                  ),
                ),
              ),
              Padding(
                padding: wide
                    ? const EdgeInsets.fromLTRB(28, 24, 28, 20)
                    : const EdgeInsets.fromLTRB(16, 18, 16, 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        Image.asset(
                          vaktijaRosetteAsset,
                          width: wide ? 64 : 46,
                          height: wide ? 64 : 46,
                          excludeFromSemantics: true,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Semantics(
                            header: true,
                            child: _copyable(
                              context,
                              () => dua.copyText(language),
                              Text(
                                title,
                                style: TextStyle(
                                  fontFamily: duaDisplayFont,
                                  fontSize: wide ? 32 : 25,
                                  height: 1.1,
                                  fontWeight: FontWeight.w600,
                                  color: colors.heroText,
                                ),
                              ),
                              wholeDua: true,
                            ),
                          ),
                        ),
                        Semantics(
                          selected: saved,
                          child: IconButton(
                            tooltip: '$bookmarkLabel · $title',
                            onPressed: onBookmark,
                            icon: Icon(
                              saved
                                  ? Icons.bookmark_rounded
                                  : Icons.bookmark_border_rounded,
                              color: colors.gold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    for (final (index, saying) in dua.sayings.indexed) ...[
                      if (index > 0)
                        Padding(
                          padding: const EdgeInsets.only(top: 24),
                          child: Divider(
                            height: 1,
                            color: colors.gold.withValues(alpha: .28),
                          ),
                        ),
                      _saying(context, saying, colors, wide),
                    ],
                    if (dua.source case final source?)
                      _source(context, source, colors),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _saying(
    BuildContext context,
    DuaSaying saying,
    VaktijaPalette colors,
    bool wide,
  ) {
    final transcription = saying.transcription[language]!;
    final translation = saying.translation[language]!;
    final instructions = saying.instructions?[language];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(height: 20),
        _copyable(
          context,
          () => saying.arabic,
          Text(
            saying.arabic,
            textAlign: TextAlign.center,
            textDirection: TextDirection.rtl,
            locale: const Locale('ar'),
            style: TextStyle(
              fontFamily: 'Amiri',
              fontSize: wide ? 40 : 32,
              height: 1.9,
              color: colors.heroGold,
            ),
          ),
        ),
        const Padding(
          padding: EdgeInsets.only(top: 10, bottom: 16),
          child: VaktijaDivider(width: 220, card: true),
        ),
        if (instructions != null && instructions.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 18),
            child: _copyable(
              context,
              () => instructions,
              Container(
                padding: const EdgeInsets.fromLTRB(14, 12, 14, 10),
                decoration: BoxDecoration(
                  color: Color.alphaBlend(
                    colors.gold.withValues(alpha: .10),
                    colors.sky,
                  ),
                  border: Border.all(color: colors.gold.withValues(alpha: .35)),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    Text(
                      labels['duasInstructions']!,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontFamily: duaDisplayFont,
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: colors.gold,
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 6),
                      child: VaktijaDivider(width: 42, card: true),
                    ),
                    Text(
                      instructions,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 15,
                        height: 1.55,
                        color: colors.secondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        if (transcription.isNotEmpty) ...[
          _copyable(
            context,
            () => transcription,
            Text(
              transcription,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: duaDisplayFont,
                fontStyle: FontStyle.italic,
                fontSize: wide ? 23 : 21,
                height: 1.5,
                color: colors.gold,
              ),
            ),
          ),
          const SizedBox(height: 14),
        ],
        if (translation.isNotEmpty)
          _copyable(
            context,
            () => translation,
            Text(
              translation,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: colors.text,
                fontSize: wide ? 19 : 17,
                height: 1.6,
              ),
            ),
          ),
        for (final source in saying.sources) _source(context, source, colors),
      ],
    );
  }

  Widget _source(
    BuildContext context,
    DuaSource source,
    VaktijaPalette colors,
  ) {
    Future<void> open() async {
      try {
        if (await launchUrl(
          Uri.parse(source.url(language)),
          mode: LaunchMode.externalApplication,
        )) {
          return;
        }
      } catch (_) {
        // A device without a browser can still display the bundled reference.
      }
      if (context.mounted) {
        await showDuaError(
          context,
          _bosnian
              ? 'Izvor nije moguće otvoriti.'
              : 'Couldn’t open the source.',
          language,
        );
      }
    }

    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Column(
        children: [
          Divider(height: 1, color: colors.border),
          Semantics(
            link: true,
            child: InkWell(
              onTap: open,
              onLongPress: () => _copy(context, source.copyText(language)),
              borderRadius: BorderRadius.circular(8),
              child: ConstrainedBox(
                constraints: const BoxConstraints(minHeight: 44),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    vertical: 10,
                    horizontal: 5,
                  ),
                  child: Wrap(
                    alignment: WrapAlignment.center,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    spacing: 6,
                    children: [
                      Text(
                        '${labels['duasSource']} · ${source.reference[language]}',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: colors.muted, fontSize: 13),
                      ),
                      Icon(
                        Icons.open_in_new_rounded,
                        size: 14,
                        color: colors.muted,
                      ),
                    ],
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

Future<void> showDuaError(
  BuildContext context,
  String message,
  String language,
) => showDialog<void>(
  context: context,
  builder: (context) => AlertDialog(
    content: Text(message),
    actions: [
      TextButton(
        onPressed: () => Navigator.of(context).pop(),
        child: Text(
          language == 'bs'
              ? 'U redu'
              : MaterialLocalizations.of(context).okButtonLabel,
        ),
      ),
    ],
  ),
);
