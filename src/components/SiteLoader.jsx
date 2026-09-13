import React, { useEffect, useRef, useState } from 'react';
import { useOrbit } from '../store';
import { CAREERS } from '../data';
import { relatedCareers } from '../engine';
import { MeshConstellation } from './Constellations';

// A short, one-time splash shown while the site "boots" — built from the
// exact same MeshConstellation used on the real /constellation page, so the
// loading moment previews the feature it's about to hand you into rather
// than a generic spinner.
//
// It re-centers itself once (mirroring "click a node to re-center the
// universe") and periodically focuses a random satellite node, which
// triggers the same :focus-visible CSS the live page uses for a real
// cursor hover — so the same cyan highlight / dimmed-scene effect plays
// automatically, matching the reference recording.
const SEQUENCE = CAREERS.slice(0, 2);

export default function SiteLoader() {
  const { t, cTitle } = useOrbit();
  const [mounted, setMounted] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [centerIdx, setCenterIdx] = useState(0);
  const stageRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers = [];

    if (!reduced) {
      // Auto-"hover" a random satellite every so often.
      const hoverEvery = setInterval(() => {
        const nodes = stageRef.current?.querySelectorAll('.sat-group');
        if (!nodes || !nodes.length) return;
        const el = nodes[Math.floor(Math.random() * nodes.length)];
        el.focus();
        setTimeout(() => el.blur(), 650);
      }, 1200);
      timers.push(hoverEvery);

      // Re-center the universe on the next career once, ~1.9s in.
      timers.push(setTimeout(() => setCenterIdx(1), 1900));
    }

    timers.push(setTimeout(() => setExiting(true), reduced ? 900 : 3200));
    timers.push(setTimeout(() => setMounted(false), reduced ? 1300 : 3700));

    return () => timers.forEach(clearTimeout);
  }, []);

  if (!mounted) return null;

  const career = SEQUENCE[centerIdx % SEQUENCE.length] || CAREERS[0];
  const satellites = relatedCareers(career, 6).map(r => ({
    label: cTitle(r.career),
    strength: r.score >= 3 ? 'strong' : 'mid',
  }));

  return (
    <div className={`site-loader${exiting ? ' exiting' : ''}`} role="status" aria-live="polite" aria-label={t('cl_label')}>
      <div className="site-loader-brand" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3L4 8.5V15.5L12 21L20 15.5V8.5L12 3Z" stroke="#8256E4" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.4" fill="#8B5BF5" />
        </svg>
        <span>ORBIT</span>
      </div>
      <div className="site-loader-stage fade-in" ref={stageRef} key={career.id}>
        <MeshConstellation centerLabel={cTitle(career)} satellites={satellites} w={640} h={480} />
      </div>
      <div className="site-loader-caption">
        <div className="cl-label">{t('cl_label')}</div>
        <div className="cl-sub">{t('cl_sub')}</div>
      </div>
    </div>
  );
}
