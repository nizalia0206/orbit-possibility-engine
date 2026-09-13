import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrbit } from './store';

const TourContext = createContext(null);
export function useTour() {
  return useContext(TourContext);
}

// How far outside the target's own edges the spotlight hole extends.
const SPOTLIGHT_PAD = 10;

// Full-screen guided tour: each step actually navigates to the real page
// for that feature (Careers, Constellation, What If, Universities, Profile)
// and spotlights a real element there — it doesn't stay on Home pointing
// at nav links.
//
// The "dark backdrop" is the box-shadow of a small div tracked to the
// target's on-screen rect (the classic spotlight-cutout technique), rather
// than a class added to the target that tries to lift it above a full-page
// overlay. That class-based approach breaks the moment the target sits
// inside any ancestor that establishes its own stacking context at a lower
// z-index than the overlay (e.g. .hero/.section use position:relative +
// z-index:1 for layering over background art) — the whole subtree paints
// below the overlay regardless of the target's own z-index, so it reads as
// dimmed/washed-out no matter how bright we make it. With a cutout hole,
// the real element is simply never painted over, so it always shows its
// true, undimmed colors.
//
// The tour card itself stays fixed at the bottom of the screen (rather
// than chasing the target around), so it never overlaps what it's
// pointing at and behaves the same on any screen size. Auto-plays every
// time the site loads on Home (no "seen it once" gate), and is replayable
// anytime from the "?" button in the header.
export function TourProvider({ children }) {
  const { t } = useOrbit();
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null); // {top,left,width,height} of the spotlight hole, or null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const targetElRef = useRef(null);
  const advancingRef = useRef(false);

  const steps = [
    { path: '/', sel: '[data-tour="build-cta"]', title: t('tour_1_t'), desc: t('tour_1_d') },
    { path: '/my-path', sel: '[data-tour="mypath-anchor"]', title: t('tour_7_t'), desc: t('tour_7_d') },
    { path: '/careers', sel: '[data-tour="careers-anchor"]', title: t('tour_2_t'), desc: t('tour_2_d') },
    { path: '/constellation', sel: '[data-tour="constellation-anchor"]', title: t('tour_3_t'), desc: t('tour_3_d') },
    { path: '/whatif', sel: '[data-tour="whatif-anchor"]', title: t('tour_4_t'), desc: t('tour_4_d') },
    { path: '/universities', sel: '[data-tour="universities-anchor"]', title: t('tour_5_t'), desc: t('tour_5_d') },
    { path: '/compare', sel: '[data-tour="compare-anchor"]', title: t('tour_8_t'), desc: t('tour_8_d') },
    { path: '/pathways', sel: '[data-tour="pathways-anchor"]', title: t('tour_9_t'), desc: t('tour_9_d') },
    { path: '/why', sel: '[data-tour="why-anchor"]', title: t('tour_10_t'), desc: t('tour_10_d') },
    { path: '/saved', sel: '[data-tour="saved-anchor"]', title: t('tour_11_t'), desc: t('tour_11_d') },
    { path: '/profile', sel: '[data-tour="profile-anchor"]', title: t('tour_6_t'), desc: t('tour_6_d') },
    { path: '/', sel: '[data-tour="a11y-controls"]', title: t('tour_12_t'), desc: t('tour_12_d') },
  ];

  const endTour = useCallback(() => {
    setActive(false);
    setRect(null);
    setMobileMenuOpen(false);
    targetElRef.current = null;
  }, []);

  // Ending the tour (whether by finishing the last step or skipping) always
  // returns the user to Home first, then closes the overlay.
  const finishTour = useCallback(() => {
    if (location.pathname !== '/') navigate('/');
    endTour();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate, endTour]);

  // Moves the tour to step `i`: navigates to that step's page first (if
  // we're not already there), waits for it to mount, then reveals it.
  const advanceTo = useCallback((i) => {
    const target = steps[i];
    if (!target) { endTour(); return; }
    if (location.pathname !== target.path) {
      advancingRef.current = true;
      navigate(target.path);
      setTimeout(() => {
        setStep(i);
        setTimeout(() => { advancingRef.current = false; }, 80);
      }, 400);
    } else {
      setStep(i);
    }
    setActive(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate, endTour]);

  const startTour = useCallback(() => {
    advanceTo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advanceTo]);

  // Find the current step's target, scroll it into view, and keep the
  // spotlight rect glued to it (on scroll/resize) while this step is shown.
  useEffect(() => {
    if (!active) return undefined;
    const s = steps[step];
    if (!s) { endTour(); return undefined; }

    setRect(null);
    targetElRef.current = null;

    // On narrow screens the a11y controls only exist inside the closed
    // mobile drawer (see .mm-a11y in Header.jsx) — pop it open for this
    // step so there's something visible to spotlight, and close it again
    // once the tour moves off this step.
    const isA11yStep = s.sel === '[data-tour="a11y-controls"]';
    const isNarrow = typeof window !== 'undefined' && window.innerWidth <= 640;
    setMobileMenuOpen(isA11yStep && isNarrow);

    let attempts = 0;
    let findTimer;

    function measure() {
      const el = targetElRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top - SPOTLIGHT_PAD,
        left: r.left - SPOTLIGHT_PAD,
        width: r.width + SPOTLIGHT_PAD * 2,
        height: r.height + SPOTLIGHT_PAD * 2,
      });
    }

    function tryFind() {
      const matches = document.querySelectorAll(s.sel);
      const el = Array.from(matches).find((e) => e.offsetParent !== null) || null;
      if (el) {
        targetElRef.current = el;
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        // Re-measure a few times while the smooth scroll settles.
        measure();
        setTimeout(measure, 180);
        setTimeout(measure, 360);
      } else if (attempts < 6) {
        attempts += 1;
        findTimer = setTimeout(tryFind, 150);
      }
    }
    tryFind();

    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      clearTimeout(findTimer);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, step]);

  // Auto-play every time the site loads on Home — no "seen it once" gate,
  // so reloading/replaying the site always shows the tour again.
  useEffect(() => {
    if (location.pathname !== '/') return undefined;
    const timer = setTimeout(() => startTour(), 1400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the user navigates away on their own mid-tour (not via the tour's
  // own Next/Back), end the tour rather than leaving a stale spotlight.
  useEffect(() => {
    if (!active || advancingRef.current) return;
    const s = steps[step];
    if (s && s.path !== location.pathname) endTour();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const s = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  return (
    <TourContext.Provider value={{ startTour, mobileMenuOpen, setMobileMenuOpen }}>
      {children}
      {active && s && (
        <>
          {rect ? (
            <div
              className="tour-spotlight"
              aria-hidden="true"
              style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
            />
          ) : (
            <div className="tour-backdrop" aria-hidden="true" />
          )}
          <div className="tour-card" role="dialog" aria-live="polite" aria-label={s.title}>
            <div className="tour-card-head">
              <span className="tour-card-mark" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L4 8.5V15.5L12 21L20 15.5V8.5L12 3Z" stroke="#8256E4" strokeWidth="1.6" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2.4" fill="#8B5BF5" />
                </svg>
              </span>
              <div>
                <div className="tour-card-title">{s.title}</div>
                <div className="tour-card-progress">{step + 1} / {steps.length}</div>
              </div>
              <button className="tour-skip" onClick={finishTour}>{t('tour_skip')}</button>
            </div>
            <p className="tour-card-text">{s.desc}</p>
            <div className="tour-card-actions">
              <button className="tour-btn" onClick={() => advanceTo(step - 1)} disabled={isFirst}>{t('tour_back')}</button>
              <div className="tour-dots">
                {steps.map((_, i) => <span key={i} className={i === step ? 'active' : ''} />)}
              </div>
              <button className="tour-btn primary" onClick={() => (isLast ? finishTour() : advanceTo(step + 1))}>
                {isLast ? t('tour_finish') : t('tour_next')}
              </button>
            </div>
          </div>
        </>
      )}
    </TourContext.Provider>
  );
}
