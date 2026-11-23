import 'dart:async';
import 'dart:convert';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vaktija/app/method_choice.dart';
import 'package:vaktija/app/vaktija_dialog.dart';
import 'package:vaktija/app/startup/splash_view.dart';
import 'package:vaktija/app/vaktija_app.dart';
import 'package:vaktija/app/vaktija_palette.dart';
import 'package:vaktija/features/prayer_times/prayer_page.dart';
import 'package:vaktija/features/prayer_times/prayer_repository.dart';
import 'package:vaktija/features/prayer_times/prayer_timetable_view.dart';
import 'package:vaktija/features/prayer_times/timetable.dart';

const _march28 = {
  'Fajr': '2026-03-28T04:17:00+01:00',
  'Sunrise': '2026-03-28T05:30:00+01:00',
  'Dhuhr': '2026-03-28T11:52:00+01:00',
  'Asr': '2026-03-28T15:22:00+01:00',
  'Maghrib': '2026-03-28T18:08:00+01:00',
  'Isha': '2026-03-28T19:26:00+01:00',
  'Midnight': '2026-03-28T23:13:00+01:00',
  'Lastthird': '2026-03-29T00:54:00+01:00',
};

const _march29 = {
  'Fajr': '2026-03-29T05:15:00+02:00',
  'Sunrise': '2026-03-29T06:28:00+02:00',
  'Dhuhr': '2026-03-29T12:52:00+02:00',
  'Asr': '2026-03-29T16:23:00+02:00',
  'Maghrib': '2026-03-29T19:10:00+02:00',
  'Isha': '2026-03-29T20:28:00+02:00',
  'Midnight': '2026-03-30T00:13:00+02:00',
  'Lastthird': '2026-03-30T01:54:00+02:00',
};

String _response(String date, Map<String, String> timings) => jsonEncode({
  'data': {
    'date': {
      'gregorian': {'date': date},
    },
    'timings': timings,
  },
});

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('timetable dashes keep the same spacing across a card gap', (
    tester,
  ) async {
    const boundaryKey = ValueKey('timetable-pixels');
    final catalog = (await tester.runAsync(PrayerCatalog.load))!;
    final labels = catalog.labels(false);
    final now = DateTime.utc(2026, 11, 22);
    final times = [
      PrayerTime(PrayerKind.fajr, now.add(const Duration(hours: 4))),
      PrayerTime(PrayerKind.sunrise, now.add(const Duration(hours: 6))),
    ];
    await tester.pumpWidget(
      MaterialApp(
        theme: ThemeData.dark(),
        home: RepaintBoundary(
          key: boundaryKey,
          child: Scaffold(
            body: PrayerTimetableView(
              times: times,
              city: 'Sarajevo',
              now: now,
              interval: null,
              countdownFallback: null,
              labels: labels,
              onToggleFullscreen: () {},
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    Rect card(PrayerTime time) =>
        tester.getRect(find.widgetWithText(Container, labels.prayer(time)));
    final first = card(times[0]);
    final second = card(times[1]);
    final boundary = tester.renderObject<RenderRepaintBoundary>(
      find.byKey(boundaryKey),
    );
    final (pixels, width) = (await tester.runAsync(() async {
      final image = await boundary.toImage();
      final rgba = await image.toByteData(format: ui.ImageByteFormat.rawRgba);
      final width = image.width;
      image.dispose();
      return (rgba!, width);
    }))!;

    final x = first.left.round() - 16;
    final track = const VaktijaPalette(true).track;
    final rgba = ((track.toARGB32() << 8) & 0xffffffff) | 0xff;
    bool onDash(int y) => pixels.getUint32((y * width + x) * 4) == rgba;
    final starts = [
      for (var y = first.center.dy.ceil() + 10; y < second.center.dy - 10; y++)
        if (onDash(y) && !onDash(y - 1)) y,
    ];
    expect(starts.length, greaterThan(4));
    expect([
      for (var i = 1; i < starts.length; i++) starts[i] - starts[i - 1],
    ], everyElement(7));
  });

  test('IZ regular times match both Sarajevo clock-change fixtures', () async {
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
    }
  });

  test(
    'IZ carries the same night event through midnight and counts real elapsed time across DST',
    () async {
      final catalog = await PrayerCatalog.load();
      for (final (night, lastThird, dstChange, remaining, fajrRemaining) in [
        (
          DateTime(2026, 3, 28),
          DateTime.utc(2026, 3, 28, 23, 41),
          DateTime.utc(2026, 3, 29, 1),
          41 * 60,
          115 * 60,
        ),
        (
          DateTime(2026, 10, 24),
          DateTime.utc(2026, 10, 24, 23, 43),
          DateTime.utc(2026, 10, 25, 1),
          103 * 60,
          157 * 60,
        ),
      ]) {
        PrayerInterval intervalAt(DateTime instant) {
          final now = sarajevoTime(instant);
          final city = catalog.city(77);
          return PrayerInterval.find(
            now,
            yesterday: catalog.izTimes(city, sarajevoDay(now, -1)),
            today: catalog.izTimes(city, now),
            tomorrow: catalog.izTimes(city, sarajevoDay(now, 1)),
          )!;
        }

        final midnight = sarajevoDay(night, 1);
        final before = intervalAt(
          midnight.subtract(const Duration(seconds: 1)),
        );
        final after = intervalAt(midnight);
        expect(before.next.kind, PrayerKind.lastthird);
        expect(before.next.at.toUtc(), lastThird);
        expect(after.next.at.toUtc(), lastThird);
        expect(after.remaining, remaining);
        expect(before.remaining, after.remaining + 1);

        final beforeChange = intervalAt(
          dstChange.subtract(const Duration(seconds: 1)),
        );
        final afterChange = intervalAt(dstChange);
        expect(afterChange.next.kind, PrayerKind.fajr);
        expect(beforeChange.next.at, afterChange.next.at);
        expect(afterChange.remaining, fajrRemaining);
        expect(beforeChange.remaining, afterChange.remaining + 1);
      }
    },
  );

  test(
    '14.6° stores separate dates, keeps ISO offsets offline and prunes expired dates',
    () async {
      final catalog = await PrayerCatalog.load();
      SharedPreferences.setMockInitialValues({
        'aladhan.77.2026-03-25': 'expired',
        'theme': 'dark',
      });
      final prefs = await SharedPreferences.getInstance();
      final city = catalog.city(77);
      final oldDay = DateTime(2026, 3, 28);
      final newDay = DateTime(2026, 3, 29);
      var now = DateTime.utc(2026, 3, 28, 22, 59, 59);
      final old = Completer<String>();
      final recent = Completer<String>();
      final requests = <String>[];
      final repository = PrayerRepository(
        catalog,
        prefs,
        clock: () => now,
        get: (uri) {
          expect(uri.queryParameters, {
            'latitude': city.latitude.toString(),
            'longitude': city.longitude.toString(),
            'timezonestring': 'Europe/Sarajevo',
            'method': '99',
            'methodSettings': '14.6,null,14.6',
            'school': '0',
            'midnightMode': '1',
            'iso8601': 'true',
          });
          requests.add(uri.path);
          return uri.path.endsWith('28-03-2026') ? old.future : recent.future;
        },
      );

      final yesterday = repository.load(city, PrayerMethod.angle, oldDay);
      now = DateTime.utc(2026, 3, 28, 23);
      final today = repository.load(city, PrayerMethod.angle, newDay);
      final duplicate = repository.load(city, PrayerMethod.angle, newDay);
      recent.complete(_response('29-03-2026', _march29));
      expect((await today).first.time, '05:15');
      await duplicate;
      old.complete(_response('28-03-2026', _march28));
      await yesterday;

      expect(
        requests,
        unorderedEquals(['/v1/timings/28-03-2026', '/v1/timings/29-03-2026']),
      );
      expect(prefs.containsKey('aladhan.77.2026-03-25'), isFalse);
      expect(prefs.getString('theme'), 'dark');
      final offline = PrayerRepository(
        catalog,
        prefs,
        clock: () => now,
        get: (_) async => throw StateError('offline'),
      );
      final cachedYesterday = await offline.load(
        city,
        PrayerMethod.angle,
        oldDay,
      );
      final cachedToday = await offline.load(city, PrayerMethod.angle, newDay);
      expect(cachedToday.first.at.toUtc(), DateTime.utc(2026, 3, 29, 3, 15));
      final event = cachedYesterday.last;
      expect(event.kind, PrayerKind.lastthird);
      expect(event.time, '00:54');
      expect(dayKey(event.at), '2026-03-29');
      expect(event.at.toUtc(), DateTime.utc(2026, 3, 28, 23, 54));
    },
  );

  test(
    'offline upgrade dates legacy entries and skips an ambiguous repeated-hour marker',
    () async {
      final catalog = await PrayerCatalog.load();
      SharedPreferences.setMockInitialValues({
        'aladhan.77': jsonEncode({
          'date': '2026-10-24',
          'timings': {
            'Fajr': '05:55',
            'Sunrise': '07:04',
            'Dhuhr': '12:31',
            'Asr': '15:21',
            'Maghrib': '17:49',
            'Isha': '19:09',
            'Midnight': '23:52',
            'Lastthird': '01:53',
          },
        }),
        'aladhan.42': jsonEncode({
          'date': '2026-10-24',
          'timings': {
            'Fajr': '05:55',
            'Sunrise': '07:04',
            'Dhuhr': '12:31',
            'Asr': '15:21',
            'Maghrib': '17:49',
            'Isha': '19:09',
            'Midnight': '23:52',
            'Lastthird': '02:30',
          },
        }),
      });
      final prefs = await SharedPreferences.getInstance();
      final day = DateTime(2026, 10, 24);
      final repository = PrayerRepository(
        catalog,
        prefs,
        clock: () => DateTime.utc(2026, 10, 24, 12),
        get: (_) async => throw StateError('offline'),
      );
      final complete = await repository.load(
        catalog.city(77),
        PrayerMethod.angle,
        day,
      );
      expect(complete.last.time, '01:53');
      expect(dayKey(complete.last.at), '2026-10-25');
      expect(prefs.containsKey('aladhan.77.2026-10-24'), isTrue);

      final partial = await repository.load(
        catalog.city(42),
        PrayerMethod.angle,
        day,
      );
      expect(
        partial.map((time) => time.kind),
        isNot(contains(PrayerKind.lastthird)),
      );
      expect(partial.first.time, '05:55');
      expect(prefs.containsKey('aladhan.42.2026-10-24'), isFalse);
    },
  );

  testWidgets('14.6° prefetch carries the same countdown into the next date', (
    tester,
  ) async {
    var now = DateTime.utc(2026, 3, 27, 23);
    var fullscreen = false;
    final requests = <String>[];
    final repository = (await tester.runAsync(() async {
      SharedPreferences.setMockInitialValues({});
      return PrayerRepository(
        await PrayerCatalog.load(),
        await SharedPreferences.getInstance(),
        clock: () => now,
        get: (uri) async {
          requests.add(uri.path);
          return switch (uri.path) {
            '/v1/timings/28-03-2026' => _response('28-03-2026', _march28),
            '/v1/timings/29-03-2026' => _response('29-03-2026', _march29),
            _ => throw StateError('offline for uncached dates'),
          };
        },
      );
    }))!;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (context, setMode) => PrayerPage(
              repository: repository,
              city: repository.catalog.city(77),
              method: PrayerMethod.angle,
              labels: repository.catalog.labels(false),
              fullscreen: fullscreen,
              onEnterFullscreen: () => setMode(() => fullscreen = true),
              onExitFullscreen: () => setMode(() => fullscreen = false),
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    PrayerTimetableView view() =>
        tester.widget(find.byType(PrayerTimetableView));
    expect(view().interval, isNull);
    expect(find.text('Next prayer time unavailable'), findsOneWidget);
    expect(view().times.first.kind, PrayerKind.fajr);
    final beforeFullscreen = List.of(requests);
    await tester.tap(find.byTooltip('Fullscreen'));
    await tester.pumpAndSettle();
    expect(view().fullscreen, isTrue);
    expect(requests, beforeFullscreen);

    now = DateTime.utc(2026, 3, 28, 22, 59, 59);
    await tester.pump(const Duration(seconds: 1));
    expect(view().interval?.next.kind, PrayerKind.lastthird);
    expect(view().interval?.remaining, 3241);
    expect(
      view().times.any((time) => time.kind == PrayerKind.lastthird),
      isFalse,
    );

    now = now.add(const Duration(seconds: 1));
    await tester.pump(const Duration(seconds: 1));
    expect(view().interval?.next.kind, PrayerKind.lastthird);
    expect(view().interval?.remaining, 3240);
    expect(view().times.first.kind, PrayerKind.lastthird);
    expect(view().times.first.time, '00:54');
    final semantics = tester.ensureSemantics();
    expect(find.bySemanticsLabel('00:54:00'), findsOneWidget);
    semantics.dispose();
    await tester.pumpWidget(const SizedBox.shrink());
  });

  testWidgets('both Home themes share the same night splash and timing', (
    tester,
  ) async {
    const size = Size(390, 844);
    await tester.binding.setSurfaceSize(size);
    addTearDown(() => tester.binding.setSurfaceSize(null));
    const provider = AssetImage('assets/branding/splash-night-horizon.webp');

    for (final brightness in Brightness.values) {
      final launch = Completer<void>();
      var finished = false;
      await tester.pumpWidget(
        MaterialApp(
          key: ValueKey(brightness),
          theme: ThemeData(brightness: brightness),
          home: SplashView(
            headerLogo: GlobalKey(),
            launchReady: launch.future,
            onFinished: () => finished = true,
          ),
        ),
      );

      final artwork = find.image(provider);
      final mark = find.byWidgetPredicate(
        (widget) => widget is Image && widget.semanticLabel == 'Vaktija',
      );
      final visibleArt = find.ancestor(
        of: artwork,
        matching: find.byType(Opacity),
      );
      final context = tester.element(artwork);
      await tester.runAsync(() => precacheImage(provider, context));
      await tester.pump(const Duration(seconds: 4));
      expect(tester.getCenter(mark), size.center(Offset.zero));
      expect(tester.getSize(mark), const Size(136, 111));
      expect(tester.widget<Image>(mark).color, const Color(0xfff1f2e9));
      expect(
        tester.widgetList<Opacity>(visibleArt).map((widget) => widget.opacity),
        contains(0.0),
      );
      expect(finished, isFalse);

      launch.complete();
      await tester.pump();
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 1599));
      final artRect = tester.getRect(artwork);
      expect(artRect.height, closeTo(size.width, .01));
      expect(artRect.bottom, closeTo(size.height, .01));
      expect(tester.getCenter(mark).dy, lessThan(size.height / 2));
      expect(finished, isFalse);
      await tester.pump(const Duration(milliseconds: 300));
      expect(finished, isFalse);
      await tester.pump(const Duration(milliseconds: 2));
      expect(finished, isTrue);
    }
  });

  testWidgets('splash fades into the restored fullscreen overnight countdown', (
    tester,
  ) async {
    final launch = Completer<void>();
    final yesterday = Completer<String>();
    final tomorrow = Completer<String>();
    const channel = MethodChannel('vaktija/fullscreen');
    final messenger = tester.binding.defaultBinaryMessenger;
    final bars = <bool>[];
    messenger.setMockMethodCallHandler(channel, (call) async {
      bars.add(call.arguments as bool);
      return null;
    });
    addTearDown(() => messenger.setMockMethodCallHandler(channel, null));
    final repository = (await tester.runAsync(() async {
      SharedPreferences.setMockInitialValues({
        'method': 'angle',
        'language': 'en',
        'theme': 'dark',
        'fullscreen': true,
      });
      return PrayerRepository(
        await PrayerCatalog.load(),
        await SharedPreferences.getInstance(),
        clock: () => DateTime.utc(2026, 3, 28, 23),
        get: (uri) async => switch (uri.path) {
          '/v1/timings/28-03-2026' => yesterday.future,
          '/v1/timings/29-03-2026' => _response('29-03-2026', _march29),
          _ => tomorrow.future,
        },
      );
    }))!;

    await tester.pumpWidget(
      VaktijaApp(
        openRepository: () async => repository,
        launchReady: launch.future,
      ),
    );
    final splash = find.byType(SplashView);
    final artwork = find.descendant(
      of: splash,
      matching: find.byWidgetPredicate(
        (widget) =>
            widget is Image &&
            widget.image is AssetImage &&
            (widget.image as AssetImage).assetName ==
                '$prayerAssets/mosque-horizon-dark.webp',
      ),
    );
    await tester.pump();
    await tester.pump();
    expect(artwork, findsOneWidget);
    final artworkSize = tester.getSize(artwork);
    expect(artworkSize.aspectRatio, closeTo(3, .01));
    final artworkOpacity = find.ancestor(
      of: artwork,
      matching: find.byType(Opacity),
    );
    expect(
      tester.widgetList<Opacity>(artworkOpacity).map((w) => w.opacity),
      contains(lessThan(1.0)),
    );

    final mark = find.descendant(
      of: splash,
      matching: find.byWidgetPredicate(
        (widget) => widget is Image && widget.semanticLabel == 'Vaktija',
      ),
    );
    expect(Theme.of(tester.element(splash)).brightness, Brightness.dark);
    expect(
      tester
          .widget<PrayerTimetableView>(find.byType(PrayerTimetableView))
          .interval,
      isNull,
    );

    yesterday.complete(_response('28-03-2026', _march28));
    await tester.pump();
    launch.complete();
    await tester.pump();
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 1600));
    final rest = tester.getRect(mark);
    expect(
      tester.widgetList<Opacity>(artworkOpacity).map((w) => w.opacity),
      everyElement(1.0),
    );

    await tester.pump(const Duration(milliseconds: 150));
    expect(tester.getRect(mark), rest);
    final markOpacity = find.ancestor(of: mark, matching: find.byType(Opacity));
    expect(
      tester.widgetList<Opacity>(markOpacity).map((w) => w.opacity),
      contains(inExclusiveRange(0.0, 1.0)),
    );
    expect(
      tester
          .widget<PrayerTimetableView>(find.byType(PrayerTimetableView))
          .fullscreen,
      isTrue,
    );
    expect(bars, isEmpty);
    await tester.pump(const Duration(milliseconds: 151));
    await tester.pump();

    expect(splash, findsNothing);
    final timetable = tester.widget<PrayerTimetableView>(
      find.byType(PrayerTimetableView),
    );
    expect(timetable.fullscreen, isTrue);
    expect(timetable.headerMotion?.value, 1);
    expect(timetable.rowMotion?.value, 1);
    expect(bars, [true]);
    expect(timetable.interval?.next.kind, PrayerKind.lastthird);
    expect(timetable.interval?.remaining, 3240);
    expect(timetable.times.first.kind, PrayerKind.lastthird);
    tomorrow.completeError(StateError('offline for tomorrow'));
    await tester.pump();
    await tester.pumpWidget(const SizedBox.shrink());
  });

  testWidgets('a slow request continues on Home after the splash deadline', (
    tester,
  ) async {
    final response = Completer<String>();
    final requests = <String>[];
    final repository = (await tester.runAsync(() async {
      SharedPreferences.setMockInitialValues({
        'method': 'angle',
        'language': 'en',
        'theme': 'light',
      });
      return PrayerRepository(
        await PrayerCatalog.load(),
        await SharedPreferences.getInstance(),
        clock: () => DateTime.utc(2026, 3, 28, 12),
        get: (uri) {
          requests.add(uri.path);
          return uri.path.endsWith('28-03-2026')
              ? response.future
              : Future.error(StateError('offline for adjacent days'));
        },
      );
    }))!;

    await tester.pumpWidget(VaktijaApp(openRepository: () async => repository));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 1899));
    expect(find.byType(SplashView), findsOneWidget);
    expect(requests, hasLength(3));

    await tester.pump(const Duration(milliseconds: 2));
    await tester.pump();
    expect(find.byType(SplashView), findsNothing);
    expect(find.byType(PrayerTimetableView), findsNothing);

    response.complete(_response('28-03-2026', _march28));
    await tester.pump();
    await tester.pump();
    expect(find.byType(PrayerTimetableView), findsOneWidget);
    expect(requests, hasLength(3));
    await tester.pumpWidget(const SizedBox.shrink());
  });

  testWidgets(
    'first launch with reduced motion reaches method choice on schedule',
    (tester) async {
      tester.platformDispatcher.accessibilityFeaturesTestValue =
          const FakeAccessibilityFeatures(disableAnimations: true);
      addTearDown(
        tester.platformDispatcher.clearAccessibilityFeaturesTestValue,
      );
      final repository = (await tester.runAsync(() async {
        SharedPreferences.setMockInitialValues({'language': 'en'});
        return PrayerRepository(
          await PrayerCatalog.load(),
          await SharedPreferences.getInstance(),
          get: (_) async => fail('First launch must wait for a method choice'),
        );
      }))!;

      await tester.pumpWidget(
        VaktijaApp(openRepository: () async => repository),
      );
      expect(find.byType(SplashView), findsOneWidget);
      expect(find.byType(MethodChoice), findsNothing);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 1901));
      await tester.pump();
      expect(find.byType(SplashView), findsNothing);
      expect(find.byType(MethodChoice), findsOneWidget);
      expect(find.byType(VaktijaDialog), findsOneWidget);
      await tester.pumpWidget(const SizedBox.shrink());
    },
  );
}
