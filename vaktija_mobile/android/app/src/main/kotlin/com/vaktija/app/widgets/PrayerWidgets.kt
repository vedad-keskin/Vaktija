package com.vaktija.app.widgets

import android.appwidget.AppWidgetManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.PorterDuff
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
import kotlin.math.min
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
        super.onRestored(context, oldIds, newIds)
        requestPrayerWidgetRefresh(context)
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
        if (intent.action !in listOf(
                Intent.ACTION_BOOT_COMPLETED,
                Intent.ACTION_MY_PACKAGE_REPLACED,
                Intent.ACTION_TIME_CHANGED,
                Intent.ACTION_TIMEZONE_CHANGED,
            )) return
        val manager = AppWidgetManager.getInstance(context)
        val data = HomeWidgetPlugin.getData(context)
        for ((provider, layout) in prayerWidgetProviders) {
            PrayerWidgetRenderer.update(context, manager, widgetIds(context, provider), layout, data)
        }
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

private object PrayerWidgetRenderer {
    private const val tag = "PrayerWidgets"
    private const val configurationKey = "vaktija.widgets.configuration"
    private val zone = TimeZone.getTimeZone("Europe/Sarajevo")
    private val datePattern = Regex("\\d{4}-\\d{2}-\\d{2}")
    private val timePattern = Regex("(?:[01]\\d|2[0-3]):[0-5]\\d")
    private val kinds = listOf("fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "midnight", "lastthird")
    private val icons = listOf(R.drawable.widget_fajr, R.drawable.widget_sunrise, R.drawable.widget_dhuhr,
        R.drawable.widget_asr, R.drawable.widget_maghrib, R.drawable.widget_isha,
        R.drawable.widget_midnight, R.drawable.widget_lastthird)
    private val listText = Color.rgb(237, 242, 232)

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
            val previous = settings?.let { readDay(data, it, dayKey(-1, now)) }
            val tomorrow = settings?.let { readDay(data, it, dayKey(1, now)) }
            PrayerCountdown.update(
                context, manager, ids, settings, now,
                previous?.rows, current?.rows, tomorrow?.rows, current?.previousIsha,
                prayerIcon = { kind -> icons[kinds.indexOf(kind)] },
            )
            prune(data)
            return
        }
        val day = current ?: settings?.let { active ->
            (1..7).firstNotNullOfOrNull { readDay(data, active, dayKey(-it)) }
        }
        for (id in ids) updateTimetable(context, manager, id, layout == PrayerWidgetLayout.GRID, settings, day, today, data)
        prune(data)
    }

    private fun updateTimetable(
        context: Context, manager: AppWidgetManager, id: Int, grid: Boolean,
        settings: WidgetSettings?, day: WidgetDay?, today: String, data: SharedPreferences,
    ) {
        val options = manager.getAppWidgetOptions(id)
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                @Suppress("DEPRECATION")
                val sizes = options.getParcelableArrayList<SizeF>(AppWidgetManager.OPTION_APPWIDGET_SIZES)
                if (!sizes.isNullOrEmpty()) {
                    val views = sizes.distinct().associateWith { size ->
                        render(context, size, grid, settings, day, today, data)
                    }
                    manager.updateAppWidget(id, RemoteViews(views))
                    return
                }
            }
            val portrait = context.resources.configuration.orientation != android.content.res.Configuration.ORIENTATION_LANDSCAPE
            val widthKey = if (portrait) AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH else AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH
            val heightKey = if (portrait) AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT else AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT
            val size = SizeF(options.getInt(widthKey, 344).toFloat(), options.getInt(heightKey, if (grid) 322 else 366).toFloat())
            manager.updateAppWidget(id, render(context, size, grid, settings, day, today, data))
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
    ): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.prayer_widget_list)
        val locale = if (settings?.bosnian != false) Locale.forLanguageTag("bs") else Locale.ENGLISH
        val bosnian = settings?.bosnian != false
        val width = size.width.coerceIn(140f, 1000f)
        val narrow = width < 240f
        val city = settings?.city ?: "Vaktija"
        val calendar = Calendar.getInstance(zone, locale)
        val weekday = day?.weekday ?: SimpleDateFormat("EEEE", locale).apply { timeZone = zone }.format(calendar.time)
            .replaceFirstChar { it.titlecase(locale) }
        val date = day?.shortDate ?: SimpleDateFormat("dd.MM.yyyy.", locale)
            .apply { timeZone = zone }.format(calendar.time)
        val headerHeight: Float
        if (narrow) {
            val textWidth = (width - 67f).coerceAtLeast(24f)
            headerHeight = max(38f, textHeight(context, "Ag", 15f, textWidth, includePad = true) + textHeight(context, date, 11f, textWidth, includePad = true) + 8f)
            setText(context, views, R.id.widget_city, city, 15f, textWidth, listText)
            setText(context, views, R.id.widget_compact_date, date, 11f, textWidth, listText)
            views.setViewVisibility(R.id.widget_date, View.GONE)
            views.setViewVisibility(R.id.widget_compact_date, View.VISIBLE)
            views.setViewPadding(R.id.widget_list_header, dp(context, 10f), dp(context, 4f), dp(context, 13f), dp(context, 4f))
        } else {
            val dateWidth = measure(context, date, 12f) + 2f
            val cityWidth = (width - dateWidth - 67f).coerceAtLeast(24f)
            headerHeight = max(38f, max(textHeight(context, city, 17f, cityWidth), textHeight(context, date, 12f, dateWidth)) + 10f)
            setText(context, views, R.id.widget_city, city, 17f, cityWidth, listText, maxLines = 2)
            setText(context, views, R.id.widget_date, date, 12f, dateWidth, listText, end = true, fill = false)
            views.setViewVisibility(R.id.widget_date, View.VISIBLE)
            views.setViewVisibility(R.id.widget_compact_date, View.GONE)
            views.setViewPadding(R.id.widget_list_header, dp(context, 10f), dp(context, 5f), dp(context, 13f), dp(context, 5f))
        }
        views.setImageViewBitmap(R.id.widget_logo, image(context, R.drawable.widget_logo, 29f, 27f))
        views.setContentDescription(R.id.widget_root, "$city, $weekday, $date")
        views.setOnClickPendingIntent(R.id.widget_root,
            HomeWidgetLaunchIntent.getActivity(context, MainActivity::class.java, Uri.parse("vaktija://widgets/prayers")))
        views.removeAllViews(R.id.widget_rows)

        var status = when {
            settings?.ready != true -> if (bosnian) "Dodirnite za postavljanje vaktije" else "Tap to set up Vaktija"
            day != null && day.day != today -> if (bosnian) "Podaci za prethodni datum · Otvorite aplikaciju" else "Previous date's times · Open the app"
            day != null && !day.complete -> if (bosnian) "Neka vremena nisu dostupna" else "Some times are unavailable"
            day == null && data.getBoolean("vaktija.widgets.failure.${settings.key}.$today", false) ->
                if (bosnian) "Vremena nisu dostupna · Otvorite aplikaciju" else "Times unavailable · Open the app"
            day == null -> if (bosnian) "Učitavanje vaktije…" else "Loading prayer times…"
            else -> ""
        }
        val dense = if (grid) width < 300f || size.height - headerHeight - 16f < 3 * 64f
            else narrow || size.height - headerHeight - 16f < 6 * 39f
        val showIcon = if (grid) width >= 300f else !dense
        views.setViewPadding(R.id.widget_rows, dp(context, 13f), dp(context, if (dense) 2f else 5f), dp(context, 13f), dp(context, if (dense) 6f else 11f))
        var availableHeight = size.height - headerHeight - if (dense) 8f else 16f
        if (status.isNotEmpty()) availableHeight -= textHeight(context, status, 12f, width - 28f) + 6f
        if (day != null) {
            val nameSize = if (grid) { if (dense) 12f else 13f } else if (dense) 14f else 16f
            val timeSize = if (dense) 16f else 21f
            val minimumTimeWidth = measure(context, "23:59", timeSize, 700) + 2f
            val nameWidth = if (grid) (width - 33f) / 2f - 16f - (if (showIcon) 33f else 0f)
                else width - 36f - (if (showIcon) 36f else 0f) - minimumTimeWidth
            val heights = day.rows.associateWith { row ->
                val nameHeight = textHeight(context, row.name, nameSize, nameWidth, 400, includePad = true)
                val timeHeight = textHeight(context, "23:59", timeSize, minimumTimeWidth, 700, includePad = true)
                if (grid) max(40f, nameHeight + timeHeight + if (dense) 4f else 8f)
                else if (dense) max(26f, max(nameHeight, timeHeight) + 1f) else max(39f, max(nameHeight, timeHeight) + 11f)
            }
            val compact = day.rows.filter { it.kind != "midnight" && it.kind != "lastthird" }
            val gap = if (grid) 1f else 0f
            val fullHeight = (if (grid) ceil(day.rows.size / 2f) else day.rows.size.toFloat()) * (heights.values.max() + gap)
            val compactHeight = (if (grid) ceil(compact.size / 2f) else compact.size.toFloat()) * (compact.maxOf { heights.getValue(it) } + gap)
            if (availableHeight < compactHeight || nameWidth < 30f || (grid && nameWidth < minimumTimeWidth)) {
                Log.d(tag, "Widget needs more room: ${size.width}x${size.height}, available=$availableHeight, compact=$compactHeight, nameWidth=$nameWidth, dense=$dense")
                status = if (bosnian) "Povećajte widget za prikaz vremena" else "Enlarge the widget to show times"
            } else {
                val visible = if (availableHeight >= fullHeight) day.rows else compact
                if (grid) {
                    val pairs = visible.chunked(2)
                    for ((index, pair) in pairs.withIndex()) {
                        val row = RemoteViews(context.packageName, R.layout.prayer_widget_grid_row)
                        row.addView(R.id.widget_grid_left, prayerView(context, pair[0], true, nameWidth, dense, showIcon))
                        pair.getOrNull(1)?.let { row.addView(R.id.widget_grid_right, prayerView(context, it, true, nameWidth, dense, showIcon)) }
                        row.setViewVisibility(R.id.widget_grid_divider, if (index == pairs.lastIndex) View.GONE else View.VISIBLE)
                        row.setViewVisibility(R.id.widget_grid_column_divider, if (pair.size == 2) View.VISIBLE else View.GONE)
                        views.addView(R.id.widget_rows, row)
                    }
                } else {
                    for ((index, prayer) in visible.withIndex()) {
                        val row = prayerView(context, prayer, false, nameWidth, dense)
                        row.setViewVisibility(R.id.widget_list_divider, if (index == visible.lastIndex) View.GONE else View.VISIBLE)
                        views.addView(R.id.widget_rows, row)
                    }
                }
                Log.d(tag, "Widget ${if (grid) "grid" else "list"} ${day.day} ${settings?.key} ${size.width}x${size.height} rows=${visible.size}")
            }
        }
        views.setTextViewText(R.id.widget_status, status)
        views.setViewVisibility(R.id.widget_status, if (status.isEmpty()) View.GONE else View.VISIBLE)
        return views
    }

    private fun prayerView(context: Context, prayer: WidgetPrayer, grid: Boolean, nameWidth: Float, dense: Boolean = false, showIcon: Boolean = !dense): RemoteViews {
        val views = RemoteViews(context.packageName, if (grid) R.layout.prayer_widget_tile else R.layout.prayer_widget_list_row)
        val index = kinds.indexOf(prayer.kind)
        views.setViewVisibility(R.id.widget_prayer_icon, if (showIcon) View.VISIBLE else View.GONE)
        if (dense) {
            if (grid) views.setViewPadding(R.id.widget_prayer_row, dp(context, 8f), dp(context, 2f), dp(context, 8f), dp(context, 2f))
            else views.setViewPadding(R.id.widget_prayer_content, 0, 0, 0, 0)
        }
        if (showIcon) {
            views.setImageViewBitmap(R.id.widget_prayer_icon, image(context, icons[index], 26f, 27f))
        }
        val nameSize = if (grid) { if (dense) 12f else 13f } else if (dense) 14f else 16f
        val timeSize = if (dense) 16f else 21f
        setText(context, views, R.id.widget_prayer_name, prayer.name, nameSize, nameWidth, listText,
            maxLines = Int.MAX_VALUE, weight = 400)
        setText(context, views, R.id.widget_prayer_time, prayer.time ?: "—", timeSize,
            measure(context, "23:59", timeSize, 700) + 2f,
            listText, end = !grid, fill = false, weight = 700)
        views.setContentDescription(R.id.widget_prayer_row, "${prayer.name}, ${prayer.time ?: "—"}, ${prayer.eventDate}")
        return views
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

    private fun setText(
        context: Context,
        views: RemoteViews,
        id: Int,
        text: String,
        size: Float,
        width: Float,
        color: Int,
        end: Boolean = false,
        maxLines: Int = 1,
        fill: Boolean = true,
        weight: Int = 600,
    ) {
        val bitmap = HomeWidgetFonts.textBitmap(context, typeface(context, weight), text,
            fontSizeSp = size, maxWidthDp = width.coerceAtLeast(1f), maxLines = maxLines,
            textAlign = if (end) TextAlign.End else TextAlign.Start, fillWidth = fill)
        Canvas(bitmap).drawColor(color, PorterDuff.Mode.SRC_IN)
        bitmap.density = context.resources.displayMetrics.densityDpi
        views.setImageViewBitmap(id, bitmap)
    }

    private fun image(context: Context, resource: Int, width: Float, height: Float, crop: Boolean = false): Bitmap {
        val density = context.resources.displayMetrics.density
        val source = BitmapFactory.decodeResource(context.resources, resource)
        val target = Bitmap.createBitmap(max(1, (width * density).roundToInt()), max(1, (height * density).roundToInt()), Bitmap.Config.ARGB_8888)
        target.density = context.resources.displayMetrics.densityDpi
        val sourceHeight = if (crop) min(source.height, (source.width * height / width).roundToInt()) else source.height
        Canvas(target).drawBitmap(source, Rect(0, source.height - sourceHeight, source.width, source.height),
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
