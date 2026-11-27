import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:home_widget/home_widget.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workmanager/workmanager.dart';

import 'prayer_repository.dart';
import 'timetable.dart';

const _configurationKey = 'vaktija.widgets.configuration';
const _workTag = 'vaktija.widgets';
const _syncTask = 'vaktija.widgets.sync';
const _dailyTask = 'vaktija.widgets.daily';
const _providers = [
  'com.vaktija.app.widgets.PrayerListWidget',
  'com.vaktija.app.widgets.PrayerGridWidget',
  'com.vaktija.app.widgets.PrayerCountdownWidget',
];

class PrayerWidgetConfiguration {
  const PrayerWidgetConfiguration(this.city, this.method, this.bosnian);

  final PrayerCity city;
  final PrayerMethod? method;
  final bool bosnian;

  String get key =>
      '${city.id}.${method?.name ?? 'setup'}.${bosnian ? 'bs' : 'en'}';

  Map<String, Object?> toJson() => {
    'version': 1,
    'key': key,
    'city': city.id,
    'cityName': city.name,
    'method': method?.name,
    'language': bosnian ? 'bs' : 'en',
    'timezone': sarajevoZone,
  };

  static PrayerWidgetConfiguration? parse(String? raw, PrayerCatalog catalog) {
    if (raw == null) return null;
    try {
      final json = jsonDecode(raw) as Map<String, dynamic>;
      final city = catalog.city(json['city'] as int);
      final method = switch (json['method']) {
        'angle' => PrayerMethod.angle,
        'iz' => PrayerMethod.iz,
        null => null,
        _ => throw const FormatException('Unknown widget prayer method'),
      };
      final language = json['language'];
      final configuration = PrayerWidgetConfiguration(
        city,
        method,
        language == 'bs',
      );
      if (json['version'] != 1 ||
          json['timezone'] != sarajevoZone ||
          json['city'] != city.id ||
          !['bs', 'en'].contains(language) ||
          json['key'] != configuration.key) {
        return null;
      }
      return configuration;
    } on FormatException {
      return null;
    } on TypeError {
      return null;
    }
  }
}

Map<String, Object?> prayerWidgetDay(
  PrayerWidgetConfiguration configuration,
  PrayerLabels labels,
  DateTime day,
  List<PrayerTime> times, {
  List<PrayerTime>? calendarTimes,
  bool calendarComplete = true,
}) {
  final date = dayKey(day);
  final lookup = {for (final time in times) time.kind: time};
  final title = labels.date(day);
  final comma = title.indexOf(',');
  return {
    'version': 1,
    'configuration': configuration.key,
    'day': date,
    'weekday': title.substring(0, comma),
    'date': title.substring(comma + 1).trim(),
    'shortDate': '${padTime(day.day)}.${padTime(day.month)}.${day.year}.',
    'rows': [
      for (final kind in PrayerKind.values)
        _widgetPrayer(kind, lookup[kind], labels, day),
    ],
    if (calendarTimes != null)
      'calendarRows': [
        for (final time in calendarTimes)
          _widgetPrayer(time.kind, time, labels, day),
      ],
    if (calendarTimes != null) 'calendarComplete': calendarComplete,
  };
}

Map<String, Object?> _widgetPrayer(
  PrayerKind kind,
  PrayerTime? time,
  PrayerLabels labels,
  DateTime day,
) {
  final eventDate = time == null ? null : dayKey(time.at);
  final nextDate = dayKey(sarajevoDay(day, 1));
  if (time != null &&
      eventDate != dayKey(day) &&
      !(kind.isNightMarker && eventDate == nextDate)) {
    throw const FormatException('Widget event belongs to a different date');
  }
  return {
    'kind': kind.name,
    'name': labels.prayer(time ?? PrayerTime(kind, sarajevoAt(day, 720))),
    'time': time == null
        ? null
        : '${padTime(time.at.hour)}:${padTime(time.at.minute)}',
    'at': time?.at.toUtc().toIso8601String(),
    'eventDate': time == null ? labels.date(day) : labels.date(time.at),
    'nextDay': eventDate == nextDate,
  };
}

@pragma('vm:entry-point')
void prayerWidgetDispatcher() {
  Workmanager().executeTask((task, input) async {
    if (task != _syncTask && task != _dailyTask) return true;
    try {
      final preferences = await SharedPreferences.getInstance();
      await preferences.reload();
      final catalog = await PrayerCatalog.load();
      return await PrayerWidgets(
        PrayerRepository(catalog, preferences),
      ).refresh();
    } catch (error, stack) {
      debugPrint('Widget background update failed: $error\n$stack');
      return false;
    }
  });
}

@pragma('vm:entry-point')
Future<void> prayerWidgetLifecycle(Uri? uri) async {
  if (uri?.scheme != 'vaktija' || uri?.host != 'widgets') return;
  await PrayerWidgets.requestRefresh();
}

class PrayerWidgets {
  PrayerWidgets(this.repository);

  final PrayerRepository repository;
  Future<void> _configurationWrites = Future.value();
  static Future<void>? _initialization;

  static bool get supported => !kIsWeb && Platform.isAndroid;

  static Future<void> initialize() async {
    if (!supported) return;
    try {
      await (_initialization ??= (() async {
        await Workmanager().initialize(prayerWidgetDispatcher);
        await HomeWidget.registerInteractivityCallback(prayerWidgetLifecycle);
      })());
    } catch (_) {
      _initialization = null;
      rethrow;
    }
  }

  static Future<void> requestRefresh() async {
    if (!supported) return;
    if ((await HomeWidget.getInstalledWidgets()).isEmpty) return;
    await Workmanager().registerPeriodicTask(
      _dailyTask,
      _dailyTask,
      frequency: const Duration(days: 1),
      initialDelay: const Duration(days: 1),
      existingWorkPolicy: ExistingPeriodicWorkPolicy.keep,
      tag: _workTag,
    );
    await Workmanager().registerOneOffTask(
      _syncTask,
      _syncTask,
      existingWorkPolicy: ExistingWorkPolicy.keep,
      backoffPolicy: BackoffPolicy.exponential,
      backoffPolicyDelay: const Duration(minutes: 1),
      tag: _workTag,
    );
  }

  Future<void> configure(
    PrayerCity city,
    PrayerMethod? method,
    PrayerLabels labels,
  ) async {
    if (!supported) return;
    final configuration = PrayerWidgetConfiguration(
      city,
      method,
      labels.bosnian,
    );
    try {
      await initialize();
      // Keep configuration writes ordered without waiting for network responses.
      _configurationWrites = _configurationWrites
          .catchError((Object error) {
            debugPrint('Could not save the previous widget selection: $error');
          })
          .then((_) async {
            await HomeWidget.saveWidgetData(
              _configurationKey,
              jsonEncode(configuration.toJson()),
            );
            await _updateProviders();
          });
      await _configurationWrites;
      if ((await HomeWidget.getInstalledWidgets()).isEmpty) return;
      await requestRefresh();
      await repository.preferences.reload();
      if (method != null) {
        await _publishDay(configuration, repository.now());
        await _updateProviders();
      }
    } catch (error, stack) {
      debugPrint('Could not synchronize prayer widgets: $error\n$stack');
    }
  }

  Future<bool> refresh() async {
    if ((await HomeWidget.getInstalledWidgets()).isEmpty) return true;
    final configuration = await _readConfiguration();
    if (configuration?.method == null) {
      await _updateProviders();
      return true;
    }
    final active = configuration!;
    final day = repository.now();
    await _updateProviders();
    var complete = true;
    for (var offset = 0; offset <= 7; offset++) {
      if ((await _readConfiguration())?.key != active.key) return false;
      if ((await HomeWidget.getInstalledWidgets()).isEmpty) return true;
      try {
        final prepared = await _publishDay(active, sarajevoDay(day, offset));
        complete = complete && prepared;
        if (offset == 0) await _updateProviders();
      } catch (error) {
        complete = false;
        await HomeWidget.saveWidgetData(
          'vaktija.widgets.failure.${active.key}.${dayKey(sarajevoDay(day, offset))}',
          true,
        );
        debugPrint(
          'Could not prepare widget date ${dayKey(sarajevoDay(day, offset))}: $error',
        );
        // Retry through WorkManager before requesting more dates from an unavailable API.
        break;
      }
    }
    await _updateProviders();
    return complete && (await _readConfiguration())?.key == active.key;
  }

  Future<PrayerWidgetConfiguration?> _readConfiguration() async =>
      PrayerWidgetConfiguration.parse(
        await HomeWidget.getWidgetData<String>(_configurationKey),
        repository.catalog,
      );

  Future<bool> _publishDay(
    PrayerWidgetConfiguration configuration,
    DateTime day,
  ) async {
    final localDay = sarajevoDay(day);
    final times = await repository.load(
      configuration.city,
      configuration.method!,
      localDay,
    );
    List<PrayerTime>? yesterday;
    try {
      yesterday = await repository.load(
        configuration.city,
        configuration.method!,
        sarajevoDay(localDay, -1),
      );
    } catch (error) {
      debugPrint('Could not load the previous night for the widget: $error');
    }
    final payload = prayerWidgetDay(
      configuration,
      repository.catalog.labels(configuration.bosnian),
      localDay,
      times,
      calendarTimes: calendarTimetable(
        localDay,
        yesterday: yesterday,
        today: times,
      ),
      calendarComplete:
          times.length == PrayerKind.values.length &&
          yesterday?.length == PrayerKind.values.length,
    );
    final previousIsha = yesterday
        ?.where((time) => time.kind == PrayerKind.isha)
        .firstOrNull;
    if (previousIsha != null) {
      payload['previousIsha'] = previousIsha.at.toUtc().toIso8601String();
    }
    await HomeWidget.saveWidgetData(
      'vaktija.widgets.day.${configuration.key}.${dayKey(localDay)}',
      jsonEncode(payload),
    );
    await HomeWidget.saveWidgetData<bool>(
      'vaktija.widgets.failure.${configuration.key}.${dayKey(localDay)}',
      null,
    );
    return times.length == PrayerKind.values.length &&
        yesterday?.length == PrayerKind.values.length;
  }

  Future<void> _updateProviders() async {
    for (final provider in _providers) {
      await HomeWidget.updateWidget(qualifiedAndroidName: provider);
    }
  }
}
