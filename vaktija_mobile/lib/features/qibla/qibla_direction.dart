import 'dart:ffi';

import 'package:ffi/ffi.dart';
import 'package:flutter/services.dart';
import 'package:geomag/geomag.dart';

// GeographicLib C v2.2. The web uses the JavaScript edition of the same solver.
@Native<Void Function(Double, Double, Double, Double, Pointer<Double>)>(
  symbol: 'vaktija_wgs84_inverse',
)
external void _inverse(
  double latitude,
  double longitude,
  double targetLatitude,
  double targetLongitude,
  Pointer<Double> result,
);

const _kaabaLatitude = 21.422487;
const _kaabaLongitude = 39.826206;

double normalizeDegrees(double degrees) => degrees % 360;

double angleDifference(double to, double from) =>
    normalizeDegrees(to - from + 180) - 180;

bool validQiblaPoint(double latitude, double longitude) =>
    latitude.isFinite &&
    longitude.isFinite &&
    latitude.abs() <= 90 &&
    longitude.abs() <= 180;

({double? bearing, double distanceKm})? qiblaDirection(
  double latitude,
  double longitude,
) {
  if (!validQiblaPoint(latitude, longitude)) return null;
  final result = calloc<Double>(2);
  try {
    _inverse(latitude, longitude, _kaabaLatitude, _kaabaLongitude, result);
    final distance = result[0];
    if (!distance.isFinite) return null;
    final antipodal =
        (latitude + _kaabaLatitude).abs() < 1e-10 &&
        (angleDifference(longitude, _kaabaLongitude).abs() - 180).abs() < 1e-10;
    final bearing = result[1];
    return (
      bearing: distance < .001 || antipodal || !bearing.isFinite
          ? null
          : normalizeDegrees(bearing),
      distanceKm: distance / 1000,
    );
  } finally {
    calloc.free(result);
  }
}

// WMM2025 coefficients are public-domain NOAA/BGS data, shared with the web app.
Future<GeoMag> loadQiblaMagneticModel(AssetBundle assets) async =>
    GeoMag.fromWmmCof(
      WmmCof.fromString(await assets.loadString('assets/qibla/WMM2025.COF')),
    );

double? qiblaDeclination(
  GeoMag model,
  double latitude,
  double longitude,
  DateTime date,
) {
  if (date.year < 2025 ||
      date.year >= 2030 ||
      !validQiblaPoint(latitude, longitude)) {
    return null;
  }
  final field = model.calculate(latitude, longitude, 0, date);
  return field.dec.isFinite && field.bh >= 2000 ? field.dec : null;
}
