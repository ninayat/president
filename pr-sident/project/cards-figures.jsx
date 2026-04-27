// Figures complètes — Dame + Valet pour les 4 directions
// + Aces manquants (Cœur, Carreau, Trèfle) pour les 4 directions

// ═══════════════════════════════════════════════
// DIRECTION 1 — SALON POP
// ═══════════════════════════════════════════════

function PopQueenOfHearts({ width = 240, height = 340 }) {
  return (
    <PopCard width={width} height={height}>
      <div style={{ position: 'absolute', top: 14, left: 16, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 900, color: POP.red }}>D</div>
        <div style={{ marginTop: 2 }}><Pip suit="coeur" size={13} color={POP.red} /></div>
      </div>
      <div style={{ position: 'absolute', bottom: 14, right: 16, textAlign: 'center', lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 900, color: POP.red }}>D</div>
        <div style={{ marginTop: 2 }}><Pip suit="coeur" size={13} color={POP.red} /></div>
      </div>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <rect x="38" y="38" width="164" height="264" fill="none" stroke={POP.ink} strokeWidth="1.5" />
        <rect x="42" y="42" width="156" height="256" fill={POP.paper} />
        {/* Robe */}
        <path d="M 45 302 L 50 240 Q 60 210 90 205 L 150 205 Q 180 210 190 240 L 195 302 Z" fill={POP.red} stroke={POP.ink} strokeWidth="1.5" />
        {/* Tablier central */}
        <path d="M 100 205 Q 120 250 140 205 Z" fill={POP.cream} />
        {/* Dentelle bas robe */}
        {[55,70,85,100,115,130,145,160,175,190].map((x,i)=>(
          <path key={i} d={`M ${x} 302 Q ${x+6} 290 ${x+12} 302`} fill="none" stroke={POP.cream} strokeWidth="1.2" />
        ))}
        {/* Buste */}
        <rect x="100" y="188" width="40" height="20" fill="#e8c3a8" stroke={POP.ink} strokeWidth="1.5" />
        {/* Tête */}
        <ellipse cx="120" cy="155" rx="36" ry="42" fill="#f0cfb2" stroke={POP.ink} strokeWidth="1.5" />
        {/* Chevelure élaborée */}
        <path d="M 84 135 Q 75 110 80 95 Q 90 75 105 78 Q 95 100 100 120 Q 108 105 115 100 Q 122 95 130 100 Q 136 105 140 120 Q 145 100 135 78 Q 150 75 160 95 Q 165 110 156 135 Q 148 118 140 120 Q 128 108 120 112 Q 112 108 100 120 Q 92 118 84 135 Z" fill={POP.ink} />
        {/* Boucles de chaque côté */}
        <ellipse cx="82" cy="150" rx="8" ry="18" fill={POP.ink} />
        <ellipse cx="158" cy="150" rx="8" ry="18" fill={POP.ink} />
        {/* Couronne fine */}
        <path d="M 90 100 L 95 85 L 106 97 L 120 82 L 134 97 L 145 85 L 150 100 Z" fill={POP.gold} stroke={POP.ink} strokeWidth="1.2" />
        <rect x="90" y="100" width="60" height="5" fill={POP.gold} stroke={POP.ink} strokeWidth="1.2" />
        <circle cx="106" cy="97" r="2" fill={POP.red} stroke={POP.ink} strokeWidth="1" />
        <circle cx="134" cy="97" r="2" fill={POP.red} stroke={POP.ink} strokeWidth="1" />
        <circle cx="120" cy="84" r="2.5" fill={POP.red} stroke={POP.ink} strokeWidth="1" />
        {/* Yeux */}
        <circle cx="109" cy="153" r="2" fill={POP.ink} />
        <circle cx="131" cy="153" r="2" fill={POP.ink} />
        {/* Lèvres */}
        <path d="M 112 170 Q 120 175 128 170 Q 124 177 120 177 Q 116 177 112 170 Z" fill={POP.red} />
        {/* Joues roses */}
        <ellipse cx="100" cy="165" rx="7" ry="4" fill={POP.red} opacity="0.25" />
        <ellipse cx="140" cy="165" rx="7" ry="4" fill={POP.red} opacity="0.25" />
        {/* Éventail */}
        <g transform="translate(155 240)">
          {[-40,-25,-10,5,20].map((a,i)=>(
            <path key={i} d={`M 0 0 L ${Math.cos((a+90)*Math.PI/180)*35} ${Math.sin((a+90)*Math.PI/180)*35}`} stroke={POP.gold} strokeWidth="1.2" />
          ))}
          <path d="M -14 -30 Q 0 -36 14 -30" fill="none" stroke={POP.gold} strokeWidth="1" />
        </g>
        {/* Fleur sur la robe */}
        {[60,70,80].map((a,i)=>(
          <g key={i} transform={`translate(${90+i*20} 250)`}>
            <circle r="4" fill={POP.cream} />
            <circle r="2" fill={POP.gold} />
          </g>
        ))}
        {/* Banner */}
        <rect x="42" y="272" width="156" height="26" fill={POP.blue} />
        <text x="120" y="290" textAnchor="middle" fontFamily="Fraunces" fontWeight="900" fontSize="12" fill={POP.cream} letterSpacing="2">VICE-PRÉSIDENTE</text>
      </svg>
    </PopCard>
  );
}

function PopJackOfSpades({ width = 240, height = 340 }) {
  return (
    <PopCard width={width} height={height}>
      <div style={{ position: 'absolute', top: 14, left: 16, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 900, color: POP.ink }}>V</div>
        <div style={{ marginTop: 2 }}><Pip suit="pique" size={13} color={POP.ink} /></div>
      </div>
      <div style={{ position: 'absolute', bottom: 14, right: 16, textAlign: 'center', lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 900, color: POP.ink }}>V</div>
        <div style={{ marginTop: 2 }}><Pip suit="pique" size={13} color={POP.ink} /></div>
      </div>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <rect x="38" y="38" width="164" height="264" fill="none" stroke={POP.ink} strokeWidth="1.5" />
        <rect x="42" y="42" width="156" height="256" fill={POP.paper} />
        {/* Costume */}
        <path d="M 50 302 L 55 248 Q 60 215 88 205 L 152 205 Q 180 215 185 248 L 190 302 Z" fill={POP.blue} stroke={POP.ink} strokeWidth="1.5" />
        {/* Ceinture */}
        <rect x="85" y="230" width="70" height="10" fill={POP.gold} stroke={POP.ink} strokeWidth="1" />
        {/* Cravate */}
        <path d="M 115 200 L 125 200 L 130 230 L 120 238 L 110 230 Z" fill={POP.red} stroke={POP.ink} strokeWidth="1" />
        {/* Cou */}
        <rect x="108" y="190" width="24" height="18" fill="#e8c3a8" stroke={POP.ink} strokeWidth="1.5" />
        {/* Tête — plus jeune que le Roi */}
        <ellipse cx="120" cy="152" rx="34" ry="40" fill="#f0cfb2" stroke={POP.ink} strokeWidth="1.5" />
        {/* Cheveux courts */}
        <path d="M 86 138 Q 82 115 90 100 Q 100 85 120 84 Q 140 85 150 100 Q 158 115 154 138 Q 148 120 135 115 Q 120 112 105 115 Q 92 120 86 138 Z" fill={POP.ink} />
        {/* Chapeau à plume de valet */}
        <path d="M 88 108 L 152 108 L 152 120 L 88 120 Z" fill={POP.ink} />
        <path d="M 140 108 Q 150 90 165 75 Q 158 88 162 100 Q 156 92 148 108 Z" fill={POP.red} />
        {/* Yeux */}
        <circle cx="108" cy="150" r="2.2" fill={POP.ink} />
        <circle cx="132" cy="150" r="2.2" fill={POP.ink} />
        {/* Pas de barbe — jeune */}
        <path d="M 112 170 Q 120 174 128 170" stroke={POP.ink} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* Épée */}
        <line x1="170" y1="180" x2="190" y2="290" stroke={POP.ink} strokeWidth="2.5" />
        <path d="M 165 182 L 178 178 L 174 192 Z" fill={POP.gold} stroke={POP.ink} strokeWidth="1" />
        {/* Banner */}
        <rect x="42" y="272" width="156" height="26" fill={POP.ink} />
        <text x="120" y="290" textAnchor="middle" fontFamily="Fraunces" fontWeight="900" fontSize="13" fill={POP.cream} letterSpacing="2">LE VALET</text>
      </svg>
    </PopCard>
  );
}

// Aces helper — Pop direction
function PopAce({ suit, width = 240, height = 340 }) {
  const red = suit === 'coeur' || suit === 'carreau';
  const color = red ? POP.red : POP.ink;
  const labels = { coeur: 'AS DE CŒUR', carreau: 'AS DE CARREAU', trefle: 'AS DE TRÈFLE', pique: 'AS DE PIQUE' };
  return (
    <PopCard width={width} height={height}>
      <div style={{ position: 'absolute', top: 14, left: 16, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 900, color }}>A</div>
        <div style={{ marginTop: 2 }}><Pip suit={suit} size={14} color={color} /></div>
      </div>
      <div style={{ position: 'absolute', bottom: 14, right: 16, textAlign: 'center', lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 900, color }}>A</div>
        <div style={{ marginTop: 2 }}><Pip suit={suit} size={14} color={color} /></div>
      </div>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* Sunburst */}
        <g transform="translate(120 170)" opacity="0.9">
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d="M0 -130 L 8 -70 L -8 -70 Z" fill={red ? POP.blue : POP.red} transform={`rotate(${i * 30})`} />
          ))}
        </g>
        {/* Big pip */}
        <g transform="translate(120 160) scale(1.4)">
          <Pip suit={suit} size={78} color={color} />
        </g>
        {/* Banner */}
        <rect x="30" y="230" width="180" height="34" fill={POP.blue} />
        <polygon points="30,230 20,247 30,264" fill={POP.blue} />
        <polygon points="210,230 220,247 210,264" fill={POP.blue} />
        <text x="120" y="253" textAnchor="middle" fontFamily="Fraunces" fontWeight="900" fontSize="15" fill={POP.cream} letterSpacing="3">{labels[suit]}</text>
      </svg>
    </PopCard>
  );
}

function PopAceOfHearts({ width, height }) { return <PopAce suit="coeur" width={width} height={height} />; }
function PopAceOfDiamonds({ width, height }) { return <PopAce suit="carreau" width={width} height={height} />; }
function PopAceOfClubs({ width, height }) { return <PopAce suit="trefle" width={width} height={height} />; }

// ═══════════════════════════════════════════════
// DIRECTION 2 — FEUTRE CASINO
// ═══════════════════════════════════════════════

function FeutreQueenOfHearts({ width = 240, height = 340 }) {
  return (
    <FeutreCard width={width} height={height}>
      <div style={{ position: 'absolute', top: 12, left: 14, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 900, color: FEUTRE.red }}>D</div>
        <div style={{ marginTop: 2 }}><Pip suit="coeur" size={13} color={FEUTRE.red} /></div>
      </div>
      <div style={{ position: 'absolute', bottom: 12, right: 14, textAlign: 'center', lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 900, color: FEUTRE.red }}>D</div>
        <div style={{ marginTop: 2 }}><Pip suit="coeur" size={13} color={FEUTRE.red} /></div>
      </div>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* Oval medallion */}
        <ellipse cx="120" cy="170" rx="82" ry="120" fill={FEUTRE.felt} />
        <ellipse cx="120" cy="170" rx="82" ry="120" fill="none" stroke={FEUTRE.gold} strokeWidth="1.2" />
        <ellipse cx="120" cy="170" rx="76" ry="114" fill="none" stroke={FEUTRE.gold} strokeWidth="0.5" />
        {/* Robe / buste */}
        <path d="M 72 280 L 72 248 Q 74 220 100 212 L 140 212 Q 166 220 168 248 L 168 280 Z" fill={FEUTRE.gold} />
        {/* Corsage floral */}
        <circle cx="120" cy="232" r="6" fill={FEUTRE.red} stroke={FEUTRE.felt} strokeWidth="1" />
        <circle cx="110" cy="225" r="4" fill={FEUTRE.red} stroke={FEUTRE.felt} strokeWidth="0.8" />
        <circle cx="130" cy="225" r="4" fill={FEUTRE.red} stroke={FEUTRE.felt} strokeWidth="0.8" />
        {/* Cou */}
        <rect x="110" y="198" width="20" height="16" fill={FEUTRE.gold} />
        {/* Tête — profil féminin gracieux */}
        <ellipse cx="120" cy="160" rx="30" ry="36" fill={FEUTRE.gold} />
        {/* Chevelure coiffée */}
        <path d="M 90 155 Q 86 130 95 110 Q 106 92 120 90 Q 135 90 145 105 Q 155 120 152 142 Q 140 128 135 128 Q 125 124 120 126 Q 115 124 105 128 Q 100 128 90 142 Q 88 148 90 155 Z" fill={FEUTRE.ink} />
        {/* Couronne fine */}
        <path d="M 95 104 L 100 88 L 110 100 L 120 85 L 130 100 L 140 88 L 145 104 Z" fill={FEUTRE.gold} stroke={FEUTRE.ink} strokeWidth="0.8" />
        <rect x="95" y="104" width="50" height="5" fill={FEUTRE.gold} />
        <circle cx="110" cy="100" r="2" fill={FEUTRE.red} />
        <circle cx="130" cy="100" r="2" fill={FEUTRE.red} />
        <circle cx="120" cy="87" r="2.5" fill={FEUTRE.red} />
        {/* Yeux */}
        <circle cx="112" cy="155" r="1.8" fill={FEUTRE.felt} />
        <circle cx="128" cy="155" r="1.8" fill={FEUTRE.felt} />
        {/* Bouche */}
        <path d="M 113 170 Q 120 174 127 170 Q 123 177 120 177 Q 117 177 113 170 Z" fill={FEUTRE.red} />
        {/* Décor coins */}
        <g fill={FEUTRE.gold}>
          {[55,185].map(x => [120,150,220].map((y,i) => <circle key={x+''+y} cx={x} cy={y} r="1.5" />))}
        </g>
        {/* Bottom tag */}
        <rect x="60" y="300" width="120" height="18" fill={FEUTRE.red} />
        <text x="120" y="312" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="9" fill={FEUTRE.cream} letterSpacing="3">LA DAME</text>
      </svg>
    </FeutreCard>
  );
}

function FeutreJackOfSpades({ width = 240, height = 340 }) {
  return (
    <FeutreCard width={width} height={height}>
      <div style={{ position: 'absolute', top: 12, left: 14, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 900, color: FEUTRE.ink }}>V</div>
        <div style={{ marginTop: 2 }}><Pip suit="pique" size={13} color={FEUTRE.ink} /></div>
      </div>
      <div style={{ position: 'absolute', bottom: 12, right: 14, textAlign: 'center', lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 900, color: FEUTRE.ink }}>V</div>
        <div style={{ marginTop: 2 }}><Pip suit="pique" size={13} color={FEUTRE.ink} /></div>
      </div>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <ellipse cx="120" cy="170" rx="82" ry="120" fill={FEUTRE.felt} />
        <ellipse cx="120" cy="170" rx="82" ry="120" fill="none" stroke={FEUTRE.gold} strokeWidth="1.2" />
        <ellipse cx="120" cy="170" rx="76" ry="114" fill="none" stroke={FEUTRE.gold} strokeWidth="0.5" />
        {/* Corps — tunique diagonale */}
        <path d="M 72 280 L 78 248 Q 84 215 104 208 L 144 208 Q 164 215 168 248 L 168 280 Z" fill={FEUTRE.gold} />
        {/* Sash diagonal */}
        <path d="M 96 210 L 144 260" stroke={FEUTRE.red} strokeWidth="6" />
        {/* Cou */}
        <rect x="110" y="196" width="20" height="14" fill={FEUTRE.gold} />
        {/* Tête jeune */}
        <ellipse cx="120" cy="155" rx="29" ry="36" fill={FEUTRE.gold} />
        {/* Cheveux + chapeau */}
        <path d="M 91 140 Q 90 118 100 105 Q 112 90 120 88 Q 128 90 140 105 Q 150 118 149 140 Q 140 122 120 120 Q 100 122 91 140 Z" fill={FEUTRE.ink} />
        <path d="M 88 122 L 152 122 L 152 134 L 88 134 Z" fill={FEUTRE.ink} />
        {/* Plume */}
        <path d="M 148 122 Q 165 105 178 90 Q 168 108 170 120 Q 162 110 148 122 Z" fill={FEUTRE.cream} />
        {/* Yeux */}
        <circle cx="110" cy="152" r="2" fill={FEUTRE.felt} />
        <circle cx="130" cy="152" r="2" fill={FEUTRE.felt} />
        {/* Bouche */}
        <path d="M 113 168 Q 120 172 127 168" stroke={FEUTRE.felt} strokeWidth="1.2" fill="none" />
        {/* Épée */}
        <line x1="162" y1="185" x2="180" y2="278" stroke={FEUTRE.gold} strokeWidth="2" />
        <rect x="155" y="183" width="14" height="4" fill={FEUTRE.gold} transform="rotate(-20 162 185)" />
        {/* Bottom tag */}
        <rect x="60" y="300" width="120" height="18" fill={FEUTRE.gold} />
        <text x="120" y="312" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="9" fill={FEUTRE.felt} letterSpacing="3">LE VALET</text>
      </svg>
    </FeutreCard>
  );
}

function FeutreAce({ suit, width = 240, height = 340 }) {
  const red = suit === 'coeur' || suit === 'carreau';
  const labels = { coeur: 'AS · CŒUR', carreau: 'AS · CARREAU', trefle: 'AS · TRÈFLE', pique: 'AS · PIQUE' };
  return (
    <FeutreCard width={width} height={height}>
      <div style={{ position: 'absolute', top: 12, left: 14, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 30, fontWeight: 900, color: red ? FEUTRE.red : FEUTRE.ink }}>A</div>
        <div style={{ marginTop: 2 }}><Pip suit={suit} size={14} color={red ? FEUTRE.red : FEUTRE.ink} /></div>
      </div>
      <div style={{ position: 'absolute', bottom: 12, right: 14, textAlign: 'center', lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 30, fontWeight: 900, color: red ? FEUTRE.red : FEUTRE.ink }}>A</div>
        <div style={{ marginTop: 2 }}><Pip suit={suit} size={14} color={red ? FEUTRE.red : FEUTRE.ink} /></div>
      </div>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <circle cx="120" cy="170" r="92" fill={FEUTRE.felt} />
        <circle cx="120" cy="170" r="92" fill="none" stroke={FEUTRE.gold} strokeWidth="1.5" />
        <circle cx="120" cy="170" r="86" fill="none" stroke={FEUTRE.gold} strokeWidth="0.5" />
        <g transform="translate(120 163) scale(1.5)">
          <Pip suit={suit} size={60} color={red ? FEUTRE.red : FEUTRE.cream} />
        </g>
        <rect x="66" y="298" width="108" height="20" fill={FEUTRE.ink} />
        <text x="120" y="312" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="10" fill={FEUTRE.gold} letterSpacing="4">{labels[suit]}</text>
      </svg>
    </FeutreCard>
  );
}

function FeutreAceOfHearts({ width, height }) { return <FeutreAce suit="coeur" width={width} height={height} />; }
function FeutreAceOfDiamonds({ width, height }) { return <FeutreAce suit="carreau" width={width} height={height} />; }
function FeutreAceOfClubs({ width, height }) { return <FeutreAce suit="trefle" width={width} height={height} />; }

// ═══════════════════════════════════════════════
// DIRECTION 3 — RISOGRAPHIE
// ═══════════════════════════════════════════════

function RisoQueenOfHearts({ width = 240, height = 340 }) {
  return (
    <RisoCard width={width} height={height}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="risoQGrain" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill={RISO.ink} opacity="0.12" />
          </pattern>
        </defs>
        {/* Background colour block */}
        <rect x="0" y="0" width="240" height="340" fill={RISO.paper} />
        <rect x="28" y="48" width="184" height="244" fill={RISO.pink} opacity="0.85" />
        {/* Geometric head */}
        <circle cx="120" cy="148" r="52" fill={RISO.paper} stroke={RISO.ink} strokeWidth="2.5" />
        {/* Elaborate geometric hair */}
        <path d="M 68 130 Q 68 90 90 75 L 120 68 L 150 75 Q 172 90 172 130 L 162 118 Q 148 100 120 96 Q 92 100 78 118 Z" fill={RISO.ink} />
        {/* Side curls */}
        <ellipse cx="70" cy="148" rx="9" ry="22" fill={RISO.ink} />
        <ellipse cx="170" cy="148" rx="9" ry="22" fill={RISO.ink} />
        {/* Crown — series of triangles */}
        <g>
          <polygon points="82,90 92,65 102,90" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2" />
          <polygon points="110,90 120,62 130,90" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2" />
          <polygon points="138,90 148,65 158,90" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2" />
          <rect x="80" y="90" width="80" height="8" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2" />
          <circle cx="92" cy="69" r="3.5" fill={RISO.paper} stroke={RISO.ink} strokeWidth="2" />
          <circle cx="120" cy="65" r="3.5" fill={RISO.paper} stroke={RISO.ink} strokeWidth="2" />
          <circle cx="148" cy="69" r="3.5" fill={RISO.paper} stroke={RISO.ink} strokeWidth="2" />
        </g>
        {/* Eyes — rounder */}
        <circle cx="106" cy="146" r="5" fill={RISO.ink} />
        <circle cx="134" cy="146" r="5" fill={RISO.ink} />
        <circle cx="107" cy="144" r="1.5" fill={RISO.paper} />
        <circle cx="135" cy="144" r="1.5" fill={RISO.paper} />
        {/* Lips */}
        <path d="M 108 168 Q 120 175 132 168 Q 126 180 120 180 Q 114 180 108 168 Z" fill={RISO.pink} stroke={RISO.ink} strokeWidth="1.5" />
        {/* Joues */}
        <ellipse cx="96" cy="162" rx="9" ry="6" fill={RISO.pink} opacity="0.5" />
        <ellipse cx="144" cy="162" rx="9" ry="6" fill={RISO.pink} opacity="0.5" />
        {/* Dress - trapeze shape */}
        <rect x="62" y="218" width="116" height="72" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2.5" />
        <path d="M 80 218 L 60 290 L 180 290 L 160 218 Z" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2.5" />
        {/* Collar heart */}
        <g transform="translate(120 205) scale(0.2)">
          <path d="M0 35 C -28 15 -40 0 -40 -18 C -40 -32 -28 -40 -18 -40 C -10 -40 -4 -34 0 -28 C 4 -34 10 -40 18 -40 C 28 -40 40 -32 40 -18 C 40 0 28 15 0 35 Z" fill={RISO.pink} stroke={RISO.ink} strokeWidth="5" />
        </g>
        {/* Decorative dots on dress */}
        {[[100,245],[120,252],[140,245],[110,268],[130,268]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="4" fill={RISO.paper} stroke={RISO.ink} strokeWidth="1.5" />
        ))}
        {/* Corners */}
        <text x="22" y="40" fontFamily="Archivo Black" fontSize="28" fill={RISO.ink}>D</text>
        <g transform="translate(24 48)"><Pip suit="coeur" size={13} color={RISO.pink} /></g>
        <g transform="translate(240 340) rotate(180)">
          <text x="22" y="40" fontFamily="Archivo Black" fontSize="28" fill={RISO.ink}>D</text>
          <g transform="translate(24 48)"><Pip suit="coeur" size={13} color={RISO.pink} /></g>
        </g>
        {/* Tag */}
        <rect x="28" y="296" width="184" height="20" fill={RISO.ink} />
        <text x="120" y="310" textAnchor="middle" fontFamily="Archivo Black" fontSize="11" fill={RISO.paper} letterSpacing="3">VICE-PRÉSIDENTE · DAME</text>
        <rect width="240" height="340" fill="url(#risoQGrain)" />
      </svg>
    </RisoCard>
  );
}

function RisoJackOfSpades({ width = 240, height = 340 }) {
  return (
    <RisoCard width={width} height={height}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="risoJGrain" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill={RISO.ink} opacity="0.12" />
          </pattern>
        </defs>
        <rect width="240" height="340" fill={RISO.paper} />
        <rect x="28" y="48" width="184" height="244" fill={RISO.mint} />
        {/* Head */}
        <circle cx="120" cy="145" r="50" fill={RISO.paper} stroke={RISO.ink} strokeWidth="2.5" />
        {/* Hair / chapeau */}
        <path d="M 70 128 Q 70 95 94 78 L 120 70 L 146 78 Q 170 95 170 128 L 158 114 Q 140 98 120 95 Q 100 98 82 114 Z" fill={RISO.ink} />
        {/* Bonnet droit */}
        <rect x="70" y="102" width="100" height="14" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2" />
        <rect x="70" y="100" width="100" height="6" fill={RISO.ink} />
        {/* Plume droite */}
        <path d="M 165 106 Q 185 88 200 72 Q 190 90 193 104 Q 182 94 165 106 Z" fill={RISO.ink} />
        {/* Eyes */}
        <circle cx="106" cy="145" r="4.5" fill={RISO.ink} />
        <circle cx="134" cy="145" r="4.5" fill={RISO.ink} />
        <circle cx="107" cy="143" r="1.3" fill={RISO.paper} />
        <circle cx="135" cy="143" r="1.3" fill={RISO.paper} />
        {/* Mouth */}
        <path d="M 111 163 Q 120 168 129 163" stroke={RISO.ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Corps */}
        <rect x="70" y="208" width="100" height="72" fill={RISO.ink} stroke={RISO.ink} strokeWidth="2.5" />
        {/* Sash diagonal */}
        <path d="M 70 208 L 170 280" stroke={RISO.blue} strokeWidth="8" />
        <path d="M 70 280 L 170 208" stroke={RISO.pink} strokeWidth="4" opacity="0.7" />
        {/* Sword simple */}
        <line x1="172" y1="178" x2="195" y2="290" stroke={RISO.ink} strokeWidth="4" />
        <rect x="162" y="176" width="20" height="5" fill={RISO.ink} transform="rotate(-15 172 178)" />
        {/* Corners */}
        <text x="22" y="40" fontFamily="Archivo Black" fontSize="28" fill={RISO.ink}>V</text>
        <g transform="translate(24 48)"><Pip suit="pique" size={13} color={RISO.ink} /></g>
        <g transform="translate(240 340) rotate(180)">
          <text x="22" y="40" fontFamily="Archivo Black" fontSize="28" fill={RISO.ink}>V</text>
          <g transform="translate(24 48)"><Pip suit="pique" size={13} color={RISO.ink} /></g>
        </g>
        {/* Tag */}
        <rect x="28" y="296" width="184" height="20" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2.5" />
        <text x="120" y="310" textAnchor="middle" fontFamily="Archivo Black" fontSize="11" fill={RISO.paper} letterSpacing="3">LE VALET · JACK</text>
        <rect width="240" height="340" fill="url(#risoJGrain)" />
      </svg>
    </RisoCard>
  );
}

function RisoAce({ suit, width = 240, height = 340 }) {
  const red = suit === 'coeur' || suit === 'carreau';
  const labels = { coeur: 'ACE · AS · CŒUR', carreau: 'ACE · AS · CARREAU', trefle: 'ACE · AS · TRÈFLE', pique: 'ACE · AS · PIQUE' };
  const bgColor = red ? RISO.pink : RISO.blue;
  return (
    <RisoCard width={width} height={height}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs><pattern id={`risoAGrain${suit}`} width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.7" fill={RISO.ink} opacity="0.12" /></pattern></defs>
        <rect x="0" y="0" width="240" height="340" fill={bgColor} opacity="0.85" />
        <rect x="0" y="0" width="240" height="340" fill={RISO.paper} opacity="0.4" style={{ mixBlendMode: 'multiply' }} />
        {/* Big pip */}
        <g transform="translate(120 158)">
          <Pip suit={suit} size={120} color={RISO.paper} />
        </g>
        {/* Corners */}
        <text x="22" y="40" fontFamily="Archivo Black" fontSize="36" fill={RISO.ink}>A</text>
        <g transform="translate(24 52)"><Pip suit={suit} size={14} color={RISO.ink} /></g>
        <g transform="translate(240 340) rotate(180)">
          <text x="22" y="40" fontFamily="Archivo Black" fontSize="36" fill={RISO.ink}>A</text>
          <g transform="translate(24 52)"><Pip suit={suit} size={14} color={RISO.ink} /></g>
        </g>
        <rect x="24" y="262" width="192" height="40" fill={RISO.ink} />
        <text x="120" y="280" textAnchor="middle" fontFamily="Archivo Black" fontSize="12" fill={RISO.paper} letterSpacing="2">{labels[suit].split('·')[0]}·</text>
        <text x="120" y="295" textAnchor="middle" fontFamily="Space Grotesk" fontSize="9" fill={bgColor} letterSpacing="4">{labels[suit].split('·').slice(1).join('·')}</text>
        <rect width="240" height="340" fill={`url(#risoAGrain${suit})`} />
      </svg>
    </RisoCard>
  );
}

function RisoAceOfHearts({ width, height }) { return <RisoAce suit="coeur" width={width} height={height} />; }
function RisoAceOfDiamonds({ width, height }) { return <RisoAce suit="carreau" width={width} height={height} />; }
function RisoAceOfClubs({ width, height }) { return <RisoAce suit="trefle" width={width} height={height} />; }

// ═══════════════════════════════════════════════
// DIRECTION 4 — ART DÉCO MODERNE
// ═══════════════════════════════════════════════

function DecoQueenOfHearts({ width = 240, height = 340 }) {
  return (
    <DecoCard width={width} height={height}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <rect x="10" y="10" width="220" height="320" fill="none" stroke={DECO.gold} strokeWidth="0.8" />
        <rect x="14" y="14" width="212" height="312" fill="none" stroke={DECO.gold} strokeWidth="0.4" />
        <rect x="30" y="46" width="180" height="230" fill={DECO.noir} />
        {/* Sunburst éventail */}
        <g transform="translate(120 140)" opacity="0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={i} x1="0" y1="0" x2="0" y2="-88" stroke={DECO.gold} strokeWidth="0.5" transform={`rotate(${i * 22.5})`} />
          ))}
          <circle r="48" fill={DECO.noir} stroke={DECO.gold} strokeWidth="0.8" />
        </g>
        {/* Couronne fine art déco */}
        <g>
          <path d="M 88 98 L 92 78 L 104 94 L 116 72 L 120 92 L 124 72 L 136 94 L 148 78 L 152 98 Z" fill={DECO.gold} stroke={DECO.ink} strokeWidth="0.6" />
          <rect x="88" y="98" width="64" height="5" fill={DECO.gold} />
          <circle cx="104" cy="94" r="2.5" fill={DECO.red} />
          <circle cx="136" cy="94" r="2.5" fill={DECO.red} />
          <circle cx="120" cy="74" r="3" fill={DECO.goldLight} />
        </g>
        {/* Chevelure art déco — vagues géométriques */}
        <path d="M 90 125 Q 86 108 92 100 L 92 104 Q 97 116 104 118 Q 110 116 112 110 Q 116 118 120 120 Q 124 118 128 110 Q 130 116 136 118 Q 143 116 148 104 L 148 100 Q 154 108 150 125 Q 140 108 130 112 Q 126 110 120 112 Q 114 110 110 112 Q 100 108 90 125 Z" fill={DECO.gold} />
        {/* Boucles côtés */}
        <path d="M 88 125 Q 78 138 80 152 Q 82 165 90 168" fill="none" stroke={DECO.gold} strokeWidth="3" strokeLinecap="round" />
        <path d="M 152 125 Q 162 138 160 152 Q 158 165 150 168" fill="none" stroke={DECO.gold} strokeWidth="3" strokeLinecap="round" />
        {/* Visage */}
        <ellipse cx="120" cy="140" rx="28" ry="34" fill={DECO.paper} />
        {/* Yeux en amande — style déco */}
        <path d="M 105 136 Q 111 132 117 136 Q 111 140 105 136 Z" fill={DECO.ink} />
        <path d="M 123 136 Q 129 132 135 136 Q 129 140 123 136 Z" fill={DECO.ink} />
        {/* Nez minimal */}
        <path d="M 120 146 Q 118 152 121 154 Q 122 154 123 152 Q 126 148 120 146 Z" fill="none" stroke={DECO.ink} strokeWidth="0.8" />
        {/* Lèvres stylisées */}
        <path d="M 110 162 Q 115 158 120 162 Q 125 158 130 162 Q 125 168 120 167 Q 115 168 110 162 Z" fill={DECO.red} />
        {/* Écharpe / robe linocut */}
        <path d="M 64 276 L 70 245 Q 78 215 98 206 L 142 206 Q 162 215 170 245 L 176 276 Z" fill={DECO.gold} stroke={DECO.ink} strokeWidth="0.8" />
        {/* Motif géométrique robe */}
        <path d="M 88 220 L 152 220" stroke={DECO.ink} strokeWidth="0.6" />
        <path d="M 80 234 L 160 234" stroke={DECO.ink} strokeWidth="0.6" />
        {[97,112,128,143].map((x,i)=>(
          <path key={i} d={`M ${x} 220 L ${x-4} 234`} stroke={DECO.ink} strokeWidth="0.6" />
        ))}
        {/* Cœur médaillon */}
        <g transform="translate(120 255) scale(0.18)">
          <path d="M0 38 C -30 18 -42 3 -42 -15 C -42 -30 -30 -38 -18 -38 C -10 -38 -4 -32 0 -26 C 4 -32 10 -38 18 -38 C 30 -38 42 -30 42 -15 C 42 3 30 18 0 38 Z" fill={DECO.red} stroke={DECO.ink} strokeWidth="4" />
        </g>
        {/* Corners */}
        <text x="22" y="42" fontFamily="Bodoni Moda" fontWeight="900" fontStyle="italic" fontSize="28" fill={DECO.red}>D</text>
        <g transform="translate(24 52)"><Pip suit="coeur" size={12} color={DECO.red} /></g>
        <g transform="translate(240 340) rotate(180)">
          <text x="22" y="42" fontFamily="Bodoni Moda" fontWeight="900" fontStyle="italic" fontSize="28" fill={DECO.red}>D</text>
          <g transform="translate(24 52)"><Pip suit="coeur" size={12} color={DECO.red} /></g>
        </g>
        {/* Tag */}
        <text x="120" y="300" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={DECO.ink} letterSpacing="4">— LA DAME —</text>
        <text x="120" y="314" textAnchor="middle" fontFamily="Bodoni Moda" fontStyle="italic" fontSize="10" fill={DECO.ink}>dame de cœur</text>
      </svg>
    </DecoCard>
  );
}

function DecoJackOfSpades({ width = 240, height = 340 }) {
  return (
    <DecoCard width={width} height={height}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <rect x="10" y="10" width="220" height="320" fill="none" stroke={DECO.gold} strokeWidth="0.8" />
        <rect x="14" y="14" width="212" height="312" fill="none" stroke={DECO.gold} strokeWidth="0.4" />
        <rect x="30" y="46" width="180" height="230" fill={DECO.noir} />
        {/* Rayons */}
        <g transform="translate(120 138)" opacity="0.45">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="0" y1="0" x2="0" y2="-90" stroke={DECO.gold} strokeWidth="0.5" transform={`rotate(${i * 30})`} />
          ))}
          <circle r="46" fill={DECO.noir} stroke={DECO.gold} strokeWidth="0.8" />
        </g>
        {/* Chapeau à bord — valet art déco */}
        <path d="M 80 105 L 80 118 L 160 118 L 160 105 Z" fill={DECO.noir} stroke={DECO.gold} strokeWidth="0.8" />
        <path d="M 72 105 L 168 105 L 165 100 L 75 100 Z" fill={DECO.gold} />
        <path d="M 90 100 L 100 76 L 114 94 L 120 74 L 126 94 L 140 76 L 150 100 Z" fill={DECO.gold} stroke={DECO.ink} strokeWidth="0.8" />
        {/* Plume */}
        <path d="M 152 100 Q 172 80 188 58 Q 175 78 178 94 Q 168 82 152 100 Z" fill={DECO.paper} />
        {/* Tête */}
        <ellipse cx="120" cy="145" rx="28" ry="34" fill={DECO.paper} />
        {/* Yeux */}
        <ellipse cx="111" cy="140" rx="2.2" ry="1.5" fill={DECO.ink} />
        <ellipse cx="129" cy="140" rx="2.2" ry="1.5" fill={DECO.ink} />
        {/* Traits fermes */}
        <path d="M 107 134 L 116 133 M 124 133 L 133 134" stroke={DECO.ink} strokeWidth="1" strokeLinecap="round" />
        <path d="M 116 160 Q 120 163 124 160" stroke={DECO.ink} strokeWidth="0.9" fill="none" strokeLinecap="round" />
        <path d="M 116 150 Q 120 154 124 150" stroke={DECO.ink} strokeWidth="0.6" fill="none" />
        {/* Costume — sash diagonale art déco */}
        <path d="M 64 275 L 72 245 Q 80 214 102 206 L 138 206 Q 160 214 168 245 L 176 275 Z" fill={DECO.gold} stroke={DECO.ink} strokeWidth="0.8" />
        {/* Diagonale */}
        <path d="M 92 210 L 155 270" stroke={DECO.noir} strokeWidth="6" />
        <path d="M 92 210 L 155 270" stroke={DECO.red} strokeWidth="2" />
        {/* Épée */}
        <line x1="166" y1="175" x2="190" y2="290" stroke={DECO.gold} strokeWidth="1.5" />
        <path d="M 158 176 L 175 172 L 172 185 Z" fill={DECO.gold} stroke={DECO.ink} strokeWidth="0.8" />
        {/* Pique médaillon */}
        <g transform="translate(120 250) scale(0.18)">
          <path d="M0 -60 C 20 -28 48 -8 48 12 C 48 28 36 38 22 38 C 14 38 6 34 2 26 L 8 50 L -8 50 L -2 26 C -6 34 -14 38 -22 38 C -36 38 -48 28 -48 12 C -48 -8 -20 -28 0 -60 Z" fill={DECO.ink} stroke={DECO.gold} strokeWidth="4" />
        </g>
        {/* Corners */}
        <text x="22" y="42" fontFamily="Bodoni Moda" fontWeight="900" fontStyle="italic" fontSize="28" fill={DECO.ink}>V</text>
        <g transform="translate(24 52)"><Pip suit="pique" size={12} color={DECO.ink} /></g>
        <g transform="translate(240 340) rotate(180)">
          <text x="22" y="42" fontFamily="Bodoni Moda" fontWeight="900" fontStyle="italic" fontSize="28" fill={DECO.ink}>V</text>
          <g transform="translate(24 52)"><Pip suit="pique" size={12} color={DECO.ink} /></g>
        </g>
        {/* Tag */}
        <text x="120" y="300" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={DECO.ink} letterSpacing="4">— LE VALET —</text>
        <text x="120" y="314" textAnchor="middle" fontFamily="Bodoni Moda" fontStyle="italic" fontSize="10" fill={DECO.ink}>valet de pique</text>
      </svg>
    </DecoCard>
  );
}

function DecoAce({ suit, width = 240, height = 340 }) {
  const red = suit === 'coeur' || suit === 'carreau';
  const labels = { coeur: 'CŒUR', carreau: 'CARREAU', trefle: 'TRÈFLE', pique: 'PIQUE' };
  return (
    <DecoCard width={width} height={height}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <rect x="10" y="10" width="220" height="320" fill="none" stroke={DECO.gold} strokeWidth="0.8" />
        <rect x="14" y="14" width="212" height="312" fill="none" stroke={DECO.gold} strokeWidth="0.4" />
        {/* Corner ornaments */}
        {[[14,14,0],[226,14,90],[226,326,180],[14,326,270]].map(([x,y,r],i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <path d="M 0 0 L 24 0 L 24 2 L 4 2 L 4 18 M 0 24 L 0 4 L 2 4 L 2 24" fill={DECO.gold} />
          </g>
        ))}
        {/* Sunburst */}
        <g transform="translate(120 170)">
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={i} x1="0" y1="0" x2="0" y2="-110" stroke={DECO.gold} strokeWidth="0.4" opacity="0.6" transform={`rotate(${i * 15})`} />
          ))}
        </g>
        {/* Big pip */}
        <g transform={`translate(120 ${red ? 162 : 165})`}>
          <Pip suit={suit} size={120} color={red ? DECO.red : DECO.ink} />
        </g>
        {/* Gold overlay ring */}
        <circle cx="120" cy="170" r="70" fill="none" stroke={DECO.gold} strokeWidth="0.8" />
        <circle cx="120" cy="170" r="75" fill="none" stroke={DECO.gold} strokeWidth="0.3" />
        {/* Corners */}
        <text x="22" y="42" fontFamily="Bodoni Moda" fontWeight="900" fontStyle="italic" fontSize="30" fill={red ? DECO.red : DECO.ink}>A</text>
        <g transform="translate(24 52)"><Pip suit={suit} size={12} color={red ? DECO.red : DECO.ink} /></g>
        <g transform="translate(240 340) rotate(180)">
          <text x="22" y="42" fontFamily="Bodoni Moda" fontWeight="900" fontStyle="italic" fontSize="30" fill={red ? DECO.red : DECO.ink}>A</text>
          <g transform="translate(24 52)"><Pip suit={suit} size={12} color={red ? DECO.red : DECO.ink} /></g>
        </g>
        <line x1="40" y1="278" x2="200" y2="278" stroke={DECO.gold} strokeWidth="0.6" />
        <text x="120" y="296" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={DECO.ink} letterSpacing="4">AS · {labels[suit]}</text>
      </svg>
    </DecoCard>
  );
}

function DecoAceOfHearts({ width, height }) { return <DecoAce suit="coeur" width={width} height={height} />; }
function DecoAceOfDiamonds({ width, height }) { return <DecoAce suit="carreau" width={width} height={height} />; }
function DecoAceOfClubs({ width, height }) { return <DecoAce suit="trefle" width={width} height={height} />; }

Object.assign(window, {
  PopQueenOfHearts, PopJackOfSpades,
  PopAceOfHearts, PopAceOfDiamonds, PopAceOfClubs,
  FeutreQueenOfHearts, FeutreJackOfSpades,
  FeutreAceOfHearts, FeutreAceOfDiamonds, FeutreAceOfClubs,
  RisoQueenOfHearts, RisoJackOfSpades,
  RisoAceOfHearts, RisoAceOfDiamonds, RisoAceOfClubs,
  DecoQueenOfHearts, DecoJackOfSpades,
  DecoAceOfHearts, DecoAceOfDiamonds, DecoAceOfClubs,
});
