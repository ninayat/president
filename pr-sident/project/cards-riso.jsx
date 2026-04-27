// Direction 3 — "Risographie"
// Riso-print style: pink + blue overprint, grainy, geometric figures
// Fonts: Archivo Black (display), Space Grotesk

const RISO = {
  paper: '#f6f1e7',
  pink: '#ff4f8b',
  blue: '#2744ff',
  ink: '#151419',
  mint: '#c6e7d4',
};

function RisoCard({ children, width = 240, height = 340, style = {} }) {
  return (
    <div style={{
      width, height, position: 'relative',
      background: RISO.paper,
      border: `2.5px solid ${RISO.ink}`,
      borderRadius: 8,
      boxShadow: '6px 6px 0 0 ' + RISO.ink,
      overflow: 'hidden',
      ...style,
    }}>{children}</div>
  );
}

function RisoAceOfSpades({ width, height }) {
  return (
    <RisoCard width={width} height={height}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="risoGrain1" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill={RISO.ink} opacity="0.12" />
          </pattern>
        </defs>
        {/* Overprint layers */}
        <rect x="20" y="30" width="200" height="280" fill={RISO.pink} opacity="0.85" />
        <rect x="28" y="38" width="200" height="280" fill={RISO.blue} opacity="0.6" style={{ mixBlendMode: 'multiply' }} />
        <rect width="240" height="340" fill="url(#risoGrain1)" />

        {/* Big geometric spade */}
        <g transform="translate(120 160)">
          <path
            d="M0 -70 C 30 -30 62 -10 62 15 C 62 32 48 44 30 44 C 18 44 8 38 4 28 L 10 58 L -10 58 L -4 28 C -8 38 -18 44 -30 44 C -48 44 -62 32 -62 15 C -62 -10 -30 -30 0 -70 Z"
            fill={RISO.paper}
            stroke={RISO.ink}
            strokeWidth="3"
          />
        </g>

        {/* Top-left label */}
        <text x="22" y="40" fontFamily="Archivo Black" fontSize="36" fill={RISO.ink}>A</text>
        <g transform="translate(24 52)"><Pip suit="pique" size={14} color={RISO.ink} /></g>
        {/* Bottom-right */}
        <g transform="translate(240 340) rotate(180)">
          <text x="22" y="40" fontFamily="Archivo Black" fontSize="36" fill={RISO.ink}>A</text>
          <g transform="translate(24 52)"><Pip suit="pique" size={14} color={RISO.ink} /></g>
        </g>

        {/* Bottom banner */}
        <rect x="24" y="260" width="192" height="42" fill={RISO.ink} />
        <text x="120" y="278" textAnchor="middle" fontFamily="Archivo Black" fontSize="15" fill={RISO.paper} letterSpacing="2">ACE · AS</text>
        <text x="120" y="294" textAnchor="middle" fontFamily="Space Grotesk" fontSize="9" fill={RISO.pink} letterSpacing="4">PIQUE · SPADES</text>
      </svg>
    </RisoCard>
  );
}

function RisoKingOfHearts({ width, height }) {
  return (
    <RisoCard width={width} height={height}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="risoGrain2" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill={RISO.ink} opacity="0.12" />
          </pattern>
        </defs>

        {/* Geometric face — overprinted */}
        {/* Background blocks */}
        <rect x="0" y="0" width="240" height="340" fill={RISO.paper} />
        <rect x="30" y="50" width="180" height="240" fill={RISO.mint} />

        {/* Head — round */}
        <circle cx="120" cy="155" r="58" fill={RISO.pink} opacity="0.95" />
        <circle cx="120" cy="155" r="58" fill="none" stroke={RISO.ink} strokeWidth="2.5" />

        {/* Crown — triangles */}
        <g>
          <polygon points="70,100 85,70 100,100" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2" />
          <polygon points="100,100 120,65 140,100" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2" />
          <polygon points="140,100 155,70 170,100" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2" />
          <rect x="68" y="100" width="104" height="10" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2" />
          <circle cx="85" cy="75" r="4" fill={RISO.paper} stroke={RISO.ink} strokeWidth="2" />
          <circle cx="120" cy="70" r="4" fill={RISO.paper} stroke={RISO.ink} strokeWidth="2" />
          <circle cx="155" cy="75" r="4" fill={RISO.paper} stroke={RISO.ink} strokeWidth="2" />
        </g>

        {/* Eyes — just dots */}
        <circle cx="102" cy="150" r="4" fill={RISO.ink} />
        <circle cx="138" cy="150" r="4" fill={RISO.ink} />
        {/* Mustache — geometric */}
        <path d="M 100 175 L 95 182 L 110 180 L 120 178 L 130 180 L 145 182 L 140 175 Z" fill={RISO.ink} />
        {/* Beard triangle */}
        <path d="M 95 185 Q 120 220 145 185 L 140 210 Q 120 225 100 210 Z" fill={RISO.ink} />

        {/* Shoulders */}
        <rect x="55" y="225" width="130" height="60" fill={RISO.blue} stroke={RISO.ink} strokeWidth="2.5" />
        {/* Heart on chest */}
        <g transform="translate(120 255) scale(0.28)">
          <path d="M0 35 C -28 15 -40 0 -40 -18 C -40 -32 -28 -40 -18 -40 C -10 -40 -4 -34 0 -28 C 4 -34 10 -40 18 -40 C 28 -40 40 -32 40 -18 C 40 0 28 15 0 35 Z" fill={RISO.pink} stroke={RISO.ink} strokeWidth="5" />
        </g>

        {/* Corners */}
        <text x="22" y="40" fontFamily="Archivo Black" fontSize="30" fill={RISO.ink}>K</text>
        <g transform="translate(24 50)"><Pip suit="coeur" size={13} color={RISO.pink} /></g>
        <g transform="translate(240 340) rotate(180)">
          <text x="22" y="40" fontFamily="Archivo Black" fontSize="30" fill={RISO.ink}>K</text>
          <g transform="translate(24 50)"><Pip suit="coeur" size={13} color={RISO.pink} /></g>
        </g>

        {/* Tag */}
        <rect x="30" y="298" width="180" height="20" fill={RISO.ink} />
        <text x="120" y="312" textAnchor="middle" fontFamily="Archivo Black" fontSize="11" fill={RISO.paper} letterSpacing="3">PRÉSIDENT · KING</text>

        {/* Grain */}
        <rect width="240" height="340" fill="url(#risoGrain2)" />
      </svg>
    </RisoCard>
  );
}

function RisoCardBack({ width, height }) {
  return (
    <RisoCard width={width} height={height} style={{ background: RISO.pink }}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <pattern id="risoBackDots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="3" fill={RISO.blue} opacity="0.85" />
          </pattern>
          <pattern id="risoBackGrain" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill={RISO.ink} opacity="0.15" />
          </pattern>
        </defs>
        <rect x="14" y="14" width="212" height="312" fill="url(#risoBackDots)" stroke={RISO.ink} strokeWidth="2.5" />
        <g transform="translate(120 170)">
          <circle r="62" fill={RISO.paper} stroke={RISO.ink} strokeWidth="2.5" />
          <text y="2" textAnchor="middle" fontFamily="Archivo Black" fontSize="20" fill={RISO.ink}>PRÉS</text>
          <text y="22" textAnchor="middle" fontFamily="Archivo Black" fontSize="20" fill={RISO.pink}>IDENT</text>
          <text y="40" textAnchor="middle" fontFamily="Space Grotesk" fontSize="7" fill={RISO.ink} letterSpacing="3">· 52 CARTES ·</text>
        </g>
        <rect width="240" height="340" fill="url(#risoBackGrain)" />
      </svg>
    </RisoCard>
  );
}

Object.assign(window, { RISO, RisoCard, RisoAceOfSpades, RisoKingOfHearts, RisoCardBack });
