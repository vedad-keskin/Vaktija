package com.vaktija.app

import android.os.Build
import android.os.Bundle
import io.flutter.embedding.android.FlutterActivity

class MainActivity : FlutterActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // Flutter continues the splash from the first rendered frame.
            splashScreen.setOnExitAnimationListener { it.remove() }
        }
    }
}
