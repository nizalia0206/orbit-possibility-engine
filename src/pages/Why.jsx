import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrbit } from '../store';
import { CAREERS } from '../data';
import { overlap } from '../engine';
import { MiniConstellation, buildCareerSatellites } from '../components/Constellations';

const DEMO_SUBJECTS = ['Biology', 'Mathematics', 'Computer Science', 'Art & Design', 'Economics'];

export default function Why() {
  const { t, sName } = useOrbit();
  const stepsList = [
    { l: t('problem_1_l'), d: t('problem_1_d') },
    { l: t('problem_2_l'), d: t('problem_2_d') },
    { l: t('problem_3_l'), d: t('problem_3_d') },
    { l: t('problem_4_l'), d: t('problem_4_d') },
    { l: t('future_options_l'), d: t('future_options_d') },
  ];

  return (
    <>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap" data-tour="why-anchor" style={{ maxWidth: 820 }}>
          <div className="eyebrow">{t('why_eyebrow')}</div>
          <h1 style={{ fontSize: 'clamp(34px,6.4vw,64px)', marginBottom: 24 }}>{t('why_hero_h1')}<br />{t('why_hero_h2')}</h1>
          <p style={{ fontSize: 17, maxWidth: 620 }}>{t('why_hero_p')}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <div className="eyebrow">{t('problem_label')}</div>
          <h2 style={{ fontSize: 'clamp(28px,4.6vw,46px)', marginBottom: 40 }}>"{t('problem_h')}"</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {stepsList.map((s, i) => (
              <div key={i} className="flex-between" style={{ padding: '18px 0', borderBottom: '1px solid var(--border)', opacity: i < 2 ? 1 : 0.35 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                  <span className="mono" style={{ color: 'var(--purple-bright)' }}>0{i + 1}</span>
                  <h3 style={{ fontSize: 'clamp(20px,3vw,30px)' }}>{s.l}</h3>
                  <span style={{ color: 'var(--text-dimmer)', fontSize: 14 }}>{s.d}</span>
                </div>
                {i < stepsList.length - 1 && <span style={{ color: 'var(--purple-bright)' }}>↓</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 1100 }}>
          <div className="eyebrow">{t('evidence_label')}</div>
          <h2 style={{ fontSize: 'clamp(26px,4.4vw,42px)', marginBottom: 40 }}>{t('evidence_h')}</h2>
          <div className="grid-3">
            <div className="chart-card">
              <div className="stat-big">39%</div>
              <p style={{ marginTop: 10 }}>{t('evidence_39')}</p>
              <div className="data-tag">{t('latest_published')}</div>
              <div className="src">{t('src_39')}</div>
            </div>
            <div className="chart-card">
              <div className="stat-big">21%</div>
              <p style={{ marginTop: 10 }}>{t('evidence_21')}</p>
              <div className="data-tag">{t('latest_published')}</div>
              <div className="src">{t('src_21')}</div>
            </div>
            <div className="chart-card">
              <div className="stat-big">34% <span style={{ fontSize: 22, color: 'var(--text-dimmer)' }}>vs</span> 11%</div>
              <p style={{ marginTop: 10 }}>{t('evidence_gap')}</p>
              <div className="data-tag">{t('latest_published')}</div>
              <div className="src">{t('src_gap')}</div>
            </div>
          </div>
          <div className="card-flat" style={{ marginTop: 30 }}>
            <div className="mono" style={{ marginBottom: 14 }}>{t('misalignment_chart_title')}</div>
            <MisalignmentBar />
            <div className="src">{t('misalignment_src')}</div>
          </div>

          <div style={{ marginTop: 56 }}>
            <div className="eyebrow">{t('landscape_label')}</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', marginBottom: 12 }}>{t('landscape_h')}</h2>
            <p style={{ maxWidth: 620, marginBottom: 24, color: 'var(--text-dim)' }}>{t('landscape_p')}</p>
            <LandscapeTable />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center" style={{ maxWidth: 760 }}>
          <div className="eyebrow">{t('matters_label')}</div>
          <h2 style={{ fontSize: 'clamp(26px,4.4vw,44px)' }}>{t('matters_h1')}</h2>
          <h2 style={{ fontSize: 'clamp(26px,4.4vw,44px)', color: 'var(--purple-bright)' }}>{t('matters_h2')}</h2>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="eyebrow">{t('solution_label')}</div>
          <h2 style={{ fontSize: 'clamp(26px,4.4vw,44px)', marginBottom: 16 }}>{t('solution_h')}</h2>
          <p style={{ maxWidth: 560, marginBottom: 36 }}>{t('solution_p')}</p>
          <SolutionDemo />

          <div style={{ marginTop: 56 }}>
            <div className="mono" style={{ marginBottom: 18, color: 'var(--text-dimmer)' }}>{t('solution_flow_label')}</div>
            <div className="solution-flow">
              {stepsList.map((s, i) => (
                <React.Fragment key={i}>
                  <div className="solution-flow-step">
                    <span className="mono" style={{ color: 'var(--purple-bright)' }}>0{i + 1}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{s.l}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-dimmer)' }}>{s.d}</div>
                    </div>
                  </div>
                  {i < stepsList.length - 1 && <span className="solution-flow-arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>{t('embed_label')}</div>
            <h3 style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: 14, maxWidth: 640 }}>{t('embed_h')}</h3>
            <p style={{ maxWidth: 640, marginBottom: 22 }}>{t('embed_p')}</p>
            <div className="chiprow" style={{ marginBottom: 0 }}>
              <span className="pill" style={{ cursor: 'default' }}>{t('embed_tag1')}</span>
              <span className="pill" style={{ cursor: 'default' }}>{t('embed_tag2')}</span>
              <span className="pill" style={{ cursor: 'default' }}>{t('embed_tag3')}</span>
              <span className="pill" style={{ cursor: 'default' }}>{t('embed_tag4')}</span>
            </div>
          </div>

          <div className="card" style={{ marginTop: 24, textAlign: 'center', borderColor: 'var(--border-strong)', background: 'rgba(139,91,245,.06)' }}>
            <div className="eyebrow" style={{ marginBottom: 18 }}>{t('principle_label')}</div>
            <h2 style={{ fontSize: 'clamp(28px,5vw,48px)' }}>{t('closing_h1')}<br />{t('closing_h2')}<br />{t('closing_h3')}</h2>
          </div>
          <div className="center" style={{ marginTop: 36 }}>
            <Link to="/build/1" className="btn btn-primary">{t('cta_build')} →</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function MisalignmentBar() {
  const { t } = useOrbit();
  const data = [
    { label: t('least_advantaged'), val: 34, amber: true },
    { label: t('most_advantaged'), val: 11, amber: false },
  ];
  const max = 40;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {data.map(d => (
        <div key={d.label}>
          <div className="flex-between"><span>{d.label}</span><strong>{d.val}%</strong></div>
          <div className="bar-track" style={{ height: 14 }}>
            <div className="bar-fill" style={{ width: `${(d.val / max * 100).toFixed(0)}%`, background: d.amber ? 'var(--amber)' : 'var(--cyan)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const LANDSCAPE_ROWS = [
  { key: 'landscape_row1', counselor: 'partial', quiz: 'no', unisite: 'no', orbit: 'yes' },
  { key: 'landscape_row2', counselor: 'no', quiz: 'no', unisite: 'no', orbit: 'yes' },
  { key: 'landscape_row3', counselor: 'partial', quiz: 'no', unisite: 'no', orbit: 'yes' },
  { key: 'landscape_row4', counselor: 'no', quiz: 'no', unisite: 'no', orbit: 'yes' },
  { key: 'landscape_row5', counselor: 'no', quiz: 'yes', unisite: 'yes', orbit: 'yes' },
  { key: 'landscape_row6', counselor: 'partial', quiz: 'no', unisite: 'partial', orbit: 'yes' },
];

function Mark({ v }) {
  if (v === 'yes') return <span className="mark-yes">✓</span>;
  if (v === 'partial') return <span className="mark-partial">~</span>;
  return <span className="mark-no">✕</span>;
}

function LandscapeTable() {
  const { t } = useOrbit();
  return (
    <>
      <div className="landscape-scroll">
        <table className="landscape-table">
          <thead>
            <tr>
              <th>{t('landscape_col_feature')}</th>
              <th>{t('landscape_col_counselor')}</th>
              <th>{t('landscape_col_quiz')}</th>
              <th>{t('landscape_col_unisite')}</th>
              <th className="orbit-col">{t('landscape_col_orbit')}</th>
            </tr>
          </thead>
          <tbody>
            {LANDSCAPE_ROWS.map(r => (
              <tr key={r.key}>
                <td>{t(r.key)}</td>
                <td><Mark v={r.counselor} /></td>
                <td><Mark v={r.quiz} /></td>
                <td><Mark v={r.unisite} /></td>
                <td className="orbit-col"><Mark v={r.orbit} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="src" style={{ marginTop: 12 }}>{t('landscape_note')}</div>
    </>
  );
}

function SolutionDemo() {
  const { state, sName, iName, stName } = useOrbit();
  const [sel, setSel] = useState([]);
  const matched = CAREERS.filter(c => overlap(c.subjects, sel) > 0).slice(0, 5);
  const satellites = matched.length
    ? matched.flatMap(c => buildCareerSatellites(c, state.profile, sName, iName, stName)).slice(0, 8)
    : ['Careers', 'Degrees', 'Universities', 'Interests', 'Strengths', 'Subjects'].map((l, i) => ({ label: l, strength: i % 3 === 0 ? 'strong' : i % 3 === 1 ? 'mid' : 'low' }));

  function toggle(v) {
    setSel(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  }

  return (
    <div className="grid-2 why-grid" style={{ alignItems: 'start' }}>
      <div className="card">
        <div className="mono" style={{ marginBottom: 14 }}>Subjects</div>
        <div className="pillgrid">
          {DEMO_SUBJECTS.map(s => (
            <button key={s} className={`pill ${sel.includes(s) ? 'selected' : ''}`} onClick={() => toggle(s)}>{sName(s)}</button>
          ))}
        </div>
      </div>
      <div className="grid-bg" style={{ height: 320 }}>
        <MiniConstellation centerLabel={sel[0] ? sName(sel[0]) : 'ORBIT'} satellites={satellites} />
      </div>
    </div>
  );
}
