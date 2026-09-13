import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { STR, SUBJECTS_AR, INTERESTS_AR, STRENGTHS_AR } from './data';

const STORAGE_KEY = 'orbit_state_v1';

const DEFAULT_STATE = {
  lang: 'en',
  theme: (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark',
  profile: { subjects: [], interests: [], strengths: [] },
  pathBuilt: false,
  hypothetical: { subjects: [], interests: [], strengths: [] },
  hypotheticalActive: false,
  saved: { careers: [], degrees: [], universities: [] },
  compareList: [],
  buildDraft: { subjects: [], interests: [], strengths: [], futures: [] },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
        hypothetical: { ...DEFAULT_STATE.hypothetical, ...(parsed.hypothetical || {}) },
        saved: { ...DEFAULT_STATE.saved, ...(parsed.saved || {}) },
        buildDraft: { ...DEFAULT_STATE.buildDraft, ...(parsed.buildDraft || {}) },
      };
    }
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

const OrbitContext = createContext(null);

export function OrbitProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }, [state]);

  useEffect(() => {
    document.body.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  useEffect(() => {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  }, [state.lang]);

  const update = useCallback((updater) => {
    setState(prev => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  }, []);

  // ---- actions ----
  const toggleTheme = useCallback(() => {
    update(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  }, [update]);

  const toggleLang = useCallback(() => {
    update(prev => ({ ...prev, lang: prev.lang === 'en' ? 'ar' : 'en' }));
  }, [update]);

  const toggleBuildDraft = useCallback((group, val) => {
    update(prev => {
      const arr = prev.buildDraft[group] || [];
      const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
      return { ...prev, buildDraft: { ...prev.buildDraft, [group]: next } };
    });
  }, [update]);

  const toggleProfile = useCallback((group, val) => {
    update(prev => {
      const arr = prev.profile[group] || [];
      const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
      const profile = { ...prev.profile, [group]: next };
      return { ...prev, profile, pathBuilt: true, buildDraft: JSON.parse(JSON.stringify(profile)) };
    });
  }, [update]);

  const toggleHypothetical = useCallback((group, val) => {
    update(prev => {
      const arr = prev.hypothetical[group] || [];
      const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
      return { ...prev, hypothetical: { ...prev.hypothetical, [group]: next } };
    });
  }, [update]);

  const ensureHypotheticalInit = useCallback(() => {
    update(prev => prev.hypotheticalActive ? prev : ({
      ...prev,
      hypothetical: JSON.parse(JSON.stringify(prev.profile)),
      hypotheticalActive: true,
    }));
  }, [update]);

  const resetHypothetical = useCallback(() => {
    update(prev => ({ ...prev, hypothetical: JSON.parse(JSON.stringify(prev.profile)) }));
  }, [update]);

  const generatePath = useCallback(() => {
    update(prev => ({ ...prev, profile: JSON.parse(JSON.stringify(prev.buildDraft)), pathBuilt: true }));
  }, [update]);

  const resetBuildDraft = useCallback(() => {
    update(prev => ({ ...prev, buildDraft: { subjects: [], interests: [], strengths: [], futures: [] } }));
  }, [update]);

  const resetProfile = useCallback(() => {
    update(prev => ({
      ...prev,
      profile: { subjects: [], interests: [], strengths: [] },
      buildDraft: { subjects: [], interests: [], strengths: [], futures: [] },
      pathBuilt: false,
    }));
  }, [update]);

  const toggleSaved = useCallback((type, id) => {
    update(prev => {
      const list = prev.saved[type] || [];
      const next = list.includes(id) ? list.filter(v => v !== id) : [...list, id];
      return { ...prev, saved: { ...prev.saved, [type]: next } };
    });
  }, [update]);

  const toggleCompare = useCallback((id) => {
    let result = 'added';
    update(prev => {
      const list = prev.compareList;
      if (list.includes(id)) { result = 'removed'; return { ...prev, compareList: list.filter(v => v !== id) }; }
      if (list.length >= 3) { result = 'full'; return prev; }
      return { ...prev, compareList: [...list, id] };
    });
    return result;
  }, [update]);

  // ---- i18n helpers ----
  const t = useCallback((key) => (STR[state.lang] && STR[state.lang][key]) || STR.en[key] || key, [state.lang]);
  const sName = useCallback((s) => (state.lang === 'ar' ? (SUBJECTS_AR[s] || s) : s), [state.lang]);
  const iName = useCallback((s) => (state.lang === 'ar' ? (INTERESTS_AR[s] || s) : s), [state.lang]);
  const stName = useCallback((s) => (state.lang === 'ar' ? (STRENGTHS_AR[s] || s) : s), [state.lang]);
  const cTitle = useCallback((c) => (state.lang === 'ar' ? c.titleAr : c.title), [state.lang]);
  const cDesc = useCallback((c) => (state.lang === 'ar' ? c.descAr : c.desc), [state.lang]);
  const cCat = useCallback((c) => (state.lang === 'ar' ? c.categoryAr : c.category), [state.lang]);
  const uName = useCallback((u) => (state.lang === 'ar' ? u.nameAr : u.name), [state.lang]);

  const value = {
    state, update, t, sName, iName, stName, cTitle, cDesc, cCat, uName,
    toggleTheme, toggleLang, toggleBuildDraft, toggleProfile, toggleHypothetical,
    ensureHypotheticalInit, resetHypothetical, generatePath, resetBuildDraft, resetProfile,
    toggleSaved, toggleCompare,
  };

  return <OrbitContext.Provider value={value}>{children}</OrbitContext.Provider>;
}

export function useOrbit() {
  const ctx = useContext(OrbitContext);
  if (!ctx) throw new Error('useOrbit must be used within OrbitProvider');
  return ctx;
}
