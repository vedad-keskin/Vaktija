import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vaktija/app/vaktija_dialog.dart';
import 'package:vaktija/app/vaktija_palette.dart';
import 'package:vaktija/features/prayer_times/timetable.dart';
import 'package:vaktija/features/qibla/qibla_calibration.dart';
import 'package:vaktija/features/qibla/qibla_copy.dart';
import 'package:vaktija/features/qibla/qibla_dial.dart';
import 'package:vaktija/features/qibla/qibla_direction.dart';
import 'package:vaktija/features/qibla/qibla_heading.dart';
import 'package:vaktija/features/qibla/qibla_page.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'Qibla help keeps four questions and uses no semicolons in either language',
    () {
      for (final copy in qiblaCopy.values) {
        expect(copy.faq, hasLength(4));
        expect([
          ...copy.labels.values,
          for (final item in copy.faq) ...[item.question, item.answer],
        ], everyElement(isNot(contains(';'))));
      }
    },
  );

  test('offline bearing and north correction agree with the web', () async {
    final sarajevo = qiblaDirection(43.8486, 18.3564)!;
    expect(sarajevo.bearing, closeTo(134.5331097433056, 1e-8));
    expect(sarajevo.distanceKm, closeTo(3180.23573722199, 1e-8));
    expect(
      qiblaDirection(43.6603, 17.7617)?.bearing,
      closeTo(133.3281206450339, 1e-8),
    );
    expect(qiblaDirection(21.422487, 39.826206)?.bearing, isNull);
    expect(qiblaDirection(-21.422487, -140.173794)?.bearing, isNull);

    final model = await loadQiblaMagneticModel(rootBundle);
    expect(
      qiblaDeclination(model, 43.6603, 17.7617, DateTime(2026, 11, 22)),
      closeTo(5.082874184573898, .002),
    );
    expect(qiblaDeclination(model, 43.6603, 17.7617, DateTime(2030)), isNull);
  });

  test(
    'alignment crosses north and only vibrates again after turning away',
    () {
      final heading = QiblaHeading();
      expect(heading.add(359, 0, 0), isFalse);
      expect(heading.add(0, 0, 150), isFalse);
      expect(heading.add(1, 0, 300), isTrue);
      expect(heading.displayed, closeTo(360, 2));
      expect(heading.aligned, isTrue);
      expect(heading.add(1, 0, 450), isFalse);

      heading.clear();
      expect(heading.add(0, 0, 1000), isFalse);
      expect(heading.add(0, 0, 1300), isFalse);
      expect(heading.aligned, isTrue);

      for (var time = 1400; time <= 2100; time += 100) {
        expect(heading.add(28, 0, time), isFalse);
      }
      expect(heading.aligned, isFalse);
      var pulses = 0;
      for (var time = 2200; time <= 3200; time += 100) {
        if (heading.add(0, 0, time)) pulses++;
      }
      expect(pulses, 1);
      expect(heading.aligned, isTrue);
    },
  );

  testWidgets(
    'calibration gates the compass, guidance stays in place, and leaving stops the stream',
    (tester) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = const Size(360, 760);
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.view.resetPhysicalSize);
      const heading = MethodChannel('vaktija/qibla/heading');
      const location = MethodChannel('vaktija/qibla');
      final sensorCalls = <String>[];
      final locationCalls = <String>[];
      final messages = tester.binding.defaultBinaryMessenger;
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      final modelData = (await tester.runAsync(
        () => rootBundle.loadString(_modelAsset),
      ))!;
      messages.setMockMethodCallHandler(heading, (call) async {
        sensorCalls.add(call.method);
        return null;
      });
      messages.setMockMethodCallHandler(location, (call) async {
        locationCalls.add(call.method);
        throw PlatformException(code: 'denied');
      });

      await tester.pumpWidget(
        DefaultAssetBundle(
          bundle: _MagneticModelAsset(modelData),
          child: _page(brightness: Brightness.light),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('133.3°'), findsOneWidget);
      expect(find.text('TRUE NORTH'), findsOneWidget);
      expect(sensorCalls, isEmpty);
      expect(locationCalls, isEmpty);

      final guidance = find.byKey(const ValueKey('qibla-guidance'));
      final guidanceRect = tester.getRect(guidance);
      final illustration = find.byType(QiblaGuidanceIcon);
      QiblaGuidanceCue cue() =>
          tester.widget<QiblaGuidanceIcon>(illustration).cue;
      Finder guideTitle(String title) => find.descendant(
        of: find.descendant(
          of: guidance,
          matching: find.byType(AnimatedSwitcher),
        ),
        matching: find.text(title),
      );

      expect(guideTitle('Start and calibrate the compass'), findsOneWidget);
      expect(cue(), QiblaGuidanceCue.calibration);
      expect(tester.getSize(illustration), const Size(42, 49));
      expect(tester.getCenter(illustration).dy, guidanceRect.center.dy);
      final start = find.text('START COMPASS');
      await tester.tap(start);
      await tester.pumpAndSettle();
      expect(
        find.descendant(
          of: find.byType(VaktijaDialog),
          matching: find.text('Calibrate Your Compass'),
        ),
        findsOneWidget,
      );
      expect(sensorCalls, isEmpty);
      await tester.binding.handlePopRoute();
      await tester.pumpAndSettle();
      expect(sensorCalls, isEmpty);

      await tester.tap(start);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Skip'));
      await tester.pumpAndSettle();
      expect(sensorCalls, ['listen']);
      expect(locationCalls, isEmpty);
      expect(guideTitle('Waiting for a compass reading'), findsOneWidget);
      expect(cue(), QiblaGuidanceCue.waiting);
      expect(tester.getRect(guidance), guidanceRect);

      final model = await loadQiblaMagneticModel(
        _MagneticModelAsset(modelData),
      );
      final declination = qiblaDeclination(
        model,
        43.6603,
        17.7617,
        DateTime.now(),
      )!;
      final magneticHeading =
          qiblaDirection(43.6603, 17.7617)!.bearing! - declination;
      Future<void> sendHeading(
        String quality, {
        double offset = 0,
        int rotation = 0,
      }) => messages.handlePlatformMessage(
        heading.name,
        const StandardMethodCodec().encodeSuccessEnvelope({
          'heading': magneticHeading + offset,
          'rotation': rotation,
          'quality': quality,
        }),
        (_) {},
      );
      await sendHeading('tilt');
      await tester.pumpAndSettle();
      expect(guideTitle('Incorrect phone position'), findsOneWidget);
      expect(cue(), QiblaGuidanceCue.level);
      expect(tester.getRect(guidance), guidanceRect);

      await sendHeading('good', offset: -35);
      await tester.pump();
      expect(guideTitle('Turn right'), findsOneWidget);
      expect(cue(), QiblaGuidanceCue.right);
      expect(tester.getRect(guidance), guidanceRect);

      await sendHeading('good', offset: 35, rotation: 1);
      await tester.pump();
      expect(guideTitle('Turn left'), findsOneWidget);
      expect(cue(), QiblaGuidanceCue.left);
      expect(tester.getRect(guidance), guidanceRect);

      await sendHeading('good');
      await tester.pump();
      expect(guideTitle('Turn left'), findsOneWidget);
      expect(cue(), QiblaGuidanceCue.left);
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 310)),
      );
      await sendHeading('good');
      await tester.pump();

      final confirmation = guideTitle('You are facing the Qibla');
      expect(confirmation, findsOneWidget);
      expect(cue(), QiblaGuidanceCue.aligned);
      expect(tester.getRect(guidance), guidanceRect);
      expect(tester.getCenter(illustration).dy, guidanceRect.center.dy);
      final accent = const VaktijaPalette(false).accent;
      final ink = tester.widget<Text>(confirmation).style!.color!;
      final background =
          (tester.widget<Container>(guidance).decoration! as BoxDecoration)
              .color!;
      expect(ink, accent);
      expect(
        (background.computeLuminance() + .05) / (ink.computeLuminance() + .05),
        greaterThan(4.5),
      );
      expect(tester.widget<QiblaDial>(find.byType(QiblaDial)).aligned, isTrue);
      await sendHeading('accuracy');
      await tester.pump();
      expect(confirmation, findsNothing);
      expect(guideTitle('Calibrate Your Compass'), findsOneWidget);
      expect(cue(), QiblaGuidanceCue.calibration);
      expect(tester.widget<QiblaDial>(find.byType(QiblaDial)).aligned, isFalse);
      expect(tester.getRect(guidance), guidanceRect);

      await tester.pump(qiblaHeadingStale);
      expect(guideTitle('No compass signal'), findsOneWidget);
      expect(cue(), QiblaGuidanceCue.noSignal);
      expect(tester.getRect(guidance), guidanceRect);

      await tester.tap(find.text('My location'));
      await tester.pumpAndSettle();
      expect(locationCalls, ['location']);
      expect(
        find.text('Location was denied. Enable it in the app settings.'),
        findsOneWidget,
      );
      expect(find.text('133.3°'), findsOneWidget);

      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.inactive);
      await tester.pumpAndSettle();
      expect(sensorCalls, ['listen', 'cancel']);
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      await tester.pumpAndSettle();
      await tester.pumpWidget(const SizedBox());
      await tester.pumpAndSettle();
      expect(sensorCalls, ['listen', 'cancel', 'listen', 'cancel']);
    },
  );

  testWidgets('narrow and compact landscape Qibla layouts fit larger text', (
    tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    for (final (size, theme) in [
      (const Size(320, 640), Brightness.light),
      (const Size(832, 384), Brightness.dark),
    ]) {
      tester.view.physicalSize = size;
      await tester.pumpWidget(_page(brightness: theme, textScale: 1.75));
      await tester.pumpAndSettle();
      final start = find.text('START COMPASS');
      await tester.scrollUntilVisible(start, 120);
      await tester.pumpAndSettle();
      await tester.ensureVisible(start);
      await tester.pumpAndSettle();
      await tester.tap(start);
      await tester.pumpAndSettle();
      expect(find.byType(VaktijaDialog), findsOneWidget);
      expect(find.text('Skip').hitTestable(), findsOneWidget);
      expect(find.text('Done').hitTestable(), findsOneWidget);
      await tester.binding.handlePopRoute();
      await tester.pumpAndSettle();
      final faq = find.text('Do I need to enable location?');
      await tester.scrollUntilVisible(faq, 160);
      await tester.pumpAndSettle();
      await tester.ensureVisible(faq);
      await tester.pumpAndSettle();
      await tester.tap(faq);
      await tester.pumpAndSettle();
      expect(
        find.textContaining(
          'Your selected city works offline without location permission.',
        ),
        findsOneWidget,
      );
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox());
    }
  });

  for (final outcome in ['enabled', 'cancelled', 'disposed', 'background']) {
    testWidgets('native location prompt: $outcome', (tester) async {
      const location = MethodChannel('vaktija/qibla');
      final messages = tester.binding.defaultBinaryMessenger;
      final fix = Completer<List<double>>();
      final calls = <MethodCall>[];
      messages.setMockMethodCallHandler(location, (call) async {
        calls.add(call);
        if (call.method == 'cancelLocation') {
          return outcome == 'background' ||
              call.arguments['background'] != true;
        }
        return fix.future;
      });
      addTearDown(() => messages.setMockMethodCallHandler(location, null));
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      await tester.pumpWidget(_page());
      await tester.pumpAndSettle();
      await tester.tap(find.text('My location'));
      await tester.pumpAndSettle();
      expect(find.text('Getting your location…'), findsOneWidget);
      expect(find.byType(VaktijaDialog), findsNothing);

      if (outcome == 'disposed') {
        await tester.pumpWidget(const SizedBox());
      }
      await _returnFromLocationSettings(tester);
      if (outcome == 'cancelled') {
        fix.completeError(PlatformException(code: 'cancelled'));
      } else {
        fix.complete([43.8486, 18.3564]);
      }
      await tester.pumpAndSettle();
      expect(calls.where((call) => call.method == 'location'), hasLength(1));
      expect(find.byType(VaktijaDialog), findsNothing);
      if (outcome == 'enabled') {
        expect(find.text('134.5°'), findsOneWidget);
      } else if (outcome != 'disposed') {
        expect(find.text('133.3°'), findsOneWidget);
        expect(
          find.text('Could not get location. Check permissions and GPS.'),
          findsNothing,
        );
      }
      expect(find.text('Getting your location…'), findsNothing);
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox());
    });
  }

  for (final (platform, failure, outcome) in [
    (TargetPlatform.android, 'services_disabled', 'enabled'),
    (TargetPlatform.android, 'services_disabled', 'disabled'),
    (TargetPlatform.android, 'services_disabled', 'unavailable'),
    (TargetPlatform.android, 'services_disabled', 'disposed'),
    (TargetPlatform.android, 'denied', 'enabled'),
    (TargetPlatform.iOS, 'denied', 'enabled'),
    (TargetPlatform.iOS, 'services_disabled', 'disabled'),
  ]) {
    testWidgets(
      'inline location recovery: $platform/$failure/$outcome',
      (tester) async {
        const location = MethodChannel('vaktija/qibla');
        final messages = tester.binding.defaultBinaryMessenger;
        final calls = <String>[];
        var enabled = false;
        messages.setMockMethodCallHandler(location, (call) async {
          calls.add(call.method);
          if (call.method == 'openLocationSettings') {
            expect(call.arguments, {'app': failure == 'denied'});
            if (outcome == 'unavailable') {
              throw PlatformException(code: 'unavailable');
            }
            return null;
          }
          if (enabled) return [43.8486, 18.3564];
          throw PlatformException(code: failure);
        });
        addTearDown(() => messages.setMockMethodCallHandler(location, null));
        tester.view.devicePixelRatio = 1;
        tester.view.physicalSize = const Size(320, 640);
        addTearDown(tester.view.resetDevicePixelRatio);
        addTearDown(tester.view.resetPhysicalSize);
        tester.binding.handleAppLifecycleStateChanged(
          AppLifecycleState.resumed,
        );
        await tester.pumpWidget(_page(textScale: 1.75));
        await tester.pumpAndSettle();

        await tester.ensureVisible(find.text('My location'));
        await tester.pumpAndSettle();
        await tester.tap(find.text('My location'));
        await tester.pumpAndSettle();
        expect(find.byType(VaktijaDialog), findsNothing);
        expect(find.text('133.3°'), findsOneWidget);
        await _returnFromLocationSettings(tester);
        expect(calls, ['location']);

        if (platform == TargetPlatform.iOS && failure == 'services_disabled') {
          expect(
            find.text(qiblaCopy['en']!.labels['qiblaGpsDisabledIos']!),
            findsOneWidget,
          );
          expect(find.text('Open location settings'), findsNothing);
          expect(find.text('Open app settings'), findsNothing);
          await tester.pumpWidget(const SizedBox());
          return;
        }
        final settings = find.text(
          failure == 'denied' ? 'Open app settings' : 'Open location settings',
        );
        await tester.ensureVisible(settings);
        await tester.pumpAndSettle();
        await tester.tap(settings);
        await tester.pumpAndSettle();
        expect(calls, ['location', 'openLocationSettings']);
        enabled = outcome == 'enabled';
        if (outcome == 'disposed') {
          await tester.pumpWidget(const SizedBox());
        }
        await _returnFromLocationSettings(tester);
        expect(find.byType(VaktijaDialog), findsNothing);
        expect(
          calls.where((call) => call == 'location').length,
          outcome == 'enabled' || outcome == 'disabled' ? 2 : 1,
        );
        if (outcome == 'enabled') {
          expect(find.text('134.5°'), findsOneWidget);
          expect(find.text('43.8486°, 18.3564°'), findsOneWidget);
        } else if (outcome != 'disposed') {
          expect(find.text('133.3°'), findsOneWidget);
          expect(
            find.text(
              qiblaCopy['en']!.labels[outcome == 'disabled'
                  ? 'qiblaGpsDisabled'
                  : 'qiblaGpsError']!,
            ),
            findsOneWidget,
          );
        }
        final callCount = calls.length;
        await _returnFromLocationSettings(tester);
        expect(calls, hasLength(callCount));
        expect(tester.takeException(), isNull);
        await tester.pumpWidget(const SizedBox());
      },
      variant: TargetPlatformVariant({platform}),
    );
  }
}

Future<void> _returnFromLocationSettings(WidgetTester tester) async {
  for (final state in [
    AppLifecycleState.inactive,
    AppLifecycleState.hidden,
    AppLifecycleState.paused,
    AppLifecycleState.hidden,
    AppLifecycleState.inactive,
    AppLifecycleState.resumed,
  ]) {
    tester.binding.handleAppLifecycleStateChanged(state);
    await tester.pump();
  }
  await tester.pumpAndSettle();
}

const _modelAsset = 'assets/qibla/WMM2025.COF';

class _MagneticModelAsset extends CachingAssetBundle {
  _MagneticModelAsset(this.model);

  final String model;

  @override
  Future<ByteData> load(String key) => rootBundle.load(key);

  @override
  Future<String> loadString(String key, {bool cache = true}) =>
      key == _modelAsset
      ? SynchronousFuture(model)
      : super.loadString(key, cache: cache);
}

Widget _page({Brightness brightness = Brightness.dark, double textScale = 1}) =>
    MaterialApp(
      theme: ThemeData(brightness: brightness),
      builder: (context, child) => MediaQuery(
        data: MediaQuery.of(context).copyWith(
          disableAnimations: true,
          textScaler: TextScaler.linear(textScale),
        ),
        child: child!,
      ),
      home: Scaffold(
        body: QiblaPage(
          header: const SizedBox(height: 24),
          city: const PrayerCity(1, 'Jablanica', 43.6603, 17.7617),
          language: 'en',
          onBack: () {},
        ),
      ),
    );
