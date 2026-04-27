// Screens for Direction 3 — "Risographie"

function RisoLanding({ width = 1280, height = 800 }) {
  return (
    <div style={{ width, height, background: RISO.paper, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: RISO.ink }}>
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={width} height={height}>
        <defs>
          <pattern id="landGrain" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill={RISO.ink} opacity="0.1" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#landGrain)" />
      </svg>

      {/* Top nav */}
      <div style={{ position: 'absolute', top: 32, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: RISO.ink, color: RISO.pink, display: 'grid', placeItems: 'center', fontFamily: 'Archivo Black', fontSize: 20 }}>P</div>
          <div style={{ fontFamily: 'Archivo Black', fontSize: 18 }}>PRÉSIDENT!</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ border: `2px solid ${RISO.ink}`, padding: '8px 14px', fontSize: 12, fontWeight: 700 }}>RÈGLES</div>
          <div style={{ border: `2px solid ${RISO.ink}`, padding: '8px 14px', fontSize: 12, fontWeight: 700 }}>AMIS</div>
          <div style={{ background: RISO.ink, color: RISO.paper, padding: '10px 16px', fontSize: 12, fontWeight: 700 }}>CONNEXION</div>
        </div>
      </div>

      {/* Hero big blocks */}
      <div style={{ position: 'absolute', top: 110, left: 48, right: 48, bottom: 48, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Headline block */}
          <div style={{ background: RISO.pink, border: `3px solid ${RISO.ink}`, padding: '36px 32px', flex: 1, position: 'relative', boxShadow: `10px 10px 0 ${RISO.ink}` }}>
            <div style={{ fontSize: 13, letterSpacing: 3, fontWeight: 700 }}>JEU · 3→8 · ~20 MIN</div>
            <h1 style={{ fontFamily: 'Archivo Black', fontSize: 130, lineHeight: 0.88, margin: '16px 0 0', letterSpacing: -4 }}>
              MONTE<br/>OU<br/>CHUTE.
            </h1>
          </div>
          {/* CTA block */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: RISO.ink, color: RISO.paper, border: `3px solid ${RISO.ink}`, padding: '22px 24px' }}>
              <div style={{ fontSize: 10, letterSpacing: 3, opacity: 0.7 }}>CRÉER</div>
              <div style={{ fontFamily: 'Archivo Black', fontSize: 28, marginTop: 4, color: RISO.pink }}>UNE PARTIE →</div>
            </div>
            <div style={{ background: RISO.mint, border: `3px solid ${RISO.ink}`, padding: '22px 24px' }}>
              <div style={{ fontSize: 10, letterSpacing: 3 }}>REJOINDRE</div>
              <div style={{ fontFamily: 'Archivo Black', fontSize: 28, marginTop: 4 }}>CODE →</div>
            </div>
          </div>
        </div>
        {/* Card stack */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 40, left: 20, transform: 'rotate(-11deg)' }}>
            <RisoCardBack width={200} height={290} />
          </div>
          <div style={{ position: 'absolute', top: 10, left: 110, transform: 'rotate(6deg)', zIndex: 2 }}>
            <RisoKingOfHearts width={220} height={310} />
          </div>
          <div style={{ position: 'absolute', top: 260, left: 70, transform: 'rotate(-4deg)' }}>
            <RisoAceOfSpades width={200} height={290} />
          </div>
          {/* Sticker */}
          <div style={{ position: 'absolute', bottom: 40, right: 0, background: RISO.blue, color: RISO.paper, border: `3px solid ${RISO.ink}`, padding: '16px 20px', transform: 'rotate(7deg)', maxWidth: 180 }}>
            <div style={{ fontFamily: 'Archivo Black', fontSize: 24, lineHeight: 1 }}>TROU.</div>
            <div style={{ fontFamily: 'Archivo Black', fontSize: 24, lineHeight: 1 }}>DU.</div>
            <div style={{ fontFamily: 'Archivo Black', fontSize: 24, lineHeight: 1 }}>CUL.</div>
            <div style={{ fontSize: 10, letterSpacing: 2, marginTop: 6, opacity: 0.85 }}>LE PERDANT AURA UN NOM</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RisoMiniCard({ rank, suit, selected }) {
  const color = (suit === 'coeur' || suit === 'carreau') ? RISO.pink : RISO.ink;
  return (
    <div style={{
      width: 80, height: 116, background: RISO.paper, border: `2.5px solid ${RISO.ink}`, borderRadius: 4,
      position: 'relative',
      boxShadow: selected ? `5px 5px 0 ${RISO.blue}` : `3px 3px 0 ${RISO.ink}`,
    }}>
      <div style={{ position: 'absolute', top: 4, left: 6, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Archivo Black', fontSize: 16, color }}>{rank}</div>
        <div style={{ marginTop: 2 }}><Pip suit={suit} size={9} color={color} /></div>
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Pip suit={suit} size={30} color={color} />
      </div>
    </div>
  );
}

function RisoTable({ width = 1280, height = 800 }) {
  const hand = [
    { rank: '7', suit: 'pique' },
    { rank: '9', suit: 'trefle' },
    { rank: '10', suit: 'coeur' },
    { rank: 'V', suit: 'pique' },
    { rank: 'D', suit: 'carreau', selected: true },
    { rank: 'R', suit: 'coeur' },
    { rank: '2', suit: 'pique' },
  ];
  return (
    <div style={{ width, height, background: RISO.mint, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: RISO.ink }}>
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={width} height={height}>
        <defs>
          <pattern id="tableGrain" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill={RISO.ink} opacity="0.1" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#tableGrain)" />
      </svg>

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: RISO.ink, color: RISO.paper, padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ fontFamily: 'Archivo Black', color: RISO.pink, fontSize: 18 }}>PRÉSIDENT!</div>
          <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7 }}>PARTIE 4827 · MANCHE 3</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 11, letterSpacing: 2 }}>
          <span>TON TOUR →</span>
          <span style={{ background: RISO.pink, color: RISO.ink, padding: '6px 12px', fontFamily: 'Archivo Black' }}>28s</span>
        </div>
      </div>

      {/* Players as chunky badges */}
      {[
        { name: 'JULIETTE', role: 'PRÉSIDENTE', cards: 4, pos: { top: 80, left: '50%', transform: 'translateX(-50%)' }, color: RISO.pink },
        { name: 'ANTOINE', role: 'VICE', cards: 5, pos: { top: 180, left: 50 }, color: RISO.blue },
        { name: 'CLÉMENCE', role: 'NEUTRE', cards: 6, pos: { top: 180, right: 50 }, color: RISO.paper },
        { name: 'HUGO', role: 'V-TDC', cards: 7, pos: { top: 370, left: 50 }, color: RISO.paper },
        { name: 'NINA', role: 'TROU DU CUL', cards: 9, pos: { top: 370, right: 50 }, color: RISO.ink },
      ].map((p, i) => (
        <div key={i} style={{ position: 'absolute', ...p.pos }}>
          <div style={{
            background: p.color, color: p.color === RISO.ink ? RISO.paper : RISO.ink,
            border: `2.5px solid ${RISO.ink}`, padding: '10px 16px', boxShadow: `4px 4px 0 ${RISO.ink}`,
            minWidth: 150,
          }}>
            <div style={{ fontFamily: 'Archivo Black', fontSize: 16 }}>{p.name}</div>
            <div style={{ fontSize: 10, letterSpacing: 2, marginTop: 2 }}>{p.role} · {p.cards}♠</div>
          </div>
        </div>
      ))}

      {/* Center play */}
      <div style={{ position: 'absolute', top: 260, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0 }}>
        <div style={{ transform: 'rotate(-8deg)' }}><RisoMiniCard rank="10" suit="coeur" /></div>
        <div style={{ transform: 'rotate(3deg)', marginLeft: -24 }}><RisoMiniCard rank="10" suit="pique" /></div>
        <div style={{ transform: 'rotate(12deg)', marginLeft: -24 }}><RisoMiniCard rank="10" suit="trefle" /></div>
      </div>
      <div style={{ position: 'absolute', top: 410, left: '50%', transform: 'translateX(-50%)', background: RISO.ink, color: RISO.paper, padding: '6px 14px', fontFamily: 'Archivo Black', fontSize: 12, letterSpacing: 2 }}>
        ▸ TROIS 10 · À BATTRE
      </div>

      {/* Hand dock */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: RISO.paper, borderTop: `3px solid ${RISO.ink}`, padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Archivo Black', fontSize: 20 }}>MARCEL</div>
          <div style={{ fontSize: 10, letterSpacing: 2 }}>NEUTRE · 7 CARTES</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button style={{ background: RISO.pink, border: `2.5px solid ${RISO.ink}`, boxShadow: `3px 3px 0 ${RISO.ink}`, color: RISO.ink, padding: '10px 18px', fontFamily: 'Archivo Black', fontSize: 13, letterSpacing: 1 }}>JOUER!</button>
            <button style={{ background: RISO.paper, border: `2.5px solid ${RISO.ink}`, color: RISO.ink, padding: '10px 18px', fontFamily: 'Archivo Black', fontSize: 13 }}>PASSER</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: -22 }}>
          {hand.map((c, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : -22, transform: `translateY(${c.selected ? -16 : 0}px) rotate(${(i - 3) * 2.5}deg)` }}>
              <RisoMiniCard rank={c.rank} suit={c.suit} selected={c.selected} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RisoEndgame({ width = 1280, height = 800 }) {
  const ranks = [
    { title: 'PRÉSIDENTE', name: 'JULIETTE', bg: RISO.pink, pts: '+3' },
    { title: 'VICE-PRÉSIDENT', name: 'ANTOINE', bg: RISO.mint, pts: '+2' },
    { title: 'NEUTRE', name: 'MARCEL', bg: RISO.paper, pts: '0' },
    { title: 'V-TROU DU CUL', name: 'CLÉMENCE', bg: RISO.paper, pts: '−1' },
    { title: 'TROU DU CUL', name: 'HUGO', bg: RISO.ink, pts: '−3', dark: true },
  ];
  return (
    <div style={{ width, height, background: RISO.paper, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: RISO.ink }}>
      {/* Diagonal header banner */}
      <div style={{ position: 'absolute', top: 50, left: -20, right: -20, background: RISO.pink, border: `3px solid ${RISO.ink}`, padding: '28px 48px', transform: 'rotate(-2deg)', boxShadow: `0 10px 0 ${RISO.ink}` }}>
        <div style={{ fontSize: 12, letterSpacing: 4, fontWeight: 700 }}>MANCHE TERMINÉE · 18.04.2026</div>
        <div style={{ fontFamily: 'Archivo Black', fontSize: 64, lineHeight: 1, marginTop: 6 }}>
          LE CLASSEMENT, <span style={{ background: RISO.ink, color: RISO.pink, padding: '0 14px' }}>C'EST LUI.</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 260, left: 48, right: 48, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ranks.map((r, i) => (
          <div key={i} style={{
            background: r.bg, color: r.dark ? RISO.paper : RISO.ink,
            border: `2.5px solid ${RISO.ink}`, boxShadow: `5px 5px 0 ${RISO.ink}`,
            padding: '16px 24px',
            display: 'grid', gridTemplateColumns: '60px 1fr auto 100px', gap: 20, alignItems: 'center',
          }}>
            <div style={{ fontFamily: 'Archivo Black', fontSize: 40, lineHeight: 1 }}>{i + 1}</div>
            <div style={{ fontFamily: 'Archivo Black', fontSize: 26 }}>{r.name}</div>
            <div style={{ fontSize: 11, letterSpacing: 3, fontWeight: 700 }}>{r.title}</div>
            <div style={{ fontFamily: 'Archivo Black', fontSize: 34, textAlign: 'right', color: r.pts.startsWith('+') ? (r.dark ? RISO.pink : RISO.blue) : r.pts === '0' ? 'inherit' : (r.dark ? RISO.pink : RISO.ink) }}>{r.pts}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { RisoLanding, RisoTable, RisoEndgame, RisoMiniCard });
