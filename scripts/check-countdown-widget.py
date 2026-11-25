"""Check a launcher dump of the Countdown Pill at its current size.

adb shell uiautomator dump /sdcard/countdown.xml
adb pull /sdcard/countdown.xml countdown.xml
python scripts/check-countdown-widget.py countdown.xml --prayer "Fajr (Dawn)" --expanded
"""

import argparse
import re
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("dump")
parser.add_argument("--prayer", required=True, help="Expected name in the app's language")
parser.add_argument("--expanded", action="store_true", help="Expect the prayer icon on the wide pill.")
parser.add_argument("--soon", action="store_true")
args = parser.parse_args()

tree = ET.parse(args.dump)
pill = tree.find(".//node[@resource-id='app.vaktija:id/widget_countdown_root']")
assert pill is not None, "Countdown pill is missing"


def widget_node(name):
    return pill.find(f".//node[@resource-id='app.vaktija:id/widget_countdown_{name}']")


title = widget_node("title")
assert title is not None and title.get("text") == args.prayer, "Unexpected prayer"
assert widget_node("time") is None, "Start time is visible"
assert widget_node("city") is None, "City is visible"
icon = widget_node("icon")
assert (icon is not None) == args.expanded, "Icon visibility does not match the width"
ring = widget_node("progress")
assert ring is not None, "Countdown ring is missing"
if icon is not None:
    icon_left, icon_top, icon_right, icon_bottom = map(int, re.findall(r"\d+", icon.get("bounds", "")))
    ring_left, _, ring_right, _ = map(int, re.findall(r"\d+", ring.get("bounds", "")))
    pill_left, _, pill_right, _ = map(int, re.findall(r"\d+", pill.get("bounds", "")))
    ring_diameter = (ring_right - ring_left) * 52.8 / 60.8
    assert abs(icon_bottom - icon_top - ring_diameter) <= 2, "Icon height should match the ring"
    assert abs(icon_left - pill_left - (pill_right - ring_right)) <= 2, "Icon and ring need matching edge insets"
timer = widget_node("timer")
assert timer is not None, "Timer is missing"
assert re.fullmatch(r"<1m|\d+m|\d+h \d+m", timer.get("text", "")), timer.attrib
assert not re.search(r"\d{2}:\d{2}", title.get("content-desc", "")), title.attrib
assert bool(re.search(r"\b(?:Soon|Uskoro)\b", title.get("content-desc", ""))) == args.soon
print("Countdown pill checks passed")
