import 'dart:async';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../features/prayer_times/prayer_repository.dart';
import '../features/prayer_times/timetable.dart';
import 'app_shell.dart';
import 'startup/splash_view.dart';
import 'vaktija_palette.dart';

class VaktijaApp extends StatefulWidget {
  const VaktijaApp({super.key, this.openRepository, this.firstFrame});

  final Future<PrayerRepository> Function()? openRepository;
  final Future<void>? firstFrame;

  @override
  State<VaktijaApp> createState() => _VaktijaAppState();
}

class _VaktijaAppState extends State<VaktijaApp> {
  late Future<PrayerRepository> _repository;
  final _headerLogo = GlobalKey();
  Timer? _startupBudget;
  bool _frameReady = false;
  bool _timetableReady = false;
  bool _leavingSplash = false;
  bool _homeVisible = false;
  ThemeMode? _mode;

  @override
  void initState() {
    super.initState();
    final firstFrame = widget.firstFrame;
    _frameReady = firstFrame == null;
    _start();
    if (firstFrame != null) {
      unawaited(
        firstFrame.then((_) {
          if (!mounted) return;
          _frameReady = true;
          _waitForTimetable();
        }),
      );
    }
  }

  void _start() {
    _startupBudget?.cancel();
    _leavingSplash = false;
    _timetableReady = false;
    _repository = widget.openRepository?.call() ?? _open();
    if (_frameReady) _waitForTimetable();
  }

  void _waitForTimetable() {
    if (_timetableReady) {
      _revealHome();
    } else {
      _startupBudget = Timer(const Duration(milliseconds: 800), _revealHome);
    }
  }

  Future<PrayerRepository> _open() async {
    final (catalog, preferences) = await (
      PrayerCatalog.load(),
      SharedPreferences.getInstance(),
    ).wait;
    return PrayerRepository(catalog, preferences);
  }

  void _revealHome() {
    if (_leavingSplash || !mounted) return;
    _timetableReady = true;
    if (!_frameReady) return;
    _startupBudget?.cancel();
    setState(() => _leavingSplash = true);
  }

  @override
  void dispose() {
    _startupBudget?.cancel();
    super.dispose();
  }

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
        themeAnimationDuration: _homeVisible
            ? kThemeAnimationDuration
            : Duration.zero,
        themeMode:
            _mode ??
            switch (savedMode) {
              'dark' => ThemeMode.dark,
              'light' => ThemeMode.light,
              _ => ThemeMode.system,
            },
        debugShowCheckedModeBanner: false,
        home: Stack(
          fit: StackFit.expand,
          children: [
            if (repository != null)
              ExcludeFocus(
                excluding: !_homeVisible,
                child: ExcludeSemantics(
                  excluding: !_homeVisible,
                  child: IgnorePointer(
                    ignoring: !_homeVisible,
                    child: AppShell(
                      repository: repository,
                      startupComplete: _homeVisible,
                      headerLogo: _headerLogo,
                      onStartupReady: _leavingSplash ? null : _revealHome,
                      onThemeChanged: (dark) {
                        setState(
                          () => _mode = dark ? ThemeMode.dark : ThemeMode.light,
                        );
                      },
                    ),
                  ),
                ),
              ),
            if (!_homeVisible)
              SplashView(
                headerLogo: _headerLogo,
                leaving: repository != null && _leavingSplash,
                onFinished: () => setState(() => _homeVisible = true),
                onRetry: snapshot.hasError ? () => setState(_start) : null,
              ),
          ],
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
