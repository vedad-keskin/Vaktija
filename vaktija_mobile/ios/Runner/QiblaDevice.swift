import CoreLocation
import CoreMotion
import Flutter
import UIKit

final class QiblaDevice: NSObject, FlutterStreamHandler, CLLocationManagerDelegate {
  private weak var scene: UIWindowScene?
  private let compass = CLLocationManager()
  private let location = CLLocationManager()
  private let motion = CMMotionManager()
  private var headingSink: FlutterEventSink?
  private var locationReply: FlutterResult?
  private var locationTimer: Timer?

  init(scene: UIWindowScene, messenger: FlutterBinaryMessenger) {
    self.scene = scene
    super.init()
    compass.delegate = self
    compass.headingFilter = kCLHeadingFilterNone
    location.delegate = self
    location.desiredAccuracy = kCLLocationAccuracyHundredMeters
    FlutterEventChannel(name: "vaktija/qibla/heading", binaryMessenger: messenger)
      .setStreamHandler(self)
    FlutterMethodChannel(name: "vaktija/qibla", binaryMessenger: messenger)
      .setMethodCallHandler { [weak self] call, reply in
        guard let self else {
          reply(FlutterError(code: "unavailable", message: nil, details: nil))
          return
        }
        switch call.method {
        case "location": self.requestLocation(reply)
        case "cancelLocation":
          self.finishLocation(error: "cancelled")
          reply(nil)
        default: reply(FlutterMethodNotImplemented)
        }
      }
  }

  func onListen(withArguments arguments: Any?, eventSink events: @escaping FlutterEventSink)
    -> FlutterError? {
    guard CLLocationManager.headingAvailable(), motion.isDeviceMotionAvailable else {
      events(FlutterError(code: "unsupported", message: nil, details: nil))
      return nil
    }
    headingSink = events
    compass.headingOrientation = headingOrientation
    motion.deviceMotionUpdateInterval = 1.0 / 50.0
    motion.startDeviceMotionUpdates(using: .xArbitraryZVertical)
    compass.startUpdatingHeading()
    return nil
  }

  func onCancel(withArguments arguments: Any?) -> FlutterError? {
    headingSink = nil
    compass.stopUpdatingHeading()
    motion.stopDeviceMotionUpdates()
    return nil
  }

  private var headingOrientation: CLDeviceOrientation {
    switch scene?.interfaceOrientation {
    case .landscapeLeft: return .landscapeRight
    case .landscapeRight: return .landscapeLeft
    case .portraitUpsideDown: return .portraitUpsideDown
    default: return .portrait
    }
  }

  func locationManager(_ manager: CLLocationManager, didUpdateHeading heading: CLHeading) {
    guard let sink = headingSink, let gravity = motion.deviceMotion?.gravity else { return }
    let orientation = headingOrientation
    if compass.headingOrientation != orientation {
      compass.headingOrientation = orientation
      return
    }
    let age = Date().timeIntervalSince(heading.timestamp)
    guard age >= 0 && age < 1.5 else { return }
    let quality: String
    if -gravity.z < cos(50.0 * .pi / 180.0) {
      quality = "tilt"
    } else if !(0...20).contains(heading.headingAccuracy) || heading.magneticHeading < 0 {
      quality = "accuracy"
    } else {
      quality = "good"
    }
    let sample: [String: Any] = [
      "heading": heading.magneticHeading,
      "quality": quality,
      "rotation": Int(orientation.rawValue),
    ]
    sink(sample)
  }

  private func requestLocation(_ reply: @escaping FlutterResult) {
    finishLocation(error: "cancelled")
    locationReply = reply
    let status: CLAuthorizationStatus
    if #available(iOS 14.0, *) {
      status = location.authorizationStatus
    } else {
      status = CLLocationManager.authorizationStatus()
    }
    if status == .notDetermined {
      location.requestWhenInUseAuthorization()
    } else {
      handlePermission(status)
    }
  }

  @available(iOS 14.0, *)
  func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
    if manager === location { handlePermission(manager.authorizationStatus) }
  }

  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    if manager === location { handlePermission(status) }
  }

  private func handlePermission(_ status: CLAuthorizationStatus) {
    guard locationReply != nil else { return }
    switch status {
    case .authorizedAlways, .authorizedWhenInUse:
      guard locationTimer == nil else { return }
      locationTimer = Timer.scheduledTimer(withTimeInterval: 15, repeats: false) { [weak self] _ in
        self?.finishLocation(error: "unavailable")
      }
      location.startUpdatingLocation()
    case .notDetermined: break
    default: finishLocation(error: "denied")
    }
  }

  func locationManager(_ manager: CLLocationManager, didUpdateLocations fixes: [CLLocation]) {
    guard manager === location else { return }
    let accuracyLimit: Double
    if #available(iOS 14.0, *), manager.accuracyAuthorization == .reducedAccuracy {
      accuracyLimit = 5_000
    } else {
      accuracyLimit = 1_000
    }
    if let fix = fixes.reversed().first(where: {
      (0...accuracyLimit).contains($0.horizontalAccuracy)
        && (0...20).contains(Date().timeIntervalSince($0.timestamp))
    }) {
      finishLocation(fix)
    }
  }

  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    guard manager === location else { return }
    let code = (error as? CLError)?.code
    if code != .locationUnknown {
      finishLocation(error: code == .denied ? "denied" : "unavailable")
    }
  }

  private func finishLocation(_ fix: CLLocation? = nil, error: String = "unavailable") {
    guard let reply = locationReply else { return }
    locationReply = nil
    locationTimer?.invalidate()
    locationTimer = nil
    location.stopUpdatingLocation()
    if let fix {
      reply([fix.coordinate.latitude, fix.coordinate.longitude])
    } else {
      reply(FlutterError(code: error, message: nil, details: nil))
    }
  }
}
