import 'dart:async';
import 'dart:ui' show PointerDeviceKind, Tristate;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vaktija/features/prayer_times/prayer_page.dart';
import 'package:vaktija/features/prayer_times/prayer_reminder_card.dart';
import 'package:vaktija/features/prayer_times/prayer_reminders.dart';
import 'package:vaktija/features/prayer_times/prayer_repository.dart';
import 'package:vaktija/features/prayer_times/prayer_timetable_view.dart';
import 'package:vaktija/features/prayer_times/timetable.dart';

void main() {
  testWidgets('bells respond while a slow reminder save is pending', (
    tester,
  ) async {
    tester.view
      ..devicePixelRatio = 1
      ..physicalSize = const Size(384, 1000);
    addTearDown(tester.view.reset);
    final semantics = tester.ensureSemantics();
    final repository = (await tester.runAsync(() async {
      SharedPreferences.setMockInitialValues({});
      return PrayerRepository(
        await PrayerCatalog.load(),
        await SharedPreferences.getInstance(),
        clock: () => DateTime.utc(2026, 11, 28, 9),
      );
    }))!;
    final reminders = _SlowReminders(repository.preferences);

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: PrayerPage(
            repository: repository,
            city: repository.catalog.city(77),
            method: PrayerMethod.iz,
            labels: repository.catalog.labels(true),
            reminders: reminders,
            onEnterFullscreen: () {},
            onExitFullscreen: () {},
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.bySemanticsLabel('Zora (sabah) · Obavijesti'));
    await tester.pumpAndSettle();

    final atTime = find.bySemanticsLabel('U vrijeme');
    final tenBefore = find.bySemanticsLabel('10 min prije');
    final thirtyBefore = find.bySemanticsLabel('30 min prije');
    Tristate? toggled(Finder finder) => tester
        .getSemantics(finder)
        .getSemanticsData()
        .flagsCollection
        .isToggled;

    await tester.tap(atTime);
    await tester.pump();
    expect(toggled(atTime), Tristate.isFalse);
    expect(reminders.writes, isEmpty);

    reminders.permission.complete(ReminderPermission.granted);
    await tester.pump();
    expect(toggled(atTime), Tristate.isTrue);
    await tester.pump(const Duration(milliseconds: 1));
    expect(reminders.writes, [
      {'fajr.0'},
    ]);

    await tester.tap(tenBefore);
    await tester.pump();
    expect(toggled(tenBefore), Tristate.isTrue);
    await tester.tap(atTime);
    await tester.pump();
    expect(toggled(atTime), Tristate.isFalse);
    await tester.tap(thirtyBefore);
    await tester.pump();
    expect(toggled(thirtyBefore), Tristate.isTrue);
    expect(reminders.writes, hasLength(1));

    reminders.pending.first.completeError(StateError('Old save failed'));
    await tester.pumpAndSettle();
    expect(reminders.writes, [
      {'fajr.0'},
      {'fajr.10', 'fajr.30'},
    ]);
    expect(toggled(tenBefore), Tristate.isTrue);
    expect(toggled(thirtyBefore), Tristate.isTrue);
    reminders.pending.last.complete();
    await tester.pumpAndSettle();

    await tester.tap(thirtyBefore);
    await tester.pump();
    expect(toggled(thirtyBefore), Tristate.isFalse);
    await tester.pump(const Duration(milliseconds: 1));
    expect(reminders.writes, hasLength(3));
    reminders.pending.last.completeError(StateError('Latest save failed'));
    await tester.pumpAndSettle();
    expect(toggled(thirtyBefore), Tristate.isTrue);
    expect(find.text('Nije moguće sačuvati obavijest.'), findsOneWidget);
    semantics.dispose();
  });

  testWidgets('reminders leave the current and next labels in place', (
    tester,
  ) async {
    tester.view
      ..devicePixelRatio = 1
      ..physicalSize = const Size(320, 800);
    addTearDown(tester.view.reset);
    tester.platformDispatcher.textScaleFactorTestValue = 1.5;
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    final catalog = (await tester.runAsync(() async {
      await (FontLoader('Vaktija Sans')
            ..addFont(rootBundle.load('assets/fonts/vaktija-sans-400.ttf'))
            ..addFont(rootBundle.load('assets/fonts/vaktija-sans-600.ttf')))
          .load();
      return PrayerCatalog.load();
    }))!;
    final now = sarajevoTime(DateTime.utc(2026, 11, 28, 11));
    final times = catalog.izTimes(catalog.city(77), now);
    final labels = catalog.labels(true);
    final interval = PrayerInterval.find(
      now,
      yesterday: null,
      today: times,
      tomorrow: null,
    )!;

    Future<void> showTimetable({required bool reminders}) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: ThemeData(fontFamily: 'Vaktija Sans'),
          home: Scaffold(
            body: PrayerTimetableView(
              times: times,
              city: 'Sarajevo',
              now: now,
              interval: interval,
              countdownFallback: null,
              labels: labels,
              onToggleFullscreen: () {},
              onToggleReminder: reminders ? (_, _) {} : null,
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
    }

    List<Rect> badgeBounds() => [
      for (final key in ['currentBadge', 'nextBadge'])
        tester.getRect(find.text(labels[key].toUpperCase())),
    ];

    await showTimetable(reminders: false);
    final originalBadges = badgeBounds();
    await showTimetable(reminders: true);
    expect(badgeBounds(), originalBadges);
  });

  testWidgets('reminder card flips in place on a narrow timetable', (
    tester,
  ) async {
    tester.view
      ..devicePixelRatio = 1
      ..physicalSize = const Size(320, 640);
    addTearDown(tester.view.reset);
    final catalog = (await tester.runAsync(PrayerCatalog.load))!;
    final now = sarajevoTime(DateTime.utc(2026, 11, 28, 5));
    final times = catalog
        .izTimes(catalog.city(77), now)
        .where(
          (time) =>
              time.kind == PrayerKind.fajr || time.kind == PrayerKind.sunrise,
        )
        .toList();
    final enabled = <String>{};
    final semantics = tester.ensureSemantics();
    var showReminders = false;
    late StateSetter updateTimetable;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (context, setState) {
              updateTimetable = setState;
              return MediaQuery(
                data: MediaQuery.of(
                  context,
                ).copyWith(textScaler: const TextScaler.linear(1.5)),
                child: PrayerTimetableView(
                  times: times,
                  city: 'Sarajevo',
                  now: now,
                  interval: null,
                  countdownFallback: null,
                  labels: catalog.labels(true),
                  onToggleFullscreen: () {},
                  reminderSelections: enabled,
                  onToggleReminder: showReminders
                      ? (kind, reminder) =>
                            setState(() => enabled.add(reminder.key(kind)))
                      : null,
                ),
              );
            },
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    final sunrise = find.text('Izlazak sunca');
    final originalBounds = tester.getRect(
      find.widgetWithText(Container, 'Zora (sabah)').first,
    );
    final clock = find.text(times.first.time);
    final originalClock = tester.getRect(clock);
    final sunrisePosition = tester.getTopLeft(sunrise);
    updateTimetable(() => showReminders = true);
    await tester.pumpAndSettle();

    final card = find.byType(PrayerReminderCard);
    final open = find.bySemanticsLabel('Zora (sabah) · Obavijesti');
    final prayerName = find.text('Zora (sabah)');
    expect(tester.getRect(card), originalBounds);
    expect(tester.getRect(clock), originalClock);
    expect(tester.getTopLeft(sunrise), sunrisePosition);
    expect(tester.getRect(open).overlaps(tester.getRect(prayerName)), isFalse);
    expect(tester.getTopRight(open).dx, lessThan(tester.getTopLeft(clock).dx));
    await tester.tap(open);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 150));
    expect(tester.getRect(card), originalBounds);
    expect(tester.getTopLeft(sunrise), sunrisePosition);
    await tester.pumpAndSettle();
    expect(tester.getRect(card), originalBounds);
    expect(tester.getTopLeft(sunrise), sunrisePosition);
    expect(find.text('Zora (sabah) · Obavijesti'), findsOneWidget);

    final option = find.bySemanticsLabel('10 min prije');
    final bellMotion = find.descendant(
      of: option,
      matching: find.byType(Transform),
    );
    expect(
      tester.getSemantics(option).getSemanticsData().flagsCollection.isToggled,
      Tristate.isFalse,
    );
    await tester.tap(option);
    await tester.pump();
    expect(enabled, {'fajr.10'});
    expect(
      tester.getSemantics(option).getSemanticsData().flagsCollection.isToggled,
      Tristate.isTrue,
    );
    await tester.pump(const Duration(milliseconds: 45));
    expect(
      tester.widget<Transform>(bellMotion).transform.entry(1, 0),
      isNot(0),
    );
    final artwork = find.descendant(of: option, matching: find.byType(Image));
    expect(artwork, findsOneWidget);
    expect(
      (tester.widget<Image>(artwork).image as AssetImage).assetName,
      endsWith('ringing-bell-on.png'),
    );
    expect(tester.getRect(card), originalBounds);
    await tester.pump(const Duration(milliseconds: 125));
    expect(
      tester.widget<Transform>(bellMotion).transform.entry(1, 0),
      closeTo(0, .0001),
    );
    await tester.tap(find.bySemanticsLabel('Zatvori obavijesti'));
    await tester.pumpAndSettle();
    expect(tester.getSemantics(open).getSemanticsData().value, '1/3');
    expect(tester.getRect(card), originalBounds);

    await tester.tap(open);
    await tester.pumpAndSettle();
    await tester.tap(sunrise);
    await tester.pumpAndSettle();
    expect(open, findsOneWidget);

    final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: tester.getCenter(open));
    await mouse.down(tester.getCenter(open));
    await mouse.up();
    await tester.pumpAndSettle();
    expect(option, findsOneWidget);
    await mouse.moveTo(tester.getCenter(sunrise));
    await tester.pumpAndSettle();
    expect(open, findsOneWidget);
    await mouse.removePointer();
    expect(tester.takeException(), isNull);
    semantics.dispose();
  });
}

class _SlowReminders extends PrayerReminders {
  _SlowReminders(super.preferences);

  final permission = Completer<ReminderPermission>();
  final writes = <Set<String>>[];
  final pending = <Completer<void>>[];

  @override
  Future<ReminderPermission> checkPermission() async =>
      ReminderPermission.notifications;

  @override
  Future<ReminderPermission> requestPermission() => permission.future;

  @override
  Future<void> save(
    PrayerCity city,
    PrayerMethod method,
    PrayerLabels labels,
    Set<String> selection, {
    bool refresh = false,
  }) async {
    writes.add(selection);
    final completion = Completer<void>();
    pending.add(completion);
    await completion.future;
    enabled = selection;
  }
}
