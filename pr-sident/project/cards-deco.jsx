// Direction 4 — "Art Déco Moderne"
// Deep noir + brass gold, linocut figures, rigorous symmetry
// Fonts: Bodoni Moda (display), JetBrains Mono (accent)

const DECO = {
  noir: '#0d0b08',
  paper: '#ebe1c8',
  gold: '#b8913e',
  goldLight: '#d9b667',
  red: '#9a2b28',
  ink: '#1a1410',
};

function DecoCard({ children, width = 240, height = 340, style = {} }) {
  return (
    <div style={{
      width, height, position: 'relative',
      background: DECO.paper,
      border: `1.5px solid ${DECO.ink}`,
      borderRadius: 6,
      boxShadow: '0 1px 0 #00000010, 0 20px 40px -18px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      ...style,
    }}>{children}</div>
  );
}

function DecoAceOfSpades({ width, height }) {
  return (
    <DecoCard width={width} height={height}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* Art deco frame */}
        <rect x="10" y="10" width="220" height="320" fill="none" stroke={DECO.gold} strokeWidth="0.8" />
        <rect x="14" y="14" width="212" height="312" fill="none" stroke={DECO.gold} strokeWidth="0.4" />
        {/* Corner ornaments */}
        {[[14,14,0],[226,14,90],[226,326,180],[14,326,270]].map(([x,y,r],i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <path d="M 0 0 L 24 0 L 24 2 L 4 2 L 4 18 M 0 24 L 0 4 L 2 4 L 2 24" fill={DECO.gold} />
            <path d="M 8 8 L 18 8 L 18 10 L 10 10 L 10 18 L 8 18 Z" fill={DECO.gold} />
          </g>
        ))}

        {/* Top sunburst fan */}
        <g transform="translate(120 78)">
          {Array.from({ length: 9 }).map((_, i) => {
            const a = -80 + i * 20;
            return <line key={i} x1="0" y1="0" x2={Math.sin(a*Math.PI/180)*28} y2={-Math.cos(a*Math.PI/180)*28} stroke={DECO.gold} strokeWidth="1" />;
          })}
          <path d="M -30 0 A 30 30 0 0 1 30 0" fill="none" stroke={DECO.gold} strokeWidth="1.2" />
        </g>

        {/* Big central spade in gold */}
        <g transform="translate(120 180) scale(1.35)">
          <path
            d="M0 -64 C 24 -30 52 -8 52 14 C 52 30 40 42 24 42 C 14 42 6 36 2 26 L 8 50 L -8 50 L -2 26 C -6 36 -14 42 -24 42 C -40 42 -52 30 -52 14 C -52 -8 -24 -30 0 -64 Z"
            fill={DECO.ink}
            stroke={DECO.gold}
            strokeWidth="1"
          />
          <path
            d="M 0 -50 C 14 -30 30 -12 30 4 C 30 10 24 16 18 14"
            fill="none"
            stroke={DECO.gold}
            strokeWidth="0.8"
          />
        </g>

        {/* Corners */}
        <g>
          <text x="22" y="42" fontFamily="Bodoni Moda" fontWeight="900" fontStyle="italic" fontSize="30" fill={DECO.ink}>A</text>
          <g transform="translate(24 52)"><Pip suit="pique" size={14} color={DECO.ink} /></g>
        </g>
        <g transform="translate(240 340) rotate(180)">
          <text x="22" y="42" fontFamily="Bodoni Moda" fontWeight="900" fontStyle="italic" fontSize="30" fill={DECO.ink}>A</text>
          <g transform="translate(24 52)"><Pip suit="pique" size={14} color={DECO.ink} /></g>
        </g>

        {/* Bottom tag */}
        <line x1="40" y1="280" x2="200" y2="280" stroke={DECO.gold} strokeWidth="0.6" />
        <text x="120" y="298" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={DECO.ink} letterSpacing="4">AS · PIQUE · 01</text>
      </svg>
    </DecoCard>
  );
}

function DecoKingOfHearts({ width, height }) {
  return (
    <DecoCard width={width} height={height}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* Frame */}
        <rect x="10" y="10" width="220" height="320" fill="none" stroke={DECO.gold} strokeWidth="0.8" />
        <rect x="14" y="14" width="212" height="312" fill="none" stroke={DECO.gold} strokeWidth="0.4" />

        {/* Inner noir panel */}
        <rect x="30" y="46" width="180" height="230" fill={DECO.noir} />

        {/* Radial sunburst behind head */}
        <g transform="translate(120 140)">
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={i} x1="0" y1="0" x2="0" y2="-90" stroke={DECO.gold} strokeWidth="0.6" opacity="0.5" transform={`rotate(${i * 15})`} />
          ))}
          <circle r="50" fill={DECO.noir} stroke={DECO.gold} strokeWidth="1" />
        </g>

        {/* King bust — linocut style */}
        {/* Crown */}
        <g>
          <path d="M 90 98 L 95 78 L 105 92 L 112 72 L 120 90 L 128 72 L 135 92 L 145 78 L 150 98 Z" fill={DECO.gold} stroke={DECO.ink} strokeWidth="0.8" />
          <rect x="90" y="98" width="60" height="6" fill={DECO.gold} />
          <circle cx="105" cy="92" r="2" fill={DECO.red} />
          <circle cx="135" cy="92" r="2" fill={DECO.red} />
          <circle cx="120" cy="90" r="2.5" fill={DECO.red} />
        </g>
        {/* Face oval */}
        <ellipse cx="120" cy="140" rx="28" ry="34" fill={DECO.paper} />
        {/* Beard lines */}
        <path d="M 96 146 Q 96 170 108 178 L 120 180 L 132 178 Q 144 170 144 146" fill={DECO.paper} stroke={DECO.ink} strokeWidth="0.8" />
        <g stroke={DECO.ink} strokeWidth="0.6" fill="none">
          <path d="M 102 156 Q 102 170 110 176" />
          <path d="M 108 152 Q 108 172 116 178" />
          <path d="M 120 152 L 120 180" />
          <path d="M 132 152 Q 132 172 124 178" />
          <path d="M 138 156 Q 138 170 130 176" />
        </g>
        {/* Eyes */}
        <ellipse cx="111" cy="138" rx="2" ry="1.5" fill={DECO.ink} />
        <ellipse cx="129" cy="138" rx="2" ry="1.5" fill={DECO.ink} />
        {/* Brow + nose */}
        <path d="M 107 132 L 115 131 M 125 131 L 133 132" stroke={DECO.ink} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 120 140 L 118 150 L 122 150 Z" fill="none" stroke={DECO.ink} strokeWidth="0.8" />
        <path d="M 115 156 Q 120 160 125 156" stroke={DECO.ink} strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* Mustache */}
        <path d="M 106 152 Q 120 156 134 152 Q 128 158 120 156 Q 112 158 106 152 Z" fill={DECO.ink} />

        {/* Shoulders / robe with ermine */}
        <path d="M 60 275 L 60 240 Q 60 210 90 202 L 150 202 Q 180 210 180 240 L 180 275 Z" fill={DECO.gold} stroke={DECO.ink} strokeWidth="0.8" />
        <path d="M 100 202 Q 120 218 140 202" fill={DECO.paper} stroke={DECO.ink} strokeWidth="0.8" />
        {/* Heart medallion */}
        <g transform="translate(120 248) scale(0.22)">
          <path d="M0 38 C -30 18 -42 3 -42 -15 C -42 -30 -30 -38 -18 -38 C -10 -38 -4 -32 0 -26 C 4 -32 10 -38 18 -38 C 30 -38 42 -30 42 -15 C 42 3 30 18 0 38 Z" fill={DECO.red} stroke={DECO.ink} strokeWidth="3" />
        </g>

        {/* Corners */}
        <g>
          <text x="22" y="42" fontFamily="Bodoni Moda" fontWeight="900" fontStyle="italic" fontSize="28" fill={DECO.red}>K</text>
          <g transform="translate(24 52)"><Pip suit="coeur" size={12} color={DECO.red} /></g>
        </g>
        <g transform="translate(240 340) rotate(180)">
          <text x="22" y="42" fontFamily="Bodoni Moda" fontWeight="900" fontStyle="italic" fontSize="28" fill={DECO.red}>K</text>
          <g transform="translate(24 52)"><Pip suit="coeur" size={12} color={DECO.red} /></g>
        </g>

        {/* Tag */}
        <text x="120" y="300" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={DECO.ink} letterSpacing="4">— PRÉSIDENT —</text>
        <text x="120" y="314" textAnchor="middle" fontFamily="Bodoni Moda" fontStyle="italic" fontSize="10" fill={DECO.ink}>roi de cœur</text>
      </svg>
    </DecoCard>
  );
}

function DecoCardBack({ width, height }) {
  return (
    <DecoCard width={width} height={height} style={{ background: DECO.noir }}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ display: 'block' }}>
        <rect x="10" y="10" width="220" height="320" fill="none" stroke={DECO.gold} strokeWidth="1" />
        <rect x="14" y="14" width="212" height="312" fill="none" stroke={DECO.gold} strokeWidth="0.4" />

        {/* Repeating deco pattern */}
        <defs>
          <pattern id="decoBack" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 12 2 L 22 12 L 12 22 L 2 12 Z" fill="none" stroke={DECO.gold} strokeWidth="0.5" opacity="0.5" />
            <circle cx="12" cy="12" r="1.2" fill={DECO.gold} opacity="0.55" />
          </pattern>
        </defs>
        <rect x="22" y="22" width="196" height="296" fill="url(#decoBack)" />

        {/* Central monogram */}
        <g transform="translate(120 170)">
          <circle r="50" fill={DECO.noir} stroke={DECO.gold} strokeWidth="1" />
          <circle r="44" fill="none" stroke={DECO.gold} strokeWidth="0.4" />
          {/* sunburst inside */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="0" y1="0" x2="0" y2="-40" stroke={DECO.gold} strokeWidth="0.4" opacity="0.6" transform={`rotate(${i * 30})`} />
          ))}
          <text y="6" textAnchor="middle" fontFamily="Bodoni Moda" fontWeight="900" fontStyle="italic" fontSize="36" fill={DECO.goldLight}>P</text>
        </g>

        {/* Tag */}
        <text x="120" y="300" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill={DECO.gold} letterSpacing="5">PRÉSIDENT · MCMLXXVIII</text>
      </svg>
    </DecoCard>
  );
}

Object.assign(window, { DECO, DecoCard, DecoAceOfSpades, DecoKingOfHearts, DecoCardBack });
