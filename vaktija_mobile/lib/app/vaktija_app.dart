import 'package:flutter/material.dart';

import 'app_shell.dart';

class VaktijaApp extends StatelessWidget {
  const VaktijaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Vaktija',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFA6D3BC),
          brightness: Brightness.dark,
          surface: const Color(0xFF041E1B),
          surfaceContainer: const Color(0xFF0C2D28),
          onSurface: const Color(0xFFF1F2E9),
        ),
      ),
      debugShowCheckedModeBanner: false,
      home: const AppShell(),
    );
  }
}
