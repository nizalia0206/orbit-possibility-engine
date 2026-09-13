import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSVG() {
  const w = window.innerWidth;
  const h = Math.max(window.innerHeight, document.body.scrollHeight, 900);
  const rand = mulberry32(42);
  const mobile = window.innerWidth < 640;
  const n = Math.round((mobile ? 46 : 110) * (h / 900));
  const pts = [];
  for (let i = 0; i < n; i++) {
    const big = rand() < 0.16;
    pts.push({ x: rand() * w, y: rand() * h, r: big ? 3 + rand() * 2.4 : 1.2 + rand() * 1.4, big, ring: big && rand() < 0.6 });
  }
  let lines = '';
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 170 && rand() < 0.12) {
        lines += `<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}" stroke="var(--border-strong)" stroke-width="1" opacity="0.55"/>`;
      }
    }
  }
  const dots = pts.map(p => {
    if (p.ring) {
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="none" stroke="var(--purple-bright)" stroke-width="1.3" opacity="0.8"/><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(p.r * 0.35).toFixed(1)}" fill="var(--purple-bright)" opacity="0.9"/>`;
    }
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="${p.big ? 'var(--purple-bright)' : 'var(--text-dimmer)'}" opacity="${p.big ? 0.9 : 0.7}"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${lines}${dots}</svg>`;
}

// This is the "living" constellation that sits behind every page — see App.jsx
// where <ConstellationBG/> is mounted once, and index.css `#constellation-bg`
// for the fixed positioning / opacity per theme.
export default function ConstellationBG() {
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function redraw() {
      if (ref.current) ref.current.innerHTML = buildSVG();
    }
    redraw();
    const onResize = () => redraw();
    window.addEventListener('resize', onResize);
    // Redraw shortly after route change too, since page height (and thus the
    // field of stars) depends on the newly-rendered content.
    const t = setTimeout(redraw, 300);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, [location.pathname]);

  return <div id="constellation-bg" ref={ref} />;
}
