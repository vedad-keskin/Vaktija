import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'timetable.dart';

class PrayerRepository {
  PrayerRepository(
    this.catalog,
    this.preferences, {
    Future<String> Function(Uri)? get,
    this._clock = sarajevoNow,
  }) : _get = get ?? _readResponse;

  final PrayerCatalog catalog;
  final SharedPreferences preferences;
  final Future<String> Function(Uri) _get;
  final DateTime Function() _clock;
  final _inFlight = <String, Future<List<PrayerTime>>>{};
  String? _prunedFor;

  DateTime now() => sarajevoTime(_clock());

  Future<List<PrayerTime>> load(
    PrayerCity city,
    PrayerMethod method,
    DateTime day,
  ) async {
    if (method == PrayerMethod.iz) return catalog.izTimes(city, day);

    await _pruneCache(now());
    final date = dayKey(day);
    final cityKey = 'aladhan.${city.id}';
    final cacheKey = '$cityKey.$date';
    final cached = _readCache(cacheKey, day);
    if (cached != null) return cached;

    return _inFlight.putIfAbsent(cacheKey, () async {
      try {
        final legacy = _readCache(cityKey, day, legacy: true);
        if (legacy?.length == PrayerKind.values.length) {
          await _save(cacheKey, day, legacy!);
          return legacy;
        }

        try {
          final times = await _fetchAngle(city, day);
          await _save(cacheKey, day, times);
          return times;
        } catch (_) {
          if (legacy != null) return legacy;
          rethrow;
        }
      } finally {
        _inFlight.remove(cacheKey);
      }
    });
  }

  Future<List<PrayerTime>> _fetchAngle(PrayerCity city, DateTime day) async {
    final requestDate = '${padTime(day.day)}-${padTime(day.month)}-${day.year}';
    final uri = Uri.https('api.aladhan.com', '/v1/timings/$requestDate', {
      'latitude': city.latitude.toString(),
      'longitude': city.longitude.toString(),
      'timezonestring': sarajevoZone,
      'method': '99',
      'methodSettings': '14.6,null,14.6',
      'school': '0',
      'midnightMode': '1',
      'iso8601': 'true',
    });
    final response = jsonDecode(await _get(uri)) as Map<String, dynamic>;
    final data = response['data'] as Map<String, dynamic>;
    if (data['date']?['gregorian']?['date'] != requestDate) {
      throw const FormatException('Aladhan returned a different date');
    }
    return _parseTimings(data['timings'] as Map<String, dynamic>, day);
  }

  Future<void> _save(String key, DateTime day, List<PrayerTime> times) async {
    final date = dayKey(day);
    if (!_withinCacheWindow(date, now())) return;

    try {
      await preferences.setString(
        key,
        jsonEncode({
          'date': date,
          'timings': {
            for (final time in times)
              time.kind.key: time.at.toUtc().toIso8601String(),
          },
        }),
      );
    } catch (error) {
      debugPrint('Could not cache prayer times: $error');
    }
  }

  bool _withinCacheWindow(String date, DateTime today) =>
      date.compareTo(dayKey(sarajevoDay(today, -1))) >= 0 &&
      date.compareTo(dayKey(sarajevoDay(today, 7))) <= 0;

  Future<void> _pruneCache(DateTime today) async {
    final date = dayKey(today);
    if (_prunedFor == date) return;
    _prunedFor = date;

    final keyPattern = RegExp(r'^aladhan\.\d+(?:\.(\d{4}-\d{2}-\d{2}))?$');
    for (final key in preferences.getKeys()) {
      final match = keyPattern.firstMatch(key);
      if (match == null) continue;
      final stored = match[1] ?? _readEntry(key)?['date'];
      if (stored is String && !_withinCacheWindow(stored, today)) {
        try {
          await preferences.remove(key);
        } catch (error) {
          debugPrint('Could not prune cached prayer times: $error');
        }
      }
    }
  }

  Map<String, dynamic>? _readEntry(String key) {
    final raw = preferences.get(key);
    if (raw is! String) return null;
    try {
      final entry = jsonDecode(raw);
      return entry is Map<String, dynamic> ? entry : null;
    } on FormatException {
      return null;
    }
  }

  List<PrayerTime>? _readCache(
    String key,
    DateTime day, {
    bool legacy = false,
  }) {
    final entry = _readEntry(key);
    if (entry?['date'] != dayKey(day)) return null;
    try {
      final timings = entry!['timings'] as Map<String, dynamic>;
      return legacy ? _parseLegacy(timings, day) : _parseTimings(timings, day);
    } on FormatException {
      return null;
    } on TypeError {
      return null;
    }
  }

  List<PrayerTime> _parseTimings(Map<String, dynamic> timings, DateTime day) {
    final date = dayKey(day);
    final tomorrow = dayKey(sarajevoDay(day, 1));
    final iso = RegExp(
      r'^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$',
    );
    final times = <PrayerTime>[];
    for (final kind in PrayerKind.values) {
      final raw = timings[kind.key];
      if (raw is! String || !iso.hasMatch(raw)) {
        throw FormatException('Invalid ${kind.key} timestamp');
      }
      final time = PrayerTime(kind, DateTime.parse(raw), padHours: true);
      final eventDate = dayKey(time.at);
      if (eventDate != date && !(kind.isNightMarker && eventDate == tomorrow)) {
        throw FormatException('Unexpected date for ${kind.key}');
      }
      times.add(time);
    }

    final maghrib = times[PrayerKind.maghrib.index].at;
    final midnight = times[PrayerKind.midnight.index].at;
    final lastThird = times[PrayerKind.lastthird.index].at;
    if (!midnight.isAfter(maghrib) || lastThird.isBefore(midnight)) {
      throw const FormatException(
        'Unexpected order for overnight prayer times',
      );
    }
    return sortTimetable(times);
  }

  List<PrayerTime> _parseLegacy(Map<String, dynamic> timings, DateTime day) {
    final wallTime = RegExp(r'^(?:[01]?\d|2[0-3]):[0-5]\d$');
    final minutes = PrayerKind.values.map((kind) {
      final raw = timings[kind.key];
      if (raw is! String || !wallTime.hasMatch(raw)) {
        throw FormatException('Invalid cached ${kind.key}');
      }
      final parts = raw.split(':');
      return int.parse(parts[0]) * 60 + int.parse(parts[1]);
    }).toList();

    final maghrib = minutes[PrayerKind.maghrib.index];
    final times = <PrayerTime>[];
    for (final kind in PrayerKind.values) {
      final minute = minutes[kind.index];
      final eventDay = kind.isNightMarker && minute < maghrib
          ? sarajevoDay(day, 1)
          : day;
      final at = sarajevoAt(eventDay, minute);
      bool matchesClock(DateTime instant) {
        final local = sarajevoTime(instant);
        return dayKey(local) == dayKey(eventDay) &&
            local.hour * 60 + local.minute == minute;
      }

      // A legacy value in a skipped or repeated Sarajevo hour needs an API timestamp.
      const hour = Duration(hours: 1);
      if (!matchesClock(at) ||
          matchesClock(at.subtract(hour)) ||
          matchesClock(at.add(hour))) {
        if (kind.isNightMarker) continue;
        throw FormatException('Ambiguous cached ${kind.key}');
      }
      times.add(PrayerTime(kind, at, padHours: true));
    }
    return sortTimetable(times);
  }

  static Future<String> _readResponse(Uri uri) async {
    final client = HttpClient();
    try {
      return await (() async {
        final request = await client.getUrl(uri);
        final response = await request.close();
        if (response.statusCode != 200) {
          throw HttpException('Prayer times request failed', uri: uri);
        }
        return utf8.decoder.bind(response).join();
      })().timeout(const Duration(seconds: 12));
    } finally {
      client.close(force: true);
    }
  }
}
