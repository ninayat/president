// App — canvas assembly of all 4 directions

const { useState, useEffect } = React;

const TWEAKS_DEFAULT = /*EDITMODE-BEGIN*/{
  "direction": "all",
  "cardsOnly": false
}/*EDITMODE-END*/;

const CardSlot = ({ label, children, bg = '#f0eee9' }) => (
  <DCArtboard label={label} width={260} height={360}>
    <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', background: bg }}>
      {children}
    </div>
  </DCArtboard>
);

function DirectionSection({ name, subtitle, Landing, Table, Endgame, Ace, King, Back, Queen, Jack, AceH, AceD, AceC, Mobile, bg }) {
  return (
    <DCSection title={name} subtitle={subtitle} gap={48}>
      {/* Cartes — rangée 1: dos + As */}
      <CardSlot label="Dos de carte" bg={bg}><Back width={240} height={340} /></CardSlot>
      <CardSlot label="As de pique" bg={bg}><Ace width={240} height={340} /></CardSlot>
      <CardSlot label="As de cœur" bg={bg}><AceH width={240} height={340} /></CardSlot>
      <CardSlot label="As de carreau" bg={bg}><AceD width={240} height={340} /></CardSlot>
      <CardSlot label="As de trèfle" bg={bg}><AceC width={240} height={340} /></CardSlot>
      <CardSlot label="Roi de cœur — Président" bg={bg}><King width={240} height={340} /></CardSlot>
      <CardSlot label="Dame de cœur — Vice-Présidente" bg={bg}><Queen width={240} height={340} /></CardSlot>
      <CardSlot label="Valet de pique" bg={bg}><Jack width={240} height={340} /></CardSlot>
      {/* Écrans desktop */}
      <DCArtboard label="Landing · 1280×800" width={1280} height={800}><Landing width={1280} height={800} /></DCArtboard>
      <DCArtboard label="Table de jeu · 1280×800" width={1280} height={800}><Table width={1280} height={800} /></DCArtboard>
      <DCArtboard label="Fin de manche · 1280×800" width={1280} height={800}><Endgame width={1280} height={800} /></DCArtboard>
      {/* Mobile */}
      <DCArtboard label="Table mobile · 390×844" width={390} height={844}><Mobile width={390} height={844} /></DCArtboard>
    </DCSection>
  );
}

function TweaksPanel({ tweaks, setTweaks, visible }) {
  if (!visible) return null;
  const dirs = [
    { key: 'all', label: 'Toutes' },
    { key: 'pop', label: '1 · Salon Pop' },
    { key: 'feutre', label: '2 · Feutre Casino' },
    { key: 'riso', label: '3 · Risographie' },
    { key: 'deco', label: '4 · Art Déco' },
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 100,
      background: '#1a1612', color: '#faf4e4',
      padding: 18, borderRadius: 10, minWidth: 240,
      fontFamily: 'Space Grotesk, sans-serif',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontSize: 10, letterSpacing: 3, opacity: 0.6, marginBottom: 12 }}>TWEAKS</div>
      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>Direction visible</div>
      <div style={{ display: 'grid', gap: 4 }}>
        {dirs.map(d => (
          <button key={d.key}
            onClick={() => setTweaks({ ...tweaks, direction: d.key })}
            style={{
              background: tweaks.direction === d.key ? '#d63a26' : 'transparent',
              color: '#faf4e4',
              border: '1px solid #faf4e433', padding: '6px 10px',
              fontSize: 12, fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer',
            }}>
            {d.label}
          </button>
        ))}
      </div>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14, fontSize: 12, cursor: 'pointer' }}>
        <input type="checkbox" checked={tweaks.cardsOnly} onChange={e => setTweaks({ ...tweaks, cardsOnly: e.target.checked })} />
        <span>Cartes uniquement (masquer les écrans)</span>
      </label>
    </div>
  );
}

function App() {
  const [tweaks, setTweaks] = useState(TWEAKS_DEFAULT);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: tweaks }, '*');
  }, [tweaks]);

  const directions = [
    {
      key: 'pop',
      name: '01 · Salon Pop',
      subtitle: 'Affiche éditoriale française années 60 — crème chaude, vermillon, bleu cobalt, Fraunces.',
      Landing: PopLanding, Table: PopTable, Endgame: PopEndgame,
      Ace: PopAceOfSpades, King: PopKingOfHearts, Back: PopCardBack,
      Queen: PopQueenOfHearts, Jack: PopJackOfSpades,
      AceH: PopAceOfHearts, AceD: PopAceOfDiamonds, AceC: PopAceOfClubs,
      Mobile: PopMobileTable, bg: '#faf4e4',
    },
    {
      key: 'feutre',
      name: '02 · Feutre Casino',
      subtitle: 'Club privé, tapis vert profond, or laiton, Playfair italic — sérieux, feutré, rituel.',
      Landing: FeutreLanding, Table: FeutreTable, Endgame: FeutreEndgame,
      Ace: FeutreAceOfSpades, King: FeutreKingOfHearts, Back: FeutreCardBack,
      Queen: FeutreQueenOfHearts, Jack: FeutreJackOfSpades,
      AceH: FeutreAceOfHearts, AceD: FeutreAceOfDiamonds, AceC: FeutreAceOfClubs,
      Mobile: FeutreMobileTable, bg: '#f5ebd0',
    },
    {
      key: 'riso',
      name: '03 · Risographie',
      subtitle: 'Impression deux tons, rose fluo + bleu, grain épais, figures géométriques, Archivo Black.',
      Landing: RisoLanding, Table: RisoTable, Endgame: RisoEndgame,
      Ace: RisoAceOfSpades, King: RisoKingOfHearts, Back: RisoCardBack,
      Queen: RisoQueenOfHearts, Jack: RisoJackOfSpades,
      AceH: RisoAceOfHearts, AceD: RisoAceOfDiamonds, AceC: RisoAceOfClubs,
      Mobile: RisoMobileTable, bg: '#f6f1e7',
    },
    {
      key: 'deco',
      name: '04 · Art Déco Moderne',
      subtitle: 'Noir absolu, or patiné, figures linocut, Bodoni italique — casino de 1926 dans une tablette.',
      Landing: DecoLanding, Table: DecoTable, Endgame: DecoEndgame,
      Ace: DecoAceOfSpades, King: DecoKingOfHearts, Back: DecoCardBack,
      Queen: DecoQueenOfHearts, Jack: DecoJackOfSpades,
      AceH: DecoAceOfHearts, AceD: DecoAceOfDiamonds, AceC: DecoAceOfClubs,
      Mobile: DecoMobileTable, bg: '#ebe1c8',
    },
  ];

  const visible = directions.filter(d => tweaks.direction === 'all' || tweaks.direction === d.key);

  return (
    <>
      <DesignCanvas>
        {/* Title */}
        <div style={{ padding: '20px 60px 40px', maxWidth: 1100 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#d63a26', fontWeight: 600 }}>◆ EXPLORATION VISUELLE · AVRIL 2026</div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: 56, margin: '10px 0 6px', letterSpacing: -1.5, color: '#1a1612' }}>
            Président <span style={{ fontStyle: 'italic', color: '#888' }}>— 4 directions</span>
          </h1>
          <p style={{ fontSize: 15, color: '#4a4a4a', maxWidth: 780, lineHeight: 1.5, margin: 0 }}>
            Chaque direction livre le même set : <b>dos de carte</b>, <b>As de pique</b>, <b>Roi de cœur</b> (traité comme le Président), puis trois écrans — landing, table de jeu, fin de manche.
            Toutes les directions partagent une grammaire : cartes classiques revisitées (52), portraits illustrés, typographie forte, rôles traités comme des titres officiels. Pas d'emoji, pas de clichés jeu de société.
            Utilisez le panneau <b>Tweaks</b> en bas à droite pour filtrer.
          </p>
        </div>

        {visible.map(d => (
          <DirectionSection key={d.key} {...d} />
        ))}

        {/* Animation section */}
        <DCSection title="Animation · Don de cartes" subtitle="Interaction animée entre Président et Trou du Cul — cliquez Suivant pour avancer.">
          <DCArtboard label="Redistribution des cartes · 900×620" width={900} height={620}>
            <CardAnimExchange width={900} height={620} />
          </DCArtboard>
        </DCSection>

        {/* Notes / next steps */}
        <DCSection title="Notes & prochaines étapes" subtitle="Observations design et suggestions pour la phase 2.">
          <DCArtboard label="Système retenu" width={540} height={360}>
            <div style={{ padding: 28, fontFamily: 'Space Grotesk', fontSize: 13, lineHeight: 1.55, color: '#1a1612', height: '100%', background: '#faf4e4' }}>
              <div style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 900, fontSize: 26, marginBottom: 14 }}>Grammaire partagée</div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                <li><b>Carte</b> : ratio 5:7 (240×340), coins radius 6–14, 1 bordure encre</li>
                <li><b>Figures</b> : portrait illustré original (roi, dame, valet) — pas de silhouettes génériques</li>
                <li><b>Couleurs de pique/trèfle</b> : encre noire; cœur/carreau : rouge de la direction</li>
                <li><b>Tags</b> : sous-titre typographique en bas (rôle + numéro)</li>
                <li><b>Rôles</b> présentés comme des titres officiels (caps + letterspacing) avec couleur dédiée</li>
                <li><b>Table</b> : joueurs disposés en anneau, pile centrale, dock de main en bas</li>
              </ul>
            </div>
          </DCArtboard>
          <DCArtboard label="Pour avancer" width={540} height={360}>
            <div style={{ padding: 28, fontFamily: 'Space Grotesk', fontSize: 13, lineHeight: 1.55, color: '#1a1612', height: '100%', background: '#faf4e4' }}>
              <div style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 900, fontSize: 26, marginBottom: 14 }}>Phase 2 · suggestions</div>
              <ol style={{ paddingLeft: 18, margin: 0 }}>
                <li>Choisir une direction (ou mixer : ex. cartes "Feutre" + site "Pop")</li>
                <li>Dessiner les 3 autres figures (Dame, Valet, As des 4 couleurs)</li>
                <li>Mockup mobile de la table (portrait + gestes)</li>
                <li>Animation du don/reçu de cartes entre Président et Trou du Cul</li>
                <li>Règles illustrées (page dédiée, éditoriale)</li>
                <li>Écran "Révolution" / "Contre-Révolution" si variantes jouées</li>
              </ol>
              <div style={{ marginTop: 16, fontStyle: 'italic', fontFamily: 'Fraunces', opacity: 0.7 }}>
                Dites-moi la direction préférée et j'itère.
              </div>
            </div>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={editMode} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
