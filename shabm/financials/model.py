#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SHABM (شَبِم) — full financial model.

Three entities are modelled:
  A. The Baghdad flagship "Cube" (company-owned, the founder's own investment)
  B. A representative franchisee unit in each target market
  C. SHABM Holding — the franchisor P&L that an investor actually buys into

Everything is driven by assumptions.json. Every assumption carries a source tag:
  H = hard-sourced (URL in sources.md)   E = estimate (derivation in the note)
Run:  python3 model.py  ->  writes model_output.json
"""

import json, math, os
from copy import deepcopy

HERE = os.path.dirname(os.path.abspath(__file__))


# ─────────────────────────────────────────────────────────────────────────────
# helpers
# ─────────────────────────────────────────────────────────────────────────────

def npv(rate, flows):
    """flows[0] is t=0."""
    return sum(f / (1 + rate) ** i for i, f in enumerate(flows))


def irr(flows, lo=-0.95, hi=10.0, tol=1e-7):
    """Bisection IRR. Returns None if no sign change."""
    def f(r):
        return npv(r, flows)
    if f(lo) * f(hi) > 0:
        return None
    for _ in range(300):
        mid = (lo + hi) / 2
        v = f(mid)
        if abs(v) < tol:
            return mid
        if f(lo) * v < 0:
            hi = mid
        else:
            lo = mid
    return (lo + hi) / 2


def payback_months(capex, monthly_flows):
    """Months until cumulative operating cash flow repays capex."""
    cum = 0.0
    for i, m in enumerate(monthly_flows, start=1):
        prev = cum
        cum += m
        if cum >= capex:
            need = capex - prev
            return i - 1 + (need / m if m else 0)
    return None


def r0(x):
    return int(round(x))


def r1(x):
    return round(x, 1)


def r2(x):
    return round(x, 2)


# ─────────────────────────────────────────────────────────────────────────────
# A. UNIT MODEL
# ─────────────────────────────────────────────────────────────────────────────

class Unit:
    """One store. Format + market decide the cost base; the menu decides margin."""

    def __init__(self, A, fmt_key, mkt_key, label, royalty_applied=0.0):
        self.A = A
        self.fmt = A["formats"][fmt_key]
        self.mkt = A["markets"][mkt_key]
        self.fmt_key = fmt_key
        self.mkt_key = mkt_key
        self.label = label
        self.royalty_applied = royalty_applied
        self.menu = A["menu"]
        self.mix = A["formats"][fmt_key]["mix"]

    # ---- menu economics -----------------------------------------------------
    def price(self, sku):
        """Local menu price in USD for this market."""
        base = self.menu[sku]["price_usd_baghdad"]
        return base * self.mkt["price_index"]

    def cogs(self, sku):
        base = self.menu[sku]["cogs_usd_baghdad"]
        return base * self.mkt["cogs_index"]

    def basket(self):
        """Weighted average ticket, COGS and gross margin across the mix.
        `mix` is share of *revenue*, so we solve for unit shares first."""
        # unit share u_i  ∝  revenue_share_i / price_i
        raw = {k: v / self.price(k) for k, v in self.mix.items() if v > 0}
        tot = sum(raw.values())
        ushare = {k: v / tot for k, v in raw.items()}
        avg_price = sum(ushare[k] * self.price(k) for k in ushare)
        avg_cogs = sum(ushare[k] * self.cogs(k) for k in ushare)
        # a transaction is more than one item
        ipt = self.fmt["items_per_ticket"]
        return {
            "unit_share": {k: round(v, 4) for k, v in ushare.items()},
            "avg_item_price": avg_price,
            "avg_item_cogs": avg_cogs,
            "items_per_ticket": ipt,
            "avg_ticket": avg_price * ipt,
            "ticket_cogs": avg_cogs * ipt,
            "gross_margin_pct": 1 - (avg_cogs / avg_price),
        }

    # ---- capacity -----------------------------------------------------------
    def capacity(self):
        """Peak-hour throughput, constrained by prep seconds per item and stations."""
        secs = 0.0
        b = self.basket()
        for k, u in b["unit_share"].items():
            secs += u * self.menu[k]["prep_seconds"]
        avg_item_secs = secs
        stations = self.fmt["prod_stations"]
        eff = self.A["ops"]["station_efficiency"]
        items_per_hour = stations * 3600 / avg_item_secs * eff
        tx_per_hour = items_per_hour / b["items_per_ticket"]
        return {
            "avg_item_prep_seconds": r1(avg_item_secs),
            "stations": stations,
            "peak_items_per_hour": r0(items_per_hour),
            "peak_tx_per_hour": r0(tx_per_hour),
        }

    # ---- revenue ------------------------------------------------------------
    def monthly(self, year_index):
        """Returns 12 dicts of monthly P&L for the given operating year (0-based)."""
        A = self.A
        b = self.basket()
        cap = self.capacity()
        _raw = self.mkt["seasonality"]
        _mean = sum(_raw) / 12.0
        seas = [v / _mean for v in _raw]   # normalised: the SHAPE is the forecast,
                                           # the LEVEL must come from baseline_tx_per_day alone.
        ramp = A["ops"]["ramp"][year_index] if year_index < len(A["ops"]["ramp"]) else A["ops"]["ramp"][-1]
        growth = (1 + A["ops"]["like_for_like_growth"]) ** max(0, year_index - 1) if year_index >= 1 else 1.0

        base_tx = self.fmt["baseline_tx_per_day"] * self.mkt["demand_index"]
        rows = []
        for m in range(12):
            days = A["ops"]["days_per_month"]
            tx_day = base_tx * seas[m] * ramp * growth
            # hard capacity ceiling: peak-hour capacity × effective peak-equivalent hours
            ceiling = cap["peak_tx_per_hour"] * self.fmt["peak_equivalent_hours"]
            capped = min(tx_day, ceiling)
            tx = capped * days

            gross = tx * b["avg_ticket"]
            # delivery: aggregator commission on the delivered share
            dshare = self.fmt["delivery_share"]
            comm = gross * dshare * self.mkt["delivery_commission"]
            stax = gross * self.mkt.get("sales_tax_pct", 0.0)
            net_rev = gross - comm - stax

            cogs = tx * b["ticket_cogs"]
            waste = cogs * A["ops"]["waste_pct"]
            cogs_t = cogs + waste

            esc = (1 + A["ops"]["cost_escalation"]) ** year_index
            labour = self.labour_monthly(m, seas[m]) * esc
            rent = (self.fmt["rent_usd_month"] * self.mkt["rent_index"]
                    * (1 + A["ops"]["rent_escalation"]) ** year_index)
            util = self.utilities(seas[m]) * esc
            mkt_spend = gross * (A["ops"]["marketing_pct_y1"] if year_index == 0 else A["ops"]["marketing_pct"])
            card = gross * A["ops"]["card_fee_pct"] * self.mkt["card_share"]
            other = self.fmt["other_opex_usd_month"] * self.mkt["cost_index"] * esc
            royalty = gross * self.royalty_applied

            opex = labour + rent + util + mkt_spend + card + other + royalty
            ebitda = net_rev - cogs_t - opex
            rows.append({
                "month": m + 1,
                "tx_per_day": r1(capped),
                "capacity_used_pct": r1(100 * capped / ceiling),
                "transactions": r0(tx),
                "gross_revenue": gross,
                "delivery_commission": comm,
                "sales_tax": stax,
                "net_revenue": net_rev,
                "cogs": cogs_t,
                "gross_profit": net_rev - cogs_t,
                "labour": labour,
                "rent": rent,
                "utilities": util,
                "marketing": mkt_spend,
                "card_fees": card,
                "other_opex": other,
                "royalty": royalty,
                "opex": opex,
                "ebitda": ebitda,
            })
        return rows

    def labour_monthly(self, month_idx, seas_mult):
        """Core team all year + seasonal extras scaled to demand."""
        A = self.A
        w = self.mkt["wages"]
        core = self.fmt["staff_core"]
        peak_extra = self.fmt["staff_peak_extra"]
        # extras scale with how far above trough the month sits
        extra = peak_extra * max(0.0, (seas_mult - 0.75) / (1.55 - 0.75))
        cost = 0.0
        for role, n in core.items():
            cost += n * w[role]
        cost += extra * w["barista"]
        return cost * (1 + A["ops"]["employer_oncost_pct"])

    def utilities(self, seas_mult):
        """Refrigeration is the load; it tracks ambient heat, not just sales."""
        f = self.fmt
        m = self.mkt
        base = f["utilities_base_usd_month"] * m["utility_index"]
        cooling = f["utilities_cooling_usd_month"] * m["utility_index"] * seas_mult ** 1.35
        return base + cooling

    # ---- capex --------------------------------------------------------------
    def capex(self):
        A = self.A
        f = self.fmt
        m = self.mkt
        items = {}
        for k, v in f["capex"].items():
            idx = m["fitout_index"] if k in ("fitout", "furniture", "lighting_signage", "mep_generator") else m["equip_index"]
            items[k] = v * idx
        equip_keys = ("espresso_system", "ult_cold_chain", "clear_ice_system", "rolled_pans",
                      "sorbet_gelato", "juice_slush", "refrigeration_misc", "smallwares")
        items["spares_service_reserve"] = sum(items.get(x, 0) for x in equip_keys) * A["ops"]["spares_pct"]
        items["key_money"] = f["key_money_usd"] * m["rent_index"]
        items["pre_opening"] = f["pre_opening_usd"] * m["cost_index"]
        items["working_capital"] = f["working_capital_usd"] * m["cost_index"]
        items["contingency"] = sum(items.values()) * f.get(
            "capex_contingency_pct", A["ops"]["capex_contingency_pct"])
        total = sum(items.values())
        return {"items": {k: r0(v) for k, v in items.items()}, "total": r0(total)}

    # ---- full P&L -----------------------------------------------------------
    def pnl(self, years=5):
        A = self.A
        cx = self.capex()
        dep_base = cx["total"] - cx["items"]["working_capital"]
        dep = dep_base / A["ops"]["depreciation_years"]
        out = []
        all_months = []
        for y in range(years):
            ms = self.monthly(y)
            all_months.append(ms)
            agg = {k: sum(r[k] for r in ms) for k in
                   ("gross_revenue", "delivery_commission", "sales_tax", "net_revenue", "cogs", "gross_profit",
                    "labour", "rent", "utilities", "marketing", "card_fees", "other_opex", "royalty",
                    "opex", "ebitda")}
            agg["transactions"] = sum(r["transactions"] for r in ms)
            agg["depreciation"] = dep
            agg["ebit"] = agg["ebitda"] - dep
            tax = max(0.0, agg["ebit"]) * self.mkt["cit"]
            agg["tax"] = tax
            agg["net_income"] = agg["ebit"] - tax
            agg["free_cash_flow"] = agg["ebitda"] - tax - A["ops"]["maintenance_capex_pct"] * agg["gross_revenue"]
            agg["year"] = y + 1
            agg["ebitda_margin"] = agg["ebitda"] / agg["gross_revenue"] if agg["gross_revenue"] else 0
            agg["prime_cost_pct"] = (agg["cogs"] + agg["labour"]) / agg["gross_revenue"] if agg["gross_revenue"] else 0
            out.append(agg)

        m1 = [r["ebitda"] for yr in all_months for r in yr]
        pb = payback_months(cx["total"], m1)
        flows = [-cx["total"]] + [y["free_cash_flow"] for y in out]
        # terminal value on exit at year `years` — conservative EBITDA multiple
        tv = out[-1]["ebitda"] * A["ops"]["unit_exit_multiple"]
        flows_tv = flows[:-1] + [flows[-1] + tv]
        return {
            "label": self.label,
            "format": self.fmt_key,
            "market": self.mkt_key,
            "basket": {k: (r2(v) if isinstance(v, float) else v) for k, v in self.basket().items()},
            "capacity": self.capacity(),
            "capex": cx,
            "monthly_y1": [{k: (r0(v) if isinstance(v, float) and abs(v) > 5 else v) for k, v in r.items()} for r in all_months[0]],
            "monthly_y2": [{k: (r0(v) if isinstance(v, float) and abs(v) > 5 else v) for k, v in r.items()} for r in all_months[1]],
            "years": [{k: (r0(v) if isinstance(v, float) and abs(v) > 5 else (r2(v) if isinstance(v, float) else v))
                       for k, v in y.items()} for y in out],
            "payback_months": r1(pb) if pb else None,
            "irr_5y": r2(irr(flows_tv) * 100) if irr(flows_tv) is not None else None,
            "npv_5y_at_20": r0(npv(0.20, flows_tv)),
            "roi_y2_pct": r1(100 * out[1]["ebitda"] / cx["total"]),
        }


# ─────────────────────────────────────────────────────────────────────────────
# C. FRANCHISOR MODEL
# ─────────────────────────────────────────────────────────────────────────────

def franchisor(A, unit_models):
    F = A["franchise"]
    plan = A["rollout"]          # per year: {"own": n, "franchise": {market: n}}
    years = len(plan)

    # revenue per franchised unit, by market
    unit_rev = {k: v["years"][1]["gross_revenue"] for k, v in unit_models.items()}

    rows = []
    cum_units = {"own": 0, "fr": 0}
    cum_by_mkt = {}
    for y in range(years):
        p = plan[y]
        opened_own = p["own"]
        opened_fr = sum(p["franchise"].values())
        # units trading this year — new units trade a partial year
        cum_units["own"] += opened_own
        cum_units["fr"] += opened_fr
        closure = F.get("closure_rate", 0.0) if y >= 2 else 0.0
        if closure:
            for mk in list(cum_by_mkt):
                lost = cum_by_mkt[mk] * closure
                cum_by_mkt[mk] = max(0.0, cum_by_mkt[mk] - lost)
                cum_units["fr"] -= lost
        for mk, n in p["franchise"].items():
            cum_by_mkt[mk] = cum_by_mkt.get(mk, 0) + n

        # --- franchisor revenue lines ---
        # 1. initial franchise fees on units opened this year
        fee_rev = 0.0
        for mk, n in p["franchise"].items():
            key = {"baghdad_fr": "iraq", "baghdad_kiosk": "iraq", "baghdad_kiosk_fr": "baghdad_kiosk_fr",
                   "riyadh_fr": "ksa", "riyadh_kiosk": "riyadh_kiosk",
                   "dubai_fr": "uae", "doha_fr": "qatar", "cairo_fr": "egypt", "cairo_kiosk": "egypt"}.get(mk, "default")
            fee_rev += n * F["initial_fee_usd"].get(key, F["initial_fee_usd"]["default"])
        # 2. master / area development fees
        adf = F["area_dev_fee_schedule"][y] if y < len(F["area_dev_fee_schedule"]) else 0
        # 3. royalties + ad fund on the trading estate (new units weighted at half a year)
        royalty_base = 0.0
        royalty = 0.0
        adfund = 0.0
        for mk, n_cum in cum_by_mkt.items():
            n_new = p["franchise"].get(mk, 0)
            trading = (n_cum - n_new) + n_new * F["new_unit_year_weight"]
            base = trading * unit_rev.get(mk, unit_rev["baghdad_fr"]) * A["ops"]["franchise_rev_index"]
            royalty_base += base
            mkt_of = A["unit_scenarios"].get(mk, {}).get("market", "iraq")
            rr = F["royalty_by_market"].get(mkt_of, F["royalty_by_market"]["default"])
            royalty += base * rr["royalty"]
            adfund += base * rr["ad_fund"]
        # 4. supply-chain margin: proprietary beans, sorbet base, packaging, ice moulds
        supply = royalty_base * F["supply_share_of_rev"] * F["supply_margin_pct"]

        # 5. company-owned store EBITDA
        own_trading = (cum_units["own"] - opened_own) + opened_own * F["new_unit_year_weight"]
        own_ebitda = own_trading * unit_models["baghdad_own"]["years"][min(y, 4)]["ebitda"] * F["own_store_blend"]
        own_rev = own_trading * unit_models["baghdad_own"]["years"][min(y, 4)]["gross_revenue"] * F["own_store_blend"]

        gross_rev = fee_rev + adf + royalty + adfund + supply + own_rev

        # --- franchisor costs ---
        hq = F["hq_cost_schedule"][y] if y < len(F["hq_cost_schedule"]) else F["hq_cost_schedule"][-1]
        adfund_spend = adfund                     # pass-through, spent in full
        supply_cogs = 0.0                         # supply margin is already net
        support_cost = (cum_units["fr"]) * F["support_cost_per_unit_usd"]
        own_cost = own_rev - own_ebitda
        opening_cost = opened_fr * F["opening_support_cost_usd"]
        total_cost = hq + adfund_spend + support_cost + own_cost + opening_cost + supply_cogs

        ebitda = gross_rev - total_cost
        rows.append({
            "year": y + 1,
            "units_own": cum_units["own"],
            "units_franchised": r0(cum_units["fr"]),
            "units_total": r0(cum_units["own"] + cum_units["fr"]),
            "opened_this_year": opened_own + opened_fr,
            "system_sales": r0(royalty_base + own_rev),
            "fee_revenue": r0(fee_rev + adf),
            "royalty": r0(royalty),
            "ad_fund": r0(adfund),
            "supply_margin": r0(supply),
            "own_store_revenue": r0(own_rev),
            "total_revenue": r0(gross_rev),
            "hq_cost": r0(hq),
            "support_cost": r0(support_cost + opening_cost),
            "ad_fund_spend": r0(adfund_spend),
            "own_store_cost": r0(own_cost),
            "total_cost": r0(total_cost),
            "ebitda": r0(ebitda),
            "ebitda_margin": r2(ebitda / gross_rev) if gross_rev else 0,
        })

    # investor cash flows: the raise at t0, then franchisor FCF
    raise_amt = A["raise"]["amount_usd"]
    flows = [-raise_amt]
    for i, r in enumerate(rows):
        # The Year-1 flagship is Track A — funded by the founder before the raise — so it is
        # not a call on investor capital even though its EBITDA is consolidated here.
        capex_own = (0 if i == 0 else plan[i]["own"] * unit_models["baghdad_own"]["capex"]["total"])
        tax = max(0.0, r["ebitda"] - F["hq_dep_usd"]) * A["markets"]["iraq"]["cit"]
        flows.append(r["ebitda"] - tax - capex_own)
    exit_ev = rows[-1]["ebitda"] * A["raise"]["exit_multiple"]
    flows_exit = flows[:-1] + [flows[-1] + exit_ev]

    return {
        "years": rows,
        "exit_ev": r0(exit_ev),
        "irr_pct": r2(irr(flows_exit) * 100) if irr(flows_exit) is not None else None,
        "moic": r2((sum(f for f in flows_exit[1:]) ) / raise_amt),
        "cash_flows": [r0(f) for f in flows_exit],
    }


# ─────────────────────────────────────────────────────────────────────────────
# scenarios
# ─────────────────────────────────────────────────────────────────────────────

def scenario(A, name, tweaks):
    B = deepcopy(A)
    for path, mult in tweaks.items():
        node = B
        keys = path.split(".")
        for k in keys[:-1]:
            node = node[k]
        node[keys[-1]] = node[keys[-1]] * mult
    return name, B


def build(A):
    units = {}
    for key, spec in A["unit_scenarios"].items():
        if not isinstance(spec, dict) or "format" not in spec:
            continue
        u = Unit(A, spec["format"], spec["market"], spec["label"], spec.get("royalty_applied", 0.0))
        units[key] = u.pnl()
    fr = franchisor(A, units)

    # sensitivity on the flagship
    sens = {}
    for nm, tw in A["scenarios"].items():
        _, B = scenario(A, nm, tw)
        uu = Unit(B, A["unit_scenarios"]["baghdad_own"]["format"], "iraq", "flagship", 0.0)
        p = uu.pnl()
        sens[nm] = {
            "y2_revenue": p["years"][1]["gross_revenue"],
            "y2_ebitda": p["years"][1]["ebitda"],
            "y2_margin": p["years"][1]["ebitda_margin"],
            "payback_months": p["payback_months"],
            "irr_5y": p["irr_5y"],
        }

    return {"units": units, "franchisor": fr, "scenarios": sens, "assumptions": A}


if __name__ == "__main__":
    with open(os.path.join(HERE, "assumptions.json"), encoding="utf-8") as f:
        A = json.load(f)
    out = build(A)
    with open(os.path.join(HERE, "model_output.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    u = out["units"]["baghdad_own"]
    print(f"CAPEX            ${u['capex']['total']:,}")
    print(f"Avg ticket       ${u['basket']['avg_ticket']:.2f}  GM {u['basket']['gross_margin_pct']*100:.1f}%")
    print(f"Peak tx/hour     {u['capacity']['peak_tx_per_hour']}")
    for y in u["years"]:
        print(f"  Y{y['year']}  rev ${y['gross_revenue']:>9,}  EBITDA ${y['ebitda']:>9,}  ({y['ebitda_margin']*100:.1f}%)")
    print(f"Payback          {u['payback_months']} months     IRR {u['irr_5y']}%")
    print("\nFranchisor:")
    for y in out["franchisor"]["years"]:
        print(f"  Y{y['year']}  units {y['units_total']:>3}  sys sales ${y['system_sales']:>11,}  rev ${y['total_revenue']:>9,}  EBITDA ${y['ebitda']:>9,}")
    print(f"Exit EV ${out['franchisor']['exit_ev']:,}   IRR {out['franchisor']['irr_pct']}%   MOIC {out['franchisor']['moic']}x")
