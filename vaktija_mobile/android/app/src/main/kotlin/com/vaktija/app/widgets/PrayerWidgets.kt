package com.vaktija.app.widgets

import android.app.AlarmManager
import android.appwidget.AppWidgetManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.res.ColorStateList
import android.content.res.Configuration
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.Typeface
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import android.util.Log
import android.util.SizeF
import android.util.TypedValue
import android.view.View
import android.widget.RemoteViews
import androidx.core.util.TypedValueCompat
import androidx.glance.text.TextAlign
import androidx.work.WorkManager
import com.vaktija.app.MainActivity
import com.vaktija.app.R
import es.antonborri.home_widget.HomeWidgetBackgroundIntent
import es.antonborri.home_widget.HomeWidgetFonts
import es.antonborri.home_widget.HomeWidgetLaunchIntent
import es.antonborri.home_widget.HomeWidgetPlugin
import es.antonborri.home_widget.HomeWidgetProvider
import es.antonborri.home_widget.HomeWidgetScheduler
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import java.util.TimeZone
import kotlin.math.ceil
import kotlin.math.max
import kotlin.math.roundToInt
import org.json.JSONObject

class PrayerListWidget : PrayerWidgetProvider(PrayerWidgetLayout.LIST)
class PrayerGridWidget : PrayerWidgetProvider(PrayerWidgetLayout.GRID)
class PrayerCountdownWidget : PrayerWidgetProvider(PrayerWidgetLayout.COUNTDOWN) {
    override fun onDisabled(context: Context) {
        super.onDisabled(context)
        PrayerCountdown.cancelVisualUpdate(context)
    }
}

internal enum class PrayerWidgetLayout { LIST, GRID, COUNTDOWN }

abstract class PrayerWidgetProvider internal constructor(
    private val layout: PrayerWidgetLayout,
) : HomeWidgetProvider() {
    override fun onEnabled(context: Context) {
        super.onEnabled(context)
        requestPrayerWidgetRefresh(context)
    }

    override fun onUpdate(
        context: Context,
        manager: AppWidgetManager,
        ids: IntArray,
        data: SharedPreferences,
    ) {
        PrayerWidgetRenderer.update(context, manager, ids, layout, data)
    }

    override fun onAppWidgetOptionsChanged(
        context: Context,
        manager: AppWidgetManager,
        id: Int,
        options: Bundle,
    ) {
        PrayerWidgetRenderer.update(context, manager, intArrayOf(id), layout, HomeWidgetPlugin.getData(context))
    }

    override fun onRestored(context: Context, oldIds: IntArray, newIds: IntArray) {
        val data = HomeWidgetPlugin.getData(context)
        val editor = data.edit()
        for (id in oldIds) PrayerCountdown.removeAppearance(editor, id)
        for ((oldId, newId) in oldIds.zip(newIds)) {
            PrayerCountdown.writeAppearance(editor, newId, PrayerCountdown.appearance(data, oldId))
        }
        editor.apply()
        super.onRestored(context, oldIds, newIds)
        requestPrayerWidgetRefresh(context)
    }

    override fun onDeleted(context: Context, appWidgetIds: IntArray) {
        super.onDeleted(context, appWidgetIds)
        val editor = HomeWidgetPlugin.getData(context).edit()
        for (id in appWidgetIds) PrayerCountdown.removeAppearance(editor, id)
        editor.apply()
    }

    override fun onDisabled(context: Context) {
        super.onDisabled(context)
        HomeWidgetScheduler.cancel(context, javaClass.name)
        if (prayerWidgetProviders.keys.all { widgetIds(context, it).isEmpty() }) {
            WorkManager.getInstance(context).cancelAllWorkByTag("vaktija.widgets")
        }
    }
}

class PrayerWidgetRecovery : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == AlarmManager.ACTION_SCHEDULE_EXACT_ALARM_PERMISSION_STATE_CHANGED) {
            if (PrayerCountdown.canSchedulePreciseUpdates(context)) {
                PrayerWidgetRenderer.refreshInstalled(context)
            }
            return
        }
        if (intent.action !in listOf(
                Intent.ACTION_BOOT_COMPLETED,
                Intent.ACTION_MY_PACKAGE_REPLACED,
                Intent.ACTION_TIME_CHANGED,
                Intent.ACTION_TIMEZONE_CHANGED,
            )) return
        PrayerWidgetRenderer.refreshInstalled(context)
        requestPrayerWidgetRefresh(context)
    }
}

private val prayerWidgetProviders = mapOf(
    PrayerListWidget::class.java to PrayerWidgetLayout.LIST,
    PrayerGridWidget::class.java to PrayerWidgetLayout.GRID,
    PrayerCountdownWidget::class.java to PrayerWidgetLayout.COUNTDOWN,
)

private fun widgetIds(context: Context, provider: Class<*>) =
    AppWidgetManager.getInstance(context).getAppWidgetIds(ComponentName(context, provider))

private fun requestPrayerWidgetRefresh(context: Context) {
    if (HomeWidgetPlugin.getDispatcherHandle(context) == 0L) return
    if (prayerWidgetProviders.keys.all { widgetIds(context, it).isEmpty() }) return
    try {
        HomeWidgetBackgroundIntent.getBroadcast(context, Uri.parse("vaktija://widgets/sync")).send()
    } catch (error: Exception) {
        Log.e("PrayerWidgets", "Could not enqueue widget maintenance", error)
    }
}

internal data class WidgetSettings(val key: String, val city: String, val bosnian: Boolean, val ready: Boolean)
internal data class WidgetPrayer(
    val kind: String, val name: String, val time: String?, val nextDay: Boolean, val eventDate: String,
    val timestamp: String?,
)
private data class WidgetDay(
    val day: String, val weekday: String, val date: String, val shortDate: String,
    val rows: List<WidgetPrayer>, val complete: Boolean, val previousIsha: String,
)

internal object PrayerWidgetRenderer {
    private const val tag = "PrayerWidgets"
    private const val configurationKey = "vaktija.widgets.configuration"
    private const val headerHorizontalInsets = 13f + 13f + 8f
    private const val headerVerticalInsets = 5f + 5f + 1f
    private const val logoHeightRatio = 0.8f
    // Crop the transparent margins in widget_logo.png before sizing the mark.
    private val logoBounds = Rect(35, 15, 122, 112)
    private val zone = TimeZone.getTimeZone("Europe/Sarajevo")
    private val datePattern = Regex("\\d{4}-\\d{2}-\\d{2}")
    private val timePattern = Regex("(?:[01]\\d|2[0-3]):[0-5]\\d")
    private val kinds = listOf("fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "midnight", "lastthird")
    private val icons = listOf(R.drawable.widget_fajr, R.drawable.widget_sunrise, R.drawable.widget_dhuhr,
        R.drawable.widget_asr, R.drawable.widget_maghrib, R.drawable.widget_isha,
        R.drawable.widget_midnight, R.drawable.widget_lastthird)
    private data class Header(
        val city: Bitmap, val date: Bitmap, val height: Float, val logo: Bitmap? = null,
        val weekday: Bitmap? = null, val month: Bitmap? = null, val year: Bitmap? = null,
        val settings: Boolean = false,
    )

    private data class Body(
        val dense: Boolean, val showIcon: Boolean, val nameWidth: Float, val rows: List<WidgetPrayer>,
        val nameLines: Int = Int.MAX_VALUE,
    )

    fun refreshInstalled(context: Context) {
        val manager = AppWidgetManager.getInstance(context)
        val data = HomeWidgetPlugin.getData(context)
        for ((provider, layout) in prayerWidgetProviders) {
            update(context, manager, widgetIds(context, provider), layout, data)
        }
    }

    fun update(
        context: Context, manager: AppWidgetManager, ids: IntArray, layout: PrayerWidgetLayout,
        data: SharedPreferences,
    ) {
        if (ids.isEmpty()) return
        val now = System.currentTimeMillis()
        val settings = readSettings(data)
        val today = dayKey(0, now)
        val current = settings?.let { readDay(data, it, today) }
        if (layout == PrayerWidgetLayout.COUNTDOWN) {
            PrayerCountdown.update(
                context, manager, ids, data, prepareCountdown(context, data, settings, now, current),
            )
            prune(data)
            return
        }
        val day = current ?: settings?.let { active ->
            (1..7).firstNotNullOfOrNull { readDay(data, active, dayKey(-it)) }
        }
        for (id in ids) updateTimetable(context, manager, id, layout == PrayerWidgetLayout.GRID, settings, day, today, data)
        scheduleTimetableUpdates(context, layout, settings, data, now)
        prune(data)
    }

    private fun scheduleTimetableUpdates(
        context: Context, layout: PrayerWidgetLayout, settings: WidgetSettings?, data: SharedPreferences, now: Long,
    ) {
        val provider = if (layout == PrayerWidgetLayout.GRID) PrayerGridWidget::class.java else PrayerListWidget::class.java
        val active = widgetIds(context, provider).map { PrayerCountdown.appearance(data, it) }.filter { it.highlightNext }
        val includeNight = active.any { it.includeNightTimes }
        val parser = PrayerCountdown.timestampParser()
        val midnight = Calendar.getInstance(zone).apply {
            timeInMillis = now
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        val updates = (1..8).map {
            (midnight.clone() as Calendar).apply { add(Calendar.DATE, it) }.timeInMillis
        }.toMutableList()
        if (settings != null && active.isNotEmpty()) {
            for (offset in 0..7) {
                val rows = readDay(data, settings, dayKey(offset, now))?.rows.orEmpty()
                for (row in rows) {
                    if (row.time == null || row.kind == "sunrise" ||
                        !includeNight && row.kind in listOf("midnight", "lastthird")) continue
                    PrayerCountdown.parseTime(row.timestamp, parser)?.takeIf { it > now }?.let(updates::add)
                }
            }
        }
        HomeWidgetScheduler.schedule(context, provider.name, updates)
    }

    internal fun nextHighlightedPrayer(rows: List<WidgetPrayer>, now: Long): WidgetPrayer? {
        val parser = PrayerCountdown.timestampParser()
        return rows.filter { it.time != null && it.kind != "sunrise" }.mapNotNull { row ->
            PrayerCountdown.parseTime(row.timestamp, parser)?.takeIf { it > now }?.let { row to it }
        }.minByOrNull { it.second }?.first
    }

    fun nextTimetablePreviewUpdate(data: SharedPreferences, appearance: CountdownAppearance): Long {
        val now = System.currentTimeMillis()
        val midnight = Calendar.getInstance(zone).apply {
            timeInMillis = now
            add(Calendar.DATE, 1)
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
        if (!appearance.highlightNext) return midnight
        val settings = readSettings(data) ?: return midnight
        val rows = readDay(data, settings, dayKey(0, now))?.rows.orEmpty().filter {
            appearance.includeNightTimes || it.kind != "midnight" && it.kind != "lastthird"
        }
        val next = nextHighlightedPrayer(rows, now) ?: return midnight
        return minOf(midnight, PrayerCountdown.parseTime(next.timestamp, PrayerCountdown.timestampParser()) ?: midnight)
    }

    fun countdownContext(context: Context, data: SharedPreferences): Context =
        PrayerCountdown.localizedContext(context, readSettings(data))

    fun countdownPreview(context: Context, data: SharedPreferences): PrayerCountdown.Render {
        val now = System.currentTimeMillis()
        val settings = readSettings(data)
        val current = settings?.let { readDay(data, it, dayKey(0, now)) }
        return prepareCountdown(context, data, settings, now, current)
    }

    fun timetablePreview(
        context: Context, data: SharedPreferences, id: Int, size: SizeF, hostScale: Float,
        grid: Boolean, appearance: CountdownAppearance,
    ): RemoteViews {
        val settings = readSettings(data)
        val today = dayKey(0)
        val day = settings?.let { active ->
            (0..7).firstNotNullOfOrNull { readDay(data, active, dayKey(-it)) }
        }
        return render(context, size, grid, settings, day, today, data, id, hostScale, appearance, preview = true)
    }

    private fun prepareCountdown(
        context: Context, data: SharedPreferences, settings: WidgetSettings?, now: Long, current: WidgetDay?,
    ): PrayerCountdown.Render {
        val previous = settings?.let { readDay(data, it, dayKey(-1, now)) }
        val tomorrow = settings?.let { readDay(data, it, dayKey(1, now)) }
        return PrayerCountdown.prepare(
            context, settings, now, previous?.rows, current?.rows, tomorrow?.rows, current?.previousIsha,
            prayerIcon = { kind -> icons[kinds.indexOf(kind)] },
        )
    }

    private fun updateTimetable(
        context: Context, manager: AppWidgetManager, id: Int, grid: Boolean,
        settings: WidgetSettings?, day: WidgetDay?, today: String, data: SharedPreferences,
    ) {
        val options = manager.getAppWidgetOptions(id)
        val hostScale = options.getFloat("hsResizeRatio", 1f).coerceIn(0.5f, 2f)
        val appearance = PrayerCountdown.appearance(data, id)
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                @Suppress("DEPRECATION")
                val sizes = options.getParcelableArrayList<SizeF>(AppWidgetManager.OPTION_APPWIDGET_SIZES)
                if (!sizes.isNullOrEmpty()) {
                    val views = sizes.distinct().associateWith { size ->
                        render(context, size, grid, settings, day, today, data, id, hostScale, appearance)
                    }
                    manager.updateAppWidget(id, RemoteViews(views))
                    return
                }
            }
            val portrait = context.resources.configuration.orientation != android.content.res.Configuration.ORIENTATION_LANDSCAPE
            val widthKey = if (portrait) AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH else AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH
            val heightKey = if (portrait) AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT else AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT
            val size = SizeF(options.getInt(widthKey, 344).toFloat(), options.getInt(heightKey, if (grid) 322 else 366).toFloat())
            manager.updateAppWidget(id, render(context, size, grid, settings, day, today, data, id, hostScale, appearance))
        } catch (error: Exception) {
            Log.e(tag, "Could not render widget $id", error)
        }
    }

    private fun render(
        context: Context,
        size: SizeF,
        grid: Boolean,
        settings: WidgetSettings?,
        day: WidgetDay?,
        today: String,
        data: SharedPreferences,
        id: Int,
        hostScale: Float,
        appearance: CountdownAppearance,
        preview: Boolean = false,
    ): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.prayer_widget_list)
        val locale = if (settings?.bosnian != false) Locale.forLanguageTag("bs") else Locale.ENGLISH
        val bosnian = settings?.bosnian != false
        val width = size.width.coerceIn(140f, 1000f)
        val city = settings?.city ?: "Vaktija"
        val displayedDay = day?.day ?: today
        val calendar = Calendar.getInstance(zone, locale).apply {
            set(displayedDay.take(4).toInt(), displayedDay.substring(5, 7).toInt() - 1, displayedDay.takeLast(2).toInt())
        }
        val weekday = day?.weekday ?: SimpleDateFormat("EEEE", locale).apply { timeZone = zone }.format(calendar.time)
            .replaceFirstChar { it.titlecase(locale) }
        val date = day?.shortDate ?: SimpleDateFormat("dd.MM.yyyy.", locale)
            .apply { timeZone = zone }.format(calendar.time)
        val shortStaleStatus = day != null && day.day != today && width < 240f
        var status = when {
            settings?.ready != true -> if (bosnian) "Dodirnite za postavljanje vaktije" else "Tap to set up Vaktija"
            shortStaleStatus -> if (bosnian) "Prethodni datum" else "Previous date"
            day != null && day.day != today -> if (bosnian) "Podaci za prethodni datum · Otvorite aplikaciju" else "Previous date's times · Open the app"
            day != null && !day.complete -> if (bosnian) "Neka vremena nisu dostupna" else "Some times are unavailable"
            day == null && data.getBoolean("vaktija.widgets.failure.${settings.key}.$today", false) ->
                if (bosnian) "Vremena nisu dostupna · Otvorite aplikaciju" else "Times unavailable · Open the app"
            day == null -> if (bosnian) "Učitavanje vaktije…" else "Loading prayer times…"
            else -> ""
        }
        val statusSize = if (shortStaleStatus) 11f else 12f
        val statusTop = if (shortStaleStatus) 2f else 6f
        val statusHeight = if (status.isEmpty()) 0f else textHeight(context, status, statusSize, width - 26f, includePad = true) + statusTop
        val rows = day?.rows.orEmpty().filter {
            appearance.includeNightTimes || it.kind != "midnight" && it.kind != "lastthird"
        }
        val compact = compactHeader(context, width, city, date, displayedDay)
        val compactBody = fitBody(context, width, size.height - compact.height, statusHeight, grid, rows, appearance.showPrayerIcon)
        val (originalHeader, originalBody) = calendarHeader(context, width, city, weekday, calendar, locale, appearance.showAppLogo)?.let { calendarHeader ->
            val body = fitBody(context, width, size.height - calendarHeader.height, statusHeight, grid, rows, appearance.showPrayerIcon)
            (calendarHeader to body).takeIf {
                size.height >= calendarHeader.height + statusHeight &&
                    (day == null || body.rows.isNotEmpty() && body.rows.size >= compactBody.rows.size && body.nameLines >= compactBody.nameLines)
            }
        } ?: (compact to compactBody)

        val settingsWidth = 48f / hostScale
        val withSettings = if (width * hostScale >= 240f) {
            calendarHeader(context, width - settingsWidth, city, weekday, calendar, locale, appearance.showAppLogo)?.let {
                val header = it.copy(height = max(it.height, settingsWidth + headerVerticalInsets), settings = true)
                val body = fitBody(context, width, size.height - header.height, statusHeight, grid, rows, appearance.showPrayerIcon)
                (header to body).takeIf {
                    size.height >= header.height + statusHeight &&
                        body.rows.size >= originalBody.rows.size && body.nameLines >= originalBody.nameLines
                }
            }
        } else null
        val (header, body) = withSettings ?: (originalHeader to originalBody)
        views.setViewVisibility(R.id.widget_settings, if (header.settings) View.VISIBLE else View.GONE)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            views.setViewLayoutWidth(R.id.widget_settings, settingsWidth, TypedValue.COMPLEX_UNIT_DIP)
            views.setViewLayoutHeight(R.id.widget_settings, settingsWidth, TypedValue.COMPLEX_UNIT_DIP)
            views.setViewLayoutWidth(R.id.widget_settings_gear, 26f / hostScale, TypedValue.COMPLEX_UNIT_DIP)
            views.setViewLayoutHeight(R.id.widget_settings_gear, 26f / hostScale, TypedValue.COMPLEX_UNIT_DIP)
            val gearPadding = dp(context, 5f / hostScale)
            views.setViewPadding(R.id.widget_settings_gear, gearPadding, gearPadding, gearPadding, gearPadding)
        }
        val night = appearance.theme == CountdownTheme.DARK ||
            appearance.theme == CountdownTheme.SYSTEM &&
            context.applicationContext.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK == Configuration.UI_MODE_NIGHT_YES
        views.setInt(R.id.widget_background, "setBackgroundResource",
            if (night) R.drawable.widget_list_panel else R.drawable.widget_list_panel_light)
        views.setInt(R.id.widget_settings_gear, "setBackgroundResource",
            if (night) R.drawable.widget_countdown_gear_background else R.drawable.widget_countdown_gear_background_light)
        views.setFloat(R.id.widget_background, "setAlpha", appearance.opacity / 255f)
        tint(context, views, R.id.widget_background, "setBackgroundTintList", appearance.theme, preview, 0xFFF7F7FC.toInt(), 0xFF000000.toInt())
        for (viewId in listOf(R.id.widget_logo, R.id.widget_city, R.id.widget_date, R.id.widget_weekday, R.id.widget_calendar_month,
                R.id.widget_calendar_year, R.id.widget_settings_gear)) {
            tint(context, views, viewId, "setColorFilter", appearance.theme, preview, 0xFF1E2028.toInt(), 0xFFFCFCFF.toInt())
        }
        tint(context, views, R.id.widget_settings_gear, "setBackgroundTintList", appearance.theme, preview, 0xFF1E2028.toInt(), 0xFFFCFCFF.toInt())
        tint(context, views, R.id.widget_status, "setTextColor", appearance.theme, preview, 0xFF1E2028.toInt(), 0xFFFCFCFF.toInt())
        tint(context, views, R.id.widget_header_divider, "setBackgroundColor", appearance.theme, preview, 0x331E2028, 0x33FFFFFF)
        if (header.settings && !preview) {
            views.setOnClickPendingIntent(R.id.widget_settings, CountdownSettingsActivity.intent(context, id, size, hostScale))
            views.setContentDescription(R.id.widget_settings,
                PrayerCountdown.localizedContext(context, settings).getString(R.string.widget_countdown_settings))
        }
        views.setImageViewBitmap(R.id.widget_city, header.city)
        views.setImageViewBitmap(R.id.widget_date, header.date)
        views.setImageViewBitmap(R.id.widget_weekday, header.weekday)
        views.setImageViewBitmap(R.id.widget_calendar_month, header.month)
        views.setImageViewBitmap(R.id.widget_calendar_year, header.year)
        views.setViewVisibility(R.id.widget_weekday, if (header.weekday != null) View.VISIBLE else View.GONE)
        views.setViewVisibility(R.id.widget_calendar_details, if (header.month != null) View.VISIBLE else View.GONE)
        views.setViewVisibility(R.id.widget_logo, if (header.logo != null) View.VISIBLE else View.GONE)
        views.setImageViewBitmap(R.id.widget_logo, header.logo)
        views.setContentDescription(R.id.widget_root, "$city, $weekday, $date")
        if (!preview) {
            views.setOnClickPendingIntent(R.id.widget_root,
                HomeWidgetLaunchIntent.getActivity(context, MainActivity::class.java, Uri.parse("vaktija://widgets/prayers")))
        }
        views.removeAllViews(R.id.widget_rows)

        val (dense, showIcon, nameWidth, visible, nameLines) = body
        val highlighted = if (appearance.highlightNext && day?.day == today) {
            nextHighlightedPrayer(visible, System.currentTimeMillis())
        } else null
        val highlightLabel = PrayerCountdown.localizedContext(context, settings).getString(R.string.widget_timetable_next_label)
        views.setViewPadding(R.id.widget_rows, dp(context, 13f), dp(context, if (dense) 2f else 5f), dp(context, 13f), dp(context, if (dense) 6f else 11f))
        if (day != null && visible.isEmpty()) {
            status = if (bosnian) "Povećajte widget za prikaz vremena" else "Enlarge the widget to show times"
        } else if (grid) {
            val pairs = visible.chunked(2)
            for ((index, pair) in pairs.withIndex()) {
                val row = RemoteViews(context.packageName, R.layout.prayer_widget_grid_row)
                row.addView(R.id.widget_grid_left, prayerView(
                    context, pair[0], true, nameWidth, dense, showIcon, nameLines, appearance.theme, preview,
                    highlightLabel.takeIf { pair[0] == highlighted }, appearance.highlightColor,
                ))
                pair.getOrNull(1)?.let { prayer ->
                    row.addView(R.id.widget_grid_right, prayerView(
                        context, prayer, true, nameWidth, dense, showIcon, nameLines, appearance.theme, preview,
                        highlightLabel.takeIf { prayer == highlighted }, appearance.highlightColor,
                    ))
                }
                for (viewId in listOf(R.id.widget_grid_divider, R.id.widget_grid_column_divider)) {
                    tint(context, row, viewId, "setBackgroundColor", appearance.theme, preview, 0x331E2028, 0x33FFFFFF)
                }
                row.setViewVisibility(R.id.widget_grid_divider, if (index == pairs.lastIndex) View.GONE else View.VISIBLE)
                row.setViewVisibility(R.id.widget_grid_column_divider, if (pair.size == 2) View.VISIBLE else View.GONE)
                views.addView(R.id.widget_rows, row)
            }
        } else {
            for ((index, prayer) in visible.withIndex()) {
                val row = prayerView(context, prayer, false, nameWidth, dense, showIcon, nameLines,
                    theme = appearance.theme, preview = preview, highlightLabel = highlightLabel.takeIf { prayer == highlighted },
                    highlightColor = appearance.highlightColor)
                row.setViewVisibility(R.id.widget_list_divider, if (index == visible.lastIndex) View.GONE else View.VISIBLE)
                views.addView(R.id.widget_rows, row)
            }
        }
        if (day != null) Log.d(tag, "Widget ${if (grid) "grid" else "list"} ${day.day} ${settings?.key} ${size.width}x${size.height} rows=${visible.size}")
        views.setTextViewText(R.id.widget_status, status)
        views.setTextViewTextSize(R.id.widget_status, TypedValue.COMPLEX_UNIT_SP, statusSize)
        views.setViewPadding(R.id.widget_status, dp(context, 13f), dp(context, statusTop), dp(context, 13f), 0)
        views.setViewVisibility(R.id.widget_status, if (status.isEmpty()) View.GONE else View.VISIBLE)
        return views
    }

    private fun calendarHeader(
        context: Context, width: Float, city: String, weekday: String, calendar: Calendar, locale: Locale,
        showLogo: Boolean,
    ): Header? {
        val density = context.resources.displayMetrics.density
        val contentWidth = width - headerHorizontalInsets
        val monthLabel = SimpleDateFormat("MMM", locale).apply { timeZone = zone }.format(calendar.time)
            .trimEnd('.').uppercase(locale)
        val date = textBitmap(context, calendar.get(Calendar.DAY_OF_MONTH).toString(), 29f, contentWidth, fill = false, weight = 700)
        val month = textBitmap(context, monthLabel, 12f, contentWidth, fill = false)
        val year = textBitmap(context, calendar.get(Calendar.YEAR).toString(), 12f, contentWidth, fill = false)
        val dateWidth = (date.width + max(month.width, year.width) + dp(context, 6f)) / density
        val leftWidth = max(measure(context, city, 17f), measure(context, weekday, 12f)) + 2f
        val spareWidth = contentWidth - dateWidth - leftWidth
        if (spareWidth < 0f) return null

        val cityImage = textBitmap(context, city, 17f, leftWidth, fill = false)
        val weekdayImage = textBitmap(context, weekday, 12f, leftWidth, fill = false)
        val cityStackHeight = cityImage.height + weekdayImage.height
        val logoHeight = cityStackHeight * logoHeightRatio / density
        val logoWidth = logoHeight * logoBounds.width() / logoBounds.height()
        val logo = if (showLogo && spareWidth >= logoWidth + 7f) {
            image(context, R.drawable.widget_logo, logoWidth, logoHeight, logoBounds)
        } else null
        val textHeight = max(cityStackHeight, max(date.height, month.height + year.height)) / density
        return Header(cityImage, date, ceil(textHeight) + headerVerticalInsets, logo, weekdayImage, month, year)
    }

    private fun compactHeader(context: Context, width: Float, city: String, date: String, displayedDay: String): Header {
        val density = context.resources.displayMetrics.density
        val contentWidth = width - headerHorizontalInsets
        val cityWidth = measure(context, city, 14f) + 2f
        val dateWidth = measure(context, date, 11f) + 2f
        val showFullDate = cityWidth + dateWidth <= contentWidth
        val dateLabel = if (showFullDate) date
            else "${displayedDay.takeLast(2)}.${displayedDay.substring(5, 7)}."
        val dateImage = textBitmap(context, dateLabel, 11f, if (showFullDate) dateWidth else contentWidth / 2f, fill = false)
        val cityImage = textBitmap(context, city, 14f, contentWidth - dateImage.width / density, fill = false)
        val height = ceil(max(cityImage.height, dateImage.height) / density) + headerVerticalInsets
        return Header(cityImage, dateImage, height)
    }

    private fun fitBody(
        context: Context, width: Float, height: Float, statusHeight: Float, grid: Boolean, rows: List<WidgetPrayer>,
        showPictures: Boolean,
    ): Body {
        val dense = if (grid) width < 300f || height - 16f < 3 * 64f
            else width < 240f || height - 16f < 6 * 39f
        val showIcon = showPictures && (if (grid) width >= 300f else !dense)
        val nameSize = if (grid) { if (dense) 12f else 13f } else if (dense) 14f else 16f
        val timeSize = if (dense) 16f else 21f
        val minimumTimeWidth = measure(context, "23:59", timeSize, 700) + 2f
        val nameWidth = if (grid) (width - 27f) / 2f - 16f - (if (showIcon) 33f else 0f)
            else width - 39f - (if (showIcon) 36f else 0f) - minimumTimeWidth
        val blank = Body(dense, showIcon, nameWidth, emptyList())
        if (rows.isEmpty() || nameWidth < 30f || (grid && nameWidth < minimumTimeWidth)) return blank

        val timeHeight = textHeight(context, "23:59", timeSize, minimumTimeWidth, 700, includePad = true)
        fun rowHeight(nameHeight: Float): Float = when {
            grid && dense -> max(36f, nameHeight + timeHeight)
            grid -> max(40f, nameHeight + timeHeight + 8f)
            dense -> max(26f, max(nameHeight, timeHeight) + 1f)
            else -> max(39f, max(nameHeight, timeHeight) + 11f)
        }
        val heights = rows.associateWith { rowHeight(textHeight(context, it.name, nameSize, nameWidth, 400, includePad = true)) }
        val availableHeight = height - statusHeight - if (dense) 8f else 16f
        fun fits(entries: List<WidgetPrayer>, rowHeight: Float): Boolean {
            val rowCount = if (grid) ceil(entries.size / 2f) else entries.size.toFloat()
            return entries.isNotEmpty() && availableHeight >= rowCount * (rowHeight + if (grid) 1f else 0f)
        }

        if (fits(rows, heights.values.max())) return blank.copy(rows = rows)
        val primaryRows = rows.filter { it.kind != "midnight" && it.kind != "lastthird" }
        if (fits(primaryRows, primaryRows.maxOfOrNull { heights.getValue(it) } ?: 0f)) return blank.copy(rows = primaryRows)

        // A narrow tile can give the time a full line even when its name has to be ellipsized.
        val oneLineHeight = textHeight(context, "Ag", nameSize, nameWidth, 400, includePad = true)
        return if (dense && fits(primaryRows, rowHeight(oneLineHeight))) blank.copy(rows = primaryRows, nameLines = 1) else blank
    }

    private fun prayerView(
        context: Context, prayer: WidgetPrayer, grid: Boolean, nameWidth: Float, dense: Boolean,
        showIcon: Boolean, nameLines: Int, theme: CountdownTheme, preview: Boolean,
        highlightLabel: String?, highlightColor: CountdownRingColor,
    ): RemoteViews {
        val views = RemoteViews(context.packageName, if (grid) R.layout.prayer_widget_tile else R.layout.prayer_widget_list_row)
        val panelId = if (grid) R.id.widget_prayer_row else R.id.widget_prayer_content
        views.setInt(panelId, "setBackgroundResource", if (highlightLabel != null) R.drawable.widget_next_prayer_highlight else 0)
        if (highlightLabel != null) {
            val light = highlightColor.highlightTint(context, dark = false)
            val dark = highlightColor.highlightTint(context, dark = true)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                tint(context, views, panelId, "setBackgroundTintList", theme, preview, light, dark)
            } else {
                val night = context.applicationContext.resources.configuration.uiMode and
                    Configuration.UI_MODE_NIGHT_MASK == Configuration.UI_MODE_NIGHT_YES
                val color = if (theme == CountdownTheme.DARK || theme == CountdownTheme.SYSTEM && night) dark else light
                views.setInt(panelId, "setBackgroundColor", (color and 0x00FFFFFF) or 0x33000000)
            }
        }
        val index = kinds.indexOf(prayer.kind)
        views.setViewVisibility(R.id.widget_prayer_icon, if (showIcon) View.VISIBLE else View.GONE)
        if (dense) {
            if (grid) views.setViewPadding(R.id.widget_prayer_row, dp(context, 8f), 0, dp(context, 8f), 0)
            else views.setViewPadding(R.id.widget_prayer_content, 0, 0, 0, 0)
        }
        if (showIcon) {
            views.setImageViewBitmap(R.id.widget_prayer_icon, image(context, icons[index], 26f, 27f))
        }
        val nameSize = if (grid) { if (dense) 12f else 13f } else if (dense) 14f else 16f
        val timeSize = if (dense) 16f else 21f
        views.setImageViewBitmap(R.id.widget_prayer_name, textBitmap(context, prayer.name, nameSize, nameWidth,
            maxLines = nameLines, weight = 400))
        views.setImageViewBitmap(R.id.widget_prayer_time, textBitmap(context, prayer.time ?: "—", timeSize,
            measure(context, "23:59", timeSize, 700) + 2f,
            end = !grid, fill = false, weight = 700))
        views.setContentDescription(R.id.widget_prayer_row,
            listOfNotNull(prayer.name, prayer.time ?: "—", prayer.eventDate, highlightLabel).joinToString(", "))
        for (viewId in listOf(R.id.widget_prayer_name, R.id.widget_prayer_time)) {
            tint(context, views, viewId, "setColorFilter", theme, preview, 0xFF1E2028.toInt(), 0xFFFCFCFF.toInt())
        }
        if (!grid) tint(context, views, R.id.widget_list_divider, "setBackgroundColor", theme, preview, 0x331E2028, 0x33FFFFFF)
        return views
    }

    private fun tint(
        context: Context, views: RemoteViews, id: Int, method: String, theme: CountdownTheme,
        preview: Boolean, light: Int, dark: Int,
    ) {
        val night = context.applicationContext.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK == Configuration.UI_MODE_NIGHT_YES
        val fixed = if (theme == CountdownTheme.DARK || theme == CountdownTheme.SYSTEM && night) dark else light
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val adaptive = theme == CountdownTheme.SYSTEM && !preview
            val dayColor = if (adaptive) light else fixed
            val nightColor = if (adaptive) dark else fixed
            if (method == "setBackgroundTintList") {
                views.setColorStateList(id, method, ColorStateList.valueOf(dayColor), ColorStateList.valueOf(nightColor))
            } else views.setColorInt(id, method, dayColor, nightColor)
        } else if (method != "setBackgroundTintList") {
            views.setInt(id, method, fixed)
        }
    }

    private fun dp(context: Context, value: Float): Int =
        (value * context.resources.displayMetrics.density).roundToInt()

    private fun typeface(context: Context, weight: Int = 600): Typeface? =
        HomeWidgetFonts.typeface(context, "Vaktija Sans", weight, false)

    private fun paint(context: Context, size: Float, weight: Int = 600) = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
        typeface = typeface(context, weight)
        textSize = TypedValueCompat.spToPx(size, context.resources.displayMetrics)
    }

    private fun measure(context: Context, text: String, size: Float, weight: Int = 600): Float =
        paint(context, size, weight).measureText(text) / context.resources.displayMetrics.density

    private fun textHeight(context: Context, text: String, size: Float, width: Float, weight: Int = 600, includePad: Boolean = false): Float {
        val metrics = context.resources.displayMetrics
        val layout = StaticLayout.Builder.obtain(text, 0, text.length, paint(context, size, weight), max(1, (width * metrics.density).toInt()))
            .setIncludePad(includePad).setAlignment(Layout.Alignment.ALIGN_NORMAL).build()
        return ceil(layout.height / metrics.density)
    }

    private fun textBitmap(
        context: Context,
        text: String,
        size: Float,
        width: Float,
        end: Boolean = false,
        maxLines: Int = 1,
        fill: Boolean = true,
        weight: Int = 600,
    ): Bitmap = HomeWidgetFonts.textBitmap(context, typeface(context, weight), text,
        fontSizeSp = size, maxWidthDp = width.coerceAtLeast(1f), maxLines = maxLines,
        textAlign = if (end) TextAlign.End else TextAlign.Start, fillWidth = fill)

    private fun image(context: Context, resource: Int, width: Float, height: Float, sourceBounds: Rect? = null): Bitmap {
        val density = context.resources.displayMetrics.density
        val source = BitmapFactory.decodeResource(context.resources, resource)
        val target = Bitmap.createBitmap(max(1, (width * density).roundToInt()), max(1, (height * density).roundToInt()), Bitmap.Config.ARGB_8888)
        target.density = context.resources.displayMetrics.densityDpi
        Canvas(target).drawBitmap(source, sourceBounds,
            Rect(0, 0, target.width, target.height), Paint(Paint.ANTI_ALIAS_FLAG or Paint.FILTER_BITMAP_FLAG))
        return target
    }

    private fun readSettings(data: SharedPreferences): WidgetSettings? {
        return try {
            val raw = data.getString(configurationKey, null) ?: return null
            if (raw.length > 4096) return null
            val json = JSONObject(raw)
            val method = if (json.isNull("method")) "setup" else json.getString("method")
            val language = json.getString("language")
            val city = json.getInt("city")
            val key = "$city.$method.$language"
            require(json.getInt("version") == 1 && json.getString("timezone") == "Europe/Sarajevo")
            require(method in listOf("angle", "iz", "setup") && language in listOf("bs", "en"))
            require(city >= 0 && json.getString("key") == key)
            val name = json.getString("cityName")
            require(name.isNotBlank() && name.length <= 100)
            WidgetSettings(key, name, language == "bs", method != "setup")
        } catch (error: Exception) {
            Log.w(tag, "Invalid widget configuration", error)
            null
        }
    }

    private fun readDay(data: SharedPreferences, settings: WidgetSettings, day: String): WidgetDay? {
        return try {
            val raw = data.getString("vaktija.widgets.day.${settings.key}.$day", null) ?: return null
            if (raw.length > 32768) return null
            val json = JSONObject(raw)
            require(json.getInt("version") == 1 && json.getString("configuration") == settings.key)
            require(datePattern.matches(day) && json.getString("day") == day)
            val values = json.optJSONArray("calendarRows") ?: return null
            require(values.length() in 6..10)
            val rows = (0 until values.length()).map { index ->
                val row = values.getJSONObject(index)
                val kind = row.getString("kind")
                val name = row.getString("name")
                val time = if (row.isNull("time")) null else row.getString("time")
                val nextDay = row.getBoolean("nextDay")
                require(kind in kinds && name.isNotBlank() && name.length <= 80)
                require(time == null || timePattern.matches(time))
                require(!nextDay)
                WidgetPrayer(kind, name, time, nextDay, row.optString("eventDate", day), row.optString("at", ""))
            }
            val weekday = json.getString("weekday")
            val date = json.getString("date")
            val shortDate = json.getString("shortDate")
            require(weekday.length in 1..30 && date.length in 1..80 && shortDate.length in 1..20)
            val complete = json.optBoolean("calendarComplete", false)
            WidgetDay(day, weekday, date, shortDate, rows, complete, json.optString("previousIsha", ""))
        } catch (error: Exception) {
            Log.w(tag, "Invalid widget date $day", error)
            null
        }
    }

    private fun dayKey(offset: Int, now: Long = System.currentTimeMillis()): String {
        val calendar = Calendar.getInstance(zone).apply {
            timeInMillis = now
            add(Calendar.DATE, offset)
        }
        return SimpleDateFormat("yyyy-MM-dd", Locale.ROOT).apply { timeZone = zone }.format(calendar.time)
    }

    private fun prune(data: SharedPreferences) {
        val earliest = dayKey(-7)
        val editor = data.edit()
        for (key in data.all.keys) {
            if ((key.startsWith("vaktija.widgets.day.") || key.startsWith("vaktija.widgets.failure.")) &&
                key.takeLast(10) < earliest) editor.remove(key)
        }
        editor.apply()
    }
}
