import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vaktija/app/app_shell.dart';
import 'package:vaktija/app/mobile_header.dart';
import 'package:vaktija/features/prayer_times/prayer_repository.dart';
import 'package:vaktija/features/prayer_times/timetable.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

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
          theme: ThemeData.light(),
          darkTheme: ThemeData.dark(),
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

    final card = find.byType(AnimatedCrossFade);
    final collapse = find.byTooltip('Skupi odbrojavanje');
    final expand = find.byTooltip('Proširi odbrojavanje');
    final expandedHeight = tester.getSize(card).height;
    final chevronCenter = tester.getCenter(collapse);
    await tester.tap(collapse);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 120));
    final midHeight = tester.getSize(card).height;
    expect(midHeight, lessThan(expandedHeight));
    expect(tester.getCenter(expand), chevronCenter);
    await tester.pumpAndSettle();
    expect(tester.getSize(card).height, lessThan(midHeight));
    expect(tester.getCenter(expand), chevronCenter);
    expect(repository.preferences.getBool('countdownCollapsed'), true);
    await tester.tap(expand);
    await tester.pumpAndSettle();

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
