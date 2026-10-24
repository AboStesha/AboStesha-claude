#!/usr/bin/env python3
"""Preview page for the code-built scenes (src/scenes.js), before they replace renders in the deck.
Writes dist/scenes.html (Artifact body) and dist/scenes_standalone.html (full document, for local QA)."""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / 'src'

PAGE = '''<title>مشاهد بالكود</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
{FONTS}
:root { --bg: #040507; --fg: #F5F3EF; --fg-2: rgba(245,243,239,.72); --fg-3: rgba(245,243,239,.48); --line: rgba(255,255,255,.12); --blue: #5B93FF; --blue-2: #9CC0FF; color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg); font-family: 'Readex Pro', 'Segoe UI', Tahoma, system-ui, sans-serif; font-weight: 300; direction: rtl; -webkit-font-smoothing: antialiased; }
main { max-width: 1240px; margin: 0 auto; padding-block: 48px 72px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 56px; }
header { display: grid; gap: 14px; max-width: 46em; }
.k { display: inline-flex; align-items: center; gap: 12px; font-size: 14px; color: var(--blue-2); }
.k::before { content: ""; width: 30px; height: 1px; background: var(--blue); box-shadow: 0 0 10px var(--blue); }
h1 { margin: 0; font-size: clamp(34px, 6vw, 64px); font-weight: 260; line-height: 1.1; text-wrap: balance; }
h1 em { font-style: normal; color: var(--blue-2); }
header p { margin: 0; font-size: clamp(16px, 2.2vw, 20px); line-height: 1.7; color: var(--fg-2); }
figure { margin: 0; display: grid; gap: 16px; }
.scene { aspect-ratio: 16 / 9; width: 100%; border-radius: 22px; border: 1px solid var(--line); box-shadow: 0 40px 120px rgba(0,0,0,.6); }
.tabs { position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%); z-index: 3; display: flex; gap: 6px; padding: 6px; border-radius: 999px; border: 1px solid var(--line); background: rgba(8,10,14,.62); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.tabs button { font: inherit; border: 0; background: none; color: var(--fg-2); padding: 10px 18px; border-radius: 999px; font-size: 15px; cursor: pointer; white-space: nowrap; transition: background .3s, color .3s; }
.tabs button[aria-selected="true"] { background: var(--fg); color: #05070A; font-weight: 500; }
.tabs button:focus-visible { outline: 2px solid var(--blue-2); outline-offset: 2px; }
figcaption { display: grid; gap: 6px; }
figcaption b { font-size: 24px; font-weight: 400; }
figcaption span { font-size: 16px; color: var(--fg-2); line-height: 1.7; max-width: 52em; }
.note { font-size: 14px; color: var(--fg-3); }
@media (max-width: 560px) { .tabs { bottom: 10px; } .tabs button { padding: 8px 12px; font-size: 13px; } .scene { border-radius: 16px; } }
{SCENECSS}
</style>
<main>
  <header>
    <span class="k">تجربة · مرسومة بالكود</span>
    <h1>مشاهد حيّة <em>بلا صور ولا فيديو</em></h1>
    <p>كل ما تراه هنا يُرسم ويتحرك مباشرةً في المتصفح بالكود. عيّنة من مشهدين قبل تحويل باقي العرض.</p>
  </header>
  <figure>
    <div class="scene" id="vx"><div class="tabs" role="tablist" aria-label="وضع القاعة">
      <button type="button" role="tab" data-m="concert" aria-selected="true">حفلة</button>
      <button type="button" role="tab" data-m="show" aria-selected="false">عرض غامر</button>
      <button type="button" role="tab" data-m="match" aria-selected="false">ليلة المباراة</button>
    </div></div>
    <figcaption><b>فورتكس</b><span>الجدران والسقف شاشات حيّة في منظور ثلاثي الأبعاد. «عرض غامر» يحوّل الشاشات إلى بوابة عشتار وزقورة أور وأسود بابل، و«ليلة المباراة» يعرض مباراة حيّة والجمهور جالس.</span></figcaption>
  </figure>
  <figure>
    <div class="scene" id="pm"></div>
    <figcaption><b>باك مان لايف</b><span>اللاعبون يمشون داخل المتاهة والأشباح تلاحقهم. عندما يمرّ لاعب على النقطة الكبيرة تتحوّل الأشباح إلى الأزرق وتهرب.</span></figcaption>
  </figure>
  <p class="note">المشاهد تتوقف تلقائياً عندما تخرج من الشاشة، لتوفير البطارية.</p>
</main>
<script>
{SCENEJS}
</script>
<script>
(function () {
  const vxEl = document.getElementById('vx'), tabs = vxEl.querySelector('.tabs');
  const vx = Scenes.vortex(vxEl);
  vxEl.appendChild(tabs);
  Scenes.pacman(document.getElementById('pm'));
  const btns = [...tabs.querySelectorAll('button')], order = btns.map(b => b.dataset.m);
  let auto = true;
  const pick = m => { vx.set(m); btns.forEach(b => b.setAttribute('aria-selected', String(b.dataset.m === m))); };
  btns.forEach(b => b.addEventListener('click', () => { auto = false; pick(b.dataset.m); }));
  setInterval(() => { if (auto && !document.hidden) pick(order[(order.indexOf(vx.mode) + 1) % order.length]); }, 8000);
})();
</script>'''


def main():
    out = (PAGE.replace('{FONTS}', (SRC / 'fonts.css').read_text(encoding='utf-8'))
               .replace('{SCENECSS}', (SRC / 'scenes.css').read_text(encoding='utf-8'))
               .replace('{SCENEJS}', (SRC / 'scenes.js').read_text(encoding='utf-8')))
    (ROOT / 'dist').mkdir(exist_ok=True)
    (ROOT / 'dist' / 'scenes.html').write_text(out, encoding='utf-8')
    head_end = out.index('</style>') + len('</style>')
    full = ('<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            + out[:head_end] + '\n</head>\n<body>\n' + out[head_end:] + '\n</body>\n</html>\n')
    (ROOT / 'dist' / 'scenes_standalone.html').write_text(full, encoding='utf-8')
    print(f'dist/scenes.html {len(out.encode()) / 1e3:.0f} KB')


if __name__ == '__main__':
    main()
