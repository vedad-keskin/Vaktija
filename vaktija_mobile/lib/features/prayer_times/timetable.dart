import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:timezone/data/latest_all.dart' as zones;
import 'package:timezone/timezone.dart' as tz;

const prayerAssets = 'assets/prayer_times';
const sarajevoZone = 'Europe/Sarajevo';
final _sarajevo = _loadSarajevo();

tz.Location _loadSarajevo() {
  zones.initializeTimeZones();
  return tz.getLocation(sarajevoZone);
}

DateTime sarajevoNow() => tz.TZDateTime.now(_sarajevo);

String padTime(int value) => value.toString().padLeft(2, '0');

String dayKey(DateTime day) =>
    '${day.year}-${padTime(day.month)}-${padTime(day.day)}';

enum PrayerMethod { angle, iz }

enum PrayerKind {
  fajr('Fajr'),
  sunrise('Sunrise'),
  dhuhr('Dhuhr'),
  asr('Asr'),
  maghrib('Maghrib'),
  isha('Isha'),
  midnight('Midnight'),
  lastthird('Lastthird');

  const PrayerKind(this.key);

  final String key;
}

class PrayerCity {
  const PrayerCity(this.id, this.name, this.latitude, this.longitude);

  factory PrayerCity.fromJson(Map<String, dynamic> json) => PrayerCity(
    json['vaktijaId'] as int,
    json['name'] as String,
    (json['lat'] as num).toDouble(),
    (json['lng'] as num).toDouble(),
  );

  final int id;
  final String name;
  final double latitude;
  final double longitude;
}

class PrayerTime {
  const PrayerTime._(this.kind, this.time, this.minutes);

  factory PrayerTime.parse(PrayerKind kind, Object? input) {
    final time = input is String
        ? input.replaceFirst(RegExp(r'\s*\([^)]*\)$'), '').trim()
        : '';
    final valid = RegExp(r'^(?:[01]?\d|2[0-3]):[0-5]\d$');
    if (!valid.hasMatch(time)) throw FormatException('Invalid ${kind.key}');
    final parts = time.split(':');
    return PrayerTime._(
      kind,
      time,
      int.parse(parts[0]) * 60 + int.parse(parts[1]),
    );
  }

  factory PrayerTime.fromMinutes(PrayerKind kind, int minutes) =>
      PrayerTime._(kind, '${minutes ~/ 60}:${padTime(minutes % 60)}', minutes);

  final PrayerKind kind;
  final String time;
  final int minutes;
}

List<PrayerTime> sortTimetable(List<PrayerTime> times) => times
  ..sort((a, b) {
    final order = a.minutes.compareTo(b.minutes);
    return order == 0 ? a.kind.index.compareTo(b.kind.index) : order;
  });

class PrayerCatalog {
  PrayerCatalog.fromJson(Map<String, dynamic> json)
    : cities = (json['cities'] as List)
          .cast<Map<String, dynamic>>()
          .map(PrayerCity.fromJson)
          .toList(growable: false),
      _labels = json['labels'] as Map<String, dynamic>,
      _timetable = json['timetable'] as Map<String, dynamic>;

  static Future<PrayerCatalog> load() async {
    final encoded = await rootBundle.loadString('$prayerAssets/catalog.json');
    return PrayerCatalog.fromJson(jsonDecode(encoded) as Map<String, dynamic>);
  }

  final List<PrayerCity> cities;
  final Map<String, dynamic> _labels;
  final Map<String, dynamic> _timetable;

  PrayerCity city(int? id) => cities.firstWhere(
    (city) => city.id == (id ?? 77),
    orElse: () => cities.firstWhere((city) => city.id == 77),
  );

  PrayerLabels labels(bool bosnian) => PrayerLabels._(
    bosnian,
    _labels[bosnian ? 'bs' : 'en'] as Map<String, dynamic>,
  );

  List<PrayerTime> izTimes(PrayerCity city, DateTime day) {
    final month = day.month - 1;
    final base = _timetable['months'][month][day.day - 1] as List;
    final offsets = _timetable['differences'][city.id][month] as List;
    final noon = tz.TZDateTime(_sarajevo, day.year, day.month, day.day, 12);
    final summerMinutes = noon.timeZoneOffset.inHours == 2 ? 60 : 0;
    final minutes = List.generate(
      6,
      (i) => ((base[i] as int) + (offsets[i] as int)) ~/ 60 + summerMinutes,
    );
    final sunset = minutes[PrayerKind.maghrib.index];
    // Same single-day Fajr approximation as the web timetable.
    final night = 1440 - sunset + minutes[PrayerKind.fajr.index];
    minutes.add((sunset + night / 2).round() % 1440);
    minutes.add((sunset + night * 2 / 3).round() % 1440);
    return sortTimetable([
      for (final kind in PrayerKind.values)
        PrayerTime.fromMinutes(kind, minutes[kind.index]),
    ]);
  }
}

class PrayerLabels {
  const PrayerLabels._(this.bosnian, this._values);

  final bool bosnian;
  final Map<String, dynamic> _values;

  String operator [](String key) => _values[key] as String;

  String prayer(PrayerTime time, DateTime day) =>
      time.kind == PrayerKind.dhuhr && day.weekday == DateTime.friday
      ? this['dhuhrFridayName']
      : _values['prayerNames'][time.kind.key] as String;

  String date(DateTime date) {
    final day = _values['dayNames'][date.weekday % 7] as String;
    final month = _values['monthNames'][date.month - 1] as String;
    final weekday = '${day[0].toUpperCase()}${day.substring(1)}';
    if (!bosnian) return '$weekday, ${date.day} $month ${date.year}';
    final titleMonth = '${month[0].toUpperCase()}${month.substring(1)}';
    return '$weekday, ${date.day}. $titleMonth ${date.year}.';
  }

  String relative(int difference) {
    if (difference == 0) return bosnian ? 'sada' : 'now';
    final absolute = difference.abs();
    final hours = absolute ~/ 60;
    final minutes = absolute % 60;
    final String length;
    if (hours == 0) {
      final unit = bosnian
          ? _bosnianPlural(minutes, 'minutu', 'minute', 'minuta')
          : (minutes == 1 ? 'minute' : 'minutes');
      length = '$minutes $unit';
    } else if (minutes == 0) {
      final unit = bosnian
          ? _bosnianPlural(hours, 'sat', 'sata', 'sati')
          : (hours == 1 ? 'hour' : 'hours');
      length = '$hours $unit';
    } else {
      length = '${hours}h ${minutes}min';
    }
    if (bosnian) return '${difference < 0 ? 'prije' : 'za'} $length';
    return difference < 0 ? '$length ago' : 'in $length';
  }

  String _bosnianPlural(int n, String one, String few, String many) =>
      n == 1 ? one : (n >= 2 && n <= 4 ? few : many);
}

class PrayerInterval {
  PrayerInterval(List<PrayerTime> times, DateTime now)
    : nowMinutes = now.hour * 60 + now.minute {
    final next = times.indexWhere((time) => time.minutes > nowMinutes);
    nextIndex = next < 0 ? 0 : next;
    currentIndex = (nextIndex - 1) % times.length;
    final secondOfDay = nowMinutes * 60 + now.second;
    final previous = times[currentIndex].minutes * 60;
    final upcoming = times[nextIndex].minutes * 60;
    // Match the web's listed timetable across midnight until the date rolls over.
    remaining = (upcoming - secondOfDay) % 86400;
    final window = (upcoming - previous) % 86400;
    progress = window == 0
        ? 0
        : ((secondOfDay - previous) % 86400 / window).clamp(0.0, 1.0);
  }

  final int nowMinutes;
  late final int currentIndex;
  late final int nextIndex;
  late final int remaining;
  late final double progress;

  int relativeMinutes(PrayerTime time, int index) {
    final difference = time.minutes - nowMinutes;
    if (index == nextIndex && difference <= 0) return difference + 1440;
    if (index == currentIndex && difference > 0) return difference - 1440;
    return difference;
  }
}
