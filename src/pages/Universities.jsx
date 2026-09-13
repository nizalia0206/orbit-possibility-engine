import React, { useState } from 'react';
import { useOrbit } from '../store';
import { UNIVERSITIES } from '../data';
import UniversityCard from '../components/UniversityCard';

function filterUniversities(list, f) {
  return list.filter(u => {
    if (f.country === 'UAE' && u.group !== 'uae') return false;
    if (f.country !== 'All' && f.country !== 'UAE' && u.country !== f.country) return false;
    if (f.budget !== 'All' && u.budget !== f.budget) return false;
    if (f.q) {
      const q = f.q.toLowerCase();
      const hit = u.name.toLowerCase().includes(q) || u.aliases.some(a => a.includes(q)) || u.city.toLowerCase().includes(q) || u.country.toLowerCase().includes(q);
      if (!hit) return false;
    }
    return true;
  });
}

export default function Universities() {
  const { t } = useOrbit();
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('All');
  const [budget, setBudget] = useState('All');
  const intlCountries = [...new Set(UNIVERSITIES.filter(u => u.group === 'intl').map(u => u.country))];
  const results = filterUniversities(UNIVERSITIES, { q, country, budget });

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap">
        <div className="eyebrow">{t('uni_label')}</div>
        <h1 style={{ fontSize: 'clamp(30px,5vw,50px)', marginBottom: 14 }}>{t('universities_h')}</h1>
        <p style={{ maxWidth: 560, marginBottom: 30 }}>{t('universities_p')}</p>
        <div style={{ marginBottom: 26 }}>
          <input className="search-input" data-tour="universities-anchor" placeholder={t('search_uni')} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="field-group">
          <div className="fg-label">{t('country_l')}</div>
          <div className="chiprow">
            <button className={`chip ${country === 'All' ? 'active' : ''}`} onClick={() => setCountry('All')}>{t('all')}</button>
            <button className={`chip ${country === 'UAE' ? 'active' : ''}`} onClick={() => setCountry('UAE')}>UAE</button>
            {intlCountries.map(c => <button key={c} className={`chip ${country === c ? 'active' : ''}`} onClick={() => setCountry(c)}>{c}</button>)}
          </div>
        </div>
        <div className="field-group">
          <div className="fg-label">{t('budget_l')}</div>
          <div className="chiprow">
            <button className={`chip ${budget === 'All' ? 'active' : ''}`} onClick={() => setBudget('All')}>{t('all')}</button>
            <button className={`chip ${budget === 'low' ? 'active' : ''}`} onClick={() => setBudget('low')}>Low</button>
            <button className={`chip ${budget === 'medium' ? 'active' : ''}`} onClick={() => setBudget('medium')}>Medium</button>
            <button className={`chip ${budget === 'high' ? 'active' : ''}`} onClick={() => setBudget('high')}>High</button>
          </div>
        </div>
        <div className="grid-3" style={{ marginTop: 20 }}>
          {results.length ? results.map(u => <UniversityCard key={u.id} u={u} />) : <p>No universities match your filters.</p>}
        </div>
      </div>
    </section>
  );
}
