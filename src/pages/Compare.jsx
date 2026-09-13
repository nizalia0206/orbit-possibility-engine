import React from 'react';
import { Link } from 'react-router-dom';
import { useOrbit } from '../store';
import { UNIVERSITIES } from '../data';

export default function Compare() {
  const { state, t, toggleCompare } = useOrbit();
  const list = UNIVERSITIES.filter(u => state.compareList.includes(u.id));

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap" data-tour="compare-anchor">
        <div className="eyebrow">{t('compare_h').toUpperCase()}</div>
        <h1 style={{ fontSize: 'clamp(30px,5vw,50px)', marginBottom: 10 }}>{t('compare_h')}</h1>
        <p style={{ marginBottom: 40 }}>{t('compare_p_pre')} {list.length} {t('compare_p_mid')}</p>

        {list.length ? (
          <>
            <div className="compare-cols">
              {list.map(u => <CompareCol key={u.id} u={u} />)}
              {list.length < 3 && <EmptySlot n={3 - list.length} />}
            </div>
            <div className="flex-between" style={{ marginTop: 30 }}>
              <Link to="/universities" style={{ color: 'var(--purple-bright)', fontWeight: 600 }}>← {t('back_to_uni_explorer')}</Link>
              <Link to="/pathways" style={{ color: 'var(--purple-bright)', fontWeight: 600 }}>{t('view_chart_comparison')} →</Link>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ padding: '60px 0' }}>
            <p>{t('compare_empty')}</p>
            <Link to="/universities" className="btn btn-primary">{t('nav_universities')} →</Link>
          </div>
        )}
      </div>
    </section>
  );
}

function EmptySlot({ n }) {
  const { t } = useOrbit();
  return (
    <Link to="/universities" className="compare-col" style={{ borderStyle: 'dashed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, cursor: 'pointer', textDecoration: 'none' }}>
      <div style={{ fontSize: 28, color: 'var(--text-dimmer)', marginBottom: 10 }}>+</div>
      <div style={{ fontWeight: 600 }}>{t('add_another')}</div>
      <div className="mono" style={{ marginTop: 4 }}>{n} {t('slots_left')}</div>
    </Link>
  );
}

function CompareCol({ u }) {
  const { state, t, uName, toggleCompare } = useOrbit();
  const match = 60 + (u.id.length * 7) % 36;
  const admissionFactors = 2 + (u.id.length % 3);
  return (
    <div className="compare-col">
      <button className="rm" onClick={() => toggleCompare(u.id)} aria-label="Remove">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" /></svg>
      </button>
      <div className="mono">{u.group === 'uae' ? 'UAE' : u.country}</div>
      <h3 style={{ margin: '10px 0 20px' }}>{state.lang === 'ar' ? uName(u) : u.abbr}</h3>
      <div className="center" style={{ marginBottom: 10 }}>
        <div className="match-num">{match}</div>
        <div className="match-label">ORBIT {t('match')}</div>
      </div>
      <div className="compare-field"><div className="k">LOCATION</div><div className="v">{u.city}, {u.country}</div></div>
      <div className="compare-field"><div className="k">TUITION</div><div className="v">{t('sample_notlive')}: {u.tuition}</div></div>
      <div className="compare-field"><div className="k">SCHOLARSHIP</div><div className="v">{u.scholarship}</div></div>
      <div className="compare-field"><div className="k">{t('degrees_l').toUpperCase()}</div><div className="v">{u.degrees.slice(0, 3).join(', ')}</div></div>
      <div className="compare-field"><div className="k">{t('admission_factors').toUpperCase()}</div><div className="v">{admissionFactors}</div></div>
    </div>
  );
}
