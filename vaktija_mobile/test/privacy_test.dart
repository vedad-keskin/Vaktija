import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vaktija/app/mobile_header.dart';
import 'package:vaktija/features/prayer_times/timetable.dart';

void main() {
  testWidgets(
    'privacy link opens externally and shows its address on failure',
    (tester) async {
      final catalog = (await tester.runAsync(PrayerCatalog.load))!;
      const channel = MethodChannel('plugins.flutter.io/url_launcher');
      final calls = <MethodCall>[];
      var succeeds = true;
      var throws = false;
      tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(channel, (
        call,
      ) async {
        calls.add(call);
        if (throws) throw PlatformException(code: 'unavailable');
        return succeeds;
      });
      addTearDown(
        () => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
          channel,
          null,
        ),
      );

      for (final bosnian in [false, true]) {
        succeeds = true;
        throws = false;
        await tester.pumpWidget(
          MaterialApp(
            key: ValueKey(bosnian),
            home: Scaffold(
              body: VaktijaMenu(
                open: true,
                labels: catalog.labels(bosnian),
                section: MobileSection.prayerTimes,
                method: PrayerMethod.iz,
                onSection: (_) =>
                    fail('Privacy must preserve the current page'),
                onMethod: (_) =>
                    fail('Privacy must preserve the prayer method'),
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();
        final link = find.text(
          bosnian ? 'Politika privatnosti' : 'Privacy policy',
        );
        await tester.tap(link);
        await tester.pumpAndSettle();
        expect(calls.last.method, 'launch');
        expect(calls.last.arguments['url'], 'https://vaktija.life/privacy');
        expect(calls.last.arguments['useWebView'], isFalse);
        expect(calls.last.arguments['useSafariVC'], isFalse);
        expect(find.byType(SnackBar), findsNothing);

        succeeds = false;
        throws = bosnian;
        await tester.tap(link);
        await tester.pumpAndSettle();
        expect(find.byType(SnackBar), findsOneWidget);
        expect(find.textContaining('vaktija.life/privacy'), findsOneWidget);
        expect(tester.takeException(), isNull);
      }
      expect(calls, hasLength(4));
    },
  );
}
