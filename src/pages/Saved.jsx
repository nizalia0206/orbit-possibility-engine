import React from 'react';
import { useOrbit } from '../store';
import { CAREERS, UNIVERSITIES } from '../data';

export default function Saved() {
  const { state, t, cTitle, cCat, uName, toggleSaved } = useOrbit();
  const savedCareers = CAREERS.filter(c => state.saved.careers.includes(c.id));
  const savedUnis = UNIVERSITIES.filter(u => state.saved.universities.includes(u.id));
  const total = savedCareers.length + state.saved.degrees.length + savedUnis.length;

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap" data-tour="saved-anchor">
        <div className="eyebrow">{t('saved_h').toUpperCase()}</div>
        <h1 style={{ fontSize: 'clamp(30px,5vw,50px)', marginBottom: 10 }}>{t('saved_h')}</h1>
        <p style={{ marginBottom: 40 }}>{total} {t('saved_p_pre')}</p>

        <div className="flex-between" style={{ marginBottom: 18 }}><h2 style={{ fontSize: 20 }}>{t('careers_l')} <span className="count-badge">{savedCareers.length}</span></h2></div>
        {savedCareers.length ? (
          <div className="row-list" style={{ marginBottom: 44 }}>
            {savedCareers.map(c => (
              <div key={c.id} className="row-card">
                <div className="rc-left"><h4>{cTitle(c)}</h4><p>{cCat(c)}</p></div>
                <button className="btn btn-ghost" onClick={() => toggleSaved('careers', c.id)}>{t('remove')}</button>
              </div>
            ))}
          </div>
        ) : <p style={{ marginBottom: 44 }}>{t('no_saved_careers')}</p>}

        <div className="flex-between" style={{ marginBottom: 18 }}><h2 style={{ fontSize: 20 }}>{t('degrees_l')} <span className="count-badge">0</span></h2></div>
        <p style={{ marginBottom: 44 }}>{t('no_saved_degrees')}</p>

        <div className="flex-between" style={{ marginBottom: 18 }}><h2 style={{ fontSize: 20 }}>{t('universities_l')} <span className="count-badge">{savedUnis.length}</span></h2></div>
        {savedUnis.length ? (
          <div className="row-list">
            {savedUnis.map(u => (
              <div key={u.id} className="row-card">
                <div className="rc-left"><h4>{state.lang === 'ar' ? uName(u) : u.abbr}</h4><p>{u.city}, {u.country}</p></div>
                <button className="btn btn-ghost" onClick={() => toggleSaved('universities', u.id)}>{t('remove')}</button>
              </div>
            ))}
          </div>
        ) : <p>{t('no_saved_universities')}</p>}
      </div>
    </section>
  );
}
