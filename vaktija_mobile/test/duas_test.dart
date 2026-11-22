import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vaktija/app/app_shell.dart';
import 'package:vaktija/features/duas/dua_catalog.dart';
import 'package:vaktija/features/duas/dua_search.dart';
import 'package:vaktija/features/prayer_times/prayer_repository.dart';
import 'package:vaktija/features/prayer_times/timetable.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'bundled duas preserve web search across languages and sayings',
    () async {
      final catalog = await DuaCatalog.load();
      final search = DuaSearch(catalog.items);
      List<String> ids(String query) => search
          .find(catalog.browsingOrder, query)
          .map((dua) => dua.id)
          .toList();

      expect(catalog.ids, hasLength(113));
      expect(catalog.categories, hasLength(26));
      expect(catalog.orderedCategories('en').first.id, 'general');
      expect(ids('').first, 'quran-28-24');
      expect(ids('toalet').first, 'hisn-10');
      for (final query in [
        'E‘ūḏu',
        'eudhu',
        'khubti',
        'khubsi',
        'eudubikeminelhubsi',
        'euzu toalet',
        'evil ones',
      ]) {
        expect(ids(query), contains('hisn-10'), reason: query);
      }
      for (final query in ['Estagfirullāh', 'Astaghfirullāh', 'forgiveness']) {
        expect(ids(query).where((id) => id == 'hisn-66'), hasLength(1));
      }
      expect(ids('elhamdulillah'), contains('hisn-188'));
      expect(ids('toalet nonexistentword'), isEmpty);
      expect(ids('[.*+?^{}()]'), ids(''));
      expect(normalizeDuaQuery('  ĐŽĀMIJA… ČĆŠŽ  '), 'djzamija ccsz');
    },
  );

  testWidgets('Duas opens from the mobile menu and copies the held block', (
    tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(384, 832);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetViewInsets);
    final (repository, catalog) = (await tester.runAsync(() async {
      SharedPreferences.setMockInitialValues({
        'method': 'iz',
        'language': 'bs',
      });
      await (FontLoader('Vaktija Sans')
            ..addFont(rootBundle.load('assets/fonts/vaktija-sans-400.ttf'))
            ..addFont(rootBundle.load('assets/fonts/vaktija-sans-600.ttf')))
          .load();
      await (FontLoader('Cormorant Garamond')..addFont(
            rootBundle.load('assets/fonts/cormorant-garamond-600.ttf'),
          ))
          .load();
      await (FontLoader(
        'Amiri',
      )..addFont(rootBundle.load('assets/fonts/amiri-arabic.ttf'))).load();
      return (
        PrayerRepository(
          await PrayerCatalog.load(),
          await SharedPreferences.getInstance(),
        ),
        await DuaCatalog.load(),
      );
    }))!;
    String? copied;
    var copyImpacts = 0;
    final messenger = tester.binding.defaultBinaryMessenger;
    messenger.setMockMethodCallHandler(SystemChannels.platform, (call) async {
      if (call.method == 'Clipboard.setData') {
        copied = (call.arguments as Map)['text'] as String;
      } else if (call.method == 'HapticFeedback.vibrate' &&
          call.arguments == 'HapticFeedbackType.lightImpact') {
        copyImpacts++;
      }
      return null;
    });
    addTearDown(
      () => messenger.setMockMethodCallHandler(SystemChannels.platform, null),
    );

    await tester.pumpWidget(
      MaterialApp(
        theme: ThemeData.dark().copyWith(
          textTheme: ThemeData.dark().textTheme.apply(
            fontFamily: 'Vaktija Sans',
          ),
        ),
        home: AppShell(repository: repository, onThemeChanged: (_) {}),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('Meni'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('DOVE'));
    await tester.runAsync(() async {
      await tester.pump();
      await rootBundle.loadString('$duaAssets/catalog.json');
    });
    await tester.pumpAndSettle();
    expect(find.text('Dove za svaki dan'), findsOneWidget);
    expect(find.text('Dova potrebe'), findsOneWidget);
    await tester.tap(find.byTooltip('Meni'));
    await tester.pumpAndSettle();
    expect(find.text('DOVE').hitTestable(), findsOneWidget);
    await tester.tap(find.text('DOVE'));
    await tester.pumpAndSettle();
    final bookmark = find.byTooltip('Sačuvaj dovu · Dova potrebe');
    await tester.ensureVisible(bookmark);
    await tester.tap(bookmark);
    await tester.pumpAndSettle();
    expect(
      find.byTooltip('Ukloni iz sačuvanih · Dova potrebe'),
      findsOneWidget,
    );
    expect(repository.preferences.getStringList('vaktija_saved_duas'), [
      'quran-28-24',
    ]);

    final duasScroll = find
        .descendant(
          of: find.byKey(const PageStorageKey('duas-reading')),
          matching: find.byType(Scrollable),
        )
        .first;
    tester.state<ScrollableState>(duasScroll).position.jumpTo(0);
    await tester.pumpAndSettle();
    final semantics = tester.ensureSemantics();
    final saved = find.bySemanticsLabel('Sačuvane, 1');
    await tester.ensureVisible(saved);
    await tester.tap(saved);
    semantics.dispose();
    await tester.pumpAndSettle();
    final search = find.byType(TextField);
    await tester.ensureVisible(search);
    await tester.enterText(search, 'upon sneezing');
    await tester.pumpAndSettle();
    final searchAll = find.text('Pretraži sve dove');
    await tester.ensureVisible(searchAll);
    await tester.tap(searchAll);
    await tester.testTextInput.receiveAction(TextInputAction.search);
    await tester.pumpAndSettle();
    expect(find.text('Dova prilikom kihanja'), findsOneWidget);
    expect(find.textContaining('Rezultati'), findsNothing);

    final dua = catalog.items.firstWhere((entry) => entry.id == 'hisn-188');
    final second = dua.sayings[1];
    final arabic = tester.widget<Text>(find.text(second.arabic));
    expect(arabic.textDirection, TextDirection.rtl);
    expect(arabic.style?.fontFamily, 'Amiri');
    for (final (block, text, notice) in [
      (dua.title['bs']!, dua.copyText('bs'), 'Dova kopirana'),
      (second.arabic, second.arabic, 'Arapski tekst kopiran'),
      (
        second.instructions!['bs']!,
        second.instructions!['bs']!,
        'Uputa kopirana',
      ),
      (
        second.transcription['bs']!,
        second.transcription['bs']!,
        'Transkripcija kopirana',
      ),
      (
        second.translation['bs']!,
        second.translation['bs']!,
        'Prijevod kopiran',
      ),
    ]) {
      final target = find.text(block);
      await tester.ensureVisible(target);
      final previousImpacts = copyImpacts;
      await tester.longPress(target);
      await tester.pumpAndSettle();
      expect(copied, text);
      expect(copyImpacts, previousImpacts + 1);
      expect(find.text(notice), findsOneWidget);
    }
    expect(copied, second.translation['bs']);
    expect(dua.copyText('bs'), contains(dua.sayings.last.arabic));
    expect(dua.copyText('bs'), contains(dua.source!.url('bs')));

    tester.view.physicalSize = const Size(320, 640);
    tester.platformDispatcher.textScaleFactorTestValue = 2;
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text(dua.sayings.last.arabic));
    expect(tester.takeException(), isNull);
    tester.state<ScrollableState>(duasScroll).position.jumpTo(0);
    await tester.pumpAndSettle();
    await tester.ensureVisible(search);
    await tester.pumpAndSettle();
    await tester.enterText(search, 'dua after prayer');
    await tester.testTextInput.receiveAction(TextInputAction.search);
    await tester.pumpAndSettle();
    final longest = catalog.items.firstWhere((dua) => dua.id == 'hisn-66');
    final lastSaying = find.text(longest.sayings.last.arabic);
    await tester.ensureVisible(lastSaying);
    await tester.pumpAndSettle();
    expect(lastSaying.hitTestable(), findsOneWidget);
    expect(tester.takeException(), isNull);
    tester.view.physicalSize = const Size(832, 384);
    tester.view.viewInsets = const FakeViewPadding(bottom: 176);
    tester.state<ScrollableState>(duasScroll).position.jumpTo(0);
    await tester.pumpAndSettle();
    await tester.ensureVisible(search);
    await tester.pumpAndSettle();
    expect(search.hitTestable(), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
