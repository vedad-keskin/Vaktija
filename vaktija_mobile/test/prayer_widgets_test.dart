import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vaktija/features/prayer_times/prayer_repository.dart';
import 'package:vaktija/features/prayer_times/prayer_widgets.dart';
import 'package:vaktija/features/prayer_times/timetable.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'widgets follow the homepage date order and keep the six daytime entries when compact',
    () async {
      final catalog = await PrayerCatalog.load();
      final city = catalog.cities.singleWhere(
        (city) => city.name == 'Jablanica',
      );
      final day = DateTime(2026, 11, 24);
      final today = catalog.izTimes(city, day);
      final calendar = calendarTimetable(
        day,
        yesterday: catalog.izTimes(city, sarajevoDay(day, -1)),
        today: today,
      );
      final payload = prayerWidgetDay(
        PrayerWidgetConfiguration(city, PrayerMethod.iz, true),
        catalog.labels(true),
        day,
        today,
        calendarTimes: calendar,
      );
      final rows = payload['calendarRows'] as List<Map<String, Object?>>;
      expect(rows.map((row) => row['kind']), [
        'lastthird',
        'fajr',
        'sunrise',
        'dhuhr',
        'asr',
        'maghrib',
        'isha',
        'midnight',
      ]);
      expect(rows.map((row) => row['time']), [
        '00:57',
        '05:14',
        '06:49',
        '11:37',
        '13:56',
        '16:21',
        '17:46',
        '22:48',
      ]);
      expect(rows.map((row) => row['nextDay']), everyElement(false));
      expect(payload['calendarComplete'], isTrue);
      final compact = rows.where(
        (row) => !['lastthird', 'midnight'].contains(row['kind']),
      );
      expect(compact.map((row) => row['kind']), [
        'fajr',
        'sunrise',
        'dhuhr',
        'asr',
        'maghrib',
        'isha',
      ]);

      for (final transition in [
        DateTime(2026, 3, 29),
        DateTime(2026, 10, 25),
      ]) {
        final events = calendarTimetable(
          transition,
          yesterday: catalog.izTimes(city, sarajevoDay(transition, -1)),
          today: catalog.izTimes(city, transition),
        );
        expect(
          events.every((time) => dayKey(time.at) == dayKey(transition)),
          isTrue,
        );
        expect(events.where((time) => !time.kind.isNightMarker), hasLength(6));
        for (var index = 1; index < events.length; index++) {
          expect(events[index].at.isBefore(events[index - 1].at), isFalse);
        }
      }
    },
  );

  test(
    'widget dates preserve all eight kinds and next-night timestamps across clock changes',
    () async {
      final catalog = await PrayerCatalog.load();
      final city = catalog.city(77);
      final configuration = PrayerWidgetConfiguration(
        city,
        PrayerMethod.iz,
        true,
      );
      for (final day in [
        DateTime(2026, 3, 28),
        DateTime(2026, 3, 29),
        DateTime(2026, 10, 24),
        DateTime(2026, 10, 25),
        DateTime(2026, 12, 31),
        DateTime(2027, 1, 1),
        DateTime(2028, 2, 29),
      ]) {
        final times = catalog.izTimes(city, day);
        final payload = prayerWidgetDay(
          configuration,
          catalog.labels(true),
          day,
          times,
        );
        final rows = payload['rows'] as List<Map<String, Object?>>;
        expect(
          rows.map((row) => row['kind']),
          PrayerKind.values.map((kind) => kind.name),
        );
        expect(
          rows.map((row) => row['time']),
          everyElement(matches(RegExp(r'^\d{2}:\d{2}$'))),
        );
        expect(payload['day'], dayKey(day));
        for (final row in rows) {
          final event = times.singleWhere(
            (time) => time.kind.name == row['kind'],
          );
          expect(
            DateTime.parse(row['at'] as String).microsecondsSinceEpoch,
            event.at.microsecondsSinceEpoch,
          );
          expect(row['nextDay'], dayKey(event.at) != dayKey(day));
          expect(row['eventDate'], catalog.labels(true).date(event.at));
        }
      }
    },
  );

  test(
    'widget labels follow language and Friday, and partial night data stays explicit',
    () async {
      final catalog = await PrayerCatalog.load();
      final city = catalog.city(77);
      final day = DateTime(2026, 11, 27);
      final times = catalog.izTimes(city, day);
      for (final bosnian in [true, false]) {
        final labels = catalog.labels(bosnian);
        final payload = prayerWidgetDay(
          PrayerWidgetConfiguration(city, PrayerMethod.iz, bosnian),
          labels,
          day,
          times.where((time) => !time.kind.isNightMarker).toList(),
        );
        final rows = payload['rows'] as List<Map<String, Object?>>;
        expect(rows.length, 8);
        expect(rows[2]['name'], labels['dhuhrFridayName']);
        expect(rows.skip(6).map((row) => row['time']), [null, null]);
        expect(rows.skip(6).map((row) => row['nextDay']), [false, false]);
        expect(
          () => prayerWidgetDay(
            PrayerWidgetConfiguration(city, PrayerMethod.iz, bosnian),
            labels,
            sarajevoDay(day, 1),
            times,
          ),
          throwsFormatException,
        );
      }
    },
  );

  test(
    'widget configuration rejects mismatched or malformed stored selections',
    () async {
      final catalog = await PrayerCatalog.load();
      final configuration = PrayerWidgetConfiguration(
        catalog.city(77),
        PrayerMethod.angle,
        true,
      );
      final raw = jsonEncode(configuration.toJson());
      expect(
        PrayerWidgetConfiguration.parse(raw, catalog)?.key,
        configuration.key,
      );
      final setup = PrayerWidgetConfiguration(catalog.city(77), null, false);
      expect(
        PrayerWidgetConfiguration.parse(
          jsonEncode(setup.toJson()),
          catalog,
        )?.method,
        isNull,
      );
      for (final changes in [
        {'city': 99999},
        {'city': '77'},
        {'method': 'unknown'},
        {'key': '42.angle.bs'},
        {'language': 'unknown'},
        {'version': 2},
        {'timezone': 'UTC'},
      ]) {
        expect(
          PrayerWidgetConfiguration.parse(
            jsonEncode({...configuration.toJson(), ...changes}),
            catalog,
          ),
          isNull,
        );
      }
      expect(PrayerWidgetConfiguration.parse('[]', catalog), isNull);
      expect(PrayerWidgetConfiguration.parse('{broken', catalog), isNull);
    },
  );

  test(
    'repository retains seven future dates and prunes dates outside that window',
    () async {
      final catalog = await PrayerCatalog.load();
      final city = catalog.city(77);
      final today = sarajevoDay(DateTime(2026, 11, 24));
      SharedPreferences.setMockInitialValues({
        'aladhan.77.2026-11-22': 'expired',
        'aladhan.77.2026-12-02': 'expired',
        'method': 'angle',
      });
      final preferences = await SharedPreferences.getInstance();
      final repository = PrayerRepository(
        catalog,
        preferences,
        clock: () => today,
        get: (uri) async {
          final date = uri.pathSegments.last;
          final parts = date.split('-').map(int.parse).toList();
          final requested = DateTime(parts[2], parts[1], parts[0]);
          return jsonEncode({
            'data': {
              'date': {
                'gregorian': {'date': date},
              },
              'timings': {
                for (final time in catalog.izTimes(city, requested))
                  time.kind.key: time.at.toUtc().toIso8601String(),
              },
            },
          });
        },
      );
      final seventh = sarajevoDay(today, 7);
      final eighth = sarajevoDay(today, 8);
      await repository.load(city, PrayerMethod.angle, seventh);
      await repository.load(city, PrayerMethod.angle, eighth);
      expect(preferences.containsKey('aladhan.77.${dayKey(seventh)}'), isTrue);
      expect(preferences.containsKey('aladhan.77.${dayKey(eighth)}'), isFalse);
      expect(preferences.containsKey('aladhan.77.2026-11-22'), isFalse);
      expect(preferences.getString('method'), 'angle');
      final offline = PrayerRepository(
        catalog,
        preferences,
        clock: () => today,
        get: (_) async => throw StateError('offline'),
      );
      expect(
        await offline.load(city, PrayerMethod.angle, seventh),
        hasLength(8),
      );
      await expectLater(
        offline.load(city, PrayerMethod.angle, eighth),
        throwsStateError,
      );
    },
  );
}
