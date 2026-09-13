import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { OrbitProvider } from './store';
import { TourProvider } from './Tour';
import ConstellationBG from './components/ConstellationBG';
import SiteLoader from './components/SiteLoader';
import Header from './components/Header';
import Footer from './components/Footer';
import OrbitAI from './components/OrbitAI';

import Home from './pages/Home';
import Build from './pages/Build';
import MyPath from './pages/MyPath';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import ConstellationPage from './pages/ConstellationPage';
import Universities from './pages/Universities';
import UniversityDetail from './pages/UniversityDetail';
import WhatIf from './pages/WhatIf';
import Why from './pages/Why';
import Saved from './pages/Saved';
import Compare from './pages/Compare';
import Pathways from './pages/Pathways';
import Profile from './pages/Profile';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Re-mounts its children (and so re-triggers the .fade-in CSS animation)
// whenever the route changes, mirroring the per-render fade-in of the
// original vanilla-JS build.
function FadeWrapper({ children }) {
  const { pathname } = useLocation();
  return <div className="fade-in" key={pathname}>{children}</div>;
}

export default function App() {
  return (
    <OrbitProvider>
      {/* One-time boot splash — the real MeshConstellation, auto-piloted.
          See components/SiteLoader.jsx. */}
      <SiteLoader />
      {/* The living background constellation — a fixed, full-viewport field of
          nodes and connecting lines that sits behind every page (z-index 0),
          faint in light mode and bright in dark mode. See index.css
          `#constellation-bg` and components/ConstellationBG.jsx. */}
      <ConstellationBG />
      <TourProvider>
        <Header />
        <ScrollToTop />
        <main style={{ position: 'relative', zIndex: 1, minHeight: '70vh' }}>
          <FadeWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/build/:step" element={<Build />} />
              <Route path="/my-path" element={<MyPath />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/careers/:id" element={<CareerDetail />} />
              <Route path="/constellation" element={<ConstellationPage />} />
              <Route path="/constellation/:id" element={<ConstellationPage />} />
              <Route path="/universities" element={<Universities />} />
              <Route path="/universities/:id" element={<UniversityDetail />} />
              <Route path="/whatif" element={<WhatIf />} />
              <Route path="/why" element={<Why />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/pathways" element={<Pathways />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </FadeWrapper>
        </main>
        <Footer />
        <OrbitAI />
      </TourProvider>
    </OrbitProvider>
  );
}
