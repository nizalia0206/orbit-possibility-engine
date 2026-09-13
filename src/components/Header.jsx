import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useOrbit } from '../store';
import { useTour } from '../Tour';
import { NAV_ITEMS, FEATURES_ITEMS, TRAILING_NAV_ITEMS } from '../icons';
import Icon from './Icon';

export default function Header() {
  const { state, t, toggleTheme, toggleLang } = useOrbit();
  const { startTour, mobileMenuOpen: menuOpen, setMobileMenuOpen: setMenuOpen } = useTour();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const location = useLocation();

  const isFeaturesActive = FEATURES_ITEMS.some(i => i.route === location.pathname);

  // Position the fixed-position dropdown against the button — it's
  // position:fixed (not absolute) specifically so it isn't clipped by
  // nav.mainnav's overflow-x:auto (needed for narrower desktop widths).
  useLayoutEffect(() => {
    if (!featuresOpen) return;
    function reposition() {
      const btn = btnRef.current, menu = menuRef.current;
      if (!btn || !menu) return;
      const r = btn.getBoundingClientRect();
      const mw = menu.offsetWidth || 460;
      const margin = 12;
      let left = r.left + r.width / 2 - mw / 2;
      left = Math.max(margin, Math.min(left, window.innerWidth - mw - margin));
      setMenuPos({ top: r.bottom + 12, left });
    }
    reposition();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [featuresOpen]);

  // Close the dropdown on outside click, Escape, or route change.
  useEffect(() => {
    function onClick(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) setFeaturesOpen(false);
    }
    function onKey(e) { if (e.key === 'Escape') setFeaturesOpen(false); }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  useEffect(() => { setFeaturesOpen(false); }, [location.pathname]);

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 8.5V15.5L12 21L20 15.5V8.5L12 3Z" stroke="#8256E4" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="12" cy="12" r="2.4" fill="#8B5BF5" /></svg>
            <span>ORBIT</span>
          </NavLink>
          <nav className="mainnav">
            {NAV_ITEMS.map(i => (
              <NavLink key={i.route} to={i.route} end={i.route === '/'} data-tour={i.icon} className={({ isActive }) => (isActive ? 'active' : '')}>
                <Icon name={i.icon} />
                <span>{t(i.key)}</span>
              </NavLink>
            ))}

            <div className="nav-features" ref={dropdownRef}>
              <button
                type="button"
                ref={btnRef}
                className={`nav-features-btn ${isFeaturesActive ? 'active' : ''}`}
                onClick={() => setFeaturesOpen(o => !o)}
                aria-haspopup="true"
                aria-expanded={featuresOpen}
              >
                <Icon name="features" />
                <span>{t('nav_features')}</span>
                <Icon name="chevron" size={12} />
              </button>
            </div>

            {TRAILING_NAV_ITEMS.map(i => (
              <NavLink key={i.route} to={i.route} data-tour={i.icon} className={({ isActive }) => (isActive ? 'active' : '')}>
                <Icon name={i.icon} />
                <span>{t(i.key)}</span>
              </NavLink>
            ))}
          </nav>
          <div className="topbar-actions">
            <div className="topbar-a11y" data-tour="a11y-controls">
              <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
                {state.lang === 'ar' ? 'ع | EN' : 'EN | ع'}
              </button>
              <button className="icon-btn" onClick={startTour} aria-label="Take the tour" title="Take the tour">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.9.4-1.4 1-1.4 2.2" /><path d="M12 17h.01" /></svg>
              </button>
              <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {state.theme === 'dark'
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5Z" /></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>}
              </button>
            </div>
            <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Rendered at the top level (position:fixed, viewport-anchored) so it
          isn't clipped by nav.mainnav's overflow-x:auto. */}
      <div className={`nav-features-menu ${featuresOpen ? 'open' : ''}`} ref={menuRef} style={{ top: menuPos.top, left: menuPos.left }}>
        {FEATURES_ITEMS.map(i => (
          <NavLink key={i.route} to={i.route} data-tour={i.icon} className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setFeaturesOpen(false)}>
            <Icon name={i.icon} />
            <span>{t(i.key)}</span>
          </NavLink>
        ))}
      </div>

      <div id="mobile-menu" className={menuOpen ? 'open' : ''}>
        <div className="mm-top">
          <div className="brand"><span>ORBIT</span></div>
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Accessibility controls, mirrored here for narrow screens where they
            no longer fit in the topbar next to the hamburger (see .topbar-a11y
            in index.css, hidden below 640px). Tour.jsx's step targets
            [data-tour="a11y-controls"] and picks whichever copy is on-screen. */}
        <div className="mm-a11y" data-tour="a11y-controls">
          <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
            {state.lang === 'ar' ? 'ع | EN' : 'EN | ع'}
          </button>
          <button className="icon-btn" onClick={() => { setMenuOpen(false); startTour(); }} aria-label="Take the tour" title="Take the tour">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.9.4-1.4 1-1.4 2.2" /><path d="M12 17h.01" /></svg>
          </button>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {state.theme === 'dark'
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5Z" /></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>}
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {NAV_ITEMS.map(i => (
            <NavLink key={i.route} to={i.route} end={i.route === '/'} onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon name={i.icon} size={20} />
              <span>{t(i.key)}</span>
            </NavLink>
          ))}

          <button type="button" className={`mm-features-toggle ${isFeaturesActive ? 'active' : ''} ${mobileFeaturesOpen ? 'open' : ''}`} onClick={() => setMobileFeaturesOpen(o => !o)}>
            <Icon name="features" size={20} />
            <span>{t('nav_features')}</span>
            <Icon name="chevron" size={16} />
          </button>
          <div className={`mm-features-list ${mobileFeaturesOpen ? 'open' : ''}`}>
            {FEATURES_ITEMS.map(i => (
              <NavLink key={i.route} to={i.route} onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                <Icon name={i.icon} size={18} />
                <span>{t(i.key)}</span>
              </NavLink>
            ))}
          </div>

          {TRAILING_NAV_ITEMS.map(i => (
            <NavLink key={i.route} to={i.route} onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon name={i.icon} size={20} />
              <span>{t(i.key)}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}
