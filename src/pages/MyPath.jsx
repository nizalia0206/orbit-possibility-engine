import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrbit } from '../store';
import { rankedCareers, recommendedUniversities } from '../engine';
import { universitiesForCareer } from '../data';

export default function MyPath() {
  const { state, t, sName, iName, stName, cTitle, cCat, uName } = useOrbit();
  const navigate = useNavigate();
  const hasProfile = state.pathBuilt && (state.profile.subjects.length + state.profile.interests.length + state.profile.strengths.length > 0);

  if (!hasProfile) {
    return (
      <div className="empty-state" data-tour="mypath-anchor">
        <div className="icon">✦</div>
        <h2>{t('mypath_empty_h')}</h2>
        <p>{t('mypath_empty_p')}</p>
        <Link to="/build/1" className="btn btn-primary">{t('cta_build')} →</Link>
      </div>
    );
  }

  const top = rankedCareers(state.profile).filter(r => r.match).slice(0, 4);
  const destUnis = recommendedUniversities(state.profile).slice(0, 3);

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap">
        <div className="flex-between" data-tour="mypath-anchor" style={{ marginBottom: 20 }}>
          <div>
            <div className="eyebrow">ORBIT</div>
            <h1 style={{ fontSize: 'clamp(30px,5vw,52px)' }}>{t('mypath_h')}</h1>
            <p>{t('mypath_p')}</p>
          </div>
          <Link to="/profile" className="btn btn-secondary btn-sm">{t('edit_profile')}</Link>
        </div>

        <SigRow label={t('subjects_l')} arr={state.profile.subjects} nameFn={sName} />
        <SigRow label={t('interests_l')} arr={state.profile.interests} nameFn={iName} />
        <SigRow label={t('strengths_l')} arr={state.profile.strengths} nameFn={stName} />

        <div className="mono" style={{ margin: '44px 0 16px', color: 'var(--purple-bright)' }}>{t('primary_pathway')}</div>
        <div className="grid-bg" style={{ minHeight: 520 }}><PathwaySVG /></div>

        <div style={{ marginTop: 56 }}>
          <div className="flex-between" style={{ marginBottom: 22 }}>
            <h2 style={{ fontSize: 26 }}>{t('top_matches')}</h2>
            <Link to="/careers" style={{ color: 'var(--purple-bright)', fontWeight: 600 }}>{t('view_all')} →</Link>
          </div>
          <div className="grid-2">
            {top.length ? top.map(r => (
              <div key={r.career.id} className="row-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/careers/${r.career.id}`)}>
                <div className="rc-left"><h4>{cTitle(r.career)}</h4><p>{cCat(r.career)}</p></div>
                <div className="rc-right"><span className="num">{r.match}</span><span style={{ color: 'var(--text-dimmer)' }}>→</span></div>
              </div>
            )) : <p>{t('none_add')}</p>}
          </div>
        </div>

        <div style={{ marginTop: 56 }}>
          <div className="flex-between" style={{ marginBottom: 22 }}>
            <h2 style={{ fontSize: 26 }}>{t('recommended_dest')}</h2>
            <Link to="/universities" style={{ color: 'var(--purple-bright)', fontWeight: 600 }}>{t('view_all')} →</Link>
          </div>
          <div className="grid-3">
            {destUnis.length ? destUnis.map(d => (
              <div key={d.uni.id} className="row-card" style={{ flexDirection: 'column', alignItems: 'stretch', cursor: 'pointer' }} onClick={() => navigate(`/universities/${d.uni.id}`)}>
                <div className="flex-between" style={{ width: '100%' }}>
                  <div className="rc-left"><h4>{state.lang === 'ar' ? uName(d.uni) : d.uni.abbr}</h4><p>{d.uni.city}, {d.uni.country}</p></div>
                  <span className="num">{d.score}</span>
                </div>
                <div className="row-tags">
                  <span className="row-tag">{cTitle(d.career)} pathway</span>
                  <span className="row-tag">{t('relevant_degree')}</span>
                </div>
              </div>
            )) : <p>{t('none_add')}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function SigRow({ label, arr, nameFn }) {
  return (
    <div style={{ padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
      <div className="mono" style={{ marginBottom: 12 }}>{label}</div>
      <div className="pillgrid">
        {arr.length ? arr.map(a => <span key={a} className="pill selected" style={{ cursor: 'default' }}>{nameFn(a)}</span>) : <span style={{ color: 'var(--text-dimmer)' }}>—</span>}
      </div>
    </div>
  );
}

function PwNode({ x, y, kicker, val }) {
  const label = val.length > 22 ? val.slice(0, 20) + '…' : val;
  return (
    <g>
      <rect x={x - 105} y={y - 38} width="210" height="76" rx="16" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1.2" />
      <text x={x} y={y - 10} textAnchor="middle" fontFamily="IBM Plex Mono,monospace" fontSize="9" letterSpacing="1.5" fill="var(--purple-bright)">{kicker.toUpperCase()}</text>
      <text x={x} y={y + 14} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="15" fontWeight="700" fill="var(--text)">{label}</text>
    </g>
  );
}

function PathwaySVG() {
  const { state, t, sName, cTitle } = useOrbit();
  const subs = state.profile.subjects.slice(0, 2);
  const topR = rankedCareers(state.profile).filter(r => r.match)[0];
  const uni = topR ? universitiesForCareer(topR.career)[0] : null;
  const W = 760;
  const rowH = 140;
  let y = 70;
  const cx = W / 2;
  const SUBJECT_L = state.lang === 'ar' ? 'مادة' : 'SUBJECT';
  const DEGREE_L = state.lang === 'ar' ? 'تخصص' : 'DEGREE';
  const UNI_L = state.lang === 'ar' ? 'جامعة' : 'UNIVERSITY';

  const positions = [];
  subs.forEach(s => { positions.push({ y, kicker: SUBJECT_L, val: sName(s) }); y += rowH; });
  if (topR) { positions.push({ y, kicker: 'CAREER', val: cTitle(topR.career) }); y += rowH; }
  if (topR) { positions.push({ y, kicker: DEGREE_L, val: topR.career.degrees[0] }); y += rowH; }
  if (uni) { positions.push({ y, kicker: UNI_L, val: state.lang === 'ar' ? uni.nameAr : uni.abbr }); y += rowH; }
  const H = y;

  return (
    <svg viewBox={`0 0 ${W} ${H + 90}`} width="100%" height="100%" style={{ minHeight: 520 }}>
      {positions.slice(0, -1).map((p, i) => (
        <line key={i} x1={cx} y1={p.y + 38} x2={cx} y2={positions[i + 1].y - 38} stroke="var(--border-strong)" strokeWidth="1.4" opacity="0.6" />
      ))}
      {positions.map((p, i) => <PwNode key={i} x={cx} y={p.y} kicker={p.kicker} val={p.val} />)}
      {topR && (
        <>
          <text x={cx} y={H + 30} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="46" fontWeight="900" fill="var(--text)">{topR.match}</text>
          <text x={cx} y={H + 52} textAnchor="middle" fontFamily="IBM Plex Mono,monospace" fontSize="10" letterSpacing="1.5" fill="var(--text-dimmer)">ORBIT {t('match').toUpperCase()}</text>
        </>
      )}
    </svg>
  );
}
