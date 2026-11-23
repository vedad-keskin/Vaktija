import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:geomag/geomag.dart';
import 'package:intl/intl.dart';

import '../../app/vaktija_dialog.dart';
import '../../app/vaktija_ornaments.dart';
import '../../app/vaktija_palette.dart';
import '../prayer_times/timetable.dart';
import 'qibla_calibration.dart';
import 'qibla_copy.dart';
import 'qibla_dial.dart';
import 'qibla_direction.dart';
import 'qibla_heading.dart';

class QiblaPage extends StatefulWidget {
  const QiblaPage({
    super.key,
    required this.header,
    required this.city,
    required this.language,
    required this.onBack,
  });

  final Widget header;
  final PrayerCity city;
  final String language;
  final VoidCallback onBack;

  @override
  State<QiblaPage> createState() => _QiblaPageState();
}

enum _CompassStatus {
  idle('qiblaCompassIdle', 'qiblaStartHint', QiblaGuidanceCue.calibration),
  waiting('qiblaCompassWaiting', 'qiblaWaitingHint', QiblaGuidanceCue.waiting),
  turnLeft('qiblaTurnLeft', 'qiblaFaceKaabaHint', QiblaGuidanceCue.left),
  turnRight('qiblaTurnRight', 'qiblaFaceKaabaHint', QiblaGuidanceCue.right),
  aligned('qiblaAlignedLabel', 'qiblaAlignedHint', QiblaGuidanceCue.aligned),
  tilt('qiblaHoldFlat', 'qiblaHoldFlatHint', QiblaGuidanceCue.level),
  accuracy(
    'qiblaCalibrateTitle',
    'qiblaUncalibrated',
    QiblaGuidanceCue.calibration,
  ),
  noReading('qiblaNoReading', 'qiblaNoEventsHint', QiblaGuidanceCue.noSignal),
  unavailable('qiblaUnsupported', 'qiblaUseBearing', QiblaGuidanceCue.north),
  noDirection(
    'qiblaDirectionUnavailable',
    'qiblaDirectionUnavailableHint',
    QiblaGuidanceCue.noDirection,
  );

  const _CompassStatus(this.title, this.body, this.cue);
  final String title;
  final String body;
  final QiblaGuidanceCue cue;
}

class _QiblaPageState extends State<QiblaPage> {
  static const _device = MethodChannel('vaktija/qibla');
  final _events = const EventChannel(
    'vaktija/qibla/heading',
  ).receiveBroadcastStream();
  final _reading = ValueNotifier((
    status: _CompassStatus.idle,
    heading: null as double?,
  ));
  final _filter = QiblaHeading();
  final _faqStorage = PageStorageBucket();
  final _time = Stopwatch()..start();
  late final AppLifecycleListener _lifecycle;

  StreamSubscription<dynamic>? _headingSubscription;
  Timer? _signalTimer;
  GeoMag? _model;
  double? _declination;
  int? _rotation;
  int _headingSession = 0;
  bool _startRequested = false;
  bool _calibrating = false;
  bool _supported = true;
  bool _foreground = true;

  ({double latitude, double longitude})? _location;
  ({double? bearing, double distanceKm})? _direction;
  bool _locating = false;
  bool _retryLocationOnResume = false;
  String? _locationError;
  int _locationSession = 0;

  bool get _mobile =>
      !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS);
  double get _latitude => _location?.latitude ?? widget.city.latitude;
  double get _longitude => _location?.longitude ?? widget.city.longitude;
  String _label(String key) => qiblaCopy[widget.language]!.labels[key]!;

  @override
  void initState() {
    super.initState();
    _supported = _mobile;
    final state = WidgetsBinding.instance.lifecycleState;
    _foreground = state == null || state == AppLifecycleState.resumed;
    _lifecycle = AppLifecycleListener(onStateChange: _lifecycleChanged);
    _updateDirection();
  }

  @override
  void didUpdateWidget(QiblaPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.city.id != widget.city.id) {
      _cancelLocation();
      _location = null;
      _locationError = null;
      _updateDirection();
      _restartHeading();
    }
  }

  void _updateDirection() {
    _direction = qiblaDirection(_latitude, _longitude);
    final model = _model;
    _declination = model == null
        ? null
        : qiblaDeclination(model, _latitude, _longitude, DateTime.now());
  }

  void _lifecycleChanged(AppLifecycleState state) {
    _foreground = state == AppLifecycleState.resumed;
    _restartHeading();
    if (_foreground && _retryLocationOnResume) {
      _retryLocationOnResume = false;
      unawaited(_toggleLocation());
    }
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.detached) {
      if (_locating) unawaited(_cancelBackgroundLocation());
    }
  }

  Future<void> _showCalibration() async {
    if (_calibrating) return;
    _calibrating = true;
    _restartHeading();
    final proceed = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      barrierColor: const Color(0xb8001511),
      builder: _calibrationDialog,
    );
    if (!mounted) return;
    _calibrating = false;
    if (proceed != true) {
      _restartHeading();
      return;
    }
    setState(() => _startRequested = true);
    _restartHeading();
    if (_model != null) return;
    try {
      final model = await loadQiblaMagneticModel(
        DefaultAssetBundle.of(context),
      );
      if (!mounted) return;
      _model = model;
      _updateDirection();
      _restartHeading();
    } catch (error) {
      if (mounted) _display(_CompassStatus.unavailable, reset: true);
      debugPrint('Could not read the Qibla magnetic model: $error');
    }
  }

  void _restartHeading() {
    _stopHeading();
    if (_direction?.bearing == null) {
      _display(_CompassStatus.noDirection);
    } else if (!_supported) {
      _display(_CompassStatus.unavailable);
    } else if (!_startRequested) {
      _display(_CompassStatus.idle);
    } else if (!_foreground || _calibrating || _model == null) {
      _display(_CompassStatus.waiting);
    } else if (_declination == null) {
      _display(_CompassStatus.unavailable);
    } else {
      _display(_CompassStatus.waiting);
      final session = _headingSession;
      _headingSubscription = _events.listen(
        (event) {
          if (session == _headingSession) _acceptHeading(event);
        },
        onError: (Object error) {
          if (session != _headingSession) return;
          _stopHeading();
          if (error is PlatformException && error.code == 'unsupported') {
            setState(() => _supported = false);
            _display(_CompassStatus.unavailable);
          } else {
            _display(_CompassStatus.noReading);
          }
        },
      );
      _signalTimer = Timer(
        const Duration(seconds: 2),
        () => _display(_CompassStatus.noReading, reset: true),
      );
    }
  }

  void _acceptHeading(Object? event) {
    if (event is! Map) return;
    final heading = event['heading'];
    if (heading is! num || !heading.isFinite) return;
    final rotation = event['rotation'] as int?;
    if (_rotation != rotation) {
      _rotation = rotation;
      _filter.clear();
    }
    _signalTimer?.cancel();
    _signalTimer = Timer(
      qiblaHeadingStale,
      () => _display(_CompassStatus.noReading, reset: true),
    );
    switch (event['quality']) {
      case 'tilt':
        _display(_CompassStatus.tilt, reset: true);
      case 'accuracy':
        _display(_CompassStatus.accuracy, reset: true);
      case 'good':
        final trueHeading = normalizeDegrees(
          heading.toDouble() + _declination!,
        );
        final bearing = _direction!.bearing!;
        if (_filter.add(trueHeading, bearing, _time.elapsedMilliseconds)) {
          unawaited(HapticFeedback.lightImpact());
        }
        final offset = angleDifference(bearing, _filter.displayed!);
        final previous = _reading.value.status;
        final wasTurning =
            previous == _CompassStatus.turnLeft ||
            previous == _CompassStatus.turnRight;
        _display(switch (offset) {
          _ when _filter.aligned => _CompassStatus.aligned,
          >= -qiblaAlignmentEntryDegrees && <= qiblaAlignmentEntryDegrees =>
            wasTurning ? previous : _CompassStatus.waiting,
          <= -175 || >= 175 when wasTurning => previous,
          < 0 => _CompassStatus.turnLeft,
          _ => _CompassStatus.turnRight,
        });
    }
  }

  void _display(_CompassStatus status, {bool reset = false}) {
    if (reset) _filter.clear();
    _reading.value = (status: status, heading: _filter.displayed);
  }

  void _stopHeading() {
    _headingSession++;
    unawaited(_headingSubscription?.cancel());
    _headingSubscription = null;
    _signalTimer?.cancel();
    _signalTimer = null;
    _rotation = null;
    _filter.clear();
  }

  Future<void> _toggleLocation() async {
    if (_locating || _location != null) {
      setState(() {
        _cancelLocation();
        _location = null;
        _locationError = null;
        _updateDirection();
      });
      _restartHeading();
      return;
    }
    final session = ++_locationSession;
    setState(() {
      _locating = true;
      _locationError = null;
    });
    try {
      final fix = await _device.invokeListMethod<double>('location');
      if (!mounted || session != _locationSession) return;
      if (fix == null || fix.length != 2 || !validQiblaPoint(fix[0], fix[1])) {
        throw PlatformException(code: 'unavailable');
      }
      setState(() {
        _locating = false;
        _location = (latitude: fix[0], longitude: fix[1]);
        _updateDirection();
      });
      _restartHeading();
    } on PlatformException catch (error) {
      _reportLocationError(session, error.code);
    } on MissingPluginException {
      _reportLocationError(session, 'unavailable');
    }
  }

  void _reportLocationError(int session, String code) {
    if (!mounted || session != _locationSession) return;
    setState(() {
      _locating = false;
      _locationError = switch (code) {
        'denied' => 'qiblaGpsDenied',
        'services_disabled' =>
          defaultTargetPlatform == TargetPlatform.iOS
              ? 'qiblaGpsDisabledIos'
              : 'qiblaGpsDisabled',
        'cancelled' => null,
        _ => 'qiblaGpsError',
      };
    });
  }

  Future<void> _openLocationSettings() async {
    final session = _locationSession;
    _retryLocationOnResume = true;
    try {
      await _device.invokeMethod<void>('openLocationSettings', {
        'app': _locationError == 'qiblaGpsDenied',
      });
    } on PlatformException catch (error) {
      if (!mounted || session != _locationSession) return;
      _retryLocationOnResume = false;
      _reportLocationError(session, error.code);
    } on MissingPluginException {
      if (!mounted || session != _locationSession) return;
      _retryLocationOnResume = false;
      _reportLocationError(session, 'unavailable');
    }
  }

  void _cancelLocation() {
    _retryLocationOnResume = false;
    _locationSession++;
    if (!_locating) return;
    _locating = false;
    unawaited(_stopLocationRequest());
  }

  Future<void> _cancelBackgroundLocation() async {
    final session = _locationSession;
    if (!await _stopLocationRequest(background: true)) return;
    if (!mounted || session != _locationSession) return;
    setState(() {
      _locating = false;
      _locationSession++;
    });
  }

  Future<bool> _stopLocationRequest({bool background = false}) async {
    try {
      return await _device.invokeMethod<bool>('cancelLocation', {
            'background': background,
          }) ??
          true;
    } on MissingPluginException {
      // No native request exists on this platform.
    } on PlatformException catch (error) {
      debugPrint('Could not cancel Qibla location: $error');
    }
    return true;
  }

  @override
  void dispose() {
    _lifecycle.dispose();
    _stopHeading();
    _cancelLocation();
    _reading.dispose();
    super.dispose();
  }

  String get _locale => widget.language == 'bs' ? 'bs' : 'en';

  String get _bearing {
    final bearing = _direction?.bearing;
    return bearing == null
        ? '—'
        : '${NumberFormat('0.0', _locale).format(bearing)}°';
  }

  String get _distance {
    final distance = _direction?.distanceKm;
    if (distance == null) return '—';
    final format = NumberFormat.decimalPattern(_locale)
      ..maximumFractionDigits = distance >= 100
          ? 0
          : distance >= 10
          ? 1
          : 2;
    return '${format.format(distance)} km';
  }

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    return LayoutBuilder(
      builder: (context, constraints) => CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: widget.header),
          SliverPadding(
            padding: EdgeInsets.fromLTRB(
              math.max(12, (constraints.maxWidth - 536) / 2),
              22,
              math.max(12, (constraints.maxWidth - 536) / 2),
              32,
            ),
            sliver: SliverList.list(
              children: [
                _heading(colors),
                const SizedBox(height: 20),
                _scene(colors),
                const SizedBox(height: 24),
                Divider(color: colors.border, height: 1),
                const SizedBox(height: 22),
                Text(
                  _label('qiblaFaqTitle').toUpperCase(),
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: colors.text,
                    fontSize: 15,
                    letterSpacing: 1.5,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 12),
                for (final (index, item)
                    in qiblaCopy[widget.language]!.faq.indexed)
                  PageStorage(
                    bucket: _faqStorage,
                    child: _faqItem(colors, index, item.question, item.answer),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  TextStyle _displayText(Color color, double size) => TextStyle(
    fontFamily: 'Cormorant Garamond',
    fontSize: size,
    height: 1.1,
    color: color,
    fontWeight: FontWeight.w600,
  );

  TextStyle _eyebrow(Color color) => TextStyle(
    color: color,
    fontSize: 11,
    letterSpacing: 1.7,
    fontWeight: FontWeight.w700,
  );

  Widget _heading(VaktijaPalette colors) => Stack(
    children: [
      Positioned(
        top: 0,
        left: 0,
        child: IconButton(
          tooltip: _label('qiblaBackToTimes'),
          onPressed: widget.onBack,
          color: colors.secondary,
          icon: const Icon(Icons.arrow_back, size: 20),
        ),
      ),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 48),
        child: Column(
          children: [
            Center(
              child: Semantics(
                header: true,
                child: Text(
                  _label('qiblaSectionTitle'),
                  textAlign: TextAlign.center,
                  style: _displayText(colors.heroText, 36),
                ),
              ),
            ),
            const SizedBox(height: 12),
            const VaktijaDivider(width: 120),
            const SizedBox(height: 12),
            Text(
              _label('qiblaTileSubtitle'),
              textAlign: TextAlign.center,
              style: TextStyle(color: colors.secondary, fontSize: 14),
            ),
          ],
        ),
      ),
    ],
  );

  Widget _scene(VaktijaPalette colors) {
    final art = colors.dark ? 'dark' : 'light';
    final corners = BorderRadius.circular(20);
    return DecoratedBox(
      position: DecorationPosition.foreground,
      decoration: BoxDecoration(
        border: Border.all(color: colors.heroBorder),
        borderRadius: corners,
      ),
      child: ClipRRect(
        borderRadius: corners,
        child: ColoredBox(
          color: colors.sky,
          child: Stack(
            children: [
              Positioned.fill(
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: ShaderMask(
                    blendMode: BlendMode.dstIn,
                    shaderCallback: (rect) => const LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.white],
                      stops: [0, .34],
                    ).createShader(rect),
                    child: Image.asset(
                      'assets/prayer_times/mosque-horizon-mobile-$art.webp',
                      width: double.infinity,
                      fit: BoxFit.fitWidth,
                      excludeFromSemantics: true,
                    ),
                  ),
                ),
              ),
              Positioned.fill(
                child: CustomPaint(painter: _SceneArch(colors.heroGold)),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 24, 16, 28),
                child: Column(
                  children: [
                    _locationPanel(colors),
                    const SizedBox(height: 24),
                    if (_supported) ...[
                      _action(
                        colors,
                        Icons.explore_outlined,
                        _label(
                          _startRequested
                              ? 'qiblaRecalibrate'
                              : 'qiblaEnableCompass',
                        ).toUpperCase(),
                        _showCalibration,
                        pill: true,
                      ),
                      const SizedBox(height: 12),
                    ],
                    _compass(colors),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _locationPanel(VaktijaPalette colors) {
    final location = _location;
    final cityName = location == null
        ? widget.city.name
        : _label('qiblaLocationGps');
    final gps = _mobile
        ? _action(
            colors,
            Icons.my_location,
            _label(
              location == null && !_locating
                  ? 'qiblaLocationGps'
                  : 'qiblaUseCity',
            ),
            _toggleLocation,
          )
        : null;
    final title = Text(cityName, style: _displayText(colors.heroText, 28));
    final border = colors.heroMuted.withValues(alpha: .25);
    final settingsLabel = switch (_locationError) {
      'qiblaGpsDenied' => 'qiblaOpenAppSettings',
      'qiblaGpsDisabled' => 'qiblaOpenLocationSettings',
      _ => null,
    };
    final useRow =
        location == null &&
        !_locating &&
        MediaQuery.textScalerOf(context).scale(14) <= 18;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(17),
      decoration: BoxDecoration(
        color: colors.sky.withValues(alpha: .84),
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: colors.heroGold.withValues(alpha: .48)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _label('qiblaLocationLabel').toUpperCase(),
            style: _eyebrow(colors.heroMuted),
          ),
          const SizedBox(height: 6),
          if (useRow && gps != null)
            LayoutBuilder(
              builder: (context, constraints) => Row(
                children: [
                  Expanded(child: title),
                  const SizedBox(width: 8),
                  ConstrainedBox(
                    constraints: BoxConstraints(
                      maxWidth: constraints.maxWidth * .57,
                    ),
                    child: gps,
                  ),
                ],
              ),
            )
          else ...[
            title,
            if (location != null)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  '${location.latitude.toStringAsFixed(4)}°, ${location.longitude.toStringAsFixed(4)}°',
                  style: TextStyle(color: colors.heroMuted),
                ),
              ),
            if (gps != null) ...[
              const SizedBox(height: 8),
              SizedBox(width: double.infinity, child: gps),
            ],
          ],
          if (_locating || _locationError != null) ...[
            const SizedBox(height: 8),
            Semantics(
              liveRegion: true,
              child: Text(
                _label(_locating ? 'qiblaGpsPending' : _locationError!),
                style: TextStyle(
                  color: _locating ? colors.heroMuted : colors.heroGold,
                ),
              ),
            ),
          ],
          if (!_locating && settingsLabel != null)
            TextButton.icon(
              onPressed: _openLocationSettings,
              style: TextButton.styleFrom(foregroundColor: colors.heroGold),
              icon: const Icon(Icons.settings_outlined, size: 20),
              label: Text(_label(settingsLabel)),
            ),
          const SizedBox(height: 12),
          Divider(height: 1, color: border),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(child: _stat(colors, 'qiblaBearingLabel', _bearing)),
              Expanded(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    border: Border(left: BorderSide(color: border)),
                  ),
                  child: _stat(colors, 'qiblaDistanceLabel', _distance),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _stat(VaktijaPalette colors, String label, String value) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 5),
    child: Column(
      children: [
        Text(
          _label(label).toUpperCase(),
          textAlign: TextAlign.center,
          style: _eyebrow(colors.heroMuted),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: colors.heroText,
            fontSize: 25,
            height: 1.2,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    ),
  );

  Widget _action(
    VaktijaPalette colors,
    IconData icon,
    String text,
    VoidCallback onTap, {
    bool pill = false,
  }) => OutlinedButton(
    onPressed: onTap,
    style: OutlinedButton.styleFrom(
      foregroundColor: pill ? colors.heroGold : colors.heroText,
      backgroundColor: pill ? colors.sky : null,
      minimumSize: const Size(0, 46),
      padding: EdgeInsets.symmetric(horizontal: pill ? 18 : 10, vertical: 8),
      side: BorderSide(color: colors.heroGold.withValues(alpha: pill ? 1 : .5)),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(pill ? 99 : 10),
      ),
      textStyle: TextStyle(
        fontSize: pill ? 13 : 14,
        letterSpacing: pill ? 1 : 0,
        fontWeight: FontWeight.w700,
      ),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, size: 20),
        const SizedBox(width: 6),
        Flexible(child: Text(text, textAlign: TextAlign.center)),
      ],
    ),
  );

  Widget _compass(VaktijaPalette colors) {
    final label = '${_label('qiblaTileSubtitle')} · $_bearing';
    return ValueListenableBuilder(
      valueListenable: _reading,
      // Measure localized text once per layout, independent of heading updates.
      child: ExcludeSemantics(
        child: Opacity(
          opacity: 0,
          child: Stack(
            children: [
              for (final status in _CompassStatus.values)
                _guidanceText(colors, status),
            ],
          ),
        ),
      ),
      builder: (context, reading, textSizer) {
        final status = _direction?.bearing == null
            ? _CompassStatus.noDirection
            : !_supported
            ? _CompassStatus.unavailable
            : reading.status;
        final aligned = status == _CompassStatus.aligned;
        return Column(
          children: [
            QiblaDial(
              bearing: _direction?.bearing,
              heading: reading.heading,
              aligned: aligned,
              label: label,
            ),
            const SizedBox(height: 14),
            _guidance(colors, status, textSizer!),
          ],
        );
      },
    );
  }

  Widget _guidance(
    VaktijaPalette colors,
    _CompassStatus status,
    Widget textSizer,
  ) {
    final duration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : const Duration(milliseconds: 180);
    return Container(
      key: const ValueKey('qibla-guidance'),
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: colors.heroGold.withValues(alpha: .35)),
        borderRadius: BorderRadius.circular(12),
        color: colors.sky,
      ),
      child: Row(
        children: [
          QiblaGuidanceIcon(cue: status.cue, duration: duration),
          const SizedBox(width: 12),
          Expanded(
            child: Stack(
              children: [
                textSizer,
                Positioned.fill(
                  child: Semantics(
                    liveRegion: true,
                    label: '${_label(status.title)}\n${_label(status.body)}',
                    excludeSemantics: true,
                    child: AnimatedSwitcher(
                      duration: duration,
                      child: Align(
                        key: ValueKey(status),
                        alignment: AlignmentDirectional.topStart,
                        child: _guidanceText(colors, status),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _guidanceText(VaktijaPalette colors, _CompassStatus status) => Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        _label(status.title),
        style: TextStyle(
          color: status == _CompassStatus.aligned
              ? colors.accent
              : colors.heroText,
          fontSize: 16,
          fontWeight: FontWeight.w700,
          height: 1.25,
        ),
      ),
      const SizedBox(height: 4),
      Text(
        _label(status.body),
        style: TextStyle(color: colors.heroMuted, fontSize: 14, height: 1.35),
      ),
    ],
  );

  Widget _calibrationDialog(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    return VaktijaDialog(
      title: _label('qiblaCalibrateTitle'),
      content: Column(
        children: [
          const QiblaCalibrationGuide(),
          const SizedBox(height: 14),
          Text(
            _label('qiblaCalibrateBody'),
            textAlign: TextAlign.center,
            style: TextStyle(
              color: colors.heroMuted,
              fontSize: 15,
              height: 1.5,
            ),
          ),
        ],
      ),
      actions: [
        OutlinedButton(
          style: OutlinedButton.styleFrom(
            foregroundColor: colors.heroMuted,
            side: BorderSide(color: colors.heroGold.withValues(alpha: .46)),
            minimumSize: const Size(84, 48),
          ),
          onPressed: () => Navigator.of(context).pop(true),
          child: Text(_label('qiblaCalibrateSkip')),
        ),
        FilledButton.icon(
          style: FilledButton.styleFrom(
            backgroundColor: colors.heroGold,
            foregroundColor: colors.sky,
            minimumSize: const Size(106, 48),
            textStyle: const TextStyle(fontWeight: FontWeight.w700),
          ),
          onPressed: () => Navigator.of(context).pop(true),
          icon: const Icon(Icons.check_rounded, size: 19),
          label: Text(_label('qiblaCalibrateDone')),
        ),
      ],
    );
  }

  Widget _faqItem(
    VaktijaPalette colors,
    int index,
    String question,
    String answer,
  ) {
    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
      side: BorderSide(color: colors.border),
    );
    return Padding(
      padding: const EdgeInsets.only(top: 10),
      child: ExpansionTile(
        key: PageStorageKey<int>(index),
        backgroundColor: colors.panel,
        collapsedBackgroundColor: colors.panel,
        shape: shape,
        collapsedShape: shape,
        textColor: colors.text,
        collapsedTextColor: colors.text,
        iconColor: colors.secondary,
        collapsedIconColor: colors.secondary,
        tilePadding: const EdgeInsets.symmetric(horizontal: 17, vertical: 3),
        childrenPadding: const EdgeInsets.fromLTRB(17, 0, 17, 16),
        expandedCrossAxisAlignment: CrossAxisAlignment.start,
        title: Text(
          question,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
        children: [
          Text(
            answer,
            style: TextStyle(
              color: colors.secondary,
              fontSize: 16,
              height: 1.55,
            ),
          ),
        ],
      ),
    );
  }
}

class _SceneArch extends CustomPainter {
  const _SceneArch(this.gold);

  final Color gold;

  @override
  void paint(Canvas canvas, Size size) {
    canvas
      ..translate(6, 6)
      ..scale((size.width - 12) / 1200, (size.height - 12) / 650);
    final pen = Paint()
      ..color = gold.withValues(alpha: .09)
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;
    for (final inset in [0.0, 12.0]) {
      final arch = Path()
        ..moveTo(26 + inset, 624)
        ..lineTo(26 + inset, 218)
        ..quadraticBezierTo(26 + inset, 145 + inset, 98 + inset, 130 + inset)
        ..quadraticBezierTo(104 + inset, 66 + inset, 178, 66 + inset)
        ..quadraticBezierTo(234, 10 + inset, 306, 34 + inset)
        ..quadraticBezierTo(367, 2 + inset, 436, 25 + inset)
        ..quadraticBezierTo(526, 7 + inset, 600, 20 + inset)
        ..quadraticBezierTo(674, 7 + inset, 764, 25 + inset)
        ..quadraticBezierTo(833, 2 + inset, 894, 34 + inset)
        ..quadraticBezierTo(966, 10 + inset, 1022, 66 + inset)
        ..quadraticBezierTo(1096 - inset, 66 + inset, 1102 - inset, 130 + inset)
        ..quadraticBezierTo(1174 - inset, 145 + inset, 1174 - inset, 218)
        ..lineTo(1174 - inset, 624);
      canvas.drawPath(arch, pen);
    }
  }

  @override
  bool shouldRepaint(_SceneArch oldDelegate) => oldDelegate.gold != gold;
}
