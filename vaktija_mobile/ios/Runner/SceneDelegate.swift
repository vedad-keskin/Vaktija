import Flutter
import UIKit

class SceneDelegate: FlutterSceneDelegate {
  override func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    super.scene(scene, willConnectTo: session, options: connectionOptions)
    guard let controller = window?.rootViewController as? FlutterViewController else { return }
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
