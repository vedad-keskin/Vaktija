package com.vaktija.app.widgets

import android.app.Activity
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.SizeF
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import android.widget.SeekBar
import android.widget.TextView
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.doOnLayout
import com.vaktija.app.R
import es.antonborri.home_widget.HomeWidgetPlugin
import java.text.NumberFormat
import kotlin.math.roundToInt

class CountdownSettingsActivity : Activity() {
    override fun attachBaseContext(base: Context) {
        super.attachBaseContext(PrayerWidgetRenderer.countdownContext(base, HomeWidgetPlugin.getData(base)))
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val manager = AppWidgetManager.getInstance(this)
        val id = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID)
        val provider = ComponentName(this, PrayerCountdownWidget::class.java)
        val size = intent.extras?.getSizeF(extraSize)
        if (manager.getAppWidgetInfo(id)?.provider != provider || size == null ||
            size.width <= 0f || size.height <= 0f) {
            finish()
            return
        }
        val hostScale = intent.getFloatExtra(extraScale, 1f)
        val data = HomeWidgetPlugin.getData(this)
        var savedOpacity = PrayerCountdown.opacity(data, id)
        var previewOpacity = savedOpacity

        setContentView(R.layout.prayer_countdown_settings)
        findViewById<View>(R.id.widget_countdown_back).setOnClickListener { finish() }
        val screen = findViewById<View>(R.id.widget_countdown_screen)
        val body = findViewById<View>(R.id.widget_countdown_settings_body)
        ViewCompat.setOnApplyWindowInsetsListener(screen) { view, windowInsets ->
            val insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
            view.setPadding(insets.left, insets.top, insets.right, 0)
            body.setPadding(0, 0, 0, insets.bottom)
            windowInsets
        }
        ViewCompat.requestApplyInsets(screen)

        val stage = findViewById<FrameLayout>(R.id.widget_countdown_preview)
        val preview = PrayerWidgetRenderer.countdownPreview(this, data, size, hostScale, previewOpacity).apply(this, stage)
        val density = resources.displayMetrics.density
        val width = (size.width * density).roundToInt().coerceAtLeast(1)
        val height = (size.height * density).roundToInt().coerceAtLeast(1)
        stage.addView(preview, FrameLayout.LayoutParams(width, height, Gravity.CENTER))
        stage.doOnLayout {
            val padding = 16f * density
            val scale = minOf(hostScale, (stage.width - padding) / width, (stage.height - padding) / height)
                .coerceAtLeast(0f)
            preview.scaleX = scale
            preview.scaleY = scale
        }

        val background = preview.findViewById<View>(R.id.widget_countdown_background)
        val slider = findViewById<SeekBar>(R.id.widget_countdown_transparency)
        val value = findViewById<TextView>(R.id.widget_countdown_transparency_value)
        val percent = NumberFormat.getPercentInstance(resources.configuration.locales[0])
        slider.progress = transparency(savedOpacity)
        value.text = percent.format(slider.progress / 100.0)

        fun saveOpacity() {
            if (previewOpacity == savedOpacity || manager.getAppWidgetInfo(id)?.provider != provider) return
            savedOpacity = previewOpacity
            data.edit().putInt(PrayerCountdown.opacityKey(id), savedOpacity).apply()
            PrayerCountdownWidget().onUpdate(this, manager, intArrayOf(id))
        }

        slider.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            private var dragging = false

            override fun onProgressChanged(seekBar: SeekBar, progress: Int, fromUser: Boolean) {
                previewOpacity = if (progress == transparency(savedOpacity)) {
                    savedOpacity
                } else {
                    ((100 - progress) * 255 / 100f).roundToInt()
                }
                background.alpha = previewOpacity / 255f
                value.text = percent.format(progress / 100.0)
                if (fromUser && !dragging) saveOpacity()
            }

            override fun onStartTrackingTouch(seekBar: SeekBar) {
                dragging = true
            }

            override fun onStopTrackingTouch(seekBar: SeekBar) {
                dragging = false
                saveOpacity()
            }
        })
    }

    private fun transparency(opacity: Int) = ((255 - opacity) * 100 / 255f).roundToInt()

    internal companion object {
        private const val extraSize = "countdown_size"
        private const val extraScale = "countdown_scale"
        fun intent(context: Context, id: Int, size: SizeF, hostScale: Float): PendingIntent {
            val intent = Intent(context, CountdownSettingsActivity::class.java)
                // Each launcher size needs its own PendingIntent so the preview can use the tapped layout.
                .setData(Uri.parse("vaktija://countdown-settings/${size.width}/${size.height}"))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                .putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, id)
                .putExtra(extraScale, hostScale)
                .putExtras(Bundle().apply { putSizeF(extraSize, size) })
            return PendingIntent.getActivity(context, id, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        }
    }
}
