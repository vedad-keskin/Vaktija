import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../features/prayer_times/prayer_repository.dart';
import '../features/prayer_times/timetable.dart';
import 'app_shell.dart';
import 'startup/splash_view.dart';
import 'vaktija_palette.dart';

class VaktijaApp extends StatefulWidget {
  const VaktijaApp({
    super.key,
    this.openRepository,
    this.launchReady,
    this.onOpeningFrameReady,
  });

  final Future<PrayerRepository> Function()? openRepository;
  final Future<void>? launchReady;
  final VoidCallback? onOpeningFrameReady;

  @override
  State<VaktijaApp> createState() => _VaktijaAppState();
}

class _VaktijaAppState extends State<VaktijaApp> {
  late Future<PrayerRepository> _repository;
  final _headerLogo = GlobalKey();
  bool _homeVisible = false;
  ThemeMode? _mode;

  @override
  void initState() {
    super.initState();
    _start();
  }

  void _start() {
    _repository = widget.openRepository?.call() ?? _open();
  }

  Future<PrayerRepository> _open() async {
    final (catalog, preferences) = await (
      PrayerCatalog.load(),
      SharedPreferences.getInstance(),
    ).wait;
    return PrayerRepository(catalog, preferences);
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
            ExcludeFocus(
              excluding: !_homeVisible,
              child: ExcludeSemantics(
                excluding: !_homeVisible,
                child: IgnorePointer(
                  ignoring: !_homeVisible,
                  child: repository != null
                      ? AppShell(
                          repository: repository,
                          startupComplete: _homeVisible,
                          headerLogo: _headerLogo,
                          onThemeChanged: (dark) {
                            setState(
                              () => _mode = dark
                                  ? ThemeMode.dark
                                  : ThemeMode.light,
                            );
                          },
                        )
                      : Scaffold(
                          body: Center(
                            child:
                                snapshot.connectionState ==
                                        ConnectionState.done &&
                                    snapshot.hasError
                                ? FilledButton(
                                    onPressed: () => setState(_start),
                                    child: const Text('Try again'),
                                  )
                                : const CircularProgressIndicator(),
                          ),
                        ),
                ),
              ),
            ),
            if (!_homeVisible)
              SplashView(
                headerLogo: _headerLogo,
                launchReady: widget.launchReady,
                onOpeningFrameReady: widget.onOpeningFrameReady,
                onFinished: () => setState(() => _homeVisible = true),
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
