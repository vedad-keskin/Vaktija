"""Check a launcher dump of the Countdown Pill at its current size.

adb shell uiautomator dump /sdcard/countdown.xml
adb pull /sdcard/countdown.xml countdown.xml
python scripts/check-countdown-widget.py countdown.xml --prayer Fajr --expanded
python scripts/check-countdown-widget.py settings.xml --prayer Fajr --ring-style time-based
"""

import argparse
import re
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("dump")
parser.add_argument("--prayer", required=True, help="Expected name in the app's language")
parser.add_argument("--expanded", action="store_true", help="Expect the prayer icon on the wide pill.")
parser.add_argument("--soon", action="store_true")
parser.add_argument("--ring-style", choices=("solid", "time-based"), help="Check a settings screen dump.")
args = parser.parse_args()

tree = ET.parse(args.dump)
pill = tree.find(".//node[@resource-id='app.vaktija:id/widget_countdown_root']")
assert pill is not None, "Countdown pill is missing"


def widget_node(name):
    return pill.find(f".//node[@resource-id='app.vaktija:id/widget_countdown_{name}']")


def bounds(node):
    return tuple(map(int, re.findall(r"\d+", node.get("bounds", ""))))


title = widget_node("title")
assert title is not None and title.get("text") == args.prayer, "Unexpected prayer"
if args.ring_style:
    solid = tree.find(".//node[@resource-id='app.vaktija:id/widget_countdown_ring_solid']")
    time_based = tree.find(".//node[@resource-id='app.vaktija:id/widget_countdown_ring_time_based']")
    assert solid is not None and time_based is not None, "Progress ring modes are missing"
    assert bounds(solid)[3] <= bounds(time_based)[1], "Progress ring modes should be stacked"
    mode = solid if args.ring_style == "solid" else time_based
    assert mode.get("checked") == "true", "Unexpected progress ring style"
    color = tree.find(".//node[@resource-id='app.vaktija:id/widget_countdown_ring_color_row']")
    assert (color is not None) == (args.ring_style == "solid"), "Unexpected solid color picker visibility"
    samples = tree.find(".//node[@resource-id='app.vaktija:id/widget_countdown_ring_time_samples']")
    assert (samples is not None) == (args.ring_style == "time-based"), "Unexpected time sample visibility"
    if color is not None:
        swatches = color.findall(".//node[@class='android.widget.RadioButton']")
        assert len(swatches) == 5 and sum(s.get("checked") == "true" for s in swatches) == 1
        positions = sorted(map(bounds, swatches))
        assert all(a[2] <= b[0] and a[1] == b[1] for a, b in zip(positions, positions[1:]))
        assert bounds(solid)[3] <= bounds(color)[1] < bounds(color)[3] <= bounds(time_based)[1]
    if samples is not None:
        labels = [node.get("text") for node in samples.iter("node") if node.get("text")]
        assert labels == ["20m", "10m", "3m"], "Time-based preview labels are missing"
    print("Countdown settings checks passed")
    raise SystemExit(0)

assert widget_node("time") is None, "Start time is visible"
assert widget_node("city") is None, "City is visible"
icon = widget_node("icon")
assert (icon is not None) == args.expanded, "Icon visibility does not match the width"
ring = widget_node("progress")
assert ring is not None, "Countdown ring is missing"
settings = widget_node("settings")
assert settings is not None and settings.get("clickable") == "true", "Settings target is missing"
assert settings.get("content-desc") in {"Widget settings", "Postavke widgeta"}
gear = settings.find(".//node[@resource-id='app.vaktija:id/widget_countdown_gear']")
assert gear is not None, "Settings gear is missing"
settings_left, _, settings_right, _ = bounds(settings)
gear_left, gear_top, gear_right, gear_bottom = bounds(gear)
ring_left, ring_top, ring_right, ring_bottom = bounds(ring)
ring_width = ring_right - ring_left
ring_height = ring_bottom - ring_top
ring_diameter = min(ring_width * 52.8 / 60.8, ring_height * 52.8 / 71.73333)
gear_diameter = gear_right - gear_left
gear_padding = gear_diameter * 5 / 26
assert settings_left <= ring_left < ring_right <= settings_right, "The ring should open settings"
assert gear_diameter - 2 * gear_padding >= ring_width / 4, "The gear is too small"
assert settings_left <= gear_left and gear_left + gear_padding <= ring_left - ring_width / 6
assert gear_right <= (ring_left + ring_right) / 2
assert ring_top <= gear_top < gear_bottom <= ring_bottom
assert abs(gear_top + gear_padding - (ring_top + (ring_height - ring_diameter) / 2)) <= 3
assert bounds(title)[2] <= settings_left, "Settings overlaps the prayer title"
if icon is not None:
    icon_left, icon_top, _, icon_bottom = bounds(icon)
    pill_left, _, pill_right, _ = bounds(pill)
    assert abs(icon_bottom - icon_top - ring_diameter) <= 2, "Icon height should match the ring"
    assert abs(icon_left - pill_left - (pill_right - ring_right)) <= 2, "Icon and ring need matching edge insets"
timer = widget_node("timer")
assert timer is not None, "Timer is missing"
assert re.fullmatch(r"\d+m|\d+h \d+m", timer.get("text", "")), timer.attrib
assert not re.search(r"\d{2}:\d{2}", title.get("content-desc", "")), title.attrib
assert bool(re.search(r"\b(?:Soon|Uskoro)\b", title.get("content-desc", ""))) == args.soon
print("Countdown pill checks passed")
