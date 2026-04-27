// Direction 1 — "Salon Pop"
// Cream background, editorial French poster style, vermilion + cobalt
// Fonts: Fraunces (display), Space Grotesk (UI)

const POP = {
  paper: '#f3ecdc',
  paperDark: '#e8dfc8',
  ink: '#1a1612',
  red: '#d63a26',
  blue: '#1e3a8a',
  gold: '#c89b3f',
  cream: '#faf4e4',
};

// Small pip — pique, coeur, carreau, trefle
function Pip({ suit, size = 22, color }) {
  const paths = {
    pique: 'M50 8 C 70 40 92 55 92 72 C 92 85 82 92 72 92 C 62 92 55 86 52 78 L 55 92 L 45 92 L 48 78 C 45 86 38 92 28 92 C 18 92 8 85 8 72 C 8 55 30 40 50 8 Z',
    coeur: 'M50 90 C 20 70 5 55 5 35 C 5 20 17 10 30 10 C 40 10 46 16 50 24 C 54 16 60 10 70 10 C 83 10 95 20 95 35 C 95 55 80 70 50 90 Z',
    carreau: 'M50 5 L 92 50 L 50 95 L 8 50 Z',
    trefle: 'M50 10 C 60 10 70 20 70 30 C 70 34 69 37 67 40 C 75 36 85 40 89 48 C 93 58 87 70 78 72 C 70 74 62 70 58 65 C 60 72 62 80 65 88 L 35 88 C 38 80 40 72 42 65 C 38 70 30 74 22 72 C 13 70 7 58 11 48 C 15 40 25 36 33 40 C 31 37 30 34 30 30 C 30 20 40 10 50 10 Z',
  };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <path d={paths[suit]} fill={color} />
    </svg>
  );
}

const suitColor = (suit, pal) => (suit === 'coeur' || suit === 'carreau') ? pal.red : pal.ink;

// Card shell
function PopCard({ children, width = 240, height = 340, style = {} }) {
  return (
    <div style={{
      width, height, position: 'relative',
      background: POP.cream,
      border: `1.5px solid ${POP.ink}`,
      borderRadius: 14,
      boxShadow: '0 1px 0 #00000008, 0 10px 30px -10px rgba(0,0,0,0.18)',
      overflow: 'hidden',
      ...style,
    }}>{children}</div>
  );
}

// ── AS DE PIQUE ──────────────────────────────────────────
function PopAceOfSpades({ width, height }) {
  return (
    <PopCard width={width} height={height}>
      {/* Corners */}
      <div style={{ position: 'absolute', top: 14, left: 16, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 900, color: POP.ink }}>A</div>
        <div style={{ marginTop: 2 }}><Pip suit="pique" size={14} color={POP.ink} /></div>
      </div>
      <div style={{ position: 'absolute', bottom: 14, right: 16, textAlign: 'center', lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 900, color: POP.ink }}>A</div>
        <div style={{ marginTop: 2 }}><Pip suit="pique" size={14} color={POP.ink} /></div>
      </div>

      {/* Center composition — big pique with sunburst + banner */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ display: 'block' }}>
          {/* Sunburst rays */}
          <g transform="translate(120 170)" opacity="0.9">
            {Array.from({ length: 12 }).map((_, i) => (
              <path key={i}
                d="M0 -130 L 8 -70 L -8 -70 Z"
                fill={POP.red}
                transform={`rotate(${i * 30})`}
              />
            ))}
          </g>
          {/* Big spade */}
          <g transform="translate(120 170) scale(1.3)">
            <path
              d="M0 -62 C 22 -32 50 -10 50 12 C 50 28 38 38 24 38 C 14 38 6 32 2 24 L 6 46 L -6 46 L -2 24 C -6 32 -14 38 -24 38 C -38 38 -50 28 -50 12 C -50 -10 -22 -32 0 -62 Z"
              fill={POP.ink}
            />
          </g>
          {/* Banner */}
          <g>
            <rect x="30" y="230" width="180" height="34" fill={POP.blue} />
            <polygon points="30,230 20,247 30,264" fill={POP.blue} />
            <polygon points="210,230 220,247 210,264" fill={POP.blue} />
            <text x="120" y="253" textAnchor="middle" fontFamily="Fraunces" fontWeight="900" fontSize="18" fill={POP.cream} letterSpacing="4">
              AS DE PIQUE
            </text>
          </g>
        </svg>
      </div>
    </PopCard>
  );
}

// ── ROI DE COEUR (Président) ─────────────────────────────
function PopKingOfHearts({ width, height }) {
  return (
    <PopCard width={width} height={height}>
      {/* Corners */}
      <div style={{ position: 'absolute', top: 14, left: 16, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 900, color: POP.red }}>R</div>
        <div style={{ marginTop: 2 }}><Pip suit="coeur" size={13} color={POP.red} /></div>
      </div>
      <div style={{ position: 'absolute', bottom: 14, right: 16, textAlign: 'center', lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 900, color: POP.red }}>R</div>
        <div style={{ marginTop: 2 }}><Pip suit="coeur" size={13} color={POP.red} /></div>
      </div>

      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* Frame */}
        <rect x="38" y="38" width="164" height="264" fill="none" stroke={POP.ink} strokeWidth="1.5" />
        <rect x="42" y="42" width="156" height="256" fill={POP.paper} />

        {/* King portrait — editorial flat illustration */}
        {/* Shoulders / robe */}
        <path d="M 50 302 L 50 255 Q 50 215 90 205 L 150 205 Q 190 215 190 255 L 190 302 Z" fill={POP.blue} />
        <path d="M 50 302 L 50 255 Q 50 215 90 205 L 150 205 Q 190 215 190 255 L 190 302 Z" fill="none" stroke={POP.ink} strokeWidth="1.5" />
        {/* Ermine trim dots */}
        {[65, 85, 105, 125, 145, 165, 185].map((x) => (
          <g key={x}>
            <circle cx={x} cy="215" r="2" fill={POP.ink} />
            <circle cx={x + 10} cy="222" r="2" fill={POP.ink} />
          </g>
        ))}
        {/* Neck */}
        <rect x="108" y="190" width="24" height="20" fill="#e8c3a8" stroke={POP.ink} strokeWidth="1.5" />
        {/* Head */}
        <ellipse cx="120" cy="160" rx="38" ry="44" fill="#f0cfb2" stroke={POP.ink} strokeWidth="1.5" />
        {/* Hair/beard */}
        <path d="M 82 155 Q 78 180 88 195 L 92 205 L 108 205 Q 112 200 112 190 Q 100 195 95 180 Q 102 165 120 160 Q 138 165 145 180 Q 140 195 128 190 Q 128 200 132 205 L 148 205 L 152 195 Q 162 180 158 155 Q 145 135 120 135 Q 95 135 82 155 Z" fill={POP.ink} />
        {/* Eyes */}
        <circle cx="108" cy="158" r="2" fill={POP.ink} />
        <circle cx="132" cy="158" r="2" fill={POP.ink} />
        {/* Mustache */}
        <path d="M 105 175 Q 120 180 135 175 Q 130 180 120 180 Q 110 180 105 175 Z" fill={POP.ink} />
        {/* Crown */}
        <path d="M 82 130 L 88 105 L 100 120 L 110 98 L 120 118 L 130 98 L 140 120 L 152 105 L 158 130 Z" fill={POP.gold} stroke={POP.ink} strokeWidth="1.5" />
        <circle cx="100" cy="120" r="3" fill={POP.red} stroke={POP.ink} strokeWidth="1" />
        <circle cx="140" cy="120" r="3" fill={POP.red} stroke={POP.ink} strokeWidth="1" />
        <circle cx="120" cy="118" r="3.5" fill={POP.red} stroke={POP.ink} strokeWidth="1" />
        <rect x="82" y="130" width="76" height="6" fill={POP.gold} stroke={POP.ink} strokeWidth="1.5" />

        {/* Heart on chest */}
        <g transform="translate(120 260) scale(0.22)">
          <path d="M0 40 C -30 20 -45 5 -45 -15 C -45 -30 -33 -40 -20 -40 C -10 -40 -4 -34 0 -26 C 4 -34 10 -40 20 -40 C 33 -40 45 -30 45 -15 C 45 5 30 20 0 40 Z" fill={POP.red} stroke={POP.ink} strokeWidth="4" />
        </g>

        {/* Banner */}
        <rect x="42" y="272" width="156" height="26" fill={POP.red} />
        <text x="120" y="290" textAnchor="middle" fontFamily="Fraunces" fontWeight="900" fontSize="13" fill={POP.cream} letterSpacing="3">
          PRÉSIDENT
        </text>
      </svg>
    </PopCard>
  );
}

// ── DOS DE CARTE ────────────────────────────────────────
function PopCardBack({ width, height }) {
  return (
    <PopCard width={width} height={height} style={{ background: POP.red }}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ display: 'block' }}>
        <rect x="12" y="12" width="216" height="316" fill="none" stroke={POP.cream} strokeWidth="2" />
        <rect x="18" y="18" width="204" height="304" fill="none" stroke={POP.cream} strokeWidth="0.5" />
        {/* Diamond grid pattern */}
        <defs>
          <pattern id="popBackPattern" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M15 0 L 30 15 L 15 30 L 0 15 Z" fill="none" stroke={POP.cream} strokeWidth="0.6" opacity="0.5" />
            <circle cx="15" cy="15" r="2" fill={POP.cream} opacity="0.7" />
          </pattern>
        </defs>
        <rect x="24" y="24" width="192" height="292" fill="url(#popBackPattern)" />
        {/* Center medallion */}
        <g transform="translate(120 170)">
          <circle r="48" fill={POP.red} stroke={POP.cream} strokeWidth="2" />
          <circle r="44" fill="none" stroke={POP.cream} strokeWidth="0.6" />
          <text textAnchor="middle" y="-6" fontFamily="Fraunces" fontWeight="900" fontSize="13" fill={POP.cream} letterSpacing="2">PRÉSIDENT</text>
          <text textAnchor="middle" y="10" fontFamily="Space Grotesk" fontWeight="500" fontSize="8" fill={POP.cream} letterSpacing="3" opacity="0.85">— 1961 —</text>
          <text textAnchor="middle" y="24" fontFamily="Fraunces" fontStyle="italic" fontSize="10" fill={POP.cream}>trou du cul</text>
        </g>
      </svg>
    </PopCard>
  );
}

Object.assign(window, { POP, Pip, PopCard, PopAceOfSpades, PopKingOfHearts, PopCardBack });
