import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrbit } from '../store';
import { SUBJECTS, INTERESTS, STRENGTHS } from '../data';
import { CATEGORY_LIST } from '../categoryList';
import Pill from '../components/Pill';

const STEP_KEYS = ['subjects', 'interests', 'strengths', 'futures'];

export default function Build() {
  const { step: stepParam } = useParams();
  const step = Math.min(Math.max(parseInt(stepParam, 10) || 1, 1), 4);
  const key = STEP_KEYS[step - 1];
  const navigate = useNavigate();
  const { state, t, sName, iName, stName, toggleBuildDraft, generatePath } = useOrbit();
  const [generating, setGenerating] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const timers = useRef([]);

  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const segs = [1, 2, 3, 4].map(i => <span key={i} className={i <= step ? 'done' : ''} />);

  function goNext() { navigate(`/build/${step + 1}`); }
  function goBack() { navigate(step > 1 ? `/build/${step - 1}` : '/'); }

  function runGenerate() {
    const all = [
      ...state.buildDraft.subjects.map(sName),
      ...state.buildDraft.interests.map(iName),
      ...state.buildDraft.strengths.map(stName),
    ];
    setGenerating(true);
    setVisibleCount(0);
    setBarWidth(0);
    timers.current.push(setTimeout(() => setBarWidth(100), 20));
    all.forEach((_, i) => {
      timers.current.push(setTimeout(() => setVisibleCount(c => c + 1), 120 * i));
    });
    timers.current.push(setTimeout(() => {
      generatePath();
      navigate('/my-path');
    }, Math.min(1300, 250 + 120 * all.length)));
    return all;
  }

  const genPills = generating ? [
    ...state.buildDraft.subjects.map(sName),
    ...state.buildDraft.interests.map(iName),
    ...state.buildDraft.strengths.map(stName),
  ] : [];

  let body;
  if (key === 'subjects') body = <StepPills group="subjects" list={SUBJECTS} nameFn={sName} heading={t('step_subjects_h')} sub={t('step_subjects_p')} />;
  else if (key === 'interests') body = <StepPills group="interests" list={INTERESTS} nameFn={iName} heading={t('step_interests_h')} sub={t('step_interests_p')} cyan />;
  else if (key === 'strengths') body = <StepPills group="strengths" list={STRENGTHS} nameFn={stName} heading={t('step_strengths_h')} sub={t('step_strengths_p')} />;
  else body = <StepFutures />;

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap" style={{ maxWidth: 840 }}>
        <div className="flex-between" style={{ marginBottom: 50 }}>
          <div className="mono">{t('build_step')} 0{step} {t('of4')}</div>
          <div className="progress-segs">{segs}</div>
        </div>
        {body}
        <div className="step-nav">
          <button className="btn btn-ghost" onClick={goBack}>← {step > 1 ? t('back') : t('home_label')}</button>
          {key !== 'futures'
            ? <button className="btn btn-primary" onClick={goNext}>{t('cont')} →</button>
            : <button className="btn btn-primary" onClick={runGenerate}>{t('generate')} →</button>}
        </div>
      </div>

      {generating && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
          <div className="mono" style={{ color: 'var(--purple-bright)', letterSpacing: '.2em' }}>{t('generating')}</div>
          <div className="pillgrid" style={{ justifyContent: 'center', maxWidth: 640 }}>
            {genPills.map((v, i) => (
              <span key={i} className="pill selected" style={{ opacity: i < visibleCount ? 1 : 0, transition: 'opacity .4s ease', cursor: 'default' }}>{v}</span>
            ))}
          </div>
          <div style={{ width: 280, height: 2, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${barWidth}%`, background: 'var(--purple-bright)', transition: 'width 1.1s ease' }} />
          </div>
          <p style={{ margin: 0 }}>{t('building_space')}</p>
        </div>
      )}
    </section>
  );
}

function StepPills({ group, list, nameFn, heading, sub, cyan }) {
  const { state, t, toggleBuildDraft } = useOrbit();
  const selected = state.buildDraft[group] || [];
  return (
    <>
      <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', marginBottom: 16 }}>{heading}</h1>
      <p style={{ marginBottom: 36, fontSize: 16 }}>{sub}</p>
      <div className="pillgrid">
        {list.map(item => (
          <Pill key={item} label={nameFn(item)} cyan={cyan} selected={selected.includes(item)} onClick={() => toggleBuildDraft(group, item)} />
        ))}
      </div>
      <div className="mono" style={{ marginTop: 22, color: 'var(--purple-bright)' }}>{selected.length} {t('selected')}</div>
    </>
  );
}

function StepFutures() {
  const { state, t, toggleBuildDraft, cCat } = useOrbit();
  const selected = state.buildDraft.futures || [];
  return (
    <>
      <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', marginBottom: 16 }}>{t('step_futures_h')}</h1>
      <p style={{ marginBottom: 36, fontSize: 16 }}>{t('step_futures_p')}</p>
      <div className="pillgrid">
        {CATEGORY_LIST.map(c => (
          <Pill key={c.key} label={c.label(state.lang)} cyan selected={selected.includes(c.key)} onClick={() => toggleBuildDraft('futures', c.key)} />
        ))}
      </div>
      <div className="mono" style={{ marginTop: 22, color: 'var(--purple-bright)' }}>{selected.length} {t('selected')}</div>
    </>
  );
}
