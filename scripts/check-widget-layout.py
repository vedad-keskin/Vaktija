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
parser.add_argument("--header", choices=("calendar-with-logo", "calendar", "compact"))
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
if args.header:
    city, = views("widget_city")
    date, = views("widget_date")
    divider, = views("widget_header_divider")
    assert bool(views("widget_logo")) == (args.header == "calendar-with-logo")
    for name in ("widget_weekday", "widget_calendar_month", "widget_calendar_year"):
        assert bool(views(name)) == (args.header != "compact"), name
    if args.header == "calendar-with-logo":
        logo, = views("widget_logo")
        weekday, = views("widget_weekday")
        logo_top, logo_bottom = bounds(logo)[1::2]
        stack_top, stack_bottom = bounds(city)[1], bounds(weekday)[3]
        assert abs(logo_bottom - logo_top - 0.8 * (stack_bottom - stack_top)) <= 2, "Logo height differs from header design"
        assert abs(logo_top + logo_bottom - stack_top - stack_bottom) <= 2, "Logo is off-center"
    assert bounds(city)[2] <= bounds(date)[0], "City and date overlap"
    assert max(bounds(city)[3], bounds(date)[3]) <= bounds(divider)[1], "Header overlaps the divider"
    assert bounds(divider)[3] <= bounds(rows[0])[1], "Divider overlaps the first prayer"
    body_divider = (views("widget_list_divider") or views("widget_grid_divider"))[0]
    for index in (0, 2):
        assert bounds(divider)[index] == bounds(body_divider)[index], "Divider edges differ"
    assert bounds(divider)[3] - bounds(divider)[1] == bounds(body_divider)[3] - bounds(body_divider)[1]
if views("widget_grid_left"):
    assert len(views("widget_grid_divider")) == args.rows // 2 - 1, "Wrong grid row dividers"
    assert len(views("widget_grid_column_divider")) == args.rows // 2, "Missing grid column dividers"
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
