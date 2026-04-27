// Screens for Direction 4 — "Art Déco Moderne"

function DecoLanding({ width = 1280, height = 800 }) {
  return (
    <div style={{ width, height, background: DECO.noir, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: DECO.paper }}>
      {/* Gold frame */}
      <div style={{ position: 'absolute', inset: 24, border: `0.8px solid ${DECO.gold}` }} />
      <div style={{ position: 'absolute', inset: 30, border: `0.3px solid ${DECO.gold}`, opacity: 0.6 }} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 52, left: 56, right: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: `0.5px solid ${DECO.gold}44` }}>
        <div style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontWeight: 900, fontSize: 24, color: DECO.goldLight }}>P.</div>
        <div style={{ display: 'flex', gap: 36, fontSize: 11, letterSpacing: 3, color: DECO.paper, textTransform: 'uppercase' }}>
          <span>Jouer</span>
          <span>Règles</span>
          <span>Maison</span>
          <span style={{ color: DECO.gold }}>Membre</span>
        </div>
      </div>

      {/* Hero — centered */}
      <div style={{ position: 'absolute', top: 140, left: 56, right: 56, display: 'grid', gridTemplateColumns: '1fr 420px', gap: 60 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 6, color: DECO.gold, fontFamily: 'JetBrains Mono' }}>— MCMLXI · N° 01 —</div>
          <h1 style={{ fontFamily: 'Bodoni Moda', fontWeight: 900, fontStyle: 'italic', fontSize: 136, lineHeight: 0.88, margin: '28px 0 0', letterSpacing: -3, color: DECO.paper }}>
            Président
          </h1>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 4, color: DECO.gold, marginTop: 16 }}>
            — AUTREMENT DIT, <span style={{ color: DECO.red }}>LE TROU DU CUL</span> —
          </div>
          <p style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontSize: 20, color: DECO.paper, maxWidth: 460, lineHeight: 1.4, marginTop: 40, opacity: 0.85 }}>
            Un jeu de rangs et de revanche. Chaque main redessine la cour — qui montera, qui gardera son siège, qui ramassera les pires cartes du suivant.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 44, alignItems: 'center' }}>
            <button style={{ background: DECO.gold, color: DECO.noir, border: 'none', padding: '14px 30px', fontSize: 11, fontWeight: 700, letterSpacing: 4, fontFamily: 'JetBrains Mono' }}>OUVRIR LA TABLE</button>
            <button style={{ background: 'transparent', color: DECO.paper, border: `0.8px solid ${DECO.gold}`, padding: '13px 28px', fontSize: 11, letterSpacing: 3, fontFamily: 'JetBrains Mono' }}>CODE D'INVITATION</button>
          </div>

          <div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, paddingTop: 28, borderTop: `0.5px solid ${DECO.gold}44`, maxWidth: 520 }}>
            {[
              ['MIN.', '3 joueurs'],
              ['DURÉE', '~ 20 min'],
              ['CARTES', '52 lames'],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 3, color: DECO.gold }}>{k}</div>
                <div style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontSize: 22, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards showcase */}
        <div style={{ position: 'relative', alignSelf: 'center' }}>
          <div style={{ position: 'absolute', top: -20, left: -40, transform: 'rotate(-9deg)' }}>
            <DecoCardBack width={180} height={260} />
          </div>
          <div style={{ position: 'absolute', top: 20, left: 140, transform: 'rotate(4deg) translateY(20px)', zIndex: 2 }}>
            <DecoKingOfHearts width={220} height={310} />
          </div>
          <div style={{ position: 'absolute', top: 280, left: 30, transform: 'rotate(-3deg)' }}>
            <DecoAceOfSpades width={180} height={260} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DecoMiniCard({ rank, suit, selected }) {
  const color = (suit === 'coeur' || suit === 'carreau') ? DECO.red : DECO.ink;
  return (
    <div style={{
      width: 82, height: 118, background: DECO.paper, border: `1px solid ${DECO.ink}`, borderRadius: 4,
      position: 'relative',
      boxShadow: selected ? `0 0 0 2px ${DECO.gold}, 0 12px 24px -8px rgba(0,0,0,0.6)` : '0 6px 16px -6px rgba(0,0,0,0.5)',
    }}>
      <div style={{ position: 'absolute', inset: 4, border: `0.4px solid ${DECO.gold}`, opacity: 0.7, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 6, left: 8, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Bodoni Moda', fontWeight: 900, fontStyle: 'italic', fontSize: 17, color }}>{rank}</div>
        <div style={{ marginTop: 1 }}><Pip suit={suit} size={9} color={color} /></div>
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Pip suit={suit} size={30} color={color} />
      </div>
    </div>
  );
}

function DecoTable({ width = 1280, height = 800 }) {
  const hand = [
    { rank: '7', suit: 'carreau' },
    { rank: '8', suit: 'pique' },
    { rank: '10', suit: 'trefle' },
    { rank: 'V', suit: 'coeur', selected: true },
    { rank: 'D', suit: 'pique' },
    { rank: 'R', suit: 'coeur' },
    { rank: 'A', suit: 'trefle' },
  ];
  return (
    <div style={{ width, height, background: DECO.noir, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: DECO.paper }}>
      <div style={{ position: 'absolute', inset: 16, border: `0.6px solid ${DECO.gold}44` }} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 28, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontWeight: 900, fontSize: 20, color: DECO.goldLight }}>Président</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 3, color: DECO.gold }}>SALON III · MANCHE 03 · 22:47</div>
      </div>

      {/* Central oval felt */}
      <div style={{ position: 'absolute', top: 100, left: 48, right: 48, bottom: 200 }}>
        <svg viewBox="0 0 1184 500" width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
          <ellipse cx="592" cy="250" rx="520" ry="200" fill={DECO.ink} stroke={DECO.gold} strokeWidth="0.8" />
          <ellipse cx="592" cy="250" rx="510" ry="190" fill="none" stroke={DECO.gold} strokeWidth="0.3" />
        </svg>

        {/* Players around oval */}
        {[
          { name: 'Juliette', role: 'PRÉSIDENTE', cards: 4, pos: { top: 20, left: '50%', transform: 'translateX(-50%)' } },
          { name: 'Antoine', role: 'VICE', cards: 5, pos: { top: 180, left: 40 } },
          { name: 'Clémence', role: 'NEUTRE', cards: 6, pos: { top: 180, right: 40 } },
          { name: 'Hugo', role: 'V-TDC', cards: 7, pos: { bottom: 40, left: 130 } },
          { name: 'Nina', role: 'TROU DU CUL', cards: 9, pos: { bottom: 40, right: 130 } },
        ].map((p, i) => (
          <div key={i} style={{ position: 'absolute', ...p.pos, textAlign: 'center', width: 140 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: DECO.noir, border: `1px solid ${DECO.gold}`, margin: '0 auto', display: 'grid', placeItems: 'center', fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontWeight: 900, fontSize: 22, color: DECO.goldLight }}>{p.name[0]}</div>
            <div style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontWeight: 700, fontSize: 18, marginTop: 6 }}>{p.name}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, letterSpacing: 3, color: DECO.gold, marginTop: 2 }}>{p.role} · {p.cards}</div>
          </div>
        ))}

        {/* Play pile center */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex' }}>
          <div style={{ transform: 'rotate(-8deg)' }}><DecoMiniCard rank="V" suit="pique" /></div>
          <div style={{ transform: 'rotate(4deg)', marginLeft: -22, zIndex: 2 }}><DecoMiniCard rank="V" suit="coeur" /></div>
        </div>
        <div style={{ position: 'absolute', top: '66%', left: '50%', transform: 'translate(-50%, 0)', fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 4, color: DECO.gold }}>
          ▸ PAIRE DE VALETS
        </div>
      </div>

      {/* Hand dock */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, borderTop: `0.5px solid ${DECO.gold}44`, padding: '22px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 3, color: DECO.gold }}>VOTRE MAIN</div>
          <div style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontWeight: 900, fontSize: 30, marginTop: 2 }}>Marcel</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button style={{ background: DECO.gold, color: DECO.noir, border: 'none', padding: '10px 22px', fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 3, fontWeight: 700 }}>JOUER</button>
            <button style={{ background: 'transparent', color: DECO.paper, border: `0.8px solid ${DECO.gold}`, padding: '9px 20px', fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 3 }}>PASSER</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: -26 }}>
          {hand.map((c, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : -26, transform: `translateY(${c.selected ? -18 : 0}px) rotate(${(i - 3) * 3}deg)` }}>
              <DecoMiniCard rank={c.rank} suit={c.suit} selected={c.selected} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DecoEndgame({ width = 1280, height = 800 }) {
  const ranks = [
    { title: 'PRÉSIDENTE', name: 'Juliette', pts: '+III' },
    { title: 'VICE-PRÉSIDENT', name: 'Antoine', pts: '+II' },
    { title: 'NEUTRE', name: 'Marcel', pts: '—' },
    { title: 'VICE-TROU-DU-CUL', name: 'Clémence', pts: '−I' },
    { title: 'TROU DU CUL', name: 'Hugo', pts: '−III' },
  ];
  return (
    <div style={{ width, height, background: DECO.noir, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: DECO.paper }}>
      <div style={{ position: 'absolute', inset: 24, border: `0.8px solid ${DECO.gold}` }} />
      <div style={{ position: 'absolute', inset: 30, border: `0.3px solid ${DECO.gold}`, opacity: 0.6 }} />

      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 6, color: DECO.gold }}>— CLÔTURE DE MANCHE —</div>
        <h1 style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontWeight: 900, fontSize: 80, margin: '20px 0 0', letterSpacing: -2 }}>
          La cour est <span style={{ color: DECO.goldLight }}>constituée</span>
        </h1>
        <div style={{ width: 60, height: 1, background: DECO.gold, margin: '28px auto 0' }} />
      </div>

      <div style={{ position: 'absolute', top: 260, left: 80, right: 80 }}>
        {ranks.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '70px 1fr auto 100px', gap: 30, alignItems: 'center',
            padding: '22px 0', borderBottom: `0.4px solid ${DECO.gold}33`,
          }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 3, color: DECO.gold }}>
              {['I','II','III','IV','V'][i]}
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 3, color: DECO.gold }}>{r.title}</div>
              <div style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontWeight: 900, fontSize: 38, marginTop: 4, color: i === 0 ? DECO.goldLight : DECO.paper }}>{r.name}</div>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2, opacity: 0.55, maxWidth: 240, textAlign: 'right' }}>
              {['reçoit les 2 meilleures','reçoit la meilleure','ne change rien','donne sa meilleure','donne ses 2 meilleures'][i]}
            </div>
            <div style={{ fontFamily: 'Bodoni Moda', fontStyle: 'italic', fontSize: 40, textAlign: 'right', color: r.pts.startsWith('+') ? DECO.goldLight : r.pts === '—' ? DECO.paper : DECO.red }}>
              {r.pts}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { DecoLanding, DecoTable, DecoEndgame, DecoMiniCard });
