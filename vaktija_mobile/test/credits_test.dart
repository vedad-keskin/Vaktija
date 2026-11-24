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
  Future<void> settle(WidgetTester tester) async {
    if (find.byType(CreditsDialog).evaluate().isNotEmpty) {
      await tester.pump();
      await tester.pump(const Duration(seconds: 4));
    } else {
      await tester.pumpAndSettle();
    }
  }

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
      await settle(tester);
      final logo = find.byType(CreditsTrigger);
      expect(tester.getSize(logo).shortestSide, greaterThanOrEqualTo(48));

      Future<void> goToQibla() async {
        await tester.tap(find.byTooltip('Menu'));
        await settle(tester);
        await tester.tap(
          find.text(
            repository.catalog.labels(false)['qiblaNavTitle'].toUpperCase(),
          ),
        );
        await settle(tester);
      }

      await goToQibla();
      final originalHeader = tester.widget<MobileHeader>(
        find.byType(MobileHeader),
      );
      var hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(milliseconds: 4999));
      expect(find.byType(CreditsDialog), findsNothing);
      await hold.up();
      await settle(tester);
      await tester.pump(const Duration(seconds: 1));
      expect(find.byType(CreditsDialog), findsNothing);

      await goToQibla();
      hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(seconds: 2));
      await hold.moveBy(const Offset(80, 0));
      await tester.pump(const Duration(seconds: 4));
      await hold.up();
      await settle(tester);
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
      await settle(tester);
      expect(find.byType(CreditsDialog), findsNothing);

      hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(milliseconds: 4999));
      expect(find.byType(CreditsDialog), findsNothing);
      await tester.pump(const Duration(milliseconds: 1));
      await tester.pump();
      expect(find.byType(CreditsDialog), findsOneWidget);
      await hold.up();
      final credits = find.byType(CreditsDialog);
      double routeProgress() =>
          ModalRoute.of(tester.element(credits))!.animation!.value;
      double reveal(String name) => tester
          .widget<FadeTransition>(
            find
                .ancestor(
                  of: find.text(name),
                  matching: find.byType(FadeTransition),
                )
                .first,
          )
          .opacity
          .value;
      final opening = routeProgress();
      expect(opening, lessThan(1));
      await tester.pump(const Duration(milliseconds: 100));
      expect(routeProgress(), greaterThan(opening));
      await tester.pump(const Duration(milliseconds: 1700));
      expect(reveal('Vedad Keskin'), greaterThan(0));
      expect(reveal('Samija Bešić'), 0);
      expect(
        tester
            .widget<FadeTransition>(
              find
                  .ancestor(
                    of: find.byIcon(Icons.code_rounded),
                    matching: find.byType(FadeTransition),
                  )
                  .first,
            )
            .opacity
            .value,
        0,
      );
      await settle(tester);
      expect(find.text('Vedad Keskin'), findsOneWidget);
      expect(find.text('Samija Bešić'), findsOneWidget);
      expect(find.text('Lead Developer'), findsOneWidget);
      expect(find.text('Content Research'), findsOneWidget);
      expect(find.text('v9.8.7'), findsOneWidget);
      expect(
        find.descendant(
          of: find.byType(CreditsDialog),
          matching: find.image(
            const AssetImage('assets/prayer_times/mosque-horizon-dark.webp'),
          ),
        ),
        findsOneWidget,
      );
      expect(
        find.descendant(of: credits, matching: find.text('Vaktija')),
        findsNothing,
      );
      expect(
        find.descendant(of: credits, matching: find.text('Credits')),
        findsNothing,
      );
      expect(reveal('Samija Bešić'), 1);
      expect(
        tester.widget<Text>(find.text('Lead Developer')).style!.fontFamily,
        'Vaktija Sans',
      );
      final nameStyle = tester.widget<Text>(find.text('Vedad Keskin')).style!;
      expect(nameStyle.fontFamily, 'Lilita One');
      expect(nameStyle.fontFamilyFallback, contains('Paytone One'));
      final branding = find.byKey(const ValueKey('credits-studio'));
      final version = find.byKey(const ValueKey('app-version'));
      final footer = tester.getRect(
        find.image(
          const AssetImage('assets/prayer_times/mosque-horizon-dark.webp'),
        ),
      );
      expect(footer.contains(tester.getTopLeft(branding)), isTrue);
      expect(footer.contains(tester.getBottomRight(branding)), isTrue);
      expect(footer.contains(tester.getTopLeft(version)), isTrue);
      expect(footer.contains(tester.getBottomRight(version)), isTrue);
      expect(
        tester.getTopLeft(branding).dy - footer.top,
        closeTo(footer.bottom - tester.getBottomRight(branding).dy, .01),
      );
      for (final (icon, role) in [
        (Icons.code_rounded, 'Lead Developer'),
        (Icons.import_contacts_outlined, 'Content Research'),
      ]) {
        final symbol = find.descendant(
          of: credits,
          matching: find.byIcon(icon),
        );
        expect(symbol, findsOneWidget);
        expect(
          tester.getCenter(symbol).dy,
          closeTo(tester.getCenter(find.text(role)).dy, .01),
        );
        expect(
          tester.getTopLeft(symbol).dx,
          greaterThan(tester.getTopRight(find.text(role)).dx),
        );
        expect(
          tester
              .widget<FadeTransition>(
                find
                    .ancestor(of: symbol, matching: find.byType(FadeTransition))
                    .first,
              )
              .opacity
              .value,
          1,
        );
      }
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
        tester.getCenter(branding).dy,
        closeTo(tester.getCenter(version).dy, .01),
      );
      expect(
        tester.getTopRight(branding).dx,
        lessThan(tester.getTopLeft(version).dx),
      );
      final mark = find.descendant(
        of: credits,
        matching: find.image(const AssetImage('assets/branding/logo.png')),
      );
      final lead = find.text('Vedad Keskin');
      final research = find.text('Samija Bešić');
      expect(
        tester.getBottomLeft(mark).dy,
        lessThan(tester.getTopLeft(lead).dy),
      );
      expect(
        tester.getTopLeft(lead).dx,
        lessThan(tester.getTopLeft(research).dx),
      );
      expect(
        tester.getTopLeft(branding).dy,
        greaterThan(tester.getBottomLeft(find.text('Content Research')).dy),
      );
      expect(
        tester
            .getSize(find.byKey(const ValueKey('credits-close')))
            .shortestSide,
        greaterThanOrEqualTo(48),
      );
      await tester.tap(find.byTooltip('Close'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      expect(find.byType(CreditsDialog), findsOneWidget);
      expect(routeProgress(), lessThan(1));
      await settle(tester);
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
      await settle(tester);
      expect(find.byType(CreditsDialog), findsNothing);
      expect(find.byType(QiblaPage), findsOneWidget);

      hold = await tester.startGesture(tester.getCenter(logo));
      await tester.pump(const Duration(seconds: 5));
      await hold.up();
      await settle(tester);
      await tester.tapAt(const Offset(10, 10));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      expect(find.byType(CreditsDialog), findsOneWidget);
      expect(routeProgress(), lessThan(1));
      await settle(tester);
      expect(find.byType(CreditsDialog), findsNothing);

      await tester.tap(logo);
      await settle(tester);
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
        await settle(tester);
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
        await settle(tester);
        expect(tester.binding.hasScheduledFrame, !reduceMotion);
        expect(find.text('Glavni developer'), findsOneWidget);
        expect(find.text('Istraživanje sadržaja'), findsOneWidget);
        expect(find.bySemanticsLabel('Nightfall Studio'), findsOneWidget);
        await tester.ensureVisible(find.text('Samija Bešić'));
        await settle(tester);
        expect(find.text('Samija Bešić').hitTestable(), findsOneWidget);
        expect(find.byTooltip('Zatvori').hitTestable(), findsOneWidget);
        expect(tester.takeException(), isNull);
        await tester.binding.handlePopRoute();
        await settle(tester);
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
    await settle(tester);
    expect(
      find.image(
        const AssetImage('assets/prayer_times/mosque-horizon-light.webp'),
      ),
      findsOneWidget,
    );
    final close = tester.widget<IconButton>(
      find.byKey(const ValueKey('credits-close')),
    );
    expect(close.style!.backgroundColor!.resolve({}), const Color(0xfffaf7ed));
    expect(close.style!.foregroundColor!.resolve({}), const Color(0xff123d33));
    expect(
      tester
          .getTopLeft(find.image(const AssetImage('assets/branding/logo.png')))
          .dy,
      lessThan(tester.getTopLeft(find.byKey(const ValueKey('app-version'))).dy),
    );
  });
}
