// Load the timeline in Node and export SFX events + music sections for the audio build.
import fs from 'fs'; import path from 'path'; import vm from 'vm';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ctx = { console }; ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
for (const f of ['assets/brand_paths.js', 'src/engine.js', 'src/fx.js', 'src/words.js', 'src/film.js', 'src/kit.js', 'src/brand.js', 'src/reel.js', 'src/r1.js', 'src/r2.js', 'src/r3.js'])
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
const F = ctx.FILM;
const sfx = F.SFX.slice().sort((a, b) => a.t - b.t);
fs.writeFileSync(path.join(root, 'audio/sfx.json'), JSON.stringify(sfx, null, 0));
const ph = (p) => ctx.PHRASES[p].a + F.OFF;
const music = F.MUSIC;
fs.writeFileSync(path.join(root, 'audio/sections.json'), JSON.stringify({ offset: F.OFF, total: +F.TOTAL.toFixed(3), style: F.STYLE, music }, null, 1));
console.log('sfx events', sfx.length, 'total', F.TOTAL.toFixed(2), 'scenes', F.SCENES.length);
