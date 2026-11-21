import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vaktija/app/app_shell.dart';
import 'package:vaktija/app/mobile_header.dart';
import 'package:vaktija/features/prayer_times/prayer_repository.dart';
import 'package:vaktija/features/prayer_times/timetable.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('IZ matches the web fixtures at both Sarajevo clock changes', () async {
    final catalog = await PrayerCatalog.load();
    for (final (day, expected) in [
      (
        DateTime(2026, 3, 28),
        ['3:57', '5:31', '11:53', '15:23', '18:14', '19:34'],
      ),
      (
        DateTime(2026, 3, 29),
        ['4:55', '6:29', '12:52', '16:23', '19:15', '20:36'],
      ),
      (
        DateTime(2026, 10, 24),
        ['5:36', '7:06', '12:32', '15:22', '17:55', '19:14'],
      ),
      (
        DateTime(2026, 10, 25),
        ['4:37', '6:07', '11:31', '14:21', '16:54', '18:13'],
      ),
    ]) {
      final times = catalog.izTimes(catalog.city(77), day);
      final lookup = {for (final time in times) time.kind: time.time};
      expect(PrayerKind.values.take(6).map((kind) => lookup[kind]), expected);
      final beforeMidnight = PrayerInterval(
        times,
        DateTime(day.year, day.month, day.day, 23, 59),
      );
      expect(beforeMidnight.nextIndex, 0);
      expect(beforeMidnight.remaining, (times.first.minutes + 1) * 60);
    }
  });

  test(
    '14.6° sends the web parameters and reuses the saved day offline',
    () async {
      final catalog = await PrayerCatalog.load();
      SharedPreferences.setMockInitialValues({});
      final prefs = await SharedPreferences.getInstance();
      final city = catalog.city(77);
      final requestDay = DateTime(2026, 11, 21);
      final repository = PrayerRepository(
        catalog,
        prefs,
        get: (uri) async {
          expect(uri.path, '/v1/timings/21-11-2026');
          expect(uri.queryParameters, {
            'latitude': city.latitude.toString(),
            'longitude': city.longitude.toString(),
            'timezonestring': 'Europe/Sarajevo',
            'method': '99',
            'methodSettings': '14.6,null,14.6',
            'school': '0',
            'midnightMode': '1',
          });
          return jsonEncode({
            'data': {
              'date': {
                'gregorian': {'date': '21-11-2026'},
              },
              'timings': {
                'Fajr': '05:29 (CET)',
                'Sunrise': '06:50',
                'Dhuhr': '11:35',
                'Asr': '14:00',
                'Maghrib': '16:19',
                'Isha': '17:40',
                'Midnight': '22:54',
                'Lastthird': '01:06',
              },
            },
          });
        },
      );
      final online = await repository.load(
        city,
        PrayerMethod.angle,
        requestDay,
      );
      expect(online.first.time, '01:06');
      expect(
        online.firstWhere((time) => time.kind == PrayerKind.fajr).time,
        '05:29',
      );
      final offline = PrayerRepository(
        catalog,
        prefs,
        get: (_) async => throw StateError('offline'),
      );
      expect(
        (await offline.load(
          city,
          PrayerMethod.angle,
          requestDay,
        )).map((time) => time.time),
        online.map((time) => time.time),
      );
      await expectLater(
        offline.load(city, PrayerMethod.angle, DateTime(2026, 11, 22)),
        throwsStateError,
      );
    },
  );

  testWidgets('mobile countdown, city search and animated header controls', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(320, 640);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
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
