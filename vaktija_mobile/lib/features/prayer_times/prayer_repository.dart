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
  }) : _get = get ?? _readResponse;

  final PrayerCatalog catalog;
  final SharedPreferences preferences;
  final Future<String> Function(Uri) _get;

  Future<List<PrayerTime>> load(
    PrayerCity city,
    PrayerMethod method,
    DateTime day,
  ) async {
    if (method == PrayerMethod.iz) return catalog.izTimes(city, day);

    final date = dayKey(day);
    final cacheKey = 'aladhan.${city.id}';
    final cached = _readCache(preferences.getString(cacheKey), date);
    if (cached != null) return cached;

    final requestDate = '${padTime(day.day)}-${padTime(day.month)}-${day.year}';
    final uri = Uri.https('api.aladhan.com', '/v1/timings/$requestDate', {
      'latitude': city.latitude.toString(),
      'longitude': city.longitude.toString(),
      'timezonestring': sarajevoZone,
      'method': '99',
      'methodSettings': '14.6,null,14.6',
      'school': '0',
      'midnightMode': '1',
    });
    final response = jsonDecode(await _get(uri)) as Map<String, dynamic>;
    final data = response['data'] as Map<String, dynamic>;
    final times = _parseTimings(data['timings'] as Map<String, dynamic>);
    if (data['date']?['gregorian']?['date'] != requestDate) {
      throw const FormatException('Aladhan returned a different date');
    }
    try {
      await preferences.setString(
        cacheKey,
        jsonEncode({
          'date': date,
          'timings': {for (final time in times) time.kind.key: time.time},
        }),
      );
    } catch (error) {
      debugPrint('Could not cache prayer times: $error');
    }
    return times;
  }

  List<PrayerTime>? _readCache(String? cached, String date) {
    if (cached == null) return null;
    try {
      final entry = jsonDecode(cached) as Map<String, dynamic>;
      if (entry['date'] != date) return null;
      return _parseTimings(entry['timings'] as Map<String, dynamic>);
    } on FormatException {
      return null;
    } on TypeError {
      return null;
    }
  }

  List<PrayerTime> _parseTimings(Map<String, dynamic> timings) =>
      sortTimetable([
        for (final kind in PrayerKind.values)
          PrayerTime.parse(kind, timings[kind.key]),
      ]);

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
