package com.vaktija.app.widgets

import android.content.Context
import android.content.res.Configuration
import android.graphics.drawable.BitmapDrawable
import android.util.SizeF
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import com.vaktija.app.R
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import kotlin.math.roundToInt

internal object WidgetLayoutCheck {
    fun run(targetContext: Context) {
        val preferences = targetContext.getSharedPreferences("widget_layout_check", Context.MODE_PRIVATE)
        preferences.edit().clear().commit()
        try {
            val day = SimpleDateFormat("yyyy-MM-dd", Locale.ROOT).apply {
                timeZone = TimeZone.getTimeZone("Europe/Sarajevo")
            }.format(Date())
            val key = "77.iz.bs"
            val kinds = listOf("lastthird", "fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "midnight")
            val names = listOf("Zadnja trećina", "Zora (sabah)", "Izlazak sunca", "Podne", "Ikindija", "Akšam", "Jacija", "Polovina noći")
            val rows = JSONArray()
            for ((index, kind) in kinds.withIndex()) {
                rows.put(JSONObject().put("kind", kind).put("name", names[index]).put("time", "12:34")
                    .put("nextDay", false).put("eventDate", day).put("at", "${day}T23:59:00.000Z"))
            }
            val config = JSONObject().put("version", 1).put("city", 77).put("cityName", "Sarajevo")
                .put("method", "iz").put("language", "bs").put("timezone", "Europe/Sarajevo").put("key", key)
            val data = JSONObject().put("version", 1).put("configuration", key).put("day", day)
                .put("weekday", "Petak").put("date", day).put("shortDate", day)
                .put("calendarRows", rows).put("calendarComplete", true)
            preferences.edit().putString("vaktija.widgets.configuration", config.toString())
                .putString("vaktija.widgets.day.$key.$day", data.toString()).commit()
            val original = PrayerCountdown.appearance(preferences, 1)
            val modified = original.copy(ringThickness = RingThickness.BOLD)
            val editor = preferences.edit()
            PrayerCountdown.writeAppearance(editor, 1, modified)
            editor.commit()
            check(PrayerCountdown.appearance(preferences, 1) == modified)
            check(PrayerCountdown.appearance(preferences, 2) == original)
            val cleanup = preferences.edit()
            PrayerCountdown.removeAppearance(cleanup, 1)
            cleanup.commit()
            check(preferences.all.keys.none { it.endsWith(".1") })

            var cases = 0
            for (fontScale in listOf(1f, 1.5f)) {
                val context = targetContext.createConfigurationContext(Configuration(targetContext.resources.configuration).apply {
                    this.fontScale = fontScale
                })
                val density = context.resources.displayMetrics.density
                for (pictures in listOf(false, true)) for (night in listOf(false, true))
                    for (width in listOf(180f, 480f, 640f)) {
                        val appearance = original.copy(showPrayerIcon = pictures, includeNightTimes = night)
                        val size = SizeF(width, 460f)
                        val views = PrayerWidgetRenderer.timetablePreview(context, preferences, -1, size, 1f, true, appearance)
                            .apply(context, FrameLayout(context))
                        val w = (width * density).roundToInt()
                        val h = (size.height * density).roundToInt()
                        views.measure(View.MeasureSpec.makeMeasureSpec(w, View.MeasureSpec.EXACTLY),
                            View.MeasureSpec.makeMeasureSpec(h, View.MeasureSpec.EXACTLY))
                        views.layout(0, 0, w, h)
                        val tiles = collect(views, R.id.widget_prayer_row)
                        check(tiles.size == if (night) 8 else 6) { "Missing tiles: width=$width font=$fontScale $appearance" }
                        val gridRows = collect(views, R.id.widget_grid_left)
                        check(gridRows.size == tiles.size / 2) { "Grid must use two columns" }
                        for (tile in tiles) {
                            val name = tile.findViewById<View>(R.id.widget_prayer_name)
                            val time = tile.findViewById<View>(R.id.widget_prayer_time)
                            check(name.left == time.left) { "Grid text must be left aligned" }
                        }
                        cases++
                    }
            }
            val context = targetContext
            val now = System.currentTimeMillis()
            val countdownRows = listOf("fajr", "dhuhr", "asr", "maghrib", "isha").mapIndexed { index, kind ->
                val at = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ROOT).apply {
                    timeZone = TimeZone.getTimeZone("UTC")
                }.format(Date(now + (index + 1) * 3600000L))
                WidgetPrayer(kind, kind, "12:34", false, day, at)
            }
            val render = PrayerCountdown.prepare(context, WidgetSettings(key, "Sarajevo", true, true), now,
                null, countdownRows, null, null, { R.drawable.widget_fajr })
            val counts = RingThickness.entries.map { thickness ->
                val view = render.views(SizeF(240f, 72f), 1f, original.copy(ringThickness = thickness), null)
                    .apply(context, FrameLayout(context))
                val bitmap = (view.findViewById<ImageView>(R.id.widget_countdown_progress).drawable as BitmapDrawable).bitmap
                (0 until bitmap.width).sumOf { x -> (0 until bitmap.height).count { y -> bitmap.getPixel(x, y) ushr 24 != 0 } }
            }
            check(counts.zipWithNext().all { (a, b) -> a < b }) { "Ring cache reused wrong thickness: $counts" }
            check(cases == 24)
        } finally {
            preferences.edit().clear().commit()
        }
    }

    private fun collect(root: View, id: Int): List<View> {
        val result = mutableListOf<View>()
        if (root.id == id) result.add(root)
        if (root is ViewGroup) for (index in 0 until root.childCount) result.addAll(collect(root.getChildAt(index), id))
        return result
    }
}
