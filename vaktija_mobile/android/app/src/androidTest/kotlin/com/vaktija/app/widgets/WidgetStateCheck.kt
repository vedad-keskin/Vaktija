package com.vaktija.app.widgets

import android.content.Context
import android.content.res.Configuration
import android.util.SizeF
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.RemoteViews
import android.widget.TextView
import com.vaktija.app.R
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import java.util.TimeZone
import kotlin.math.roundToInt
import org.json.JSONArray
import org.json.JSONObject

internal fun checkWidgetStates(context: Context) {
    val data = context.getSharedPreferences("widget_state_check", Context.MODE_PRIVATE)
    val zone = TimeZone.getTimeZone("Europe/Sarajevo")
    val date = SimpleDateFormat("yyyy-MM-dd", Locale.ROOT).apply { timeZone = zone }
    val calendar = Calendar.getInstance(zone)
    val today = date.format(calendar.time)
    calendar.add(Calendar.DATE, -1)
    val yesterday = date.format(calendar.time)
    val targetScale = 0.8333333f
    val tall = SizeF(275.33334f, 339f)
    val grid = SizeF(375f, 218.33333f)
    val short = SizeF(176f, 110f)
    try {
        for (language in listOf("bs", "en")) {
            val bosnian = language == "bs"
            val localized = context.createConfigurationContext(Configuration(context.resources.configuration).apply {
                setLocale(Locale.forLanguageTag(language))
                fontScale = 1f
            })
            val appearance = PrayerCountdown.appearance(data, -1).copy(
                theme = if (bosnian) CountdownTheme.DARK else CountdownTheme.LIGHT, opacity = 120,
            )
            fun layout(views: RemoteViews, size: SizeF): View {
                val density = localized.resources.displayMetrics.density
                val width = (size.width * density).roundToInt()
                val height = (size.height * density).roundToInt()
                return views.apply(localized, FrameLayout(localized)).apply {
                    measure(View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY),
                        View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY))
                    layout(0, 0, width, height)
                }
            }
            fun timetable(size: SizeF, twoColumns: Boolean) = layout(
                PrayerWidgetRenderer.timetablePreview(localized, data, -1, size, targetScale, twoColumns, appearance), size,
            )
            fun checkPanel(view: View, title: String, badge: Boolean, inline: Boolean, hint: Boolean = false) {
                val panel = view.findViewById<View>(R.id.widget_state)
                val text = view.findViewById<TextView>(R.id.widget_state_title)
                check(panel.visibility == View.VISIBLE && text.text.toString() == title) { "Expected '$title', found '${text.text}'" }
                if (panel != view) check(view.contentDescription.toString().contains(title)) { "Missing spoken state '$title'" }
                check(text.layout != null && text.height >= text.layout.height &&
                    (0 until text.lineCount).all { text.layout.getEllipsisCount(it) == 0 }) { "Clipped state title '$title'" }
                for ((id, visible) in listOf(R.id.widget_state_badge to badge, R.id.widget_state_inline_icon to inline)) {
                    val icon = view.findViewById<ImageView>(id)
                    check((icon.visibility == View.VISIBLE) == visible && (!visible || icon.drawable != null)) { "Wrong icon layout for '$title'" }
                }
                check((view.findViewById<View>(R.id.widget_state_hint).visibility == View.VISIBLE) == hint) { "Wrong hint visibility for '$title'" }
            }
            val key = "0.iz.$language"
            val config = JSONObject(mapOf(
                "version" to 1, "key" to key, "timezone" to "Europe/Sarajevo", "method" to "iz",
                "city" to 0, "cityName" to "Banovići", "language" to language,
            )).toString()
            fun saveDay(day: String, complete: Boolean) {
                val prayers = JSONArray(listOf("fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha").map { kind ->
                    mapOf("kind" to kind, "name" to kind, "time" to "12:00", "nextDay" to false)
                })
                val payload = JSONObject(mapOf(
                    "version" to 1, "configuration" to key, "day" to day, "weekday" to "Petak",
                    "date" to day, "shortDate" to day, "calendarRows" to prayers, "calendarComplete" to complete,
                ))
                data.edit().putString("vaktija.widgets.day.$key.$day", payload.toString()).apply()
            }
            fun checkNotice(view: View, expected: String) {
                val notice = view.findViewById<TextView>(R.id.widget_status)
                check(notice.visibility == View.VISIBLE && notice.text.toString() == expected && notice.lineCount == 1)
                check(view.contentDescription.toString().contains(expected))
                check(view.findViewById<View>(R.id.widget_state).visibility == View.GONE)
                check(view.findViewById<ViewGroup>(R.id.widget_rows).childCount == 6)
            }

            val setup = if (bosnian) "Postavite vaktiju" else "Set up Vaktija"
            val unavailable = if (bosnian) "Vremena nisu dostupna" else "Times unavailable"
            val stale = if (bosnian) "Starija vremena" else "Older prayer times"
            val partial = if (bosnian) "Nepotpuna vaktija" else "Some times missing"
            data.edit().clear().putString("vaktija.widgets.configuration", JSONObject(config).apply {
                put("method", JSONObject.NULL)
                put("key", "0.setup.$language")
            }.toString()).apply()
            checkPanel(timetable(tall, false), setup, badge = true, inline = false, hint = true)
            data.edit().putString("vaktija.widgets.configuration", config).apply()
            checkPanel(timetable(grid, true), if (bosnian) "Učitavanje vaktije…" else "Loading prayer times…", badge = true, inline = false)
            data.edit().putBoolean("vaktija.widgets.failure.$key.$today", true).apply()
            checkPanel(timetable(grid, true), unavailable, badge = true, inline = false, hint = true)
            saveDay(yesterday, complete = true)
            checkNotice(timetable(tall, false), stale)
            checkPanel(timetable(short, true), stale, badge = false, inline = true)
            saveDay(today, complete = false)
            checkNotice(timetable(tall, false), partial)
            checkPanel(timetable(short, true), partial, badge = false, inline = true)
            saveDay(today, complete = true)
            checkPanel(timetable(short, true), if (bosnian) "Povećajte widget" else "Enlarge the widget", badge = false, inline = true)

            val countdownSize = SizeF(275.33334f, 97.333336f)
            for ((ready, expected) in listOf(false to setup, true to unavailable)) {
                val settings = WidgetSettings(key, "Banovići", bosnian, ready)
                val countdown = PrayerCountdown.prepare(localized, settings, 0L, null, null, null, null) { error("No prayer expected") }
                val views = countdown.views(countdownSize, targetScale, appearance, null)
                checkPanel(layout(views, countdownSize), expected, badge = false, inline = true)
            }

            val tightSize = SizeF(108f, 54f)
            val tight = RemoteViews(context.packageName, R.layout.prayer_widget_state).apply {
                setWidgetState(localized, WidgetState.UNAVAILABLE, tightSize.width, tightSize.height, appearance.theme, preview = true)
            }
            checkPanel(layout(tight, tightSize), unavailable, badge = false, inline = false)
        }
    } finally {
        data.edit().clear().commit()
    }
}
