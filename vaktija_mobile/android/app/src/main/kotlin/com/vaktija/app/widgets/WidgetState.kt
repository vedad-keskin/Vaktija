package com.vaktija.app.widgets

import android.content.Context
import android.graphics.Typeface
import android.text.StaticLayout
import android.text.TextPaint
import android.view.View
import android.widget.RemoteViews
import androidx.core.util.TypedValueCompat
import com.vaktija.app.R
import kotlin.math.ceil

internal enum class WidgetState(val title: Int, val icon: Int, val hint: Int? = null) {
    LOADING(R.string.widget_state_loading, R.drawable.ic_widget_clock),
    RESIZE(R.string.widget_state_resize, R.drawable.ic_widget_resize, R.string.widget_state_resize_hint),
    SETUP(R.string.widget_state_setup, R.drawable.ic_widget_pin, R.string.widget_state_setup_hint),
    UNAVAILABLE(R.string.widget_state_unavailable, R.drawable.ic_widget_alert, R.string.widget_state_open_app),
    STALE(R.string.widget_state_stale, R.drawable.ic_widget_clock, R.string.widget_state_open_app),
    PARTIAL(R.string.widget_state_partial, R.drawable.ic_widget_alert, R.string.widget_state_open_app),
}

internal fun RemoteViews.setWidgetState(
    context: Context, state: WidgetState?, width: Float, height: Float,
    theme: CountdownTheme, preview: Boolean, allowStack: Boolean = true,
) {
    setViewVisibility(R.id.widget_state, if (state == null) View.GONE else View.VISIBLE)
    if (state == null) return

    val title = context.getString(state.title)
    val hint = state.hint?.let { context.getString(it) }
    val metrics = context.resources.displayMetrics
    val availableWidth = width - 20f
    val availableHeight = height - 8f
    fun measure(text: String, sizeSp: Float, widthDp: Float, medium: Boolean): StaticLayout {
        val paint = TextPaint().apply {
            typeface = if (medium) Typeface.create("sans-serif-medium", Typeface.NORMAL) else Typeface.DEFAULT
            textSize = TypedValueCompat.spToPx(sizeSp, metrics)
        }
        return StaticLayout.Builder.obtain(text, 0, text.length, paint, (widthDp * metrics.density).toInt().coerceAtLeast(1))
            .setIncludePad(false).build()
    }
    fun StaticLayout.heightDp() = ceil(this.height / metrics.density)

    val fullTitle = measure(title, 14f, availableWidth, medium = true)
    val stackedHeight = 36f + 7f + fullTitle.heightDp()
    val stacked = allowStack && fullTitle.lineCount <= 2 && stackedHeight + 20f <= availableHeight
    val inline = !stacked && availableWidth > 30f && measure(title, 14f, availableWidth - 30f, medium = true).let {
        it.lineCount <= 2 && maxOf(24f, it.heightDp()) <= availableHeight
    }
    val hintLayout = if (stacked) hint?.let { measure(it, 12f, availableWidth, medium = false) } else null
    val showHint = hintLayout != null && hintLayout.lineCount <= 2 && stackedHeight + 4f + hintLayout.heightDp() <= availableHeight

    setTextViewText(R.id.widget_state_title, title)
    val twoLineHeight = ceil(fullTitle.getLineBottom(minOf(1, fullTitle.lineCount - 1)) / metrics.density)
    setInt(R.id.widget_state_title, "setMaxLines", if (!inline && !stacked && twoLineHeight > availableHeight) 1 else 2)
    setTextViewText(R.id.widget_state_hint, hint.orEmpty())
    setViewVisibility(R.id.widget_state_hint, if (showHint) View.VISIBLE else View.GONE)
    for ((id, visible) in listOf(R.id.widget_state_badge to stacked, R.id.widget_state_inline_icon to inline)) {
        setViewVisibility(id, if (visible) View.VISIBLE else View.GONE)
        setImageViewResource(id, state.icon)
        PrayerWidgetRenderer.tint(context, this, id, "setColorFilter", theme, preview, 0xFF1E2028.toInt(), 0xFFFCFCFF.toInt())
    }
    PrayerWidgetRenderer.tint(context, this, R.id.widget_state_badge, "setBackgroundTintList", theme, preview, 0xFF1E2028.toInt(), 0xFFFCFCFF.toInt())
    PrayerWidgetRenderer.tint(context, this, R.id.widget_state_title, "setTextColor", theme, preview, 0xFF1E2028.toInt(), 0xFFFCFCFF.toInt())
    PrayerWidgetRenderer.tint(context, this, R.id.widget_state_hint, "setTextColor", theme, preview, 0xFF454952.toInt(), 0xFFD9DBE5.toInt())
}
