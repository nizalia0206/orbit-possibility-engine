import React from 'react';
import { NavLink } from 'react-router-dom';
import { useOrbit } from '../store';
import { NAV_ITEMS, FEATURES_ITEMS, TRAILING_NAV_ITEMS } from '../icons';

export default function Footer() {
  const { t } = useOrbit();
  const moreItems = [...NAV_ITEMS, ...TRAILING_NAV_ITEMS];

  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="fb">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 8.5V15.5L12 21L20 15.5V8.5L12 3Z" stroke="#8256E4" strokeWidth="1.6" /></svg>
              <span>ORBIT</span>
            </div>
            <p className="tag">{t('footer_tag')}</p>
          </div>

          <nav className="footer-nav">
            <div className="footer-col">
              <h4>{t('footer_explore')}</h4>
              <ul>
                {FEATURES_ITEMS.map(i => (
                  <li key={i.route}><NavLink to={i.route}>{t(i.key)}</NavLink></li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4>{t('footer_more')}</h4>
              <ul>
                {moreItems.map(i => (
                  <li key={i.route}><NavLink to={i.route} end={i.route === '/'}>{t(i.key)}</NavLink></li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <div className="mono">{t('footer_mono')}</div>
          <div className="footer-credit">{t('footer_designathon')}</div>
        </div>
      </div>
    </footer>
  );
}
