import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
    GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)
    let appChannel = FlutterMethodChannel(
      name: "vaktija/app",
      binaryMessenger: engineBridge.applicationRegistrar.messenger()
    )
    appChannel.setMethodCallHandler { call, result in
      if call.method == "getVersion" {
        result(Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String)
      } else {
        result(FlutterMethodNotImplemented)
      }
    }
  }
}
