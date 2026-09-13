import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOrbit } from '../store';
import { CAREERS, universitiesForCareer } from '../data';
import { computeMatch, whyMatchText } from '../engine';
import { MeshConstellation, buildCareerSatellites } from '../components/Constellations';

export default function CareerDetail() {
  const { id } = useParams();
  const { state, t, sName, iName, stName, cTitle, cDesc, cCat, uName, toggleSaved, toggleCompare } = useOrbit();
  const career = CAREERS.find(c => c.id === id);

  if (!career) {
    return (
      <div className="empty-state">
        <h2>Not found</h2>
        <Link to="/careers" className="btn btn-secondary">{t('back_to_careers')}</Link>
      </div>
    );
  }

  const match = computeMatch(state.profile, career);
  const why = whyMatchText(state.profile, career);
  const unis = universitiesForCareer(career);
  const isSaved = state.saved.careers.includes(career.id);
  const satellites = buildCareerSatellites(career, state.profile, sName, iName, stName);

  const whyParts = [
    why.ms.length ? `${t('relevant_subjects')}: ${why.ms.map(sName).join(', ')}` : '',
    why.mi.length ? `${t('relevant_interests')}: ${why.mi.map(iName).join(', ')}` : '',
    why.mst.length ? `${t('relevant_strengths')}: ${why.mst.map(stName).join(', ')}` : '',
  ].filter(Boolean).join(' · ');

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="wrap" style={{ maxWidth: 920 }}>
        <Link to="/careers" style={{ color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>← {t('back_to_careers')}</Link>
        <div className="flex-between">
          <div>
            <div className="mono">{cCat(career)}</div>
            <h1 style={{ fontSize: 'clamp(30px,5vw,50px)', margin: '10px 0 16px' }}>{cTitle(career)}</h1>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            style={isSaved ? { borderColor: 'var(--purple-bright)', color: 'var(--purple-bright)' } : undefined}
            onClick={() => toggleSaved('careers', career.id)}
          >
            {isSaved ? '✓ Saved' : '☆ Save'}
          </button>
        </div>
        <p style={{ fontSize: 17, maxWidth: 640 }}>{cDesc(career)}</p>

        <div className="card" style={{ marginTop: 32 }}>
          <div className="flex-between">
            {match !== null
              ? <div><span className="match-num">{match}</span><span className="match-label">{t('match')}</span></div>
              : <div className="mono">{t('sample_demo')}</div>}
            <button className="btn btn-secondary btn-sm" onClick={() => toggleCompare(career.id)}>{t('add_to_compare')}</button>
          </div>
          <div className="divider" />
          {match !== null ? (
            <>
              <div className="mono" style={{ marginBottom: 10 }}>{t('why_match')}</div>
              <p style={{ margin: 0 }}>{whyParts || 'No overlapping signals yet — adjust your profile to see why.'}</p>
            </>
          ) : (
            <p style={{ margin: 0 }}>{t('sample_demo')} — build your path to see a personalized match and explanation.</p>
          )}
        </div>

        <div className="grid-3" style={{ marginTop: 32 }}>
          <div>
            <div className="fg-label mono">{t('relevant_subjects')}</div>
            <div className="pillgrid">{career.subjects.map(s => <span key={s} className={`pill ${state.profile.subjects.includes(s) ? 'selected' : ''}`} style={{ cursor: 'default' }}>{sName(s)}</span>)}</div>
          </div>
          <div>
            <div className="fg-label mono">{t('relevant_interests')}</div>
            <div className="pillgrid">{career.interests.map(s => <span key={s} className={`pill ${state.profile.interests.includes(s) ? 'selected' : ''}`} style={{ cursor: 'default' }}>{iName(s)}</span>)}</div>
          </div>
          <div>
            <div className="fg-label mono">{t('relevant_strengths')}</div>
            <div className="pillgrid">{career.strengths.map(s => <span key={s} className={`pill ${state.profile.strengths.includes(s) ? 'selected' : ''}`} style={{ cursor: 'default' }}>{stName(s)}</span>)}</div>
          </div>
        </div>

        <div style={{ marginTop: 44 }}>
          <div className="mono" style={{ marginBottom: 14 }}>{t('degrees_l').toUpperCase()}</div>
          <div className="pillgrid">{career.degrees.map(d => <span key={d} className="pill" style={{ cursor: 'default' }}>{d}</span>)}</div>
        </div>

        <div style={{ marginTop: 36 }}>
          <div className="mono" style={{ marginBottom: 14 }}>{t('universities_l').toUpperCase()}</div>
          <div className="grid-3">
            {unis.map(u => (
              <Link key={u.id} to={`/universities/${u.id}`} className="card-flat" style={{ cursor: 'pointer', display: 'block' }}>
                <div className="mono" style={{ marginBottom: 8 }}>{u.group === 'uae' ? 'UAE' : u.country}</div>
                <h3 style={{ fontSize: 16 }}>{uName(u)}</h3>
                <p style={{ fontSize: 13, margin: '6px 0 0' }}>{u.city}</p>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 44 }}>
          <div className="mono" style={{ marginBottom: 14 }}>{t('constellation_h').toUpperCase()}</div>
          <Link to={`/constellation/${career.id}`} className="card" style={{ height: 340, display: 'block', padding: 0, overflow: 'hidden' }}>
            <MeshConstellation centerLabel={cTitle(career)} satellites={satellites} w={860} h={340} />
          </Link>
        </div>
      </div>
    </section>
  );
}
