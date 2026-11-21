import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../features/prayer_times/prayer_page.dart';
import '../features/prayer_times/prayer_repository.dart';
import '../features/prayer_times/timetable.dart';
import 'mobile_header.dart';
import 'method_choice.dart';
import 'vaktija_palette.dart';

enum _Overlay { none, menu, cities }

class AppShell extends StatefulWidget {
  const AppShell({
    super.key,
    required this.repository,
    required this.onThemeChanged,
    this.startupComplete = true,
    this.headerLogo,
    this.onStartupReady,
  });

  final PrayerRepository repository;
  final ValueChanged<bool> onThemeChanged;
  final bool startupComplete;
  final GlobalKey? headerLogo;
  final VoidCallback? onStartupReady;

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  late PrayerCity _city;
  PrayerMethod? _method;
  late bool _bosnian;
  late bool _collapsed;
  final _cityPopup = OverlayPortalController();
  var _overlay = _Overlay.none;
  var _section = MobileSection.prayerTimes;

  PrayerCatalog get _catalog => widget.repository.catalog;

  @override
  void initState() {
    super.initState();
    final preferences = widget.repository.preferences;
    _city = _catalog.city(preferences.getInt('city'));
    _method = switch (preferences.getString('method')) {
      'angle' => PrayerMethod.angle,
      'iz' => PrayerMethod.iz,
      _ => null,
    };
    _collapsed = preferences.getBool('countdownCollapsed') ?? false;
    final locale = WidgetsBinding.instance.platformDispatcher.locale;
    final savedLanguage = preferences.getString('language');
    _bosnian = savedLanguage != null
        ? savedLanguage == 'bs'
        : const {
                'bs',
                'hr',
                'sr',
                'cnr',
                'sl',
                'mk',
                'sq',
                'bg',
                'el',
                'ro',
                'tr',
              }.contains(locale.languageCode) ||
              const {
                'BA',
                'HR',
                'RS',
                'ME',
                'SI',
                'MK',
                'AL',
                'XK',
                'BG',
                'GR',
                'RO',
                'TR',
              }.contains(locale.countryCode);
    _offerMethodChoice();
  }

  @override
  void didUpdateWidget(AppShell oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!oldWidget.startupComplete) _offerMethodChoice();
  }

  void _offerMethodChoice() {
    if (widget.startupComplete && _method == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _chooseMethod());
    }
  }

  Future<void> _chooseMethod() async {
    if (!mounted) return;
    final method = await showDialog<PrayerMethod>(
      context: context,
      barrierDismissible: false,
      builder: (context) => MethodChoice(labels: _catalog.labels(_bosnian)),
    );
    if (mounted && method != null) _selectMethod(method);
  }

  void _selectMethod(PrayerMethod method) {
    setState(() {
      _method = method;
      _setOverlay(_Overlay.none);
    });
    unawaited(
      _persist(widget.repository.preferences.setString('method', method.name)),
    );
  }

  Future<void> _persist(Future<bool> operation) async {
    try {
      await operation;
    } catch (error) {
      debugPrint('Could not save Vaktija preferences: $error');
    }
  }

  void _toggleOverlay(_Overlay overlay) => setState(() {
    _setOverlay(_overlay == overlay ? _Overlay.none : overlay);
  });

  void _selectSection(MobileSection section) => setState(() {
    _setOverlay(_Overlay.none);
    _section = section;
  });

  void _closeOverlay() => setState(() => _setOverlay(_Overlay.none));

  void _setOverlay(_Overlay overlay) {
    _overlay = overlay;
    if (overlay == _Overlay.cities) {
      _cityPopup.show();
    } else if (_cityPopup.isShowing) {
      _cityPopup.hide();
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final labels = _catalog.labels(_bosnian);
    final preferences = widget.repository.preferences;
    final keyboardInset = MediaQuery.viewInsetsOf(context).bottom;
    final safeInsets = MediaQuery.viewPaddingOf(context);

    return PopScope<Object?>(
      canPop:
          _section == MobileSection.prayerTimes && _overlay == _Overlay.none,
      onPopInvokedWithResult: (didPop, _) {
        if (didPop) return;
        if (_overlay != _Overlay.none) {
          _closeOverlay();
        } else if (_section != MobileSection.prayerTimes) {
          _selectSection(MobileSection.prayerTimes);
        }
      },
      child: AnnotatedRegion<SystemUiOverlayStyle>(
        value:
            (colors.dark
                    ? SystemUiOverlayStyle.light
                    : SystemUiOverlayStyle.dark)
                .copyWith(
                  statusBarColor: Colors.transparent,
                  systemNavigationBarColor: const Color(0xff041e1b),
                  systemNavigationBarIconBrightness: Brightness.light,
                  systemNavigationBarContrastEnforced: false,
                ),
        child: Scaffold(
          // The city popup accounts for the keyboard without resizing the header.
          resizeToAvoidBottomInset: false,
          backgroundColor: const Color(0xff041e1b),
          body: SafeArea(
            top: false,
            child: ColoredBox(
              color: colors.surface,
              child: SafeArea(
                bottom: false,
                child: Column(
                  children: [
                    MobileHeader(
                      labels: labels,
                      city: _city,
                      logoKey: widget.headerLogo,
                      showLogo: widget.startupComplete,
                      menuOpen: _overlay == _Overlay.menu,
                      citiesOpen: _overlay == _Overlay.cities,
                      cityPopup: _cityPopup,
                      cityInsets: safeInsets.copyWith(
                        bottom: keyboardInset > safeInsets.bottom
                            ? keyboardInset
                            : safeInsets.bottom,
                      ),
                      cityChoices: (height) => CityChoices(
                        labels: labels,
                        city: _city,
                        cities: _catalog.cities,
                        maxHeight: height,
                        onCity: (city) {
                          setState(() {
                            _city = city;
                            _setOverlay(_Overlay.none);
                          });
                          unawaited(
                            _persist(preferences.setInt('city', city.id)),
                          );
                        },
                      ),
                      onHome: () => _selectSection(MobileSection.prayerTimes),
                      onMenu: () => _toggleOverlay(_Overlay.menu),
                      onCities: () => _toggleOverlay(_Overlay.cities),
                      onTheme: (dark) {
                        widget.onThemeChanged(dark);
                        unawaited(
                          _persist(
                            preferences.setString(
                              'theme',
                              dark ? 'dark' : 'light',
                            ),
                          ),
                        );
                      },
                      onLanguage: (bosnian) {
                        setState(() => _bosnian = bosnian);
                        unawaited(
                          _persist(
                            preferences.setString(
                              'language',
                              bosnian ? 'bs' : 'en',
                            ),
                          ),
                        );
                      },
                    ),
                    Expanded(
                      child: Stack(
                        children: [
                          IndexedStack(
                            index: _section.index,
                            sizing: StackFit.expand,
                            children: [
                              PrayerPage(
                                repository: widget.repository,
                                city: _city,
                                method: _method,
                                labels: labels,
                                collapsed: _collapsed,
                                onStartupReady: widget.onStartupReady,
                                onToggleCountdown: () {
                                  setState(() => _collapsed = !_collapsed);
                                  unawaited(
                                    _persist(
                                      preferences.setBool(
                                        'countdownCollapsed',
                                        _collapsed,
                                      ),
                                    ),
                                  );
                                },
                              ),
                              for (final section in MobileSection.values.skip(
                                1,
                              ))
                                Center(
                                  child: Text(
                                    labels[section.label],
                                    style: Theme.of(
                                      context,
                                    ).textTheme.headlineLarge,
                                  ),
                                ),
                            ],
                          ),
                          if (_overlay != _Overlay.none)
                            Positioned.fill(
                              child: GestureDetector(
                                onTap: _closeOverlay,
                                behavior: HitTestBehavior.opaque,
                                excludeFromSemantics: true,
                              ),
                            ),
                          Positioned(
                            left: 0,
                            top: 0,
                            right: 0,
                            child: VaktijaMenu(
                              open: _overlay == _Overlay.menu,
                              labels: labels,
                              section: _section,
                              method: _method,
                              onSection: _selectSection,
                              onMethod: _selectMethod,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
