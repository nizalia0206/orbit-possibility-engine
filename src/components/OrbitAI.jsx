import React, { useState } from 'react';
import { useOrbit } from '../store';
import { ORBIT_AI_QA } from '../data';

function SparkIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CloseIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6L18 18M6 18L18 6" />
    </svg>
  );
}

export default function OrbitAI() {
  const { state, t } = useOrbit();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const qa = ORBIT_AI_QA[state.lang] || ORBIT_AI_QA.en;
  const active = qa.find(item => item.id === activeId) || null;

  function toggleOpen() {
    setOpen(o => !o);
  }

  function close() {
    setOpen(false);
    setActiveId(null);
  }

  return (
    <div className="orbit-ai">
      {open && (
        <div className="orbit-ai-panel" role="dialog" aria-label={t('ai_title')}>
          <div className="orbit-ai-head">
            <div className="orbit-ai-head-title">
              <span className="orbit-ai-head-icon"><SparkIcon size={16} /></span>
              <div>
                <strong>{t('ai_title')}</strong>
                <span>{t('ai_subtitle')}</span>
              </div>
            </div>
            <button type="button" className="icon-btn orbit-ai-close" onClick={close} aria-label={t('ai_close')}>
              <CloseIcon />
            </button>
          </div>

          <div className="orbit-ai-body">
            {active ? (
              <>
                <div className="orbit-ai-msg orbit-ai-msg-user">{active.q}</div>
                <div className="orbit-ai-msg orbit-ai-msg-bot">{active.a}</div>
                <button type="button" className="orbit-ai-backbtn" onClick={() => setActiveId(null)}>
                  {t('ai_back')}
                </button>
              </>
            ) : (
              <div className="orbit-ai-questions">
                {qa.map(item => (
                  <button key={item.id} type="button" className="orbit-ai-qbtn" onClick={() => setActiveId(item.id)}>
                    {item.q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="orbit-ai-foot">{t('ai_disclaimer')}</div>
        </div>
      )}

      <button
        type="button"
        className={`orbit-ai-fab ${open ? 'open' : ''}`}
        onClick={toggleOpen}
        aria-label={t('ai_fab_label')}
        aria-expanded={open}
      >
        {open ? <CloseIcon size={20} /> : <SparkIcon />}
      </button>
    </div>
  );
}
