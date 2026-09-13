import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrbit } from '../store';

export default function CareerCard({ career, match }) {
  const { state, t, cTitle, cDesc, cCat, toggleSaved } = useOrbit();
  const navigate = useNavigate();
  const isSaved = state.saved.careers.includes(career.id);

  return (
    <div className="item-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/careers/${career.id}`)}>
      <div className="top-row">
        <div className="mono">{cCat(career)}</div>
        <button
          className={`bookmark-btn ${isSaved ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleSaved('careers', career.id); }}
          aria-label={`Save ${career.title}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
          </svg>
        </button>
      </div>
      <h3>{cTitle(career)}</h3>
      <p style={{ fontSize: 14 }}>{cDesc(career)}</p>
      <div className="bottom-row">
        {match !== null && match !== undefined
          ? <div><span className="match-num">{match}</span><span className="match-label">{t('match')}</span></div>
          : <div className="mono">{t('sample_demo')}</div>}
        <span className="explore-link">{t('explore')} →</span>
      </div>
    </div>
  );
}
