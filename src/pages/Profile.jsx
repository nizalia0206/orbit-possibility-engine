import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrbit } from '../store';
import { SUBJECTS, INTERESTS, STRENGTHS } from '../data';
import { rankedCareers } from '../engine';

export default function Profile() {
  const { state, t, sName, iName, stName, cTitle, toggleProfile, resetBuildDraft, resetProfile } = useOrbit();
  const navigate = useNavigate();
  const top = rankedCareers(state.profile).filter(r => r.match).slice(0, 3);

  function handleRebuild() {
    resetBuildDraft();
    navigate('/build/1');
  }

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap" style={{ maxWidth: 900 }}>
        <div className="eyebrow">{t('nav_profile').toUpperCase()}</div>
        <h1 style={{ fontSize: 'clamp(30px,5vw,48px)', marginBottom: 14 }}>{t('profile_h')}</h1>
        <p style={{ maxWidth: 560, marginBottom: 32 }}>{t('profile_p')}</p>

        <div className="card" data-tour="profile-anchor" style={{ marginBottom: 40 }}>
          <div className="mono">{t('live_recalc')}</div>
          <div style={{ marginTop: 14 }}>
            {top.length ? (
              <>
                {top.map(r => (
                  <div key={r.career.id} className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <strong>{cTitle(r.career)}</strong><strong>{r.match}</strong>
                  </div>
                ))}
                <Link to="/my-path" style={{ color: 'var(--purple-bright)', fontWeight: 600, display: 'inline-block', marginTop: 14 }}>{t('view_my_path')} →</Link>
              </>
            ) : <p style={{ margin: 0 }}>{t('none_add')}</p>}
          </div>
        </div>

        <div className="field-group">
          <div className="fg-label">{t('subjects_l')} <span style={{ color: 'var(--text-dimmer)' }}>— {t('step_subjects_h')}</span></div>
          <div className="pillgrid">
            {SUBJECTS.map(s => (
              <button key={s} className={`pill ${state.profile.subjects.includes(s) ? 'selected' : ''}`} onClick={() => toggleProfile('subjects', s)}>{sName(s)}</button>
            ))}
          </div>
        </div>
        <div className="field-group">
          <div className="fg-label">{t('interests_l')} <span style={{ color: 'var(--text-dimmer)' }}>— {t('step_interests_h')}</span></div>
          <div className="pillgrid">
            {INTERESTS.map(s => (
              <button key={s} className={`pill cyan ${state.profile.interests.includes(s) ? 'selected' : ''}`} onClick={() => toggleProfile('interests', s)}>{iName(s)}</button>
            ))}
          </div>
        </div>
        <div className="field-group">
          <div className="fg-label">{t('strengths_l')} <span style={{ color: 'var(--text-dimmer)' }}>— {t('step_strengths_h')}</span></div>
          <div className="pillgrid">
            {STRENGTHS.map(s => (
              <button key={s} className={`pill ${state.profile.strengths.includes(s) ? 'selected' : ''}`} onClick={() => toggleProfile('strengths', s)}>{stName(s)}</button>
            ))}
          </div>
        </div>

        <div className="divider" />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleRebuild}>{t('rebuild_scratch')}</button>
          <button className="btn btn-secondary" onClick={resetProfile}>↻ {t('reset_profile_btn')}</button>
        </div>
      </div>
    </section>
  );
}
