# Shared edit decision list for the Saeed ad (24 fps timeline, seconds).
FPS = 24
# (shot, timeline in, timeline out, source in)
CUTS = [
    (None, 0.00, 0.25, 0),
    ('T01', 0.25, 1.85, 0.40),   # ripple
    ('T02', 1.85, 3.55, 0.70),   # eyes open
    ('T03', 3.55, 5.15, 1.70),   # watch movement, axi logo
    ('T04', 5.15, 7.25, 1.00),   # fog, ticker rain
    ('T06', 7.25, 8.45, 2.30),   # red candles in the eye
    ('T05', 8.45, 10.15, 0.50),  # city rushes past
    (None, 10.15, 11.45, 0),     # DIM
    ('T15', 11.45, 13.65, 1.00), # spark on the phone
    ('T07', 13.65, 16.35, 1.70), # rain freezes
    ('T09', 16.35, 17.85, 0.40), # green streak
    ('T08', 17.85, 19.65, 3.20), # walk through frozen rain
    ('T11', 19.65, 22.05, 2.20), # calm face, nod
    ('T10', 22.05, 24.35, 1.00), # rock arch
    ('T12', 24.35, 27.35, 0.70), # summit, green line
    ('T13', 27.35, 28.75, 0.60), # cliff wide
    ('T14', 28.75, 31.35, 2.30), # final look
    ('END', 31.35, 36.45, 0),    # end card (tagline + logo)
]
DUR = 36.45
# dims: (start, end) fade multipliers handled in compose: fade-out start..end, black, fade-in
FADES = [  # (t0, t1, from, to) brightness ramps applied on top of the cut
    (0.25, 0.55, 0.0, 1.0),
    (10.00, 10.15, 1.0, 0.0),
    (11.45, 11.85, 0.0, 1.0),
]
# voice-over chunks from vo_t1.mp3: (src a, src b, timeline start)
VO = [(0.15, 0.96, 1.30), (1.48, 3.08, 2.50), (3.90, 6.54, 4.85), (7.12, 8.69, 8.55), (9.69, 10.37, 10.65),
      (11.26, 15.58, 11.95), (16.33, 18.23, 16.75), (18.66, 20.28, 19.25), (20.92, 21.93, 22.30),
      (22.42, 23.40, 24.75), (24.04, 25.09, 29.35), (25.42, 27.45, 31.65)]
SUBS = [(1.30, 4.15, 'بالسوق… كل ثانية إلها ثمن.'), (4.85, 7.55, 'أرقام… أخبار… ضجيج…'),
        (8.55, 10.15, 'والسوق دايماً أسرع منك.'), (10.65, 11.40, 'بس تخيّل…'),
        (11.95, 16.30, 'لو عندك ذكاء خارق… يحلّل بثواني، اللي ياخذ منك ساعات.'),
        (16.75, 18.70, 'تسأله… يجاوبك بوضوح.'), (19.25, 20.95, 'وإنت… تاخذ القرار.'),
        (22.30, 23.40, 'هذا مو بس تداول…'), (24.75, 25.80, 'هذا مستوى ثاني.'),
        (29.35, 30.50, 'Claude ويّا Axi…')]
