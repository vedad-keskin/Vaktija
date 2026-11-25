package com.vaktija.app.widgets

import android.app.AlarmManager
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
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
import com.vaktija.app.MainActivity
import com.vaktija.app.R
import es.antonborri.home_widget.HomeWidgetLaunchIntent
import es.antonborri.home_widget.HomeWidgetScheduler
import java.text.ParsePosition
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone
import kotlin.math.roundToInt

internal object PrayerCountdown {
    private const val minute = 60_000L
    private const val wideWidth = 190f
    private const val referenceHeight = 71.73333f
    private val kinds = setOf("fajr", "dhuhr", "asr", "maghrib", "isha")
    private val utcTimestamp = Regex("""\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:\d{3})?Z""")

    private data class Prayer(val row: WidgetPrayer, val at: Long)

    fun update(
        context: Context, manager: AppWidgetManager, ids: IntArray, settings: WidgetSettings?, now: Long,
        yesterday: List<WidgetPrayer>?, today: List<WidgetPrayer>?, tomorrow: List<WidgetPrayer>?,
        previousIsha: String?, prayerIcon: (String) -> Int,
    ) {
        val parser = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ROOT).apply {
            isLenient = false
            timeZone = TimeZone.getTimeZone("UTC")
        }
        val currentDay = prayers(today, parser)
        val next = currentDay?.firstOrNull { it.at > now }
            ?: currentDay?.let { prayers(tomorrow, parser)?.firstOrNull { it.at > now } }
        val starts = currentDay?.lastOrNull { it.at <= now }?.at
            ?: prayers(yesterday, parser)?.lastOrNull { it.at <= now }?.at
            ?: parseTime(previousIsha, parser)?.takeIf { it <= now }
        val resources = if (settings == null) context.resources else {
            val localized = Configuration(context.resources.configuration)
            localized.setLocale(Locale.forLanguageTag(if (settings.bosnian) "bs" else "en"))
            context.createConfigurationContext(localized).resources
        }
        val remaining = next?.let { it.at - now } ?: 0L
        val progress = if (next != null && starts != null && starts < next.at) {
            ((now - starts).toFloat() / (next.at - starts)).coerceIn(0f, 1f)
        } else 0f
        val accent = when {
            remaining <= 5 * minute -> Color.rgb(225, 68, 55)
            remaining <= 15 * minute -> Color.rgb(156, 130, 0)
            else -> Color.rgb(55, 122, 255)
        }
        val ring = next?.let { progressRing(progress, accent) }
        val timerText = next?.let { remainingText(resources, remaining) }
        val icon = next?.let {
            val source = BitmapFactory.decodeResource(context.resources, prayerIcon(it.row.kind))
            // All five prayer PNGs share these transparent margins.
            Bitmap.createBitmap(source, 15, 8, 126, 144)
        }
        val soon = if (remaining in 1..(5 * minute)) resources.getString(R.string.widget_countdown_soon) else null
        val tap = HomeWidgetLaunchIntent.getActivity(context, MainActivity::class.java, Uri.parse("vaktija://widgets/prayers"))
        val metrics = resources.displayMetrics
        val countdownPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            val family = Typeface.create("sec", Typeface.NORMAL)
            typeface = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) Typeface.create(family, 500, false) else family
        }
        val labelPaint = Paint(countdownPaint)
        countdownPaint.fontFeatureSettings = "tnum"

        fun views(size: SizeF, hostScale: Float) = RemoteViews(context.packageName, R.layout.prayer_widget_countdown).apply {
            val wide = size.width * hostScale >= wideWidth
            val live = next != null
            val showIcon = wide && live
            val textGravity = Gravity.TOP or (if (showIcon) Gravity.CENTER_HORIZONTAL else Gravity.START)
            // Measured reference is 156.8 x 71.733 dp. Samsung Home scales third-party widgets.
            val panelHeight = minOf(size.height, referenceHeight / hostScale)
            val unit = panelHeight / referenceHeight
            val inset = (size.height - panelHeight) / 2f
            // ponytail: pre-Android 12 image slots stay fixed; use size-specific layouts for full legacy resize fidelity.
            val imageWidth = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) 60.8f * unit else 60.8f
            val imageInset = ((imageWidth - 60.8f * unit) / 2f * metrics.density).roundToInt().coerceAtLeast(0)
            val iconHeight = 52.8f * unit
            val iconWidth = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                icon?.let { iconHeight * it.width / it.height + 8f * unit } ?: 0f
            } else 54.2f
            val gapPx = (8f * unit * metrics.density).roundToInt()
            val insetPx = (inset * metrics.density).roundToInt()
            setViewPadding(R.id.widget_countdown_root, 0, insetPx, 0, insetPx)
            val startPadding = (if (showIcon) 8.53333f else 21.33333f) * unit
            val endPadding = 8.53333f * unit
            setViewPadding(R.id.widget_countdown_panel, (startPadding * metrics.density).roundToInt(), 0,
                (endPadding * metrics.density).roundToInt(), 0)
            setViewPadding(R.id.widget_countdown_progress, imageInset + gapPx, imageInset, imageInset, imageInset)
            setViewPadding(R.id.widget_countdown_icon, 0, 0, gapPx, 0)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                setViewLayoutWidth(R.id.widget_countdown_progress, imageWidth, TypedValue.COMPLEX_UNIT_DIP)
                setViewLayoutWidth(R.id.widget_countdown_icon, iconWidth, TypedValue.COMPLEX_UNIT_DIP)
                setViewLayoutHeight(R.id.widget_countdown_icon, iconHeight, TypedValue.COMPLEX_UNIT_DIP)
            }
            val textWidth = size.width - startPadding - endPadding -
                (if (live) imageWidth else 0f) - (if (showIcon) iconWidth else 0f)
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
            val title = next?.row?.name ?: resources.getString(
                if (settings?.ready == true) R.string.widget_countdown_unavailable else R.string.widget_countdown_setup)
            fitText(labelPaint, title, 12f, 16.3f)
            setLine(R.id.widget_countdown_title, title, labelPaint, 24.8f + 5.6f * compactness)
            setOnClickPendingIntent(R.id.widget_countdown_root, tap)
            val liveVisibility = if (live) View.VISIBLE else View.GONE
            setViewVisibility(R.id.widget_countdown_icon, if (showIcon) View.VISIBLE else View.GONE)
            setViewVisibility(R.id.widget_countdown_timer, liveVisibility)
            setViewVisibility(R.id.widget_countdown_progress, liveVisibility)
            if (next == null || timerText == null) {
                setContentDescription(R.id.widget_countdown_title, title)
            } else {
                if (showIcon) setImageViewBitmap(R.id.widget_countdown_icon, icon)
                setLine(R.id.widget_countdown_timer, timerText, countdownPaint, 51.7f - 2.7f * compactness)
                setImageViewBitmap(R.id.widget_countdown_progress, ring)
                val announcement = listOfNotNull(next.row.name, soon).joinToString(", ")
                setContentDescription(R.id.widget_countdown_title, announcement)
            }
        }

        for (id in ids) {
            try {
                val options = manager.getAppWidgetOptions(id)
                val hostScale = options.getFloat("hsResizeRatio", 1f).coerceIn(0.5f, 2f)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    @Suppress("DEPRECATION")
                    val sizes = options.getParcelableArrayList<SizeF>(AppWidgetManager.OPTION_APPWIDGET_SIZES)
                    if (!sizes.isNullOrEmpty()) {
                        manager.updateAppWidget(id, RemoteViews(sizes.distinct().associateWith { views(it, hostScale) }))
                        continue
                    }
                }
                val landscape = context.resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE
                val widthKey = if (landscape) AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH else AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH
                val heightKey = if (landscape) AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT else AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT
                val size = SizeF(options.getInt(widthKey, 144).toFloat(), options.getInt(heightKey, 56).toFloat())
                manager.updateAppWidget(id, views(size, hostScale))
            } catch (error: Exception) {
                Log.e("PrayerCountdown", "Could not render widget $id", error)
            }
        }

        // Only the prayer change may wake a sleeping device. Visual updates catch up when awake.
        HomeWidgetScheduler.schedule(context, PrayerCountdownWidget::class.java.name, listOfNotNull(next?.at))
        val visualUpdate = next?.let { target ->
            val nextMinute = target.at - ((remaining - 1) / minute) * minute
            // Catch the boundary if it passed while this update was being rendered.
            nextMinute.takeIf { it < target.at || it <= System.currentTimeMillis() }
        }
        scheduleVisualUpdate(context, visualUpdate)
    }

    fun cancelVisualUpdate(context: Context) = scheduleVisualUpdate(context, null)

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
        if (at == null) alarms.cancel(update) else alarms.set(AlarmManager.RTC, at, update)
    }

    private fun prayers(rows: List<WidgetPrayer>?, parser: SimpleDateFormat): List<Prayer>? {
        val events = rows.orEmpty().mapNotNull { row ->
            if (row.kind !in kinds || row.time == null) return@mapNotNull null
            val at = parseTime(row.timestamp, parser) ?: return@mapNotNull null
            Prayer(row, at)
        }
        if (events.map { it.row.kind }.toSet() != kinds) return null
        return events.distinctBy { it.row.kind }.sortedBy { it.at }
    }

    private fun parseTime(timestamp: String?, parser: SimpleDateFormat): Long? {
        if (timestamp == null || !utcTimestamp.matches(timestamp)) return null
        return parser.parse(timestamp.take(23) + "Z", ParsePosition(0))?.time
    }

    private fun remainingText(resources: Resources, remaining: Long): String {
        val minutes = (remaining + minute - 1) / minute
        val hours = minutes / 60
        if (hours == 0L) return resources.getString(R.string.widget_countdown_minutes, minutes)
        return resources.getString(R.string.widget_countdown_hours_compact, hours, minutes % 60)
    }

    private fun progressRing(progress: Float, accent: Int): Bitmap {
        val bitmap = Bitmap.createBitmap(200, 200, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 48f
            strokeCap = Paint.Cap.BUTT
            color = 0x50FFFFFF
        }
        canvas.drawCircle(100f, 100f, 76f, paint)
        if (progress > 0f) {
            paint.color = accent
            canvas.drawArc(24f, 24f, 176f, 176f, -90f, 360f * progress, false, paint)
        }
        return bitmap
    }
}
