package com.vaktija.app.widgets

import android.app.AlarmManager
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.res.ColorStateList
import android.content.res.Configuration
import android.content.res.Resources
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.net.Uri
import android.os.Build
import android.util.Log
import android.util.SizeF
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.widget.RemoteViews
import androidx.core.graphics.ColorUtils
import com.vaktija.app.MainActivity
import com.vaktija.app.R
import es.antonborri.home_widget.HomeWidgetLaunchIntent
import es.antonborri.home_widget.HomeWidgetScheduler
import java.text.ParsePosition
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone
import kotlin.math.roundToInt

internal enum class CountdownRingColor(val label: Int, val rgb: Int?) {
    SYSTEM(R.string.widget_countdown_ring_system, null),
    BLUE(R.string.widget_countdown_ring_blue, 0xFF377AFF.toInt()),
    GREEN(R.string.widget_countdown_ring_green, 0xFF38B879.toInt()),
    AMBER(R.string.widget_countdown_ring_amber, 0xFFFFB02E.toInt()),
    RED(R.string.widget_countdown_ring_red, 0xFFF45159.toInt());

    fun resolve(context: Context): Int = rgb ?: if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        context.getColor(android.R.color.system_accent1_400)
    } else {
        Color.rgb(55, 122, 255)
    }

    fun highlightTint(context: Context, dark: Boolean): Int {
        if (this == GREEN) return if (dark) 0xFF45B985.toInt() else 0xFF256047.toInt()
        return ColorUtils.blendARGB(resolve(context), if (dark) Color.WHITE else Color.BLACK,
            if (dark) .08f else .35f)
    }
}

internal enum class CountdownTheme { SYSTEM, LIGHT, DARK }

internal data class CountdownAppearance(
    val opacity: Int,
    val color: CountdownRingColor,
    val timeBased: Boolean,
    val showPrayerTime: Boolean,
    val showPrayerIcon: Boolean,
    val theme: CountdownTheme,
    val includeNightTimes: Boolean,
    val showAppLogo: Boolean,
    val highlightNext: Boolean,
    val highlightColor: CountdownRingColor,
)

internal object PrayerCountdown {
    private const val defaultOpacity = 162
    const val minute = 60_000L
    private const val wideWidth = 190f
    private const val referenceHeight = 71.73333f
    private const val settingsGap = 18f
    private val prayerTitles = mapOf(
        "fajr" to R.string.widget_countdown_fajr,
        "dhuhr" to R.string.widget_countdown_dhuhr,
        "asr" to R.string.widget_countdown_asr,
        "maghrib" to R.string.widget_countdown_maghrib,
        "isha" to R.string.widget_countdown_isha,
    )
    private val utcTimestamp = Regex("""\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:\d{3})?Z""")

    private data class Prayer(val kind: String, val at: Long, val time: String, val name: String)

    private data class Palette(
        val panel: Int,
        val title: Int,
        val ink: Int,
        val panelDrawable: Int,
        val gearDrawable: Int,
    )

    private val lightPalette = Palette(
        0xFFF7F7FC.toInt(), 0xFF4B4E59.toInt(), 0xFF1E2028.toInt(),
        R.drawable.widget_countdown_panel_light, R.drawable.widget_countdown_gear_background_light,
    )
    private val darkPalette = Palette(
        Color.BLACK, 0xA6FCFCFF.toInt(), 0xFFFCFCFF.toInt(),
        R.drawable.widget_countdown_panel, R.drawable.widget_countdown_gear_background,
    )

    class Render(
        val nextPrayer: Long?,
        val nextMinute: Long?,
        val views: (SizeF, Float, CountdownAppearance, Int?) -> RemoteViews,
    )

    private fun opacityKey(id: Int) = "vaktija.widgets.countdown.opacity.$id"
    private fun colorKey(id: Int) = "vaktija.widgets.countdown.color.$id"
    // Carry existing Segmented selections over to Time-based.
    private fun timeBasedKey(id: Int) = "vaktija.widgets.countdown.segmented.$id"
    private fun prayerTimeKey(id: Int) = "vaktija.widgets.countdown.showPrayerTime.$id"
    private fun prayerIconKey(id: Int) = "vaktija.widgets.countdown.showPrayerIcon.$id"
    private fun themeKey(id: Int) = "vaktija.widgets.countdown.theme.$id"
    private fun nightTimesKey(id: Int) = "vaktija.widgets.timetable.includeNightTimes.$id"
    private fun appLogoKey(id: Int) = "vaktija.widgets.timetable.showAppLogo.$id"
    private fun highlightKey(id: Int) = "vaktija.widgets.timetable.highlightNext.$id"
    private fun highlightColorKey(id: Int) = "vaktija.widgets.timetable.highlightColor.$id"

    fun isWide(size: SizeF, hostScale: Float) = size.width * hostScale >= wideWidth

    fun appearance(data: SharedPreferences, id: Int): CountdownAppearance {
        val color = data.getString(colorKey(id), null)
        val theme = data.getString(themeKey(id), null)
        val highlightColor = data.getString(highlightColorKey(id), null)
        return CountdownAppearance(
            opacity = data.getInt(opacityKey(id), defaultOpacity).coerceIn(0, 255),
            color = CountdownRingColor.entries.firstOrNull { it.name == color } ?: CountdownRingColor.SYSTEM,
            timeBased = data.getBoolean(timeBasedKey(id), false),
            showPrayerTime = data.getBoolean(prayerTimeKey(id), false),
            showPrayerIcon = data.getBoolean(prayerIconKey(id), true),
            theme = CountdownTheme.entries.firstOrNull { it.name == theme } ?: CountdownTheme.SYSTEM,
            includeNightTimes = data.getBoolean(nightTimesKey(id), true),
            showAppLogo = data.getBoolean(appLogoKey(id), true),
            highlightNext = data.getBoolean(highlightKey(id), false),
            highlightColor = CountdownRingColor.entries.firstOrNull { it.name == highlightColor } ?: CountdownRingColor.GREEN,
        )
    }

    fun writeAppearance(editor: SharedPreferences.Editor, id: Int, appearance: CountdownAppearance) {
        editor.putInt(opacityKey(id), appearance.opacity)
            .putString(colorKey(id), appearance.color.name)
            .putBoolean(timeBasedKey(id), appearance.timeBased)
            .putBoolean(prayerTimeKey(id), appearance.showPrayerTime)
            .putBoolean(prayerIconKey(id), appearance.showPrayerIcon)
            .putString(themeKey(id), appearance.theme.name)
            .putBoolean(nightTimesKey(id), appearance.includeNightTimes)
            .putBoolean(appLogoKey(id), appearance.showAppLogo)
            .putBoolean(highlightKey(id), appearance.highlightNext)
            .putString(highlightColorKey(id), appearance.highlightColor.name)
    }

    fun removeAppearance(editor: SharedPreferences.Editor, id: Int) {
        editor.remove(opacityKey(id))
            .remove(colorKey(id))
            .remove(timeBasedKey(id))
            .remove(prayerTimeKey(id))
            .remove(prayerIconKey(id))
            .remove(themeKey(id))
            .remove(nightTimesKey(id))
            .remove(appLogoKey(id))
            .remove(highlightKey(id))
            .remove(highlightColorKey(id))
    }

    private fun RemoteViews.setPalette(context: Context, theme: CountdownTheme, preview: Boolean) {
        val fixed = when (theme) {
            CountdownTheme.LIGHT -> lightPalette
            CountdownTheme.DARK -> darkPalette
            CountdownTheme.SYSTEM -> {
                val night = context.applicationContext.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
                if (night == Configuration.UI_MODE_NIGHT_YES) darkPalette else lightPalette
            }
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // Launcher widgets resolve System colors in the host. The preview may be inside a Vaktija theme override.
            val adaptive = theme == CountdownTheme.SYSTEM && !preview
            val day = if (adaptive) lightPalette else fixed
            val night = if (adaptive) darkPalette else fixed
            setColorStateList(R.id.widget_countdown_background, "setBackgroundTintList",
                ColorStateList.valueOf(day.panel), ColorStateList.valueOf(night.panel))
            setColorStateList(R.id.widget_countdown_gear, "setBackgroundTintList",
                ColorStateList.valueOf(day.ink), ColorStateList.valueOf(night.ink))
            setColorInt(R.id.widget_countdown_gear, "setColorFilter", day.ink, night.ink)
            setColorInt(R.id.widget_countdown_title, "setTextColor", day.title, night.title)
            setColorInt(R.id.widget_countdown_timer, "setTextColor", day.ink, night.ink)
        } else {
            setInt(R.id.widget_countdown_background, "setBackgroundResource", fixed.panelDrawable)
            setInt(R.id.widget_countdown_gear, "setBackgroundResource", fixed.gearDrawable)
            setInt(R.id.widget_countdown_gear, "setColorFilter", fixed.ink)
            setTextColor(R.id.widget_countdown_title, fixed.title)
            setTextColor(R.id.widget_countdown_timer, fixed.ink)
        }
    }

    fun localizedContext(context: Context, settings: WidgetSettings?): Context {
        if (settings == null) return context
        val localized = Configuration(context.resources.configuration)
        localized.setLocale(Locale.forLanguageTag(if (settings.bosnian) "bs" else "en"))
        return context.createConfigurationContext(localized)
    }

    fun prepare(
        context: Context, settings: WidgetSettings?, now: Long,
        yesterday: List<WidgetPrayer>?, today: List<WidgetPrayer>?, tomorrow: List<WidgetPrayer>?,
        previousIsha: String?, prayerIcon: (String) -> Int,
    ): Render {
        val parser = timestampParser()
        val currentDay = prayers(today, parser)
        val next = currentDay?.firstOrNull { it.at > now }
            ?: currentDay?.let { prayers(tomorrow, parser)?.firstOrNull { it.at > now } }
        val starts = currentDay?.lastOrNull { it.at <= now }?.at
            ?: prayers(yesterday, parser)?.lastOrNull { it.at <= now }?.at
            ?: parseTime(previousIsha, parser)?.takeIf { it <= now }
        val resources = localizedContext(context, settings).resources
        val remaining = next?.let { it.at - now } ?: 0L
        val progress = if (next != null && starts != null && starts < next.at) {
            ((now - starts).toFloat() / (next.at - starts)).coerceIn(0f, 1f)
        } else 0f
        val accent = CountdownRingColor.SYSTEM.resolve(context)
        val rings = mutableMapOf<Int, Bitmap>()
        val timerText = next?.let { remainingText(resources, remaining) }
        val icon = next?.let {
            val source = BitmapFactory.decodeResource(context.resources, prayerIcon(it.kind))
            // All five prayer PNGs share these transparent margins.
            Bitmap.createBitmap(source, 15, 8, 126, 144)
        }
        val soon = if (remaining in 1..(5 * minute)) resources.getString(R.string.widget_countdown_soon) else null
        val prayerTitle = next?.takeIf { it.kind == "dhuhr" }?.name ?: resources.getString(next?.let { prayerTitles.getValue(it.kind) }
            ?: if (settings?.ready == true) R.string.widget_countdown_unavailable else R.string.widget_countdown_setup)
        val metrics = resources.displayMetrics
        val countdownPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            val family = Typeface.create("sec", Typeface.NORMAL)
            typeface = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) Typeface.create(family, 500, false) else family
        }
        val labelPaint = Paint(countdownPaint)
        countdownPaint.fontFeatureSettings = "tnum"

        fun views(size: SizeF, hostScale: Float, appearance: CountdownAppearance, id: Int?) = RemoteViews(
            context.packageName, R.layout.prayer_widget_countdown,
        ).apply {
            val wide = isWide(size, hostScale)
            val live = next != null
            val centerText = wide && live
            val showIcon = centerText && appearance.showPrayerIcon
            val shownTime = next?.time?.takeIf { wide && appearance.showPrayerTime }
            val title = shownTime?.let { resources.getString(R.string.widget_countdown_title_with_time, prayerTitle, it) }
                ?: prayerTitle
            val textGravity = Gravity.TOP or (if (centerText) Gravity.CENTER_HORIZONTAL else Gravity.START)
            // Measured reference is 156.8 x 71.733 dp. Samsung Home scales third-party widgets.
            val panelHeight = minOf(size.height, referenceHeight / hostScale)
            val unit = panelHeight / referenceHeight
            val inset = (size.height - panelHeight) / 2f
            // ponytail: pre-Android 12 image slots stay fixed; use size-specific layouts for full legacy resize fidelity.
            val imageWidth = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) 60.8f * unit else 60.8f
            val settingsWidth = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                maxOf(imageWidth, 48f / hostScale) + settingsGap / hostScale
            } else imageWidth + settingsGap
            val imageInset = ((imageWidth - 60.8f * unit) / 2f * metrics.density).roundToInt().coerceAtLeast(0)
            val iconHeight = 52.8f * unit
            val iconWidth = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                icon?.let { iconHeight * it.width / it.height + 8f * unit } ?: 0f
            } else 54.2f
            val gapPx = (8f * unit * metrics.density).roundToInt()
            val insetPx = (inset * metrics.density).roundToInt()
            setViewPadding(R.id.widget_countdown_root, 0, insetPx, 0, insetPx)
            setPalette(context, appearance.theme, preview = id == null)
            setFloat(R.id.widget_countdown_background, "setAlpha", appearance.opacity / 255f)
            val startPadding = (if (centerText) 8.53333f else 21.33333f) * unit
            val endPadding = 8.53333f * unit
            setViewPadding(R.id.widget_countdown_panel, (startPadding * metrics.density).roundToInt(), 0,
                (endPadding * metrics.density).roundToInt(), 0)
            setViewPadding(R.id.widget_countdown_progress, imageInset + gapPx, imageInset, imageInset, imageInset)
            setViewPadding(R.id.widget_countdown_icon, 0, 0, gapPx, 0)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val gearSize = 26f / hostScale
                val gearInset = 5f / hostScale
                val gearInsetPx = (gearInset * metrics.density).roundToInt()
                val gearTop = ((panelHeight - iconHeight) / 2f - gearInset).coerceAtLeast(0f)
                setViewPadding(R.id.widget_countdown_gear, gearInsetPx, gearInsetPx, gearInsetPx, gearInsetPx)
                setViewLayoutWidth(R.id.widget_countdown_gear, gearSize, TypedValue.COMPLEX_UNIT_DIP)
                setViewLayoutHeight(R.id.widget_countdown_gear, gearSize, TypedValue.COMPLEX_UNIT_DIP)
                setViewLayoutMargin(R.id.widget_countdown_gear, RemoteViews.MARGIN_TOP, gearTop, TypedValue.COMPLEX_UNIT_DIP)
                setViewLayoutWidth(R.id.widget_countdown_settings, settingsWidth, TypedValue.COMPLEX_UNIT_DIP)
                setViewLayoutWidth(R.id.widget_countdown_progress, imageWidth, TypedValue.COMPLEX_UNIT_DIP)
                setViewLayoutWidth(R.id.widget_countdown_icon, iconWidth, TypedValue.COMPLEX_UNIT_DIP)
                setViewLayoutHeight(R.id.widget_countdown_icon, iconHeight, TypedValue.COMPLEX_UNIT_DIP)
            }
            val textWidth = size.width - startPadding - endPadding -
                settingsWidth - (if (showIcon) iconWidth else 0f)
            val textWidthPx = ((textWidth - 1f) * metrics.density).coerceAtLeast(1f)
            val unitPx = unit * metrics.density

            fun fitText(paint: Paint, text: String, sizeSp: Float, lineHeightDp: Float) {
                paint.textSize = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, sizeSp * unit, metrics)
                val font = paint.fontMetrics
                paint.textSize *= minOf(1f, textWidthPx / paint.measureText(text),
                    lineHeightDp * unitPx / (font.descent - font.ascent))
            }

            fun setLine(id: Int, text: String, paint: Paint, baselineDp: Float) {
                setInt(id, "setGravity", textGravity)
                setTextViewText(id, text)
                setTextViewTextSize(id, TypedValue.COMPLEX_UNIT_PX, paint.textSize)
                val top = ((baselineDp * unitPx).roundToInt() + paint.fontMetricsInt.ascent).coerceAtLeast(0)
                setViewPadding(id, 0, top, 0, 0)
            }

            val compactness = if (timerText != null) {
                fitText(countdownPaint, timerText, 23.5f, 32.5f)
                // The reference's 23.5sp and 16.5sp timers have different line spacing.
                ((23.5f - countdownPaint.textSize / unitPx) / 7f).coerceIn(0f, 1f)
            } else 0f
            fitText(labelPaint, title, 12f, 16.3f)
            setLine(R.id.widget_countdown_title, title, labelPaint, 24.8f + 5.6f * compactness)
            if (id != null) {
                setOnClickPendingIntent(R.id.widget_countdown_root, HomeWidgetLaunchIntent.getActivity(
                    context, MainActivity::class.java, Uri.parse("vaktija://widgets/prayers"),
                ))
                setOnClickPendingIntent(R.id.widget_countdown_settings,
                    CountdownSettingsActivity.intent(context, id, size, hostScale))
                setContentDescription(R.id.widget_countdown_settings,
                    resources.getString(R.string.widget_countdown_settings))
            }
            val liveVisibility = if (live) View.VISIBLE else View.GONE
            setViewVisibility(R.id.widget_countdown_icon, if (showIcon) View.VISIBLE else View.GONE)
            setViewVisibility(R.id.widget_countdown_timer, liveVisibility)
            setViewVisibility(R.id.widget_countdown_progress, liveVisibility)
            if (next == null || timerText == null) {
                setContentDescription(R.id.widget_countdown_title, title)
            } else {
                if (showIcon) setImageViewBitmap(R.id.widget_countdown_icon, icon)
                setLine(R.id.widget_countdown_timer, timerText, countdownPaint, 51.7f - 2.7f * compactness)
                val color = if (appearance.timeBased) timeColor(remaining) else appearance.color
                val rgb = color.rgb ?: accent
                setImageViewBitmap(R.id.widget_countdown_progress, rings.getOrPut(rgb) { progressRing(progress, rgb) })
                val announcement = listOfNotNull(prayerTitle, shownTime, soon).joinToString(", ")
                setContentDescription(R.id.widget_countdown_title, announcement)
            }
        }

        val nextMinute = next?.let { it.at - ((remaining - 1) / minute) * minute }
        return Render(next?.at, nextMinute, ::views)
    }

    fun update(
        context: Context, manager: AppWidgetManager, ids: IntArray, data: SharedPreferences, render: Render,
    ) {
        for (id in ids) {
            try {
                val options = manager.getAppWidgetOptions(id)
                val hostScale = options.getFloat("hsResizeRatio", 1f).coerceIn(0.5f, 2f)
                val appearance = appearance(data, id)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    @Suppress("DEPRECATION")
                    val sizes = options.getParcelableArrayList<SizeF>(AppWidgetManager.OPTION_APPWIDGET_SIZES)
                    if (!sizes.isNullOrEmpty()) {
                        manager.updateAppWidget(id, RemoteViews(sizes.distinct().associateWith {
                            render.views(it, hostScale, appearance, id)
                        }))
                        continue
                    }
                }
                val landscape = context.resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE
                val widthKey = if (landscape) AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH else AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH
                val heightKey = if (landscape) AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT else AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT
                val size = SizeF(options.getInt(widthKey, 144).toFloat(), options.getInt(heightKey, 56).toFloat())
                manager.updateAppWidget(id, render.views(size, hostScale, appearance, id))
            } catch (error: Exception) {
                Log.e("PrayerCountdown", "Could not render widget $id", error)
            }
        }

        // Prayer transitions may wake the device. Minute updates share one non-waking alarm.
        HomeWidgetScheduler.schedule(context, PrayerCountdownWidget::class.java.name, listOfNotNull(render.nextPrayer))
        // If rendering crossed the prayer boundary, refresh as soon as the alarm can run.
        val visualUpdate = render.nextMinute?.takeIf {
            it != render.nextPrayer || it <= System.currentTimeMillis()
        }
        scheduleVisualUpdate(context, visualUpdate)
    }

    fun cancelVisualUpdate(context: Context) = scheduleVisualUpdate(context, null)

    fun canSchedulePreciseUpdates(context: Context): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.S ||
            context.getSystemService(AlarmManager::class.java)?.canScheduleExactAlarms() == true

    private fun scheduleVisualUpdate(context: Context, at: Long?) {
        val component = ComponentName(context, PrayerCountdownWidget::class.java)
        val intent = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE).setComponent(component)
        val flags = if (at == null) PendingIntent.FLAG_NO_CREATE else PendingIntent.FLAG_UPDATE_CURRENT
        if (at != null) {
            val ids = AppWidgetManager.getInstance(context).getAppWidgetIds(component)
            if (ids.isEmpty()) return
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
        }
        val update = PendingIntent.getBroadcast(context, 0, intent, flags or PendingIntent.FLAG_IMMUTABLE) ?: return
        val alarms = context.getSystemService(AlarmManager::class.java) ?: return
        if (at == null) {
            alarms.cancel(update)
            return
        }
        if (canSchedulePreciseUpdates(context)) {
            try {
                alarms.setExact(AlarmManager.RTC, at, update)
                return
            } catch (error: SecurityException) {
                Log.w("PrayerCountdown", "Exact alarm access changed before scheduling", error)
            }
        }
        alarms.set(AlarmManager.RTC, at, update)
    }

    private fun prayers(rows: List<WidgetPrayer>?, parser: SimpleDateFormat): List<Prayer>? {
        val events = rows.orEmpty().mapNotNull { row ->
            if (row.kind !in prayerTitles || row.time == null) return@mapNotNull null
            val at = parseTime(row.timestamp, parser) ?: return@mapNotNull null
            Prayer(row.kind, at, row.time, row.name)
        }
        if (events.map { it.kind }.toSet() != prayerTitles.keys) return null
        return events.distinctBy { it.kind }.sortedBy { it.at }
    }

    fun timestampParser() = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ROOT).apply {
        isLenient = false
        timeZone = TimeZone.getTimeZone("UTC")
    }

    fun parseTime(timestamp: String?, parser: SimpleDateFormat): Long? {
        if (timestamp == null || !utcTimestamp.matches(timestamp)) return null
        return parser.parse(timestamp.take(23) + "Z", ParsePosition(0))?.time
    }

    private fun remainingText(resources: Resources, remaining: Long): String {
        val minutes = (remaining + minute - 1) / minute
        val hours = minutes / 60
        if (hours == 0L) return resources.getString(R.string.widget_countdown_minutes, minutes)
        return resources.getString(R.string.widget_countdown_hours_compact, hours, minutes % 60)
    }

    fun timeColor(remaining: Long): CountdownRingColor = when {
        remaining <= 5 * minute -> CountdownRingColor.RED
        remaining <= 15 * minute -> CountdownRingColor.AMBER
        else -> CountdownRingColor.BLUE
    }

    fun progressRing(progress: Float, color: Int, diameter: Int = 200): Bitmap {
        val bitmap = Bitmap.createBitmap(diameter, diameter, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = diameter * .24f
            strokeCap = Paint.Cap.BUTT
            this.color = color
            alpha = 64
        }
        val center = diameter / 2f
        val inset = paint.strokeWidth / 2f
        canvas.drawCircle(center, center, center - inset, paint)
        if (progress > 0f) {
            paint.alpha = 255
            canvas.drawArc(inset, inset, diameter - inset, diameter - inset, -90f, 360f * progress, false, paint)
        }
        return bitmap
    }
}
