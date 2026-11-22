package com.vaktija.app

import android.os.Build
import android.os.Bundle
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private var launchExited = Build.VERSION.SDK_INT < Build.VERSION_CODES.S
    private var launchReply: MethodChannel.Result? = null

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
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "vaktija/launch")
            .setMethodCallHandler { call, result ->
                when {
                    call.method != "waitForExit" -> result.notImplemented()
                    launchExited -> result.success(null)
                    else -> launchReply = result
                }
            }
    }
}
