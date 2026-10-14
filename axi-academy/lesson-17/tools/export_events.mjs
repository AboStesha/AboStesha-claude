// Load the timeline in Node and export SFX events + music sections for the audio build.
import fs from 'fs'; import path from 'path'; import vm from 'vm';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ctx = { console }; ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
for (const f of ['assets/brand_paths.js', 'src/engine.js', 'src/fx.js', 'src/words.js', 'src/film.js', 'src/kit.js', 'src/scenes1.js', 'src/scenes2.js', 'src/scenes3.js'])
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
const F = ctx.FILM;
const sfx = F.SFX.slice().sort((a, b) => a.t - b.t);
fs.writeFileSync(path.join(root, 'audio/sfx.json'), JSON.stringify(sfx, null, 0));
const ph = (p) => ctx.PHRASES[p].a + F.OFF;
const music = [
  { t: 0, lvl: 1 }, { t: F.OFF, lvl: 2 }, { t: ph(4) - 0.3, lvl: 3 }, { t: ph(11) - 0.2, lvl: 2 }, { t: ph(18) - 0.2, lvl: 3 },
  { t: ph(24) - 0.3, lvl: 4 }, { t: ph(30) - 0.2, lvl: 3 }, { t: ph(33) - 0.3, lvl: 2 }, { t: ph(35) - 0.3, lvl: 3 },
  { t: ph(38) - 0.3, lvl: 2 }, { t: ph(43) - 0.3, lvl: 3 }, { t: ph(47) - 0.3, lvl: 2 }, { t: ph(55) - 0.3, lvl: 3 },
  { t: ph(61) - 0.3, lvl: 4 }, { t: ph(65) - 0.3, lvl: 3 }, { t: ph(71) - 0.3, lvl: 2 }, { t: ph(74) - 0.3, lvl: 3 },
  { t: ph(76) - 0.3, lvl: 4 }, { t: ph(78) - 0.3, lvl: 2 }, { t: ph(81) - 0.3, lvl: 3 }, { t: ph(87) - 0.3, lvl: 2 },
  { t: ph(94) - 0.3, lvl: 1 }, { t: ph(97) - 0.3, lvl: 3 }, { t: ph(106) - 0.3, lvl: 4 }, { t: ph(110) - 0.3, lvl: 3 },
  { t: ph(115) - 0.3, lvl: 4 }, { t: ph(116) - 0.3, lvl: 2 }, { t: ph(121) - 0.5, lvl: 3 }, { t: F.CLOSE, lvl: 1 },
];
fs.writeFileSync(path.join(root, 'audio/sections.json'), JSON.stringify({ offset: F.OFF, total: +F.TOTAL.toFixed(3), music }, null, 1));
console.log('sfx events', sfx.length, 'total', F.TOTAL.toFixed(2), 'scenes', F.SCENES.length);
