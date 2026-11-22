import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vaktija/app/app_shell.dart';
import 'package:vaktija/app/method_help_popover.dart';
import 'package:vaktija/app/mobile_header.dart';
import 'package:vaktija/app/vaktija_palette.dart';
import 'package:vaktija/features/prayer_times/prayer_page.dart';
import 'package:vaktija/features/prayer_times/prayer_repository.dart';
import 'package:vaktija/features/prayer_times/prayer_timetable_view.dart';
import 'package:vaktija/features/prayer_times/timetable.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('method help anchors to its switcher and can be toggled', (
    tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    final catalog = (await tester.runAsync(PrayerCatalog.load))!;

    for (final (dark, viewport) in [
      (true, const Size(832, 304)),
      (false, const Size(320, 640)),
    ]) {
      tester.view.physicalSize = viewport;
      final labels = catalog.labels(dark);
      await tester.pumpWidget(
        MaterialApp(
          theme: ThemeData(
            brightness: dark ? Brightness.dark : Brightness.light,
          ),
          builder: (context, child) => MediaQuery(
            data: MediaQuery.of(
              context,
            ).copyWith(textScaler: const TextScaler.linear(1.45)),
            child: child!,
          ),
          home: Scaffold(
            body: Stack(
              fit: StackFit.expand,
              children: [
                Positioned(
                  top: 150,
                  left: 0,
                  right: 0,
                  child: VaktijaMenu(
                    open: true,
                    labels: labels,
                    section: MobileSection.prayerTimes,
                    method: PrayerMethod.iz,
                    onSection: (_) {},
                    onMethod: (_) =>
                        fail('Info must preserve the selected method'),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      final angle = find.byTooltip(labels['method146HelpAria']);
      final iz = find.byTooltip(labels['methodIzHelpAria']);
      final anchor = tester.getRect(
        find.byKey(const ValueKey('method-switcher')),
      );
      await tester.tap(angle);
      await tester.pumpAndSettle();
      final details = find.byType(MethodHelpPopover);
      final card = tester.getRect(details);
      expect(card.center.dx, anchor.center.dx);
      expect(
        tester
            .widget<Material>(
              find.descendant(of: details, matching: find.byType(Material)),
            )
            .color,
        VaktijaPalette(dark).panel,
      );
      expect(find.text(labels['method146Tooltip']), findsOneWidget);

      if (dark) {
        expect(card.bottom, closeTo(anchor.top - 12, .01));
        final scrollable = find.descendant(
          of: details,
          matching: find.byType(Scrollable),
        );
        await tester.drag(scrollable, const Offset(0, -180));
        await tester.pumpAndSettle();
        expect(
          tester.state<ScrollableState>(scrollable).position.pixels,
          greaterThan(0),
        );
      } else {
        expect(card.top, closeTo(anchor.bottom + 12, .01));
        expect(card.width, anchor.width);
      }

      await tester.tap(angle);
      await tester.pumpAndSettle();
      expect(details, findsNothing);

      await tester.tap(angle);
      await tester.pumpAndSettle();
      await tester.tap(iz);
      await tester.pumpAndSettle();
      expect(find.text(labels['method146Tooltip']), findsNothing);
      expect(find.text(labels['methodIzTooltip']), findsOneWidget);

      await tester.tapAt(const Offset(4, 32));
      await tester.pumpAndSettle();
      expect(details, findsNothing);
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('mobile countdown, city search and animated header controls', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(320, 640);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPadding);
    addTearDown(tester.view.resetViewPadding);
    addTearDown(tester.view.resetViewInsets);
    final repository = (await tester.runAsync(() async {
      SharedPreferences.setMockInitialValues({'language': 'bs'});
      await (FontLoader('Vaktija Sans')
            ..addFont(rootBundle.load('assets/fonts/vaktija-sans-400.ttf'))
            ..addFont(rootBundle.load('assets/fonts/vaktija-sans-600.ttf')))
          .load();
      return PrayerRepository(
        await PrayerCatalog.load(),
        await SharedPreferences.getInstance(),
      );
    }))!;

    var themeMode = ThemeMode.dark;
    await tester.pumpWidget(
      StatefulBuilder(
        builder: (context, setTheme) => MaterialApp(
          themeMode: themeMode,
          theme: ThemeData(fontFamily: 'Vaktija Sans'),
          darkTheme: ThemeData(
            brightness: Brightness.dark,
            fontFamily: 'Vaktija Sans',
          ),
          themeAnimationDuration: Duration.zero,
          home: AppShell(
            repository: repository,
            onThemeChanged: (dark) {
              setTheme(
                () => themeMode = dark ? ThemeMode.dark : ThemeMode.light,
              );
            },
          ),
        ),
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 250));
    await tester.ensureVisible(find.text('Islamska zajednica'));
    await tester.tap(find.text('Islamska zajednica'));
    await tester.pump();
    await tester.ensureVisible(find.text('Potvrdi izbor'));
    await tester.tap(find.text('Potvrdi izbor'));
    await tester.pumpAndSettle();
    expect(repository.preferences.getString('method'), 'iz');
    expect(find.text('Zora (sabah)'), findsWidgets);

    const channel = MethodChannel('vaktija/fullscreen');
    final messenger = tester.binding.defaultBinaryMessenger;
    final bars = <bool>[];
    messenger.setMockMethodCallHandler(channel, (call) async {
      expect(call.method, 'setEnabled');
      bars.add(call.arguments as bool);
      return null;
    });
    addTearDown(() => messenger.setMockMethodCallHandler(channel, null));

    final regularScroll = find.descendant(
      of: find.byKey(const PageStorageKey('regular-prayer-timetable')),
      matching: find.byType(Scrollable),
    );
    tester.state<ScrollableState>(regularScroll).position.jumpTo(16);
    await tester.pumpAndSettle();
    final pageState = tester.state(find.byType(PrayerPage));
    final timetable = find.byType(PrayerTimetableView);
    final regularView = tester.widget<PrayerTimetableView>(timetable);
    final regularTimes = regularView.times;
    final labels = repository.catalog.labels(true);
    final firstRow = find
        .widgetWithText(Container, labels.prayer(regularTimes.first))
        .first;
    final enter = find.byTooltip('Cijeli ekran');
    final exit = find.byTooltip('Izađi iz cijelog ekrana');
    final header = find.byKey(const ValueKey('prayer-countdown'));
    Finder inHeader(Finder finder) =>
        find.descendant(of: header, matching: finder);
    final date = labels.date(regularView.now);
    expect(inHeader(find.text(date)), findsOneWidget);
    final details = [
      inHeader(find.text(labels['nextTime'].toUpperCase())),
      inHeader(
        find.byWidgetPredicate(
          (widget) =>
              widget is Semantics &&
              widget.properties.label == labels['countdownProgressAria'],
        ),
      ),
    ];
    for (final detail in details) {
      expect(detail, findsOneWidget);
    }
    tester.view.padding = const FakeViewPadding(top: 34, bottom: 24);
    tester.view.viewPadding = tester.view.padding;
    await tester.pumpAndSettle();
    final regularHeader = tester.getRect(header);
    await tester.tap(enter);
    await tester.pump();
    expect(tester.getRect(header), regularHeader);
    final stationaryRow = tester.widget(firstRow);
    final regularRowHeight = tester.getSize(firstRow).height;
    final slidingCard = tester.widget(header);
    await tester.pump(const Duration(milliseconds: 16));
    expect(tester.widget(firstRow), same(stationaryRow));
    expect(tester.widget(header), same(slidingCard));
    var previousTop = regularHeader.top;
    for (var frame = 0; frame < 8; frame++) {
      await tester.pump(const Duration(milliseconds: 32));
      final top = tester.getTopLeft(header).dy;
      expect(previousTop - top, inInclusiveRange(-.01, 28));
      expect(tester.getSize(header), regularHeader.size);
      previousTop = top;
    }
    expect(bars, isEmpty);
    final enteringHeader = tester.getRect(header);
    await tester.pumpAndSettle();
    final fullscreenHeader = tester.getRect(header);
    expect(tester.getSize(firstRow).height, lessThan(regularRowHeight));
    expect(bars, [true]);
    for (final detail in details) {
      expect(detail, findsOneWidget);
    }
    expect(inHeader(find.text('${regularView.city} · $date')), findsOneWidget);
    final interval = tester.widget<PrayerTimetableView>(timetable).interval!;
    expect(inHeader(find.text(labels.prayer(interval.next))), findsOneWidget);
    expect(
      inHeader(
        find.byWidgetPredicate(
          (widget) =>
              widget is Semantics &&
              widget.properties.label == interval.remainingParts.join(':'),
        ),
      ),
      findsOneWidget,
    );
    tester.view.padding = const FakeViewPadding(top: 8);
    tester.view.viewPadding = tester.view.padding;
    await tester.pump();
    expect(tester.getRect(header), fullscreenHeader);
    await tester.pump(const Duration(milliseconds: 110));
    expect(
      tester.getTopLeft(header).dy,
      inExclusiveRange(16, fullscreenHeader.top),
    );
    await tester.pumpAndSettle();
    expect(tester.getTopLeft(header).dy, closeTo(16, .01));
    expect(tester.getSize(header), regularHeader.size);
    expect(enteringHeader.top, lessThan(regularHeader.top));
    expect(fullscreenHeader.top, lessThan(enteringHeader.top));
    expect(fullscreenHeader.size, regularHeader.size);
    expect(find.byType(MobileHeader), findsNothing);
    expect(tester.state(find.byType(PrayerPage)), same(pageState));
    expect(tester.widget<PrayerTimetableView>(timetable).times, regularTimes);

    final fullscreenScroll = find.descendant(
      of: timetable,
      matching: find.byType(Scrollable),
    );
    final lastRow = find
        .widgetWithText(Container, labels.prayer(regularTimes.last))
        .first;
    for (final (size, insets) in [
      (const Size(384, 832), const FakeViewPadding(top: 34, bottom: 24)),
      (const Size(412, 915), const FakeViewPadding(top: 30)),
      (const Size(320, 640), const FakeViewPadding()),
      (const Size(832, 384), const FakeViewPadding(left: 24, right: 24)),
    ]) {
      tester.view.physicalSize = size;
      tester.view.padding = insets;
      tester.view.viewPadding = insets;
      await tester.pumpAndSettle();
      expect(exit.hitTestable(), findsOneWidget);
      final position = tester.state<ScrollableState>(fullscreenScroll).position;
      if (size.width > size.height) {
        position.jumpTo(position.maxScrollExtent);
        await tester.pumpAndSettle();
        expect(lastRow.hitTestable(), findsOneWidget);
      } else {
        expect(position.maxScrollExtent, closeTo(0, .01));
      }
      expect(
        tester.getBottomLeft(lastRow).dy,
        closeTo(size.height - insets.bottom - 12, .5),
        reason: 'The timetable should use the safe height at $size',
      );
    }
    expect(
      tester.getTopLeft(lastRow).dx,
      greaterThan(tester.getTopLeft(firstRow).dx),
    );

    tester.view.physicalSize = const Size(320, 400);
    tester.view.padding = const FakeViewPadding();
    tester.view.viewPadding = tester.view.padding;
    tester.platformDispatcher.textScaleFactorTestValue = 2;
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    final shortPosition = tester
        .state<ScrollableState>(fullscreenScroll)
        .position;
    shortPosition.jumpTo(0);
    await tester.pumpAndSettle();
    expect(exit.hitTestable(), findsOneWidget);
    await tester.drag(fullscreenScroll, const Offset(0, -160));
    await tester.pumpAndSettle();
    expect(shortPosition.pixels, greaterThan(0));
    shortPosition.jumpTo(shortPosition.maxScrollExtent);
    await tester.pumpAndSettle();
    expect(lastRow.hitTestable(), findsOneWidget);
    shortPosition.jumpTo(0);
    await tester.pumpAndSettle();
    expect(exit.hitTestable(), findsOneWidget);

    tester.platformDispatcher.clearTextScaleFactorTestValue();
    tester.view.physicalSize = const Size(320, 640);
    await tester.pumpAndSettle();
    final beforeBack = tester.getRect(header);
    await tester.binding.handlePopRoute();
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 250));
    final exitingHeader = tester.getRect(header);
    await tester.pumpAndSettle();
    expect(exitingHeader.top, greaterThan(beforeBack.top));
    expect(exitingHeader.size, beforeBack.size);
    expect(tester.getRect(header).top, greaterThan(exitingHeader.top));
    expect(tester.getSize(header), beforeBack.size);
    expect(enter.hitTestable(), findsOneWidget);
    expect(tester.state<ScrollableState>(regularScroll).position.pixels, 16);
    expect(tester.state(find.byType(PrayerPage)), same(pageState));
    await tester.tap(enter);
    await tester.pumpAndSettle();
    await tester.tap(exit);
    await tester.pumpAndSettle();
    expect(enter.hitTestable(), findsOneWidget);
    expect(bars, [true, false, true, false]);

    final pickers = find.descendant(
      of: find.byType(MobileHeader),
      matching: find.byType(FractionallySizedBox),
    );
    final language = pickers.last;
    final appearance = pickers.first;
    final semantics = tester.ensureSemantics();
    for (final (slider, option, restore) in [
      (language, 'English', 'Bosanski'),
      (appearance, 'Dan', 'Noć'),
    ]) {
      final before = tester.getCenter(slider).dx;
      await tester.tap(find.bySemanticsLabel(option));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      final mid = tester.getCenter(slider).dx;
      await tester.pumpAndSettle();
      final after = tester.getCenter(slider).dx;
      expect((mid - before) * (after - mid), greaterThan(0));
      await tester.tap(find.bySemanticsLabel(restore));
      await tester.pumpAndSettle();
    }
    semantics.dispose();

    final cityTrigger = tester.getRect(
      find.byKey(const ValueKey('city-trigger')),
    );
    await tester.tap(find.text('Sarajevo'));
    await tester.pumpAndSettle();
    final dropdown = tester.getRect(find.byType(CityChoices));
    expect(dropdown.top - cityTrigger.bottom, closeTo(6, .01));
    expect(dropdown.width, cityTrigger.width);
    expect(
      tester.getSize(find.byType(TextField)).height,
      greaterThanOrEqualTo(44),
    );
    await tester.enterText(find.byType(TextField), 'Jablanica');
    await tester.pumpAndSettle();
    await tester.tap(find.text('Jablanica').last);
    await tester.pumpAndSettle();
    expect(
      repository.preferences.getInt('city'),
      repository.catalog.cities
          .firstWhere((city) => city.name == 'Jablanica')
          .id,
    );

    tester.view.physicalSize = const Size(832, 384);
    tester.view.padding = const FakeViewPadding(top: 24);
    tester.view.viewPadding = const FakeViewPadding(top: 24);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Jablanica'));
    await tester.pumpAndSettle();
    await tester.tap(find.byType(TextField));
    tester.view.viewInsets = const FakeViewPadding(bottom: 240);
    await tester.enterText(find.byType(TextField), 'Sara');
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    final landscapeDropdown = tester.getRect(find.byType(CityChoices));
    expect(landscapeDropdown.top, greaterThanOrEqualTo(24));
    expect(landscapeDropdown.bottom, lessThanOrEqualTo(144));
    final result = find.text('Sarajevo');
    expect(result.hitTestable(), findsOneWidget);
    await tester.tap(result);
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    expect(repository.preferences.getInt('city'), 77);
    expect(find.byType(CityChoices), findsNothing);
    tester.view.resetViewInsets();
    tester.view.resetViewPadding();
    tester.view.resetPadding();
    tester.view.physicalSize = const Size(320, 640);
    await tester.pumpAndSettle();

    for (final (action, page) in [('DOVE', 'Dove'), ('ZIKROVI', 'Zikrovi')]) {
      await tester.tap(find.byTooltip('Meni'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      final part = tester.getSize(find.byType(VaktijaMenu)).height;
      await tester.pumpAndSettle();
      expect(part, greaterThan(0));
      expect(part, lessThan(tester.getSize(find.byType(VaktijaMenu)).height));
      await tester.tap(find.text(action));
      await tester.pumpAndSettle();
      expect(find.text(page), findsOneWidget);
      await tester.binding.handlePopRoute();
      await tester.pumpAndSettle();
    }
    expect(find.text('Zora (sabah)'), findsWidgets);
    await tester.pumpWidget(const SizedBox.shrink());
  });
}
