import React from 'react';
import { useOrbit } from '../store';
import { UNIVERSITIES, CAREERS, universitiesForCareer } from '../data';
import { rankedCareers, parseTuitionUSD, axisValuesFor, computeMatch } from '../engine';
import { BarChart, RadarChart } from '../components/Charts';

const COLORS = ['var(--purple)', 'var(--cyan)', 'var(--amber)'];

export default function Pathways() {
  const { state, t, uName, cTitle } = useOrbit();
  const compared = UNIVERSITIES.filter(u => state.compareList.includes(u.id));
  const topCareer = rankedCareers(state.profile).filter(r => r.match)[0]?.career || CAREERS[0];
  const items = compared.length ? compared.slice(0, 3) : universitiesForCareer(topCareer).slice(0, 2);

  const tuitionVals = items.map(u => parseTuitionUSD(u.tuition));
  const alignVals = items.map(u => computeMatch(state.profile, topCareer) || (40 + (u.id.length * 11) % 50));
  const unlockedFor = (u) => CAREERS.filter(c => u.degrees.some(d => c.degrees.some(cd => cd.includes(d)) || c.category === d));
  const unlockedLists = items.map(unlockedFor);
  const outcomeVals = unlockedLists.map(list => list.length);
  const labelFor = (u) => (state.lang === 'ar' ? uName(u) : u.abbr);

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap" data-tour="pathways-anchor">
        <div className="eyebrow">{t('pathway_comparison_eyebrow')}</div>
        <h1 style={{ fontSize: 'clamp(30px,5vw,50px)', marginBottom: 14 }}>{t('compare_pathways_h')}</h1>
        <p style={{ maxWidth: 560, marginBottom: 34 }}>{t('compare_pathways_p_pre')} {items.length} {t('compare_pathways_p_post')}</p>
        {!compared.length && <p className="mono" style={{ marginBottom: 24 }}>{t('pathways_demo_note')}</p>}

        <div className="grid-2">
          <div className="chart-card">
            <div className="mono">{t('chart_tuition')}</div>
            <p style={{ fontSize: 13, margin: '6px 0 18px' }}>{t('chart_tuition_sub')}</p>
            <BarChart
              items={items.map((u, i) => ({
                label: labelFor(u),
                value: tuitionVals[i],
                color: COLORS[i],
                tipTitle: labelFor(u),
                tipLines: [
                  { text: u.tuition, tone: 'default' },
                  { text: `$${tuitionVals[i].toLocaleString()} USD/yr`, tone: 'accent' },
                ],
              }))}
              fmt={(v) => `$${Math.round(v / 1000)}k`}
            />
          </div>
          <div className="chart-card">
            <div className="mono">{t('chart_alignment')}</div>
            <p style={{ fontSize: 13, margin: '6px 0 18px' }}>{t('chart_alignment_sub')}</p>
            <BarChart
              items={items.map((u, i) => ({
                label: labelFor(u),
                value: alignVals[i],
                color: COLORS[i],
                tipTitle: labelFor(u),
                tipLines: [{ text: `${alignVals[i]} ${t('match')} · ${cTitle(topCareer)}`, tone: 'accent' }],
              }))}
              fmt={(v) => String(Math.round(v))}
              maxOverride={99}
            />
          </div>
          <div className="chart-card">
            <div className="mono">{t('chart_outcomes')}</div>
            <p style={{ fontSize: 13, margin: '6px 0 18px' }}>{t('chart_outcomes_sub')}</p>
            <BarChart
              items={items.map((u, i) => {
                const unlocked = unlockedLists[i];
                const countLabel = `${unlocked.length} ${unlocked.length === 1 ? t('career_unlocked_one') : t('career_unlocked_many')}`;
                return {
                  label: labelFor(u),
                  value: outcomeVals[i],
                  color: COLORS[i],
                  tipTitle: labelFor(u),
                  tipLines: unlocked.length
                    ? [
                        { text: countLabel, tone: 'accent' },
                        { text: unlocked.map(c => cTitle(c)).join(', '), tone: 'dim' },
                      ]
                    : [{ text: countLabel, tone: 'accent' }],
                };
              })}
              fmt={(v) => String(Math.round(v))}
              maxOverride={Math.max(4, ...outcomeVals)}
            />
          </div>
          <div className="chart-card">
            <div className="mono">{t('chart_multiaxis')}</div>
            <p style={{ fontSize: 13, margin: '6px 0 18px' }}>{t('chart_multiaxis_sub')}</p>
            <RadarChart series={items.map((u, i) => ({ label: labelFor(u), color: COLORS[i], values: axisValuesFor(u) }))} />
          </div>
        </div>
        <div className="src" style={{ marginTop: 8 }}>{t('sample_notlive')} · {t('tuition_normalized')}</div>

        {items.length > 1 && (
          <div className="card-flat" style={{ marginTop: 30, overflowX: 'auto' }}>
            <div className="mono" style={{ marginBottom: 16 }}>{t('summary')}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr style={{ textAlign: state.lang === 'ar' ? 'right' : 'left' }}>
                  {[t('pathway'), t('career_l'), t('degrees_l'), 'TUITION', 'ALIGN', 'OUTCOMES', t('budget_l')].map(h => (
                    <th key={h} className="mono" style={{ padding: '8px 10px', fontWeight: 400, borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((u, i) => {
                  const firstUnlocked = unlockedLists[i][0];
                  const degreeLabel = firstUnlocked ? firstUnlocked.degrees[0] : topCareer.degrees[0];
                  return (
                    <tr key={u.id}>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: COLORS[i] }}>{labelFor(u)}</td>
                      <td style={{ padding: '12px 10px' }}>{cTitle(topCareer)}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-dimmer)' }}>{degreeLabel}</td>
                      <td style={{ padding: '12px 10px' }}>${tuitionVals[i].toLocaleString()}</td>
                      <td style={{ padding: '12px 10px' }}>{alignVals[i]}</td>
                      <td style={{ padding: '12px 10px' }}>{outcomeVals[i]}</td>
                      <td style={{ padding: '12px 10px', textTransform: 'capitalize' }}>{u.budget}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
