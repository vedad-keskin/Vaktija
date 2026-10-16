"""Build the A4 selection sheet from README-titles.md (requires reportlab)."""

import re
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path(__file__).with_name("README-titles.md")
OUTPUT = ROOT / "output/pdf/hisnul-muslim-titles-checklist.pdf"
FONT_DIR = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Arial", str(FONT_DIR / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(FONT_DIR / "arialbd.ttf")))


def wrap(text, font, size, width):
    lines = []
    current = ""
    for word in text.split():
        candidate = f"{current} {word}".strip()
        if current and pdfmetrics.stringWidth(candidate, font, size) > width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


sections = []
for line in SOURCE.read_text(encoding="utf-8").splitlines():
    if line.startswith("## "):
        bs, en = line[3:].split(" / ", 1)
        sections.append((bs, en, []))
    match = re.match(r"- \[ \] (?:(★|⚠) )?\[HM-(\d{3}) · (.*?)\]\([^)]+\)(.*)", line)
    if match:
        flag, number, title, tail = match.groups()
        bs, en = title.split(" / ", 1)
        kind = ""
        if "uputa / instruction" in tail:
            kind = " [uputa / instruction]"
        elif "predaja / narration" in tail:
            kind = " [predaja / narration]"
        sections[-1][2].append((int(number), bs, en + kind, flag, "in app" in tail))

numbers = [item[0] for _, _, entries in sections for item in entries]
assert len(sections) == 10
assert len(numbers) == len(set(numbers)) == 267
assert set(numbers) == set(range(1, 268))

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
pdf = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
pdf.setTitle("Hisnul Muslim - izbor naslova / Title checklist")
pdf.setAuthor("Vaktija research")
page_width, page_height = A4
left, right, bottom = 43, page_width - 43, 55
text_x = 133
text_width = right - text_x - 4
page = 0


def new_page():
    global page
    page += 1
    pdf.setFillColorRGB(0.12, 0.18, 0.22)
    pdf.setFont("Arial-Bold", 15)
    pdf.drawString(left, page_height - 45, "Hisnul Muslim - izbor naslova")
    pdf.setFont("Arial", 9)
    pdf.drawRightString(right, page_height - 43, "BS / EN  |  267 zapisa")
    pdf.setStrokeColorRGB(0.68, 0.7, 0.72)
    pdf.setLineWidth(0.5)
    pdf.line(left, page_height - 54, right, page_height - 54)
    pdf.setFont("Arial", 7.3)
    pdf.setFillColorRGB(0.33, 0.37, 0.4)
    pdf.drawString(left, 36, "Radni naslovi / Editorial titles - use published BS/EN text in the app")
    pdf.drawString(left, 25, "Brojevi: sunnah.com/hisn  |  OpenDua v0.0.4 (urednički podaci: CC BY 4.0)")
    pdf.drawRightString(right, 36, f"Strana {page}")
    return page_height - 67


def category(y, bs, en, continued=False):
    height = 35
    pdf.setFillColorRGB(0.91, 0.93, 0.94)
    pdf.rect(left, y - height, right - left, height, stroke=0, fill=1)
    pdf.setFillColorRGB(0.12, 0.18, 0.22)
    pdf.setFont("Arial-Bold", 10)
    pdf.drawString(left + 7, y - 14, bs + (" (nastavak)" if continued else ""))
    pdf.setFont("Arial", 8)
    pdf.drawString(left + 7, y - 27, en + (" (continued)" if continued else ""))
    return y - height


def row_height(item):
    _, bs, en, _, _ = item
    return 7 + 11 * len(wrap(bs, "Arial-Bold", 9, text_width)) + 10 * len(wrap(en, "Arial", 8.2, text_width))


def row(y, item):
    number, bs, en, flag, in_app = item
    bs_lines = wrap(bs, "Arial-Bold", 9, text_width)
    en_lines = wrap(en, "Arial", 8.2, text_width)
    height = row_height(item)
    center = y - height / 2
    pdf.setStrokeColorRGB(0.2, 0.25, 0.28)
    pdf.setLineWidth(0.8)
    pdf.rect(left + 4, center - 5, 10, 10, stroke=1, fill=0)
    pdf.setFont("Arial-Bold", 8.2)
    pdf.setFillColorRGB(0.12, 0.18, 0.22)
    pdf.drawString(left + 22, center - 3, f"HM-{number:03d}")
    if flag:
        pdf.setFont("Arial-Bold", 9)
        pdf.drawString(left + 65, center - 3, "*" if flag == "★" else "!")
    if in_app:
        pdf.setFont("Arial-Bold", 6)
        pdf.drawString(left + 73, center - 2, "APP")
    baseline = y - 11
    pdf.setFont("Arial-Bold", 9)
    for part in bs_lines:
        pdf.drawString(text_x, baseline, part)
        baseline -= 11
    pdf.setFont("Arial", 8.2)
    pdf.setFillColorRGB(0.3, 0.35, 0.38)
    for part in en_lines:
        pdf.drawString(text_x, baseline, part)
        baseline -= 10
    pdf.setStrokeColorRGB(0.86, 0.87, 0.88)
    pdf.setLineWidth(0.35)
    pdf.line(left, y - height, right, y - height)
    pdf.linkURL(f"https://sunnah.com/hisn:{number}", (left, y - height, right, y), relative=0)
    return y - height


y = new_page()
pdf.setFont("Arial", 8)
pdf.setFillColorRGB(0.2, 0.25, 0.28)
pdf.drawString(left, y - 2, "Kvadratići za izbor / Tick to select   |   * prvi krug / first pass   |   ! provjera izvora / source review")
pdf.drawString(left, y - 15, "APP = već u aplikaciji / already in app   |   Puni tekst: 3 provjerena zapisa / Full text: 3 verified entries")
y -= 30

for bs, en, entries in sections:
    if y - 35 - row_height(entries[0]) < bottom:
        pdf.showPage()
        y = new_page()
    y = category(y, bs, en)
    for item in entries:
        if y - row_height(item) < bottom:
            pdf.showPage()
            y = new_page()
            y = category(y, bs, en, continued=True)
        y = row(y, item)
    y -= 10

pdf.save()
print(f"Wrote {OUTPUT} ({page} A4 pages; {len(numbers)} checkboxes)")
