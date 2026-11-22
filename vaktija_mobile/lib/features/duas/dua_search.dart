import 'package:unorm_dart/unorm_dart.dart' as unicode;

import 'dua_catalog.dart';

// The rules and ranking mirror src/app/features/duas/duas-search.ts.
const _dh = '\uE000', _th = '\uE001', _dz = '\uE002';
const _aliases = {
  'ḏ': _dh,
  'dh': _dh,
  'ṯ': _th,
  'th': _th,
  'dž': _dz,
  'dz': _dz,
  'ḫ': 'h',
  'kh': 'h',
  'gh': 'g',
  'š': 's',
  'sh': 's',
  'q': 'k',
  'w': 'v',
};
final _quotes = RegExp(r"['‘’`ʿʾ]");
final _marks = RegExp(r'\p{M}', unicode: true);
final _separators = RegExp(r'[^\p{L}\p{N}]+', unicode: true);
final _transcriptionSeparators = RegExp(
  r'[^\p{L}\p{N}\uE000-\uE002]+',
  unicode: true,
);
final _aliasPattern = RegExp(_aliases.keys.join('|'));
final _longVowels = RegExp(r'a{2,}|i{2,}|u{2,}|e{2,}|o{2,}');
final _dashes = RegExp(r'[\p{Pd}\u2212]', unicode: true);
final _repeatedConsonants = RegExp(
  r'([bcdfghjklmnpqrstvwxyz\uE000-\uE002])\1+',
);

String _words(String text) => unicode
    .nfc(text)
    .toLowerCase()
    .replaceAll(_quotes, '')
    .replaceAll(_separators, ' ')
    .trim();

String normalizeDuaQuery(String text) => _words(
  unicode
      .nfd(text)
      .replaceAll(_marks, '')
      .replaceAll(RegExp('đ', caseSensitive: false), 'dj'),
);

String _transcriptionKey(String text) => unicode
    .nfd(
      unicode
          .nfc(text)
          .toLowerCase()
          .replaceAllMapped(_aliasPattern, (match) => _aliases[match[0]]!),
    )
    .replaceAll(_marks, '')
    .replaceAll('đ', 'dj')
    .replaceAll(_quotes, '')
    .replaceAllMapped(
      _longVowels,
      (match) => switch (match[0]![0]) {
        'e' => 'i',
        'o' => 'u',
        final vowel => vowel,
      },
    )
    .replaceAll(_dashes, '')
    .replaceAll(_transcriptionSeparators, ' ')
    .replaceAllMapped(_repeatedConsonants, (match) => match[1]!)
    .trim();

RegExp _transcriptionPattern(String key) => RegExp(
  key.runes
      .map(String.fromCharCode)
      .map(
        (letter) => switch (letter) {
          _dh => '[dz$_dh]',
          'd' => '[d$_dh]',
          'z' => '[z$_dh]',
          _th => '[ts$_th]',
          't' => '[t$_th]',
          's' => '[s$_th]',
          _ => RegExp.escape(letter),
        },
      )
      .join(),
  unicode: true,
);

class DuaSearch {
  DuaSearch(Iterable<Dua> items)
    : _index = {for (final dua in items) dua.id: _SearchEntry(dua)};

  final Map<String, _SearchEntry> _index;

  List<Dua> find(Iterable<Dua> scope, String query) {
    final normalized = normalizeDuaQuery(query);
    if (normalized.isEmpty) return scope.toList();

    final terms = _words(query).split(' ').map((word) {
      final ordinary = normalizeDuaQuery(word);
      return (
        ordinary: ordinary,
        relaxed: ordinary.length >= 3
            ? _transcriptionPattern(_transcriptionKey(word))
            : null,
      );
    }).toList();
    final phrase = normalized.replaceAll(' ', '').length >= 3
        ? _transcriptionPattern(_transcriptionKey(query).replaceAll(' ', ''))
        : null;
    final titles = <Dua>[], ordinary = <Dua>[], relaxed = <Dua>[];

    for (final dua in scope) {
      final entry = _index[dua.id]!;
      if (entry.titles.any((title) => title.contains(normalized))) {
        titles.add(dua);
        continue;
      }
      final direct = [
        for (final term in terms)
          entry.ordinary.any((field) => field.contains(term.ordinary)),
      ];
      if (direct.every((matched) => matched)) {
        ordinary.add(dua);
      } else if (terms.indexed.every((item) {
            final pattern = item.$2.relaxed;
            return direct[item.$1] ||
                (pattern != null && entry.transcriptions.any(pattern.hasMatch));
          }) ||
          (phrase != null && entry.transcriptions.any(phrase.hasMatch))) {
        relaxed.add(dua);
      }
    }
    return [...titles, ...ordinary, ...relaxed];
  }
}

class _SearchEntry {
  _SearchEntry(Dua dua) {
    titles = dua.title.values.map(normalizeDuaQuery).toList();
    final transcribed = [
      for (final saying in dua.sayings) ...saying.transcription.values,
    ];
    ordinary = [
      ...titles,
      for (final saying in dua.sayings)
        ...saying.translation.values.map(normalizeDuaQuery),
      ...transcribed.map(normalizeDuaQuery),
    ];
    transcriptions = [
      for (final key in transcribed.map(_transcriptionKey)) ...[
        key,
        key.replaceAll(' ', ''),
      ],
    ];
  }

  late final List<String> titles, ordinary, transcriptions;
}
