package com.vaktija.app.widgets

import android.content.Context
import android.content.res.Configuration
import android.util.SizeF
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import com.vaktija.app.R
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import kotlin.math.roundToInt
import org.json.JSONArray
import org.json.JSONObject

internal fun checkTimetableGear(targetContext: Context) {
    val context = targetContext.createConfigurationContext(Configuration().apply {
        densityDpi = 480
        fontScale = 1f
    })
    val data = context.getSharedPreferences("timetable_gear_check", Context.MODE_PRIVATE)
    val day = SimpleDateFormat("yyyy-MM-dd", Locale.ROOT).apply {
        timeZone = TimeZone.getTimeZone("Europe/Sarajevo")
    }.format(Date())
    val rows = JSONArray(listOf(
        "lastthird" to "Zadnja trećina", "fajr" to "Zora (sabah)", "sunrise" to "Izlazak sunca",
        "dhuhr" to "Džuma", "asr" to "Ikindija", "maghrib" to "Akšam", "isha" to "Jacija", "midnight" to "Polovina noći",
    ).map { (kind, name) -> mapOf("kind" to kind, "name" to name, "time" to "12:00", "nextDay" to false) })
    val timetable = JSONObject(mapOf(
        "version" to 1, "configuration" to "0.iz.bs", "day" to day, "weekday" to "Petak",
        "date" to day, "shortDate" to day, "calendarRows" to rows, "calendarComplete" to true,
    ))
    try {
        data.edit().putString("vaktija.widgets.day.0.iz.bs.$day", timetable.toString()).commit()
        val appearance = PrayerCountdown.appearance(data, -1)
        val scale = 0.8333333f
        val density = context.resources.displayMetrics.density
        fun checkSize(size: SizeF, grid: Boolean, city: String, expectedRows: Int, showGear: Boolean) {
            val configuration = JSONObject(mapOf(
                "version" to 1, "key" to "0.iz.bs", "timezone" to "Europe/Sarajevo", "method" to "iz",
                "city" to 0, "cityName" to city, "language" to "bs",
            ))
            data.edit().putString("vaktija.widgets.configuration", configuration.toString()).commit()
            val view = PrayerWidgetRenderer.timetablePreview(context, data, -1, size, scale, grid, appearance)
                .apply(context, FrameLayout(context))
            view.measure(
                View.MeasureSpec.makeMeasureSpec((size.width * density).roundToInt(), View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec((size.height * density).roundToInt(), View.MeasureSpec.EXACTLY),
            )
            val gear = view.findViewById<View>(R.id.widget_settings)
            val rowCount = view.findViewById<ViewGroup>(R.id.widget_rows).childCount
            check(rowCount == expectedRows) { "$size: expected $expectedRows rows, got $rowCount" }
            check((gear.visibility == View.VISIBLE) == showGear) { "$size: expected gear visibility $showGear" }
            if (showGear) {
                val target = (48f * density / scale).roundToInt()
                check(gear.measuredWidth == target && gear.measuredHeight == target) { "$size: gear touch target shrank" }
            }
        }
        checkSize(SizeF(275.33334f, 339f), false, "Banovići", 6, true)
        checkSize(SizeF(375f, 218.33333f), true, "Jablanica", 4, true)
        checkSize(SizeF(176f, 218.33333f), true, "Jablanica", 3, false)
        checkSize(SizeF(375f, 339f), false, "Banovići", 6, true)
    } finally {
        data.edit().clear().commit()
    }
}
