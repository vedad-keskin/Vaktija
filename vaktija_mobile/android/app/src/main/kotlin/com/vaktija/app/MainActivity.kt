package com.vaktija.app

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private var launchExited = Build.VERSION.SDK_INT < Build.VERSION_CODES.S
    private var launchReply: MethodChannel.Result? = null
    private var fullscreen = false
    private var qiblaDevice: QiblaDevice? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            splashScreen.setOnExitAnimationListener { view ->
                view.remove()
                launchExited = true
                launchReply?.success(null)
                launchReply = null
            }
        }
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        qiblaDevice = QiblaDevice(this, flutterEngine.dartExecutor.binaryMessenger)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "vaktija/app")
            .setMethodCallHandler { call, result ->
                if (call.method == "getVersion") {
                    @Suppress("DEPRECATION")
                    val info = packageManager.getPackageInfo(packageName, 0)
                    result.success(info.versionName)
                } else if (call.method == "openNotificationSettings") {
                    val settings = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                            .putExtra(Settings.EXTRA_APP_PACKAGE, packageName)
                    } else {
                        Intent(
                            Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                            Uri.fromParts("package", packageName, null),
                        )
                    }
                    startActivity(settings)
                    result.success(null)
                } else {
                    result.notImplemented()
                }
            }
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "vaktija/launch")
            .setMethodCallHandler { call, result ->
                when {
                    call.method != "waitForExit" -> result.notImplemented()
                    launchExited -> result.success(null)
                    else -> launchReply = result
                }
            }
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "vaktija/fullscreen")
            .setMethodCallHandler { call, result ->
                if (call.method == "setEnabled") {
                    fullscreen = call.arguments == true
                    updateSystemBars()
                    result.success(null)
                } else {
                    result.notImplemented()
                }
            }
    }

    override fun cleanUpFlutterEngine(flutterEngine: FlutterEngine) {
        qiblaDevice?.close()
        qiblaDevice = null
        super.cleanUpFlutterEngine(flutterEngine)
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray,
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == QiblaDevice.LOCATION_PERMISSION_REQUEST) qiblaDevice?.permissionResult()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == QiblaDevice.LOCATION_SETTINGS_REQUEST) qiblaDevice?.settingsResult(resultCode)
    }

    override fun onPostResume() {
        super.onPostResume()
        if (fullscreen) updateSystemBars()
    }

    private fun updateSystemBars() {
        val controller = WindowCompat.getInsetsController(window, window.decorView)
        val bars = WindowInsetsCompat.Type.statusBars() or WindowInsetsCompat.Type.navigationBars()
        if (fullscreen) {
            controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            controller.hide(bars)
        } else {
            controller.show(bars)
            controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_DEFAULT
        }
    }
}
