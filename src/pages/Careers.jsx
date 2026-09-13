import React, { useState } from 'react';
import { useOrbit } from '../store';
import { CAREERS } from '../data';
import { CATEGORY_LIST } from '../categoryList';
import { computeMatch } from '../engine';
import CareerCard from '../components/CareerCard';

export default function Careers() {
  const { t, state } = useOrbit();
  const [cat, setCat] = useState('All');
  const list = CAREERS.filter(c => cat === 'All' || c.category === cat);
  const ranked = list
    .map(c => ({ career: c, match: computeMatch(state.profile, c) }))
    .sort((a, b) => (b.match || 0) - (a.match || 0));

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap">
        <div className="eyebrow">ORBIT</div>
        <h1 style={{ fontSize: 'clamp(30px,5vw,50px)', marginBottom: 14 }}>{t('careers_h')}</h1>
        <p style={{ maxWidth: 520, marginBottom: 36 }}>{t('careers_p')}</p>
        <div className="chiprow" data-tour="careers-anchor">
          <button className={`chip ${cat === 'All' ? 'active' : ''}`} onClick={() => setCat('All')}>{t('all')}</button>
          {CATEGORY_LIST.map(c => (
            <button key={c.key} className={`chip ${cat === c.key ? 'active' : ''}`} onClick={() => setCat(c.key)}>{c.label(state.lang)}</button>
          ))}
        </div>
        <div className="grid-3">
          {ranked.map(r => <CareerCard key={r.career.id} career={r.career} match={r.match} />)}
        </div>
      </div>
    </section>
  );
}
