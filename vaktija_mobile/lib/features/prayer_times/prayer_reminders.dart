import 'dart:convert';
import 'dart:io';
import 'dart:ui' show Color;

import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:workmanager/workmanager.dart';

import 'prayer_repository.dart';
import 'timetable.dart';

enum PrayerReminder {
  onTime(0),
  tenBefore(10),
  thirtyBefore(30);

  const PrayerReminder(this.minutes);

  final int minutes;

  String key(PrayerKind kind) => '${kind.name}.$minutes';

  String label(PrayerLabels labels) => this == onTime
      ? (labels.bosnian ? 'U vrijeme' : 'At prayer time')
      : (labels.bosnian ? '$minutes min prije' : '$minutes min before');

  DateTime triggersAt(PrayerTime time) =>
      time.at.subtract(Duration(minutes: minutes));
}

enum ReminderPermission { granted, notifications, exactAlarms }

class PrayerReminders {
  PrayerReminders(this.preferences)
    : enabled = _read(preferences)?.enabled ?? const {};

  static const _key = 'prayerReminders';
  static const syncTask = 'vaktija.reminders.sync';
  static const dailyTask = 'vaktija.reminders.daily';
  static const _icon = 'ic_prayer_notification';
  static const _channelId = 'prayer_reminders';
  static final _notifications = FlutterLocalNotificationsPlugin();

  final SharedPreferences preferences;
  Set<String> enabled;

  static bool get supported => !kIsWeb && Platform.isAndroid;

  static bool availableFor(PrayerKind kind) =>
      kind != PrayerKind.sunrise && !kind.isNightMarker;

  static AndroidFlutterLocalNotificationsPlugin get _android => _notifications
      .resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin
      >()!;

  Future<ReminderPermission> checkPermission() => _permission(prompt: false);

  Future<ReminderPermission> requestPermission() => _permission(prompt: true);

  Future<ReminderPermission> _permission({required bool prompt}) async {
    if (await _android.areNotificationsEnabled() != true &&
        (!prompt || await _android.requestNotificationsPermission() != true)) {
      return ReminderPermission.notifications;
    }
    if (await _android.canScheduleExactNotifications() != true &&
        (!prompt || await _android.requestExactAlarmsPermission() != true)) {
      return ReminderPermission.exactAlarms;
    }
    return ReminderPermission.granted;
  }

  Future<void> save(
    PrayerCity city,
    PrayerMethod method,
    PrayerLabels labels,
    Set<String> selection, {
    bool refresh = false,
  }) async {
    final config = _ReminderConfiguration(
      city.id,
      method,
      labels.bosnian,
      selection,
    );
    if (selection.isEmpty && enabled.isEmpty) return;
    final raw = config.encode();
    final previous = preferences.getString(_key);
    final changed = raw != previous;
    if (!changed && !refresh) return;
    var dailyRefreshChanged = false;
    try {
      if (changed && !await preferences.setString(_key, raw)) {
        throw StateError('Could not save prayer reminders');
      }
      if (selection.isNotEmpty != enabled.isNotEmpty) {
        await _setDailyRefresh(selection.isNotEmpty);
        dailyRefreshChanged = true;
      }
      await enqueueRefresh();
    } catch (_) {
      if (changed) await _restore(previous);
      if (dailyRefreshChanged) {
        try {
          await _setDailyRefresh(enabled.isNotEmpty);
        } catch (error) {
          debugPrint('Could not restore the reminder refresh: $error');
        }
      }
      rethrow;
    }
    enabled = selection;
  }

  Future<void> _setDailyRefresh(bool active) => active
      ? Workmanager().registerPeriodicTask(
          dailyTask,
          dailyTask,
          frequency: const Duration(days: 1),
          initialDelay: const Duration(days: 1),
          existingWorkPolicy: ExistingPeriodicWorkPolicy.keep,
        )
      : Workmanager().cancelByUniqueName(dailyTask);

  Future<void> _restore(String? raw) async {
    if (raw == null) {
      await preferences.remove(_key);
    } else {
      await preferences.setString(_key, raw);
    }
  }

  static Future<void> enqueueRefresh() => Workmanager().registerOneOffTask(
    syncTask,
    syncTask,
    existingWorkPolicy: ExistingWorkPolicy.append,
  );

  static _ReminderConfiguration? _read(SharedPreferences preferences) {
    final raw = preferences.getString(_key);
    if (raw == null) return null;
    try {
      final data = jsonDecode(raw) as Map<String, dynamic>;
      return _ReminderConfiguration(
        data['city'] as int,
        PrayerMethod.values.byName(data['method'] as String),
        data['bosnian'] as bool,
        (data['enabled'] as List).cast<String>().toSet(),
      );
    } on FormatException {
      return null;
    } on TypeError {
      return null;
    } on ArgumentError {
      return null;
    }
  }

  static Future<bool> refresh(PrayerRepository repository) async {
    final config = _read(repository.preferences);
    if (config == null) return true;
    await _notifications.initialize(
      settings: const InitializationSettings(
        android: AndroidInitializationSettings(_icon),
      ),
    );
    final now = repository.now();
    for (final request in await _notifications.pendingNotificationRequests()) {
      final parts = request.payload?.split('|');
      if (parts == null ||
          parts.length != 3 ||
          parts[0] != config.identity ||
          !config.enabled.contains(parts[1]) ||
          (int.tryParse(parts[2]) ?? 0) <= now.millisecondsSinceEpoch) {
        await _notifications.cancel(id: request.id);
      }
    }
    if (config.enabled.isEmpty ||
        await _android.areNotificationsEnabled() != true ||
        await _android.canScheduleExactNotifications() != true) {
      return true;
    }

    final city = repository.catalog.city(config.city);
    final labels = repository.catalog.labels(config.bosnian);
    final zone = tz.getLocation(sarajevoZone);
    final details = NotificationDetails(
      android: AndroidNotificationDetails(
        _channelId,
        labels.bosnian ? 'Namaska vremena' : 'Prayer reminders',
        icon: _icon,
        importance: Importance.high,
        priority: Priority.high,
        color: const Color(0xff256047),
        category: AndroidNotificationCategory.reminder,
        channelShowBadge: false,
      ),
    );
    // ponytail: A week of dated alarms covers normal background refresh delays.
    // If Android postpones refresh longer, opening the app replenishes the schedule.
    for (var offset = 0; offset <= 7; offset++) {
      final day = sarajevoDay(now, offset);
      final dayNumber =
          DateTime.utc(day.year, day.month, day.day).millisecondsSinceEpoch ~/
          Duration.millisecondsPerDay;
      final List<PrayerTime> times;
      try {
        times = await repository.load(city, config.method, day);
      } catch (error) {
        // Keep previously scheduled alarms and try again on the next refresh.
        debugPrint('Could not load reminder times for ${dayKey(day)}: $error');
        return true;
      }
      await repository.preferences.reload();
      if (_read(repository.preferences)?.encode() != config.encode()) {
        return true;
      }
      for (final time in times) {
        if (!availableFor(time.kind)) continue;
        final name = labels.prayer(time);
        final clock = '${padTime(time.at.hour)}:${padTime(time.at.minute)}';
        for (final reminder in PrayerReminder.values) {
          final key = reminder.key(time.kind);
          if (!config.enabled.contains(key)) continue;
          final trigger = reminder.triggersAt(time);
          if (!trigger.isAfter(repository.now())) continue;
          final payload =
              '${config.identity}|$key|${trigger.millisecondsSinceEpoch}';
          final id = dayNumber * 100 + time.kind.index * 10 + reminder.index;
          await _notifications.zonedSchedule(
            id: id,
            title: reminder == PrayerReminder.onTime
                ? (labels.bosnian
                      ? 'Vrijeme namaza · $name'
                      : '$name has begun')
                : (labels.bosnian
                      ? '$name za ${reminder.minutes} min'
                      : '$name in ${reminder.minutes} minutes'),
            body: '${city.name} · $clock',
            scheduledDate: tz.TZDateTime.from(trigger, zone),
            notificationDetails: details,
            androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
            payload: payload,
          );
        }
      }
    }
    return true;
  }
}

class _ReminderConfiguration {
  const _ReminderConfiguration(
    this.city,
    this.method,
    this.bosnian,
    this.enabled,
  );

  final int city;
  final PrayerMethod method;
  final bool bosnian;
  final Set<String> enabled;

  String get identity => '$city.${method.name}.${bosnian ? 'bs' : 'en'}';

  String encode() => jsonEncode({
    'city': city,
    'method': method.name,
    'bosnian': bosnian,
    'enabled': enabled.toList()..sort(),
  });
}
