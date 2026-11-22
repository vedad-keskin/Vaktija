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

DateTime sarajevoTime(DateTime instant) =>
    tz.TZDateTime.from(instant, _sarajevo);

DateTime sarajevoDay(DateTime day, [int offset = 0]) =>
    tz.TZDateTime(_sarajevo, day.year, day.month, day.day + offset);

DateTime sarajevoAt(DateTime day, int minutes) => tz.TZDateTime(
  _sarajevo,
  day.year,
  day.month,
  day.day,
  minutes ~/ 60,
  minutes % 60,
);

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

  bool get isNightMarker => this == midnight || this == lastthird;
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
  PrayerTime(this.kind, DateTime instant, {this._padHours = false})
    : at = sarajevoTime(instant);

  final PrayerKind kind;
  final DateTime at;
  final bool _padHours;

  String get time =>
      '${_padHours ? padTime(at.hour) : at.hour}:${padTime(at.minute)}';
}

List<PrayerTime> sortTimetable(List<PrayerTime> times) => times
  ..sort((a, b) {
    final order = a.at.compareTo(b.at);
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
    final minutes = _izMinutes(city, day);
    final today = [
      for (final kind in PrayerKind.values.where((kind) => !kind.isNightMarker))
        PrayerTime(kind, sarajevoAt(day, minutes[kind.index])),
    ];
    final maghrib = today[PrayerKind.maghrib.index].at;
    final tomorrow = sarajevoDay(day, 1);
    final fajr = sarajevoAt(tomorrow, _izMinutes(city, tomorrow).first);
    final night = fajr.difference(maghrib).inMinutes;

    return sortTimetable([
      ...today,
      PrayerTime(
        PrayerKind.midnight,
        maghrib.add(Duration(minutes: (night / 2).round())),
      ),
      PrayerTime(
        PrayerKind.lastthird,
        maghrib.add(Duration(minutes: (night * 2 / 3).round())),
      ),
    ]);
  }

  List<int> _izMinutes(PrayerCity city, DateTime day) {
    final month = day.month - 1;
    final base = _timetable['months'][month][day.day - 1] as List;
    final offsets = _timetable['differences'][city.id][month] as List;
    final noon = tz.TZDateTime(_sarajevo, day.year, day.month, day.day, 12);
    final summerMinutes = noon.timeZoneOffset.inHours == 2 ? 60 : 0;
    return List.generate(
      6,
      (i) => ((base[i] as int) + (offsets[i] as int)) ~/ 60 + summerMinutes,
    );
  }
}

class PrayerLabels {
  const PrayerLabels._(this.bosnian, this._values);

  final bool bosnian;
  final Map<String, dynamic> _values;

  String operator [](String key) => _values[key] as String;

  String get enterFullscreen => bosnian ? 'Cijeli ekran' : 'Fullscreen';

  String get exitFullscreen =>
      bosnian ? 'Izađi iz cijelog ekrana' : 'Exit fullscreen';

  String prayer(PrayerTime time) =>
      time.kind == PrayerKind.dhuhr && time.at.weekday == DateTime.friday
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
  const PrayerInterval._(this.current, this.next, this.now);

  final PrayerTime? current;
  final PrayerTime next;
  final DateTime now;

  int get remaining =>
      (next.at.difference(now).inMicroseconds + 999999) ~/ 1000000;

  List<String> get remainingParts {
    final seconds = remaining;
    return [
      padTime(seconds ~/ 3600),
      padTime(seconds ~/ 60 % 60),
      padTime(seconds % 60),
    ];
  }

  double get progress {
    final start = current?.at;
    if (start == null) return 0;
    return (now.difference(start).inMilliseconds /
            next.at.difference(start).inMilliseconds)
        .clamp(0, 1);
  }

  static PrayerInterval? find(
    DateTime now, {
    required List<PrayerTime>? yesterday,
    required List<PrayerTime>? today,
    required List<PrayerTime>? tomorrow,
  }) {
    final previousNightKnown = yesterday?.length == PrayerKind.values.length;
    if (today == null) {
      return previousNightKnown ? _between(yesterday!, now) : null;
    }

    final fajr = today.firstWhere((time) => time.kind == PrayerKind.fajr);
    if (now.isBefore(fajr.at) && !previousNightKnown) return null;

    final tonightKnown = today.length == PrayerKind.values.length;
    final times = sortTimetable([
      ...?yesterday,
      ...today,
      if (tonightKnown) ...?tomorrow,
    ]);
    final interval = _between(times, now);
    if (!tonightKnown && interval != null) {
      final maghrib = today.firstWhere(
        (time) => time.kind == PrayerKind.maghrib,
      );
      if (interval.next.at.isAfter(maghrib.at)) return null;
    }
    return interval;
  }

  static PrayerInterval? _between(List<PrayerTime> times, DateTime now) {
    PrayerTime? current;
    for (final time in times) {
      if (time.at.isAfter(now)) return PrayerInterval._(current, time, now);
      current = time;
    }
    return null;
  }
}
