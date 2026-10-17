# Edit decision list for the Rojin / Axi Academy 9:16 ad (24 fps, seconds).
FPS = 24
W, H = 1080, 1920
CUTS = [
    (None, 0.00, 0.25, 0),
    ('R01', 0.25, 2.60, 0.60),   # information overload
    ('R02', 2.60, 4.20, 1.80),   # eyes close
    (None, 4.20, 5.40, 0),       # DIM: "كل رحلة… تبدي بخطوة."
    ('R03', 5.40, 7.60, 2.50),   # impossible staircase, first step
    ('R04', 7.60, 10.00, 1.20),  # pen-nib monument
    ('R05', 10.00, 11.30, 1.60), # 01 basics
    ('R06', 11.30, 12.60, 0.80), # 02 charts
    ('R07', 12.60, 13.90, 1.40), # 03 analysis
    ('R08', 13.90, 15.20, 1.00), # 04 strategy
    ('R09', 15.20, 16.50, 1.60), # 05 before the first deposit
    ('R13', 16.50, 17.80, 0.30), # 06 gold (retake)
    (None, 17.80, 18.30, 0),     # micro dim
    ('R11', 18.30, 21.80, 1.40), # from zero to pro
    ('R12', 21.80, 24.80, 1.60), # final look
    ('END', 24.80, 31.00, 0),    # end card (overlay)
]
DUR = 31.0
FADES = [(0.25, 0.50, 0.0, 1.0), (4.05, 4.20, 1.0, 0.0), (5.40, 5.75, 0.0, 1.0),
         (17.65, 17.80, 1.0, 0.0), (18.30, 18.55, 0.0, 1.0)]
