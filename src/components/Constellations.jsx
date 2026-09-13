import React from 'react';

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Simple hub-and-spoke diagram: a center node with satellites around it.
// satellites: [{label, strength: 'strong'|'mid'|'low'}]
export function MiniConstellation({ centerLabel, satellites, w = 600, h = 420 }) {
  const cx = w / 2, cy = h / 2;
  const n = satellites.length || 1;
  const radius = Math.min(w, h) / 2 - 70;
  let lines = '', nodes = '';
  satellites.forEach((s, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + radius * Math.cos(angle), y = cy + radius * Math.sin(angle);
    const strong = s.strength === 'strong';
    const mid = s.strength === 'mid';
    const opacity = strong ? 0.9 : mid ? 0.5 : 0.22;
    lines += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${strong ? 'var(--purple-bright)' : 'var(--border-strong)'}" stroke-width="${strong ? 1.6 : 1}" opacity="${opacity}"/>`;
    nodes += `<g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${strong ? 9 : 6}" fill="${strong ? 'var(--purple-bright)' : 'var(--surface-2)'}" stroke="${strong ? 'var(--purple-bright)' : 'var(--border-strong)'}" stroke-width="1.3" opacity="${strong ? 1 : 0.7}"/>
      <text x="${x.toFixed(1)}" y="${(y + (y > cy ? 24 : -16)).toFixed(1)}" text-anchor="middle" font-size="11" fill="${strong ? 'var(--text)' : 'var(--text-dimmer)'}" font-family="Inter,sans-serif">${esc(s.label)}</text></g>`;
  });
  const svg = `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Constellation centered on ${esc(centerLabel)}">
    ${lines}
    <circle cx="${cx}" cy="${cy}" r="34" fill="var(--purple)" opacity="0.9"/>
    <circle cx="${cx}" cy="${cy}" r="46" fill="none" stroke="var(--purple-bright)" opacity="0.35"/>
    <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="Inter,sans-serif">${esc(centerLabel.length > 16 ? centerLabel.slice(0, 14) + '…' : centerLabel)}</text>
    ${nodes}
  </svg>`;
  return <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Denser triangulated mesh used on the Constellation page — a center career
// node plus satellite nodes (usually related careers) with a handful of
// ambient unlabeled nodes and cross-connections for the "living network"
// look. Satellites with an `id` are rendered as real clickable nodes that
// re-center the universe on that career (see ConstellationPage.jsx).
//
// Hovering (or focusing) a satellite lights it cyan, solidifies its spoke
// line, and dims everything else in the scene — including the center's own
// label — so the graph reads as a clear, one-thing-at-a-time spotlight
// rather than a static diagram.
export function MeshConstellation({ centerLabel, satellites, w = 760, h = 560, onNodeClick }) {
  const rand = mulberry32(centerLabel.length * 7 + 13);
  const nAmbient = 6;
  const ambient = [];
  for (let i = 0; i < nAmbient; i++) ambient.push({ x: rand() * w, y: rand() * h, r: 5 + rand() * 2 });
  const cx = w / 2, cy = h / 2;
  const n = satellites.length || 1;
  const radius = Math.min(w, h) / 2 - 90;
  const satPos = satellites.map((s, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle), s };
  });
  const meshLines = [];
  const allPts = [...satPos.map(p => ({ x: p.x, y: p.y })), ...ambient];
  for (let i = 0; i < allPts.length; i++) {
    for (let j = i + 1; j < allPts.length; j++) {
      const dx = allPts[i].x - allPts[j].x, dy = allPts[i].y - allPts[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < radius * 1.1 && rand() < 0.22) {
        meshLines.push(<line key={`m${i}-${j}`} className="ambient-line" x1={allPts[i].x} y1={allPts[i].y} x2={allPts[j].x} y2={allPts[j].y} stroke="var(--border-strong)" strokeWidth="1" opacity="0.3" />);
      }
    }
  }
  const glowId = `cglow-${centerLabel.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" role="img" aria-label={`Constellation centered on ${centerLabel}`}>
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--purple-bright)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--purple-bright)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="const-scene">
        {meshLines}
        {ambient.map((a, i) => (
          <React.Fragment key={`a${i}`}>
            <circle className="ambient-node" cx={a.x} cy={a.y} r={6} fill="none" stroke="var(--border-strong)" strokeWidth="1.2" opacity="0.5" />
            <circle className="ambient-node" cx={a.x} cy={a.y} r={2.4} fill="var(--text-dimmer)" opacity="0.6" />
          </React.Fragment>
        ))}

        <circle cx={cx} cy={cy} r="80" fill={`url(#${glowId})`} />
        <circle cx={cx} cy={cy} r="30" fill="var(--purple)" opacity="0.95" />
        <circle cx={cx} cy={cy} r="42" fill="none" stroke="var(--purple-bright)" opacity="0.4" />
        <text className="center-label" x={cx} y={cy - 52} textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="0.5" fill="var(--text)" fontFamily="Inter,sans-serif">{centerLabel.toUpperCase()}</text>

        {satPos.map((p, i) => {
          const strong = p.s.strength === 'strong';
          const clickable = !!p.s.id;
          return (
            <g
              key={`n${i}`}
              className={`sat-group${clickable ? ' clickable' : ''}`}
              tabIndex={0}
              role={clickable ? 'link' : 'img'}
              aria-label={p.s.label}
              onClick={clickable ? () => onNodeClick && onNodeClick(p.s.id) : undefined}
              onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNodeClick && onNodeClick(p.s.id); } } : undefined}
            >
              <line className="spoke-line" x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={strong ? 'var(--purple-bright)' : 'var(--border-strong)'} strokeWidth={strong ? 1.6 : 1} opacity={strong ? 0.85 : 0.4} />
              <circle className="cn-ring" cx={p.x} cy={p.y} r={clickable ? 10 : 6} fill="none" stroke={strong ? 'var(--purple-bright)' : 'var(--border-strong)'} strokeWidth="1.4" />
              <circle className="cn-dot" cx={p.x} cy={p.y} r={clickable ? 4 : 2.6} fill={strong ? 'var(--purple-bright)' : 'var(--text-dimmer)'} />
              <text className="cn-label" x={p.x} y={p.y - 16} textAnchor="middle" fontSize="11.5" letterSpacing="0.3" fill={strong ? 'var(--text)' : 'var(--text-dimmer)'} fontFamily="Inter,sans-serif">{p.s.label.toUpperCase()}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function buildCareerSatellites(career, profile, sName, iName, stName) {
  const arr = [];
  career.subjects.forEach(s => arr.push({ label: sName(s), strength: profile.subjects.includes(s) ? 'strong' : 'mid' }));
  career.interests.forEach(s => arr.push({ label: iName(s), strength: profile.interests.includes(s) ? 'strong' : 'mid' }));
  career.strengths.forEach(s => arr.push({ label: stName(s), strength: profile.strengths.includes(s) ? 'strong' : 'mid' }));
  return arr;
}
