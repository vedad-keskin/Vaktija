import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../features/prayer_times/prayer_repository.dart';
import '../features/prayer_times/timetable.dart';
import 'app_shell.dart';
import 'vaktija_palette.dart';

class VaktijaApp extends StatefulWidget {
  const VaktijaApp({super.key});

  @override
  State<VaktijaApp> createState() => _VaktijaAppState();
}

class _VaktijaAppState extends State<VaktijaApp> {
  late Future<PrayerRepository> _repository = _open();
  ThemeMode? _mode;

  Future<PrayerRepository> _open() async => PrayerRepository(
    await PrayerCatalog.load(),
    await SharedPreferences.getInstance(),
  );

  @override
  Widget build(BuildContext context) => FutureBuilder(
    future: _repository,
    builder: (context, snapshot) {
      final repository = snapshot.data;
      final savedMode = repository?.preferences.getString('theme');

      return MaterialApp(
        title: 'Vaktija',
        theme: _theme(const VaktijaPalette(false)),
        darkTheme: _theme(const VaktijaPalette(true)),
        themeMode:
            _mode ??
            switch (savedMode) {
              'dark' => ThemeMode.dark,
              'light' => ThemeMode.light,
              _ => ThemeMode.system,
            },
        debugShowCheckedModeBanner: false,
        home: repository != null
            ? AppShell(
                repository: repository,
                onThemeChanged: (dark) {
                  setState(
                    () => _mode = dark ? ThemeMode.dark : ThemeMode.light,
                  );
                },
              )
            : Scaffold(
                body: Center(
                  child: snapshot.hasError
                      ? TextButton(
                          onPressed: () =>
                              setState(() => _repository = _open()),
                          child: const Text('Try again'),
                        )
                      : const CircularProgressIndicator(),
                ),
              ),
      );
    },
  );

  ThemeData _theme(VaktijaPalette colors) => ThemeData(
    fontFamily: 'Vaktija Sans',
    textTheme: const TextTheme(
      bodyMedium: TextStyle(letterSpacing: 0),
      bodyLarge: TextStyle(letterSpacing: 0),
    ),
    colorScheme: ColorScheme.fromSeed(
      seedColor: colors.accent,
      brightness: colors.dark ? Brightness.dark : Brightness.light,
      surface: colors.surface,
      surfaceContainer: colors.panel,
      onSurface: colors.text,
      primary: colors.accent,
    ),
  );
}
