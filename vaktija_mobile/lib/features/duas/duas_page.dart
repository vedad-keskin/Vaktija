import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../app/vaktija_palette.dart';
import 'dua_card.dart';
import 'dua_catalog.dart';
import 'dua_search.dart';

class DuasPage extends StatefulWidget {
  const DuasPage({
    super.key,
    this.header,
    required this.language,
    required this.preferences,
    required this.onBack,
  });

  final Widget? header;
  final String language;
  final SharedPreferences preferences;
  final VoidCallback onBack;

  @override
  State<DuasPage> createState() => _DuasPageState();
}

class _DuasPageState extends State<DuasPage> {
  static const _pageSize = 10;
  static const _bookmarksKey = 'vaktija_saved_duas';

  final _query = TextEditingController();
  final _searchFocus = FocusNode();
  late final Set<String> _saved;
  late Future<DuaCatalog> _catalog;
  late DuaSearch _search;
  Future<void>? _bookmarkWrite;
  String _scope = 'all';
  int _visibleCount = _pageSize;
  bool _categoriesOpen = false;

  String get _language => widget.language;
  bool get _bosnian => _language == 'bs';

  @override
  void initState() {
    super.initState();
    _saved = (widget.preferences.getStringList(_bookmarksKey) ?? []).toSet();
    _catalog = _loadCatalog();
  }

  Future<DuaCatalog> _loadCatalog() async {
    final catalog = await DuaCatalog.load();
    _saved.retainAll(catalog.ids);
    _search = DuaSearch(catalog.items);
    return catalog;
  }

  @override
  void dispose() {
    _query.dispose();
    _searchFocus.dispose();
    super.dispose();
  }

  void _showScope(String scope) => setState(() {
    _scope = scope;
    _categoriesOpen = false;
    _visibleCount = _pageSize;
  });

  void _clearQuery() {
    _query.clear();
    _searchFocus.requestFocus();
    setState(() => _visibleCount = _pageSize);
  }

  void _toggleBookmark(String id, DuaLabels labels) {
    setState(() {
      if (!_saved.remove(id)) _saved.add(id);
    });
    final ids = _saved.toList();
    final preferences = widget.preferences;
    Future<void> persist() async {
      try {
        if (await preferences.setStringList(_bookmarksKey, ids)) return;
      } catch (_) {
        // Keep the current selection available while the page stays open.
      }
      if (mounted) {
        showDuaMessage(context, labels['duasStorageError']!, error: true);
      }
    }

    _bookmarkWrite = _bookmarkWrite?.then((_) => persist()) ?? persist();
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<DuaCatalog>(
    future: _catalog,
    builder: (context, snapshot) {
      final catalog = snapshot.data;
      return LayoutBuilder(
        builder: (context, constraints) {
          final gutter = math.max(12.0, (constraints.maxWidth - 936) / 2);
          return CustomScrollView(
            key: const PageStorageKey('duas-reading'),
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            slivers: [
              if (widget.header case final header?)
                SliverToBoxAdapter(child: header),
              if (catalog == null)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Center(
                      child: snapshot.hasError
                          ? TextButton(
                              onPressed: () =>
                                  setState(() => _catalog = _loadCatalog()),
                              child: Text(
                                _bosnian ? 'Pokušaj ponovo' : 'Try again',
                              ),
                            )
                          : const CircularProgressIndicator(),
                    ),
                  ),
                )
              else
                ..._collection(context, catalog, gutter),
            ],
          );
        },
      );
    },
  );

  List<Widget> _collection(
    BuildContext context,
    DuaCatalog catalog,
    double gutter,
  ) {
    final colors = VaktijaPalette.of(context);
    final labels = catalog.labels(_language);
    final category = catalog.categories[_scope];
    final matches = _search.find(
      _scope == 'saved'
          ? catalog.items.where((dua) => _saved.contains(dua.id))
          : category?.items ?? catalog.browsingOrder,
      _query.text,
    );
    final searching = normalizeDuaQuery(_query.text).isNotEmpty;
    final shown = math.min(_visibleCount, matches.length);

    return [
      SliverPadding(
        padding: EdgeInsets.fromLTRB(gutter, 24, gutter, 8),
        sliver: SliverToBoxAdapter(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _heading(labels, colors),
              const SizedBox(height: 24),
              _searchField(labels, colors),
              const SizedBox(height: 10),
              _filters(context, catalog, labels, colors, category),
            ],
          ),
        ),
      ),
      SliverPadding(
        padding: EdgeInsets.fromLTRB(gutter, 0, gutter, 32),
        sliver: matches.isEmpty
            ? SliverToBoxAdapter(child: _empty(labels, colors, searching))
            : SliverList.builder(
                itemCount: shown + (shown < matches.length ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == shown) {
                    return Center(
                      child: _pill(
                        colors,
                        onPressed: () =>
                            setState(() => _visibleCount += _pageSize),
                        child: Text(labels['showMore']!),
                      ),
                    );
                  }
                  final dua = matches[index];
                  return Padding(
                    key: ValueKey(dua.id),
                    padding: const EdgeInsets.only(bottom: 16),
                    child: DuaCard(
                      dua: dua,
                      language: _language,
                      labels: labels,
                      saved: _saved.contains(dua.id),
                      onBookmark: () => _toggleBookmark(dua.id, labels),
                    ),
                  );
                },
              ),
      ),
    ];
  }

  Widget _heading(DuaLabels labels, VaktijaPalette colors) => Column(
    children: [
      Stack(
        alignment: Alignment.center,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 52),
            child: Semantics(
              header: true,
              child: Text(
                labels['duasTitle']!,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: duaDisplayFont,
                  fontSize: 40,
                  fontWeight: FontWeight.w600,
                  height: 1.1,
                  color: colors.heroText,
                ),
              ),
            ),
          ),
          Align(
            alignment: Alignment.centerLeft,
            child: IconButton(
              tooltip: labels['qiblaBackToTimes'],
              onPressed: widget.onBack,
              icon: Icon(
                Icons.arrow_back_rounded,
                size: 22,
                color: colors.secondary,
              ),
            ),
          ),
        ],
      ),
      const Padding(
        padding: EdgeInsets.symmetric(vertical: 14),
        child: DuaDivider(width: 180),
      ),
      Text(
        labels['duasSubtitle']!,
        textAlign: TextAlign.center,
        style: TextStyle(
          fontFamily: duaDisplayFont,
          fontSize: 22,
          color: colors.secondary,
        ),
      ),
    ],
  );

  Widget _searchField(DuaLabels labels, VaktijaPalette colors) {
    OutlineInputBorder border(Color color) => OutlineInputBorder(
      borderRadius: BorderRadius.circular(16),
      borderSide: BorderSide(color: color),
    );

    return TextField(
      controller: _query,
      focusNode: _searchFocus,
      textInputAction: TextInputAction.search,
      autocorrect: false,
      enableSuggestions: false,
      style: TextStyle(fontSize: 16, color: colors.text),
      decoration: InputDecoration(
        hintText: labels['duasSearch'],
        hintStyle: TextStyle(fontSize: 16, color: colors.secondary),
        prefixIcon: const Icon(Icons.search_rounded, size: 24),
        prefixIconColor: colors.secondary,
        suffixIcon: _query.text.isEmpty
            ? null
            : IconButton(
                tooltip: labels['duasClearSearch'],
                onPressed: _clearQuery,
                icon: Icon(Icons.close_rounded, color: colors.secondary),
              ),
        filled: true,
        fillColor: colors.panel,
        enabledBorder: border(colors.border),
        focusedBorder: border(colors.gold),
        contentPadding: const EdgeInsets.symmetric(
          vertical: 14,
          horizontal: 12,
        ),
      ),
      onChanged: (_) => setState(() => _visibleCount = _pageSize),
    );
  }

  Widget _filters(
    BuildContext context,
    DuaCatalog catalog,
    DuaLabels labels,
    VaktijaPalette colors,
    DuaCategory? category,
  ) {
    final largeText = MediaQuery.textScalerOf(context).scale(14) > 19;
    final duration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : const Duration(milliseconds: 180);
    final all = _pill(
      colors,
      active: _scope == 'all',
      onPressed: () => _showScope('all'),
      child: Text(labels['duasAll']!),
    );
    final saved = _pill(
      colors,
      active: _scope == 'saved',
      onPressed: () => _showScope('saved'),
      child: Semantics(
        label: '${labels['duasSaved']}, ${_saved.length}',
        excludeSemantics: true,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              _scope == 'saved'
                  ? Icons.bookmark_rounded
                  : Icons.bookmark_border_rounded,
              size: 17,
            ),
            const SizedBox(width: 8),
            DecoratedBox(
              decoration: BoxDecoration(
                color: colors.surface,
                shape: BoxShape.circle,
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                child: Text(
                  '${_saved.length}',
                  style: TextStyle(color: colors.gold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
    final categoryName =
        category?.label[_language] ?? labels['duasCategories']!;
    final categories = Semantics(
      expanded: _categoriesOpen,
      child: _pill(
        colors,
        active: category != null,
        onPressed: () {
          _searchFocus.unfocus();
          setState(() => _categoriesOpen = !_categoriesOpen);
        },
        child: Row(
          children: [
            Expanded(child: Text(categoryName, textAlign: TextAlign.center)),
            AnimatedRotation(
              turns: _categoriesOpen ? .5 : 0,
              duration: duration,
              child: const Icon(Icons.keyboard_arrow_down_rounded, size: 18),
            ),
          ],
        ),
      ),
    );

    return TapRegion(
      onTapOutside: (_) {
        if (_categoriesOpen) setState(() => _categoriesOpen = false);
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          LayoutBuilder(
            builder: (context, bounds) => largeText || bounds.maxWidth < 270
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Wrap(spacing: 6, runSpacing: 6, children: [all, saved]),
                      const SizedBox(height: 6),
                      categories,
                    ],
                  )
                : Row(
                    children: [
                      all,
                      const SizedBox(width: 6),
                      saved,
                      const SizedBox(width: 6),
                      Expanded(child: categories),
                    ],
                  ),
          ),
          AnimatedSize(
            duration: duration,
            alignment: Alignment.topCenter,
            child: _categoriesOpen
                ? Padding(
                    padding: const EdgeInsets.fromLTRB(0, 12, 0, 6),
                    child: Wrap(
                      alignment: WrapAlignment.center,
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final category in catalog.orderedCategories(
                          _language,
                        ))
                          _pill(
                            colors,
                            active: _scope == category.id,
                            onPressed: () => _showScope(category.id),
                            child: Text(category.label[_language]!),
                          ),
                      ],
                    ),
                  )
                : const SizedBox(width: double.infinity),
          ),
        ],
      ),
    );
  }

  Widget _empty(DuaLabels labels, VaktijaPalette colors, bool searching) =>
      Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: colors.sky,
          border: Border.all(color: colors.heroBorder),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Image.asset(duaRosette, width: 56, excludeFromSemantics: true),
            const SizedBox(height: 10),
            Text(
              labels[searching ? 'duasNoResultsTitle' : 'duasEmptyTitle']!,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: duaDisplayFont,
                fontSize: 25,
                color: colors.heroText,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              labels[searching ? 'duasNoResultsBody' : 'duasEmptyBody']!,
              textAlign: TextAlign.center,
              style: TextStyle(color: colors.secondary),
            ),
            const SizedBox(height: 14),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: [
                if (searching)
                  _pill(
                    colors,
                    onPressed: _clearQuery,
                    child: Text(labels['duasClearSearch']!),
                  ),
                if (_scope != 'all')
                  _pill(
                    colors,
                    onPressed: () => _showScope('all'),
                    child: Text(
                      labels[searching ? 'duasSearchAll' : 'duasBrowse']!,
                    ),
                  ),
              ],
            ),
          ],
        ),
      );

  Widget _pill(
    VaktijaPalette colors, {
    required Widget child,
    required VoidCallback onPressed,
    bool active = false,
  }) => Semantics(
    selected: active,
    child: TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        minimumSize: const Size(0, 44),
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        backgroundColor: active ? colors.selected : colors.panel,
        foregroundColor: active ? colors.text : colors.secondary,
        side: BorderSide(color: active ? colors.gold : colors.border),
        shape: const StadiumBorder(),
        textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
      ),
      child: child,
    ),
  );
}
