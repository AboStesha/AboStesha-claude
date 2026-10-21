// Voxel models: characters, props, furniture and full scenes for the deck.
(function (g) {
  const { Model, shade } = g.Vox;
  const INK = '#15151c';

  const SKIN = ['#F1C7A1', '#D9A26E', '#B07A4F', '#7C4F31'];
  const HAIR = { black: '#1d1a1a', brown: '#5a3a22', blond: '#d6b26a', grey: '#a9a9b2', red: '#9c3b22' };

  // Human facing +y (front = screen lower-left). Footprint x 0..5, y -1..3, height ~20.
  function human(o = {}) {
    const m = new Model();
    const skin = o.skin || SKIN[0], hair = o.hair || HAIR.brown;
    const shirt = o.shirt || '#E8794A', pants = o.pants || '#2c3346', shoes = o.shoes || '#1c1c22';
    const sleeve = o.sleeve || shirt;
    // shoes + legs
    m.box(1, 0, 0, 2, 4, 1, shoes).box(3, 0, 0, 2, 4, 1, shade(shoes, 1.15));
    m.box(1, 0, 1, 2, 3, 5, pants).box(3, 0, 1, 2, 3, 5, shade(pants, 0.9));
    // torso
    m.box(0, 0, 6, 6, 3, 6, shirt);
    if (o.jacket) { m.box(0, 0, 6, 2, 3, 6, o.jacket).box(4, 0, 6, 2, 3, 6, o.jacket); }
    if (o.belt) m.box(0, 0, 6, 6, 3, 1, o.belt);
    // arms + hands
    const armUp = o.armsForward;
    m.box(-1, 0, 7, 1, 3, 5, sleeve).box(6, 0, 7, 1, 3, 5, sleeve);
    if (armUp) {
      m.box(-1, 3, 8, 1, 2, 1, sleeve).box(6, 3, 8, 1, 2, 1, sleeve);
      m.set(-1, 5, 8, skin).set(6, 5, 8, skin);
    } else {
      m.box(-1, 1, 6, 1, 2, 1, skin).box(6, 1, 6, 1, 2, 1, skin);
    }
    // neck + head
    m.box(2, 0, 12, 2, 2, 1, skin);
    m.box(0, -1, 13, 6, 5, 6, skin);
    // face
    const eye = o.eye || INK;
    m.set(1, 3, 15, eye).set(1, 3, 16, eye).set(4, 3, 15, eye).set(4, 3, 16, eye);
    if (o.smile) m.set(2, 3, 14, shade(skin, 0.7)).set(3, 3, 14, shade(skin, 0.7));
    if (o.glasses) for (let x = 0; x < 6; x++) m.set(x, 3, 16, x === 1 || x === 4 ? '#7fd8ff' : '#26262e');
    if (o.beard) { m.box(0, 3, 13, 6, 1, 1, hair).set(0, 3, 14, hair).set(5, 3, 14, hair); m.box(0, 2, 13, 6, 1, 2, hair); }
    // hair styles
    const hs = o.hairStyle || 'short';
    if (hs !== 'bald') {
      m.box(0, -1, 19, 6, 5, 1, hair);                 // top
      m.box(0, -1, 14, 6, 1, 5, hair);                 // back
      m.box(0, -1, 17, 1, 4, 2, hair).box(5, -1, 17, 1, 4, 2, hair); // sides
      m.box(0, 3, 18, 6, 1, 1, hair);                  // fringe
      if (hs === 'long') { m.box(0, -1, 10, 6, 1, 4, hair).box(-1, -1, 12, 1, 4, 7, hair).box(6, -1, 12, 1, 4, 7, hair); }
      if (hs === 'bun') { m.box(2, -2, 18, 2, 2, 3, hair); }
      if (hs === 'tall') { m.box(0, -1, 20, 6, 5, 1, hair).box(1, 0, 21, 4, 3, 1, hair); }
    }
    if (o.hat === 'beret') { m.box(-1, -1, 20, 7, 6, 1, o.hatColor || '#b3262d').set(2, 1, 21, o.hatColor || '#b3262d'); }
    if (o.hat === 'cap') { m.box(0, -1, 20, 6, 5, 1, o.hatColor || '#2f6df6').box(0, 4, 19, 6, 2, 1, shade(o.hatColor || '#2f6df6', 0.85)); }
    if (o.headphones) { const hc = o.headphones; m.box(-1, 0, 14, 1, 2, 3, hc).box(6, 0, 14, 1, 2, 3, hc).box(-1, 0, 17, 1, 1, 4, hc).box(6, 0, 17, 1, 1, 4, hc).box(-1, 0, 21, 8, 1, 1, hc); }
    if (o.headset) { m.box(6, 0, 15, 1, 2, 2, '#26262e').box(6, 2, 14, 1, 2, 1, '#26262e').set(6, 4, 14, '#ff5d5d', true); }
    if (o.prop) props[o.prop](m, o);
    return m;
  }

  const props = {
    tablet(m) { // held in front of the chest, screen facing viewer
      m.box(0, 4, 8, 6, 1, 5, '#1b1b24');
      m.box(1, 4, 9, 4, 1, 3, (x, y, z) => (z === 11 ? '#8ff3ff' : '#45d6ff'), true);
      m.set(-1, 4, 10, '#f1c7a1').set(6, 4, 10, '#f1c7a1');
    },
    camera(m) { // cinema camera on right shoulder
      m.box(5, -2, 12, 3, 5, 3, '#2b2b35');
      m.box(6, 3, 12, 1, 3, 2, '#121217').set(6, 6, 13, '#57e3ff', true).set(6, 6, 12, '#2a9fd0', true);
      m.box(5, -3, 15, 3, 2, 1, '#3b3b47');
      m.set(7, -2, 14, '#ff4d4d', true);
    },
    clapper(m) {
      m.box(-4, 2, 6, 4, 1, 3, '#202028');
      for (let x = -4; x < 0; x++) m.set(x, 2, 9, (x % 2 === 0) ? '#f4f1ea' : '#202028');
      m.box(-3, 3, 7, 2, 1, 1, '#f4f1ea');
    },
    clipboard(m) {
      m.box(7, 1, 6, 1, 3, 4, '#c79b62').box(7, 1, 7, 1, 3, 2, '#ffffff');
      m.box(7, 2, 10, 1, 1, 1, '#9aa0aa');
    },
    script(m) { // stack of pages in hand
      m.box(6, 2, 5, 2, 3, 3, '#f4f1ea').box(6, 2, 8, 2, 3, 1, '#e8794a');
    },
    megaphone(m) {
      m.box(6, 3, 9, 1, 1, 1, '#d8d8de').box(6, 4, 8, 1, 1, 3, '#e64545').box(5, 5, 8, 3, 1, 3, '#e64545').set(6, 5, 9, '#2a0f0f');
    },
    swatch(m) { // art director colour board
      m.box(6, 1, 6, 1, 4, 5, '#efe6d6');
      const cols = ['#e8794a', '#45d6ff', '#ffd166', '#7bd88f', '#c084fc', '#ff5d8f'];
      let i = 0; for (let z = 7; z < 11; z += 2) for (let y = 1; y < 5; y += 2) m.set(7, y, z, cols[i++ % cols.length]);
    },
    phone(m) {
      m.box(6, 4, 9, 1, 1, 3, '#1b1b24').set(6, 5, 10, '#45d6ff', true).set(6, 5, 11, '#45d6ff', true);
    },
    reel(m) {
      m.box(-3, 1, 7, 1, 4, 4, '#3a3a46').set(-3, 2, 8, '#15151c').set(-3, 3, 9, '#15151c');
    },
  };

  // ---------- furniture ----------
  function desk(w = 14, d = 7, h = 7, top = '#8a5a3c', leg = '#2c2c36') {
    const m = new Model();
    m.box(0, 0, h - 1, w, d, 1, top);
    for (const [x, y] of [[0, 0], [w - 1, 0], [0, d - 1], [w - 1, d - 1]]) m.box(x, y, 0, 1, 1, h - 1, leg);
    return m;
  }
  function monitor(w = 7, h = 5, screen = '#45d6ff', frame = '#1b1b24') {
    const m = new Model();
    m.box(Math.floor(w / 2) - 1, 1, 0, 2, 2, 1, frame).box(Math.floor(w / 2), 1, 1, 1, 1, 2, frame);
    m.box(0, 1, 3, w, 1, h, frame);
    m.box(1, 2, 4, w - 2, 0, h - 2, '#000');
    for (let x = 1; x < w - 1; x++) for (let z = 4; z < 3 + h - 1; z++) m.set(x, 1, z, screen, true);
    return m;
  }
  function plant(h = 9) {
    const m = new Model();
    m.box(0, 0, 0, 4, 4, 3, '#c9774a').box(0, 0, 3, 4, 4, 1, '#3b2a20');
    const g1 = '#3fae63', g2 = '#2f8a4d', g3 = '#56c97a';
    m.box(1, 1, 4, 2, 2, h - 4, g2);
    m.box(-1, 0, 7, 3, 3, 2, g1).box(2, 2, 9, 3, 3, 2, g3).box(0, 1, h - 1, 4, 3, 2, g1).box(1, -1, 10, 2, 2, 2, g3);
    return m;
  }
  function chair(color = '#2f6df6') {
    const m = new Model();
    m.box(1, 1, 0, 1, 1, 4, '#333').box(0, 0, 4, 5, 5, 1, color).box(0, -1, 5, 5, 1, 5, color);
    return m;
  }
  function directorChair() {
    const m = new Model();
    const wood = '#b07a4f', canvas = '#141418';
    m.box(0, 0, 0, 1, 1, 6, wood).box(5, 0, 0, 1, 1, 6, wood).box(0, 4, 0, 1, 1, 6, wood).box(5, 4, 0, 1, 1, 6, wood);
    m.box(0, 0, 5, 6, 5, 1, canvas).box(0, 0, 6, 6, 1, 5, canvas).box(0, 0, 11, 6, 1, 1, wood);
    m.box(0, 1, 7, 1, 4, 1, wood).box(5, 1, 7, 1, 4, 1, wood);
    return m;
  }
  function lightStand(col = '#ffd166') {
    const m = new Model();
    m.box(0, 0, 0, 3, 3, 1, '#2a2a33').box(1, 1, 1, 1, 1, 18, '#3a3a46');
    m.box(-1, 0, 19, 5, 3, 4, '#2a2a33');
    m.box(0, 3, 20, 3, 1, 2, col, true);
    return m;
  }
  function tripodCam() {
    const m = new Model();
    const k = '#2a2a33';
    m.box(0, 0, 0, 1, 1, 2, k).box(6, 0, 0, 1, 1, 2, k).box(3, 6, 0, 1, 1, 2, k);
    m.box(1, 1, 2, 1, 1, 3, k).box(5, 1, 2, 1, 1, 3, k).box(3, 5, 2, 1, 1, 3, k);
    m.box(2, 2, 5, 3, 3, 7, '#3a3a46');
    m.box(1, 1, 12, 5, 6, 4, '#1f1f27').box(2, 7, 13, 3, 3, 2, '#121217');
    m.set(3, 10, 14, '#57e3ff', true).set(3, 10, 13, '#2a9fd0', true);
    m.box(2, 0, 16, 3, 2, 1, '#3b3b47').set(5, 2, 15, '#ff4d4d', true);
    return m;
  }
  function crane() {
    const m = new Model();
    const k = '#2a2a33', y = '#ffd166';
    m.box(0, 0, 0, 6, 6, 2, k).box(2, 2, 2, 2, 2, 14, '#3a3a46');
    for (let i = 0; i < 18; i++) m.set(3 + i, 3, 16 + Math.floor(i / 3), y);
    for (let i = 0; i < 6; i++) m.set(2 - i, 3, 16 - Math.floor(i / 3), y);
    m.box(-5, 2, 12, 3, 3, 3, '#4a4a58');
    m.box(19, 1, 18, 4, 5, 3, '#1f1f27').box(20, 6, 18, 2, 2, 2, '#121217').set(20, 8, 19, '#57e3ff', true);
    return m;
  }
  function drone() {
    const m = new Model();
    const k = '#2b2b35';
    m.box(2, 2, 1, 4, 4, 2, k).box(3, 3, 0, 2, 2, 1, '#121217').set(3, 5, 0, '#57e3ff', true);
    for (const [x, y] of [[0, 0], [6, 0], [0, 6], [6, 6]]) { m.box(x, y, 2, 2, 2, 1, k); m.box(x - 1, y, 3, 4, 2, 0, k); m.box(x - 1, y + 0, 3, 4, 1, 1, '#9aa0aa'); }
    m.set(1, 1, 2, k).set(6, 1, 2, k).set(1, 6, 2, k).set(6, 6, 2, k);
    return m;
  }
  function screenWall(w, h, art) { // emissive cinema screen in a frame, plane x 0..w, y 0
    const m = new Model();
    m.box(-1, 0, -1, w + 2, 1, h + 2, '#101016');
    for (let x = 0; x < w; x++) for (let z = 0; z < h; z++) m.set(x, 0, z, art ? art(x, z) : '#45d6ff', true);
    return m;
  }
  function cinemaSeat(c = '#b3262d') {
    const m = new Model();
    m.box(0, 0, 0, 5, 5, 3, shade(c, 0.7)).box(0, 0, 3, 5, 5, 1, c).box(0, -1, 3, 5, 1, 6, c);
    m.box(-1, 0, 3, 1, 5, 2, '#2a2a33').box(5, 0, 3, 1, 5, 2, '#2a2a33');
    return m;
  }

  // sky/sunset gradient for screens
  function filmArt(w, h) {
    return (x, z) => {
      const t = z / h;
      const sky = g.Vox.mix('#ff9a5a', '#4b2a7a', t);
      const sunX = w * 0.62, sunZ = h * 0.42;
      const d = Math.hypot(x - sunX, (z - sunZ) * 1.3);
      if (d < h * 0.16) return '#ffe2a3';
      const hill = h * (0.22 + 0.10 * Math.sin(x / w * 7.0) + 0.06 * Math.sin(x / w * 17 + 1));
      if (z < hill) return g.Vox.mix('#1b1430', '#2d1d46', z / hill);
      return sky;
    };
  }

  // ---------- scenes ----------
  function floor(m, w, d, a = '#23232e', b = '#1d1d27') {
    m.box(0, 0, -1, w, d, 1, (x, y) => ((x + y) % 2 ? a : b));
  }

  function officeScene() {
    const m = new Model();
    const W = 44, D = 34, H = 26;
    floor(m, W, D, '#2a2533', '#241f2d');
    // walls
    m.box(0, 0, 0, 1, D, H, (x, y, z) => (z === 0 ? '#1a1620' : '#3a3346'));
    m.box(0, 0, 0, W, 1, H, (x, y, z) => (z === 0 ? '#1a1620' : '#453d54'));
    // big wall screen on back-right wall (y=0 plane)
    const art = filmArt(26, 14);
    for (let x = 9; x < 35; x++) for (let z = 7; z < 21; z++) m.set(x, 0, z, art(x - 9, z - 7), true);
    m.box(8, 0, 6, 28, 1, 1, '#121218').box(8, 0, 21, 28, 1, 1, '#121218').box(8, 0, 6, 1, 1, 16, '#121218').box(35, 0, 6, 1, 1, 16, '#121218');
    // posters on left wall (x=0 plane)
    const posters = [['#e8794a', '#ffd166'], ['#45d6ff', '#c084fc'], ['#7bd88f', '#ff5d8f']];
    posters.forEach((p, i) => {
      const y0 = 5 + i * 9;
      for (let y = y0; y < y0 + 6; y++) for (let z = 9; z < 18; z++) m.set(0, y, z, z > 14 ? p[1] : p[0]);
      for (let y = y0; y < y0 + 6; y++) m.set(0, y, 17, '#f4f1ea');
    });
    // rug
    m.box(12, 17, -1, 24, 14, 1, (x, y) => ((x === 12 || x === 35 || y === 17 || y === 30) ? '#7a3a1f' : ((x + y) % 4 < 2 ? '#3b2230' : '#35202c')));
    // desk (left-back) with monitor, script, clapper
    m.add(desk(15, 7, 7, '#7a4b33'), 3, 5, 0);
    m.add(monitor(8, 6, '#45d6ff'), 6, 5, 7);
    m.box(4, 9, 7, 3, 3, 1, '#f4f1ea').box(4, 9, 8, 3, 3, 1, '#e9e2d4');
    m.box(14, 10, 7, 3, 1, 2, '#202028');
    for (let x = 14; x < 17; x++) m.set(x, 10, 9, x % 2 ? '#f4f1ea' : '#202028');
    // plants & director chair & light
    m.add(plant(10), 38, 3, 0);
    m.add(plant(8), 2, 28, 0);
    m.add(directorChair(), 36, 12, 0);
    m.add(lightStand('#ffd166'), 3, 18, 0);
    // producer (player) with tablet facing the assistant
    m.add(human({ shirt: '#E8794A', jacket: '#3a2d26', pants: '#232838', hair: HAIR.black, prop: 'tablet', armsForward: true, smile: true }).rot(3), 16, 21, 0);
    m.add(human({ shirt: '#45d6ff', pants: '#2c3346', hair: HAIR.blond, hairStyle: 'bun', skin: SKIN[1], headset: true, prop: 'clipboard', smile: true }), 28, 22, 0);
    return m;
  }

  function crew() {
    return {
      writer: human({ shirt: '#f4f1ea', jacket: '#6b4f3a', hair: HAIR.grey, glasses: true, prop: 'script', beard: true }),
      director: human({ shirt: '#1d1d24', pants: '#1d1d24', hair: HAIR.black, hat: 'beret', prop: 'megaphone', beard: true, smile: false }),
      casting: human({ shirt: '#c084fc', hair: HAIR.red, hairStyle: 'long', skin: SKIN[0], prop: 'clipboard', smile: true }),
      art: human({ shirt: '#ffd166', pants: '#3a3346', hair: HAIR.brown, skin: SKIN[2], hat: 'cap', hatColor: '#e8794a', prop: 'swatch', smile: true }),
      dop: human({ shirt: '#2f3a52', pants: '#1d1d24', hair: HAIR.black, skin: SKIN[1], hat: 'cap', hatColor: '#1d1d24', prop: 'camera' }),
      editor: human({ shirt: '#45d6ff', pants: '#2c3346', hair: HAIR.blond, glasses: true, skin: SKIN[0], prop: 'reel', smile: true }),
      composer: human({ shirt: '#7bd88f', pants: '#2c3346', hair: HAIR.black, hairStyle: 'tall', skin: SKIN[3], headphones: '#e8794a', smile: true }),
      assistant: human({ shirt: '#45d6ff', pants: '#2c3346', hair: HAIR.blond, hairStyle: 'bun', skin: SKIN[1], headset: true, prop: 'clipboard', smile: true }),
      producer: human({ shirt: '#E8794A', jacket: '#3a2d26', pants: '#232838', hair: HAIR.black, prop: 'tablet', armsForward: true, smile: true }),
    };
  }

  // Virtual studio: grey-box street set with actors, crane & producer filming with tablet
  function studioScene() {
    const m = new Model();
    const W = 56, D = 40;
    m.box(0, 0, -1, W, D, 1, (x, y) => (x % 4 === 0 || y % 4 === 0 ? '#2b5d78' : '#1a2230'));
    const block = (x, y, w, d, h, c) => {
      m.box(x, y, 0, w, d, h, (i, j, k) => {
        const edge = (i === x || i === x + w - 1) + (j === y || j === y + d - 1) + (k === h - 1);
        if (edge >= 2) return '#57e3ff';
        const win = (k % 4 === 2 || k % 4 === 3) && ((i - x) % 3 === 1 || (j - y) % 3 === 1);
        return win ? '#9fb1c9' : c;
      });
    };
    block(0, 0, 10, 12, 30, '#8892a6');
    block(0, 14, 9, 10, 22, '#7c869a');
    block(12, 0, 12, 9, 36, '#929cb0');
    block(26, 0, 10, 8, 24, '#8892a6');
    block(38, 0, 9, 10, 32, '#7c869a');
    // street lamp
    m.box(30, 14, 0, 1, 1, 16, '#3a3a46').box(28, 14, 16, 4, 1, 1, '#3a3a46').set(28, 14, 15, '#ffd166', true);
    // car
    m.box(12, 14, 0, 12, 6, 3, '#c0392b').box(15, 14, 3, 6, 6, 3, '#c0392b').box(16, 19, 3, 4, 1, 2, '#9fd9ff', true);
    m.box(13, 19, 0, 2, 1, 2, '#15151c').box(21, 19, 0, 2, 1, 2, '#15151c');
    // actors (mannequin style but coloured)
    m.add(human({ shirt: '#e8794a', jacket: '#2f2f3a', hair: HAIR.black, smile: false }), 33, 24, 0);
    m.add(human({ shirt: '#c084fc', hair: HAIR.red, hairStyle: 'long', skin: SKIN[2], smile: true }), 41, 25, 0);
    // crane + producer with tablet-camera
    m.add(crane().rot(1), 4, 26, 0);
    m.add(human({ shirt: '#E8794A', jacket: '#3a2d26', pants: '#232838', hair: HAIR.black, prop: 'tablet', armsForward: true }).rot(3), 17, 31, 0);
    m.add(lightStand('#ffd166').rot(2), 50, 12, 0);
    return m;
  }

  function postScene() {
    const m = new Model();
    const W = 40, D = 26, H = 22;
    floor(m, W, D, '#1d2230', '#191d29');
    m.box(0, 0, 0, W, 1, H, '#2a3142');
    m.box(0, 0, 0, 1, D, H, '#232a3a');
    // timeline wall display
    const tl = (x, z) => {
      const row = Math.floor(z / 2);
      const cols = ['#45d6ff', '#e8794a', '#7bd88f', '#c084fc', '#ffd166'];
      if (z % 2 === 1) return '#0d1018';
      const seg = Math.floor((x + row * 3) / 5);
      return ((x + row) % 5 === 0) ? '#0d1018' : cols[(seg + row) % cols.length];
    };
    for (let x = 5; x < 35; x++) for (let z = 8; z < 18; z++) m.set(x, 0, z, tl(x - 5, z - 8), true);
    for (let z = 8; z < 18; z++) m.set(16, 0, z, '#ff4d4d', true);
    m.add(desk(22, 7, 7, '#2b2b35'), 6, 9, 0);
    m.add(monitor(7, 5, '#7bd88f'), 7, 9, 7);
    m.add(monitor(7, 5, '#e8794a'), 15, 9, 7);
    m.add(monitor(7, 5, '#45d6ff'), 22, 9, 7);
    m.box(10, 13, 7, 6, 3, 1, '#3a3a46'); // keyboard
    const c = crew();
    m.add(c.editor.rot(3), 6, 18, 0);
    m.add(c.composer, 30, 12, 0);
    m.add(c.producer, 22, 18, 0);
    // speakers
    m.box(2, 4, 0, 3, 3, 10, '#15151c').set(3, 7, 7, '#3a3a46').set(3, 7, 4, '#3a3a46');
    return m;
  }

  function cinemaScene() {
    const m = new Model();
    const W = 46, D = 34, H = 26;
    floor(m, W, D, '#2a1c22', '#24171d');
    m.box(0, 0, 0, W, 1, H, '#1b1218');
    m.box(0, 0, 0, 1, D, H, '#2b1820');
    const art = filmArt(36, 17);
    for (let x = 5; x < 41; x++) for (let z = 5; z < 22; z++) m.set(x, 0, z, art(x - 5, z - 5), true);
    m.box(4, 0, 4, 38, 1, 1, '#0f0b0e').box(4, 0, 22, 38, 1, 1, '#0f0b0e');
    // curtains
    m.box(1, 1, 0, 3, 2, 24, '#8d1f2a').box(42, 1, 0, 3, 2, 24, '#8d1f2a');
    for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) {
      const s = cinemaSeat('#b3262d');
      m.add(s, 8 + i * 6, 15 + r * 9, r * 2);
      if (r) m.box(6, 15 + r * 9 - 1, 0, 38, 8, 2, '#1f1419');
    }
    // producer sitting (simplified: head & shoulders above a seat)
    const p = new Model();
    p.box(0, 0, 0, 6, 3, 5, '#E8794A').box(-1, 0, 1, 1, 3, 4, '#E8794A').box(6, 0, 1, 1, 3, 4, '#E8794A').box(0, -1, 6, 6, 5, 6, '#F1C7A1').box(0, -1, 12, 6, 5, 1, HAIR.black).box(0, 3, 7, 6, 1, 5, HAIR.black).box(0, -1, 10, 1, 4, 2, HAIR.black).box(5, -1, 10, 1, 4, 2, HAIR.black);
    m.add(p, 20, 16, 4);
    // popcorn
    m.box(27, 17, 4, 2, 2, 3, '#e64545').box(27, 17, 7, 2, 2, 1, '#fff3c4');
    return m;
  }

  function agencyScene() {
    const m = new Model();
    const W = 62, D = 50, H = 24;
    floor(m, W, D, '#1f2a2a', '#1a2424');
    m.box(0, 0, 0, W, 1, H, '#2b3a3a');
    m.box(0, 0, 0, 1, D, H, '#243232');
    // KPI wall: rising bars + logo panel
    const bars = [4, 6, 5, 8, 9, 11, 13];
    bars.forEach((b, i) => { for (let z = 6; z < 6 + b; z++) m.set(8 + i * 3, 0, z, '#7bd88f', true).set(9 + i * 3, 0, z, '#7bd88f', true); });
    for (let x = 6; x < 30; x++) m.set(x, 0, 5, '#45d6ff', true);
    for (let x = 36; x < 56; x++) for (let z = 8; z < 18; z++) m.set(x, 0, z, ((x + z) % 7 === 0) ? '#ffd166' : '#e8794a', true);
    // left wall: client logos
    ['#45d6ff', '#e8794a', '#c084fc', '#7bd88f'].forEach((c, i) => { for (let y = 6 + i * 10; y < 12 + i * 10; y++) for (let z = 10; z < 16; z++) m.set(0, y, z, c, true); });
    // 4 client team pods
    const pods = [['#45d6ff', 4, 5], ['#e8794a', 33, 5], ['#c084fc', 4, 28], ['#7bd88f', 33, 28]];
    pods.forEach(([col, x, y], i) => {
      m.box(x, y, -1, 26, 19, 1, (a, b) => ((a + b) % 2 ? shade(col, 0.30) : shade(col, 0.25)));
      m.add(desk(12, 5, 7, '#2b2b35'), x + 2, y + 2, 0);
      m.add(monitor(6, 6, col), x + 2, y + 2, 7);
      m.add(monitor(6, 6, shade(col, 0.8)), x + 8, y + 2, 7);
      m.add(human({ shirt: col, hair: [HAIR.black, HAIR.blond, HAIR.brown, HAIR.red][i], skin: SKIN[i], smile: true, hairStyle: i % 2 ? 'long' : 'short', headset: i % 2 === 0 }), x + 16, y + 3, 0);
      m.box(x + 21, y + 12, 0, 3, 3, 4, shade(col, 0.6)).box(x + 21, y + 12, 4, 3, 3, 1, col, true);
    });
    return m;
  }

  function cinemaIcon() { // director chair + clapper + film camera on tripod
    const m = new Model();
    m.add(directorChair(), 0, 6, 0);
    m.box(1, 6, 12, 4, 1, 3, '#202028');
    for (let x = 1; x < 5; x++) m.set(x, 6, 15, x % 2 ? '#f4f1ea' : '#202028');
    m.add(tripodCam(), 10, 0, 0);
    return m;
  }

  function adProduct() { // soda can on a podium under a spotlight
    const m = new Model();
    m.box(0, 0, 0, 12, 12, 3, '#2b2b35').box(1, 1, 3, 10, 10, 1, '#3a3a46');
    m.box(4, 4, 4, 4, 4, 10, (x, y, z) => (z === 13 ? '#c9ccd6' : (z > 6 && z < 11 ? '#ffd166' : '#e64545')));
    m.box(5, 5, 14, 2, 2, 1, '#9aa0aa');
    for (const [x, y] of [[1, 9], [9, 1]]) m.box(x, y, 4, 1, 1, 1, '#7bd88f', true);
    m.box(-4, 9, 0, 2, 2, 1, '#2a2a33').box(-3, 10, 1, 1, 1, 14, '#3a3a46').box(-4, 9, 15, 3, 3, 3, '#2a2a33').set(-2, 11, 16, '#ffd166', true);
    return m;
  }

  function phoneRig() { // a real phone used as a virtual camera
    const m = new Model();
    m.box(0, 0, 0, 1, 10, 18, '#1b1b24');
    for (let y = 1; y < 9; y++) for (let z = 2; z < 16; z++) m.set(1, y, z, z > 9 ? '#4b2a7a' : (z > 6 ? '#ff9a5a' : '#1b1430'), true);
    for (let y = 2; y < 8; y++) m.set(1, y, 8, '#ffe2a3', true);
    return m;
  }

  function remixScene() { // selfie + template -> remix
    const m = new Model();
    const p = human({ shirt: '#ff5d8f', hair: HAIR.black, hairStyle: 'long', skin: SKIN[1], smile: true, prop: 'phone', armsForward: true });
    m.add(p, 0, 0, 0);
    return m;
  }

  g.Models = { cinemaIcon, adProduct, human, crew, officeScene, studioScene, postScene, cinemaScene, agencyScene, phoneRig, remixScene, drone, crane, tripodCam, desk, monitor, plant, SKIN, HAIR, filmArt };
})(window);
