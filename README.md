# ORBIT — React version

This is a React (Vite) port of the ORBIT possibility-engine app, matching the
single-file HTML build feature-for-feature: same visual design, same data,
same recommendation engine, same EN/Arabic + RTL support, same dark/light
themes, and the same "living" background constellation.

## Getting started

```bash
npm install
npm run dev       # local dev server (http://localhost:5173)
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
  data.js               subjects/interests/strengths, careers, universities, EN+AR translations
  engine.js             match scoring + recommendation logic
  categoryList.js        the 8 career categories (used by Careers filters and Build step 4)
  icons.js               nav items + inline SVG icon paths
  store.jsx              React Context — global state, persisted to localStorage
  index.css               design tokens (colors, type, spacing) and all component styles
  App.jsx                 router (HashRouter) wiring every page
  main.jsx                entry point

  components/
    Header.jsx, Footer.jsx
    ConstellationBG.jsx    the ambient background field of stars/nodes (fixed, behind everything)
    Constellations.jsx     MiniConstellation (hub+spoke) and MeshConstellation (denser network)
    Icon.jsx, Pill.jsx
    CareerCard.jsx, UniversityCard.jsx
    Charts.jsx              BarChart + RadarChart (used on Pathways)

  pages/
    Home.jsx, Build.jsx, MyPath.jsx, Careers.jsx, CareerDetail.jsx,
    ConstellationPage.jsx, Universities.jsx, UniversityDetail.jsx,
    WhatIf.jsx, Why.jsx, Saved.jsx, Compare.jsx, Pathways.jsx, Profile.jsx
```

## Notes

- **Routing** uses `HashRouter` (routes like `#/careers/:id`) so it can be
  deployed to any static host with zero server config, same as the original.
- **State** (profile, saved items, compare list, theme, language) lives in
  `OrbitProvider` (`src/store.jsx`) and is persisted to `localStorage` under
  the key `orbit_state_v1` — same shape as the vanilla build, so the two are
  not compatible with each other's saved data by coincidence but easy to swap.
- **Data is 100% sample/demo** — university tuition, scholarships, and match
  percentages are illustrative, clearly labeled "SAMPLE DATA — NOT LIVE
  VERIFIED" in the UI, and should be replaced with real, verified sources
  before using this for anything but a demo.
- No UI framework/component library is used — plain CSS (in `index.css`)
  matching the original design tokens, so it's easy to swap in Tailwind or
  another system if you prefer.
