#!/usr/bin/env python3
"""sun_position.py - NOAA/Meeus solar position (ledger-continuity-physics.md L.7.1). Standard library only.

Accuracy about 0.1 deg; no refraction except in sunrise/sunset (90.833 deg).
Usage:  python3 -I scripts/sun_position.py 2045-04-15 11:40 --cam 278   (one time)
        python3 -I scripts/sun_position.py 2045-04-15 day                (every 30 min, sunrise..sunset)
Options: --lat 25.2048 --lon 55.2708 --tz 4 (Dubai defaults) --cam <lens heading, deg clockwise from true north>
rel uses 04's sun_relative sign: + = sun to camera-left, 0 = sun in the lens (backlight), +-180 = behind camera.
"""
import datetime as dt
import math
import sys


def sun(lat, lon, tz, day, minutes):
    t = dt.datetime.combine(day, dt.time()) + dt.timedelta(minutes=minutes - 60 * tz)
    T = ((t - dt.datetime(2000, 1, 1, 12)).total_seconds() / 86400) / 36525
    L0 = (280.46646 + T * (36000.76983 + 0.0003032 * T)) % 360
    M = math.radians(357.52911 + T * (35999.05029 - 0.0001537 * T))
    e = 0.016708634 - T * 0.000042037
    C = math.sin(M) * (1.914602 - 0.004817 * T) + math.sin(2 * M) * 0.019993 + math.sin(3 * M) * 0.000289
    om = math.radians(125.04 - 1934.136 * T)
    lam = math.radians(L0 + C - 0.00569 - 0.00478 * math.sin(om))
    eps = math.radians(23.439291 - 0.0130042 * T + 0.00256 * math.cos(om))
    dec = math.asin(math.sin(eps) * math.sin(lam))
    y = math.tan(eps / 2) ** 2
    L = math.radians(L0)
    eot = 4 * math.degrees(y * math.sin(2 * L) - 2 * e * math.sin(M) + 4 * e * y * math.sin(M) * math.cos(2 * L)
                           - 0.5 * y * y * math.sin(4 * L) - 1.25 * e * e * math.sin(2 * M))
    ha = math.radians(((minutes + eot + 4 * lon - 60 * tz) % 1440) / 4 - 180)
    la = math.radians(lat)
    el = math.degrees(math.asin(math.sin(la) * math.sin(dec) + math.cos(la) * math.cos(dec) * math.cos(ha)))
    az = (math.degrees(math.atan2(math.sin(ha), math.cos(ha) * math.sin(la) - math.tan(dec) * math.cos(la))) + 180) % 360
    noon = 720 - 4 * lon - eot + 60 * tz
    h0 = math.degrees(math.acos(math.cos(math.radians(90.833)) / (math.cos(la) * math.cos(dec))
                                - math.tan(la) * math.tan(dec)))
    return az, el, noon, noon - 4 * h0, noon + 4 * h0


def hm(m):
    return "%02d:%02d" % divmod(int(round(m)) % 1440, 60)


def row(lat, lon, tz, day, m, cam):
    az, el, *_ = sun(lat, lon, tz, day, m)
    sh = "%.2f" % (1 / math.tan(math.radians(el))) if el > 1 else "long"
    rel = "" if cam is None else "  rel %+.0f" % (((cam - az + 180) % 360) - 180)
    return "%s  az %5.1f  el %5.1f  shadow %s x height  shadow points to az %5.1f%s" % (
        hm(m), az, el, sh, (az + 180) % 360, rel)


def main(a):
    if len(a) < 2:
        sys.exit(__doc__)
    opt = {k: float(a[i + 1]) for i, k in enumerate(a) if k.startswith("--")}
    lat, lon, tz, cam = opt.get("--lat", 25.2048), opt.get("--lon", 55.2708), opt.get("--tz", 4.0), opt.get("--cam")
    day = dt.date.fromisoformat(a[0])
    _, _, noon, rise, sset = sun(lat, lon, tz, day, 720)
    print("%.4f N %.4f E  %s  sunrise %s  solar noon %s  sunset %s (local UTC%+g)" % (
        lat, lon, day, hm(rise), hm(noon), hm(sset), tz))
    if a[1] == "day":
        for m in range(int(rise // 30 * 30 + 30), int(sset), 30):
            print(row(lat, lon, tz, day, m, cam))
    else:
        h, mi = map(int, a[1].split(":"))
        print(row(lat, lon, tz, day, h * 60 + mi, cam))


if __name__ == "__main__":
    main(sys.argv[1:])
