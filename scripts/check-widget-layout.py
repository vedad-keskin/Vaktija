"""Check an actual launcher dump after resizing either prayer widget.

adb shell uiautomator dump /sdcard/widget.xml
adb pull /sdcard/widget.xml widget.xml
python scripts/check-widget-layout.py widget.xml --rows 6 --no-icons
"""

import argparse
import re
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("dump")
parser.add_argument("--rows", type=int, choices=(6, 8), required=True)
parser.add_argument("--no-icons", action="store_true")
args = parser.parse_args()
nodes = list(ET.parse(args.dump).iter("node"))


def views(name):
    return [n for n in nodes if n.get("resource-id") == f"app.vaktija:id/{name}"]


def bounds(node):
    return tuple(map(int, re.findall(r"\d+", node.get("bounds", ""))))


rows = views("widget_prayer_row")
assert len(rows) == args.rows, f"Expected {args.rows} entries, found {len(rows)}"
assert not views("widget_status"), "Widget is showing an error or enlarge message"
descriptions = [n.get("content-desc", "") for n in rows]
assert all(re.search(r", \d{2}:\d{2},", d) and "+1" not in d for d in descriptions)
night_names = ("Zadnja tre\u0107ina", "Polovina no\u0107i")
assert sum(d.startswith(night_names) for d in descriptions) == (2 if args.rows == 8 else 0)
assert len(views("widget_prayer_icon")) == (0 if args.no_icons else args.rows)
if views("widget_grid_left"):
    for left, right in zip(rows[::2], rows[1::2]):
        x1, y1, x2, y2 = bounds(left)
        x3, y3, x4, y4 = bounds(right)
        assert x2 <= x3 and y1 == y3 and y2 == y4, "Grid columns overlap or drift"
for row in rows:
    left, top, right, bottom = bounds(row)
    for node in row.iter("node"):
        if node.get("resource-id") in (
            "app.vaktija:id/widget_prayer_name", "app.vaktija:id/widget_prayer_time"
        ):
            x1, y1, x2, y2 = bounds(node)
            assert left <= x1 < x2 <= right and top <= y1 < y2 <= bottom, node.attrib
print(f"Passed: {args.rows} complete entries; icons {'hidden' if args.no_icons else 'visible'}")
