// Screens for Direction 2 — "Feutre"

function FeutreLanding({ width = 1280, height = 800 }) {
  return (
    <div style={{ width, height, background: FEUTRE.felt, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: FEUTRE.cream }}>
      {/* Gold border frame */}
      <div style={{ position: 'absolute', inset: 20, border: `1px solid ${FEUTRE.gold}`, opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 26, border: `0.4px solid ${FEUTRE.gold}`, opacity: 0.5, pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 40, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${FEUTRE.gold}`, display: 'grid', placeItems: 'center', fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, fontSize: 22, color: FEUTRE.gold }}>P</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, fontSize: 22 }}>Président</div>
            <div style={{ fontSize: 9, letterSpacing: 3, opacity: 0.6 }}>CLUB PRIVÉ · DEPUIS 1961</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28, fontSize: 13, letterSpacing: 1 }}>
          <span>Salons</span>
          <span>Règles</span>
          <span>Tournois</span>
          <span style={{ border: `1px solid ${FEUTRE.gold}`, color: FEUTRE.gold, padding: '6px 16px' }}>Accès membre</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: 'absolute', top: 140, left: 48, right: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: 5, color: FEUTRE.gold, fontWeight: 600 }}>— LE GRAND JEU DE SOCIÉTÉ —</div>
        <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 900, fontStyle: 'italic', fontSize: 150, lineHeight: 0.95, color: FEUTRE.cream, margin: '24px 0 0', letterSpacing: -4 }}>
          Président
        </h1>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 22, color: FEUTRE.gold, marginTop: 14, fontStyle: 'italic', opacity: 0.9 }}>
          — dit <span style={{ textDecoration: 'line-through', textDecorationColor: FEUTRE.red, textDecorationThickness: 2 }}>Trou du Cul</span>
        </div>
      </div>

      {/* Right card display */}
      <div style={{ position: 'absolute', top: 200, right: 80, display: 'flex', gap: -40 }}>
        <div style={{ transform: 'rotate(-14deg) translateY(50px)' }}>
          <FeutreCardBack width={180} height={260} />
        </div>
        <div style={{ transform: 'rotate(-4deg)', marginLeft: -50 }}>
          <FeutreKingOfHearts width={200} height={290} />
        </div>
        <div style={{ transform: 'rotate(8deg) translateY(30px)', marginLeft: -50 }}>
          <FeutreAceOfSpades width={180} height={260} />
        </div>
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: 60, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <button style={{ background: FEUTRE.gold, color: FEUTRE.felt, border: 'none', padding: '16px 32px', fontSize: 12, fontWeight: 700, letterSpacing: 3, fontFamily: 'Space Grotesk', cursor: 'pointer' }}>
              OUVRIR UNE TABLE
            </button>
            <button style={{ background: 'transparent', color: FEUTRE.cream, border: `1px solid ${FEUTRE.gold}`, padding: '14px 30px', fontSize: 12, fontWeight: 500, letterSpacing: 2 }}>
              Rejoindre un salon
            </button>
          </div>
          <div style={{ fontSize: 11, opacity: 0.5, marginTop: 14, letterSpacing: 1.5, maxWidth: 340, lineHeight: 1.5 }}>
            Créez une table, invitez vos convives, et que le dernier à se défausser assume son rang.
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, letterSpacing: 3, color: FEUTRE.gold, opacity: 0.8 }}>
          N° 0042 · SÉRIE LIMITÉE
        </div>
      </div>
    </div>
  );
}

function FeutreMiniCard({ rank, suit, selected, dim }) {
  const color = (suit === 'coeur' || suit === 'carreau') ? FEUTRE.red : FEUTRE.ink;
  return (
    <div style={{
      width: 84, height: 120, background: FEUTRE.cream, border: `1.5px solid ${FEUTRE.ink}`, borderRadius: 6,
      position: 'relative',
      opacity: dim ? 0.6 : 1,
      boxShadow: selected ? `0 10px 0 -4px ${FEUTRE.gold}, 0 14px 28px -10px rgba(0,0,0,0.4)` : '0 6px 14px -6px rgba(0,0,0,0.4)',
    }}>
      <div style={{ position: 'absolute', top: 6, left: 8, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Playfair Display', fontWeight: 900, fontSize: 17, color }}>{rank}</div>
        <div style={{ marginTop: 1 }}><Pip suit={suit} size={10} color={color} /></div>
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Pip suit={suit} size={32} color={color} />
      </div>
    </div>
  );
}

function FeutreTable({ width = 1280, height = 800 }) {
  const hand = [
    { rank: '8', suit: 'trefle' },
    { rank: '9', suit: 'carreau' },
    { rank: '10', suit: 'coeur' },
    { rank: 'V', suit: 'pique', selected: true },
    { rank: 'V', suit: 'coeur', selected: true },
    { rank: 'D', suit: 'pique' },
    { rank: 'R', suit: 'carreau' },
  ];
  return (
    <div style={{ width, height, background: FEUTRE.felt, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: FEUTRE.cream }}>
      {/* Frame */}
      <div style={{ position: 'absolute', inset: 16, border: `1px solid ${FEUTRE.gold}`, opacity: 0.5 }} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 36, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, letterSpacing: 2.5, color: FEUTRE.gold }}>
          <span style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 22, color: FEUTRE.cream, letterSpacing: 0 }}>P</span>
          <span>SALON NOIR · MANCHE III</span>
        </div>
        <div style={{ fontSize: 11, letterSpacing: 2.5, color: FEUTRE.cream, opacity: 0.7 }}>22:47 · 5 JOUEURS</div>
      </div>

      {/* Players ring */}
      {[
        { name: 'Juliette', role: 'PRÉSIDENTE', cards: 4, pos: { top: 100, left: '50%', transform: 'translateX(-50%)' }, top: true },
        { name: 'Antoine', role: 'VICE', cards: 5, pos: { top: 200, left: 80 } },
        { name: 'Clémence', role: 'NEUTRE', cards: 6, pos: { top: 200, right: 80 } },
        { name: 'Hugo', role: 'V-TDC', cards: 8, pos: { bottom: 240, left: 120 } },
        { name: 'Nina', role: 'TDC', cards: 9, pos: { bottom: 240, right: 120 } },
      ].map((p, i) => (
        <div key={i} style={{ position: 'absolute', ...p.pos, textAlign: 'center', width: 140 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', border: `1.2px solid ${FEUTRE.gold}`, background: FEUTRE.feltDark, margin: '0 auto', display: 'grid', placeItems: 'center', fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, fontSize: 22, color: FEUTRE.gold }}>
            {p.name[0]}
          </div>
          <div style={{ fontSize: 14, fontFamily: 'Playfair Display', fontWeight: 700, marginTop: 8, color: FEUTRE.cream }}>{p.name}</div>
          <div style={{ fontSize: 9, letterSpacing: 2.5, color: FEUTRE.gold, marginTop: 2 }}>{p.role} · {p.cards}♠</div>
          {/* mini card back row */}
          <div style={{ display: 'flex', gap: -10, justifyContent: 'center', marginTop: 8 }}>
            {Array.from({ length: Math.min(p.cards, 5) }).map((_, j) => (
              <div key={j} style={{ marginLeft: j === 0 ? 0 : -10, width: 14, height: 22, background: FEUTRE.red, border: `0.8px solid ${FEUTRE.gold}`, borderRadius: 2 }} />
            ))}
          </div>
        </div>
      ))}

      {/* Center play pile */}
      <div style={{ position: 'absolute', top: '52%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {/* Circular felt */}
        <div style={{ width: 360, height: 180, borderRadius: 180, background: FEUTRE.feltDark, border: `1px solid ${FEUTRE.gold}`, boxShadow: `inset 0 0 60px rgba(0,0,0,0.5)` }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: -30 }}>
          <div style={{ transform: 'rotate(-10deg) translateX(20px)' }}><FeutreMiniCard rank="D" suit="coeur" /></div>
          <div style={{ transform: 'rotate(0deg)', marginLeft: -30, zIndex: 2 }}><FeutreMiniCard rank="D" suit="pique" /></div>
        </div>
        <div style={{ position: 'absolute', top: 200, left: '50%', transform: 'translateX(-50%)', fontSize: 10, letterSpacing: 4, color: FEUTRE.gold }}>
          ▸ DEUX DAMES
        </div>
      </div>

      {/* Hand dock */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, padding: '20px 48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', background: `linear-gradient(to top, ${FEUTRE.feltDark}, transparent)` }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: FEUTRE.gold }}>VOTRE MAIN</div>
          <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 700, fontSize: 22, marginTop: 4 }}>Marcel · Neutre</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button style={{ background: FEUTRE.gold, color: FEUTRE.felt, border: 'none', padding: '10px 22px', fontSize: 11, fontWeight: 700, letterSpacing: 2.5 }}>JOUER ♦ PAIRE</button>
            <button style={{ background: 'transparent', color: FEUTRE.cream, border: `1px solid ${FEUTRE.gold}`, padding: '9px 20px', fontSize: 11, letterSpacing: 2 }}>PASSER</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: -28 }}>
          {hand.map((c, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : -28, transform: `translateY(${c.selected ? -18 : 0}px) rotate(${(i - 3) * 3}deg)`, transition: 'transform .2s' }}>
              <FeutreMiniCard rank={c.rank} suit={c.suit} selected={c.selected} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeutreEndgame({ width = 1280, height = 800 }) {
  const ranks = [
    { title: 'PRÉSIDENTE', name: 'Juliette', points: '+3' },
    { title: 'VICE-PRÉSIDENT', name: 'Antoine', points: '+2' },
    { title: 'NEUTRE', name: 'Marcel', points: '0' },
    { title: 'VICE-TROU-DU-CUL', name: 'Clémence', points: '−1' },
    { title: 'TROU DU CUL', name: 'Hugo', points: '−3' },
  ];
  return (
    <div style={{ width, height, background: FEUTRE.felt, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk', color: FEUTRE.cream }}>
      <div style={{ position: 'absolute', inset: 20, border: `1px solid ${FEUTRE.gold}`, opacity: 0.5 }} />

      <div style={{ position: 'absolute', top: 64, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 5, color: FEUTRE.gold }}>— PROCLAMATION —</div>
        <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 900, fontStyle: 'italic', fontSize: 78, margin: '16px 0 4px', lineHeight: 1 }}>
          La hiérarchie est établie
        </h1>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 18, color: FEUTRE.gold, fontStyle: 'italic' }}>manche terminée · 18 avril 1926</div>
      </div>

      <div style={{ position: 'absolute', top: 240, left: 48, right: 48 }}>
        {ranks.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto auto', gap: 32, alignItems: 'center', padding: '22px 0', borderBottom: `0.5px solid ${FEUTRE.gold}44` }}>
            <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, fontSize: 56, color: FEUTRE.gold, lineHeight: 1 }}>
              {i + 1}.
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 3.5, color: FEUTRE.gold, fontWeight: 600 }}>{r.title}</div>
              <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 700, fontSize: 38, marginTop: 4 }}>{r.name}</div>
            </div>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6 }}>{i === 0 ? 'reçoit les 2 meilleures' : i === 1 ? 'reçoit la meilleure' : i === 2 ? 'ne change rien' : i === 3 ? 'donne sa meilleure' : 'donne ses 2 meilleures'}</div>
            <div style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 32, fontWeight: 900, color: r.points.startsWith('+') ? FEUTRE.gold : r.points === '0' ? FEUTRE.cream : FEUTRE.red, width: 60, textAlign: 'right' }}>
              {r.points}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { FeutreLanding, FeutreTable, FeutreEndgame, FeutreMiniCard });
