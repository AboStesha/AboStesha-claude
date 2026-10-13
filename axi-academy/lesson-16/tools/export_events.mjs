// Load the timeline in Node and export SFX events + music sections for the audio build.
import fs from 'fs'; import path from 'path'; import vm from 'vm';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ctx = { console }; ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
for (const f of ['assets/brand_paths.js', 'src/engine.js', 'src/words.js', 'src/film.js', 'src/scenes1.js', 'src/scenes2.js', 'src/scenes3.js'])
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
const F = ctx.FILM;
const sfx = F.SFX.slice().sort((a, b) => a.t - b.t);
fs.writeFileSync(path.join(root, 'audio/sfx.json'), JSON.stringify(sfx, null, 0));
const ph = (p) => ctx.PHRASES[p].a + F.OFF;
const music = [
  { t: 0, lvl: 1 }, { t: F.OFF, lvl: 2 }, { t: ph(4), lvl: 3 }, { t: ph(27) - 1.4, lvl: 1 }, { t: ph(28), lvl: 4 },
  { t: ph(47) - 1.3, lvl: 1 }, { t: ph(48), lvl: 3 }, { t: ph(67), lvl: 4 }, { t: ph(69), lvl: 2 }, { t: F.CLOSE, lvl: 1 },
];
fs.writeFileSync(path.join(root, 'audio/sections.json'), JSON.stringify({ offset: F.OFF, total: +F.TOTAL.toFixed(3), music }, null, 1));
console.log('sfx events', sfx.length, 'total', F.TOTAL.toFixed(2), 'scenes', F.SCENES.length);
