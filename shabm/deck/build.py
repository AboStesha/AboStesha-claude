#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Assemble the SHABIM investor deck from the financial model output."""

import json, os, math

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

M = json.load(open(os.path.join(ROOT, "financials", "model_output.json"), encoding="utf-8"))
A = M["assumptions"]
U = M["units"]
FLAG = U["baghdad_own"]
FR = M["franchisor"]
SC = M["scenarios"]

# chart palettes — both validated with the dataviz validator (all six checks PASS)
LP = ["#0D8FCC", "#BF7A10", "#0A7350"]
DP = ["#2E9CC8", "#B8801F", "#1E9C7E"]


def usd(v, dp=0):
    """Accounting convention: negatives in parentheses, never a leading minus."""
    if v < 0:
        return f"(${abs(v):,.{dp}f})"
    return f"${v:,.{dp}f}"


def k(v):
    """Compact USD."""
    if abs(v) >= 1_000_000:
        return f"${v/1_000_000:,.2f}M"
    if abs(v) >= 1_000:
        return f"${v/1_000:,.0f}k"
    return f"${v:,.0f}"


def iqd(usd_val):
    """Menu prices are SET in dinars and converted to USD, not the other way round —
    so round back to the nearest 250 IQD, which is how a menu board is actually priced."""
    v = usd_val * A["fx"]["iqd_per_usd_parallel"]
    return f"{int(round(v / 250.0) * 250):,}"


# ══════════════════════════════════════════════════════════════════════════════
# SVG chart primitives — all hand-authored, theme-aware via CSS vars
# ══════════════════════════════════════════════════════════════════════════════

def svg_open(w, h, cls="", label=""):
    return (f'<svg viewBox="0 0 {w} {h}" class="cv {cls}" role="img" '
            f'aria-label="{label}" preserveAspectRatio="xMidYMid meet">')


def bar_chart(rows, w=760, h=330, pad_l=64, pad_b=46, pad_t=18, pad_r=16,
              fmt=lambda v: f"{v:,.0f}", label_every=1, series_color="var(--c1)",
              highlight=None, aria=""):
    """rows: [(label, value), ...] — vertical bars, direct-labelled."""
    vals = [v for _, v in rows]
    mx = max(vals) * 1.16 or 1
    iw = w - pad_l - pad_r
    ih = h - pad_t - pad_b
    n = len(rows)
    gap = max(6, iw / n * 0.30)
    bw = (iw - gap * (n - 1)) / n
    out = [svg_open(w, h, label=aria)]
    # gridlines
    for i in range(5):
        y = pad_t + ih * i / 4
        out.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{w-pad_r}" y2="{y:.1f}" class="grid"/>')
        out.append(f'<text x="{pad_l-10:.0f}" y="{y+4:.1f}" class="ax" text-anchor="end">{fmt(mx*(4-i)/4)}</text>')
    for i, (lab, v) in enumerate(rows):
        x = pad_l + i * (bw + gap)
        bh = max(2, ih * v / mx)
        y = pad_t + ih - bh
        col = highlight if (highlight and i == n - 1) else series_color
        out.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw:.1f}" height="{bh:.1f}" rx="4" '
                   f'fill="{col}"><title>{lab}: {fmt(v)}</title></rect>')
        if i % label_every == 0:
            out.append(f'<text x="{x+bw/2:.1f}" y="{y-7:.1f}" class="vl" text-anchor="middle">{fmt(v)}</text>')
        out.append(f'<text x="{x+bw/2:.1f}" y="{h-pad_b+20:.0f}" class="ax" text-anchor="middle">{lab}</text>')
    out.append(f'<line x1="{pad_l}" y1="{pad_t+ih:.1f}" x2="{w-pad_r}" y2="{pad_t+ih:.1f}" class="axis"/>')
    out.append("</svg>")
    return "".join(out)


def dual_bar_line(months, bars, line, w=800, h=360, aria=""):
    """Monthly transactions (bars) with the temperature curve as a separate,
    clearly-labelled overlay — same axis family, no second y-scale claim."""
    pad_l, pad_r, pad_t, pad_b = 56, 56, 22, 52
    iw, ih = w - pad_l - pad_r, h - pad_t - pad_b
    mxb = max(bars) * 1.18
    mxl, mnl = max(line), 0
    n = len(months)
    gap = iw / n * 0.28
    bw = (iw - gap * (n - 1)) / n
    o = [svg_open(w, h, label=aria)]
    for i in range(5):
        y = pad_t + ih * i / 4
        o.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{w-pad_r}" y2="{y:.1f}" class="grid"/>')
        o.append(f'<text x="{pad_l-9}" y="{y+4:.1f}" class="ax" text-anchor="end">{mxb*(4-i)/4:,.0f}</text>')
    for i, (m, v) in enumerate(zip(months, bars)):
        x = pad_l + i * (bw + gap)
        bh = max(2, ih * v / mxb)
        y = pad_t + ih - bh
        o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw:.1f}" height="{bh:.1f}" rx="4" fill="var(--c1)">'
                 f'<title>{m}: {v:,.0f} transactions/day</title></rect>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{h-pad_b+19}" class="ax" text-anchor="middle">{m}</text>')
    pts = []
    for i, t in enumerate(line):
        x = pad_l + i * (bw + gap) + bw / 2
        y = pad_t + ih - ih * (t - mnl) / (mxl - mnl) * 0.92
        pts.append((x, y))
    d = " ".join(f"{'M' if i == 0 else 'L'}{x:.1f},{y:.1f}" for i, (x, y) in enumerate(pts))
    o.append(f'<path d="{d}" fill="none" stroke="var(--c2)" stroke-width="2.5" stroke-linejoin="round"/>')
    for (x, y), t in zip(pts, line):
        o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4.5" fill="var(--c2)" stroke="var(--surface)" stroke-width="2">'
                 f'<title>{t}°C average high</title></circle>')
    for i in (4, 6, 11):
        x, y = pts[i]
        o.append(f'<text x="{x:.1f}" y="{y-11:.1f}" class="vl2" text-anchor="middle">{line[i]}°C</text>')
    o.append(f'<line x1="{pad_l}" y1="{pad_t+ih:.1f}" x2="{w-pad_r}" y2="{pad_t+ih:.1f}" class="axis"/>')
    o.append("</svg>")
    return "".join(o)


def stacked_pnl(years, w=800, h=380, aria=""):
    """Revenue bar with the EBITDA share drawn inside it — one scale, no dual axis."""
    pad_l, pad_r, pad_t, pad_b = 74, 16, 26, 56
    iw, ih = w - pad_l - pad_r, h - pad_t - pad_b
    mx = max(y["gross_revenue"] for y in years) * 1.18
    n = len(years)
    gap = iw / n * 0.34
    bw = (iw - gap * (n - 1)) / n
    o = [svg_open(w, h, label=aria)]
    for i in range(5):
        y = pad_t + ih * i / 4
        o.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{w-pad_r}" y2="{y:.1f}" class="grid"/>')
        o.append(f'<text x="{pad_l-9}" y="{y+4:.1f}" class="ax" text-anchor="end">{k(mx*(4-i)/4)}</text>')
    for i, yr in enumerate(years):
        x = pad_l + i * (bw + gap)
        rh = ih * yr["gross_revenue"] / mx
        eh = ih * max(0, yr["ebitda"]) / mx
        ry = pad_t + ih - rh
        o.append(f'<rect x="{x:.1f}" y="{ry:.1f}" width="{bw:.1f}" height="{rh:.1f}" rx="4" fill="var(--c1)" opacity=".26">'
                 f'<title>Year {yr["year"]} revenue {usd(yr["gross_revenue"])}</title></rect>')
        o.append(f'<rect x="{x:.1f}" y="{pad_t+ih-eh:.1f}" width="{bw:.1f}" height="{eh:.1f}" rx="4" fill="var(--c3)">'
                 f'<title>Year {yr["year"]} EBITDA {usd(yr["ebitda"])} ({yr["ebitda_margin"]*100:.0f}%)</title></rect>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{ry-9:.1f}" class="vl" text-anchor="middle">{k(yr["gross_revenue"])}</text>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{pad_t+ih-eh/2+5:.1f}" class="vl-in" text-anchor="middle">{yr["ebitda_margin"]*100:.0f}%</text>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{h-pad_b+21}" class="ax" text-anchor="middle">Y{yr["year"]}</text>')
    o.append(f'<line x1="{pad_l}" y1="{pad_t+ih:.1f}" x2="{w-pad_r}" y2="{pad_t+ih:.1f}" class="axis"/>')
    o.append("</svg>")
    return "".join(o)


def hbar(rows, w=760, h=None, fmt=lambda v: f"{v:,.0f}", pad_l=190, aria="", accent_last=False):
    """rows: [(label, value, note)] — horizontal bars for ranked comparisons."""
    n = len(rows)
    rowh = 40
    h = h or (n * rowh + 30)
    iw = w - pad_l - 130
    mx = max(v for _, v, _ in rows) or 1
    o = [svg_open(w, h, label=aria)]
    for i, (lab, v, note) in enumerate(rows):
        y = 14 + i * rowh
        bl = iw * v / mx
        col = "var(--c2)" if (accent_last and i == n - 1) else "var(--c1)"
        o.append(f'<text x="{pad_l-14}" y="{y+18}" class="rl" text-anchor="end">{lab}</text>')
        o.append(f'<rect x="{pad_l}" y="{y+4}" width="{max(3,bl):.1f}" height="22" rx="4" fill="{col}">'
                 f'<title>{lab}: {fmt(v)}</title></rect>')
        o.append(f'<text x="{pad_l+max(3,bl)+10:.1f}" y="{y+20}" class="vl">{fmt(v)}'
                 f'{f"  ·  {note}" if note else ""}</text>')
    o.append("</svg>")
    return "".join(o)


def heat_strip(cities, w=790, aria=""):
    """cities: [(name, [12 monthly highs])] — a calendar heat band per city."""
    pad_l, cell, gap, rowh = 132, 48, 3, 34
    h = len(cities) * rowh + 46
    o = [svg_open(w, h, label=aria)]
    months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
    for j, m in enumerate(months):
        o.append(f'<text x="{pad_l + j*(cell+gap) + cell/2:.1f}" y="16" class="ax" text-anchor="middle">{m}</text>')
    for i, (name, temps) in enumerate(cities):
        y = 26 + i * rowh
        o.append(f'<text x="{pad_l-12}" y="{y+17}" class="rl" text-anchor="end">{name}</text>')
        for j, t in enumerate(temps):
            x = pad_l + j * (cell + gap)
            # sequential ramp, one hue, light -> dark. 14C .. 48C
            u = min(1, max(0, (t - 14) / 34))
            o.append(f'<rect x="{x:.1f}" y="{y}" width="{cell}" height="24" rx="3" '
                     f'fill="var(--c2)" fill-opacity="{0.10 + 0.90*u:.3f}">'
                     f'<title>{name}, month {j+1}: {t}°C average high</title></rect>')
            if t >= 40:
                o.append(f'<text x="{x+cell/2:.1f}" y="{y+16}" class="cell-hot" text-anchor="middle">{t}</text>')
    o.append("</svg>")
    return "".join(o)


def scenario_chart(w=780, h=300, aria=""):
    order = [("Bear", "bear"), ("Heat thesis fails", "stress_heat_fails"),
             ("Dinar shock", "stress_fx"), ("Base", "base"), ("Bull", "bull")]
    pad_l, pad_r, pad_t, pad_b = 66, 20, 22, 74
    iw, ih = w - pad_l - pad_r, h - pad_t - pad_b
    vals = [SC[key]["y2_ebitda"] for _, key in order]
    mx = max(vals) * 1.22
    n = len(order)
    gap = iw / n * 0.34
    bw = (iw - gap * (n - 1)) / n
    o = [svg_open(w, h, label=aria)]
    for i in range(5):
        y = pad_t + ih * i / 4
        o.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{w-pad_r}" y2="{y:.1f}" class="grid"/>')
        o.append(f'<text x="{pad_l-9}" y="{y+4:.1f}" class="ax" text-anchor="end">{k(mx*(4-i)/4)}</text>')
    for i, (lab, key) in enumerate(order):
        s = SC[key]
        x = pad_l + i * (bw + gap)
        bh = max(2, ih * s["y2_ebitda"] / mx)
        y = pad_t + ih - bh
        col = "var(--c1)" if key == "base" else ("var(--c3)" if key == "bull" else "var(--c2)")
        o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw:.1f}" height="{bh:.1f}" rx="4" fill="{col}">'
                 f'<title>{lab}: EBITDA {usd(s["y2_ebitda"])}, {s["y2_margin"]*100:.0f}% margin</title></rect>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{y-8:.1f}" class="vl" text-anchor="middle">{k(s["y2_ebitda"])}</text>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{h-pad_b+20}" class="ax" text-anchor="middle">{lab}</text>')
        pb = s["payback_months"]
        pbs = f"{pb:.0f} mo" if pb else "&gt;60 mo"
        o.append(f'<text x="{x+bw/2:.1f}" y="{h-pad_b+38}" class="ax dim" text-anchor="middle">payback {pbs}</text>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{h-pad_b+54}" class="ax dim" text-anchor="middle">IRR {s["irr_5y"]:.0f}%</text>')
    o.append(f'<line x1="{pad_l}" y1="{pad_t+ih:.1f}" x2="{w-pad_r}" y2="{pad_t+ih:.1f}" class="axis"/>')
    o.append("</svg>")
    return "".join(o)


def growth_chart(w=800, h=340, aria=""):
    """Franchisor system sales (area) + unit count (labelled)."""
    pad_l, pad_r, pad_t, pad_b = 74, 58, 26, 56
    iw, ih = w - pad_l - pad_r, h - pad_t - pad_b
    ys = FR["years"]
    mx = max(y["system_sales"] for y in ys) * 1.16
    n = len(ys)
    step = iw / (n - 1)
    pts = [(pad_l + i * step, pad_t + ih - ih * y["system_sales"] / mx) for i, y in enumerate(ys)]
    o = [svg_open(w, h, label=aria)]
    for i in range(5):
        y = pad_t + ih * i / 4
        o.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{w-pad_r}" y2="{y:.1f}" class="grid"/>')
        o.append(f'<text x="{pad_l-9}" y="{y+4:.1f}" class="ax" text-anchor="end">{k(mx*(4-i)/4)}</text>')
    area = f'M{pts[0][0]:.1f},{pad_t+ih:.1f} ' + " ".join(f"L{x:.1f},{y:.1f}" for x, y in pts) + \
           f' L{pts[-1][0]:.1f},{pad_t+ih:.1f} Z'
    o.append(f'<path d="{area}" fill="var(--c1)" opacity=".16"/>')
    o.append('<path d="' + " ".join(f"{'M' if i==0 else 'L'}{x:.1f},{y:.1f}" for i, (x, y) in enumerate(pts)) +
             '" fill="none" stroke="var(--c1)" stroke-width="2.5"/>')
    for i, ((x, y), yr) in enumerate(zip(pts, ys)):
        o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="var(--c1)" stroke="var(--surface)" stroke-width="2">'
                 f'<title>Year {yr["year"]}: system sales {usd(yr["system_sales"])}, {yr["units_total"]} units</title></circle>')
        o.append(f'<text x="{x:.1f}" y="{y-13:.1f}" class="vl" text-anchor="middle">{k(yr["system_sales"])}</text>')
        o.append(f'<text x="{x:.1f}" y="{h-pad_b+21}" class="ax" text-anchor="middle">Y{yr["year"]}</text>')
        o.append(f'<text x="{x:.1f}" y="{h-pad_b+38}" class="ax dim" text-anchor="middle">{yr["units_total"]} units</text>')
    o.append(f'<line x1="{pad_l}" y1="{pad_t+ih:.1f}" x2="{w-pad_r}" y2="{pad_t+ih:.1f}" class="axis"/>')
    o.append("</svg>")
    return "".join(o)


# ══════════════════════════════════════════════════════════════════════════════
# SVG illustration — the brand's own drawings, authored not generated
# ══════════════════════════════════════════════════════════════════════════════

def cube_scene(idx="a", winter=False):
    """The store: a monolithic block of ice on a plinth, melting onto the pavement."""
    g = "w" if winter else "s"
    glow = "var(--sun)" if winter else "var(--glacier-lift)"
    core = "var(--sun)" if winter else "var(--glacier)"
    return f'''
<svg viewBox="0 0 640 460" class="cv scene" role="img"
     aria-label="Elevation of the SHABIM store: a monolithic block of clear ice on a steel plinth, lit from within, with meltwater spreading across the pavement.">
 <defs>
  <linearGradient id="face{idx}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="{core}" stop-opacity=".40"/>
    <stop offset="55%" stop-color="{core}" stop-opacity=".16"/>
    <stop offset="100%" stop-color="{glow}" stop-opacity=".62"/>
  </linearGradient>
  <linearGradient id="side{idx}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="{core}" stop-opacity=".52"/>
    <stop offset="100%" stop-color="{core}" stop-opacity=".24"/>
  </linearGradient>
  <linearGradient id="top{idx}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="{glow}" stop-opacity=".55"/>
    <stop offset="100%" stop-color="{core}" stop-opacity=".28"/>
  </linearGradient>
  <radialGradient id="halo{idx}" cx="50%" cy="82%" r="62%">
    <stop offset="0%" stop-color="{glow}" stop-opacity=".55"/>
    <stop offset="100%" stop-color="{glow}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="melt{idx}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="{glow}" stop-opacity=".42"/>
    <stop offset="100%" stop-color="{glow}" stop-opacity="0"/>
  </linearGradient>
 </defs>

 <!-- ground glow + meltwater -->
 <ellipse cx="322" cy="404" rx="252" ry="42" fill="url(#halo{idx})"/>
 <ellipse cx="322" cy="405" rx="196" ry="24" fill="url(#melt{idx})"/>
 <path d="M150 406 Q220 396 322 398 T496 407 Q420 419 322 418 T150 406 Z" fill="{glow}" opacity=".22"/>

 <!-- plinth -->
 <path d="M148 392 L496 392 L470 406 L174 406 Z" fill="var(--ink-3)" opacity=".34"/>
 <rect x="174" y="386" width="296" height="8" rx="2" fill="var(--ink-3)" opacity=".5"/>

 <!-- top face -->
 <path d="M196 96 L470 96 L512 128 L238 128 Z" fill="url(#top{idx})" stroke="{glow}" stroke-opacity=".45" stroke-width="1"/>
 <!-- right face -->
 <path d="M470 96 L512 128 L512 356 L470 388 Z" fill="url(#side{idx})" stroke="{glow}" stroke-opacity=".4" stroke-width="1"/>
 <!-- front face -->
 <path d="M196 96 L470 96 L470 388 L196 388 Z" fill="url(#face{idx})" stroke="{glow}" stroke-opacity=".55" stroke-width="1.2"/>

 <!-- internal fractures: irregular, never symmetric -->
 <g stroke="{glow}" stroke-opacity=".40" stroke-width="1" fill="none" stroke-linecap="round">
  <path d="M236 118 L268 196 L246 244 L282 320"/>
  <path d="M268 196 L322 176 L360 214"/>
  <path d="M418 122 L392 190 L424 236 L404 300 L432 356"/>
  <path d="M392 190 L340 208"/>
  <path d="M214 300 L262 286 L246 244"/>
  <path d="M470 168 L492 152" stroke-opacity=".3"/>
  <path d="M470 268 L500 250" stroke-opacity=".3"/>
 </g>
 <g fill="{glow}" opacity=".25">
  <ellipse cx="300" cy="150" rx="3.5" ry="6"/><ellipse cx="352" cy="262" rx="2.5" ry="5"/>
  <ellipse cx="256" cy="340" rx="3" ry="5.5"/><ellipse cx="412" cy="330" rx="2.5" ry="4.5"/>
  <ellipse cx="386" cy="140" rx="2" ry="4"/>
 </g>

 <!-- serving aperture -->
 <rect x="252" y="216" width="162" height="96" rx="4" fill="var(--ground)" opacity=".82"/>
 <rect x="252" y="216" width="162" height="96" rx="4" fill="none" stroke="{glow}" stroke-width="1.6" stroke-opacity=".9"/>
 <rect x="252" y="300" width="162" height="12" rx="2" fill="{glow}" opacity=".8"/>
 <g opacity=".55" fill="var(--ink-2)">
   <rect x="272" y="248" width="16" height="44" rx="2"/>
   <rect x="296" y="258" width="26" height="34" rx="3"/>
   <rect x="332" y="240" width="12" height="52" rx="2"/>
   <rect x="356" y="264" width="34" height="28" rx="3"/>
 </g>

 <!-- the light spilling out of the aperture -->
 <path d="M252 312 L414 312 L474 388 L192 388 Z" fill="{glow}" opacity=".16"/>

 <!-- meltwater running down the front -->
 <g stroke="{glow}" stroke-width="1.4" stroke-opacity=".5" fill="none" stroke-linecap="round">
  <path d="M222 130 L222 386"/><path d="M448 112 L448 386" stroke-opacity=".32"/>
  <path d="M204 210 L204 386" stroke-opacity=".28"/>
 </g>
 <g fill="{glow}">
  <circle cx="222" cy="392" r="2.6" opacity=".8"/><circle cx="448" cy="396" r="2" opacity=".55"/>
 </g>
</svg>'''


def _icon(paths, extra=""):
    return (f'<svg viewBox="0 0 64 64" class="ico" aria-hidden="true" fill="none" '
            f'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{paths}{extra}</svg>')


ICONS = {
 # frosted tumbler, vapour spilling over the rim
 "saqee80": _icon('''<path d="M20 20h24l-3 30a4 4 0 0 1-4 3.6H27a4 4 0 0 1-4-3.6z"/>
   <path d="M22.4 33h19.2" stroke-opacity=".45"/>
   <path d="M17 16c2.6-2.4 5.6-1.2 7.4.4M40 15c2.4-2.6 6-2 8 .2M28 12.6c2-2 5.4-1.8 7.2.4" stroke-opacity=".75"/>
   <path d="M26 43c1.6-3.4 4.4-5 8.4-4.6" stroke-opacity=".5"/>'''),
 # a block with a cylindrical bore
 "qalab": _icon('''<path d="M12 22 44 22 52 15 20 15z"/><path d="M44 22v27l8-7V15z"/><path d="M12 22h32v27H12z"/>
   <ellipse cx="28" cy="27" rx="9" ry="3.4"/><path d="M19 27v13c0 1.9 4 3.4 9 3.4s9-1.5 9-3.4V27"/>
   <path d="M19 34c0 1.9 4 3.4 9 3.4s9-1.5 9-3.4" stroke-opacity=".45"/>'''),
 # the round cold pan with rolls
 "lafaif": _icon('''<ellipse cx="32" cy="38" rx="22" ry="10"/>
   <path d="M10 38v4c0 5.5 9.8 10 22 10s22-4.5 22-10v-4"/>
   <ellipse cx="24" cy="35" rx="3.6" ry="6" transform="rotate(-14 24 35)"/>
   <ellipse cx="32" cy="34" rx="3.6" ry="6" transform="rotate(-4 32 34)"/>
   <ellipse cx="40" cy="35" rx="3.6" ry="6" transform="rotate(8 40 35)"/>
   <path d="M17 20c2.4-2.2 5-1 6.6.4M38 18c2.2-2.4 5.6-1.8 7.4.2" stroke-opacity=".6"/>'''),
 # moulded fruit in a compartment grid
 "jana": _icon('''<rect x="10" y="16" width="44" height="34" rx="3"/>
   <path d="M10 33h44M25 16v34M39 16v34" stroke-opacity=".4"/>
   <circle cx="17.5" cy="24.5" r="5"/><path d="M32 19.6c3 0 5 2.2 5 5s-2.2 5.4-5 5.4-5-2.4-5-5.4 2-5 5-5z"/>
   <circle cx="46.5" cy="24.5" r="5"/>
   <circle cx="17.5" cy="41.5" r="5"/><circle cx="32" cy="41.5" r="5"/><circle cx="46.5" cy="41.5" r="5"/>
   <path d="M17.5 18v-2.6M32 18.2v-2.8M46.5 18v-2.6" stroke-opacity=".6"/>'''),
 # crushed ice in a tall cup
 "barad": _icon('''<path d="M21 17h22l-2.6 33a4 4 0 0 1-4 3.7h-8.8a4 4 0 0 1-4-3.7z"/>
   <path d="M25 27l3.4-3.4 3.6 3.4 3.6-3.4 3.4 3.4M24.4 35l3.6-3.4 3.6 3.4 3.6-3.4 3.4 3.4" stroke-opacity=".55"/>
   <path d="M33 17V8M33 8l5-3M33 8l-5-3" stroke-opacity=".7"/>'''),
 # a warm cup, steam rising — winter
 "kanun": _icon('''<path d="M14 26h30v14a11 11 0 0 1-11 11h-8a11 11 0 0 1-11-11z"/>
   <path d="M44 30h4.6a5.4 5.4 0 0 1 0 10.8H44"/>
   <path d="M22 18c2.4-2.4 1.6-5-.4-6.8M31 18c2.4-2.4 1.6-5-.4-6.8M40 18c2.4-2.4 1.6-5-.4-6.8" stroke-opacity=".75"/>
   <path d="M11 55h36" stroke-opacity=".45"/>'''),
}


def pack_family():
    """The packaging system drawn as silhouettes with the crystal facet pressed in."""
    return '''
<svg viewBox="0 0 700 250" class="cv" role="img"
     aria-label="The SHABIM packaging family: a faceted cold cup, a squat sorbet cup, an ice-block service tray, and the nine-piece Jana box.">
 <defs>
  <linearGradient id="pk" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0%" stop-color="var(--glacier)" stop-opacity=".26"/>
   <stop offset="100%" stop-color="var(--glacier)" stop-opacity=".07"/>
  </linearGradient>
 </defs>
 <g stroke="var(--glacier)" stroke-opacity=".7" fill="url(#pk)" stroke-width="1.4">
  <!-- tall faceted cold cup -->
  <path d="M46 60h84l-9 148a14 14 0 0 1-14 12.6H69A14 14 0 0 1 55 208z"/>
  <path d="M40 52h96v10H40z"/>
  <path d="M52 100l17-9 18 9 18-9 17 9M55 140l16-9 18 9 18-9 16 9M60 180l14-8 16 8 16-8 14 8"
        stroke-opacity=".38" fill="none"/>
  <!-- squat sorbet cup -->
  <path d="M190 108h80l-7 96a13 13 0 0 1-13 11.6h-40A13 13 0 0 1 197 204z"/>
  <path d="M184 100h92v9h-92z"/>
  <path d="M196 148l16-8 16 8 16-8 16 8" stroke-opacity=".38" fill="none"/>
  <!-- the ice block on its tray -->
  <path d="M320 118h96v78h-96z"/><path d="M416 118l22-16v78l-22 16z"/><path d="M320 118l22-16h96l-22 16z"/>
  <ellipse cx="368" cy="130" rx="24" ry="8" fill="none"/>
  <path d="M344 130v44c0 5 11 9 24 9s24-4 24-9v-44" fill="none" stroke-opacity=".6"/>
  <path d="M306 210h124l-10 12H316z" stroke-opacity=".8"/>
  <!-- the nine-piece Jana box -->
  <path d="M478 116h176v96H478z"/><path d="M478 116l20-16h176l-20 16M654 116l20-16v96l-20 16"/>
  <path d="M478 148h176M478 180h176M537 116v96M596 116v96" stroke-opacity=".33" fill="none"/>
  <g fill="var(--glacier)" fill-opacity=".24" stroke-opacity=".5">
   <circle cx="507" cy="132" r="10"/><circle cx="566" cy="132" r="10"/><circle cx="625" cy="132" r="10"/>
   <circle cx="507" cy="164" r="10"/><circle cx="566" cy="164" r="10"/><circle cx="625" cy="164" r="10"/>
   <circle cx="507" cy="196" r="10"/><circle cx="566" cy="196" r="10"/><circle cx="625" cy="196" r="10"/>
  </g>
 </g>
 <g class="pk-lab" text-anchor="middle">
  <text x="88" y="243">Cold cup 16oz</text><text x="230" y="243">Sorbet cup</text>
  <text x="372" y="243">Al-Qālab tray</text><text x="566" y="243">Janā box · 9</text>
 </g>
</svg>'''




# ══════════════════════════════════════════════════════════════════════════════
# CONTENT
# ══════════════════════════════════════════════════════════════════════════════

MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
MON_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
BAGHDAD_HIGHS = [16, 19, 24, 30, 37, 42, 45, 45, 41, 33, 24, 17]

PRODUCTS = [
 dict(key="saqee80", ar="صَقيع ٨٠−", rom="SAQĪʿ −80", en="The −80 dirty latte",
      price=A["menu"]["saqee80"]["price_usd_baghdad"],
      body="A heavy-walled vessel is held at −80°C, lifted out with steel tongs, and cold milk is poured in. "
           "The milk flash-freezes into a white crust up the inner wall while the core stays liquid. A ristretto "
           "is poured through it and carves a dark channel. Nothing is diluted, because there is no ice.",
      why="The proof that this works commercially already exists: Regulars in Melbourne sells around 600 glasses "
          "a day of a single −85°C drink, and the format has queues measured in hours in Singapore and Tokyo. "
          "Nobody in Iraq or the Gulf is doing it.",
      spec=["−20°C pre-chill, then −80°C hold", "Served in tongs, on a chilled base", "75 seconds", "No ice, no dilution"]),
 dict(key="qalab", ar="القالَب", rom="AL-QĀLAB", en="Coffee inside the block",
      price=A["menu"]["qalab"]["price_usd_baghdad"],
      body="A block of crystal-clear ice, bored with a cylindrical cavity, is the cup. Coffee or tea goes into the "
           "block. It stays cold for over half an hour and dilutes almost not at all, because the melt surface is "
           "a fraction of what cubes give you. When the drink is gone, the block is eaten with a spoon.",
      why="Kobe's Nishimura Coffee has served this since 2016; Cafe 33 at the Hyatt Regency Kyoto charges ¥2,000 "
          "— about $13 — for it. It is the most photographed cold drink in Japan and it has never crossed into Arabic-speaking markets.",
      spec=["136 kg directional-freeze block", "≈35 vessels per block", "150 seconds", "Eaten at the end"]),
 dict(key="lafaif", ar="لَفائِف", rom="LAFĀʾIF", en="Rolled ice cream",
      price=A["menu"]["lafaif"]["price_usd_baghdad"],
      body="Liquid base is poured onto a −30°C steel pan, chopped with the fruit or chocolate the customer chose, "
           "spread thin, and scraped into tight rolls in front of them. Two minutes of theatre, made to order, "
           "no two portions identical.",
      why="The format's first viral cycle was 2015-2018 and it never properly landed in Iraq. It is the workhorse: "
          "it draws the crowd that films the −80, and it carries the family and kids occasion the coffee items cannot.",
      spec=["Twin −30°C pans", "Made to order, in view", "165 seconds", "Customer picks the mix-in"]),
 dict(key="jana", ar="جَنى", rom="JANĀ", en="Frozen fruit, in the shape of the fruit",
      price=A["menu"]["jana_box"]["price_usd_baghdad"],
      body="Fruit sorbet moulded and coloured into the exact form of the fruit it came from — strawberry, apricot, "
           "fig, lemon, blackberry, melon. It reads as fruit in the hand and breaks open to dense, bright sorbet. "
           "Sold as a single piece, or as a nine-piece box on crushed ice.",
      why="This is the only line that leaves the store: the box is a gift, a majlis offering, a Ramadan and Eid "
          "item, and a delivery product. It is also the one line that can later be sold through retail without a café.",
      spec=["Batch-produced, not to order", "Single or box of nine", "22 seconds to serve", "The take-home SKU"]),
 dict(key="barad", ar="بَرَد", rom="BARAD", en="Slush and cold-pressed juice",
      price=A["menu"]["radhadh"]["price_usd_baghdad"],
      body="Fresh-pressed juice and fruit slush — the everyday, high-frequency, low-consideration end of the menu. "
           "Pomegranate, orange, mango, mint-lemon.",
      why="Every destination brand needs an item that a customer buys twice a week without thinking. Barad is the "
          "frequency engine underneath the spectacle.",
      spec=["Pressed on site", "70 seconds", "The repeat-purchase line", "Priced against the street"]),
 dict(key="kanun", ar="كانون", rom="KĀNŪN", en="The winter menu",
      price=A["menu"]["kahraman"]["price_usd_baghdad"],
      body="From November the lighting shifts from 6500K white to 2700K amber, the ice-material surfaces glow like "
           "frozen honey instead of glacier, and the menu adds flat whites, Spanish lattes, hot chocolate, karak and "
           "Arabic coffee. The cold menu never leaves.",
      why="Baghdad's January high is 16°C. A pure ice concept would lose four months a year. Kānūn is why the "
          "model's winter floor is 73% of the annual average and not 45%.",
      spec=["2700K amber scheme", "Nov – Mar", "60 seconds", "Cold menu stays on"]),
]

VERSES = [
 dict(ar1="وا حَرَّ قَلْباهُ مِمَّنْ قَلْبُهُ شَبِمُ", ar2="وَمَنْ بِجِسْمي وَحالي عِندَهُ سَقَمُ",
      by="أبو الطيّب المتنبّي · «واحَرَّ قَلْباهُ» · البسيط، مِيمِيّة",
      gl="“Oh, the fever of my heart, for one whose heart is <b>cold</b>.” The only verse of the eight originally supplied that survived verification.",
      tag="VERIFIED"),
 dict(ar1="شُجَّتْ بِذي شَبَمٍ مِن ماءِ مَحنِيَةٍ", ar2="صافٍ بِأَبطَحَ أَضحى وَهْوَ مَشمولُ",
      by="كعب بن زهير · «بانَتْ سُعادُ» (قصيدة البُردة)، البيت الرابع · البسيط، لامِيّة",
      gl="“Mingled with <b>cold water</b> from a bend in the valley — clear, in a pebbled watercourse, chilled by the north wind.” Line 4 of the ode Kaʿb recited before the Prophet ﷺ. Lisān al-ʿArab cites this very line under the entry شبم.",
      tag="THE LEAD LINE"),
 dict(ar1="لَحمُ جَزورٍ سَنِمَةٍ، في غَداةٍ شَبِمَةٍ", ar2="بِشِفارٍ خَذِمَةٍ، في قُدورٍ هَزِمَةٍ",
      by="ابنة الخُسّ · سَجْع · منقول في «لسان العرب»، مادّة شبم",
      gl="Asked what the finest thing in the world was, she said: “The flesh of a fat-humped camel, on a <b>cold morning</b>, cut with keen blades, in pots that crackle.” The winter pack.",
      tag="KĀNŪN PACK"),
 dict(ar1="أَظَنَنْتَ ذا ثَلْجاً؟ وَذا", ar2="وَرْداً مِنَ الأَغْصانِ يُنْفَضْ",
      by="أبو بكر الصَّنَوْبَري · مجزوء الكامل، ضادِيّة",
      gl='“Did you take this for snow? No — roses shaken from the branches.” From the poet who invented '
         'snow-description in Arabic. The second half gives the winter menu its name — '
         '<b class="ar">وَالوَرْدُ في كانونَ أَبْيَض</b>',
      tag="SEASONAL"),
]

FAKES = ["الشريف الرضي", "الأخطل", "عنترة بن شداد", "ابن الرومي", "البحتري", "ذو الرمّة", "العباس بن الأحنف"]


def sec(n, act, ar, en, body, cls="", sub=""):
    return f'''<section class="s {cls}" id="s{n}">
 <div class="in">
  <div class="eyebrow"><span class="n">{act}</span><span class="act">{en}</span></div>
  <h2 class="title">{ar}</h2>
  {f'<p class="sub">{sub}</p>' if sub else ''}
  {body}
 </div>
</section>'''


def stat(v, kk, note="", cls=""):
    return (f'<div class="card stat"><span class="v {cls}">{v}</span>'
            f'<span class="k">{kk}</span>{f"<span class=note>{note}</span>" if note else ""}</div>')


def table(headers, rows, caption="", cls=""):
    th = "".join(f'<th class="{"n" if isinstance(h,tuple) else ""}">{h[0] if isinstance(h,tuple) else h}</th>' for h in headers)
    tb = ""
    for r in rows:
        rc = ""
        if (len(r) == 2 and isinstance(r[1], str) and r[1] in ("tot", "sub")
                and isinstance(r[0], (list, tuple))):
            r, rc = r[0], r[1]
        tds = "".join(f'<td class="{"n" if isinstance(c,tuple) else ""}">{c[0] if isinstance(c,tuple) else c}</td>' for c in r)
        tb += f'<tr class="{rc}">{tds}</tr>'
    cap = f"<caption>{caption}</caption>" if caption else ""
    return f'<div class="tw {cls}"><table><thead><tr>{th}</tr></thead><tbody>{tb}</tbody>{cap}</table></div>'


S = []

# ── ACT I ─────────────────────────────────────────────────────────────────────
S.append(sec(1, "I · 01", "شَبِم — بَرْدُ الماء", "THE NAME",
 f'''
 <div class="grid g23" style="align-items:start">
  <div>
    <p class="lede">Arabic has a general word for cold — <span class="ar">بارِد</span> — and it is used for weather, for
    food, for a person and for a joke. It also has one word that means the coldness that belongs specifically to
    <em>water</em>. That word is <span class="ar kicker">شَبِم</span>.</p>
    <div class="callout" style="margin-top:1.2rem">
      <p class="ar" style="font-family:var(--vs);font-size:var(--step-1);line-height:1.9">
      «الشَّبَمُ: بَرْدُ الماءِ. وماءٌ شَبِمٌ: بارِدٌ.»</p>
      <p style="margin-top:.4rem;font-size:var(--step--2);color:var(--ink-3)">
      لسان العرب، ابن منظور (ت ٧١١هـ)، مادّة «شبم» — <span class="en">“<i>al-shabam</i>: the coldness of water. And
      <i>māʾ shabim</i>: cold water.”</span></p>
    </div>
    <p class="lede">It is a word almost nobody uses in speech any more, which is exactly why it is available. It is
    unmistakably Arabic, it is unmistakably classical, and it means precisely and only the thing this business sells.</p>
    <p class="lede">Al-Mutanabbī put it in the most quoted opening hemistich in the language. The brand's name is
    already inside a line every educated Arab can finish.</p>
  </div>
  <div class="grid" style="gap:.8rem">
    {stat('شَبِم', 'The Arabic wordmark — always vocalised, kasra on the bāʾ','The diacritic is not decoration. It is what separates the brand from a medical homograph. See §26.')}
    {stat('SHABIM', 'The Latin wordmark','ALA-LC correct. Pronounced SHA-bim.')}
    {stat('SHBM', 'The monogram only','Four etched letters for lids, uniforms and the facade — never the spoken name.')}
  </div>
 </div>
 <div class="melt"></div>
 <div class="callout sun">
  <b>A change from the original brief.</b> The name was drafted as <span class="en">SHABM</span> in Latin. Verification
  says do not ship that. Three reasons, each independently sufficient: (1) no vowel between B and M means no
  English, French or Turkish speaker can pronounce it on sight — fatal for a franchise business that lives or dies on
  word of mouth; (2) the obvious fix, <span class="en">SHABAM</span>, sits one letter from <span class="en">SHIBAM</span> — the UNESCO city in
  Ḥaḍramawt <em>and</em> Shibam Coffee Co., a live Yemeni-coffee chain with a filed USPTO mark (97667800) in the same
  Nice classes; (3) <span class="en">SHABIM</span> is the ALA-LC transliteration of <span class="ar">شَبِم</span>, the exact vocalisation in
  al-Mutanabbī's line. Keep <span class="en">SHBM</span> as an etched monogram. Spend the name on <span class="en">SHABIM</span>.
 </div>''', cls="deep"))

S.append(sec(2, "I · 02", "الفكرة", "THE INSIGHT",
 f'''
 <div class="grid g3">
  {stat('134', 'days a year above 40°C in Baghdad', 'And ~46 days above 45°C. Record 51.8°C, 28 July 2020.')}
  {stat('63%', 'of Iraqis are under 30', 'Median age 20.9. Population 46,118,793 — 2024 census, the first in 37 years.')}
  {stat('85', 'branded coffee outlets in the whole of Iraq', 'One per ~542,000 people. Saudi Arabia has one per ~6,600.', 'sun')}
 </div>
 <p class="lede">Three facts that only look unrelated. Iraq is one of the hottest inhabited countries on earth, it is
 demographically the youngest large market in the Arab world, and its organised café sector barely exists —
 85 branded outlets against Saudi Arabia's 5,130. The category everyone else in the region is fighting over has not
 arrived here yet.</p>
 <p class="lede">Meanwhile the cold-drink product itself has been standing still. An iced latte in Baghdad in 2026 is
 the same object it was in 2016: espresso, milk, and a cup of ice cubes that dilute it to water in eleven minutes.
 In a city where the July average high is 45°C, that is not a product. It is a compromise everyone has agreed to
 stop noticing.</p>
 <div class="callout">
  <b>SHABIM is the answer to one question:</b> what does a cold drink look like if you design it for 48°C instead of
  apologising for it? Not a colder recipe — a colder <em>object</em>. A vessel at −80°C. A cup carved out of a block of
  ice. Fruit frozen into the shape of the fruit. And a building that is itself a block of ice, visibly melting on a
  Baghdad pavement.
 </div>''', cls="tint"))

S.append(sec(3, "I · 03", "ستّة خطوط", "THE MENU, IN SIX LINES",
 '<div class="grid g3" style="margin-top:.4rem">' +
 "".join(f'''<div class="prod">
   <div class="body">
     <div class="ico-wrap">{ICONS[p["key"]]}</div>
     <div class="name ar">{p["ar"]}</div>
     <div class="rom en">{p["rom"]} · {p["en"]}</div>
     <p class="desc">{p["body"]}</p>
     <div class="spec">{"".join(f'<span class="pill">{x}</span>' for x in p["spec"])}</div>
     <p class="desc" style="border-top:1px solid var(--hair-soft);padding-top:.6rem;margin-top:.3rem">
       <b style="color:var(--glacier)">Why it earns its place.</b> {p["why"]}</p>
     <div class="price"><span class="num">${p["price"]:.2f}</span>
       <span class="pu">Baghdad · {iqd(p["price"])} IQD</span></div>
   </div>
 </div>''' for p in PRODUCTS) + '</div>' +
 '''<div class="callout" style="margin-top:1.4rem">
   <b>The menu is built as a barbell, deliberately.</b> Two slow, expensive, unrepeatable spectacle items
   (<span class="ar">صَقيع ٨٠−</span>, <span class="ar">القالَب</span>) generate the footage and the queue. Two fast, cheap, high-frequency lines
   (<span class="ar">بَرَد</span>, <span class="ar">جَنى</span>) generate the repeat visit. One line (<span class="ar">لَفائِف</span>) brings families and children.
   One line (<span class="ar">كانون</span>) keeps the doors worth opening in January. Take any one away and something structural breaks.
 </div>''', cls=""))

# ── ACT II — THE MARKET ───────────────────────────────────────────────────────
S.append(sec(4, "II · 04", "لماذا العراق أوّلاً", "WHY IRAQ FIRST",
 f'''
 <p class="sub">The white space is not a projection. It is a count.</p>
 <figure class="chart">
  <div class="legend"><span><i style="background:var(--c1)"></i>People per branded coffee outlet — lower is a more served market</span></div>
  {hbar([
    ("Saudi Arabia", 6600, "5,130 outlets"),
    ("UAE", 5000, "9,000+ cafés · Dubai alone 3,257"),
    ("MENA average", 26000, "11,163 branded outlets"),
    ("Iraq", 542000, "85 outlets"),
  ], fmt=lambda v: f"{v:,.0f}", aria="People per branded coffee outlet: Saudi Arabia 6,600; UAE about 5,000; MENA average 26,000; Iraq 542,000.", accent_last=True)}
  <figcaption>Sources: Project Café Middle East 2025, World Coffee Portal (MENA 11,163 branded outlets, +11.2% year on year,
  forecast 16,460 by Nov 2029; Saudi 5,130 = 46% of the region; Iraq 85 outlets, 13th largest MENA market, forecast &gt;130 by
  end-2029). Population from the Iraq 2024 census and national statistics. Iraq's ratio is roughly <b>80× less served</b> than Saudi Arabia's.</figcaption>
 </figure>
 <div class="grid g2" style="margin-top:1.6rem">
   <div class="card">
     <div class="cap">The market is being validated right now — by other people</div>
     <ul class="ticks">
       <li><b>Half Million</b>, the Riyadh chain that went 0 → 59 stores across 14 Saudi cities in seven years, is opening its first Iraq store at Iraq Mall, Baghdad.</li>
       <li><b>%Arabica</b> has expanded to Baghdad. <b>Kyan Café</b> (Saudi) opened its first Iraq outlet. Segafredo, Mikel and Espressolab are all in.</li>
       <li><b>Iraq Mall</b> opened in Al-Dora in February 2026: over 550,000 m², 1,000+ retail units — the largest mall in Iraq and third largest in the Middle East.</li>
       <li>The <b>Baghdad Coffee &amp; Tea Festival</b> drew 62,000 visitors in 2024 and over 100,000 in 2025.</li>
       <li><b>The Grinders</b>, the leading Iraqi specialty chain, launched 2020 and is now at 17 branches.</li>
     </ul>
     <p class="desc" style="margin-top:.8rem">Regional operators have already decided Iraq is next. The question is
     not whether the market opens. It is who owns a category inside it before Alshaya-scale capital arrives.</p>
   </div>
   <div class="card">
     <div class="cap">And it is affordable to be first</div>
     {table(["", ("Baghdad",), ("Riyadh",), ("Dubai",)], [
       ["Monthly rent, 45 m² prime street", ("$2,000",), ("$4,600",), ("$6,200",)],
       ["Barista, monthly", ("$450",), ("$1,000",), ("$1,100",)],
       ["Store manager, monthly", ("$1,000",), ("$2,200",), ("$2,600",)],
       ["Replication CAPEX, one Cube", ("$265k",), ("$370k",), ("$402k",)],
       ["<b>Year-2 EBITDA margin, franchised</b>", ("<b>24%</b>",), ("<b>22%</b>",), ("<b>27%</b>",)],
     ], caption="Rent and wages are model inputs; see §29 for sourcing and confidence. CAPEX and EBITDA are model outputs.")}
     <p class="desc" style="margin-top:.8rem">Iraq is not the cheap option. It is the option where a
     brand can be <em>built</em> — where the cost of learning is low enough to get the format right before it is
     exported into markets where a mistake costs three times as much.</p>
   </div>
 </div>''', cls="deep"))

S.append(sec(5, "II · 05", "الحرارة هي السوق", "HEAT IS THE MARKET",
 f'''
 <p class="sub">Average daily high, by month. Every cell at or above 40°C is a month where a cold-drink brand is not
 competing with hot coffee — it is competing with dehydration.</p>
 <figure class="chart">
  {heat_strip([
    ("Basra, Iraq", [18,21,26,32,39,44,46,46,43,35,26,19]),
    ("Baghdad, Iraq", BAGHDAD_HIGHS),
    ("Kuwait City", [19,21,26,33,40,45,46,46,42,35,27,21]),
    ("Riyadh, KSA", [21,24,28,33,39,42,43,43,40,35,27,22]),
    ("Doha, Qatar", [22,23,27,32,39,42,42,41,39,35,30,25]),
    ("Dubai, UAE", [24,25,28,32,37,39,41,41,38,35,30,26]),
    ("Erbil, Iraq", [11,13,18,24,31,38,42,42,37,29,20,13]),
    ("Cairo, Egypt", [19,21,24,29,33,35,35,35,33,30,25,21]),
  ], aria="Heat map of average monthly high temperatures across eight target cities, showing four to five months above 40 degrees Celsius in Iraq and the Gulf.")}
  <figcaption>Baghdad's hot season runs 26 May – 21 September, 3.9 months with daily highs averaging above 38.9°C
  (Weather Spark). July and August average 45°C. In July 2025, thirteen Iraqi provinces exceeded 50°C.
  Basra's all-time record is 53.9°C.</figcaption>
 </figure>
 <div class="grid g3" style="margin-top:1.6rem">
   {stat('5', 'months a year where Baghdad is above 33°C','The trading peak. Model runs at 1.34–1.58× the annual average across May–September.')}
   {stat('16°C', 'Baghdad January average high','Which is why <span class="ar">كانون</span> exists. Winter is not a dead season; it is a different menu.', 'sun')}
   {stat('&gt;40', 'days a year at 48.9°C+ projected for Baghdad','Up from ~14 two decades ago (EU ISS). The thesis gets stronger, not weaker.')}
 </div>
 <div class="callout" style="margin-top:1.4rem">
  <b>The uncomfortable version of the same fact.</b> This is a business whose addressable market is expanding because
  the climate is deteriorating. We should be honest that we are selling relief from a problem that is getting worse,
  and that the same heat raises our own cooling costs — the model's <span class="en">stress_heat</span> case runs utilities
  80% higher and still clears {SC["stress_heat_fails"]["y2_margin"]*100:.0f}% EBITDA. Both things are true at once.
 </div>''', cls="warm"))

_bag_hh = A["markets"]["iraq"]
S.append(sec(6, "II · 06", "حجم السوق", "TAM · SAM · SOM",
 f'''
 <p class="sub">Built bottom-up from census households, not top-down from a market-research headline.</p>
 <div class="grid g3">
   {stat('$21.0B', 'Baghdad household expenditure per year', '9,780,429 people ÷ 5.9 per household × 1,467,000 IQD monthly spend (IHSES 2023/24), at the 1,530 parallel rate.')}
   {stat('$1.2B', 'Baghdad food-away-from-home — TAM', '32% food share of household spend, of which ~29% is consumed outside the home.')}
   {stat('$145–215M', 'Baghdad cold drinks &amp; frozen desserts — SAM', '12–18% of food-service spend. The upper end reflects the temperature premium.')}
 </div>
 <div class="grid g2" style="margin-top:1.6rem">
   <div class="card">
     <div class="cap">SOM — what SHABIM can actually take in Baghdad</div>
     {table(["Step", ("Value",)], [
       ["Baghdad residents under 30", ("≈6.0M",)],
       ["Monthly-customer penetration at maturity", ("5%",)],
       ["Visits per customer per year", ("24",)],
       ["Average ticket", ("$6.46",)],
       ["<b>Baghdad obtainable revenue, 5–7 years</b>", ("<b>≈$35M / yr</b>",)],
       ["Implied SHABIM network to serve it", ("≈45 Baghdad units",)],
       ["<b>Plan to Year 5 — Baghdad only</b>", ("<b>24 units</b>",)],
     ], caption="24 Baghdad units at their modelled revenues is about $10.9M — roughly a third of the obtainable Baghdad market. It is not a plan that requires the whole city.")}
   </div>
   <div class="card">
     <div class="cap">The regional prize, for scale</div>
     {table(["Market", ("Size",), "Source"], [
       ["MENA branded coffee shops", ("11,163 outlets",), "World Coffee Portal 2025, +11.2% y/y"],
       ["…forecast Nov 2029", ("16,460 outlets",), "8.1% CAGR"],
       ["Saudi coffee market", ("$1.4–2.7B",), "Renub / industry est. 2025-26"],
       ["Saudi specialty coffee", ("$0.95B → $2.11B",), "2025 → 2033, 10.5% CAGR"],
       ["UAE coffee market", ("$3.2B+",), "2025, growing 8–9% a year"],
       ["UAE specialty", ("$603M → $1.22B",), "2023 → 2030, 10.6% CAGR"],
       ["Egypt café market", ("$2.51B → $4.17B",), "2024 → 2033, 5.83% CAGR"],
     ], caption="SHABIM does not need to win the coffee market. It needs to own one adjacent category — engineered cold — inside it.")}
   </div>
 </div>''', cls=""))

# ── ACT III — THE BRAND ───────────────────────────────────────────────────────
S.append(sec(7, "III · 07", "الشِّعر على العبوة", "THE POETRY, AND WHAT VERIFICATION FOUND",
 f'''
 <p class="sub">The packaging carries classical Arabic verse containing the word <span class="ar">شبم</span>. Before a single line
 went to print, all eight of the verses originally selected were checked against the corpus. Seven of them do not exist.</p>
 <div class="grid g2" style="margin-top:1.2rem;align-items:start">
  <div class="card crit-card">
    <div class="cap">Verification scorecard — the eight supplied verses</div>
    <div class="score">
      <div class="sc-pass"><span class="sc-n">1</span><span>authentic, correctly attributed<br><b class="ar">أبو الطيّب المتنبّي</b></span></div>
      <div class="sc-fail"><span class="sc-n">7</span><span>not attested anywhere in the corpus</span></div>
    </div>
    <ul class="ticks crit">
      {"".join(f'<li class="ar">{f}</li>' for f in FAKES)}
    </ul>
    <p class="desc" style="margin-top:.8rem">The verse attributed to <span class="ar">عنترة</span> is provably not his: his
    Muʿallaqa rhymes in <span class="ar">ميم</span>, and the line rhymes in <span class="ar">باء</span>. The one attributed to
    <span class="ar">العباس بن الأحنف</span> uses <span class="ar">شَبائِم</span> — a plural of <span class="ar">شبم</span> that no
    dictionary lists and that returns zero corpus hits. The set has the signature of a chatbot: one real anchor verse,
    seven metrically competent pastiches, each attached to a famous name.</p>
    <p class="desc"><b>Why this belongs in an investor deck.</b> Printing fabricated classical poetry on packaging, in
    markets where every educated customer can check it in ten seconds, is a brand-ending error that costs nothing to
    avoid and everything to make. Catching it before print is the difference between heritage and decoration.</p>
  </div>
  <div class="grid" style="gap:.9rem">
   {"".join(f"""<div class="card q verse-card">
     <span class="pill acc">{v['tag']}</span>
     <div class="verse">
       <span class="half">{v['ar1']}</span><span class="dot">❊</span><span class="half">{v['ar2']}</span>
       <span class="by ar">{v['by']}</span>
       <span class="gl en">{v['gl']}</span>
     </div>
   </div>""" for v in VERSES)}
  </div>
 </div>
 <div class="grid g2" style="margin-top:1.4rem">
   <div class="callout">
     <b>The line that goes on every single pack.</b> <span class="ar" style="font-family:var(--vs)">«الشَّبَمُ: بَرْدُ الماءِ»</span>
     — <span class="ar">لسان العرب</span>. It is the brand's birth certificate, it is unfalsifiable, and it plants the correct
     meaning of the name before anyone reaches for a search engine.
   </div>
   <div class="callout crit">
     <b>Two texts that must never be printed.</b> <span class="ar">«خَيْرُ الماءِ الشَّبِمُ»</span> reads as a hadith and is quoted
     inside Lisān al-ʿArab itself — but al-Albānī graded it <span class="ar">مَوْضوع</span>, fabricated. Attributing it to the
     Prophet ﷺ would be a far graver offence in Gulf markets than a misquoted poet. And the most beautiful cold-water phrase in
     the entire language — <span class="ar">سورة ص، الآية ٤٢</span>, <i>&ldquo;here is a cool bath and a drink&rdquo;</i> — is
     for the same reason unusable: Qurʾānic text cannot go on a cup that ends up in a bin. Cited here, deliberately
     not reproduced.
   </div>
 </div>''', cls="deep"))

S.append(sec(8, "III · 08", "المبنى", "THE STORE IS THE PRODUCT",
 f'''
 <div class="grid g23" style="align-items:center">
   <div class="scene-wrap">{cube_scene("a")}</div>
   <div>
     <p class="lede">A block of ice, four metres on a side, sitting on a steel plinth on a Baghdad pavement, lit from
     inside, with meltwater spreading across the concrete around it. It is not a shop with an ice-themed interior. It
     is an object that looks like it should not survive the afternoon, and does.</p>
     <ul class="ticks" style="margin-top:1rem">
       <li><b>Facade:</b> cast acrylic (PMMA) blocks with a hand-chipped glacial texture over a steel frame, edge-lit
       so the internal fractures glow. UV-stable, 50°C-rated, replaceable panel by panel.</li>
       <li><b>Summer scheme:</b> 6500K cold white, high CRI, raking up through the block from concealed base LEDs.</li>
       <li><b>Winter scheme <span class="ar">كانون</span>:</b> the same fittings driven to 2700K amber. The material stops reading as
       glacier and starts reading as frozen honey. One DMX scene change, no rebuild.</li>
       <li><b>The melt:</b> a filtered, chilled, recirculating film across the plinth. Small volume, visible effect.</li>
     </ul>
     <div class="callout crit" style="margin-top:1rem">
       <b>The melt detail needs engineering, not just design.</b> Warm recirculated water in 45°C ambient is a
       Legionella risk, a slip hazard, and a municipal permission question about water on a public pavement. The
       specification is a chilled, dosed, closed-loop system with a drained catchment — or, where a landlord refuses
       it, a fog line and a cast-resin "frozen drip" that reads identically on camera. Budgeted either way.
     </div>
   </div>
 </div>
 <div class="melt"></div>
 <h3 class="sub-h">Four formats, one object</h3>
 {table(["Format", "Footprint", "Seats", "Where", ("CAPEX, Baghdad",), ("Y2 revenue",), ("Y2 EBITDA",)], [
   ["<b class='ar'>المُكَعَّب</b> · The Cube — flagship", "45 m² + 60 m² terrace", "44", "Street corner, Mansour / Karrada / Zayouna",
    (usd(FLAG["capex"]["total"]),), (usd(FLAG["years"][1]["gross_revenue"]),), (f'{usd(FLAG["years"][1]["ebitda"])} · {FLAG["years"][1]["ebitda_margin"]*100:.0f}%',)],
   ["<b class='ar'>المُكَعَّب</b> · The Cube — replication", "45 m² + 50 m²", "36", "The unit a franchisee buys",
    (usd(U["baghdad_fr"]["capex"]["total"]),), (usd(U["baghdad_fr"]["years"][1]["gross_revenue"]),), (f'{usd(U["baghdad_fr"]["years"][1]["ebitda"])} · {U["baghdad_fr"]["years"][1]["ebitda_margin"]*100:.0f}%',)],
   ["<b class='ar'>الشَّظِيَّة</b> · The Shard — kiosk", "16 m²", "0", "Iraq Mall, Baghdad Mall, Mansour Mall",
    (usd(U["baghdad_kiosk"]["capex"]["total"]),), (usd(U["baghdad_kiosk"]["years"][1]["gross_revenue"]),), (f'{usd(U["baghdad_kiosk"]["years"][1]["ebitda"])} · {U["baghdad_kiosk"]["years"][1]["ebitda_margin"]*100:.0f}%',)],
   ["<b class='ar'>العَرَبَة</b> · The Cart — mobile", "6 m²", "0", "Festivals, Arbaʿīn routes, corporate events", ("~$45k",), ("seasonal",), ("event-priced",)],
 ], caption="The Shard carries no ice plant. Kiosks are supplied carved blocks by the city's flagship Cube, which is what makes the network a supply chain rather than a logo licence.")}''', cls=""))

S.append(sec(9, "III · 09", "نظام العلامة", "IDENTITY SYSTEM",
 f'''
 <div class="grid g2" style="align-items:start">
  <div>
    <div class="cap">Palette</div>
    <p class="desc" style="margin-bottom:1rem">Thick ice is cyan because water absorbs the red end of the spectrum;
    the blue that survives the journey through the block is the brand's only real colour. Everything else is white,
    meltwater grey and steel — with one warm accent held in reserve for heat data and for <span class="ar">كانون</span>.</p>
    <div class="grid g4" style="gap:.6rem">
      {"".join(f'<div class="sw"><div class="chipc" style="background:{h}"></div><div class="meta"><div class="nm">{n}</div><div class="hx">{h}</div></div></div>'
               for n, h in [("جَليد Ice-white","#F4F9FC"),("نَهَر Glacier","#0E8CC4"),("قَرّ Deep freeze","#06131D"),("ذَوَبان Meltwater","#A8C6D6"),
                            ("كانون Amber","#C67B14"),("فَجْر Lift","#17A9E4"),("عُمْق Deep ice","#084F70"),("رَماد Shadow","#2C4655")])}
    </div>
  </div>
  <div>
    <div class="cap">Type</div>
    {table(["Role", "Face", "Why"], [
      ["Display · wordmark", "<b>Readex Pro</b>", "Arabic and Latin drawn together, geometric, engineered — reads as something machined, not handwritten."],
      ["Classical verse", "<b>Amiri</b>", "The finest freely-licensed Naskh; a revival of the Būlāq type. Verse set in a UI face is the tell of a brand decorating with heritage."],
      ["Body · data · numerals", "<b>IBM Plex Sans Arabic</b>", "Matched to IBM Plex Sans in Latin, with genuine tabular figures — which a financial appendix needs and most Arabic faces do not have."],
    ])}
    <div class="callout" style="margin-top:1rem">
      <b>Vocalise everything.</b> The wordmark is always <span class="ar">شَبِم</span>, never <span class="ar">شبم</span>. Every printed
      verse is fully pointed. The audience a brand courts with classical poetry is precisely the audience that notices
      when the poetry is half-pointed.
    </div>
  </div>
 </div>
 <div class="melt"></div>
 <div class="grid g23" style="align-items:center">
   <div>
     <div class="cap">Packaging</div>
     <p class="desc">Every vessel carries the same pressed crystal facet, so a cup photographed on a car dashboard is
     identifiable as SHABIM without a logo being legible. Clear and frosted rPET and PP; the box is matte white with a
     blind-embossed facet. Cold-activated thermochromic ink on the sleeve reveals the verse only when the drink is
     genuinely cold — the pack proves the product's claim.</p>
     <ul class="ticks">
       <li>Lockup on every surface: <span class="ar">شَبِم</span> · SHABIM · <span class="ar">بَرْدُ الماء</span></li>
       <li>Every verse cited: poet, poem, in small type. Citation is what separates heritage from decoration.</li>
       <li>The Lisān definition line, set small, at the base of every pack.</li>
     </ul>
   </div>
   <div>{pack_family()}</div>
 </div>''', cls="tint"))

S.append(sec(10, "III · 10", "لماذا يُصوَّر", "THE DISTRIBUTION IS THE PRODUCT",
 f'''
 <p class="sub">This brand does not buy reach. It manufactures reasons to be filmed, and every one of them is
 structurally hard to copy.</p>
 <div class="grid g2">
   <div class="card">
     <div class="cap">The four filmable moments, and what makes each defensible</div>
     <ol class="steps">
       <li><b>Tongs out of the −80.</b> Cryogenic fog rolls over the counter; milk freezes to the glass in real time.
       Copying it needs a lab-grade ULT freezer, a two-stage pre-chill protocol, and a burn-safe serving SOP.</li>
       <li><b>Boring the block.</b> A cylinder driven into 136 kg of optically clear ice. Copying it needs a
       directional-freezing plant and three days of lead time per block.</li>
       <li><b>Scraping the rolls.</b> Familiar, fast, endlessly re-shootable — the everyday content that fills the
       weeks between the set-pieces.</li>
       <li><b>Breaking open the fruit.</b> A strawberry that is not a strawberry. The single most re-postable
       still image in the range, and the one that travels without the store.</li>
     </ol>
   </div>
   <div class="card">
     <div class="cap">What the evidence says about scale</div>
     <ul class="ticks">
       <li><b>FIX Dessert Chocolatier</b>, Dubai: one bar, viral December 2023, and in Q1 2025 alone 1.2 million bars
       sold through Dubai Duty Free — around <b>$22M of revenue</b> from a single point of sale.</li>
       <li><b>Regulars</b>, Melbourne: about <b>600 glasses a day</b> of one −85°C drink.</li>
       <li><b>Iraq's audience is already assembled.</b> 39.6M internet users, 23.6M on Instagram, 18.5M on Snapchat —
       the third-largest Snapchat market in MENA after Saudi and Egypt. A single Baghdad food account,
       <span class="en">@restaurants_of_baghdad</span>, carries 1.1M followers, and the whole Iraqi influencer sector
       is a $15–20M market, which means reach here is still cheap.</li>
       <li><b>And the mechanic that makes it last.</b> Crumbl rotates six flavours every week. It is the most
       transferable durability device in the whole case set, and SHABIM's version is already in the product:
       <span class="ar">جَنى</span> is fruit-led, so the range rotates with the Iraqi season by necessity — apricot in
       spring, watermelon and fig in high summer, pomegranate and quince in autumn. A reason to come back that is
       built into the supply chain rather than invented by marketing.</li>
     </ul>
     <div class="callout crit" style="margin-top:1rem">
       <b>And the honest counter-argument, with the actual numbers.</b> Capital-gated retail formats like this one
       have a documented peak-attention window of roughly <b>12–24 months</b>. Crumbl is the cautionary case, not the
       inspiration: it passed 1,000 locations, and then per-store average unit volume declined materially from its
       2021 peak with same-store sales negative through 2024. Rolled ice cream ran 2015–18 and was largely gone by
       2021. SHABIM's answer is structural rather than hopeful — the barbell menu means the spectacle recruits while
       <span class="ar">بَرَد</span> and <span class="ar">جَنى</span> retain, <span class="ar">كانون</span> holds the winter, the seasonal
       fruit rotation gives a reason to return, and the <span class="ar">جَنى</span> box outlives any single store. The
       bear case assumes the novelty does fade and still leaves the unit cash-positive every month.
     </div>
   </div>
 </div>''', cls=""))

# ── ACT IV — THE NUMBERS ──────────────────────────────────────────────────────
_b = FLAG["basket"]; _c = FLAG["capacity"]; _y2 = FLAG["years"][1]
S.append(sec(11, "IV · 11", "اقتصاد الوحدة", "UNIT ECONOMICS — WHAT ONE CUP DOES",
 f'''
 <p class="sub">Every price and every cost below is built from a sourced Baghdad input. The full derivation for each
 line is in the assumptions appendix.</p>
 {table(["Item", ("Price, Baghdad",), ("IQD",), ("COGS",), ("Gross margin",), ("Prep",), ("Share of revenue",)],
   [[f'<b class="ar">{p["ar"]}</b> <span class="en dim">{p["rom"]}</span>',
     (f'${A["menu"][sk]["price_usd_baghdad"]:.2f}',),
     (iqd(A["menu"][sk]["price_usd_baghdad"]),),
     (f'${A["menu"][sk]["cogs_usd_baghdad"]:.2f}',),
     (f'{(1-A["menu"][sk]["cogs_usd_baghdad"]/A["menu"][sk]["price_usd_baghdad"])*100:.0f}%',),
     (f'{A["menu"][sk]["prep_seconds"]}s',),
     (f'{A["formats"]["cube_flagship"]["mix"].get(sk,0)*100:.0f}%',)]
    for p, sk in [(PRODUCTS[0],"saqee80"),(PRODUCTS[1],"qalab"),(PRODUCTS[2],"lafaif"),
                  (PRODUCTS[3],"jana_box"),(PRODUCTS[4],"radhadh"),(PRODUCTS[5],"kahraman")]]
   + [(['<b>Blended basket</b>', ('<b>—</b>',), ('—',), ('—',),
        (f'<b>{_b["gross_margin_pct"]*100:.0f}%</b>',), (f'{_c["avg_item_prep_seconds"]:.0f}s avg',), ('100%',)], "tot")],
   caption="Share of revenue, not of units. Al-Qālab is 12% of revenue but only 5% of items — it is an anchor and a queue-magnet, not a volume driver.")}
 <div class="grid g4" style="margin-top:1.4rem">
   {stat(f'${_b["avg_ticket"]:.2f}', 'Average ticket', f'{iqd(_b["avg_ticket"])} IQD · {_b["items_per_ticket"]} items per transaction')}
   {stat(f'{_b["gross_margin_pct"]*100:.0f}%', 'Blended gross margin', 'Before waste. COGS runs 28% of gross revenue after waste and tax.')}
   {stat(f'{_c["peak_tx_per_hour"]}', 'Transactions per hour at peak', f'{_c["stations"]} production stations, {_c["avg_item_prep_seconds"]:.0f}s average item, 72% station efficiency.')}
   {stat(f'{max(m["capacity_used_pct"] for m in FLAG["monthly_y2"]):.0f}%', 'Peak capacity used, July', 'The model never assumes a full house. There is a third of the capacity still unsold at the hottest hour of the year.', 'acc')}
 </div>''', cls="deep"))

_m2 = FLAG["monthly_y2"]
S.append(sec(12, "IV · 12", "الموسمية", "SEASONALITY — THE SHAPE OF THE YEAR",
 f'''
 <p class="sub">Transactions per day, Year 2, against Baghdad's average monthly high. The business is a heat trade,
 and <span class="ar">كانون</span> is what stops that being fatal.</p>
 <figure class="chart">
  <div class="legend"><span><i style="background:var(--c1)"></i>Transactions per day</span>
    <span><i style="background:var(--c2)"></i>Baghdad average high, °C</span></div>
  {dual_bar_line(MON_EN, [m["tx_per_day"] for m in _m2], BAGHDAD_HIGHS,
    aria="Monthly transactions per day rise from about 220 in January to 474 in July, tracking Baghdad's average monthly high from 16 to 45 degrees Celsius.")}
  <figcaption>The trough is {min(m["tx_per_day"] for m in _m2):.0f} transactions a day in December and the peak is
  {max(m["tx_per_day"] for m in _m2):.0f} in July — a 2.2× swing. Without a winter menu the trough would be closer to
  120 and the unit would be loss-making for four months of every year.</figcaption>
 </figure>
 <div class="grid g3" style="margin-top:1.4rem">
   {stat(k(sum(m["gross_revenue"] for m in _m2[4:9])), 'Revenue, May–September', f'{sum(m["gross_revenue"] for m in _m2[4:9])/_y2["gross_revenue"]*100:.0f}% of the year in five months.')}
   {stat(k(sum(m["ebitda"] for m in _m2[10:] + _m2[:2])), 'EBITDA, November–February', 'Still positive. That is the whole purpose of <span class="ar">كانون</span>.', 'sun')}
   {stat('73%', 'Winter floor vs annual average', 'A pure cold concept would floor at roughly 45% and spend a third of the year underwater.')}
 </div>''', cls="warm"))

_cx = FLAG["capex"]
CAPEX_LABELS = {
 "fitout":"Shell, floor, ceiling, drainage, joinery","ice_skin":"The ice skin — cast acrylic facade and structure",
 "lighting_signage":"Tunable-white lighting, DMX control, illuminated wordmark","mep_generator":"MEP, HVAC for 50°C ambient, dedicated 60 kVA genset",
 "espresso_system":"Espresso machine, grinders, water treatment","ult_cold_chain":"−86°C ULT freezer ×2 and −20°C staging freezer",
 "clear_ice_system":"Directional-freeze clear-ice plant, bore, band saw, block store","rolled_pans":"Twin −30°C rolled ice cream pans",
 "sorbet_gelato":"Sorbet batch freezer, blast freezer, fruit mould system","juice_slush":"Slush machines, juicers, blenders",
 "refrigeration_misc":"Undercounter refrigeration, cube ice, display freezer","smallwares":"Smallwares, tongs, cryo gloves, tools",
 "spares_service_reserve":"Spares and Year-1 service reserve (10% of equipment)","contingency":"Contingency",
 "furniture":"Terrace furniture","pos_it":"POS, network, CCTV, digital menu","design_brand_fees":"Brand identity, architecture and engineering fees",
 "key_money":"Key money (خلو)","pre_opening":"Pre-opening: licences, training, trial production, launch","working_capital":"Working capital",
}
_order = ["ice_skin","clear_ice_system","mep_generator","contingency","fitout","design_brand_fees","key_money","working_capital",
          "sorbet_gelato","pre_opening","espresso_system","ult_cold_chain","lighting_signage","furniture","spares_service_reserve",
          "refrigeration_misc","juice_slush","pos_it","rolled_pans","smallwares"]
S.append(sec(13, "IV · 13", "رأس المال", "WHAT IT COSTS TO BUILD ONE",
 f'''
 <div class="grid g23" style="align-items:start">
   <div>
     {table(["Line", ("Flagship prototype",), ("Replication unit",)],
       [[CAPEX_LABELS[kk], (usd(_cx["items"][kk]),), (usd(U["baghdad_fr"]["capex"]["items"][kk]),)] for kk in _order]
       + [(["<b>Total</b>", (f'<b>{usd(_cx["total"])}</b>',), (f'<b>{usd(U["baghdad_fr"]["capex"]["total"])}</b>',)], "tot")],
       caption="Every equipment line requires a supplier quote before commitment. An independent bottom-up build-up of the same specification came to $356,300 excluding key money, working capital and brand fees — which is this table's $448,784 within a few per cent. The prototype carries $35,000 of one-time brand and architecture fees and a 12% first-of-kind contingency; the replication unit carries a $6,000 site-adaptation fee and 7%. That gap is the value the first store creates for every store after it.")}
   </div>
   <div class="grid" style="gap:.9rem">
     {stat(k(_cx["total"]), 'Baghdad flagship — the founder&rsquo;s own build','Prototype cost: first-of-kind engineering, full brand development, and equipment bought one unit at a time.')}
     {stat(k(U["baghdad_fr"]["capex"]["total"]), 'What a franchisee is quoted for a Cube','After the prototype has absorbed the design cost and the network buys equipment on contract.', 'acc')}
     {stat(k(U["baghdad_kiosk_fr"]["capex"]["total"]), 'What a franchisee is quoted for a Shard','No ice plant — supplied by the city&rsquo;s Cube. The cheapest way into the network and the highest-returning format.')}
     <div class="callout crit">
       <b>Key money is a legal problem, not just a cost.</b> Iraq&rsquo;s Property Lease Law No. 87 of 1979 expressly
       prohibits <span class="ar">خلو</span> taken by landlord, tenant or broker — and it is nonetheless universal in Baghdad
       commercial letting, observed at 25× monthly rent in Karrada. Budgeted here at 15×, and it must be structured
       with counsel rather than paid across a table.
     </div>
   </div>
 </div>''', cls=""))

S.append(sec(14, "IV · 14", "قائمة الدخل", "THE FLAGSHIP P&L",
 f'''
 <p class="sub">Company-owned Baghdad Cube. No royalty — this is the founder's own unit.</p>
 <figure class="chart">
  <div class="legend"><span><i style="background:var(--c1);opacity:.26"></i>Gross revenue</span>
    <span><i style="background:var(--c3)"></i>EBITDA · % of revenue labelled inside</span></div>
  {stacked_pnl(FLAG["years"], aria="Five-year revenue and EBITDA for the Baghdad flagship: revenue rises from $489k in Year 1 to $948k in Year 5, with EBITDA margin moving from 8% to 30%.")}
 </figure>
 {table(["", ("Y1",), ("Y2",), ("Y3",), ("Y4",), ("Y5",)],
   [[lab] + [(fn(y),) for y in FLAG["years"]] for lab, fn in [
     ("Transactions", lambda y: f'{y["transactions"]:,}'),
     ("Gross revenue", lambda y: usd(y["gross_revenue"])),
     ("Sales tax (10%, deluxe classification)", lambda y: f'({usd(y["sales_tax"])})'),
     ("Delivery commission", lambda y: f'({usd(y["delivery_commission"])})'),
     ("Cost of goods incl. waste", lambda y: f'({usd(y["cogs"])})'),
     ("Labour incl. 12% social security", lambda y: f'({usd(y["labour"])})'),
     ("Rent", lambda y: f'({usd(y["rent"])})'),
     ("Utilities incl. dedicated genset", lambda y: f'({usd(y["utilities"])})'),
     ("Marketing", lambda y: f'({usd(y["marketing"])})'),
     ("Card fees", lambda y: f'({usd(y["card_fees"])})'),
     ("Other operating cost", lambda y: f'({usd(y["other_opex"])})'),
   ]] +
   [(["<b>EBITDA</b>"] + [(f'<b>{usd(y["ebitda"])}</b>',) for y in FLAG["years"]], "tot")] +
   [(["EBITDA margin"] + [(f'{y["ebitda_margin"]*100:.0f}%',) for y in FLAG["years"]], "sub")] +
   [(["Depreciation"] + [(f'({usd(y["depreciation"])})',) for y in FLAG["years"]], "sub")] +
   [(["Tax at 15%"] + [(f'({usd(y["tax"])})',) for y in FLAG["years"]], "sub")] +
   [(["<b>Net income</b>"] + [(f'<b>{usd(y["net_income"])}</b>',) for y in FLAG["years"]], "tot")],
   caption="Year 1 trades at 62% of mature volume — two months of pre-opening, a launch spike, then the settle. Year 2 is the mature base.")}
 <div class="grid g4" style="margin-top:1.4rem">
   {stat(k(_y2["gross_revenue"]), 'Year-2 revenue', f'{usd(_y2["gross_revenue"])} on {FLAG["monthly_y2"][6]["tx_per_day"]:.0f} transactions a day at the July peak.')}
   {stat(f'{_y2["ebitda_margin"]*100:.0f}%', 'Year-2 EBITDA margin', 'After Iraq&rsquo;s 10% deluxe sales tax. Prime cost is 41% — Iraqi labour and rent are genuinely cheap against near-regional menu pricing, and that gap is the whole thesis.')}
   {stat(f'{FLAG["payback_months"]:.0f} mo', 'Capital payback', 'On EBITDA, from opening.', 'acc')}
   {stat(f'{FLAG["irr_5y"]:.0f}%', '5-year IRR', f'NPV at 20% discount: {usd(FLAG["npv_5y_at_20"])}. Includes a 3.5× EBITDA terminal value.', 'acc')}
 </div>''', cls="deep"))

S.append(sec(15, "IV · 15", "ماذا لو كنّا مخطئين", "WHAT IF WE ARE WRONG",
 f'''
 <p class="sub">Five ways this could go worse than planned, each modelled rather than asserted.</p>
 <figure class="chart">
  {scenario_chart(aria="Year-2 EBITDA across five scenarios: bear $42k, heat thesis fails $99k, dinar shock $114k, base $201k, bull $334k.")}
  <figcaption>Year-2 EBITDA, payback and 5-year IRR under each case. Bars are coloured by direction, not by rank.</figcaption>
 </figure>
 {table(["Scenario", "What it assumes", ("Y2 EBITDA",), ("Margin",), ("Payback",), ("IRR",)],
   [[nm, A["_scenario_notes"].get(key, ""), (usd(SC[key]["y2_ebitda"]),), (f'{SC[key]["y2_margin"]*100:.0f}%',),
     (f'{SC[key]["payback_months"]:.0f} mo' if SC[key]["payback_months"] else "&gt;60 mo",), (f'{SC[key]["irr_5y"]:.0f}%',)]
    for nm, key in [("Bear","bear"),("Heat thesis fails","stress_heat_fails"),("Dinar shock","stress_fx"),
                    ("Sales tax on top","stress_sales_tax"),("Base","base"),("Bull","bull")]],
   caption="The base case already absorbs Iraq's 10% deluxe sales tax; stress_sales_tax models a further 10% on top of that.")}
 <div class="callout crit" style="margin-top:1.2rem">
   <b>The bear case is the honest one to look at.</b> Volume 30% below plan, both signature items discounted, rent a
   third above the sourced comparable, cooling costs 45% higher: the unit still generates
   {usd(SC["bear"]["y2_ebitda"])} of EBITDA in Year 2 and stays cash-positive every month — but it
   <b>never repays its capital inside five years</b>, and the five-year IRR is
   <b>{SC["bear"]["irr_5y"]:.0f}%</b>: on those assumptions the money is not lost, it is stranded. That is the real
   downside and it deserves stating plainly. Anyone putting capital in should size the position against that
   outcome, not against the base case. Note also what would have to be true for it: a 30% volume miss <em>and</em>
   pricing failure <em>and</em> a rent overpay <em>and</em> an energy shock, all at once.
 </div>''', cls=""))

_F = A["franchise"]
S.append(sec(16, "IV · 16", "عرض الامتياز", "THE FRANCHISE OFFER",
 f'''
 <p class="sub">What a franchisee pays, what they get, and what the model says they earn.</p>
 <div class="grid g2" style="align-items:start">
   <div>
     {table(["Term", ("SHABIM",), "MENA benchmark"], [
       ["Initial fee — Iraq Shard (kiosk)", (usd(_F["initial_fee_usd"]["baghdad_kiosk_fr"]),), "$10.6k (Grano) · $21.3k (Café2go) · $88k (Gossip)"],
       ["Initial fee — Iraq Cube", (usd(_F["initial_fee_usd"]["iraq"]),), "—"],
       ["Initial fee — KSA", (usd(_F["initial_fee_usd"]["riyadh_kiosk"]),) , "Mikel KSA: SAR 90k–180k ($24k–48k)"],
       ["Initial fee — UAE / Qatar Cube", (usd(_F["initial_fee_usd"]["uae"]),), "—"],
       ["Royalty — <b>Iraq</b>", ("<b>5%</b>",), "5–10% (Café2go 5, Gossip 6, Grano 7, Mikel 10)"],
       ["Royalty — <b>GCC</b>", ("<b>6%</b>",), "Same band, at the market's own carrying capacity"],
       ["Marketing fund", ("1.5% Iraq · 2% GCC",), "1–3%, spent in full and audited"],
       ["Term", ("10 years, renewable",), "5–10 years typical"],
       ["Central supply", (f'~{_F["supply_share_of_rev"]*100:.0f}% of unit revenue',), "Beans, sorbet base and colour system, moulds, carving jigs, packaging"],
       ["Territory", ("Exclusive by district or city",), "Area development agreements above 3 units"],
     ], caption="Deliberately mid-band on royalty. A new brand buys adoption with terms; it does not extract on day one.")}
 <div class="callout crit" style="margin-top:1rem">
       <b>And the number that will be challenged.</b> Gulf F&amp;B investors underwrite franchise units to a
       <b>24–36 month payback</b>. Only Dubai ({U["dubai_fr"]["payback_months"]:.0f} months) and Doha
       ({U["doha_fr"]["payback_months"]:.0f}) sit inside that band on this model; the Iraqi and Riyadh units are at
       41–42. Three levers close the gap and all three are live: centralising ice production (already done — it takes
       {usd(27600)} out of every franchised Cube), the Shard format instead of the Cube, and a higher AUV than the
       deliberately conservative 300 transactions a day this model assumes. None of them is assumed here.
     </div>
     <div class="callout" style="margin-top:1rem">
       <b>Why the royalty is set market by market.</b> Because the model says it has to be. At 8% an Iraqi
       franchisee's payback stretches past four years and the offer stops being sellable; a Dubai unit clears
       {U["dubai_fr"]["years"][1]["ebitda_margin"]*100:.0f}% EBITDA and carries the standard rate comfortably. A
       franchisor that prices its royalty off its own spreadsheet rather than off the franchisee's return ends up
       with signed agreements and no openings.
     </div>
     <div class="callout" style="margin-top:1rem">
       <b>And where the money actually comes from.</b> Not the fee, and not really the royalty either. Central supply
       runs at ~{_F["supply_share_of_rev"]*100:.0f}% of unit revenue at a {_F["supply_margin_pct"]*100:.0f}% margin —
       {usd(FR["years"][4]["supply_margin"])} in Year 5 alone. Franchisees cannot shop around for it: the bean
       programme, the sorbet base and its colour system, the moulds and jigs, and — for every Shard kiosk — the carved
       ice blocks themselves, which come from the city's Cube. The kiosk was designed without an ice plant for exactly
       this reason.
     </div>
   </div>
   <div class="card">
     <div class="cap">What an Iraqi franchisee sees — both formats, Year 2</div>
     {table(["", ("Shard · kiosk",), ("Cube · street",)], [
       ["Investment incl. key money and working capital", (usd(U["baghdad_kiosk_fr"]["capex"]["total"]),), (usd(U["baghdad_fr"]["capex"]["total"]),)],
       ["Gross revenue", (usd(U["baghdad_kiosk_fr"]["years"][1]["gross_revenue"]),), (usd(U["baghdad_fr"]["years"][1]["gross_revenue"]),)],
       ["Royalty + marketing fund to SHABIM", (f'({usd(U["baghdad_kiosk_fr"]["years"][1]["royalty"])})',), (f'({usd(U["baghdad_fr"]["years"][1]["royalty"])})',)],
       ["<b>EBITDA</b>", (f'<b>{usd(U["baghdad_kiosk_fr"]["years"][1]["ebitda"])}</b>',), (f'<b>{usd(U["baghdad_fr"]["years"][1]["ebitda"])}</b>',)],
       ["EBITDA margin", (f'{U["baghdad_kiosk_fr"]["years"][1]["ebitda_margin"]*100:.0f}%',), (f'{U["baghdad_fr"]["years"][1]["ebitda_margin"]*100:.0f}%',)],
       ["Capital payback", (f'{U["baghdad_kiosk_fr"]["payback_months"]:.0f} months',), (f'{U["baghdad_fr"]["payback_months"]:.0f} months',)],
       ["<b>5-year IRR</b>", (f'<b>{U["baghdad_kiosk_fr"]["irr_5y"]:.0f}%</b>',), (f'<b>{U["baghdad_fr"]["irr_5y"]:.0f}%</b>',)],
     ], caption="Both shown AFTER the 6.5% royalty and marketing charge — which is where most franchise decks quietly show the franchisor's own unmarked P&L instead.")}
     <p class="desc" style="margin-top:.8rem"><b>This is why the Shard leads the rollout.</b> It costs
     {usd(U["baghdad_fr"]["capex"]["total"] - U["baghdad_kiosk_fr"]["capex"]["total"])} less to build, returns
     a higher margin and repays faster. The Cube is the flagship, the commissary and the ice supply — the brand's
     showpiece, mostly company-owned or sold to area developers. The kiosk is the volume product.</p>
   </div>
 </div>''', cls="tint"))

_city_rows = [("baghdad_kiosk_fr","Baghdad · Shard"),("baghdad_fr","Baghdad · Cube"),
              ("riyadh_kiosk","Riyadh · Shard"),("riyadh_fr","Riyadh · Cube"),
              ("dubai_fr","Dubai · Cube"),("doha_fr","Doha · Cube"),
              ("cairo_kiosk","Cairo · Shard"),("cairo_fr","Cairo · Cube")]

def _irr(kk):
    v = U[kk]["irr_5y"]
    return f"{v:.0f}%" if v is not None else "negative"

def _pb(kk):
    v = U[kk]["payback_months"]
    return f"{v:.0f} mo" if v else "&gt;60 mo"
S.append(sec(17, "IV · 17", "المدن", "THE SAME UNIT, EIGHT CITIES",
 f'''
 <p class="sub">The identical format run through each market's real rent, wage, tax and price levels. Two of these
 eight do not work, and they are named rather than buried.</p>
 {table(["City &amp; format", ("CAPEX",), ("Y2 revenue",), ("Y2 EBITDA",), ("Margin",), ("Payback",), ("IRR",), "Verdict"],
   [[lab, (usd(U[kk]["capex"]["total"]),), (usd(U[kk]["years"][1]["gross_revenue"]),),
     (usd(U[kk]["years"][1]["ebitda"]),), (f'{U[kk]["years"][1]["ebitda_margin"]*100:.0f}%',),
     (_pb(kk),), (_irr(kk),),
     ('<span class="pill good">Phase 1</span>' if kk in ("baghdad_fr","baghdad_kiosk_fr") else
      '<span class="pill acc">Phase 2</span>' if kk in ("riyadh_fr","riyadh_kiosk","dubai_fr","doha_fr") else
      '<span class="pill crit">Deferred</span>')]
    for kk, lab in _city_rows],
   caption="All figures are Year 2, after local consumption tax and after the 8% royalty and marketing charge.")}
 <div class="grid g2" style="margin-top:1.4rem">
   <div class="callout">
     <b>Dubai and Doha are the margin markets; Riyadh is the volume market.</b> Dubai returns
     {U["dubai_fr"]["years"][1]["ebitda_margin"]*100:.0f}% on a {U["dubai_fr"]["payback_months"]:.0f}-month payback
     because a 5% VAT and a 9% corporate rate leave more of a high ticket behind. Riyadh's
     {U["riyadh_fr"]["years"][1]["ebitda_margin"]*100:.0f}% is thinner — 15% VAT, higher rent, higher wages — but it is
     the market with 5,130 branded outlets and the appetite to absorb thirty of ours.
   </div>
   <div class="callout crit">
     <b>Egypt is excluded from the first five years, and it should be said out loud.</b> Both formats return
     <b>negative</b> unit EBITDA — around {U["cairo_kiosk"]["years"][1]["ebitda_margin"]*100:.0f}% — because the
     equipment is bought in dollars against a
     devalued pound while the menu has to be priced in Egyptian purchasing power. Egypt is a real opportunity — a
     $2.5bn café market heading to $4.2bn — but it needs a different vehicle: locally manufactured equipment, or the
     <span class="ar">جَنى</span> box sold as retail CPG without a café at all. And the core argument does not even
     transfer: Cairo has roughly 5–15 days a year above 40°C against Baghdad's ~134. SHABIM sells relief from heat
     that Egypt, comparatively, does not have. Entering it on these numbers would burn a franchisee and take the
     brand down with them.
   </div>
 </div>''', cls="deep"))

S.append(sec(18, "IV · 18", "شركة الامتياز", "THE FRANCHISOR — WHAT AN INVESTOR BUYS",
 f'''
 <p class="sub">Not a café. A brand that licenses a format and supplies its inputs — the asset-light half of the business.</p>
 <figure class="chart">
  <div class="legend"><span><i style="background:var(--c1)"></i>System-wide sales</span></div>
  {growth_chart(aria="System-wide sales grow from $205k in Year 1 to $32.4M in Year 5 as the network reaches 44 units.")}
 </figure>
 {table(["", ("Y1",), ("Y2",), ("Y3",), ("Y4",), ("Y5",)],
   [[lab] + [(fn(y),) for y in FR["years"]] for lab, fn in [
     ("Units — company-owned", lambda y: f'{y["units_own"]}'),
     ("Units — franchised", lambda y: f'{y["units_franchised"]}'),
     ("<b>Units trading</b>", lambda y: f'<b>{y["units_total"]}</b>'),
     ("System-wide sales", lambda y: usd(y["system_sales"])),
     ("Franchise &amp; area development fees", lambda y: usd(y["fee_revenue"])),
     ("Royalty", lambda y: usd(y["royalty"])),
     ("Marketing fund (pass-through)", lambda y: usd(y["ad_fund"])),
     ("Central supply margin", lambda y: usd(y["supply_margin"])),
     ("Company-owned store revenue", lambda y: usd(y["own_store_revenue"])),
     ("<b>Franchisor revenue</b>", lambda y: f'<b>{usd(y["total_revenue"])}</b>'),
     ("Head office", lambda y: f'({usd(y["hq_cost"])})'),
     ("Field support &amp; openings", lambda y: f'({usd(y["support_cost"])})'),
     ("Marketing fund spent", lambda y: f'({usd(y["ad_fund_spend"])})'),
     ("Company-owned store cost", lambda y: f'({usd(y["own_store_cost"])})'),
   ]] +
   [(["<b>Franchisor EBITDA</b>"] + [(f'<b>{usd(y["ebitda"])}</b>',) for y in FR["years"]], "tot")] +
   [(["Margin on franchisor revenue"] + [(f'{y["ebitda_margin"]*100:.0f}%',) for y in FR["years"]], "sub")],
   caption="Head office is deliberately heavy — $240k in Year 1 rising to $1.88M by Year 5, about $40,000 per trading unit, covering an R&D kitchen, a supply-chain function, disclosure-document preparation and registration in each jurisdiction, and trademark protection across eight countries. Understating head office is the most common way a franchise plan lies to itself.")}
 <div class="melt"></div>
 <h3 class="sub-h">The part of this an investor should push on hardest</h3>
 <p class="lede">Franchisor revenue is not all the same quality. Opening fees and area development fees are one-off:
 they arrive when a unit is signed and never again. Royalty and central supply are recurring: they arrive every year
 the unit trades. A franchisor is only really a franchisor when the recurring half covers head office.</p>
 {table(["", ("Y1",), ("Y2",), ("Y3",), ("Y4",), ("Y5",)],
   [["Recurring revenue — royalty + supply", ] + [(usd(y["recurring_revenue"]),) for y in FR["years"]],
    ["One-off revenue — opening and area fees", ] + [(usd(y["fee_revenue"]),) for y in FR["years"]],
    ["Company-owned store revenue", ] + [(usd(y["own_store_revenue"]),) for y in FR["years"]],
    (["<b>Recurring EBITDA — royalty + supply less head office and field support</b>"]
      + [(f'<b>{usd(y["recurring_ebitda"])}</b>',) for y in FR["years"]], "tot"),
   ], caption="Royalty is shown NET of withholding tax at source — 15% out of Saudi and Iraq, 20% out of Egypt, nil from the UAE. A 6% headline royalty out of Riyadh is a 5.1% royalty received. Omitting this overstates Year-5 franchisor revenue by about $131,000.")}
 <div class="callout crit" style="margin-top:1.2rem">
   <b>Read that bottom row honestly.</b> The recurring engine does not cover head office until Year 5, and even then
   only by {usd(FR["years"][4]["recurring_ebitda"])}. Roughly a third of Year-5 EBITDA comes from two company-owned
   stores rather than from franchising, and a further slice of franchise revenue is one-off fees. On these
   assumptions SHABIM reaches Year 5 as a <em>promising</em> franchisor, not yet a self-sustaining one. Getting the
   recurring line comfortably ahead of head office needs either more units, a higher unit AUV, or a leaner centre —
   and the plan should be judged on which of those three the team can actually deliver.
 </div>
 <div class="grid g4" style="margin-top:1.4rem">
   {stat(f'{FR["years"][4]["units_total"]}', 'Units trading by end of Year 5', '2 company-owned, the rest franchised, after a 5% annual closure allowance.')}
   {stat(k(FR["years"][4]["system_sales"]), 'System-wide sales, Year 5', f'{usd(FR["years"][4]["system_sales"])} across {FR["years"][4]["units_total"]} units.')}
   {stat(k(FR["years"][4]["ebitda"]), 'Franchisor EBITDA, Year 5', f'{FR["years"][4]["ebitda_margin"]*100:.0f}% margin. Crosses into profit in Year 4.', 'acc')}
   {stat(f'{FR["irr_pct"]:.0f}%<span class="u">IRR</span>', f'{FR["moic"]:.1f}× on a ' + k(A["raise"]["amount_usd"]) + ' raise', f'Exit enterprise value {usd(FR["exit_ev"])} at {A["raise"]["exit_multiple"]:.0f}× Year-5 EBITDA.', 'acc')}
 </div>''', cls=""))

# ── ACT V — THE ROAD ──────────────────────────────────────────────────────────
S.append(sec(19, "V · 19", "خارطة الطريق", "THE ROLLOUT",
 f'''
 <div class="timeline">
  {"".join(f"""<div class="tl">
    <div class="tl-y">Year {i+1}</div>
    <div class="tl-b">
      <div class="tl-h">{h}</div>
      <p>{d}</p>
      <div class="spec">{"".join(f'<span class="pill">{x}</span>' for x in pills)}</div>
    </div>
  </div>""" for i, (h, d, pills) in enumerate([
   ("Baghdad — prove the object",
    "One flagship Cube on a Mansour, Karrada or Zayouna corner. The whole year is spent getting the −80 protocol, the "
    "ice-block yield and the sorbet mould cycle to a standard that can be written into a manual. Trademark filed in Iraq "
    "across classes 30, 32, 29, 35 and 43. LLC formation begins immediately: registration takes 6–10 weeks and the "
    "security check is the binding constraint on the launch date.",
    ["1 Cube", "IP filed in Iraq", "Operating manual written", "Content engine live"]),
   ("Baghdad — prove it repeats, and prove it repeats CHEAPLY",
    "The first two franchised Shard kiosks open in Baghdad malls, supplied with carved blocks from the flagship Cube. "
    "This is the year the commissary model is tested, not the year the estate grows. The purpose is twelve months of "
    "audited multi-unit trading. The Saudi Franchise Law's gate is explicit about this: a franchisor must have operated "
    "the business model for at least one year with at least one outlet before it can franchise in the Kingdom.",
    ["3 units", "First franchisees signed", "Central ice commissary live", "12 months of audited data"]),
   ("Cross the Gulf",
    "Saudi and UAE entry. The KSA Franchise Law route is the gate: a disclosure document in Arabic, delivered at least "
    "14 days before signing — $15,000-40,000 and 8-16 weeks to prepare — and every agreement registered with the "
    "Ministry of Commerce within 90 days, with fines to SAR 500,000 for breach. Riyadh enters "
    "on Shards, Dubai on a Cube, both under area development agreements rather than one-off units. A second "
    "company-owned Cube opens as the Gulf showcase.",
    ["12 units", "KSA disclosure registered", "Riyadh + Dubai", "Franchisor near breakeven"]),
   ("Density before geography",
    "Depth in the four proven cities rather than new flags: Baghdad into double figures, Riyadh to a real cluster, Doha "
    "added. Central supply becomes a genuine business — beans, sorbet base, moulds, packaging and blocks — and the "
    "marketing fund reaches a size that buys regional campaigns.",
    ["27 units", "Doha added", "Supply chain at scale", "First profitable year"]),
   ("Scale, and decide about Egypt",
    "47 units trading, $24.7M of system-wide sales. Egypt and the Levant are re-underwritten on local equipment "
    "manufacturing and a retail <span class='ar'>جَنى</span> line — or deferred again. The brand is now either a credible "
    "master-franchise counterparty for a regional group, or an acquisition target for one.",
    ["47 units", "$24.7M system sales", "Egypt re-underwritten", "Exit optionality"]),
  ]))}
 </div>
 <div class="melt"></div>
 <h3 class="sub-h">Iraq beyond Baghdad — where Phase 1 goes next</h3>
 <p class="lede">78.8% of Iraqis — 36.3 million people — live outside Baghdad governorate, and the branded-café count
 for all of them is a rounding error.</p>
 {table(["City", ("Population",), "Case", "Caution"], [
   ["<b>Basra</b>", ("3.0M",), "The hottest large city in the target set — its 53.9°C record is the highest reliably measured temperature in the Eastern Hemisphere. If the heat thesis is right anywhere, it is right here.", "Water quality: the 2018 crisis hospitalised roughly 118,000 people. An RO plant is not optional."],
   ["<b>Erbil</b>", ("~1.6M",), "3.4 million visitors in 2025; the Kurdistan Region passed 8 million in 2024. Higher disposable income, more expatriates, a functioning mall sector.", "Cooler than Baghdad — 42°C July high — so the winter menu matters more, not less."],
   ["<b>Mosul / Nineveh</b>", ("3.7M",), "The largest under-served governorate in the country, rebuilding, and almost entirely unbranded.", "Infrastructure and logistics remain the binding constraint."],
   ["<b>Najaf &amp; Karbala</b>", ("~3.0M combined",), "Enormous, sustained religious tourism.", "<b>Do not model Arbaʿīn as revenue.</b> During Arbaʿīn, commercial food service is actively suppressed because the <span class='ar'>مواكب</span> give food and drink away free. Karbala is a year-round pilgrimage business, not a two-week spike."],
 ], caption="Governorate populations from the 2024 census. Phase 1 depth in Iraq comes before any new country.")}
''', cls="tint"))

S.append(sec(20, "V · 20", "الخندق", "WHY THIS IS HARD TO COPY",
 f'''
 <p class="sub">Anyone can buy a rolled-ice-cream pan. Four things stack into something that is not worth a
 competitor's trouble.</p>
 <div class="grid g2">
   <div class="card"><div class="cap">01 · The cold chain is the barrier</div>
     <p>A −86°C ULT freezer, a directional-freezing ice plant with a three-day block cycle, a blast freezer and a
     sorbet mould system are not a café's normal equipment list. They need a dedicated generator, a specialist service
     contract, and staff trained in handling surfaces that cause cold burns. A competitor can copy one item on the
     menu. Copying the operation means rebuilding the back of house.</p></div>
   <div class="card"><div class="cap">02 · No franchised unit makes its own ice</div>
     <p>Clear-ice production is centralised in each city's commissary Cube and the blocks are sold into the network.
     Every franchised unit — Shard and Cube alike — buys them. That takes about {usd(27600)} of capex out of each
     franchised Cube, shortens its payback, adds roughly 1.5 points to the franchisor's take rate, and makes the
     network a supply chain rather than a logo licence. The franchisee cannot shop around for the one input the
     signature product depends on.</p></div>
   <div class="card"><div class="cap">03 · The name cannot be taken</div>
     <p><span class="ar">شَبِم</span> is a real classical word with a verifiable dictionary entry, no existing F&amp;B
     registration anywhere in MENA, and a documented poetic lineage. Filed across five Nice classes in each market it
     is a defensible mark — unlike a descriptive name like "Ice" or "Cold", which is unregistrable in every one of
     these jurisdictions.</p></div>
   <div class="card"><div class="cap">04 · The archive compounds</div>
     <p>The verse programme, the vocalised typography, the seasonal <span class="ar">كانون</span> identity and the
     verification discipline behind them are a body of work, not a look. A competitor can copy a facade in a season.
     Assembling a defensible classical-Arabic identity takes scholarship they have no reason to fund.</p></div>
 </div>
 <div class="melt"></div>
 <div class="grid g3">
   {stat('3 days', 'per clear-ice block cycle', 'Directional freezing cannot be rushed. It is the operation&rsquo;s natural throttle, and its natural moat.')}
   {stat('30–42', 'Al-Qālab vessels per day, from one block maker', 'Against a modelled peak demand of ~31/day in July. One machine, at its ceiling, in the hottest month.', 'sun')}
   {stat('5', 'Nice classes to file', '43 (café services), 30 (coffee, ices), 32 (non-alcoholic drinks), 29 (frozen fruit), 35 (franchise and retail).')}
 </div>
 <div class="melt"></div>
 <h3 class="sub-h">The four constraints that shaped the design</h3>
 <p class="lede">Engineering that was checked before it was drawn. Each of these would have been discovered on site,
 expensively, by anyone who did not check first.</p>
 <div class="grid g2" style="margin-top:1.2rem">
   <div class="card"><div class="cap">A −80°C freezer cannot live in a Baghdad kitchen</div>
     <p>Commercial ULT freezers are rated to a maximum <b>30–32°C ambient</b>. Above that they lose the ability to hold
     temperature, and they reject 0.7–1.5 kW of heat into the room while doing it. The ULT sits in a separately
     conditioned back-of-house cell, not behind the bar — and that cell's cooling is in the MEP budget, not discovered later.</p></div>
   <div class="card"><div class="cap">A glass cube costs 2.2× a normal café to cool</div>
     <p>A 25 m² all-glass kiosk at 50°C ambient carries a <b>15.4 kW</b> peak cooling load — 0.22 kW/m² against
     0.08–0.10 for a conventional café — and needs 5–6 tons of T3-rated AC. <b>32% of that load is solar gain</b>,
     which is the cheapest part to design out: selective-coated laminates, a ventilated cavity behind the acrylic, and
     condensers shaded and off the roof.</p></div>
   <div class="card"><div class="cap">Solid acrylic ice blocks are unaffordable</div>
     <p>100 mm cast acrylic runs $476–1,071/m² from a Chinese mill and up to $2,975/m² branded. A facade of genuine
     solid blocks is not a budget decision, it is an impossibility. The ice depth is achieved with 20–30 mm sheet,
     surface texture, internal lamination and edge lighting — ~70 m² installed for
     {usd(FLAG["capex"]["items"]["ice_skin"])}.</p></div>
   <div class="card"><div class="cap">Water is an input, not a utility</div>
     <p>The Tigris near Kadhimiya has been measured at 540,000 coliform per 100 mL. Ice is a food, and a carved block
     that a customer eats has to meet food-grade microbiological standards. A reverse-osmosis plant is not optional
     equipment — Basra's 2018 water crisis put roughly 118,000 people in hospital — and clear ice needs deionised
     water anyway to freeze without occlusions.</p></div>
 </div>
 <div class="callout" style="margin-top:1.4rem">
   <b>One correction worth showing, because it goes to how these numbers were built.</b> An early version of this
   model used twelve monthly seasonality multipliers that were intended to average 1.0 and actually averaged 1.117 —
   quietly inflating every revenue line by 11.7%. It was caught in review and the vectors are now normalised, so the
   monthly <em>shape</em> is the forecast and the <em>level</em> comes only from the transactions-per-day assumption
   where it can be argued with. Every number in this deck is downstream of that fix.
 </div>''', cls=""))

RISKS = [
 ("Critical", "The −80°C vessel can injure a customer",
  "Skin contact with metal at −80°C causes cold burns in seconds, and a vessel taken straight from −80°C into 45°C "
  "ambient can fracture from thermal shock.",
  "A two-stage protocol, exactly as the Melbourne operator runs it: −20°C pre-chill, then −80°C hold. Steel tongs, "
  "never bare hands. Thick-walled borosilicate, never thin glass or bare metal. A chilled base and a sleeve on every "
  "serve, a hold-time before hand-off, and a written SOP that is part of the franchise manual and the training "
  "certification. Liability insurance sized for it before the first store opens."),
 ("Critical", "Power failure destroys the freezer load",
  "Baghdad's grid delivers 8–12 hours a day; 2025 peak demand was 55 GW against 27 GW of supply, and the December "
  "2025 Iranian gas halt cut a further 4,000–4,500 MW. A ULT freezer that thaws loses its entire contents.",
  "A dedicated 60 kVA generator with automatic transfer, not a neighbourhood generator subscription — this is why the "
  "model carries $26k of annual utilities rather than the $5.4k a shared connection would cost. Plus UPS on controls, "
  "temperature telemetry with alarms to a phone, and enough thermal mass that a two-hour outage is survivable."),
 ("High", "The name has a medical homograph",
  "<span class='ar'>الشَّبَم</span> is the standard modern Arabic term for phimosis. Arabic Wikipedia's article at the exact "
  "string <span class='ar'>شبم</span> is the urology page. A customer, journalist or competitor will find this.",
  "Vocalise the wordmark as <span class='ar'>شَبِم</span> with a kasra — the medical term is consistently "
  "<span class='ar'>الشَّبَم</span> with a fatḥa. Lock the definition into the lockup so the word never travels alone. "
  "Own every modified search query within twelve months. And brief the team with a confident answer rather than an "
  "embarrassed one."),
 ("High", "Key money is illegal and universal",
  "Property Lease Law No. 87 of 1979 prohibits <span class='ar'>خلو</span>. It is nonetheless demanded on essentially every "
  "good Baghdad pitch, observed at 25× monthly rent.",
  "Structure it with counsel as a documented premium or fit-out contribution rather than an undocumented cash "
  "payment, and prefer landlords who will take a longer lease at a higher rent instead. Budgeted at 15×."),
 ("High", "The novelty fades — and this is the likeliest way to lose",
  "Capital-gated spectacle formats have a documented peak-attention window of 12–24 months. Crumbl passed 1,000 stores "
  "and then watched per-store volumes fall from their 2021 peak with same-store sales negative through 2024. Rolled ice "
  "cream ran 2015–18 and was largely gone by 2021. Separately, the base rate is unforgiving: about 26–27% of restaurants "
  "fail in year one and 59–60% within three — lower than the folklore 90%, but not low.",
  "The barbell menu is the structural answer: spectacle recruits, <span class='ar'>بَرَد</span> and <span class='ar'>جَنى</span> "
  "retain, <span class='ar'>كانون</span> holds the winter, the seasonal fruit rotation supplies a Crumbl-style reason to "
  "return that is built into the supply chain rather than invented by marketing, and the <span class='ar'>جَنى</span> box "
  "is a retail product that survives the café. The bear case models exactly this fade and still leaves the unit "
  "cash-positive every month at {bear}% EBITDA — it simply does not repay its capital inside five years."),
 ("Medium", "Currency and pricing",
  "The dinar trades at 1,310 official and ~1,530 parallel — a 16–17% premium. Equipment and beans are bought in "
  "dollars; the menu is sold in dinars.",
  "The model uses the parallel rate throughout, never the official one. Menu prices are reviewed twice a year. "
  "The <span class='en'>stress_fx</span> case models a further 14% adverse move with no price response and still clears "
  "{fx}% EBITDA."),
 ("Medium", "Classification as a deluxe venue",
  "Iraq has no general VAT but levies a 10% sales tax on deluxe restaurants and hotels. A café selling a $9.80 drink "
  "may well be classified deluxe.",
  "Assumed in the base case, not treated as an upside. A further 10% on top is modelled separately and the unit still "
  "clears {tax}% EBITDA."),
 ("Medium", "Foreign ownership and repatriation",
  "Foreign ownership of an Iraqi LLC is generally capped at 49%, and five banks plus three payment firms have been "
  "barred from the CBI dollar auction.",
  "The Iraqi operating company is majority Iraqi-owned by design. The franchisor IP entity sits offshore and is paid "
  "royalties under a registered licence — the standard structure, and the reason the IP must be filed before the "
  "first franchise agreement is signed, not after."),
 ("Medium", "Security and perception",
  "The US State Department maintains a Level 4 &lsquo;Do Not Travel&rsquo; advisory for Iraq.",
  "It is also true that Iraq recorded $5.7bn of tourism revenue in 2024, up 25%, that Baghdad was Arab Tourism Capital "
  "2025, and that Half Million, %Arabica and Kyan are all opening there. Both facts belong in the same paragraph. "
  "Practically: 24-hour site security is in the cost base, and no international staff are required to operate a unit."),
 ("Low", "The word's darker senses",
  "Lisān al-ʿArab notes that the Arabs called poison and death <span class='ar'>شَبِم</span>, for their coldness.",
  "A lexicographer's footnote, not live usage. Disclosed here so it is not discovered later, and consciously kept out "
  "of the family-facing brand voice."),
]
S.append(sec(21, "V · 21", "المخاطر", "RISK REGISTER",
 f'''
 <p class="sub">Ten things that could go wrong, ranked by severity, each with what is actually being done about it.
 Nothing here is a discovery an investor should be making on their own.</p>
 <div class="risks">
 {"".join(f"""<div class="risk r-{sv.lower()}">
   <div class="r-head"><span class="pill {'crit' if sv=='Critical' else ('sun' if sv=='High' else '')}">{sv}</span>
     <h4>{t}</h4></div>
   <div class="r-body"><p class="r-what">{w}</p><p class="r-mit"><b>Mitigation.</b> {m.format(bear=f"{SC['bear']['y2_margin']*100:.0f}", fx=f"{SC['stress_fx']['y2_margin']*100:.0f}", tax=f"{SC['stress_sales_tax']['y2_margin']*100:.0f}")}</p></div>
 </div>""" for sv, t, w, m in RISKS)}
 </div>''', cls="deep"))

S.append(sec(22, "V · 22", "الطلب", "THE ASK — TWO TRACKS",
 f'''
 <p class="sub">These are separable. The first does not require the second.</p>
 <div class="grid g2" style="align-items:start">
   <div class="card track">
     <span class="pill">TRACK A · SELF-FUNDED</span>
     <h3>Build the Baghdad flagship</h3>
     <div class="big-n">{usd(FLAG["capex"]["total"])}</div>
     <p class="desc">Founder capital. One Cube on a Baghdad corner, built as the prototype and the proof. No outside
     equity, no dilution, and no obligation to anyone else's timetable.</p>
     {table(["Use of funds", ("Amount",)], [
       ["Fit-out, ice skin, lighting, MEP and generator", (usd(sum(_cx["items"][x] for x in ("fitout","ice_skin","lighting_signage","mep_generator"))),)],
       ["Production equipment", (usd(sum(_cx["items"][x] for x in ("espresso_system","ult_cold_chain","clear_ice_system","rolled_pans","sorbet_gelato","juice_slush","refrigeration_misc","smallwares"))),)],
       ["Brand, architecture and engineering", (usd(_cx["items"]["design_brand_fees"]),)],
       ["Key money, furniture, POS", (usd(sum(_cx["items"][x] for x in ("key_money","furniture","pos_it"))),)],
       ["Pre-opening and working capital", (usd(sum(_cx["items"][x] for x in ("pre_opening","working_capital"))),)],
       ["<b>Total</b>", (f'<b>{usd(_cx["total"])}</b>',)],
     ])}
     <div class="grid g3" style="gap:.5rem;margin-top:.9rem">
       {stat(f'{FLAG["payback_months"]:.0f}<span class="u">mo</span>','Payback')}
       {stat(f'{FLAG["irr_5y"]:.0f}%','5-yr IRR')}
       {stat(k(_y2["ebitda"]),'Y2 EBITDA')}
     </div>
   </div>
   <div class="card track accent">
     <span class="pill acc">TRACK B · GROWTH CAPITAL</span>
     <h3>Build the franchisor</h3>
     <div class="big-n acc">{k(A["raise"]["amount_usd"])}</div>
     <p class="desc">Raised once the flagship has twelve months of trading behind it — which is also what the Saudi
     Franchise Law and any credible Gulf master franchisee require before they will engage. The money builds the
     company that licenses the format, not more cafés.</p>
     {table(["Use of funds", ("Amount",), ("Share",)], [
       ["Head office through to breakeven: brand, ops, training, R&amp;D kitchen", ("$620,000",), ("35%",)],
       ["One further company-owned Cube (Year 3, the Gulf showcase)", ("$449,000",), ("26%",)],
       ["Central ice and supply commissary, plus first inventory", ("$230,000",), ("13%",)],
       ["IP, disclosure documents and registration in five jurisdictions", ("$185,000",), ("11%",)],
       ["Launch marketing across Iraq and the Gulf", ("$150,000",), ("8%",)],
       ["Contingency", ("$116,000",), ("7%",)],
       ["<b>Total</b>", ("<b>$1,750,000</b>",), ("<b>100%</b>",)],
     ], caption="Peak cumulative cash need is $1.11M in Year 3; the raise carries 58% headroom over it. Only ONE company-owned unit sits inside this raise — the Year-1 flagship is Track A, funded before it. A franchisor that spends investor capital building its own estate is not asset-light, it is a restaurant group with extra paperwork.")}
     <div class="grid g3" style="gap:.5rem;margin-top:.9rem">
       {stat(f'{FR["irr_pct"]:.0f}%','IRR', '', 'acc')}
       {stat(f'{FR["moic"]:.1f}×','MOIC', '', 'acc')}
       {stat(k(FR["exit_ev"]),'Exit EV', '', 'acc')}
     </div>
   </div>
 </div>
 <div class="melt"></div>
 <h3 class="sub-h">The team this needs — and what is still an open seat</h3>
 <p class="lede">Stated as roles rather than names, because that is what is honest at this stage. A franchise business
 fails on the operating bench long before it fails on the concept.</p>
 <div class="grid g4" style="margin-top:1.1rem">
   <div class="card"><div class="cap">Filled</div><h3 style="font-size:var(--step-1)">Founder</h3>
     <p>Owns the concept, funds Track A, holds the Iraqi operating relationships. Baghdad-based.</p></div>
   <div class="card"><div class="cap">Hire — Year 1, critical</div><h3 style="font-size:var(--step-1)">Head of production</h3>
     <p>A cold-chain and pastry technician, not a barista. Owns the −80 protocol, the clear-ice programme and the
     sorbet mould cycle, and writes the manual the whole franchise is licensed against.</p></div>
   <div class="card"><div class="cap">Hire — Year 1</div><h3 style="font-size:var(--step-1)">Brand and content lead</h3>
     <p>Arabic-first. Runs the verse programme, the seasonal identity and the content engine that is this brand&rsquo;s
     entire distribution channel.</p></div>
   <div class="card"><div class="cap">Hire — Year 2, before any franchise sale</div><h3 style="font-size:var(--step-1)">Franchise director</h3>
     <p>Has taken a MENA brand through Saudi Ministry of Commerce registration before. This is the seat where an
     inexperienced hire costs a year.</p></div>
 </div>
 <div class="callout crit" style="margin-top:1.2rem">
   <b>Open before any capital moves.</b> Trademark clearance searches at SAIP and the Iraqi Ministry of Industry and
   Minerals. Supplier quotes for the nine imported equipment categories. Three real landlord conversations on named
   Baghdad corners. A tax ruling on whether SHABIM is a &ldquo;deluxe&rdquo; venue for Iraq&rsquo;s 10% sales tax.
   Confirmation of three verse wordings against printed critical editions. The full list, with the order to close
   them in, is in §23.
 </div>
 <div class="callout" style="margin-top:1.4rem">
   <b>The sequencing is the point.</b> Every franchise business that fails does so by selling territories before the
   format is proven, then spending the fee income firefighting units it cannot support. SHABIM sells nothing until
   one store has run a full Baghdad summer <em>and</em> a full Baghdad winter, and the operating manual has been written
   from what actually happened rather than from what was planned.
 </div>''', cls="warm"))

# ── APPENDIX ──────────────────────────────────────────────────────────────────
ASSUMPTION_ROWS = [
 ("Iraq population", "46,118,793", "H", "2024 census, Ministry of Planning — first census in 37 years"),
 ("Baghdad Governorate population", "9,780,429", "H", "2024 census; 21.2% of Iraq; ~85% urban"),
 ("Iraq median age / under-30 share", "20.9 yrs / ~63%", "H/E", "UN WPP 2024; census age structure"),
 ("IQD per USD — parallel market", "1,530", "H", "Iraqi News, Baghdad rates, 16 Aug 2026. Official CBI rate 1,310; premium 16–17%"),
 ("Iraq corporate income tax", "15%", "H", "PwC Worldwide Tax Summaries. 35% applies to oil and gas only"),
 ("Iraq consumption tax", "no VAT; 10% on deluxe venues", "H", "Assumed to apply to SHABIM in the base case"),
 ("Employer social security", "12%", "H", "Workers' Retirement and Social Security Law, private sector"),
 ("Iraq minimum wage", "350,000 IQD/month", "H", "Art. 63, Labour Law No. 37 of 2015"),
 ("Baghdad barista salary", "$450/month", "H/E", "Sourced vacancies: 450–600k IQD evening shift, 750k full shift"),
 ("Baghdad flagship rent", "$2,600/month", "H/E", "Comparables: Mansour 350 m² at $10.00/m²; Zayouna 200 m² at $27.50/m²"),
 ("Key money", "15× monthly rent", "H/E", "Observed at 25× in Karrada. Prohibited by Law No. 87 of 1979 — see risk register"),
 ("Grid supply, Baghdad", "8–12 h/day", "H", "2025 peak demand 55 GW vs 27 GW supply"),
 ("Commercial electricity tariff", "60 IQD/kWh", "H", "Federal Iraq"),
 ("Generator subscription", "12,000 IQD/ampere/month", "H", "Baghdad governorate tariff, 24-hour service"),
 ("Diesel pump price", "$0.190/litre", "H", "Iraq, subsidised"),
 ("Roasted specialty coffee, landed Baghdad", "$14–22/kg", "H/E", "≈$0.25–0.40 per 18 g double; $0.40 used"),
 ("HORECA milk, Baghdad", "1,100–1,300 IQD/litre", "H", "Retail 1,588–1,600 IQD/litre"),
 ("PET cup + lid, delivered Baghdad", "$0.07–0.13", "H", "Custom moulding and print adds 30–60%; double wall roughly doubles again"),
 ("Delivery commission", "22%", "H/E", "Talabat 15–30% regionally; Lezzoo estimated 15–25%. Not Iraq-verified"),
 ("Baghdad climate", "45°C July/Aug average high", "H", "Weather Spark; hot season 26 May – 21 Sep; record 51.8°C, 28 Jul 2020"),
 ("Iraq branded coffee outlets", "85", "H", "Project Café Middle East 2025, World Coffee Portal; 13th in MENA"),
 ("MENA branded coffee outlets", "11,163 → 16,460 by 2029", "H", "World Coffee Portal; +11.2% y/y, 8.1% CAGR"),
 ("Franchise royalty benchmark", "5–10%", "H", "Café2go 5%, Gossip 6%, Grano 7%, Mikel KSA 10%. US FDDs: Dunkin' 5.9%, Cinnabon 6.0%, Gong Cha 6.0%, Tim Hortons 4.5%"),
 ("Franchise fee benchmark", "$10.6k – $88k", "H", "Grano, Café2go, Gossip; Mikel KSA SAR 90–180k. GCC single-unit market practice $20k–50k"),
 ("Area development fee band", "$50k – $150k", "H", "Country master for a brand with &lt;10 units. SHABIM books $90k/$140k/$170k in Y3–Y5"),
 ("Royalty withholding tax", "KSA 15% · Egypt 20% · Qatar 5% · UAE 0%", "H", "Netted from royalty in the model. Iraq ~15%, low confidence"),
 ("Gulf franchise payback band", "24–36 months", "H", "What Gulf F&amp;B investors underwrite to. SHABIM's Cube sits outside it at 41–42; Dubai and Doha inside"),
 ("Saudi Franchise Law gate", "1 year / 1 outlet", "H", "Operating history required before franchising in KSA; FDD in Arabic 14 days before signature; registration within 90 days"),
 ("FDD preparation and registration", "$15k–40k · 8–16 weeks", "H", "Drafting, Arabic translation, Ministry of Commerce registration"),
 ("Transactions per day, mature", "300", "E", "Independent research anchor 300/day. Regulars, Melbourne: ~600/day of one drink"),
 ("Average ticket", f"${_b['avg_ticket']:.2f}", "E", f"{iqd(_b['avg_ticket'])} IQD; 1.45 items per transaction"),
 ("Station efficiency", "72%", "E", "Order-taking, restocking, cleaning and hand-off losses against theoretical throughput"),
 ("Ramp, Year 1", "62% of mature", "E", "Two months of pre-opening, a launch spike, then the settle"),
 ("Waste", "6.5%", "E", "Fruit in 45°C ambient, milk, sorbet reject, block breakage"),
 ("Rent escalation", "5%/yr", "E", "Standard in Baghdad; conservative for GCC malls"),
 ("Franchised-unit closures", "5%/yr from Y3", "E", "No network is closure-free; a plan that assumes zero is not a plan"),
 ("Exit multiple, franchisor", "8× EBITDA", "E", "Below quoted franchisor multiples, deliberately"),
]

OPEN = [
 "Every equipment line needs a real supplier quote. Clear-ice plant, ULT freezers and the sorbet mould system are "
 "quote-only categories and the CAPEX table will move when they come back.",
 "Baghdad rent and key money are anchored on two sourced listings and one observed key-money ratio. Three real "
 "landlord conversations on actual target corners would replace an estimate with a number.",
 "Talabat's and Lezzoo's Iraq commission rates are regional figures, not Iraq-verified. A merchant conversation settles it.",
 "Trademark registers have not been searched. SAIP (Saudi) and the Iraqi Ministry of Industry and Minerals need "
 "formal clearance searches before any spend on the wordmark — SAIP's public database shows registered rights only, "
 "not pending applications.",
 "Whether Iraq is a Madrid Protocol party determines whether one international filing works or seven national ones "
 "are needed. Unverified.",
 "Three of the six replacement verses (al-Ṣanawbarī, al-Buḥturī, al-Farazdaq) are high-confidence on attribution but "
 "need their exact wording confirmed against printed critical editions before they go on a primary SKU.",
 "Whether <span class='ar'>شبم</span> carries any unintended sense in Baghdadi, Basrawi, Khaliji, Egyptian or Levantine "
 "colloquial has not been tested. Research covered Modern Standard Arabic and the medieval lexica only.",
 "Whether SHABIM falls inside Iraq's 'deluxe restaurant' classification for the 10% sales tax. Assumed yes; needs a "
 "ruling from a local tax adviser. It is a 10-point revenue swing on every Iraqi unit and it flows straight through "
 "to the royalty base.",
 "Whether the sorbet base is genuinely non-substitutable. Nearly half the franchisor's take rate rests on a "
 "franchisee being unable to buy an equivalent base locally. Formulation and supply agreements have to protect it, "
 "and if they cannot, the supply-margin line has to come down.",
 "Two real contractor quotes for a 45 m² unit in Riyadh and Dubai. The modelled hard capex works out at roughly "
 "$6,100/m², which is 3.5–7.6× a normal specialty café — plausible for this format, but unverified.",
 "Withholding tax on royalties out of Iraq. The ~15% used here is low-confidence and the non-resident retention "
 "regime is applied inconsistently in practice.",
]

S.append(sec(23, "APP · 23", "الافتراضات والمصادر", "ASSUMPTIONS, SOURCES AND WHAT IS STILL UNKNOWN",
 f'''
 <p class="sub"><b>H</b> — hard-sourced. <b>E</b> — estimate, with the derivation stated. Every figure in this deck
 traces to a row below or to the model file behind it.</p>
 {table(["Assumption", ("Value",), "Grade", "Source or derivation"],
   [[a, (b,), f'<span class="pill {"good" if g=="H" else ""}">{g}</span>', s] for a, b, g, s in ASSUMPTION_ROWS])}
 <div class="melt"></div>
 <h3 class="sub-h">What is still unknown</h3>
 <p class="lede">A plan that does not list its own gaps is a pitch, not a plan. These are the open items, in the order
 they should be closed.</p>
 <ol class="steps" style="margin-top:1rem">{"".join(f"<li>{o}</li>" for o in OPEN)}</ol>
 <div class="callout" style="margin-top:1.6rem">
   <b>Principal sources.</b> Iraq Ministry of Planning 2024 Census · IHSES 2023/24 · IMF Article IV 2025 ·
   World Coffee Portal, Project Café Middle East 2025 · Central Bank of Iraq and Iraqi News FX rates ·
   Weather Spark and weather-atlas climate normals · DataReportal Digital 2026: Iraq · PwC Worldwide Tax Summaries ·
   Lisān al-ʿArab (Ibn Manẓūr), al-Qāmūs al-Muḥīṭ (al-Fīrūzābādī), Tāj al-ʿArūs (al-Zabīdī) ·
   aldiwan.net and Shamela poetry corpora · Saudi Ministry of Commerce Franchise Law 2019 and implementing regulations ·
   Broadsheet Melbourne (Regulars, −85°C) · Tasting Table and Japankuru (Kobe Nishimura, Cafe 33 Kyoto) ·
   Newsweek and CNBC (FIX Dessert Chocolatier) · Renub, Deep Market Insights, Ken Research (GCC and Egypt market sizing).
 </div>''', cls="tint"))


# ══════════════════════════════════════════════════════════════════════════════
# ASSEMBLY
# ══════════════════════════════════════════════════════════════════════════════

CSS_EXTRA = f'''
/* chart tokens — palettes validated against the six checks in both modes */
:root {{ --c1:{LP[0]}; --c2:{LP[1]}; --c3:{LP[2]}; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --c1:{DP[0]}; --c2:{DP[1]}; --c3:{DP[2]}; }} }}
:root[data-theme="dark"] {{ --c1:{DP[0]}; --c2:{DP[1]}; --c3:{DP[2]}; }}

svg.cv {{ width:100%; height:auto; display:block; overflow:visible; }}
svg.cv .grid {{ stroke:var(--hair-soft); stroke-width:1; }}
svg.cv .axis {{ stroke:var(--hair); stroke-width:1; }}
svg.cv .ax {{ fill:var(--ink-3); font-family:var(--bd); font-size:11px; font-variant-numeric:tabular-nums; }}
svg.cv .ax.dim {{ fill:var(--ink-3); opacity:.75; font-size:10px; }}
svg.cv .vl {{ fill:var(--ink); font-family:var(--bd); font-size:11.5px; font-weight:600; font-variant-numeric:tabular-nums; }}
svg.cv .vl2 {{ fill:var(--sun); font-family:var(--bd); font-size:11px; font-weight:600; }}
svg.cv .vl-in {{ fill:var(--ground); font-family:var(--bd); font-size:11px; font-weight:700; }}
svg.cv .rl {{ fill:var(--ink-2); font-family:var(--bd); font-size:12px; }}
svg.cv .cell-hot {{ fill:#fff; font-family:var(--bd); font-size:10.5px; font-weight:700; }}
svg.cv .pk-lab {{ fill:var(--ink-3); font-family:var(--bd); font-size:11.5px; letter-spacing:.04em; }}
svg.cv rect, svg.cv circle {{ transition: opacity .15s ease; }}
svg.cv rect:hover, svg.cv circle:hover {{ opacity:.82; }}
.scene-wrap {{ background:var(--surface-sunk); border:1px solid var(--hair-soft); border-radius:16px; padding:.5rem; }}
svg.scene {{ border-radius:12px; }}

/* product cards */
.ico-wrap {{ color:var(--glacier); width:44px; height:44px; margin-bottom:.35rem; }}
svg.ico {{ width:100%; height:100%; display:block; }}
.prod .price {{ display:flex; align-items:baseline; gap:.55rem; margin-top:.55rem; padding-top:.6rem; border-top:1px solid var(--hair-soft); }}
.prod .price .num {{ font-family:var(--ar); font-weight:700; font-size:var(--step-1); color:var(--ink); }}
.prod .price .pu {{ font-size:var(--step--2); color:var(--ink-3); }}

/* verse cards */
.verse-card {{ border:1px solid var(--hair-soft); background:var(--surface); border-radius:14px; padding:1.1rem 1rem .95rem; }}
.verse-card .pill {{ margin-bottom:.5rem; }}
.score {{ display:flex; gap:.7rem; margin:.4rem 0 1rem; }}
.score > div {{ flex:1; display:flex; gap:.6rem; align-items:center; border-radius:10px; padding:.6rem .7rem; font-size:var(--step--2); line-height:1.4; }}
.sc-pass {{ background:color-mix(in oklab, var(--good) 12%, transparent); color:var(--ink-2); }}
.sc-fail {{ background:color-mix(in oklab, var(--crit) 12%, transparent); color:var(--ink-2); }}
.sc-n {{ font-family:var(--ar); font-weight:700; font-size:var(--step-3); line-height:1; }}
.sc-pass .sc-n {{ color:var(--good); }} .sc-fail .sc-n {{ color:var(--crit); }}
ul.ticks.crit li::before {{ background:var(--crit); }}
ul.ticks.crit li {{ font-family:var(--ar); }}
.crit-card {{ border-color:color-mix(in oklab, var(--crit) 30%, var(--hair-soft)); }}

/* timeline */
.timeline {{ display:grid; gap:0; }}
.tl {{ display:grid; grid-template-columns:132px minmax(0,1fr); gap:var(--gap); padding:1.3rem 0; border-top:1px solid var(--hair-soft); }}
.tl:first-child {{ border-top:0; }}
.tl-y {{ font-family:var(--mo); font-size:var(--step--1); color:var(--glacier); letter-spacing:.08em; padding-top:.15rem; }}
.tl-h {{ font-family:var(--ar); font-weight:600; font-size:var(--step-1); margin-bottom:.4rem; }}
.tl-b p {{ color:var(--ink-2); font-size:var(--step--1); }}
.tl-b .spec {{ margin-top:.7rem; display:flex; gap:.4rem; flex-wrap:wrap; }}
@media (max-width:700px) {{ .tl {{ grid-template-columns:1fr; gap:.4rem; }} }}

/* risks */
.risks {{ display:grid; gap:0; }}
.risk {{ display:grid; grid-template-columns:minmax(0,.9fr) minmax(0,1.25fr); gap:var(--gap);
  padding:1.15rem 0; border-top:1px solid var(--hair-soft); }}
.risk:first-child {{ border-top:0; }}
.r-head {{ display:flex; flex-direction:column; gap:.45rem; align-items:flex-start; }}
.r-head h4 {{ font-size:var(--step-0); font-family:var(--ar); font-weight:600; line-height:1.35; }}
.r-what {{ color:var(--ink-3); font-size:var(--step--1); margin-bottom:.5rem; }}
.r-mit {{ color:var(--ink-2); font-size:var(--step--1); }}
.r-mit b {{ color:var(--glacier); font-family:var(--ar); }}
@media (max-width:760px) {{ .risk {{ grid-template-columns:1fr; }} }}

/* ask */
.track {{ display:flex; flex-direction:column; gap:.7rem; }}
.track h3 {{ font-size:var(--step-2); }}
.track.accent {{ border-color:color-mix(in oklab, var(--glacier) 40%, var(--hair-soft)); box-shadow:var(--shadow-2); }}
.big-n {{ font-family:var(--ar); font-weight:700; font-size:var(--step-4); line-height:1; letter-spacing:-.02em; }}
.big-n.acc {{ color:var(--glacier); }}
.sub-h {{ font-family:var(--ar); font-size:var(--step-2); margin:1.8rem 0 .9rem; }}
.dim {{ color:var(--ink-3); }}
'''

NAV = [("s1","الفكرة","The idea"),("s4","السوق","The market"),("s7","العلامة","The brand"),
       ("s11","الأرقام","The numbers"),("s19","الطريق","The road"),("s23","الملحق","Appendix")]

HERO = f'''
<header class="hero">
  <canvas id="caustics" aria-hidden="true"></canvas>
  <div class="in">
    <p class="wordmark ar">شَبِم</p>
    <p class="wordmark-la en">SHABIM</p>
    <p class="line ar">بَرْدُ الماء</p>
    <p class="line-en en">The Arabic word for the coldness of water — and a cold-drinks brand
      engineered for the hottest cities on earth.</p>
    <div class="meta">
      <span class="pill acc">Baghdad → Iraq → the Gulf</span>
      <span class="pill">Investor presentation · {A["_meta"]["as_of"]}</span>
      <span class="pill">Flagship {usd(FLAG["capex"]["total"])} · payback {FLAG["payback_months"]:.0f} months</span>
      <span class="pill">Franchisor {k(A["raise"]["amount_usd"])} · {FR["irr_pct"]:.0f}% IRR</span>
    </div>
  </div>
</header>'''

SCRIPT = '''
(function(){
  var rail=document.querySelector('.rail'), secs=[].slice.call(document.querySelectorAll('section.s')),
      links=[].slice.call(document.querySelectorAll('.topbar nav a'));
  function onScroll(){
    var h=document.documentElement, p=h.scrollTop/(h.scrollHeight-h.clientHeight||1);
    rail.style.setProperty('--melt',(p*100).toFixed(2)+'%');
    var best=null;
    secs.forEach(function(s){ if(s.getBoundingClientRect().top<=140) best=s.id; });
    links.forEach(function(a){
      var ids=(a.dataset.range||'').split(',');
      a.setAttribute('aria-current', ids.indexOf(best)>-1 ? 'true':'false');
    });
  }
  document.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  var c=document.getElementById('caustics');
  if(!c) return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx=c.getContext('2d'), t=0, raf=null, W=0, H=0;
  function size(){ var r=c.getBoundingClientRect(), d=Math.min(devicePixelRatio||1,1.6);
    W=c.width=Math.max(1,r.width*d); H=c.height=Math.max(1,r.height*d); }
  function draw(){
    ctx.clearRect(0,0,W,H);
    var s=Math.min(W,H)/900, n=13;
    for(var i=0;i<n;i++){
      var a=i*2.399+t*0.16, r=(0.16+0.62*((i*37)%100)/100)*Math.min(W,H);
      var x=W*0.5+Math.cos(a)*r*0.72, y=H*0.62+Math.sin(a*1.31)*r*0.42;
      var rad=(70+((i*53)%120))*s;
      var g=ctx.createRadialGradient(x,y,0,x,y,rad);
      g.addColorStop(0,'rgba(120,215,255,0.16)'); g.addColorStop(1,'rgba(120,215,255,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,rad,0,6.2832); ctx.fill();
    }
    ctx.strokeStyle='rgba(150,225,255,0.10)'; ctx.lineWidth=1.1*s;
    for(var j=0;j<7;j++){
      ctx.beginPath();
      for(var k=0;k<=44;k++){
        var px=W*k/44, py=H*(0.30+j*0.075)+Math.sin(k*0.34+t*0.5+j)*16*s+Math.cos(k*0.13-t*0.3)*9*s;
        k?ctx.lineTo(px,py):ctx.moveTo(px,py);
      }
      ctx.stroke();
    }
  }
  function loop(){ t+=0.006; draw(); raf=requestAnimationFrame(loop); }
  size(); draw();
  addEventListener('resize',function(){ size(); draw(); },{passive:true});
  if(!reduce){
    var io=new IntersectionObserver(function(e){
      if(e[0].isIntersecting){ if(!raf) loop(); } else { cancelAnimationFrame(raf); raf=null; }
    },{threshold:0.02});
    io.observe(c);
  }
})();
'''

def render():
    nav = "".join(
        f'<a href="#{i}" data-range="{",".join(NAV_RANGE[i])}">{ar} <span class="en dim">· {en}</span></a>'
        for i, ar, en in NAV)
    css = open(os.path.join(HERE, "style.css"), encoding="utf-8").read()
    return f'''<title>شَبِم · SHABIM</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="SHABIM — an Arabic cold-drinks and frozen-dessert brand engineered for 45°C, from Baghdad to the Gulf. Investor presentation.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap">
<style>{css}{CSS_EXTRA}</style>
<div class="rail" aria-hidden="true"></div>
<div class="topbar">
  <span class="mark ar">شَبِم</span>
  <span class="chip en">SHABIM</span>
  <nav aria-label="Sections">{nav}</nav>
  <span class="sep"></span>
  <span class="chip en">Investor deck</span>
</div>
{HERO}
<main>
{"".join(S)}
</main>
<footer class="end">
  <div class="in">
    <p class="wordmark ar" style="font-size:var(--step-4);margin-bottom:.5rem">شَبِم</p>
    <p class="sub" style="max-width:60ch">A brand is a promise about a physical thing. This one promises cold —
    the specific, classical, water-cold that Arabic has a word for and nobody has used commercially.</p>
    <div class="melt"></div>
    <p class="fnote">
      Prepared {A["_meta"]["as_of"]}. All financial figures are model outputs from a fully parameterised model; the
      assumptions and their sourcing grade are in §23. Currency conversions use the Iraqi dinar's parallel-market rate
      of {A["fx"]["iqd_per_usd_parallel"]:,} per USD, not the official CBI rate of {A["fx"]["iqd_per_usd_official"]:,} —
      the parallel rate is what applies to imported equipment and dollar-denominated costs, and using the official
      rate would overstate dollar revenue by roughly 17%.
      <br><br>
      This document contains forward-looking projections that depend on assumptions which have not all been verified.
      Equipment costs require supplier quotes. Rent and key money require landlord negotiation. Trademark clearance
      searches have not been run. It is a plan, presented with its own gaps marked, and it is not an offer of
      securities.
    </p>
  </div>
</footer>
<script>{SCRIPT}</script>'''


NAV_RANGE = {
 "s1": ["s1","s2","s3"], "s4": ["s4","s5","s6"], "s7": ["s7","s8","s9","s10"],
 "s11": ["s11","s12","s13","s14","s15","s16","s17","s18"], "s19": ["s19","s20","s21","s22"], "s23": ["s23"],
}

if __name__ == "__main__":
    html = render()
    out = os.path.join(HERE, "deck.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"wrote {out}  ({len(html):,} bytes, {len(S)} sections)")
