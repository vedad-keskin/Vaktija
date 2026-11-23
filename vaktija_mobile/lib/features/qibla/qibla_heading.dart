import 'dart:math' as math;

import 'qibla_direction.dart';

// Same filter, tolerances and stale timeout as the web compass.
const qiblaHeadingStale = Duration(milliseconds: 1500);
const qiblaAlignmentEntryDegrees = 4.0;

class QiblaHeading {
  final _samples = <double>[];
  double _previous = 0;
  double _filtered = 0;
  double _speed = 0;
  int? _timestamp;
  int? _alignedSince;
  bool _notified = false;
  bool aligned = false;
  double? displayed;

  void clear() {
    _samples.clear();
    _speed = 0;
    _timestamp = null;
    _alignedSince = null;
    displayed = null;
    aligned = false;
    // A signal dropout is not evidence that the user turned away.
  }

  /// Returns true exactly once when a new stable alignment should vibrate.
  bool add(double heading, double bearing, int timestamp) {
    final elapsed = timestamp - (_timestamp ?? timestamp);
    if (_timestamp != null && elapsed <= 0) return false;
    if (elapsed >= qiblaHeadingStale.inMilliseconds) clear();
    _samples.add(heading);
    if (_samples.length > 3) _samples.removeAt(0);
    double deviation(double candidate) => _samples.fold(
      0,
      (sum, sample) => sum + angleDifference(sample, candidate).abs(),
    );
    final median = _samples.reduce(
      (best, sample) => deviation(sample) < deviation(best) ? sample : best,
    );
    if (_timestamp == null) {
      _previous = _filtered = heading;
    } else {
      final accepted = _previous + angleDifference(median, _previous);
      final dt = elapsed / 1000;
      double alpha(double cutoff) => 1 / (1 + 1 / (2 * math.pi * cutoff * dt));
      _speed += alpha(.5) * ((accepted - _previous) / dt - _speed);
      _filtered += alpha(.1 + .04 * _speed.abs()) * (accepted - _filtered);
      _previous = accepted;
    }
    _timestamp = timestamp;
    if (displayed == null || (displayed! - _filtered).abs() >= .3) {
      displayed = _filtered;
    }

    final error = angleDifference(bearing, _filtered).abs();
    if (error >= 7) {
      aligned = false;
      _alignedSince = null;
      _notified = false;
    } else if (!aligned) {
      if (error <= qiblaAlignmentEntryDegrees) {
        _alignedSince ??= timestamp;
        aligned = timestamp - _alignedSince! >= 300;
      } else {
        _alignedSince = null;
      }
    }
    if (!aligned || _notified) return false;
    _notified = true;
    return true;
  }
}
