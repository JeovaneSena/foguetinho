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

  // ---------- BONECO ----------
  const CABELOS = ['Longo liso', 'Rabo de cavalo', 'Cacheado', 'Curtinho', 'Dois coques', 'Tranças'];
  const CIMA = ['Camiseta estrela', 'Blusa de babado', 'Jaqueta', 'Moletom', 'Vestido de festa'];
  const BAIXO = ['Saia', 'Calça', 'Shorts', 'Saia de tule'];
  const SAPATOS = ['Tênis', 'Sapatilha', 'Bota'];
  const ACESS = ['Nada', 'Laço', 'Coroa', 'Óculos', 'Bolsa', 'Fone', 'Tiara de flores'];

  function corpo(d) {
    const s = CORES.pele[d.pele], sd = shade(s, -0.18), ol = CORES.olhos[d.olhos];
    const pernas = `
      <path d="M74 205 L100 205 L97 290 L95 356 L80 356 L77 290 Z" fill="${s}"/>
      <path d="M100 205 L126 205 L123 290 L120 356 L105 356 L103 290 Z" fill="${s}"/>
      <path d="M100 205 L100 230" stroke="${sd}" stroke-width="2"/>`;
    const bracos = `
      <path d="M73 134 Q61 190 58 238" stroke="${s}" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M127 134 Q139 190 142 238" stroke="${s}" stroke-width="16" stroke-linecap="round" fill="none"/>
      <ellipse cx="57" cy="246" rx="9" ry="11" fill="${s}"/><ellipse cx="143" cy="246" rx="9" ry="11" fill="${s}"/>`;
    const tronco = `<path d="M70 128 Q100 118 130 128 L128 175 Q124 195 127 212 L73 212 Q76 195 72 175 Z" fill="${s}"/>`;
    const pescoco = `<rect x="90" y="96" width="20" height="36" rx="8" fill="${s}"/>
      <path d="M90 108 Q100 116 110 108 L110 100 L90 100 Z" fill="${sd}" opacity=".5"/>`;
    const olho = (cx, esq) => `
      <path d="M${cx - 9} 70 Q${cx} 61 ${cx + 9} 70 Q${cx} 76 ${cx - 9} 70 Z" fill="#fff"/>
      <circle cx="${cx}" cy="69.5" r="5" fill="${ol}"/><circle cx="${cx}" cy="69.5" r="2.4" fill="#1b1220"/>
      <circle cx="${cx + 1.6}" cy="67.8" r="1.4" fill="#fff"/>
      <path d="M${cx - 10} 70 Q${cx} 59.5 ${cx + 10} 69" stroke="#2a1a1a" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M${esq ? cx - 10 : cx + 10} 69 l${esq ? -3 : 3} -3" stroke="#2a1a1a" stroke-width="1.6" stroke-linecap="round"/>`;
    const sob = c => CORES.cabelo[d.corCabelo];
    const rosto = `
      <ellipse cx="66" cy="73" rx="6" ry="9" fill="${s}"/><ellipse cx="134" cy="73" rx="6" ry="9" fill="${s}"/>
      <ellipse cx="66" cy="73" rx="3" ry="5" fill="${sd}" opacity=".5"/><ellipse cx="134" cy="73" rx="3" ry="5" fill="${sd}" opacity=".5"/>
      <ellipse cx="100" cy="66" rx="34" ry="40" fill="${s}"/>
      <path d="M78 102 Q100 114 122 102 Q112 108 100 108 Q88 108 78 102 Z" fill="${sd}" opacity=".35"/>
      ${olho(88, true)}${olho(112, false)}
      <path d="M79 57 Q88 52 97 56" stroke="${shade(sob(), -0.1)}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M103 56 Q112 52 121 57" stroke="${shade(sob(), -0.1)}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M100 75 Q97 85 99.5 88 Q102 89 104 87" stroke="${sd}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <ellipse cx="79" cy="86" rx="7.5" ry="4.2" fill="#ff6f91" opacity=".28"/>
      <ellipse cx="121" cy="86" rx="7.5" ry="4.2" fill="#ff6f91" opacity=".28"/>
      <path d="M91 96 Q100 101 109 96 Q105 103 100 103 Q95 103 91 96 Z" fill="#d95f78"/>
      <path d="M92 96.5 Q100 99 108 96.5" stroke="#b04a62" stroke-width="1" fill="none"/>`;
    return { pernas, bracos, tronco, pescoco, rosto };
  }

  function cabelo(d) {
    const c = CORES.cabelo[d.corCabelo], cd = shade(c, -0.25), cl = shade(c, 0.3);
    const capa = `<path d="M65 70 Q60 24 100 22 Q140 24 135 70 Q132 50 122 42 Q108 52 86 46 Q72 50 65 70 Z" fill="${c}"/>
      <path d="M86 30 Q100 26 116 31" stroke="${cl}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`;
    const lisa = `<path d="M65 70 Q60 24 100 22 Q140 24 135 70 Q134 52 126 44 Q112 34 92 40 Q78 46 74 58 Q70 66 65 70 Z" fill="${c}"/>
      <path d="M80 34 Q96 26 118 32" stroke="${cl}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`;
    switch (d.cabelo) {
      case 0: return {
        tras: `<path d="M62 64 Q58 20 100 18 Q142 20 138 64 L146 190 Q122 202 100 196 Q78 202 54 190 Z" fill="${cd}"/>`,
        frente: lisa + `<path d="M66 64 Q62 110 60 150 L70 150 Q70 110 72 74 Z" fill="${c}"/>
          <path d="M134 64 Q138 110 140 150 L130 150 Q130 110 128 74 Z" fill="${c}"/>`
      };
      case 1: return {
        tras: `<path d="M118 28 Q160 30 158 80 Q156 130 140 168 Q150 120 136 80 Q130 52 112 40 Z" fill="${c}"/>
          <path d="M140 76 Q150 110 142 150" stroke="${cl}" stroke-width="3" fill="none" opacity=".6"/>`,
        frente: `<path d="M65 70 Q60 24 100 22 Q140 24 135 70 Q132 48 118 38 Q100 34 82 40 Q68 50 65 70 Z" fill="${c}"/>
          <path d="M80 34 Q100 26 120 34" stroke="${cl}" stroke-width="3" fill="none" opacity=".7"/>
          <ellipse cx="128" cy="34" rx="7" ry="9" fill="#ff4f9a" transform="rotate(30 128 34)"/>`
      };
      case 2: {
        let tras = '', fr = '';
        const pts = [[62, 40], [56, 66], [56, 94], [62, 120], [74, 140], [138, 40], [144, 66], [144, 94], [138, 120], [126, 140], [80, 20], [100, 14], [120, 20]];
        pts.forEach(([x, y]) => { tras += `<circle cx="${x}" cy="${y}" r="20" fill="${cd}"/>`; });
        [[72, 40], [86, 30], [100, 27], [114, 30], [128, 40]].forEach(([x, y]) => {
          fr += `<circle cx="${x}" cy="${y}" r="13" fill="${c}"/><path d="M${x - 5} ${y - 4} q5 -5 10 0" stroke="${cl}" stroke-width="2" fill="none" opacity=".7"/>`;
        });
        return { tras, frente: fr };
      }
      case 3: return { tras: '', frente: `<path d="M64 74 Q58 22 100 20 Q142 22 136 74 Q134 56 128 48 Q116 40 100 44 Q82 40 72 50 Q66 58 64 74 Z" fill="${c}"/>
          <path d="M70 46 Q90 30 110 38" stroke="${cl}" stroke-width="3" fill="none" opacity=".7"/>
          <path d="M64 64 L66 82 L70 80 L69 62 Z M136 64 L134 82 L130 80 L131 62 Z" fill="${c}"/>` };
      case 4: return {
        tras: `<circle cx="70" cy="28" r="17" fill="${cd}"/><circle cx="130" cy="28" r="17" fill="${cd}"/>
          <path d="M60 22 q10 -10 20 0 M120 22 q10 -10 20 0" stroke="${cl}" stroke-width="2.5" fill="none" opacity=".6"/>`,
        frente: capa
      };
      default: {
        const tranca = x => {
          let t = '';
          for (let i = 0; i < 6; i++) t += `<ellipse cx="${x}" cy="${100 + i * 16}" rx="9" ry="10" fill="${i % 2 ? c : cd}"/>`;
          return t + `<rect x="${x - 5}" y="194" width="10" height="7" rx="3" fill="#ffc83d"/>`;
        };
        return { tras: tranca(60) + tranca(140), frente: capa + `<path d="M66 64 Q62 80 60 96 L68 96 Z M134 64 Q138 80 140 96 L132 96 Z" fill="${c}"/>` };
      }
    }
  }

  const troncoRoupa = 'M65 126 Q82 121 89 123 Q100 136 111 123 Q118 121 135 126 L132 178 Q128 198 131 216 L69 216 Q72 198 68 178 Z';
  function cima(d) {
    const c = CORES.roupa[d.corCima], cd = shade(c, -0.18), cl = shade(c, 0.35);
    const mangaCurta = `<path d="M73 133 Q66 150 63 166" stroke="${c}" stroke-width="22" stroke-linecap="round" fill="none"/>
      <path d="M127 133 Q134 150 137 166" stroke="${c}" stroke-width="22" stroke-linecap="round" fill="none"/>`;
    const mangaLonga = `<path d="M73 133 Q61 190 58 232" stroke="${c}" stroke-width="20" stroke-linecap="round" fill="none"/>
      <path d="M127 133 Q139 190 142 232" stroke="${c}" stroke-width="20" stroke-linecap="round" fill="none"/>
      <path d="M50 228 L66 232" stroke="${cd}" stroke-width="7" stroke-linecap="round"/><path d="M134 232 L150 228" stroke="${cd}" stroke-width="7" stroke-linecap="round"/>`;
    const tronco = `<path d="${troncoRoupa}" fill="${c}"/><path d="M69 200 Q100 206 131 200 L131 216 L69 216 Z" fill="${cd}" opacity=".5"/>`;
    switch (d.cima) {
      case 0: return mangaCurta + tronco + `
        <path d="M100 148 l5.5 11 12 1.7 -8.7 8.5 2 12 -10.8 -5.7 -10.8 5.7 2 -12 -8.7 -8.5 12 -1.7 Z" fill="${c === '#ffc83d' ? '#ff4f9a' : '#ffc83d'}" stroke="#fff" stroke-width="2"/>`;
      case 1: {
        let bab = '';
        for (let x = 86; x <= 114; x += 7) bab += `<circle cx="${x}" cy="${128 + Math.abs(100 - x) * -0.15 + 4}" r="5" fill="${cl}"/>`;
        return `<circle cx="72" cy="138" r="15" fill="${c}"/><circle cx="128" cy="138" r="15" fill="${c}"/>
          <path d="M64 140 q8 6 16 0 M120 140 q8 6 16 0" stroke="${cd}" stroke-width="1.5" fill="none"/>` + tronco + bab +
          `<path d="M72 175 Q100 182 128 175" stroke="${cl}" stroke-width="5" fill="none"/>
           <path d="M100 185 l-7 -6 a4 4 0 0 1 7 -4 a4 4 0 0 1 7 4 Z" fill="#ff4f9a"/>`;
      }
      case 2: return mangaLonga + tronco + `
        <path d="M89 123 L100 140 L111 123 L108 216 L92 216 Z" fill="#fff"/>
        <path d="M100 140 L100 216" stroke="${cd}" stroke-width="2.5"/>
        <path d="M65 126 L89 123 L86 150 Z M135 126 L111 123 L114 150 Z" fill="${cd}"/>
        <path d="M74 186 h14 M112 186 h14" stroke="${cd}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="100" cy="160" r="2" fill="#ccc"/><circle cx="100" cy="180" r="2" fill="#ccc"/>`;
      case 3: return mangaLonga + `<path d="M80 124 Q100 112 120 124 Q114 134 100 134 Q86 134 80 124 Z" fill="${cd}"/>` + tronco + `
        <path d="M80 182 Q100 178 120 182 L118 206 L82 206 Z" fill="${cd}" opacity=".6"/>
        <path d="M95 132 L94 152 M105 132 L106 152" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="94" cy="153" r="2.4" fill="#fff"/><circle cx="106" cy="153" r="2.4" fill="#fff"/>`;
      default: { // vestido de festa (cobre a parte de baixo)
        let brilho = '';
        [[80, 240], [112, 255], [95, 280], [125, 290], [70, 285], [104, 230], [88, 305], [118, 312]].forEach(([x, y]) => {
          brilho += `<path d="M${x} ${y - 4} L${x + 1.2} ${y - 1.2} L${x + 4} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 4} L${x - 1.2} ${y + 1.2} L${x - 4} ${y} L${x - 1.2} ${y - 1.2} Z" fill="#fff" opacity=".9"/>`;
        });
        return `<path d="M76 126 L84 124 L90 130 Q100 138 110 130 L116 124 L124 126 L128 178 Q124 196 128 206 L72 206 Q76 196 72 178 Z" fill="${c}"/>
          <path d="M72 204 L128 204 L160 318 Q100 336 40 318 Z" fill="${c}"/>
          <path d="M72 204 L128 204 L150 300 Q100 316 50 300 Z" fill="${cl}" opacity=".35"/>
          <path d="M40 318 Q55 326 70 320 Q85 330 100 322 Q115 330 130 320 Q145 326 160 318" stroke="${cd}" stroke-width="3" fill="none"/>
          <path d="M72 200 Q100 210 128 200" stroke="#ffc83d" stroke-width="6" fill="none"/>
          <circle cx="100" cy="205" r="6" fill="#ffc83d"/><circle cx="100" cy="205" r="2.5" fill="#fff"/>` + brilho;
      }
    }
  }

  function baixo(d) {
    const c = CORES.roupa[d.corBaixo], cd = shade(c, -0.2), cl = shade(c, 0.3);
    const cos = `<rect x="69" y="202" width="62" height="10" rx="4" fill="${cd}"/>`;
    switch (d.baixo) {
      case 0: return `<path d="M70 204 L130 204 L144 272 Q100 284 56 272 Z" fill="${c}"/>
        <path d="M86 210 L80 276 M100 210 L100 280 M114 210 L120 276" stroke="${cd}" stroke-width="2"/>` + cos;
      case 1: return `<path d="M70 204 L101 204 L98 292 L97 352 L78 352 L76 292 Z" fill="${c}"/>
        <path d="M99 204 L130 204 L124 292 L122 352 L103 352 L102 292 Z" fill="${c}"/>
        <path d="M100 212 L100 236" stroke="${cd}" stroke-width="2"/>
        <path d="M78 344 h19 M103 344 h19" stroke="${cl}" stroke-width="3"/>` + cos;
      case 2: return `<path d="M70 204 L101 204 L100 254 L74 254 Z" fill="${c}"/>
        <path d="M99 204 L130 204 L126 254 L100 254 Z" fill="${c}"/>
        <path d="M74 250 h26 M100 250 h26" stroke="${cl}" stroke-width="3"/>` + cos;
      default: return `<path d="M70 204 L130 204 L156 330 Q100 344 44 330 Z" fill="${cl}" opacity=".85"/>
        <path d="M70 204 L130 204 L146 310 Q100 322 54 310 Z" fill="${c}" opacity=".85"/>
        <path d="M70 204 L130 204 L136 280 Q100 290 64 280 Z" fill="${c}"/>` + cos;
    }
  }

  function sapato(d) {
    const c = CORES.roupa[d.corSapato], cd = shade(c, -0.25);
    const pe = `<path d="M78 350 L96 350 L97 366 Q98 375 88 375 L71 375 Q65 373 69 366 Z" fill="${c}"/>
      <path d="M104 350 L122 350 L131 366 Q135 373 129 375 L112 375 Q102 375 103 366 Z" fill="${c}"/>`;
    switch (d.sapato) {
      case 0: return pe + `<path d="M68 370 L97 370 L97 376 L68 376 Z M103 370 L132 370 L132 376 L103 376 Z" fill="#fff"/>
        <path d="M84 356 l8 2 M84 362 l8 2 M108 358 l8 -2 M108 364 l8 -2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
      case 1: return pe + `<circle cx="84" cy="362" r="4" fill="${cd}"/><circle cx="116" cy="362" r="4" fill="${cd}"/>
        <path d="M78 362 l-4 -4 v8 Z M90 362 l4 -4 v8 Z M110 362 l-4 -4 v8 Z M122 362 l4 -4 v8 Z" fill="${cd}"/>`;
      default: return `<path d="M76 300 L98 300 L97 366 Q98 375 88 375 L71 375 Q65 373 70 364 L76 346 Z" fill="${c}"/>
        <path d="M102 300 L124 300 L124 346 L130 364 Q135 373 129 375 L112 375 Q102 375 103 366 Z" fill="${c}"/>
        <path d="M76 300 h22 M102 300 h22" stroke="${cd}" stroke-width="6"/>
        <path d="M68 372 h30 M102 372 h30" stroke="${cd}" stroke-width="4"/>`;
    }
  }

  function acessorio(d) {
    switch (d.acessorio) {
      case 1: return `<path d="M124 30 L108 20 L110 42 Z M124 30 L140 20 L138 42 Z" fill="#ff4f9a"/><circle cx="124" cy="31" r="5" fill="#e0307d"/>`;
      case 2: return `<path d="M76 34 L80 12 L90 26 L100 8 L110 26 L120 12 L124 34 Z" fill="#ffc83d" stroke="#e0a400" stroke-width="2"/>
        <circle cx="100" cy="24" r="3.5" fill="#e5484d"/><circle cx="85" cy="28" r="2.5" fill="#3fa7e0"/><circle cx="115" cy="28" r="2.5" fill="#3fa7e0"/>`;
      case 3: return `<rect x="76" y="60" width="23" height="19" rx="8" fill="#9be7ff" fill-opacity=".25" stroke="#ff4f9a" stroke-width="3"/>
        <rect x="101" y="60" width="23" height="19" rx="8" fill="#9be7ff" fill-opacity=".25" stroke="#ff4f9a" stroke-width="3"/>
        <path d="M99 68 h2 M76 66 L67 64 M124 66 L133 64" stroke="#ff4f9a" stroke-width="3"/>`;
      case 4: return `<path d="M128 130 L76 206" stroke="#ffc83d" stroke-width="3"/>
        <rect x="54" y="198" width="34" height="26" rx="7" fill="#ff4f9a"/><path d="M54 208 h34" stroke="#e0307d" stroke-width="2"/>
        <circle cx="71" cy="210" r="3" fill="#ffc83d"/>`;
      case 5: return `<path d="M64 70 Q62 12 100 12 Q138 12 136 70" stroke="#1f2a44" stroke-width="6" fill="none"/>
        <rect x="56" y="60" width="16" height="26" rx="7" fill="#a35cf0"/><rect x="128" y="60" width="16" height="26" rx="7" fill="#a35cf0"/>`;
      case 6: {
        let f = '';
        [[72, 40, '#ff4f9a'], [84, 30, '#ffc83d'], [100, 26, '#ffffff'], [116, 30, '#a35cf0'], [128, 40, '#ff4f9a']].forEach(([x, y, c]) => {
          f += `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-4" rx="3" ry="4.5" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="2.4" fill="#ffc83d"/></g>`;
        });
        return f;
      }
      default: return '';
    }
  }

  function boneco(d) {
    const c = corpo(d), h = cabelo(d);
    return h.tras + c.pernas + c.bracos + c.tronco + c.pescoco + sapato(d) + baixo(d) + cima(d) + c.rosto + h.frente + acessorio(d);
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
    const s = 0.5, id = uid('c');
    return `<clipPath id="${id}"><rect x="0" y="0" width="700" height="290"/></clipPath><g clip-path="url(#${id})">` +
      bonecos.map((b, i) => b ? `<g transform="translate(${BANCOS[i] - 9 - 100 * s} ${yCabeca - 66 * s}) scale(${s})">${b}</g>` : '').join('') + '</g>';
  }

  function carro(tipo, cor, bonecos) {
    const c = CORES.carro[cor], cd = shade(c, -0.22), cl = shade(c, 0.35), id = uid('m');
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
