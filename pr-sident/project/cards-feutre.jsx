// Direction 2 — "Feutre" (Green casino felt)
// Deep billiard green, chunky screenprint figures, gold + red accents
// Fonts: Playfair Display, Space Grotesk

const FEUTRE = {
  felt: '#0c3a26',
  feltDark: '#082918',
  cream: '#f5ebd0',
  gold: '#d4a73a',
  red: '#c8352a',
  ink: '#0a0a0a',
};

function FeutrePip({ suit, size = 22, color }) {
  // reuse PopCard Pip paths
  return <Pip suit={suit} size={size} color={color} />;
}

function FeutreCard({ children, width = 240, height = 340, style = {} }) {
  return (
    <div style={{
      width, height, position: 'relative',
      background: FEUTRE.cream,
      border: `2px solid ${FEUTRE.ink}`,
      borderRadius: 10,
      boxShadow: '0 1px 0 #00000008, 0 16px 40px -16px rgba(0,0,0,0.4)',
      overflow: 'hidden',
      ...style,
    }}>{children}</div>
  );
}

function FeutreAceOfSpades({ width, height }) {
  return (
    <FeutreCard width={width} height={height}>
      {/* Paper texture feel */}
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="feutreNoise" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.3" fill={FEUTRE.ink} opacity="0.08" />
          </pattern>
        </defs>
        <rect width="240" height="340" fill="url(#feutreNoise)" />
      </svg>

      {/* Corners */}
      <div style={{ position: 'absolute', top: 12, left: 14, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 30, fontWeight: 900, color: FEUTRE.ink }}>A</div>
        <div style={{ marginTop: 2 }}><Pip suit="pique" size={14} color={FEUTRE.ink} /></div>
      </div>
      <div style={{ position: 'absolute', bottom: 12, right: 14, textAlign: 'center', lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 30, fontWeight: 900, color: FEUTRE.ink }}>A</div>
        <div style={{ marginTop: 2 }}><Pip suit="pique" size={14} color={FEUTRE.ink} /></div>
      </div>

      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* Circular green medallion */}
        <circle cx="120" cy="170" r="92" fill={FEUTRE.felt} />
        <circle cx="120" cy="170" r="92" fill="none" stroke={FEUTRE.gold} strokeWidth="1.5" />
        <circle cx="120" cy="170" r="86" fill="none" stroke={FEUTRE.gold} strokeWidth="0.5" />
        {/* Big spade */}
        <g transform="translate(120 170) scale(1.4)">
          <path
            d="M0 -58 C 22 -30 48 -10 48 10 C 48 24 38 34 24 34 C 16 34 8 30 4 22 L 8 44 L -8 44 L -4 22 C -8 30 -16 34 -24 34 C -38 34 -48 24 -48 10 C -48 -10 -22 -30 0 -58 Z"
            fill={FEUTRE.cream}
          />
          <path
            d="M0 -58 C 22 -30 48 -10 48 10 C 48 24 38 34 24 34 C 16 34 8 30 4 22 L 8 44 L -8 44 L -4 22 C -8 30 -16 34 -24 34 C -38 34 -48 24 -48 10 C -48 -10 -22 -30 0 -58 Z"
            fill="none" stroke={FEUTRE.gold} strokeWidth="1"
          />
        </g>
        {/* Ornamental leaves */}
        <g stroke={FEUTRE.gold} strokeWidth="0.8" fill="none" opacity="0.8">
          <path d="M 42 62 Q 60 55 65 72 Q 75 60 88 68" />
          <path d="M 198 62 Q 180 55 175 72 Q 165 60 152 68" />
          <path d="M 42 278 Q 60 285 65 268 Q 75 280 88 272" />
          <path d="M 198 278 Q 180 285 175 268 Q 165 280 152 272" />
        </g>
        {/* Tag */}
        <rect x="66" y="298" width="108" height="20" fill={FEUTRE.ink} />
        <text x="120" y="312" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="10" fill={FEUTRE.gold} letterSpacing="4">AS · PIQUE</text>
      </svg>
    </FeutreCard>
  );
}

function FeutreKingOfHearts({ width, height }) {
  return (
    <FeutreCard width={width} height={height}>
      {/* Corners */}
      <div style={{ position: 'absolute', top: 12, left: 14, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 900, color: FEUTRE.red }}>K</div>
        <div style={{ marginTop: 2 }}><Pip suit="coeur" size={13} color={FEUTRE.red} /></div>
      </div>
      <div style={{ position: 'absolute', bottom: 12, right: 14, textAlign: 'center', lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 900, color: FEUTRE.red }}>K</div>
        <div style={{ marginTop: 2 }}><Pip suit="coeur" size={13} color={FEUTRE.red} /></div>
      </div>

      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* Oval medallion */}
        <ellipse cx="120" cy="170" rx="82" ry="120" fill={FEUTRE.felt} />
        <ellipse cx="120" cy="170" rx="82" ry="120" fill="none" stroke={FEUTRE.gold} strokeWidth="1.2" />
        <ellipse cx="120" cy="170" rx="76" ry="114" fill="none" stroke={FEUTRE.gold} strokeWidth="0.5" />

        {/* Silhouette portrait — old coin style */}
        {/* Bust */}
        <path d="M 78 280 L 78 245 Q 78 215 100 205 L 140 205 Q 162 215 162 245 L 162 280 Z" fill={FEUTRE.gold} />
        {/* Neck */}
        <rect x="110" y="192" width="20" height="16" fill={FEUTRE.gold} />
        {/* Head profile facing right */}
        <path d="M 100 100 Q 88 100 85 120 Q 82 140 88 155 Q 92 168 100 175 L 110 185 Q 115 192 120 192 L 135 192 Q 145 192 150 185 L 155 175 Q 158 168 158 155 L 158 145 Q 168 142 168 132 Q 168 122 158 120 L 155 110 Q 148 95 130 92 Q 115 90 100 100 Z" fill={FEUTRE.gold} />
        {/* Crown laurel */}
        <path d="M 95 95 Q 90 85 95 75 L 100 82 M 105 82 Q 108 72 118 70 L 118 80 M 125 78 Q 135 72 145 78 L 140 85 M 150 85 Q 158 80 163 88 L 155 95" stroke={FEUTRE.gold} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Eye notch */}
        <circle cx="134" cy="135" r="2" fill={FEUTRE.felt} />
        {/* Mouth line */}
        <path d="M 140 158 Q 150 158 152 162" stroke={FEUTRE.felt} strokeWidth="1.5" fill="none" />
        {/* Nose */}
        <path d="M 158 130 Q 165 140 158 148" stroke={FEUTRE.felt} strokeWidth="1.2" fill="none" />

        {/* Stars */}
        <g fill={FEUTRE.gold}>
          <circle cx="55" cy="120" r="1.5" />
          <circle cx="185" cy="120" r="1.5" />
          <circle cx="50" cy="180" r="1.5" />
          <circle cx="190" cy="180" r="1.5" />
          <circle cx="60" cy="240" r="1.5" />
          <circle cx="180" cy="240" r="1.5" />
        </g>

        {/* Bottom tag */}
        <rect x="60" y="300" width="120" height="18" fill={FEUTRE.red} />
        <text x="120" y="312" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="9" fill={FEUTRE.cream} letterSpacing="3">LE PRÉSIDENT</text>
      </svg>
    </FeutreCard>
  );
}

function FeutreCardBack({ width, height }) {
  return (
    <FeutreCard width={width} height={height} style={{ background: FEUTRE.felt }}>
      <svg viewBox="0 0 240 340" width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <pattern id="feutreBack" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="1" fill={FEUTRE.gold} opacity="0.25" />
            <circle cx="0" cy="0" r="1" fill={FEUTRE.gold} opacity="0.25" />
            <circle cx="16" cy="16" r="1" fill={FEUTRE.gold} opacity="0.25" />
          </pattern>
        </defs>
        <rect x="12" y="12" width="216" height="316" fill="url(#feutreBack)" stroke={FEUTRE.gold} strokeWidth="1.5" />
        <rect x="18" y="18" width="204" height="304" fill="none" stroke={FEUTRE.gold} strokeWidth="0.5" />
        <g transform="translate(120 170)">
          <circle r="56" fill={FEUTRE.feltDark} stroke={FEUTRE.gold} strokeWidth="1.2" />
          <circle r="50" fill="none" stroke={FEUTRE.gold} strokeWidth="0.5" />
          <text y="-4" textAnchor="middle" fontFamily="Playfair Display" fontStyle="italic" fontWeight="900" fontSize="24" fill={FEUTRE.gold}>P</text>
          <text y="18" textAnchor="middle" fontFamily="Space Grotesk" fontSize="7" fill={FEUTRE.gold} letterSpacing="3">PRÉSIDENT</text>
        </g>
      </svg>
    </FeutreCard>
  );
}

Object.assign(window, { FEUTRE, FeutreCard, FeutreAceOfSpades, FeutreKingOfHearts, FeutreCardBack });
