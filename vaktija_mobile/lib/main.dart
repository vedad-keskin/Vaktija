import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'app/vaktija_app.dart';
import 'features/prayer_times/prayer_widgets.dart';

void main() {
  final binding = WidgetsFlutterBinding.ensureInitialized();
  unawaited(
    PrayerWidgets.initialize().catchError((Object error) {
      debugPrint('Could not initialize prayer widgets: $error');
    }),
  );
  binding.deferFirstFrame();
  runApp(
    VaktijaApp(
      launchReady: _waitForNativeLaunch(binding.waitUntilFirstFrameRasterized),
      onOpeningFrameReady: binding.allowFirstFrame,
    ),
  );
}

Future<void> _waitForNativeLaunch(Future<void> firstFrame) async {
  await firstFrame;
  if (!kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS)) {
    try {
      await const MethodChannel(
        'vaktija/launch',
      ).invokeMethod<void>('waitForExit').timeout(const Duration(seconds: 1));
    } on MissingPluginException {
      // The Flutter frame is sufficient on hosts without a native overlay.
    } on TimeoutException {
      // Android can launch directly into the activity without a splash view.
    }
  }
}
