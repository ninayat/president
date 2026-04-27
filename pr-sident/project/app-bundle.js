
//=== design-canvas.jsx ===

// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// No assets, no deps.

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

// ─────────────────────────────────────────────────────────────
// Main canvas — transform-based pan/zoom viewport
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DesignCanvas({ children, minScale = 0.1, maxScale = 8, style = {} }) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({ x: 0, y: 0, scale: 1 });

  const apply = React.useCallback(() => {
    const { x, y, scale } = tf.current;
    const el = worldRef.current;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }, []);

  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;

    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left, py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = (e) =>
      e.deltaMode !== 0 ||
      (e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40);

    const onWheel = (e) => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if (e.ctrlKey) {
        // trackpad pinch (or explicit ctrl+wheel)
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = (e) => { e.preventDefault(); isGesturing = true; gsBase = tf.current.scale; };
    const onGestureChange = (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, (gsBase * e.scale) / tf.current.scale);
    };
    const onGestureEnd = (e) => { e.preventDefault(); isGesturing = false; };

    // Drag-pan: middle button anywhere, or primary button starting on the
    // canvas background (not inside an artboard).
    let drag = null;
    const onPointerDown = (e) => {
      const onBg = e.target === vp || e.target === worldRef.current;
      if (!(e.button === 1 || (e.button === 0 && onBg))) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = { id: e.pointerId, lx: e.clientX, ly: e.clientY };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX; drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    vp.addEventListener('wheel', onWheel, { passive: false });
    vp.addEventListener('gesturestart', onGestureStart, { passive: false });
    vp.addEventListener('gesturechange', onGestureChange, { passive: false });
    vp.addEventListener('gestureend', onGestureEnd, { passive: false });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);

  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return (
    <div
      ref={vpRef}
      className="design-canvas"
      style={{
        height: '100vh', width: '100vw',
        background: DC.bg,
        overflow: 'hidden',
        overscrollBehavior: 'none',
        touchAction: 'none',
        position: 'relative',
        fontFamily: DC.font,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        ref={worldRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          transformOrigin: '0 0',
          willChange: 'transform',
          width: 'max-content', minWidth: '100%',
          minHeight: '100%',
          padding: '60px 0 80px',
          backgroundImage: gridSvg,
          backgroundSize: '120px 120px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section — title + subtitle + h-stack of artboards (no wrap)
// ─────────────────────────────────────────────────────────────
function DCSection({ title, subtitle, children, gap = 48 }) {
  return (
    <div style={{ marginBottom: 80, position: 'relative' }}>
      <div style={{ padding: '0 60px 36px' }}>
        <div style={{
          fontSize: 22, fontWeight: 600, color: DC.title,
          letterSpacing: -0.3, marginBottom: 4,
        }}>{title}</div>
        {subtitle && (
          <div style={{
            fontSize: 14, fontWeight: 400, color: DC.subtitle,
          }}>{subtitle}</div>
        )}
      </div>
      {/* h-stack — clips offscreen, never wraps */}
      <div style={{
        display: 'flex', gap, padding: '0 60px',
        alignItems: 'flex-start', width: 'max-content',
      }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Artboard — labeled card
// ─────────────────────────────────────────────────────────────
function DCArtboard({ label, children, width, height, style = {} }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {label && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0,
          paddingBottom: 8,
          fontSize: 12, fontWeight: 500, color: DC.label,
          whiteSpace: 'nowrap',
        }}>{label}</div>
      )}
      <div style={{
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        width, height,
        background: '#fff',
        ...style,
      }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({ children, top, left, right, bottom, rotate = -2, width = 180 }) {
  return (
    <div style={{
      position: 'absolute', top, left, right, bottom, width,
      background: DC.postitBg, padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14, lineHeight: 1.4, color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5,
    }}>{children}</div>
  );
}

Object.assign(window, { DesignCanvas, DCSection, DCArtboard, DCPostIt });


//=== cards-pop.jsx ===
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

//=== cards-feutre.jsx ===
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

//=== cards-riso.jsx ===
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

//=== cards-deco.jsx ===
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

//=== screens-pop.jsx ===
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

//=== screens-feutre.jsx ===
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

//=== screens-riso.jsx ===
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

//=== screens-deco.jsx ===
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

//=== app.jsx ===
// App — canvas assembly of all 4 directions

const { useState, useEffect } = React;

const TWEAKS_DEFAULT = /*EDITMODE-BEGIN*/{
  "direction": "all",
  "cardsOnly": false
}/*EDITMODE-END*/;

function DirectionSection({ name, subtitle, Landing, Table, Endgame, Ace, King, Back }) {
  return (
    <DCSection title={name} subtitle={subtitle} gap={56}>
      <DCArtboard label="Dos de carte" width={260} height={360}>
        <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', background: '#f0eee9' }}>
          <Back width={240} height={340} />
        </div>
      </DCArtboard>
      <DCArtboard label="As de pique" width={260} height={360}>
        <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', background: '#f0eee9' }}>
          <Ace width={240} height={340} />
        </div>
      </DCArtboard>
      <DCArtboard label="Roi de cœur — Président" width={260} height={360}>
        <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', background: '#f0eee9' }}>
          <King width={240} height={340} />
        </div>
      </DCArtboard>
      <DCArtboard label="Landing · Desktop 1280×800" width={1280} height={800}>
        <Landing width={1280} height={800} />
      </DCArtboard>
      <DCArtboard label="Table de jeu · 1280×800" width={1280} height={800}>
        <Table width={1280} height={800} />
      </DCArtboard>
      <DCArtboard label="Fin de manche · 1280×800" width={1280} height={800}>
        <Endgame width={1280} height={800} />
      </DCArtboard>
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
    },
    {
      key: 'feutre',
      name: '02 · Feutre Casino',
      subtitle: 'Club privé, tapis vert profond, or laiton, Playfair italic — sérieux, feutré, rituel.',
      Landing: FeutreLanding, Table: FeutreTable, Endgame: FeutreEndgame,
      Ace: FeutreAceOfSpades, King: FeutreKingOfHearts, Back: FeutreCardBack,
    },
    {
      key: 'riso',
      name: '03 · Risographie',
      subtitle: 'Impression deux tons, rose fluo + bleu, grain épais, figures géométriques, Archivo Black.',
      Landing: RisoLanding, Table: RisoTable, Endgame: RisoEndgame,
      Ace: RisoAceOfSpades, King: RisoKingOfHearts, Back: RisoCardBack,
    },
    {
      key: 'deco',
      name: '04 · Art Déco Moderne',
      subtitle: 'Noir absolu, or patiné, figures linocut, Bodoni italique — casino de 1926 dans une tablette.',
      Landing: DecoLanding, Table: DecoTable, Endgame: DecoEndgame,
      Ace: DecoAceOfSpades, King: DecoKingOfHearts, Back: DecoCardBack,
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
