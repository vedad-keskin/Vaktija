package com.vaktija.app.widgets

import android.app.Activity
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.graphics.drawable.BitmapDrawable
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.SizeF
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.SeekBar
import android.widget.Switch
import android.widget.TextView
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.doOnLayout
import com.vaktija.app.R
import es.antonborri.home_widget.HomeWidgetPlugin
import io.flutter.plugins.sharedpreferences.SHARED_PREFERENCES_NAME
import java.text.NumberFormat
import kotlin.math.roundToInt

class CountdownSettingsActivity : Activity() {
    private val previewHandler = Handler(Looper.getMainLooper())
    private var refreshPreview: Runnable? = null
    private var appliedNightMode: Int? = null

    override fun attachBaseContext(base: Context) {
        val localized = PrayerWidgetRenderer.countdownContext(base, HomeWidgetPlugin.getData(base))
        val night = appNightMode(base)
        appliedNightMode = night
        super.attachBaseContext(if (night == null) localized else {
            val config = Configuration(localized.resources.configuration)
            config.uiMode = (config.uiMode and Configuration.UI_MODE_NIGHT_MASK.inv()) or night
            localized.createConfigurationContext(config)
        })
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
        var appearance = PrayerCountdown.appearance(data, id)
        var previewOpacity = appearance.opacity

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
        var previewRenderer = PrayerWidgetRenderer.countdownPreview(this, data)
        val preview = previewRenderer.views(size, hostScale, appearance, null).apply(this, stage)
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
        slider.progress = transparency(appearance.opacity)
        value.text = percent.format(slider.progress / 100.0)

        fun saveAppearance(updated: CountdownAppearance) {
            if (updated == appearance || manager.getAppWidgetInfo(id)?.provider != provider) return
            val editor = data.edit()
            PrayerCountdown.writeAppearance(editor, id, updated)
            editor.apply()
            appearance = updated
            PrayerCountdownWidget().onUpdate(this, manager, intArrayOf(id))
        }

        slider.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            private var dragging = false

            override fun onProgressChanged(seekBar: SeekBar, progress: Int, fromUser: Boolean) {
                previewOpacity = if (progress == transparency(appearance.opacity)) {
                    appearance.opacity
                } else {
                    ((100 - progress) * 255 / 100f).roundToInt()
                }
                background.alpha = previewOpacity / 255f
                value.text = percent.format(progress / 100.0)
                if (fromUser && !dragging) saveAppearance(appearance.copy(opacity = previewOpacity))
            }

            override fun onStartTrackingTouch(seekBar: SeekBar) {
                dragging = true
            }

            override fun onStopTrackingTouch(seekBar: SeekBar) {
                dragging = false
                saveAppearance(appearance.copy(opacity = previewOpacity))
            }
        })

        val ringModes = findViewById<RadioGroup>(R.id.widget_countdown_ring_modes)
        val colorRow = findViewById<RadioGroup>(R.id.widget_countdown_ring_color_row)
        val timeSamples = findViewById<LinearLayout>(R.id.widget_countdown_ring_time_samples)
        fun showRingOptions(timeBased: Boolean) {
            colorRow.visibility = if (timeBased) View.GONE else View.VISIBLE
            timeSamples.visibility = if (timeBased) View.VISIBLE else View.GONE
        }
        ringModes.check(if (appearance.timeBased) R.id.widget_countdown_ring_time_based else R.id.widget_countdown_ring_solid)
        showRingOptions(appearance.timeBased)

        fun redrawPreview(updated: CountdownAppearance) {
            previewRenderer.views(size, hostScale, updated.copy(opacity = previewOpacity), null).reapply(this, preview)
        }

        fun changeAppearance(updated: CountdownAppearance) {
            if (updated == appearance) return
            redrawPreview(updated)
            saveAppearance(updated)
        }

        ringModes.setOnCheckedChangeListener { _, checkedId ->
            val timeBased = checkedId == R.id.widget_countdown_ring_time_based
            showRingOptions(timeBased)
            changeAppearance(appearance.copy(timeBased = timeBased))
        }
        val swatchSize = (28f * density).roundToInt()
        val swatchPadding = (9f * density).roundToInt()
        fun TextView.showRing(label: String, color: CountdownRingColor, progress: Float) {
            val bitmap = PrayerCountdown.progressRing(progress, color.resolve(this@CountdownSettingsActivity), swatchSize)
            val ring = BitmapDrawable(resources, bitmap).apply {
                setBounds(0, 0, swatchSize, swatchSize)
            }
            gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
            textSize = 11f
            text = label
            setTextColor(getColorStateList(R.color.countdown_option_text))
            compoundDrawablePadding = (5f * density).roundToInt()
            setCompoundDrawables(null, ring, null, null)
            setPadding(0, swatchPadding, 0, swatchPadding)
        }
        for (color in CountdownRingColor.entries) {
            val swatch = RadioButton(this).apply {
                this.id = View.generateViewId()
                isSaveEnabled = false
                buttonDrawable = null
                val label = getString(if (color == CountdownRingColor.SYSTEM) R.string.widget_countdown_ring_auto else color.label)
                showRing(label, color, 1f)
                contentDescription = getString(color.label)
                setBackgroundResource(R.drawable.countdown_ring_swatch_selection)
                isChecked = color == appearance.color
                setOnClickListener { changeAppearance(appearance.copy(color = color)) }
            }
            colorRow.addView(swatch, RadioGroup.LayoutParams(0, RadioGroup.LayoutParams.MATCH_PARENT, 1f))
        }
        for (minutes in listOf(20, 10, 3)) {
            val sample = TextView(this).apply {
                val color = PrayerCountdown.timeColor(minutes * PrayerCountdown.minute)
                val label = getString(R.string.widget_countdown_minutes, minutes)
                // Draw each example as a snapshot of a 30-minute countdown.
                showRing(label, color, 1f - minutes / 30f)
                contentDescription = getString(R.string.widget_countdown_ring_sample, label, getString(color.label))
            }
            timeSamples.addView(sample, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.MATCH_PARENT, 1f))
        }

        if (!PrayerCountdown.isWide(size, hostScale)) {
            findViewById<View>(R.id.widget_countdown_display_size_note).visibility = View.VISIBLE
        }
        findViewById<Switch>(R.id.widget_countdown_show_prayer_time).apply {
            isChecked = appearance.showPrayerTime
            setOnCheckedChangeListener { _, checked -> changeAppearance(appearance.copy(showPrayerTime = checked)) }
        }
        findViewById<Switch>(R.id.widget_countdown_show_prayer_icon).apply {
            isChecked = appearance.showPrayerIcon
            setOnCheckedChangeListener { _, checked -> changeAppearance(appearance.copy(showPrayerIcon = checked)) }
        }

        refreshPreview = object : Runnable {
            override fun run() {
                previewRenderer = PrayerWidgetRenderer.countdownPreview(this@CountdownSettingsActivity, data)
                redrawPreview(appearance)
                previewRenderer.nextMinute?.let {
                    previewHandler.postDelayed(this, (it - System.currentTimeMillis()).coerceAtLeast(100L))
                }
            }
        }
    }

    override fun onStart() {
        super.onStart()
        if (appNightMode(this) != appliedNightMode) {
            recreate()
            return
        }
        refreshPreview?.run()
    }

    override fun onStop() {
        refreshPreview?.let(previewHandler::removeCallbacks)
        super.onStop()
    }

    private fun transparency(opacity: Int) = ((255 - opacity) * 100 / 255f).roundToInt()

    // Read the same legacy SharedPreferences value that Vaktija uses for its theme.
    private fun appNightMode(context: Context): Int? = when (
        context.getSharedPreferences(SHARED_PREFERENCES_NAME, Context.MODE_PRIVATE).getString("flutter.theme", null)
    ) {
        "light" -> Configuration.UI_MODE_NIGHT_NO
        "dark" -> Configuration.UI_MODE_NIGHT_YES
        else -> null
    }

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
