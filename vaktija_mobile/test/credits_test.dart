import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vaktija/app/app_shell.dart';
import 'package:vaktija/app/credits_dialog.dart';
import 'package:vaktija/app/mobile_header.dart';
import 'package:vaktija/features/prayer_times/prayer_repository.dart';
import 'package:vaktija/features/prayer_times/timetable.dart';
import 'package:vaktija/features/qibla/qibla_page.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  const appChannel = MethodChannel('vaktija/app');

  setUp(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(appChannel, (call) async {
          expect(call.method, 'getVersion');
          return '9.8.7';
        });
  });

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(appChannel, null);
  });

  testWidgets(
    'logo requires five uninterrupted seconds and preserves navigation',
    (tester) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = const Size(320, 640);
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.view.resetPhysicalSize);
      final repository = (await tester.runAsync(() async {
        SharedPreferences.setMockInitialValues({
          'method': 'iz',
          'language': 'en',
        });
        return PrayerRepository(
          await PrayerCatalog.load(),
          await SharedPreferences.getInstance(),
        );
      }))!;
      await tester.pumpWidget(
        MaterialApp(
          theme: ThemeData(brightness: Brightness.dark),
          darkTheme: ThemeData(brightness: Brightness.dark),
          themeMode: ThemeMode.dark,
          home: AppShell(repository: repository, onThemeChanged: (_) {}),
        ),
      );
      await tester.pumpAndSettle();
      final logo = find.byType(CreditsTrigger);
      expect(tester.getSize(logo).shortestSide, greaterThanOrEqualTo(48));

      Future<void> goToQibla() async {
        await tester.tap(find.byTooltip('Menu'));
        await tester.pumpAndSettle();
        await tester.tap(
          find.text(
            repository.catalog.labels(false)['qiblaNavTitle'].toUpperCase(),
          ),
        );
        await tester.pumpAndSettle();
      }

      await goToQibla();
      final originalHeader = tester.widget<MobileHeader>(
        find.byType(MobileHeader),
      );
      var hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(milliseconds: 4999));
      expect(find.byType(CreditsDialog), findsNothing);
      await hold.up();
      await tester.pumpAndSettle();
      await tester.pump(const Duration(seconds: 1));
      expect(find.byType(CreditsDialog), findsNothing);

      await goToQibla();
      hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(seconds: 2));
      await hold.moveBy(const Offset(80, 0));
      await tester.pump(const Duration(seconds: 4));
      await hold.up();
      await tester.pumpAndSettle();
      expect(find.byType(CreditsDialog), findsNothing);

      hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(seconds: 2));
      await hold.cancel();
      await tester.pump(const Duration(seconds: 4));
      expect(find.byType(CreditsDialog), findsNothing);

      hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(seconds: 2));
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.inactive);
      await tester.pump();
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      await tester.pump(const Duration(seconds: 4));
      await hold.up();
      await tester.pumpAndSettle();
      expect(find.byType(CreditsDialog), findsNothing);

      hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(milliseconds: 4999));
      expect(find.byType(CreditsDialog), findsNothing);
      await tester.pump(const Duration(milliseconds: 1));
      await tester.pump();
      expect(find.byType(CreditsDialog), findsOneWidget);
      await hold.up();
      final pop = find.byKey(const ValueKey('credits-pop'));
      double scale() => tester.widget<ScaleTransition>(pop).scale.value;
      final openingScale = scale();
      expect(openingScale, lessThan(1));
      await tester.pump(const Duration(milliseconds: 100));
      expect(scale(), greaterThan(openingScale));
      await tester.pump(const Duration(milliseconds: 700));
      expect(
        tester
            .widgetList<FadeTransition>(
              find.descendant(
                of: find.byType(CreditsDialog),
                matching: find.byType(FadeTransition),
              ),
            )
            .every((fade) => fade.opacity.value == 1),
        isTrue,
      );
      await tester.pumpAndSettle();
      expect(find.text('Vedad Keskin'), findsOneWidget);
      expect(find.text('Samija Bešić'), findsOneWidget);
      expect(find.text('Lead Developer'), findsOneWidget);
      expect(find.text('Content Research'), findsOneWidget);
      expect(find.text('v9.8.7'), findsOneWidget);
      expect(
        find.descendant(
          of: find.byType(CreditsDialog),
          matching: find.image(
            const AssetImage(
              'assets/prayer_times/mosque-horizon-mobile-dark.webp',
            ),
          ),
        ),
        findsOneWidget,
      );
      final credits = find.byType(CreditsDialog);
      expect(
        find.descendant(of: credits, matching: find.text('Vaktija')),
        findsNothing,
      );
      expect(
        find.descendant(of: credits, matching: find.text('Credits')),
        findsNothing,
      );
      final nameStyle = tester.widget<Text>(find.text('Vedad Keskin')).style!;
      expect(nameStyle.fontFamily, 'Lilita One');
      expect(nameStyle.fontFamilyFallback, contains('Paytone One'));
      final branding = find.byKey(const ValueKey('credits-studio'));
      final version = find.byKey(const ValueKey('app-version'));
      final dialog = find.descendant(
        of: credits,
        matching: find.byType(Dialog),
      );
      final surface = find
          .descendant(of: dialog, matching: find.byType(Material))
          .first;
      expect(tester.getSize(surface).width, lessThan(320));
      expect(tester.getSize(surface).height, lessThan(640));
      expect(
        tester.getCenter(branding).dx,
        closeTo(tester.getCenter(dialog).dx, .01),
      );
      expect(
        tester.getCenter(version).dx,
        closeTo(tester.getCenter(branding).dx, .01),
      );
      expect(
        tester.getTopLeft(version).dy,
        greaterThan(tester.getBottomLeft(branding).dy),
      );
      expect(
        tester.getBottomLeft(version).dy,
        lessThan(tester.getTopLeft(find.text('Lead Developer')).dy),
      );
      final mark = find.descendant(
        of: credits,
        matching: find.image(const AssetImage('assets/branding/logo.png')),
      );
      expect(
        tester.getTopLeft(mark).dy,
        greaterThan(tester.getBottomLeft(version).dy),
      );
      expect(
        tester.getCenter(find.byTooltip('Close')).dy,
        lessThan(tester.getTopLeft(mark).dy),
      );
      final close = tester.widget<IconButton>(
        find.byKey(const ValueKey('credits-close')),
      );
      expect(close.style!.side!.resolve({})!.color, const Color(0xff7b713f));
      expect(close.style!.fixedSize!.resolve({}), const Size.square(32));
      expect(close.style!.tapTargetSize, MaterialTapTargetSize.padded);
      expect(
        close.style!.backgroundColor!.resolve({}),
        const Color(0xff032c28),
      );
      await tester.tap(find.byTooltip('Close'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      expect(find.byType(CreditsDialog), findsOneWidget);
      expect(scale(), lessThan(1));
      await tester.pumpAndSettle();
      expect(find.byType(CreditsDialog), findsNothing);
      final restoredHeader = tester.widget<MobileHeader>(
        find.byType(MobileHeader),
      );
      expect(restoredHeader.city.id, originalHeader.city.id);
      expect(find.byType(QiblaPage), findsOneWidget);

      hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(seconds: 5));
      await tester.pump();
      await hold.up();
      await tester.pump(const Duration(milliseconds: 120));
      await tester.binding.handlePopRoute();
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 40));
      expect(find.byType(CreditsDialog), findsOneWidget);
      await tester.pumpAndSettle();
      expect(find.byType(CreditsDialog), findsNothing);
      expect(find.byType(QiblaPage), findsOneWidget);

      hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(seconds: 5));
      await hold.up();
      await tester.pumpAndSettle();
      await tester.tapAt(const Offset(10, 10));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      expect(find.byType(CreditsDialog), findsOneWidget);
      expect(scale(), lessThan(1));
      await tester.pumpAndSettle();
      expect(find.byType(CreditsDialog), findsNothing);

      await tester.tap(logo);
      await tester.pumpAndSettle();
      expect(find.byType(CreditsDialog), findsNothing);
      expect(find.byType(QiblaPage), findsNothing);
      hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpWidget(const SizedBox.shrink());
      await hold.up();
      await tester.pump(const Duration(seconds: 4));
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'credits fit small, landscape and large-text screens; Back works',
    (tester) async {
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.view.resetPhysicalSize);
      final navigator = GlobalKey<NavigatorState>();
      for (final (size, textScale, reduceMotion) in [
        (const Size(320, 568), 1.0, false),
        (const Size(640, 320), 1.0, false),
        (const Size(360, 640), 2.0, true),
      ]) {
        tester.view.physicalSize = size;
        await tester.pumpWidget(
          MaterialApp(
            navigatorKey: navigator,
            builder: (context, child) => MediaQuery(
              data: MediaQuery.of(context).copyWith(
                textScaler: TextScaler.linear(textScale),
                disableAnimations: reduceMotion,
              ),
              child: child!,
            ),
            home: const Scaffold(body: Text('Home')),
          ),
        );
        await tester.pumpAndSettle();
        showDialog<void>(
          context: navigator.currentContext!,
          useSafeArea: false,
          builder: (_) => const CreditsDialog(bosnian: true),
        );
        await tester.pump();
        if (reduceMotion) {
          expect(
            tester
                .widgetList<FadeTransition>(
                  find.descendant(
                    of: find.byType(CreditsDialog),
                    matching: find.byType(FadeTransition),
                  ),
                )
                .every((fade) => fade.opacity.value == 1),
            isTrue,
          );
        }
        await tester.pumpAndSettle();
        expect(find.text('Glavni developer'), findsOneWidget);
        expect(find.text('Istraživanje sadržaja'), findsOneWidget);
        expect(find.bySemanticsLabel('Nightfall Studio'), findsOneWidget);
        await tester.ensureVisible(find.text('Samija Bešić'));
        await tester.pumpAndSettle();
        expect(find.text('Samija Bešić').hitTestable(), findsOneWidget);
        expect(find.byTooltip('Zatvori').hitTestable(), findsOneWidget);
        expect(tester.takeException(), isNull);
        await tester.binding.handlePopRoute();
        await tester.pumpAndSettle();
        expect(find.byType(CreditsDialog), findsNothing);
        expect(find.text('Home'), findsOneWidget);
      }
    },
  );

  testWidgets('day credits use the light mosque and close colors', (
    tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(360, 640);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(
      MaterialApp(
        theme: ThemeData(brightness: Brightness.light),
        home: const CreditsDialog(bosnian: false),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      find.image(
        const AssetImage(
          'assets/prayer_times/mosque-horizon-mobile-light.webp',
        ),
      ),
      findsOneWidget,
    );
    final close = tester.widget<IconButton>(
      find.byKey(const ValueKey('credits-close')),
    );
    expect(close.style!.backgroundColor!.resolve({}), const Color(0xfffaf7ed));
    expect(close.style!.side!.resolve({})!.color, const Color(0xffd4d8c4));
    expect(
      tester
          .getTopLeft(find.image(const AssetImage('assets/branding/logo.png')))
          .dy,
      greaterThan(
        tester.getBottomLeft(find.byKey(const ValueKey('app-version'))).dy,
      ),
    );
  });
}
