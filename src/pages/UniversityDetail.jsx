import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOrbit } from '../store';
import { UNIVERSITIES, CAREERS } from '../data';
import { computeMatch } from '../engine';
import CareerCard from '../components/CareerCard';

export default function UniversityDetail() {
  const { id } = useParams();
  const { state, t, uName, toggleSaved, toggleCompare } = useOrbit();
  const u = UNIVERSITIES.find(x => x.id === id);

  if (!u) return <div className="empty-state"><h2>Not found</h2></div>;

  const isSaved = state.saved.universities.includes(u.id);
  const inCompare = state.compareList.includes(u.id);
  const relatedCareers = CAREERS.filter(c => u.degrees.some(d => c.title.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(c.category.toLowerCase()))).slice(0, 4);

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="wrap" style={{ maxWidth: 860 }}>
        <Link to="/universities" style={{ color: 'var(--text-dim)', display: 'inline-flex', gap: 6, marginBottom: 26 }}>← {t('universities_h')}</Link>
        <div className="mono">{u.group === 'uae' ? 'UAE' : u.country}</div>
        <h1 style={{ fontSize: 'clamp(28px,5vw,46px)', margin: '10px 0 8px' }}>{uName(u)}</h1>
        <p>{u.city}, {u.country}</p>
        <div style={{ display: 'flex', gap: 10, margin: '18px 0 30px' }}>
          <button
            className="btn btn-secondary btn-sm"
            style={isSaved ? { borderColor: 'var(--purple-bright)', color: 'var(--purple-bright)' } : undefined}
            onClick={() => toggleSaved('universities', u.id)}
          >
            {isSaved ? '✓ Saved' : '☆ Save'}
          </button>
          <button
            className={`btn btn-secondary btn-sm ${inCompare ? 'selected' : ''}`}
            style={inCompare ? { borderColor: 'var(--purple-bright)', color: 'var(--purple-bright)' } : undefined}
            onClick={() => toggleCompare(u.id)}
          >
            {t('add_to_compare')}
          </button>
        </div>
        <div className="card">
          <div className="grid-2">
            <div>
              <div className="fg-label mono">TUITION</div>
              <div style={{ fontWeight: 700 }}>{u.tuition}</div>
              <div className="data-tag">{t('sample_notlive')}</div>
            </div>
            <div>
              <div className="fg-label mono">SCHOLARSHIP</div>
              <div style={{ fontWeight: 700 }}>{u.scholarship}</div>
              <div className="data-tag">{t('sample_notlive')}</div>
            </div>
          </div>
          <div className="divider" />
          <div className="fg-label mono">{t('degrees_l').toUpperCase()}</div>
          <div className="pillgrid" style={{ marginTop: 10 }}>
            {u.degrees.map(d => <span key={d} className="pill" style={{ cursor: 'default' }}>{d}</span>)}
          </div>
        </div>
        <div style={{ marginTop: 40 }}>
          <div className="mono" style={{ marginBottom: 16 }}>{t('connected_careers')}</div>
          <div className="grid-3">
            {relatedCareers.length
              ? relatedCareers.map(c => <CareerCard key={c.id} career={c} match={computeMatch(state.profile, c)} />)
              : <p>—</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
