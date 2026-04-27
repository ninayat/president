// Screens for Direction 1 — "Salon Pop"
// Landing + Table + Fin de partie

function PopLanding({ width = 1280, height = 800 }) {
  return (
    <div style={{ width, height, background: POP.cream, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk' }}>
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${POP.ink}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: POP.red, borderRadius: 4, display: 'grid', placeItems: 'center' }}>
            <div style={{ color: POP.cream, fontFamily: 'Fraunces', fontWeight: 900, fontSize: 18, fontStyle: 'italic' }}>P</div>
          </div>
          <div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 22, letterSpacing: -0.5, color: POP.ink }}>Président</div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: POP.ink, opacity: 0.55, marginLeft: 4, letterSpacing: 1.5 }}>EST. 1961</div>
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: 14, color: POP.ink }}>
          <span style={{ fontWeight: 500 }}>Règles</span>
          <span>Classement</span>
          <span>Histoires</span>
          <span style={{ background: POP.ink, color: POP.cream, padding: '6px 14px', fontWeight: 500 }}>Se connecter</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: 'absolute', top: 72, left: 48, right: 48, bottom: 0, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, paddingTop: 30 }}>
        <div style={{ alignSelf: 'center' }}>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: POP.red, letterSpacing: 3, fontWeight: 600, marginBottom: 24 }}>
            ◆ JEU DE HIÉRARCHIE · 3 À 8 JOUEURS
          </div>
          <h1 style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 110, lineHeight: 0.9, color: POP.ink, margin: 0, letterSpacing: -3 }}>
            Le jeu<br/>
            du <span style={{ fontStyle: 'italic', color: POP.red }}>Président</span>
          </h1>
          <p style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: 22, color: POP.ink, maxWidth: 440, lineHeight: 1.35, marginTop: 28, opacity: 0.85 }}>
            Une partie. Une hiérarchie. Du Président au Trou du Cul, chaque main redistribue les rangs.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 32, alignItems: 'center' }}>
            <button style={{ background: POP.red, color: POP.cream, border: 'none', padding: '16px 32px', fontSize: 15, fontWeight: 600, fontFamily: 'Space Grotesk', cursor: 'pointer', letterSpacing: 0.5 }}>
              CRÉER UNE PARTIE
            </button>
            <button style={{ background: 'transparent', color: POP.ink, border: `1.5px solid ${POP.ink}`, padding: '14px 30px', fontSize: 15, fontWeight: 500, fontFamily: 'Space Grotesk', cursor: 'pointer' }}>
              Rejoindre avec un code
            </button>
          </div>
          <div style={{ display: 'flex', gap: 48, marginTop: 48, paddingTop: 24, borderTop: `1px solid ${POP.ink}33` }}>
            <div><div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 32, color: POP.ink }}>12K</div><div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2 }}>PARTIES / JOUR</div></div>
            <div><div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 32, color: POP.ink }}>52</div><div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2 }}>CARTES</div></div>
            <div><div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 32, color: POP.ink }}>4<span style={{ color: POP.red }}>.</span>9</div><div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2 }}>NOTE MOYENNE</div></div>
          </div>
        </div>

        {/* Card display */}
        <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
          <div style={{ position: 'absolute', top: 40, left: 40, transform: 'rotate(-8deg)' }}>
            <PopCardBack width={200} height={290} />
          </div>
          <div style={{ position: 'absolute', top: 20, right: 30, transform: 'rotate(6deg)' }}>
            <PopAceOfSpades width={200} height={290} />
          </div>
          <div style={{ position: 'relative', transform: 'rotate(-2deg) translateY(30px)', zIndex: 2 }}>
            <PopKingOfHearts width={240} height={340} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PopTable({ width = 1280, height = 800 }) {
  const hand = [
    { rank: '7', suit: 'trefle' },
    { rank: '8', suit: 'carreau' },
    { rank: '10', suit: 'coeur' },
    { rank: 'V', suit: 'pique' },
    { rank: 'D', suit: 'coeur' },
    { rank: 'R', suit: 'coeur' },
    { rank: 'A', suit: 'pique' },
  ];
  return (
    <div style={{ width, height, background: POP.paperDark, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk' }}>
      {/* Top status bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 56, background: POP.ink, color: POP.cream, display: 'flex', alignItems: 'center', padding: '0 28px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontStyle: 'italic', fontSize: 20 }}>Président</div>
          <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 2 }}>PARTIE #4827 · MANCHE 3/7</div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ fontSize: 13, letterSpacing: 1.5 }}>À JOUER · MARCEL</div>
          <div style={{ background: POP.red, color: POP.cream, padding: '6px 14px', fontSize: 12, fontWeight: 600 }}>28s</div>
        </div>
      </div>

      {/* Table felt area */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, bottom: 180, background: `radial-gradient(ellipse at center, ${POP.cream} 0%, ${POP.paperDark} 75%)` }}>
        {/* Other players */}
        {[
          { name: 'Juliette', role: 'Présidente', cards: 3, pos: { top: 30, left: '50%', transform: 'translateX(-50%)' }, badge: POP.gold },
          { name: 'Antoine', role: 'Vice', cards: 5, pos: { top: 130, left: 60 }, badge: POP.blue },
          { name: 'Clémence', role: 'Neutre', cards: 6, pos: { top: 130, right: 60 }, badge: POP.ink },
          { name: 'Hugo', role: 'Vice-TDC', cards: 8, pos: { bottom: 120, left: 60 }, badge: '#888' },
          { name: 'Nina', role: 'Trou du Cul', cards: 9, pos: { bottom: 120, right: 60 }, badge: POP.red },
        ].map((p, i) => (
          <div key={i} style={{ position: 'absolute', ...p.pos, textAlign: 'center', width: 150 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: POP.cream, border: `2.5px solid ${p.badge}`, margin: '0 auto', display: 'grid', placeItems: 'center', fontFamily: 'Fraunces', fontWeight: 900, fontSize: 22, color: p.badge }}>
              {p.name[0]}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: POP.ink, marginTop: 6 }}>{p.name}</div>
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: p.badge, fontWeight: 600, textTransform: 'uppercase' }}>{p.role}</div>
            <div style={{ fontSize: 10, color: POP.ink, opacity: 0.5, marginTop: 2 }}>{p.cards} cartes</div>
          </div>
        ))}

        {/* Play pile center */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: -50 }}>
          <div style={{ transform: 'rotate(-10deg) translateX(30px)' }}>
            <MiniCard rank="9" suit="trefle" />
          </div>
          <div style={{ transform: 'rotate(4deg)', zIndex: 2 }}>
            <MiniCard rank="9" suit="coeur" />
          </div>
          <div style={{ transform: 'rotate(14deg) translateX(-30px)' }}>
            <MiniCard rank="9" suit="pique" />
          </div>
        </div>

        {/* Tricks indicator */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, 80px)', fontSize: 11, letterSpacing: 3, color: POP.ink, opacity: 0.55, fontWeight: 600 }}>
          ▸ TROIS NEUFS · À BATTRE
        </div>
      </div>

      {/* Player hand dock */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: POP.cream, borderTop: `1.5px solid ${POP.ink}`, padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2, color: POP.ink, opacity: 0.55, fontWeight: 600 }}>VOTRE MAIN · MARCEL</div>
          <div style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: 20, color: POP.ink, marginTop: 2 }}>Neutre · 7 cartes</div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button style={{ background: POP.red, color: POP.cream, border: 'none', padding: '10px 20px', fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk', letterSpacing: 0.5 }}>JOUER</button>
            <button style={{ background: 'transparent', color: POP.ink, border: `1.5px solid ${POP.ink}`, padding: '8px 18px', fontSize: 13, fontWeight: 500 }}>Passer</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: -30, paddingRight: 28 }}>
          {hand.map((c, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : -30, transform: `translateY(${i === 4 ? -14 : 0}px) rotate(${(i - 3) * 3}deg)`, transition: 'transform .2s' }}>
              <MiniCard rank={c.rank} suit={c.suit} selected={i === 4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ rank, suit, selected }) {
  const color = (suit === 'coeur' || suit === 'carreau') ? POP.red : POP.ink;
  return (
    <div style={{
      width: 84, height: 120, background: POP.cream, border: `1.5px solid ${POP.ink}`, borderRadius: 6,
      position: 'relative', boxShadow: selected ? `0 8px 0 ${POP.red}55, 0 12px 24px -10px rgba(0,0,0,0.25)` : '0 4px 12px -6px rgba(0,0,0,0.2)',
    }}>
      <div style={{ position: 'absolute', top: 6, left: 8, textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 17, color }}>{rank}</div>
        <div style={{ marginTop: 1 }}><Pip suit={suit} size={10} color={color} /></div>
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Pip suit={suit} size={34} color={color} />
      </div>
      <div style={{ position: 'absolute', bottom: 6, right: 8, textAlign: 'center', lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 17, color }}>{rank}</div>
        <div style={{ marginTop: 1 }}><Pip suit={suit} size={10} color={color} /></div>
      </div>
    </div>
  );
}

function PopEndgame({ width = 1280, height = 800 }) {
  const ranks = [
    { title: 'Président', name: 'Juliette', color: POP.gold, note: '+3 pts · Reçoit les 2 meilleures cartes' },
    { title: 'Vice-Président', name: 'Antoine', color: POP.blue, note: '+2 pts · Reçoit la meilleure carte' },
    { title: 'Neutre', name: 'Marcel', color: POP.ink, note: '0 pts · Ne change rien' },
    { title: 'Vice-Trou du Cul', name: 'Clémence', color: '#666', note: '−1 pt · Donne sa meilleure' },
    { title: 'Trou du Cul', name: 'Hugo', color: POP.red, note: '−3 pts · Donne ses 2 meilleures' },
  ];
  return (
    <div style={{ width, height, background: POP.cream, position: 'relative', overflow: 'hidden', fontFamily: 'Space Grotesk' }}>
      <div style={{ position: 'absolute', top: 40, left: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: POP.red, fontWeight: 600 }}>◆ FIN DE MANCHE · 13/04/2026</div>
        <h1 style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 74, lineHeight: 0.95, color: POP.ink, margin: '12px 0 0', letterSpacing: -2 }}>
          Le nouvel<br/><span style={{ fontStyle: 'italic', color: POP.red }}>ordre</span> de la table
        </h1>
      </div>

      <div style={{ position: 'absolute', top: 240, left: 48, right: 48, bottom: 48, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {ranks.map((r, i) => (
          <div key={i} style={{
            background: i === 0 ? POP.ink : POP.paper,
            color: i === 0 ? POP.cream : POP.ink,
            border: `1.5px solid ${POP.ink}`, padding: '20px 18px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            transform: i === 0 ? 'translateY(-20px)' : 'none',
            position: 'relative',
          }}>
            <div>
              <div style={{ fontSize: 48, fontFamily: 'Fraunces', fontWeight: 900, color: i === 0 ? POP.gold : POP.ink, lineHeight: 1 }}>
                0{i + 1}
              </div>
              <div style={{ fontSize: 11, letterSpacing: 2, marginTop: 14, color: r.color, fontWeight: 700, textTransform: 'uppercase' }}>
                {r.title}
              </div>
              <div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 28, marginTop: 6, letterSpacing: -0.5 }}>
                {r.name}
              </div>
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4, marginTop: 18, paddingTop: 12, borderTop: `1px solid ${i === 0 ? POP.cream + '33' : POP.ink + '22'}` }}>
              {r.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PopLanding, PopTable, PopEndgame, MiniCard });
