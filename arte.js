// Arte do Foguetinho: tudo desenhado em código (SVG), original.
// Boneco: coordenadas 0..200 x 0..400. Carro: 0..700 x 0..400. Cidade: 0..3200 x 0..700.
(function () {
  let uidN = 0;
  const uid = p => p + (++uidN);

  function shade(hex, amt) { // amt -1..1 (negativo escurece)
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, a = Math.abs(amt);
    r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  const CORES = {
    pele: ['#f8d9c4', '#eebd9a', '#d39a70', '#a86e48', '#7a4b31', '#553222'],
    cabelo: ['#2b1a12', '#5a3420', '#9a5a2a', '#e2b45c', '#f0e2c0', '#d9547f', '#7a4bd1'],
    olhos: ['#5b3a1e', '#2f7fb5', '#3c8a4e', '#7a5a8f'],
    roupa: ['#ff4f9a', '#a35cf0', '#3fa7e0', '#ffc83d', '#34c38f', '#ffffff', '#e5484d', '#1f2a44', '#ffb48a'],
    carro: ['#ff4f9a', '#a35cf0', '#3fa7e0', '#ffc83d', '#34c38f', '#ffffff', '#e5484d', '#1f2a44']
  };

  // ---------- BONECO (estilo fofinho: cabeça grande, olhos enormes, contorno) ----------
  CORES.cabelo = ['#2b1a12', '#6b3a1f', '#b8742f', '#f2cf7a', '#f6a6c1', '#9fd8f5', '#9ce8d4', '#c9a6f2', '#e5484d'];
  CORES.olhos = ['#6b3a1f', '#3f9de0', '#3c9a5a', '#e0559a', '#8a8f9c', '#8a5bd6'];
  const CABELOS = ['Longo com franja', 'Maria-chiquinha', 'Rabo alto', 'Coque', 'Cacheado', 'Chanel', 'Tranças', 'Dois coques'];
  const CIMA = ['Camiseta', 'Cropped', 'Moletom corações', 'Blusa de laço', 'Vestido xadrez', 'Jardineira', 'Top coração'];
  const BAIXO = ['Saia xadrez', 'Calça jeans', 'Shorts', 'Saia rodada', 'Calça colorida'];
  const SAPATOS = ['Tênis', 'Tênis colorido', 'Sapatilha', 'Bota'];
  const ACESS = ['Nada', 'Fone', 'Óculos', 'Laço', 'Corações', 'Presilha', 'Bolsinha', 'Colar de pérolas', 'Sardinhas', 'Brincos', 'Flores', 'Chiclete', 'Tiara'];

  const OL = '#3b2733';
  const L = (w = 3) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  let G = '';
  const coracaoP = (x, y, s, cor, extra = '') => `<path d="M${x} ${y + 8 * s} C${x - 14 * s} ${y - 2 * s} ${x - 8 * s} ${y - 12 * s} ${x} ${y - 5 * s} C${x + 8 * s} ${y - 12 * s} ${x + 14 * s} ${y - 2 * s} ${x} ${y + 8 * s} Z" fill="${cor}" ${extra}/>`;

  function corpo(d) {
    const s = CORES.pele[d.pele], sd = shade(s, -0.16);
    return {
      pernas: `<path d="M74 272 L98 272 L97 354 L76 354 Z" fill="${s}" ${L()}/><path d="M102 272 L126 272 L124 354 L103 354 Z" fill="${s}" ${L()}/>`,
      bracos: `<path d="M68 204 Q54 236 50 270 L64 274 Q68 244 78 214 Z" fill="${s}" ${L()}/>
        <path d="M132 204 Q146 236 150 270 L136 274 Q132 244 122 214 Z" fill="${s}" ${L()}/>`,
      maos: `<circle cx="56" cy="276" r="10" fill="${s}" ${L()}/><circle cx="144" cy="276" r="10" fill="${s}" ${L()}/>`,
      tronco: `<path d="M66 202 Q100 192 134 202 L132 248 Q130 266 132 280 L68 280 Q70 266 68 248 Z" fill="${s}" ${L()}/>
        <rect x="89" y="176" width="22" height="30" rx="6" fill="${s}" ${L()}/><path d="M90 186 Q100 194 110 186" stroke="${sd}" stroke-width="5" fill="none" opacity=".6"/>`
    };
  }

  function rosto(d) {
    const s = CORES.pele[d.pele], sd = shade(s, -0.18), hc = shade(CORES.cabelo[d.corCabelo], -0.25);
    const olho = (cx, esq) => `
      <ellipse cx="${cx}" cy="130" rx="17" ry="19" fill="#fff" ${L(2.4)}/>
      <circle cx="${cx}" cy="133" r="14" fill="url(#${G}iris)"/>
      <circle cx="${cx}" cy="134" r="6.5" fill="#1d1218"/>
      <circle cx="${cx + 5}" cy="126" r="5.2" fill="#fff"/><circle cx="${cx - 5.5}" cy="140" r="2.6" fill="#fff" opacity=".9"/>
      <path d="M${cx - 18} 127 Q${cx} 106 ${cx + 18} 125" stroke="${OL}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M${esq ? cx - 17 : cx + 17} ${esq ? 126 : 124} l${esq ? -7 : 7} -5" stroke="${OL}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M${cx - 10} ${102} Q${cx} 96 ${cx + 10} ${101}" stroke="${hc}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    return `<circle cx="30" cy="132" r="12" fill="${s}" ${L()}/><circle cx="170" cy="132" r="12" fill="${s}" ${L()}/>
      <path d="M26 132 q5 -5 8 2 M174 132 q-5 -5 -8 2" stroke="${sd}" stroke-width="2.5" fill="none"/>
      <ellipse cx="100" cy="120" rx="72" ry="66" fill="url(#${G}pele)" ${L()}/>
      ${olho(70, true)}${olho(130, false)}
      <ellipse cx="50" cy="154" rx="13" ry="8" fill="#ff7a9a" opacity=".45"/><ellipse cx="150" cy="154" rx="13" ry="8" fill="#ff7a9a" opacity=".45"/>
      <path d="M97 149 Q100 152 103 149" stroke="${sd}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M92 161 Q100 168 108 161 Q100 164 92 161 Z" fill="#d9577a" stroke="#b03e5e" stroke-width="2" stroke-linejoin="round"/>`;
  }

  function cabelo(d) {
    const c = CORES.cabelo[d.corCabelo], cf = `url(#${G}cab)`, cl = shade(c, 0.45), cd = shade(c, -0.15);
    const brilho = `<path d="M52 72 Q76 52 104 50" stroke="${cl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`;
    const capa = 'M26 128 Q22 44 100 40 Q178 44 174 128';
    const franja = `<path d="${capa} L164 110 Q154 98 140 102 L130 94 L118 104 L106 94 L94 104 L82 94 L70 104 L60 98 Q46 100 36 112 Z" fill="${cf}" ${L()}/>`;
    const meio = `<path d="${capa} Q170 84 130 76 Q110 72 100 88 Q90 72 70 76 Q30 84 26 128 Z" fill="${cf}" ${L()}/><path d="M100 88 L100 46" stroke="${cd}" stroke-width="2.5"/>`;
    const lado = `<path d="${capa} Q168 82 124 72 Q72 68 40 110 Q34 120 26 128 Z" fill="${cf}" ${L()}/>`;
    const mechas = (y2) => `<path d="M28 116 Q20 ${y2 * 0.6 + 50} 30 ${y2} L50 ${y2 - 4} Q42 ${y2 * 0.6 + 50} 48 120 Z" fill="${cf}" ${L()}/>
      <path d="M172 116 Q180 ${y2 * 0.6 + 50} 170 ${y2} L150 ${y2 - 4} Q158 ${y2 * 0.6 + 50} 152 120 Z" fill="${cf}" ${L()}/>`;
    const elastico = (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="#ff4f9a" ${L(2.5)}/>`;
    switch (d.cabelo) {
      case 0: return { tras: `<path d="M30 110 Q24 220 36 304 Q100 316 164 304 Q176 220 170 110 Z" fill="${cf}" ${L()}/>`, frente: franja + mechas(236) + brilho };
      case 1: return {
        tras: `<path d="M44 86 Q-4 150 12 304 Q32 312 48 296 Q30 186 62 98 Z" fill="${cf}" ${L()}/><path d="M156 86 Q204 150 188 304 Q168 312 152 296 Q170 186 138 98 Z" fill="${cf}" ${L()}/>`,
        frente: meio + elastico(44, 92) + elastico(156, 92) + brilho
      };
      case 2: return {
        tras: `<path d="M118 50 Q150 0 182 34 Q204 130 178 300 Q160 310 152 292 Q176 160 148 72 Z" fill="${cf}" ${L()}/>`,
        frente: lado + `<path d="M150 90 Q160 140 152 190" stroke="${OL}" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M150 90 Q160 140 152 190" stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none"/>` + elastico(134, 48) + brilho
      };
      case 3: return { tras: `<circle cx="100" cy="34" r="28" fill="${cf}" ${L()}/><path d="M84 30 Q100 18 116 30" stroke="${cl}" stroke-width="4" fill="none" opacity=".7"/>`, frente: franja + `<rect x="80" y="54" width="40" height="9" rx="4" fill="#ff4f9a" ${L(2.5)}/>` + brilho };
      case 4: {
        let t = '', f = '';
        [[30, 100], [24, 140], [28, 180], [40, 214], [170, 100], [176, 140], [172, 180], [160, 214], [46, 62], [80, 40], [120, 40], [154, 62]].forEach(([x, y]) => { t += `<circle cx="${x}" cy="${y}" r="28" fill="${cf}" ${L()}/>`; });
        [[46, 100], [70, 82], [100, 76], [130, 82], [154, 100]].forEach(([x, y]) => { f += `<circle cx="${x}" cy="${y}" r="20" fill="${cf}" ${L()}/>`; });
        return { tras: t, frente: `<path d="${capa} Z" fill="${cf}"/>` + f + brilho };
      }
      case 5: return { tras: `<path d="M28 110 Q22 196 36 214 L164 214 Q178 196 172 110 Z" fill="${cf}" ${L()}/>`, frente: franja + mechas(204) + brilho };
      case 6: {
        const tranca = x => { let t = ''; for (let i = 0; i < 7; i++) t += `<ellipse cx="${x}" cy="${150 + i * 21}" rx="13" ry="13" fill="${cf}" ${L(2.5)}/>`; return t + elastico(x, 296); };
        return { tras: tranca(28) + tranca(172), frente: meio + brilho };
      }
      default: return { tras: `<circle cx="48" cy="56" r="24" fill="${cf}" ${L()}/><circle cx="152" cy="56" r="24" fill="${cf}" ${L()}/>`, frente: lado + brilho };
    }
  }

  const TOP = 'M64 200 Q82 194 90 196 Q100 206 110 196 Q118 194 136 200 L134 248 Q132 266 134 282 L66 282 Q68 266 66 248 Z';
  const MANGA_C = `M64 202 Q50 214 50 234 L74 238 Q76 216 80 206 Z|M136 202 Q150 214 150 234 L126 238 Q124 216 120 206 Z`;
  const MANGA_L = `M64 202 Q50 236 45 268 L67 274 Q70 244 80 208 Z|M136 202 Q150 236 155 268 L133 274 Q130 244 120 208 Z`;
  const mangas = (m, cor) => m.split('|').map(p => `<path d="${p}" fill="${cor}" ${L()}/>`).join('');
  const xadrez = (x1, x2, y1, y2, cor) => {
    let t = '';
    for (let x = x1 + 8; x < x2; x += 12) t += `<path d="M${x} ${y1} V${y2}" stroke="${cor}" stroke-width="3" opacity=".45"/>`;
    for (let y = y1 + 8; y < y2; y += 12) t += `<path d="M${x1} ${y} H${x2}" stroke="${cor}" stroke-width="3" opacity=".45"/>`;
    return t;
  };

  function cima(d) {
    const c = CORES.roupa[d.corCima], cd = shade(c, -0.2), cl = shade(c, 0.4), claro = c === '#ffffff';
    const estampa = claro ? '#ff4f9a' : '#fff';
    switch (d.cima) {
      case 0: return mangas(MANGA_C, c) + `<path d="${TOP}" fill="${c}" ${L()}/>` + coracaoP(100, 236, 1.3, estampa);
      case 1: return `<path d="M68 204 Q100 196 132 204 L132 252 L68 252 Z" fill="${c}" ${L()}/><path d="M80 204 L84 192 M120 204 L116 192" stroke="${OL}" stroke-width="4"/>`;
      case 2: return mangas(MANGA_L, c) + `<path d="${TOP}" fill="${c}" ${L()}/>
        <path d="M84 198 Q100 214 116 198" stroke="${cd}" stroke-width="5" fill="none"/>
        <path d="M68 274 H132" stroke="${cd}" stroke-width="6"/>` + coracaoP(84, 232, 0.9, '#e5484d') + coracaoP(100, 232, 0.9, '#e5484d') + coracaoP(116, 232, 0.9, '#e5484d');
      case 3: return `<circle cx="66" cy="210" r="16" fill="${c}" ${L()}/><circle cx="134" cy="210" r="16" fill="${c}" ${L()}/><path d="${TOP}" fill="${c}" ${L()}/>
        <path d="M100 222 L80 210 L82 236 Z M100 222 L120 210 L118 236 Z" fill="${cl}" ${L(2.5)}/><circle cx="100" cy="222" r="6" fill="${cd}" ${L(2.5)}/>`;
      case 4: return mangas(MANGA_C, c) + `<path d="M66 202 Q100 194 134 202 L132 264 L68 264 Z" fill="${c}" ${L()}/>
        <path d="M68 260 L132 260 L152 328 Q100 340 48 328 Z" fill="${c}" ${L()}/>` + xadrez(56, 146, 264, 330, '#fff') + xadrez(70, 130, 204, 260, '#fff') +
        `<path d="M68 262 H132" stroke="${cd}" stroke-width="6"/>` + coracaoP(100, 262, 0.8, '#fff', L(1.5));
      case 5: return mangas(MANGA_C, '#ffffff') + `<path d="${TOP}" fill="#ffffff" ${L()}/>
        <path d="M66 260 L134 260 L134 306 L102 306 L100 292 L98 306 L66 306 Z" fill="${c}" ${L()}/>
        <path d="M78 222 L122 222 L124 262 L76 262 Z" fill="${c}" ${L()}/>
        <path d="M78 224 L70 202 M122 224 L130 202" stroke="${c}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="82" cy="228" r="3.5" fill="#ffc83d" ${L(1.5)}/><circle cx="118" cy="228" r="3.5" fill="#ffc83d" ${L(1.5)}/>
        <rect x="90" y="236" width="20" height="16" rx="4" fill="${cd}"/>`;
      default: return `<path d="M70 210 Q100 202 130 210 L130 256 L70 256 Z" fill="${c}" ${L()}/>
        <path d="M80 210 L84 196 M120 210 L116 196" stroke="${OL}" stroke-width="3"/>` + coracaoP(100, 232, 1.4, estampa, L(1.5));
    }
  }

  function baixo(d) {
    const c = CORES.roupa[d.corBaixo], cd = shade(c, -0.22), cl = shade(c, 0.4);
    switch (d.baixo) {
      case 0: return `<path d="M66 268 L134 268 L148 318 Q100 328 52 318 Z" fill="${c}" ${L()}/>` + xadrez(56, 146, 270, 322, '#fff') + `<path d="M66 272 H134" stroke="${cd}" stroke-width="6"/>`;
      case 1: return `<path d="M66 268 L101 268 L100 358 L68 358 Q63 320 66 268 Z" fill="${c}" ${L()}/>
        <path d="M99 268 L134 268 Q137 320 132 358 L100 358 Z" fill="${c}" ${L()}/>
        <path d="M74 312 h16 M76 318 h12 M110 300 h16 M112 306 h12" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        <path d="M70 350 h28 M102 350 h28" stroke="${cl}" stroke-width="3"/><path d="M66 274 H134" stroke="${cd}" stroke-width="6"/>`;
      case 2: return `<path d="M66 268 L101 268 L100 306 L68 306 Z" fill="${c}" ${L()}/><path d="M99 268 L134 268 L132 306 L100 306 Z" fill="${c}" ${L()}/>
        <path d="M66 274 H134" stroke="${cd}" stroke-width="6"/>`;
      case 3: return `<path d="M66 268 L134 268 L146 312 Q100 320 54 312 Z" fill="${c}" ${L()}/><path d="M66 274 H134" stroke="${cd}" stroke-width="6"/>` + coracaoP(100, 274, 0.6, '#ffc83d', L(1.5));
      default: return `<path d="M66 268 L101 268 L99 356 L72 356 Z" fill="${c}" ${L()}/><path d="M99 268 L134 268 L128 356 L101 356 Z" fill="${c}" ${L()}/>
        <path d="M70 330 h26 M104 330 h26" stroke="${cl}" stroke-width="4"/><path d="M66 274 H134" stroke="${cd}" stroke-width="6"/>`;
    }
  }

  function sapato(d) {
    const c = CORES.roupa[d.corSapato], cd = shade(c, -0.25);
    const pe = (cor) => `<path d="M70 346 L98 346 L99 366 Q100 378 88 378 L66 378 Q58 376 60 366 Q62 352 70 346 Z" fill="${cor}" ${L()}/>
      <path d="M102 346 L130 346 Q138 352 140 366 Q142 376 134 378 L112 378 Q100 378 101 366 Z" fill="${cor}" ${L()}/>`;
    const sola = (cor) => `<path d="M60 372 H99 V380 H62 Z M101 372 H140 V380 H101 Z" fill="${cor}" ${L(2.5)}/>`;
    switch (d.sapato) {
      case 0: return pe(c) + sola('#fff') + `<path d="M78 352 l12 4 M78 360 l12 4 M110 356 l12 -4 M110 364 l12 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
      case 1: return pe(c) + sola('#c9a6f2') + `<path d="M64 364 h34 M102 364 h34" stroke="#9ce8d4" stroke-width="4"/><path d="M78 352 l12 4 M110 356 l12 -4" stroke="#fff" stroke-width="3"/>`;
      case 2: return pe(c) + `<path d="M74 352 H98 M102 352 H126" stroke="${cd}" stroke-width="4"/>` + coracaoP(84, 362, 0.5, '#fff') + coracaoP(118, 362, 0.5, '#fff');
      default: return `<path d="M72 318 L98 318 L99 366 Q100 378 88 378 L66 378 Q58 376 60 366 Q64 352 72 346 Z" fill="${c}" ${L()}/>
        <path d="M102 318 L128 318 L128 346 Q138 352 140 366 Q142 376 134 378 L112 378 Q100 378 101 366 Z" fill="${c}" ${L()}/>
        <path d="M72 324 H98 M102 324 H128" stroke="${cd}" stroke-width="6"/>` + sola(cd);
    }
  }

  function acessorio(d) {
    switch (d.acessorio) {
      case 1: return `<path d="M24 128 Q18 26 100 24 Q182 26 176 128" stroke="#2c2c34" stroke-width="10" fill="none"/>
        <rect x="12" y="104" width="30" height="50" rx="14" fill="#9aa0ad" ${L()}/><rect x="158" y="104" width="30" height="50" rx="14" fill="#9aa0ad" ${L()}/>
        <rect x="18" y="112" width="16" height="34" rx="8" fill="#c7ccd6"/><rect x="166" y="112" width="16" height="34" rx="8" fill="#c7ccd6"/>`;
      case 2: return `<circle cx="70" cy="131" r="22" fill="#fff" fill-opacity=".12" stroke="#5a3424" stroke-width="5"/><circle cx="130" cy="131" r="22" fill="#fff" fill-opacity=".12" stroke="#5a3424" stroke-width="5"/>
        <path d="M92 128 Q100 122 108 128 M48 126 L30 122 M152 126 L170 122" stroke="#5a3424" stroke-width="5" fill="none"/>`;
      case 3: return `<path d="M150 62 L124 44 L126 82 Z M150 62 L176 44 L174 82 Z" fill="#ff4f9a" ${L()}/><circle cx="150" cy="62" r="9" fill="#e0307d" ${L()}/>`;
      case 4: return coracaoP(64, 66, 1.6, '#ff6b8f', L(2.5)) + coracaoP(136, 66, 1.6, '#ff6b8f', L(2.5));
      case 5: return `<g transform="rotate(-30 140 86)"><rect x="124" y="80" width="34" height="11" rx="5" fill="#fff" ${L(2.5)}/></g><g transform="rotate(30 140 86)"><rect x="124" y="80" width="34" height="11" rx="5" fill="#fff" ${L(2.5)}/></g>`;
      case 6: return `<path d="M132 204 L76 262" stroke="#ff4f9a" stroke-width="4"/><circle cx="72" cy="272" r="17" fill="#ff9ec4" ${L()}/>` + coracaoP(72, 272, 0.6, '#fff');
      case 7: { let t = ''; for (let i = 0; i <= 8; i++) { const a = Math.PI * (0.15 + 0.7 * i / 8); t += `<circle cx="${100 - Math.cos(a) * 18}" cy="${196 + Math.sin(a) * 10}" r="3.6" fill="#fff" ${L(1.4)}/>`; } return t; }
      case 8: return [[44, 146], [52, 140], [56, 150], [144, 140], [148, 150], [156, 146]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#b06a4a"/>`).join('');
      case 9: return `<circle cx="30" cy="148" r="5" fill="#ffc83d" ${L(2)}/><circle cx="170" cy="148" r="5" fill="#ffc83d" ${L(2)}/>`;
      case 10: return [[60, 66, '#ff8fb8'], [100, 46, '#ffffff'], [140, 66, '#ff8fb8']].map(([x, y, k]) =>
        [0, 72, 144, 216, 288].map(a => `<ellipse cx="${x}" cy="${y - 7}" rx="6" ry="9" fill="${k}" stroke="${OL}" stroke-width="1.5" transform="rotate(${a} ${x} ${y})"/>`).join('') + `<circle cx="${x}" cy="${y}" r="4.5" fill="#ffc83d"/>`).join('');
      case 11: return `<circle cx="104" cy="168" r="17" fill="#ff8fc6" ${L(2.5)}/><ellipse cx="98" cy="161" rx="5" ry="3.5" fill="#fff" opacity=".7"/>`;
      case 12: return `<path d="M30 112 Q30 46 100 44 Q170 46 170 112" stroke="${OL}" stroke-width="16" fill="none"/><path d="M30 112 Q30 46 100 44 Q170 46 170 112" stroke="#e5484d" stroke-width="11" fill="none" stroke-dasharray="6 6"/><path d="M30 112 Q30 46 100 44 Q170 46 170 112" stroke="#1f2a44" stroke-width="11" fill="none" stroke-dasharray="6 6" stroke-dashoffset="6" opacity=".6"/>`;
      default: return '';
    }
  }

  function boneco(d) {
    G = uid('b');
    const s = CORES.pele[d.pele], ol = CORES.olhos[d.olhos % CORES.olhos.length], hc = CORES.cabelo[d.corCabelo % CORES.cabelo.length];
    const defs = `<defs>
      <radialGradient id="${G}pele" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${shade(s, 0.1)}"/><stop offset=".75" stop-color="${s}"/><stop offset="1" stop-color="${shade(s, -0.08)}"/></radialGradient>
      <linearGradient id="${G}iris" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(ol, -0.45)}"/><stop offset=".55" stop-color="${ol}"/><stop offset="1" stop-color="${shade(ol, 0.45)}"/></linearGradient>
      <linearGradient id="${G}cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(hc, 0.15)}"/><stop offset=".6" stop-color="${hc}"/><stop offset="1" stop-color="${shade(hc, -0.18)}"/></linearGradient></defs>`;
    const c = corpo(d), h = cabelo(d);
    return defs + h.tras + c.pernas + baixo(d) + sapato(d) + c.bracos + c.tronco + cima(d) + c.maos + rosto(d) + h.frente + acessorio(d);
  }

  // ---------- CARROS ----------
  const CARROS = ['Conversível chique', 'Van de passeio', 'Carro-foguete'];
  const BANCOS = [235, 345, 455]; // centro x de cada banco (frente do carro à direita)

  function banco(x, y) {
    const b = '#fff1e2', bd = '#e9cdb4', st = '#ff7fb4';
    return `<rect x="${x - 34}" y="${y}" width="50" height="78" rx="14" fill="${b}"/>
      <rect x="${x - 30}" y="${y - 24}" width="34" height="26" rx="10" fill="${b}"/>
      <path d="M${x - 24} ${y + 10} v58 M${x - 9} ${y + 10} v58" stroke="${bd}" stroke-width="2.5"/>
      <rect x="${x - 30}" y="${y + 6}" width="42" height="66" rx="10" fill="none" stroke="${st}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  }

  function roda(x, y, r, tipo) {
    let raios = '';
    const n = tipo === 2 ? 5 : 6;
    for (let i = 0; i < n; i++) raios += `<rect x="${x - 3}" y="${y - r * 0.55}" width="6" height="${r * 0.55}" rx="3" fill="#cfd6e4" transform="rotate(${i * 360 / n} ${x} ${y})"/>`;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#1d1a26"/>
      <circle cx="${x}" cy="${y}" r="${r * 0.66}" fill="#eef2f8"/><circle cx="${x}" cy="${y}" r="${r * 0.6}" fill="#9aa4b8"/>
      ${raios}<circle cx="${x}" cy="${y}" r="${r * 0.18}" fill="#eef2f8"/>
      <path d="M${x - r * 0.5} ${y - r * 0.35} A ${r * 0.6} ${r * 0.6} 0 0 1 ${x + r * 0.1} ${y - r * 0.6}" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>`;
  }

  function sentados(bonecos, yCabeca) {
    // bonecos: até 3 strings SVG em coordenadas 0..200 x 0..400
    const s = 0.36, id = uid('c');
    return `<clipPath id="${id}"><rect x="0" y="0" width="700" height="290"/></clipPath><g clip-path="url(#${id})">` +
      bonecos.map((b, i) => b ? `<g transform="translate(${BANCOS[i] - 9 - 100 * s} ${yCabeca - 120 * s}) scale(${s})">${b}</g>` : '').join('') + '</g>';
  }

  function carro(tipo, cor, bonecos) {
    const c = CORES.carro[cor], cd = shade(c, -0.22), cl = shade(c, 0.35), id = uid('m');
    if (tipo > 2) return carroGen(MODELOS[tipo - 3], c, bonecos);
    const sombra = `<ellipse cx="350" cy="352" rx="300" ry="16" fill="#000" opacity=".18"/>`;
    if (tipo === 0) { // conversível
      const fundo = BANCOS.map(x => banco(x, 168)).join('') +
        `<path d="M498 214 l14 -40" stroke="#1f2a44" stroke-width="5" stroke-linecap="round"/><ellipse cx="512" cy="172" rx="6" ry="18" fill="none" stroke="#1f2a44" stroke-width="5"/>`;
      const corpo = `
        <path d="M60 262 Q62 216 120 212 L520 208 Q610 208 648 240 Q664 256 658 290 L652 306 Q648 312 636 312 L76 312 Q58 312 58 294 Z" fill="${c}"/>
        <path d="M60 262 Q62 230 120 226 L520 222 Q600 222 640 248" stroke="${cl}" stroke-width="5" fill="none" opacity=".8"/>
        <path d="M66 270 L654 270" stroke="#e8edf5" stroke-width="5"/>
        <path d="M62 296 L656 296 L652 306 Q648 312 636 312 L76 312 Q60 312 62 296 Z" fill="${cd}"/>
        <path d="M512 208 L548 150 Q552 146 556 150 L536 208 Z" fill="#bfe9ff" opacity=".75" stroke="#e8edf5" stroke-width="3"/>
        <path d="M300 222 v74 M420 222 v74" stroke="${cd}" stroke-width="2.5"/>
        <rect x="320" y="240" width="26" height="6" rx="3" fill="#e8edf5"/><rect x="440" y="240" width="26" height="6" rx="3" fill="#e8edf5"/>
        <ellipse cx="646" cy="252" rx="10" ry="12" fill="#fff6b0"/><ellipse cx="646" cy="252" rx="22" ry="18" fill="#fff6b0" opacity=".25"/>
        <rect x="58" y="236" width="12" height="22" rx="5" fill="#ff5a6e"/>
        <path d="M120 312 a52 52 0 0 1 104 0 Z M494 312 a52 52 0 0 1 104 0 Z" fill="#2a1d36"/>
        ${roda(172, 312, 44, 0)}${roda(546, 312, 44, 0)}`;
      return sombra + fundo + sentados(bonecos, 168) + corpo;
    }
    if (tipo === 1) { // van
      const janelas = [[188, 118], [298, 118], [408, 118]];
      const fundo = `<rect x="180" y="114" width="420" height="180" fill="#5b3f7a"/>` + BANCOS.map(x => banco(x, 168)).join('') +
        `<ellipse cx="520" cy="172" rx="6" ry="18" fill="none" stroke="#1f2a44" stroke-width="5"/>`;
      const fora = 'M70 300 L70 146 Q70 104 116 102 L560 102 Q612 104 632 150 L652 232 Q660 256 656 292 Q654 310 638 310 L86 310 Q70 310 70 300 Z';
      const corpo = `
        <mask id="${id}"><path d="${fora}" fill="#fff"/>
          ${janelas.map(([x, y]) => `<rect x="${x}" y="${y}" width="92" height="86" rx="14" fill="#000"/>`).join('')}
          <path d="M520 118 L580 118 Q598 120 606 140 L620 204 L520 204 Z" fill="#000"/></mask>
        <g mask="url(#${id})">
          <rect x="60" y="96" width="610" height="230" fill="#ffffff"/>
          <rect x="60" y="214" width="610" height="110" fill="${c}"/>
          <path d="M60 214 Q360 200 670 214" stroke="${cd}" stroke-width="10" fill="none"/>
          <rect x="60" y="292" width="610" height="30" fill="${cd}"/>
          <path d="M300 214 v78 M410 214 v78 M512 214 v78" stroke="${cd}" stroke-width="2.5"/>
          <circle cx="250" cy="250" r="14" fill="${cl}"/><path d="M243 250 l4 4 9 -9" stroke="#fff" stroke-width="3" fill="none"/>
        </g>
        ${janelas.map(([x, y]) => `<rect x="${x}" y="${y}" width="92" height="86" rx="14" fill="#bfe9ff" opacity=".18"/>
          <path d="M${x + 12} ${y + 70} L${x + 46} ${y + 12}" stroke="#fff" stroke-width="7" opacity=".35" stroke-linecap="round"/>`).join('')}
        <path d="M520 118 L580 118 Q598 120 606 140 L620 204 L520 204 Z" fill="#bfe9ff" opacity=".25"/>
        <rect x="120" y="88" width="400" height="10" rx="5" fill="#9aa4b8"/><path d="M160 98 v-10 M300 98 v-10 M440 98 v-10" stroke="#9aa4b8" stroke-width="5"/>
        <ellipse cx="648" cy="248" rx="9" ry="13" fill="#fff6b0"/><rect x="70" y="232" width="10" height="26" rx="4" fill="#ff5a6e"/>
        <path d="M120 310 a52 52 0 0 1 104 0 Z M494 310 a52 52 0 0 1 104 0 Z" fill="#2a1d36"/>
        ${roda(172, 310, 44, 1)}${roda(546, 310, 44, 1)}`;
      return sombra + fundo + sentados(bonecos, 168) + corpo;
    }
    // carro-foguete
    const fundo = BANCOS.map(x => banco(x, 166)).join('') + `<ellipse cx="520" cy="172" rx="6" ry="18" fill="none" stroke="#1f2a44" stroke-width="5"/>`;
    const corpo = `
      <path d="M40 250 Q20 236 40 220 L70 228 Z" fill="#ffc83d"><animate attributeName="d" dur=".25s" repeatCount="indefinite"
        values="M40 250 Q20 236 40 220 L70 228 Z;M44 252 Q4 236 44 218 L70 228 Z;M40 250 Q20 236 40 220 L70 228 Z"/></path>
      <path d="M30 248 Q-10 236 30 222 L70 230 Z" fill="#ff8a3d" opacity=".7"><animate attributeName="opacity" dur=".2s" repeatCount="indefinite" values=".7;.3;.7"/></path>
      <path d="M120 214 L90 130 L150 210 Z" fill="${cd}"/>
      <rect x="62" y="216" width="30" height="48" rx="10" fill="#9aa4b8"/>
      <path d="M84 300 Q66 296 70 260 Q72 214 140 210 L560 206 Q650 210 676 258 Q684 286 662 302 Q650 312 620 312 L110 312 Q90 312 84 300 Z" fill="${c}"/>
      <path d="M86 258 Q90 226 140 222 L560 218 Q640 220 670 258" stroke="${cl}" stroke-width="6" fill="none" opacity=".8"/>
      <path d="M90 284 L670 284" stroke="#ffc83d" stroke-width="7"/>
      ${[200, 330, 460].map(x => `<path d="M${x} 250 l4 8 9 1.2 -6.5 6 1.6 9 -8 -4.3 -8 4.3 1.6 -9 -6.5 -6 9 -1.2 Z" fill="#fff"/>`).join('')}
      <path d="M170 212 Q170 112 350 104 Q540 108 556 210 Z" fill="#bfe9ff" opacity=".22" stroke="#e8f7ff" stroke-width="4"/>
      <path d="M210 190 Q216 136 300 124" stroke="#fff" stroke-width="9" fill="none" opacity=".45" stroke-linecap="round"/>
      <circle cx="664" cy="262" r="10" fill="#9be7ff"/><circle cx="664" cy="262" r="20" fill="#9be7ff" opacity=".25"/>
      <path d="M120 312 a52 52 0 0 1 104 0 Z M494 312 a52 52 0 0 1 104 0 Z" fill="#2a1d36"/>
      ${roda(172, 312, 44, 2)}${roda(546, 312, 44, 2)}`;
    return sombra + fundo + sentados(bonecos, 166) + corpo;
  }

  // ---------- MAIS CARROS (gerados por receita) ----------
  // cab: aberto | teto | alto | esporte | cupula ; ex: enfeites
  const MODELOS = [
    { nome: 'Sedã elegante', cab: 'teto', ex: ['cromado'] },
    { nome: 'Hatch fofinho', cab: 'teto', ex: ['coracao'], teto: '#ffffff' },
    { nome: 'Esportivo veloz', cab: 'esporte', ex: ['aerofolio', 'listras'] },
    { nome: 'Super esportivo', cab: 'esporte', ex: ['aerofolio', 'chamas'], roda: 2 },
    { nome: 'SUV aventura', cab: 'alto', ex: ['bagageiro'], r: 50 },
    { nome: 'Jipe da selva', cab: 'aberto', ex: ['santoantonio', 'pintas'], r: 52 },
    { nome: 'Táxi', cab: 'teto', ex: ['taxi'] },
    { nome: 'Polícia', cab: 'teto', ex: ['sirene', 'policia'], teto: '#ffffff' },
    { nome: 'Ambulância', cab: 'alto', ex: ['sirene', 'cruz'], teto: '#ffffff' },
    { nome: 'Bombeiros', cab: 'alto', ex: ['sirene', 'escada'] },
    { nome: 'Limusine', cab: 'teto', ex: ['cromado', 'dourado'], teto: '#1f2a44' },
    { nome: 'Buggy da praia', cab: 'aberto', ex: ['santoantonio', 'flores'], r: 50, roda: 1 },
    { nome: 'Carro de princesa', cab: 'teto', ex: ['coroa', 'coracao'], teto: '#ffffff' },
    { nome: 'Carro de corrida', cab: 'aberto', ex: ['aerofolio', 'numero', 'listras'], roda: 2 },
    { nome: 'Perua de viagem', cab: 'teto', ex: ['bagageiro', 'malas'] },
    { nome: 'Carro elétrico', cab: 'teto', ex: ['raio'], roda: 2, teto: '#ffffff' },
    { nome: 'Carro arco-íris', cab: 'teto', ex: ['arcoiris'] },
    { nome: 'Carro de sorvete', cab: 'alto', ex: ['sorvete', 'bolinhas'], teto: '#ffffff' },
    { nome: 'Carro unicórnio', cab: 'teto', ex: ['unicornio', 'estrelas'], teto: '#ffffff' },
    { nome: 'Carro estrelado', cab: 'aberto', ex: ['estrelas'] },
    { nome: 'Carro de flores', cab: 'aberto', ex: ['flores'] },
    { nome: 'Monstrão', cab: 'alto', ex: ['chamas'], r: 60 },
    { nome: 'Safári', cab: 'alto', ex: ['bagageiro', 'pintas'], r: 52 },
    { nome: 'Carro de festa', cab: 'teto', ex: ['baloes'] },
    { nome: 'Nave sobre rodas', cab: 'cupula', ex: ['antenas', 'estrelas'], roda: 2 },
    { nome: 'Carro de doces', cab: 'teto', ex: ['pirulito', 'bolinhas'], teto: '#ffffff' },
    { nome: 'Carro coração', cab: 'teto', ex: ['laco', 'coracao'] },
    { nome: 'Luxo dourado', cab: 'teto', ex: ['dourado', 'cromado'], teto: '#ffc83d' }
  ];
  CARROS.push(...MODELOS.map(m => m.nome));

  const estrela = (x, y, r, cor) => `<path d="M${x} ${y - r} L${x + r * .29} ${y - r * .4} L${x + r * .95} ${y - r * .31} L${x + r * .47} ${y + r * .15} L${x + r * .59} ${y + r * .81} L${x} ${y + r * .5} L${x - r * .59} ${y + r * .81} L${x - r * .47} ${y + r * .15} L${x - r * .95} ${y - r * .31} L${x - r * .29} ${y - r * .4} Z" fill="${cor}"/>`;
  const coracao = (x, y, s, cor) => `<path d="M${x} ${y + 9 * s} l${-10 * s} ${-9 * s} a${5.5 * s} ${5.5 * s} 0 0 1 ${10 * s} ${-7 * s} a${5.5 * s} ${5.5 * s} 0 0 1 ${10 * s} ${7 * s} Z" fill="${cor}"/>`;
  const flor = (x, y, cor) => [0, 72, 144, 216, 288].map(a => `<ellipse cx="${x}" cy="${y - 7}" rx="5" ry="8" fill="${cor}" transform="rotate(${a} ${x} ${y})"/>`).join('') + `<circle cx="${x}" cy="${y}" r="4.5" fill="#ffc83d"/>`;

  function carroGen(m, c, bonecos) {
    const cd = shade(c, -0.22), cl = shade(c, 0.35), id = uid('g');
    const r = m.r || 44, bt = m.cab === 'alto' ? 200 : m.cab === 'esporte' ? 222 : 212;
    const rY = m.cab === 'alto' ? 98 : m.cab === 'esporte' ? 126 : 112;
    const fechado = m.cab === 'teto' || m.cab === 'alto' || m.cab === 'esporte';
    const topo = fechado ? rY : m.cab === 'cupula' ? 104 : 150;
    const ex = new Set(m.ex);
    const baixo = `M58 ${bt + 44} Q60 ${bt} 112 ${bt} L560 ${bt} Q636 ${bt} 658 ${bt + 40} Q668 296 652 312 L80 312 Q58 312 58 292 Z`;
    const cabine = `M112 ${bt} Q118 ${rY} 172 ${rY} L528 ${rY} Q556 ${rY} 622 ${bt} Z`;
    const jan = [[184, 288], [298, 400], [410, 514]];
    const sombra = `<ellipse cx="350" cy="${312 + r * 0.9}" rx="300" ry="16" fill="#000" opacity=".18"/>`;
    let fundo = '';
    if (fechado) fundo += `<path d="${cabine}" fill="#4a3560"/><rect x="112" y="${bt - 2}" width="510" height="24" fill="#4a3560"/>`;
    fundo += BANCOS.map(x => banco(x, 168)).join('') + `<ellipse cx="520" cy="172" rx="6" ry="18" fill="none" stroke="#1f2a44" stroke-width="5"/>`;
    if (ex.has('santoantonio')) fundo += `<path d="M196 ${bt} L206 128 L486 128 L496 ${bt}" stroke="#9aa4b8" stroke-width="10" fill="none" stroke-linejoin="round"/>`;

    let corpo = '';
    if (fechado) {
      corpo += `<mask id="${id}"><path d="${baixo}" fill="#fff"/><path d="${cabine}" fill="#fff"/>
        ${jan.map(([a, b]) => `<rect x="${a}" y="${rY + 14}" width="${b - a}" height="${bt - rY - 20}" rx="12" fill="#000"/>`).join('')}
        <path d="M526 ${rY + 14} L548 ${rY + 14} Q566 ${rY + 16} 596 ${bt - 6} L526 ${bt - 6} Z" fill="#000"/></mask>
        <g mask="url(#${id})"><rect x="40" y="60" width="640" height="300" fill="${c}"/>
        ${m.teto ? `<rect x="40" y="60" width="640" height="${bt - 60}" fill="${m.teto}"/>` : ''}
        <rect x="40" y="${bt - 4}" width="640" height="8" fill="${cd}"/>
        <rect x="40" y="296" width="640" height="30" fill="${cd}"/>
        <path d="M300 ${bt} v84 M410 ${bt} v84" stroke="${cd}" stroke-width="2.5"/></g>
        ${jan.map(([a, b]) => `<rect x="${a}" y="${rY + 14}" width="${b - a}" height="${bt - rY - 20}" rx="12" fill="#bfe9ff" opacity=".16"/>
          <path d="M${a + 14} ${bt - 14} L${a + 44} ${rY + 24}" stroke="#fff" stroke-width="7" opacity=".35" stroke-linecap="round"/>`).join('')}
        <path d="M526 ${rY + 14} L548 ${rY + 14} Q566 ${rY + 16} 596 ${bt - 6} L526 ${bt - 6} Z" fill="#bfe9ff" opacity=".25"/>`;
    } else {
      corpo += `<path d="${baixo}" fill="${c}"/><rect x="58" y="296" width="604" height="16" fill="${cd}"/>
        <path d="M300 ${bt} v84 M410 ${bt} v84" stroke="${cd}" stroke-width="2.5"/>`;
      if (m.cab === 'cupula') corpo += `<path d="M150 ${bt + 2} Q160 100 350 96 Q546 100 572 ${bt + 2} Z" fill="#bfe9ff" opacity=".22" stroke="#e8f7ff" stroke-width="4"/>
        <path d="M196 ${bt - 20} Q204 130 296 118" stroke="#fff" stroke-width="9" fill="none" opacity=".45" stroke-linecap="round"/>`;
      else corpo += `<path d="M512 ${bt} L548 150 Q552 146 556 150 L536 ${bt} Z" fill="#bfe9ff" opacity=".75" stroke="#e8edf5" stroke-width="3"/>`;
    }
    corpo += `<path d="M64 ${bt + 30} Q70 ${bt + 12} 112 ${bt + 12} L560 ${bt + 12} Q620 ${bt + 12} 646 ${bt + 36}" stroke="${cl}" stroke-width="5" fill="none" opacity=".7"/>
      <rect x="320" y="${bt + 24}" width="26" height="6" rx="3" fill="#e8edf5"/><rect x="432" y="${bt + 24}" width="26" height="6" rx="3" fill="#e8edf5"/>
      <ellipse cx="650" cy="${bt + 44}" rx="9" ry="12" fill="#fff6b0"/><ellipse cx="650" cy="${bt + 44}" rx="20" ry="16" fill="#fff6b0" opacity=".25"/>
      <rect x="58" y="${bt + 30}" width="11" height="22" rx="5" fill="#ff5a6e"/>`;

    // enfeites
    const meio = bt + 56;
    if (ex.has('cromado')) corpo += `<path d="M66 ${meio} H654" stroke="#eef2f8" stroke-width="6"/>`;
    if (ex.has('dourado')) corpo += `<path d="M66 ${meio + 12} H654" stroke="#ffc83d" stroke-width="5"/>` + estrela(360, bt + 36, 10, '#ffc83d');
    if (ex.has('listras')) corpo += `<path d="M62 ${meio - 6} H656 M62 ${meio + 8} H656" stroke="#fff" stroke-width="7"/>`;
    if (ex.has('arcoiris')) ['#e5484d', '#ff8a3d', '#ffc83d', '#34c38f', '#3fa7e0', '#a35cf0'].forEach((k, i) => { corpo += `<path d="M62 ${meio - 14 + i * 6} H656" stroke="${k}" stroke-width="6"/>`; });
    if (ex.has('chamas')) corpo += `<path d="M640 ${meio} Q600 ${meio - 30} 560 ${meio - 6} Q540 ${meio - 34} 500 ${meio - 4} Q480 ${meio - 26} 446 ${meio} Q500 ${meio + 22} 560 ${meio + 8} Q600 ${meio + 26} 640 ${meio} Z" fill="#ff8a3d"/>
      <path d="M636 ${meio} Q600 ${meio - 16} 566 ${meio} Q530 ${meio - 18} 496 ${meio + 2} Q560 ${meio + 16} 636 ${meio} Z" fill="#ffc83d"/>`;
    if (ex.has('coracao')) [200, 360, 520].forEach(x => { corpo += coracao(x, meio - 4, 1.1, '#ff4f9a'); });
    if (ex.has('estrelas')) [190, 260, 380, 470, 560].forEach((x, i) => { corpo += estrela(x, meio + (i % 2 ? 4 : -8), 9, '#fff'); });
    if (ex.has('flores')) [200, 300, 420, 530].forEach((x, i) => { corpo += flor(x, meio - 2, ['#ff4f9a', '#fff', '#a35cf0', '#ffc83d'][i]); });
    if (ex.has('pintas')) [[150, 0], [240, 14], [380, -6], [470, 12], [580, 0]].forEach(([x, d]) => { corpo += `<ellipse cx="${x}" cy="${meio + d}" rx="16" ry="10" fill="${cd}" opacity=".6"/>`; });
    if (ex.has('bolinhas')) for (let x = 120; x < 640; x += 46) corpo += `<circle cx="${x}" cy="${meio + ((x / 46) % 2 ? 10 : -6)}" r="6" fill="#fff" opacity=".85"/>`;
    if (ex.has('raio')) corpo += `<path d="M380 ${meio - 30} L350 ${meio + 4} L372 ${meio + 4} L356 ${meio + 34} L398 ${meio - 6} L376 ${meio - 6} Z" fill="#ffc83d" stroke="#fff" stroke-width="3"/>`;
    if (ex.has('numero')) corpo += `<circle cx="360" cy="${meio}" r="26" fill="#fff"/><text x="360" y="${meio + 12}" text-anchor="middle" font-family="Trebuchet MS,sans-serif" font-weight="900" font-size="34" fill="#1f2a44">7</text>`;
    if (ex.has('taxi')) {
      for (let x = 66; x < 650; x += 24) corpo += `<rect x="${x}" y="${meio}" width="12" height="12" fill="#1f2a44"/><rect x="${x + 12}" y="${meio + 12}" width="12" height="12" fill="#1f2a44"/>`;
      corpo += `<rect x="310" y="${rY - 30}" width="90" height="30" rx="8" fill="#ffc83d" stroke="#1f2a44" stroke-width="3"/><text x="355" y="${rY - 8}" text-anchor="middle" font-family="Trebuchet MS,sans-serif" font-weight="900" font-size="20" fill="#1f2a44">TÁXI</text>`;
    }
    if (ex.has('policia')) corpo += `<rect x="200" y="${meio - 14}" width="320" height="30" rx="6" fill="#1f2a44"/><text x="360" y="${meio + 9}" text-anchor="middle" font-family="Trebuchet MS,sans-serif" font-weight="900" font-size="24" fill="#fff">POLÍCIA</text>`;
    if (ex.has('cruz')) corpo += `<path d="M350 ${meio - 24} h20 v14 h14 v20 h-14 v14 h-20 v-14 h-14 v-20 h14 Z" fill="#e5484d" stroke="#fff" stroke-width="3"/>`;
    if (ex.has('sirene')) corpo += `<rect x="320" y="${topo - 22}" width="34" height="22" rx="6" fill="#e5484d"><animate attributeName="opacity" dur=".6s" repeatCount="indefinite" values="1;.35;1"/></rect>
      <rect x="356" y="${topo - 22}" width="34" height="22" rx="6" fill="#3fa7e0"><animate attributeName="opacity" dur=".6s" repeatCount="indefinite" values=".35;1;.35"/></rect>`;
    if (ex.has('escada')) { corpo += `<path d="M150 ${topo - 10} H560 M150 ${topo - 28} H560" stroke="#cfd6e4" stroke-width="5"/>`; for (let x = 160; x <= 550; x += 30) corpo += `<path d="M${x} ${topo - 28} V${topo - 10}" stroke="#cfd6e4" stroke-width="4"/>`; }
    if (ex.has('bagageiro')) corpo += `<rect x="180" y="${topo - 14}" width="340" height="8" rx="4" fill="#9aa4b8"/><path d="M210 ${topo - 6} v6 M350 ${topo - 6} v6 M490 ${topo - 6} v6" stroke="#9aa4b8" stroke-width="5"/>`;
    if (ex.has('malas')) corpo += `<rect x="200" y="${topo - 50}" width="70" height="36" rx="8" fill="#a35cf0"/><rect x="280" y="${topo - 42}" width="56" height="28" rx="7" fill="#ffc83d"/><rect x="346" y="${topo - 56}" width="80" height="42" rx="9" fill="#ff4f9a"/><path d="M225 ${topo - 50} v-8 h20 v8 M371 ${topo - 56} v-8 h30 v8" stroke="#1f2a44" stroke-width="3" fill="none"/>`;
    if (ex.has('coroa')) corpo += `<path d="M310 ${topo} L314 ${topo - 34} L332 ${topo - 16} L350 ${topo - 42} L368 ${topo - 16} L386 ${topo - 34} L390 ${topo} Z" fill="#ffc83d" stroke="#e0a400" stroke-width="3"/><circle cx="350" cy="${topo - 12}" r="5" fill="#e5484d"/>`;
    if (ex.has('laco')) corpo += `<path d="M350 ${topo - 12} L318 ${topo - 34} L320 ${topo + 2} Z M350 ${topo - 12} L382 ${topo - 34} L380 ${topo + 2} Z" fill="#ff4f9a"/><circle cx="350" cy="${topo - 12}" r="9" fill="#e0307d"/>`;
    if (ex.has('sorvete')) corpo += `<path d="M350 ${topo} l-22 -50 h44 Z" fill="#e0a560"/><circle cx="350" cy="${topo - 58}" r="24" fill="#ff9ec4"/><circle cx="336" cy="${topo - 78}" r="16" fill="#fff"/><circle cx="364" cy="${topo - 78}" r="16" fill="#9be7ff"/><circle cx="350" cy="${topo - 98}" r="7" fill="#e5484d"/>`;
    if (ex.has('pirulito')) corpo += `<path d="M350 ${topo} V${topo - 50}" stroke="#fff" stroke-width="6"/><circle cx="350" cy="${topo - 72}" r="26" fill="#ff4f9a"/><path d="M350 ${topo - 72} m-16 0 a16 16 0 1 1 16 16 a10 10 0 1 1 -10 -10" stroke="#fff" stroke-width="5" fill="none"/>`;
    if (ex.has('baloes')) [[280, '#ff4f9a', -70], [340, '#ffc83d', -90], [400, '#3fa7e0', -76]].forEach(([x, k, h]) => { corpo += `<path d="M350 ${topo} Q${x} ${topo + h / 2} ${x} ${topo + h + 20}" stroke="#9aa4b8" stroke-width="2" fill="none"/><ellipse cx="${x}" cy="${topo + h}" rx="20" ry="24" fill="${k}"/><ellipse cx="${x - 7}" cy="${topo + h - 8}" rx="5" ry="8" fill="#fff" opacity=".5"/>`; });
    if (ex.has('antenas')) corpo += `<path d="M300 ${topo + 4} L286 ${topo - 34} M400 ${topo + 4} L414 ${topo - 34}" stroke="#9aa4b8" stroke-width="4"/><circle cx="286" cy="${topo - 38}" r="8" fill="#ff4f9a"/><circle cx="414" cy="${topo - 38}" r="8" fill="#ffc83d"/>`;
    if (ex.has('unicornio')) corpo += `<path d="M626 ${bt + 4} L676 ${bt - 46} L644 ${bt + 10} Z" fill="#ffc83d" stroke="#fff" stroke-width="2"/><path d="M640 ${bt - 6} l18 -6 M650 ${bt - 18} l14 -5" stroke="#fff" stroke-width="2"/>`;
    if (ex.has('aerofolio')) corpo += `<path d="M84 ${bt - 2} L96 ${bt - 30} M120 ${bt - 2} L124 ${bt - 30}" stroke="#1f2a44" stroke-width="6"/><rect x="62" y="${bt - 40}" width="84" height="14" rx="6" fill="${cd}"/>`;

    const arco = r + 8;
    corpo += `<path d="M${172 - arco} 312 a${arco} ${arco} 0 0 1 ${arco * 2} 0 Z M${546 - arco} 312 a${arco} ${arco} 0 0 1 ${arco * 2} 0 Z" fill="#2a1d36"/>
      ${roda(172, 312, r, m.roda || 0)}${roda(546, 312, r, m.roda || 0)}`;
    return sombra + fundo + sentados(bonecos, 166) + corpo;
  }

  // ---------- CIDADE ----------
  const LUGARES = [
    { nome: 'CASA', x: 260, y: 250 }, { nome: 'LOJA DE ROUPAS', x: 780, y: 196 }, { nome: 'SORVETERIA', x: 1240, y: 236 },
    { nome: 'ESCOLA', x: 1800, y: 268 }, { nome: 'PARQUE', x: 2365, y: 370 }, { nome: 'SALÃO DE BELEZA', x: 2910, y: 182 }
  ];

  function arvore(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-8" y="-10" width="16" height="70" rx="6" fill="#8a5a3a"/>
      <circle cx="0" cy="-40" r="46" fill="#3fae6a"/><circle cx="-30" cy="-14" r="32" fill="#36a060"/><circle cx="30" cy="-14" r="32" fill="#4cc078"/>
      <circle cx="-14" cy="-58" r="14" fill="#6fd696" opacity=".7"/></g>`;
  }
  function janela(x, y, w, h, cor) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${cor || '#bfe9ff'}" stroke="#fff" stroke-width="5"/>
      <path d="M${x + w / 2} ${y} v${h} M${x} ${y + h / 2} h${w}" stroke="#fff" stroke-width="3"/>
      <path d="M${x + 8} ${y + h - 10} L${x + w / 2 - 6} ${y + 10}" stroke="#fff" stroke-width="4" opacity=".5"/>`;
  }
  function placa(x, y, txt, cor) {
    const w = txt.length * 19 + 40;
    return `<rect x="${x - w / 2}" y="${y}" width="${w}" height="46" rx="12" fill="${cor}" stroke="#fff" stroke-width="4"/>
      <text x="${x}" y="${y + 33}" text-anchor="middle" font-family="Baloo 2, Trebuchet MS, sans-serif" font-weight="800" font-size="28" fill="#fff">${txt}</text>`;
  }

  function cidade() {
    const chao = 540;
    let s = `<defs><linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd3ff"/><stop offset="1" stop-color="#dff4ff"/></linearGradient></defs>
      <rect width="3400" height="700" fill="url(#ceu)"/>
      <circle cx="470" cy="80" r="50" fill="#ffe27a"/><circle cx="470" cy="80" r="80" fill="#ffe27a" opacity=".25"/>`;
    [[600, 110], [1300, 70], [2000, 130], [2700, 80], [3200, 120]].forEach(([x, y]) => {
      s += `<g fill="#fff" opacity=".9"><circle cx="${x}" cy="${y}" r="34"/><circle cx="${x + 40}" cy="${y - 14}" r="42"/><circle cx="${x + 84}" cy="${y}" r="32"/><rect x="${x}" y="${y}" width="84" height="32"/></g>`;
    });
    // prédios distantes
    for (let x = 0; x < 3400; x += 130) {
      const h = 140 + ((x * 37) % 160);
      s += `<rect x="${x}" y="${chao - h}" width="110" height="${h}" fill="#b9c8ee" opacity=".55"/>`;
    }
    // CASA
    s += `<g><rect x="90" y="300" width="340" height="240" fill="#ffd6e7"/><path d="M60 310 L260 170 L460 310 Z" fill="#e5484d"/>
      <path d="M60 310 L260 170 L460 310" stroke="#b8323a" stroke-width="10" fill="none"/>
      ${janela(130, 350, 80, 70)}${janela(310, 350, 80, 70)}
      <rect x="225" y="420" width="70" height="120" rx="8" fill="#a35cf0"/><circle cx="282" cy="482" r="5" fill="#ffc83d"/>
      <rect x="130" y="430" width="80" height="14" rx="6" fill="#ff7fb4"/><rect x="310" y="430" width="80" height="14" rx="6" fill="#ff7fb4"/></g>`;
    // LOJA DE ROUPAS
    s += `<g><rect x="560" y="250" width="440" height="290" fill="#f3e9ff"/><rect x="560" y="250" width="440" height="30" fill="#a35cf0"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${560 + i * 55} 300 h55 v26 a27.5 27.5 0 0 1 -55 0 Z" fill="${i % 2 ? '#fff' : '#ff4f9a'}"/>`).join('')}
      <rect x="590" y="370" width="200" height="170" rx="6" fill="#bfe9ff" stroke="#fff" stroke-width="6"/>
      <path d="M640 400 l20 -10 20 10 -8 20 v70 h-24 v-70 Z" fill="#ff4f9a"/><path d="M710 400 l20 -10 20 10 -8 20 v70 h-24 v-70 Z" fill="#ffc83d"/>
      <rect x="830" y="400" width="90" height="140" rx="8" fill="#ff4f9a"/><circle cx="905" cy="470" r="5" fill="#fff"/></g>`;
    // SORVETERIA
    s += `<g><rect x="1100" y="320" width="340" height="220" fill="#fff4d6"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${1100 + i * 57}" y="300" width="57" height="40" fill="${i % 2 ? '#fff' : '#34c38f'}"/>`).join('')}
      <path d="M1400 230 l-24 70 h48 Z" fill="#e0a560"/><circle cx="1400" cy="220" r="30" fill="#ff9ec4"/><circle cx="1382" cy="196" r="20" fill="#ffffff"/><circle cx="1418" cy="196" r="20" fill="#9be7ff"/>
      ${janela(1130, 380, 140, 100)}<rect x="1300" y="400" width="80" height="140" rx="8" fill="#34c38f"/></g>`;
    // ESCOLA
    s += `<g><rect x="1560" y="260" width="480" height="280" fill="#ffe7a8"/><path d="M1540 270 L1800 170 L2060 270 Z" fill="#3fa7e0"/>
      <circle cx="1800" cy="222" r="22" fill="#fff"/><path d="M1800 222 v-14 M1800 222 l10 5" stroke="#1f2a44" stroke-width="4" stroke-linecap="round"/>
      ${janela(1600, 320, 90, 80)}${janela(1910, 320, 90, 80)}${janela(1600, 430, 90, 80)}${janela(1910, 430, 90, 80)}
      <rect x="1750" y="400" width="100" height="140" rx="10" fill="#e5484d"/><path d="M1800 400 v140" stroke="#b8323a" stroke-width="4"/>
      <rect x="2054" y="120" width="6" height="150" fill="#9aa4b8"/><path d="M2060 124 h60 l-12 18 12 18 h-60 Z" fill="#34c38f"/></g>`;
    // PARQUE
    s += `<g><rect x="2140" y="${chao - 20}" width="460" height="20" fill="#5cc583"/>
      ${arvore(2190, 460, 1.1)}${arvore(2540, 460, 1.2)}
      <ellipse cx="2365" cy="510" rx="90" ry="22" fill="#9be7ff" stroke="#cfd6e4" stroke-width="8"/>
      <rect x="2355" y="430" width="20" height="80" fill="#cfd6e4"/><path d="M2365 430 q-30 -40 -60 30 M2365 430 q30 -40 60 30" stroke="#9be7ff" stroke-width="6" fill="none"/>
      <path d="M2250 500 h70 M2250 486 h70" stroke="#a35cf0" stroke-width="8" stroke-linecap="round"/><path d="M2256 500 v20 M2314 500 v20" stroke="#5b3f7a" stroke-width="6"/>
      ${[2160, 2220, 2470, 2580].map(x => `<circle cx="${x}" cy="528" r="7" fill="#ff4f9a"/><circle cx="${x}" cy="528" r="3" fill="#ffc83d"/>`).join('')}</g>`;
    // SALÃO DE BELEZA
    s += `<g><rect x="2700" y="240" width="420" height="300" fill="#ffe0ef"/><path d="M2690 240 h440 v40 h-440 Z" fill="#ff4f9a"/>
      ${janela(2730, 330, 160, 120)}<rect x="2940" y="380" width="90" height="160" rx="45" fill="#a35cf0"/>
      <ellipse cx="3075" cy="345" rx="24" ry="32" fill="#bfe9ff" stroke="#ffc83d" stroke-width="6"/><path d="M3075 400 l-14 -14 a9 9 0 0 1 14 -10 a9 9 0 0 1 14 10 Z" fill="#ff4f9a"/></g>`;
    LUGARES.forEach(l => { s += placa(l.x, l.y, l.nome, '#1f2a44'); });
    // calçada e rua
    s += `<rect x="0" y="${chao}" width="3400" height="40" fill="#e6dfea"/><path d="M0 ${chao} h3400" stroke="#c9bfd0" stroke-width="4"/>
      <rect x="0" y="${chao + 40}" width="3400" height="120" fill="#4a4458"/>
      <path d="M0 ${chao + 100} h3400" stroke="#fff" stroke-width="6" stroke-dasharray="50 40"/>`;
    for (let x = 480; x < 3400; x += 540) s += `<rect x="${x}" y="380" width="8" height="160" fill="#5b3f7a"/><circle cx="${x + 4}" cy="376" r="14" fill="#fff6b0"/>`;
    return s;
  }

  window.ARTE = { CORES, CABELOS, CIMA, BAIXO, SAPATOS, ACESS, CARROS, LUGARES, boneco, carro, cidade, shade };
})();
