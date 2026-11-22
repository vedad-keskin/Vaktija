import 'dart:convert';

import 'package:flutter/services.dart';

typedef DuaLabels = Map<String, String>;

Map<String, Object?> _object(Object? json) => json as Map<String, Object?>;
DuaLabels _localized(Object? json) => _object(json).cast<String, String>();

const duaAssets = 'assets/duas';

class DuaCatalog {
  DuaCatalog._(Map<String, Object?> json)
    : categories = {
        for (final category in json['categories'] as List<Object?>)
          (_object(category)['id'] as String): DuaCategory._(_object(category)),
      },
      _categoryOrder = _object(json['categoryOrder']),
      _labels = _object(json['labels']);

  final Map<String, DuaCategory> categories;
  final Map<String, Object?> _categoryOrder, _labels;

  late final items = [
    for (final category in categories.values) ...category.items,
  ];
  late final ids = items.map((dua) => dua.id).toSet();
  late final browsingOrder = [
    ...?categories['general']?.items,
    for (final category in categories.values)
      if (category.id != 'general') ...category.items,
  ];

  DuaLabels labels(String language) => _localized(_labels[language]);

  Iterable<DuaCategory> orderedCategories(String language) =>
      (_categoryOrder[language] as List<Object?>).map((id) => categories[id]!);

  static Future<DuaCatalog> load() async => DuaCatalog._(
    _object(jsonDecode(await rootBundle.loadString('$duaAssets/catalog.json'))),
  );
}

class DuaCategory {
  DuaCategory._(Map<String, Object?> json)
    : id = json['id'] as String,
      label = _localized(json['label']),
      items = [
        for (final entry in json['items'] as List<Object?>)
          Dua._(_object(entry)),
      ];

  final String id;
  final DuaLabels label;
  final List<Dua> items;
}

class Dua {
  Dua._(Map<String, Object?> json)
    : id = json['id'] as String,
      title = _localized(json['title']),
      sayings = [
        for (final saying in json['sayings'] as List<Object?>)
          DuaSaying._(_object(saying)),
      ],
      source = json['source'] == null
          ? null
          : DuaSource._(_object(json['source']));

  final String id;
  final DuaLabels title;
  final List<DuaSaying> sayings;
  final DuaSource? source;

  String copyText(String language) => [
    title[language]!,
    for (final saying in sayings)
      [
        saying.arabic,
        ?saying.instructions?[language],
        saying.transcription[language]!,
        saying.translation[language]!,
        for (final source in saying.sources) source.copyText(language),
      ].join('\n\n'),
    if (source case final entrySource?) entrySource.copyText(language),
  ].where((part) => part.isNotEmpty).join('\n\n');
}

class DuaSaying {
  DuaSaying._(Map<String, Object?> json)
    : arabic = json['arabic'] as String,
      transcription = _localized(json['transcription']),
      translation = _localized(json['translation']),
      instructions = json['instructions'] == null
          ? null
          : _localized(json['instructions']),
      sources = [
        for (final source in (json['sources'] as List<Object?>? ?? const []))
          DuaSource._(_object(source)),
      ];

  final String arabic;
  final DuaLabels transcription, translation;
  final DuaLabels? instructions;
  final List<DuaSource> sources;
}

class DuaSource {
  DuaSource._(Map<String, Object?> json)
    : reference = _localized(json['reference']),
      _sourceUrl = json['sourceUrl'] as String,
      _bosnianSourceUrl = json['bosnianSourceUrl'] as String?;

  final DuaLabels reference;
  final String _sourceUrl;
  final String? _bosnianSourceUrl;

  String url(String language) =>
      language == 'bs' ? _bosnianSourceUrl ?? _sourceUrl : _sourceUrl;

  String copyText(String language) =>
      '${reference[language]}\n${url(language)}';
}
