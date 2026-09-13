import React, { useEffect, useState } from 'react';
import { useOrbit } from '../store';
import { SUBJECTS, INTERESTS, STRENGTHS, CAREERS } from '../data';
import { whatIfTop, rankedCareers } from '../engine';

export default function WhatIf() {
  const { state, t, sName, iName, stName, cTitle, ensureHypotheticalInit, resetHypothetical, toggleHypothetical } = useOrbit();
  const [tab, setTab] = useState('subjects');

  useEffect(() => { ensureHypotheticalInit(); }, [ensureHypotheticalInit]);

  const tabMap = {
    subjects: { list: SUBJECTS, nameFn: sName, label: t('tab_subjects') },
    interests: { list: INTERESTS, nameFn: iName, label: t('tab_interests') },
    strengths: { list: STRENGTHS, nameFn: stName, label: t('tab_strengths') },
  };
  const cur = state.hypothetical[tab] || [];

  const top = whatIfTop(state.hypothetical, 4);
  const max = Math.max(...top.map(x => x.score), 1);

  const realTop = new Set(rankedCareers(state.profile).filter(r => r.match && r.match >= 20).map(r => r.career.id));
  const hypoTop = new Set(whatIfTop(state.hypothetical, 8).map(x => x.career.id));
  const gained = [...hypoTop].filter(id => !realTop.has(id));
  const reduced = [...realTop].filter(id => !hypoTop.has(id));
  const strengthened = [...hypoTop].filter(id => realTop.has(id));
  const byId = (id) => CAREERS.find(c => c.id === id);

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap">
        <div className="eyebrow">ORBIT</div>
        <h1 style={{ fontSize: 'clamp(30px,5vw,48px)', marginBottom: 12 }}>{t('whatif_h')}</h1>
        <p style={{ maxWidth: 560, marginBottom: 30 }}>{t('whatif_p')}</p>

        <div className="whatif-grid">
          <div className="card" data-tour="whatif-anchor">
            <div className="tabs">
              {Object.keys(tabMap).map(k => (
                <button key={k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{tabMap[k].label}</button>
              ))}
            </div>
            <div className="mono" style={{ marginBottom: 10 }}>{t('current_subjects')}</div>
            <div className="pillgrid" style={{ marginBottom: 18 }}>
              {cur.length
                ? cur.map(v => (
                  <span key={v} className="pill selected" style={{ cursor: 'pointer' }} onClick={() => toggleHypothetical(tab, v)}>
                    {tabMap[tab].nameFn(v)} ✕
                  </span>
                ))
                : <span style={{ color: 'var(--text-dimmer)', fontSize: 14 }}>{t('none_add')}</span>}
            </div>
            <div className="mono" style={{ marginBottom: 10 }}>{t('add_remove')}</div>
            <div className="pillgrid">
              {tabMap[tab].list.map(v => (
                <button key={v} className={`pill ${cur.includes(v) ? 'selected' : ''}`} onClick={() => toggleHypothetical(tab, v)}>
                  {tabMap[tab].nameFn(v)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 22 }}>
              <div className="mono" style={{ marginBottom: 18 }}>{t('possibility_space')}</div>
              {top.length ? top.map((r, i) => (
                <div key={r.career.id} className="result-row" style={{ border: 'none', padding: '14px 0' }}>
                  <div style={{ width: '100%' }}>
                    <div className="flex-between">
                      <div><span className="mono" style={{ marginInlineEnd: 8 }}>0{i + 1}</span><strong>{cTitle(r.career)}</strong></div>
                      <strong>{r.score}</strong>
                    </div>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${(r.score / max * 100).toFixed(0)}%` }} /></div>
                  </div>
                </div>
              )) : <p style={{ margin: 0 }}>{t('none_add')}</p>}
            </div>

            <div className="grid-3">
              <div className="deltabox gain">
                <h4>✦ {t('pathway_gained')}</h4>
                {gained.length ? <ul>{gained.map(id => <li key={id}>{cTitle(byId(id))}</li>)}</ul> : <p style={{ margin: 0, color: 'var(--text-dimmer)' }}>{t('no_change')}</p>}
              </div>
              <div className="deltabox">
                <h4 style={{ color: 'var(--purple-bright)' }}>↗ {t('pathway_strengthened')}</h4>
                {strengthened.length ? <ul>{strengthened.map(id => <li key={id}>{cTitle(byId(id))}</li>)}</ul> : <p style={{ margin: 0, color: 'var(--text-dimmer)' }}>{t('no_change')}</p>}
              </div>
              <div className="deltabox reduce">
                <h4>↘ {t('pathway_reduced')}</h4>
                {reduced.length ? <ul>{reduced.map(id => <li key={id}>{cTitle(byId(id))}</li>)}</ul> : <p style={{ margin: 0, color: 'var(--text-dimmer)' }}>{t('no_change')}</p>}
              </div>
            </div>
          </div>
        </div>

        <button className="btn btn-secondary" style={{ marginTop: 26 }} onClick={resetHypothetical}>↻ {t('reset_profile')}</button>
        <p style={{ marginTop: 14, maxWidth: 520, fontSize: 13.5 }}>{t('hypothetical_note')}</p>
      </div>
    </section>
  );
}
