import React from 'react';
import { Link } from 'react-router-dom';
import { useOrbit } from '../store';
import { UNIVERSITIES } from '../data';
import { MiniConstellation } from '../components/Constellations';

const PROBLEM_KEYS = ['problem_1', 'problem_2', 'problem_3', 'problem_4'];

export default function Home() {
  const { t, state, uName } = useOrbit();

  return (
    <>
      <section className="hero">
        <div className="hero-label hero-reveal" style={{ animationDelay: '.05s' }}>{t('hero_label')}</div>
        <h1>
          <span className="hero-reveal" style={{ display: 'block', animationDelay: '.16s' }}>{t('hero_l1')}</span>
          <span className="hero-reveal accent" style={{ display: 'block', animationDelay: '.30s' }}>{t('hero_l2')}</span>
          <span className="hero-reveal" style={{ display: 'block', animationDelay: '.44s' }}>{t('hero_l3')}</span>
        </h1>
        <p className="sub hero-reveal" style={{ animationDelay: '.60s' }}>{t('hero_sub')}</p>
        <div className="hero-ctas hero-reveal" style={{ animationDelay: '.74s' }}>
          <Link to="/build/1" className="btn btn-primary" data-tour="build-cta">{t('cta_build')} →</Link>
          <Link to="/careers" className="btn btn-secondary">{t('cta_explore_careers')}</Link>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <h2 style={{ fontSize: 'clamp(26px,4.2vw,46px)', maxWidth: 820, marginBottom: 44 }}>{t('problem_home_h')}</h2>
          <div className="grid-4">
            {PROBLEM_KEYS.map((k, i) => (
              <div className="card-flat" key={k}>
                <div className="mono" style={{ marginBottom: 16 }}>0{i + 1}</div>
                <h3 style={{ fontSize: 20, marginBottom: 6 }}>{t(`${k}_l`)}</h3>
                <p style={{ margin: 0, fontSize: 14 }}>{t(`${k}_d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 style={{ fontSize: 'clamp(28px,4.4vw,52px)', color: 'var(--purple-bright)', maxWidth: 760, margin: '0 auto' }}>
            {t('possibility_h')}
          </h2>
          <p style={{ maxWidth: 600, margin: '22px auto 0' }}>{t('possibility_p')}</p>
          <Link to="/whatif" className="btn btn-secondary" style={{ marginTop: 34 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.9.4-1.4 1-1.4 2.2" /><path d="M12 17h.01" /></svg>
            {' '}{t('cta_tryit')}
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="grid-2" style={{ alignItems: 'center', gap: 48 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', marginBottom: 20 }}>{t('universe_h')}</h2>
              <p style={{ maxWidth: 420 }}>{t('universe_p')}</p>
              <Link to="/constellation" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--purple-bright)', fontWeight: 600, marginTop: 20 }}>
                {t('open_constellation')} →
              </Link>
            </div>
            <div className="grid-bg" style={{ height: 340 }}>
              <MiniConstellation
                centerLabel={state.profile.subjects[0] || 'ORBIT'}
                satellites={['Careers', 'Degrees', 'Universities', 'Interests', 'Strengths', 'Subjects'].map((l, i) => ({ label: l, strength: i % 3 === 0 ? 'strong' : i % 3 === 1 ? 'mid' : 'low' }))}
                w={600} h={340}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="flex-between" style={{ marginBottom: 34 }}>
            <div>
              <div className="eyebrow">{t('uni_label')}</div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,44px)' }}>{t('uni_h')}</h2>
            </div>
            <Link to="/universities" style={{ color: 'var(--purple-bright)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>{t('explore_all')} →</Link>
          </div>
          <div className="grid-3">
            {UNIVERSITIES.slice(0, 4).map(u => (
              <div className="card-flat" key={u.id}>
                <div className="mono" style={{ marginBottom: 14 }}>{u.group === 'uae' ? 'UAE' : u.country}</div>
                <h3 style={{ fontSize: 18, marginBottom: 6 }}>{uName(u)}</h3>
                <p style={{ fontSize: 13.5, margin: 0 }}>{u.city}, {u.country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section center">
        <div className="wrap">
          <div className="eyebrow">{t('closing_label')}</div>
          <h2 style={{ fontSize: 'clamp(34px,7vw,84px)', lineHeight: 1.02 }}>
            {t('closing_h1')}<br />{t('closing_h2')}<br />
            <span className="accent" style={{ color: 'var(--purple-bright)' }}>{t('closing_h3')}</span>
          </h2>
          <div className="mono" style={{ marginTop: 26 }}>{t('ending_h')}</div>
          <Link to="/build/1" className="btn btn-primary" style={{ marginTop: 32 }}>{t('cta_build')} →</Link>
        </div>
      </section>
    </>
  );
}
