package com.vaktija.app

import android.Manifest
import android.app.Activity
import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.IntentSender
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.location.Location
import android.location.LocationManager
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.provider.Settings
import android.view.Surface
import androidx.core.app.ActivityCompat
import androidx.core.location.LocationListenerCompat
import androidx.core.location.LocationManagerCompat
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.common.api.ResolvableApiException
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.LocationSettingsRequest
import com.google.android.gms.location.Priority
import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.EventChannel
import io.flutter.plugin.common.MethodChannel
import kotlin.math.atan2
import kotlin.math.cos

internal class QiblaDevice(
    private val activity: MainActivity,
    messenger: BinaryMessenger,
) : EventChannel.StreamHandler, SensorEventListener {
    companion object {
        const val LOCATION_PERMISSION_REQUEST = 7241
        const val LOCATION_SETTINGS_REQUEST = 7242
        private val FACE_UP_LIMIT = cos(Math.toRadians(50.0))
    }

    private val sensors = activity.getSystemService(SensorManager::class.java)
    private val locations = activity.getSystemService(LocationManager::class.java)
    private val compass = EventChannel(messenger, "vaktija/qibla/heading")
    private val actions = MethodChannel(messenger, "vaktija/qibla")
    private val handler = Handler(Looper.getMainLooper())
    private var headingSink: EventChannel.EventSink? = null
    private val matrix = FloatArray(9)
    private val screenMatrix = FloatArray(9)
    private var locationReply: MethodChannel.Result? = null
    private var permissionPending = false
    private var settingsReply: MethodChannel.Result? = null
    private val locationTimeout = Runnable { finishLocation(error = "unavailable") }
    private val locationListener = object : LocationListenerCompat {
        override fun onLocationChanged(fix: Location) {
            val age = SystemClock.elapsedRealtimeNanos() - fix.elapsedRealtimeNanos
            val accuracyLimit = if (hasFineLocation()) 1000f else 5000f
            if (fix.hasAccuracy() && fix.accuracy in 0f..accuracyLimit &&
                age in 0L..20_000_000_000L) {
                finishLocation(fix)
            }
        }
    }

    init {
        compass.setStreamHandler(this)
        actions.setMethodCallHandler { call, reply ->
            when (call.method) {
                "location" -> requestLocation(reply)
                "openLocationSettings" -> {
                    try {
                        val intent = if (call.argument<Boolean>("app") == true) {
                            Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                                Uri.fromParts("package", activity.packageName, null))
                        } else {
                            Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
                        }
                        activity.startActivity(intent)
                        reply.success(null)
                    } catch (_: ActivityNotFoundException) {
                        reply.error("unavailable", null, null)
                    } catch (_: SecurityException) {
                        reply.error("unavailable", null, null)
                    }
                }
                "cancelLocation" -> {
                    // The native permission/settings dialog can temporarily hide Flutter.
                    val prompting = permissionPending || settingsReply != null
                    if (call.argument<Boolean>("background") == true && prompting) {
                        reply.success(false)
                    } else {
                        finishLocation(error = "cancelled")
                        reply.success(true)
                    }
                }
                else -> reply.notImplemented()
            }
        }
    }

    override fun onListen(arguments: Any?, events: EventChannel.EventSink) {
        val sensor = sensors.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR)
            ?: sensors.getDefaultSensor(Sensor.TYPE_GEOMAGNETIC_ROTATION_VECTOR)
        if (sensor == null || !sensors.registerListener(this, sensor, 20_000)) {
            events.error("unsupported", null, null)
            return
        }
        headingSink = events
    }

    override fun onCancel(arguments: Any?) {
        headingSink = null
        sensors.unregisterListener(this)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit

    override fun onSensorChanged(event: SensorEvent) {
        val sink = headingSink ?: return
        val age = SystemClock.elapsedRealtimeNanos() - event.timestamp
        if (age !in 0L..1_500_000_000L) return
        val rotation = activity.window.decorView.display?.rotation ?: Surface.ROTATION_0
        SensorManager.getRotationMatrixFromVector(matrix, event.values)
        val accuracy = event.values.getOrNull(4) ?: -1f
        val quality = when {
            matrix[8] < FACE_UP_LIMIT -> "tilt"
            event.accuracy <= SensorManager.SENSOR_STATUS_ACCURACY_LOW ||
                (accuracy >= 0f && accuracy > Math.toRadians(20.0)) -> "accuracy"
            else -> "good"
        }
        val (x, y) = when (rotation) {
            Surface.ROTATION_90 -> SensorManager.AXIS_Y to SensorManager.AXIS_MINUS_X
            Surface.ROTATION_180 -> SensorManager.AXIS_MINUS_X to SensorManager.AXIS_MINUS_Y
            Surface.ROTATION_270 -> SensorManager.AXIS_MINUS_Y to SensorManager.AXIS_X
            else -> SensorManager.AXIS_X to SensorManager.AXIS_Y
        }
        if (!SensorManager.remapCoordinateSystem(matrix, x, y, screenMatrix)) return
        val heading = Math.toDegrees(atan2(screenMatrix[1].toDouble(), screenMatrix[4].toDouble()))
        sink.success(mapOf("heading" to heading, "rotation" to rotation, "quality" to quality))
    }

    private fun hasFineLocation(): Boolean = ActivityCompat.checkSelfPermission(
        activity, Manifest.permission.ACCESS_FINE_LOCATION,
    ) == PackageManager.PERMISSION_GRANTED

    private fun canLocate(): Boolean = hasFineLocation() || ActivityCompat.checkSelfPermission(
        activity, Manifest.permission.ACCESS_COARSE_LOCATION,
    ) == PackageManager.PERMISSION_GRANTED

    private fun requestLocation(reply: MethodChannel.Result) {
        finishLocation(error = "cancelled")
        locationReply = reply
        if (canLocate()) {
            checkLocationSettings()
        } else if (!permissionPending) {
            permissionPending = true
            ActivityCompat.requestPermissions(
                activity,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION),
                LOCATION_PERMISSION_REQUEST,
            )
        }
    }

    fun permissionResult() {
        permissionPending = false
        if (locationReply == null) return
        if (canLocate()) checkLocationSettings() else finishLocation(error = "denied")
    }

    private fun checkLocationSettings(allowResolution: Boolean = true) {
        val reply = locationReply ?: return
        if (settingsReply != null) return
        if (GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(activity) != ConnectionResult.SUCCESS) {
            startLocation()
            return
        }
        val priority = if (hasFineLocation()) Priority.PRIORITY_HIGH_ACCURACY
            else Priority.PRIORITY_BALANCED_POWER_ACCURACY
        val request = LocationRequest.Builder(priority, 1000L).setMaxUpdates(1).build()
        val settings = LocationSettingsRequest.Builder().addLocationRequest(request).build()
        LocationServices.getSettingsClient(activity).checkLocationSettings(settings)
            .addOnSuccessListener {
                if (locationReply === reply) startLocation()
            }
            .addOnFailureListener { error ->
                if (locationReply !== reply) return@addOnFailureListener
                if (error is ResolvableApiException && allowResolution) {
                    settingsReply = reply
                    try {
                        error.startResolutionForResult(activity, LOCATION_SETTINGS_REQUEST)
                    } catch (_: IntentSender.SendIntentException) {
                        settingsReply = null
                        startLocation()
                    }
                } else {
                    // A working platform provider is still usable without Google's resolution UI.
                    startLocation()
                }
            }
    }

    fun settingsResult(resultCode: Int) {
        val reply = settingsReply ?: return
        settingsReply = null
        if (locationReply !== reply) {
            if (locationReply != null) checkLocationSettings(allowResolution = false)
        } else if (resultCode == Activity.RESULT_OK) {
            checkLocationSettings(allowResolution = false)
        } else {
            finishLocation(error = "cancelled")
        }
    }

    @SuppressLint("MissingPermission") // Both callers verify foreground permission.
    private fun startLocation() {
        if (!LocationManagerCompat.isLocationEnabled(locations)) {
            finishLocation(error = "services_disabled")
            return
        }
        var listening = false
        for (provider in listOf(LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER)) {
            try {
                if (!locations.isProviderEnabled(provider)) continue
                locations.requestLocationUpdates(provider, 0L, 0f, locationListener, Looper.getMainLooper())
                listening = true
            } catch (_: IllegalArgumentException) {
                // The other provider may still be available.
            } catch (_: SecurityException) {
                // Approximate permission may only permit the network provider.
            }
        }
        if (listening) handler.postDelayed(locationTimeout, 15_000)
        else finishLocation(error = "unavailable")
    }

    private fun finishLocation(fix: Location? = null, error: String? = null) {
        val reply = locationReply ?: return
        locationReply = null
        handler.removeCallbacks(locationTimeout)
        locations.removeUpdates(locationListener)
        if (fix != null) reply.success(listOf(fix.latitude, fix.longitude))
        else reply.error(error ?: "unavailable", null, null)
    }

    fun close() {
        onCancel(null)
        finishLocation(error = "cancelled")
        settingsReply = null
        compass.setStreamHandler(null)
        actions.setMethodCallHandler(null)
    }
}
