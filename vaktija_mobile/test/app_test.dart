import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vaktija/app/vaktija_app.dart';

void main() {
  testWidgets('switches between four tabs and goes back to prayer times', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(320, 640);
    tester.view.devicePixelRatio = 1;
    tester.platformDispatcher.textScaleFactorTestValue = 2;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);

    await tester.pumpWidget(const VaktijaApp());
    await tester.pumpAndSettle();

    expect(find.text('Vaktija'), findsOneWidget);
    final nav = find.byType(NavigationBar);
    final pages = find.byType(IndexedStack);
    const labels = ['Prayer Times', 'Duas', 'Dhikr', 'Qibla'];
    expect(tester.widget<NavigationBar>(nav).selectedIndex, 0);

    for (final (index, label) in labels.indexed) {
      await tester.tap(find.widgetWithText(NavigationDestination, label));
      await tester.pumpAndSettle();
      expect(tester.widget<NavigationBar>(nav).selectedIndex, index);
      expect(tester.widget<IndexedStack>(pages).index, index);
    }

    await tester.binding.handlePopRoute();
    await tester.pumpAndSettle();
    expect(tester.widget<NavigationBar>(nav).selectedIndex, 0);
    expect(tester.widget<IndexedStack>(pages).index, 0);
  });
}
