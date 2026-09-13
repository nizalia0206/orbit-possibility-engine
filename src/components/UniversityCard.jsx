import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrbit } from '../store';

export default function UniversityCard({ u }) {
  const { state, t, uName, toggleSaved, toggleCompare } = useOrbit();
  const navigate = useNavigate();
  const isSaved = state.saved.universities.includes(u.id);
  const inCompare = state.compareList.includes(u.id);
  const match = 40 + (u.id.length * 13) % 56;

  return (
    <div className="item-card">
      <div className="top-row">
        <div className="mono">{u.country.toUpperCase()} · {u.city.toUpperCase()}</div>
        <button
          className={`bookmark-btn ${isSaved ? 'active' : ''}`}
          onClick={() => toggleSaved('universities', u.id)}
          aria-label={`Save ${u.name}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
          </svg>
        </button>
      </div>
      <h3 style={{ cursor: 'pointer' }} onClick={() => navigate(`/universities/${u.id}`)}>
        {state.lang === 'ar' ? uName(u) : u.abbr}
      </h3>
      <p style={{ fontSize: 13.5, margin: '-8px 0 0' }}>{uName(u)}</p>
      <div><span className="match-num" style={{ fontSize: 26 }}>{match}</span><span className="match-label">{t('match')}</span></div>
      <div className="row-tags">{u.degrees.slice(0, 2).map(d => <span className="row-tag" key={d}>{d}</span>)}</div>
      <div className="mono" style={{ fontSize: 11 }}>{t('sample_notlive')}</div>
      <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 6 }}>
        <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate(`/universities/${u.id}`)}>{t('explore')}</button>
        <button
          className={`btn btn-secondary btn-sm ${inCompare ? 'selected' : ''}`}
          style={inCompare ? { borderColor: 'var(--purple-bright)', color: 'var(--purple-bright)' } : undefined}
          onClick={() => toggleCompare(u.id)}
        >
          {t('add_to_compare')}
        </button>
      </div>
    </div>
  );
}
