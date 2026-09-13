export const ICON_PATHS = {
  home: '<path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  path: '<circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 12h5m0 0 5-6m-5 6 5 6"/>',
  careers: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  constellation: '<circle cx="12" cy="5" r="1.6"/><circle cx="5" cy="14" r="1.6"/><circle cx="19" cy="14" r="1.6"/><circle cx="12" cy="20" r="1.6"/><path d="M12 6.6 5 14m7-7.4 7 7.4M5 15.6l7 4.4m7-4.4-7 4.4"/>',
  universities: '<path d="M3 9.5 12 4l9 5.5-9 5.5-9-5.5Z"/><path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5"/>',
  whatif: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.9.4-1.4 1-1.4 2.2"/><path d="M12 17h.01"/>',
  why: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.9.4-1.4 1-1.4 2.2"/><path d="M12 17h.01"/>',
  bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
  compare: '<path d="M7 3v18M17 3v18M4 8h6M14 16h6"/>',
  pathways: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M6.5 7.6 11 16.5m6.5-8.9L13 16.5"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7"/>',
  features: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
};

// Top-level nav items, always visible.
export const NAV_ITEMS = [
  { key: 'nav_home', route: '/', icon: 'home' },
];

// Grouped under the "Features" dropdown — the exploration tools.
export const FEATURES_ITEMS = [
  { key: 'nav_mypath', route: '/my-path', icon: 'path' },
  { key: 'nav_careers', route: '/careers', icon: 'careers' },
  { key: 'nav_constellation', route: '/constellation', icon: 'constellation' },
  { key: 'nav_universities', route: '/universities', icon: 'universities' },
  { key: 'nav_whatif', route: '/whatif', icon: 'whatif' },
  { key: 'nav_compare', route: '/compare', icon: 'compare' },
  { key: 'nav_pathways', route: '/pathways', icon: 'pathways' },
];

// Top-level again, after the Features dropdown.
export const TRAILING_NAV_ITEMS = [
  { key: 'why_title', route: '/why', icon: 'why' },
  { key: 'nav_saved', route: '/saved', icon: 'bookmark' },
  { key: 'nav_profile', route: '/profile', icon: 'profile' },
];

// Kept for anything that still wants the full flat list (e.g. sitemaps).
export const ALL_NAV_ITEMS = [...NAV_ITEMS, ...FEATURES_ITEMS, ...TRAILING_NAV_ITEMS];
