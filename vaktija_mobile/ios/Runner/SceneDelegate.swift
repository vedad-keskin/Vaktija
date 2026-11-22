import Flutter
import UIKit

class SceneDelegate: FlutterSceneDelegate {
  private var qiblaDevice: QiblaDevice?

  override func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    super.scene(scene, willConnectTo: session, options: connectionOptions)
    guard let controller = window?.rootViewController as? FlutterViewController else { return }
    if let windowScene = scene as? UIWindowScene {
      qiblaDevice = QiblaDevice(scene: windowScene, messenger: controller.binaryMessenger)
    }
    let channel = FlutterMethodChannel(
      name: "vaktija/launch", binaryMessenger: controller.binaryMessenger
    )
    channel.setMethodCallHandler { [weak controller] call, result in
      guard call.method == "waitForExit" else {
        result(FlutterMethodNotImplemented)
        return
      }
      if let controller, !controller.isDisplayingFlutterUI {
        controller.setFlutterViewDidRenderCallback { result(nil) }
      } else {
        result(nil)
      }
    }
  }
}
