package com.vaktija.app.widgets

import android.app.Activity
import android.app.Instrumentation
import android.content.Context
import android.os.Bundle
import android.util.SizeF
import android.widget.FrameLayout
import android.widget.TextView
import com.vaktija.app.R

// adb shell am instrument -w app.vaktija.test/com.vaktija.app.widgets.CountdownLabelsCheck
class CountdownLabelsCheck : Instrumentation() {
    override fun onCreate(arguments: Bundle?) {
        super.onCreate(arguments)
        start()
    }

    override fun onStart() {
        try {
            runOnMainSync {
                val context = targetContext
                val appearance = PrayerCountdown.appearance(
                    context.getSharedPreferences("countdown_label_check", Context.MODE_PRIVATE), -1,
                ).copy(showPrayerTime = true)
                for ((bosnian, noon) in listOf(true to "Džuma", false to "Jumu'ah", true to "Podne", false to "Dhuhr")) {
                    val day = if (noon in listOf("Džuma", "Jumu'ah")) "2026-11-27" else "2026-11-26"
                    val rows = listOf("fajr" to "05:00", "dhuhr" to "12:00", "asr" to "15:00", "maghrib" to "17:00", "isha" to "19:00").map { (kind, time) ->
                        WidgetPrayer(kind, if (kind == "dhuhr") noon else "unused", time, false, day, "${day}T${time}:00.000Z")
                    }
                    for ((hour, expected) in listOf("09" to noon, "04" to if (bosnian) "Sabah" else "Fajr")) {
                        val now = PrayerCountdown.parseTime("${day}T${hour}:00:00.000Z", PrayerCountdown.timestampParser())!!
                        val render = PrayerCountdown.prepare(
                            context, WidgetSettings("check", "Sarajevo", bosnian, true), now,
                            null, rows, null, null, { R.drawable.widget_dhuhr },
                        )
                        for (wide in listOf(false, true)) {
                            // Both the settings preview and launcher use this renderer.
                            for (id in listOf(null, -1)) {
                                val view = render.views(SizeF(if (wide) 240f else 156f, 72f), 1f, appearance, id)
                                    .apply(context, FrameLayout(context))
                                val title = view.findViewById<TextView>(R.id.widget_countdown_title)
                                val time = if (hour == "09") "12:00" else "05:00"
                                check(title.text.toString() == if (wide) "$expected · $time" else expected) { title.text }
                                check(title.contentDescription.toString() == if (wide) "$expected, $time" else expected) { title.contentDescription }
                            }
                        }
                    }
                }
            }
            finish(Activity.RESULT_OK, Bundle().apply { putString("stream", "\nCountdown labels passed (32 cases).\n") })
        } catch (error: Throwable) {
            finish(Activity.RESULT_CANCELED, Bundle().apply { putString("stream", error.stackTraceToString()) })
        }
    }
}
