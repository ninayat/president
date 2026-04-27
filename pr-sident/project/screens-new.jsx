// Table mobile portrait (390×844) pour les 4 directions
// + Animation du don de cartes Président ↔ Trou du Cul

// ═══════════════════════════════════════════════════════
// MOBILE TABLES — 390×844 portrait
// ═══════════════════════════════════════════════════════

function MobilePlayerChip({ name, role, cards, color, isActive }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <div style={{
        width: isActive ? 52 : 44, height: isActive ? 52 : 44,
        borderRadius: '50%', background: color, border: `2.5px solid ${isActive ? '#fff' : 'transparent'}`,
        display: 'grid', placeItems: 'center', fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 900, fontSize: 20, color: '#fff',
        flexShrink: 0, transition: 'all .2s',
        boxShadow: isActive ? `0 0 0 4px ${color}55` : 'none',
      }}>{name[0]}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 10, opacity: 0.65 }}>{role} · {cards} cartes</div>
      </div>
    </div>
  );
}

// ─── POP MOBILE ───────────────────────────────────────
function PopMobileTable({ width = 390, height = 844 }) {
  const hand = [
    { rank: '8', suit: 'trefle' },
    { rank: '10', suit: 'coeur' },
    { rank: 'V', suit: 'pique', selected: true },
    { rank: 'D', suit: 'coeur', selected: true },
    { rank: 'R', suit: 'carreau' },
  ];
  return (
    <div style={{ width, height, background: POP.paperDark, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk' }}>
      {/* Status bar */}
      <div style={{ background: POP.ink, color: POP.cream, padding: '14px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 900, fontSize: 18 }}>Président</div>
        <div style={{ fontSize: 11, letterSpacing: 1.5 }}>MANCHE 3 · 5 ♠</div>
      </div>

      {/* Players stack — top 3 */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { name: 'Juliette', role: 'Présidente', cards: 4, color: POP.gold },
          { name: 'Antoine', role: 'Vice', cards: 5, color: POP.blue },
          { name: 'Clémence', role: 'Neutre', cards: 6, color: '#888' },
        ].map((p, i) => (
          <div key={i} style={{ background: POP.cream, border: `1px solid ${POP.ink}22`, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <MobilePlayerChip {...p} />
            <div style={{ display: 'flex', gap: -8 }}>
              {Array.from({ length: Math.min(p.cards, 5) }).map((_, j) => (
                <div key={j} style={{ width: 18, height: 26, background: POP.red, border: `1px solid ${POP.ink}`, borderRadius: 2, marginLeft: j === 0 ? 0 : -10 }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Play zone */}
      <div style={{ margin: '0 16px', background: POP.cream, border: `1.5px solid ${POP.ink}`, padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: -20 }}>
          <div style={{ transform: 'rotate(-6deg)' }}><MiniCard rank="V" suit="pique" /></div>
          <div style={{ transform: 'rotate(6deg)', marginLeft: -25 }}><MiniCard rank="V" suit="coeur" /></div>
        </div>
        <div style={{ fontSize: 10, letterSpacing: 3, color: POP.ink, opacity: 0.6, fontWeight: 600 }}>PAIRE DE VALETS · À BATTRE</div>
      </div>

      {/* Active players */}
      <div style={{ padding: '14px 16px' }}>
        {[
          { name: 'Hugo', role: 'V-Trou du Cul', cards: 7, color: '#999' },
          { name: 'Marcel', role: 'Neutre', cards: 5, color: POP.ink, isActive: true },
        ].map((p, i) => (
          <div key={i} style={{ background: p.isActive ? POP.ink : POP.cream, border: `1.5px solid ${POP.ink}`, padding: '10px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: p.isActive ? POP.cream : POP.ink }}>
            <MobilePlayerChip {...p} />
            {p.isActive && <div style={{ fontSize: 11, letterSpacing: 2, color: POP.red, fontWeight: 700 }}>TON TOUR ▸</div>}
          </div>
        ))}
      </div>

      {/* Hand dock */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: POP.cream, borderTop: `2px solid ${POP.ink}`, padding: '12px 16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: POP.ink, opacity: 0.6 }}>TA MAIN · 5 CARTES</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: POP.red, color: POP.cream, border: 'none', padding: '10px 18px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>JOUER</button>
            <button style={{ background: 'transparent', border: `1.5px solid ${POP.ink}`, padding: '9px 14px', fontSize: 13 }}>PASSER</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
          {hand.map((c, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : -18, transform: `translateY(${c.selected ? -14 : 0}px) rotate(${(i - 2) * 4}deg)` }}>
              <MiniCard rank={c.rank} suit={c.suit} selected={c.selected} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FEUTRE MOBILE ──────────────────────────────────
function FeutreMobileTable({ width = 390, height = 844 }) {
  const hand = [
    { rank: '9', suit: 'carreau' },
    { rank: 'V', suit: 'coeur', selected: true },
    { rank: 'V', suit: 'pique', selected: true },
    { rank: 'D', suit: 'trefle' },
    { rank: 'R', suit: 'coeur' },
  ];
  return (
    <div style={{ width, height, background: FEUTRE.felt, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: FEUTRE.cream }}>
      <div style={{ position: 'absolute', inset: 12, border: `0.6px solid ${FEUTRE.gold}`, opacity: 0.5, pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{ padding: '18px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `0.5px solid ${FEUTRE.gold}33` }}>
        <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, fontSize: 20 }}>Président</div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: FEUTRE.gold }}>SALON · MANCHE III</div>
      </div>

      {/* Players */}
      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { name: 'Juliette', role: 'PRÉSIDENTE', cards: 4, border: FEUTRE.gold },
          { name: 'Antoine', role: 'VICE', cards: 5, border: FEUTRE.cream },
          { name: 'Clémence', role: 'NEUTRE', cards: 6, border: FEUTRE.cream + '88' },
          { name: 'Hugo', role: 'V-TDC', cards: 7, border: FEUTRE.cream + '55' },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `0.4px solid ${FEUTRE.gold}22` }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${p.border}`, background: FEUTRE.feltDark, display: 'grid', placeItems: 'center', fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, fontSize: 18, color: FEUTRE.gold, flexShrink: 0 }}>{p.name[0]}</div>
            <div>
              <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 700, fontSize: 16 }}>{p.name}</div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: FEUTRE.gold }}>{p.role} · {p.cards}♠</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: -6 }}>
              {Array.from({ length: Math.min(p.cards, 5) }).map((_, j) => (
                <div key={j} style={{ width: 14, height: 22, background: FEUTRE.red, border: `0.8px solid ${FEUTRE.gold}`, borderRadius: 2, marginLeft: j === 0 ? 0 : -8 }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Play zone center */}
      <div style={{ margin: '0 20px', background: FEUTRE.feltDark, border: `1px solid ${FEUTRE.gold}55`, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, borderRadius: 80 }}>
        <div style={{ display: 'flex', gap: -22 }}>
          <div style={{ transform: 'rotate(-8deg)' }}><FeutreMiniCard rank="D" suit="coeur" /></div>
          <div style={{ marginLeft: -28 }}><FeutreMiniCard rank="D" suit="pique" /></div>
        </div>
        <div style={{ fontSize: 9, letterSpacing: 4, color: FEUTRE.gold }}>▸ PAIRE DE DAMES</div>
      </div>

      {/* Hand dock */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 20px 24px', background: `linear-gradient(to top, ${FEUTRE.feltDark} 60%, transparent)` }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: FEUTRE.gold, marginBottom: 4 }}>VOTRE MAIN · MARCEL</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
          <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 700, fontSize: 18 }}>À vous de jouer</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: FEUTRE.gold, color: FEUTRE.felt, border: 'none', padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>JOUER</button>
            <button style={{ background: 'transparent', color: FEUTRE.cream, border: `1px solid ${FEUTRE.gold}`, padding: '8px 14px', fontSize: 11, letterSpacing: 1.5 }}>PASSER</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {hand.map((c, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : -22, transform: `translateY(${c.selected ? -12 : 0}px) rotate(${(i - 2) * 3}deg)` }}>
              <FeutreMiniCard rank={c.rank} suit={c.suit} selected={c.selected} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RISO MOBILE ────────────────────────────────────
function RisoMobileTable({ width = 390, height = 844 }) {
  const hand = [
    { rank: '7', suit: 'pique' },
    { rank: '10', suit: 'coeur' },
    { rank: 'D', suit: 'carreau', selected: true },
    { rank: 'R', suit: 'trefle' },
    { rank: '2', suit: 'coeur' },
  ];
  return (
    <div style={{ width, height, background: RISO.paper, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: RISO.ink }}>
      {/* Top bar */}
      <div style={{ background: RISO.ink, color: RISO.paper, padding: '16px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Archivo Black', color: RISO.pink, fontSize: 20 }}>PRÉSIDENT!</div>
        <div style={{ background: RISO.pink, color: RISO.ink, padding: '6px 12px', fontFamily: 'Archivo Black', fontSize: 14 }}>28s</div>
      </div>

      {/* Players as bold blocks */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { name: 'JULIETTE', role: 'PRÉSIDENTE', cards: 4, bg: RISO.pink },
          { name: 'ANTOINE', role: 'VICE', cards: 5, bg: RISO.mint },
          { name: 'CLÉMENCE', role: 'NEUTRE', cards: 6, bg: RISO.paper },
          { name: 'HUGO', role: 'V-TDC', cards: 7, bg: RISO.paper },
        ].map((p, i) => (
          <div key={i} style={{ background: p.bg, border: `2.5px solid ${RISO.ink}`, boxShadow: `3px 3px 0 ${RISO.ink}`, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Archivo Black', fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 9, letterSpacing: 2 }}>{p.role}</div>
            </div>
            <div style={{ fontFamily: 'Archivo Black', fontSize: 16 }}>{p.cards}♠</div>
          </div>
        ))}
      </div>

      {/* Play zone */}
      <div style={{ margin: '0 16px', background: RISO.mint, border: `3px solid ${RISO.ink}`, boxShadow: `5px 5px 0 ${RISO.ink}`, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex' }}>
          <div style={{ transform: 'rotate(-8deg)' }}><RisoMiniCard rank="10" suit="coeur" /></div>
          <div style={{ transform: 'rotate(5deg)', marginLeft: -20 }}><RisoMiniCard rank="10" suit="pique" /></div>
          <div style={{ transform: 'rotate(14deg)', marginLeft: -20 }}><RisoMiniCard rank="10" suit="trefle" /></div>
        </div>
        <div style={{ background: RISO.ink, color: RISO.paper, padding: '5px 12px', fontFamily: 'Archivo Black', fontSize: 11, letterSpacing: 2 }}>▸ TROIS 10</div>
      </div>

      {/* Hand dock */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: RISO.paper, borderTop: `3px solid ${RISO.ink}`, padding: '12px 16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: 'Archivo Black', fontSize: 16 }}>TON TOUR!</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: RISO.pink, border: `2.5px solid ${RISO.ink}`, boxShadow: `3px 3px 0 ${RISO.ink}`, color: RISO.ink, padding: '10px 16px', fontFamily: 'Archivo Black', fontSize: 13 }}>JOUER!</button>
            <button style={{ background: RISO.paper, border: `2.5px solid ${RISO.ink}`, color: RISO.ink, padding: '10px 12px', fontFamily: 'Archivo Black', fontSize: 13 }}>PASS</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {hand.map((c, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : -18, transform: `translateY(${c.selected ? -14 : 0}px) rotate(${(i - 2) * 3}deg)` }}>
              <RisoMiniCard rank={c.rank} suit={c.suit} selected={c.selected} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DECO MOBILE ────────────────────────────────────
function DecoMobileTable({ width = 390, height = 844 }) {
  const hand = [
    { rank: '9', suit: 'carreau' },
    { rank: 'V', suit: 'pique', selected: true },
    { rank: 'D', suit: 'coeur' },
    { rank: 'R', suit: 'trefle' },
    { rank: 'A', suit: 'coeur' },
  ];
  return (
    <div style={{ width, height, background: DECO.noir, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: DECO.paper }}>
      <div style={{ position: 'absolute', inset: 14, border: `0.5px solid ${DECO.gold}`, opacity: 0.7, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 20, border: `0.3px solid ${DECO.gold}`, opacity: 0.4, pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{ padding: '22px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `0.4px solid ${DECO.gold}44` }}>
        <div style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontWeight: 900, fontSize: 22, color: DECO.goldLight }}>Président</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 3, color: DECO.gold }}>MANCHE · III</div>
      </div>

      {/* Players */}
      <div style={{ padding: '14px 24px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[
          { name: 'Juliette', role: 'PRÉSIDENTE', cards: 4 },
          { name: 'Antoine', role: 'VICE-PRÉSIDENT', cards: 5 },
          { name: 'Clémence', role: 'NEUTRE', cards: 6 },
          { name: 'Hugo', role: 'VICE-TROU-DU-CUL', cards: 7 },
        ].map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: `0.3px solid ${DECO.gold}22` }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: `0.8px solid ${DECO.gold}`, background: DECO.ink, display: 'grid', placeItems: 'center', fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontWeight: 900, fontSize: 16, color: DECO.goldLight }}>{p.name[0]}</div>
            <div>
              <div style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontWeight: 700, fontSize: 18 }}>{p.name}</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, letterSpacing: 2.5, color: DECO.gold }}>{p.role}</div>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: DECO.gold }}>{p.cards}♠</div>
          </div>
        ))}
      </div>

      {/* Play zone */}
      <div style={{ margin: '0 24px', border: `0.6px solid ${DECO.gold}`, padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex' }}>
          <div style={{ transform: 'rotate(-6deg)' }}><DecoMiniCard rank="V" suit="pique" /></div>
          <div style={{ transform: 'rotate(6deg)', marginLeft: -24 }}><DecoMiniCard rank="V" suit="coeur" /></div>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 4, color: DECO.gold }}>▸ PAIRE DE VALETS</div>
      </div>

      {/* Hand dock */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 28px', borderTop: `0.4px solid ${DECO.gold}44` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 3, color: DECO.gold }}>VOTRE MAIN</div>
            <div style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontWeight: 900, fontSize: 22 }}>Marcel</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: DECO.gold, color: DECO.noir, border: 'none', padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2.5, fontWeight: 700 }}>JOUER</button>
            <button style={{ background: 'transparent', color: DECO.paper, border: `0.8px solid ${DECO.gold}`, padding: '9px 12px', fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2 }}>PASSER</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {hand.map((c, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : -22, transform: `translateY(${c.selected ? -14 : 0}px) rotate(${(i - 2) * 3}deg)` }}>
              <DecoMiniCard rank={c.rank} suit={c.suit} selected={c.selected} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ANIMATION — Don de cartes Président ↔ Trou du Cul
// ═══════════════════════════════════════════════════════

const ANIM_CSS = `
  @keyframes flyToTDC {
    0% { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
    40% { transform: translate(30px, -30px) rotate(-8deg) scale(0.95); opacity: 1; }
    100% { transform: translate(230px, 440px) rotate(20deg) scale(0.7); opacity: 0.3; }
  }
  @keyframes flyToPresident {
    0% { transform: translate(0,0) rotate(0deg) scale(0.7); opacity: 0.3; }
    40% { transform: translate(-20px, -50px) rotate(8deg) scale(0.85); opacity: 0.8; }
    100% { transform: translate(-220px, -440px) rotate(-15deg) scale(1); opacity: 1; }
  }
  @keyframes cardReceive {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.2); }
    50% { box-shadow: 0 0 24px 8px rgba(255,255,255,0.35); }
  }
`;

const PHASES = [
  { id: 'start', label: 'Fin de manche — Redistribution', desc: 'Le Président reçoit les 2 meilleures cartes du Trou du Cul' },
  { id: 'tdc_gives', label: 'Le Trou du Cul donne…', desc: 'Hugo remet ses 2 meilleures cartes à Juliette (Présidente)' },
  { id: 'president_gives', label: 'Le Président donne…', desc: 'Juliette choisit 2 cartes quelconques à remettre à Hugo' },
  { id: 'done', label: 'Redistribution terminée', desc: 'La nouvelle manche peut commencer. Les rôles restent.' },
];

function CardAnimExchange({ width = 900, height = 620 }) {
  const [phaseIdx, setPhaseIdx] = React.useState(0);
  const [animKey, setAnimKey] = React.useState(0);

  const next = () => {
    setAnimKey(k => k + 1);
    setPhaseIdx(i => Math.min(i + 1, PHASES.length - 1));
  };
  const prev = () => {
    setAnimKey(k => k + 1);
    setPhaseIdx(i => Math.max(i - 1, 0));
  };
  const reset = () => { setAnimKey(k => k + 1); setPhaseIdx(0); };

  const phase = PHASES[phaseIdx];
  const isTDCGiving = phaseIdx === 1;
  const isPresidentGiving = phaseIdx === 2;
  const isDone = phaseIdx === 3;

  // Mini card for animation
  const AnimCard = ({ rank, suit, style = {}, animStyle = {} }) => {
    const red = suit === 'coeur' || suit === 'carreau';
    const col = red ? FEUTRE.red : FEUTRE.ink;
    return (
      <div style={{
        width: 58, height: 82, background: FEUTRE.cream,
        border: `1.5px solid ${FEUTRE.ink}`, borderRadius: 5,
        position: 'relative', flexShrink: 0,
        ...style, ...animStyle,
      }}>
        <div style={{ position: 'absolute', top: 4, left: 6, fontFamily: 'Playfair Display', fontWeight: 900, fontSize: 13, color: col, lineHeight: 1 }}>{rank}</div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Pip suit={suit} size={22} color={col} />
        </div>
      </div>
    );
  };

  const PlayerZone = ({ name, role, cards, x, y, isActive, isTDC, isPresident }) => (
    <div style={{ position: 'absolute', top: y, left: x, textAlign: 'center', transform: 'translateX(-50%)' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', margin: '0 auto',
        background: FEUTRE.felt, border: `2px solid ${isActive ? FEUTRE.gold : FEUTRE.gold + '44'}`,
        display: 'grid', placeItems: 'center',
        fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, fontSize: 26, color: FEUTRE.gold,
        boxShadow: isActive ? `0 0 0 6px ${FEUTRE.gold}33` : 'none',
        animation: (isDone && (isTDC || isPresident)) ? `cardReceive 0.6s ease 0.2s` : 'none',
      }}>{name[0]}</div>
      <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 700, fontSize: 16, color: FEUTRE.cream, marginTop: 8 }}>{name}</div>
      <div style={{ fontFamily: 'Space Grotesk', fontSize: 9, letterSpacing: 3, color: FEUTRE.gold, marginTop: 2 }}>{role}</div>
      {/* Card display */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: -12, marginTop: 10 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ marginLeft: i === 0 ? 0 : -14, transform: `rotate(${(i - Math.floor(cards.length / 2)) * 4}deg)` }}>
            <AnimCard rank={c.rank} suit={c.suit} />
          </div>
        ))}
      </div>
    </div>
  );

  // Flying cards
  const FlyingCard = ({ rank, suit, direction }) => {
    const anim = direction === 'down' ? 'flyToTDC' : 'flyToPresident';
    return (
      <AnimCard rank={rank} suit={suit}
        style={{ position: 'absolute', top: 200, left: 400, zIndex: 10 }}
        animStyle={{ animation: `${anim} 1.1s cubic-bezier(.4,0,.2,1) forwards` }}
      />
    );
  };

  return (
    <div style={{ width, height, background: FEUTRE.felt, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk' }}>
      <style>{ANIM_CSS}</style>
      {/* Gold frame */}
      <div style={{ position: 'absolute', inset: 18, border: `0.6px solid ${FEUTRE.gold}`, opacity: 0.6 }} />
      <div style={{ position: 'absolute', inset: 24, border: `0.3px solid ${FEUTRE.gold}`, opacity: 0.4 }} />

      {/* Phase header */}
      <div style={{ position: 'absolute', top: 32, left: 0, right: 0, textAlign: 'center', color: FEUTRE.cream }}>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: 5, color: FEUTRE.gold }}>{phase.id.replace(/_/g, ' ').toUpperCase()}</div>
        <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, fontSize: 32, marginTop: 6 }}>{phase.label}</div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4, fontStyle: 'italic' }}>{phase.desc}</div>
      </div>

      {/* Players */}
      <PlayerZone name="Juliette" role="PRÉSIDENTE" isActive={isPresidentGiving || isDone} isPresident
        x={450} y={120}
        cards={[
          { rank: 'A', suit: 'pique' },
          { rank: '2', suit: 'coeur' },
          ...(isDone ? [{ rank: 'A', suit: 'coeur' }, { rank: '2', suit: 'pique' }] : []),
        ]}
      />
      <PlayerZone name="Antoine" role="VICE" x={160} y={200} cards={[{ rank: 'D', suit: 'pique' }, { rank: 'V', suit: 'coeur' }, { rank: '9', suit: 'trefle' }]} />
      <PlayerZone name="Marcel" role="NEUTRE" x={740} y={200} cards={[{ rank: '8', suit: 'carreau' }, { rank: '7', suit: 'pique' }, { rank: '10', suit: 'trefle' }]} />
      <PlayerZone name="Clémence" role="VICE-TDC" x={240} y={400} cards={[{ rank: '5', suit: 'coeur' }, { rank: '4', suit: 'pique' }]} />
      <PlayerZone name="Hugo" role="TROU DU CUL" isActive={isTDCGiving} isTDC
        x={660} y={400}
        cards={
          isDone
            ? [{ rank: '3', suit: 'pique' }, { rank: '4', suit: 'carreau' }]
            : [{ rank: '3', suit: 'pique' }, { rank: '4', suit: 'carreau' }, { rank: 'A', suit: 'coeur' }, { rank: '2', suit: 'pique' }]
        }
      />

      {/* Flying cards animation */}
      {isTDCGiving && (
        <React.Fragment key={`tdc-${animKey}`}>
          <FlyingCard rank="A" suit="coeur" direction="up" />
          <FlyingCard rank="2" suit="pique" direction="up" />
        </React.Fragment>
      )}
      {isPresidentGiving && (
        <React.Fragment key={`pres-${animKey}`}>
          <FlyingCard rank="5" suit="trefle" direction="down" />
          <FlyingCard rank="6" suit="carreau" direction="down" />
        </React.Fragment>
      )}

      {/* Arrow hint */}
      {isTDCGiving && (
        <svg style={{ position: 'absolute', top: 300, left: 400, pointerEvents: 'none' }} width="100" height="160">
          <defs>
            <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill={FEUTRE.gold} />
            </marker>
          </defs>
          <path d="M 50 130 Q 60 80 50 20" fill="none" stroke={FEUTRE.gold} strokeWidth="1.5" strokeDasharray="5,4" markerEnd="url(#arr)" opacity="0.8" />
        </svg>
      )}
      {isPresidentGiving && (
        <svg style={{ position: 'absolute', top: 240, left: 395, pointerEvents: 'none' }} width="100" height="200">
          <defs>
            <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill={FEUTRE.gold} />
            </marker>
          </defs>
          <path d="M 50 20 Q 60 80 55 150" fill="none" stroke={FEUTRE.gold} strokeWidth="1.5" strokeDasharray="5,4" markerEnd="url(#arr2)" opacity="0.8" />
        </svg>
      )}

      {/* Controls */}
      <div style={{ position: 'absolute', bottom: 36, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {PHASES.map((_, i) => (
            <div key={i} style={{ width: i === phaseIdx ? 20 : 8, height: 8, borderRadius: 4, background: i === phaseIdx ? FEUTRE.gold : FEUTRE.gold + '44', transition: 'all .3s' }} />
          ))}
        </div>
        {phaseIdx > 0 && (
          <button onClick={prev} style={{ background: 'transparent', color: FEUTRE.cream, border: `1px solid ${FEUTRE.gold}`, padding: '8px 18px', fontSize: 11, letterSpacing: 2, fontFamily: 'Space Grotesk', cursor: 'pointer' }}>← PRÉCÉDENT</button>
        )}
        {phaseIdx < PHASES.length - 1 ? (
          <button onClick={next} style={{ background: FEUTRE.gold, color: FEUTRE.felt, border: 'none', padding: '10px 20px', fontSize: 11, fontWeight: 700, letterSpacing: 2.5, fontFamily: 'Space Grotesk', cursor: 'pointer' }}>SUIVANT →</button>
        ) : (
          <button onClick={reset} style={{ background: FEUTRE.gold, color: FEUTRE.felt, border: 'none', padding: '10px 20px', fontSize: 11, fontWeight: 700, letterSpacing: 2.5, fontFamily: 'Space Grotesk', cursor: 'pointer' }}>↺ RECOMMENCER</button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  PopMobileTable, FeutreMobileTable, RisoMobileTable, DecoMobileTable,
  CardAnimExchange,
});
