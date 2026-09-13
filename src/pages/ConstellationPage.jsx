import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useOrbit } from '../store';
import { CAREERS } from '../data';
import { overlap, rankedCareers, relatedCareers } from '../engine';
import { MeshConstellation, buildCareerSatellites } from '../components/Constellations';

// A short, brand-flavoured loading beat shown once when the page first
// mounts — three orbiting rings around a pulsing core, echoing the actual
// constellation visualization that's about to appear.
function ConstellationLoader() {
  const { t } = useOrbit();
  return (
    <div className="cl-wrap">
      <div className="cl-stage">
        <div className="cl-orbit cl-orbit-3"><span className="cl-dot" /></div>
        <div className="cl-orbit cl-orbit-2"><span className="cl-dot" /></div>
        <div className="cl-orbit cl-orbit-1"><span className="cl-dot" /></div>
        <div className="cl-core" />
      </div>
      <div className="cl-caption">
        <div className="cl-label">{t('cl_label')}</div>
        <div className="cl-sub">{t('cl_sub')}</div>
      </div>
    </div>
  );
}

export default function ConstellationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, t, sName, iName, stName, cTitle, cDesc, cCat } = useOrbit();
  const [loading, setLoading] = useState(true);

  // Only on first mount of the page — switching careers by clicking a node
  // stays instant, matching the "click any node to re-center" promise.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const topRanked = rankedCareers(state.profile)[0];
  const career = id ? CAREERS.find(c => c.id === id) : (topRanked?.match ? topRanked.career : CAREERS[0]);
  const related = CAREERS.filter(c => c.id !== career.id && (
    overlap(c.subjects, career.subjects) || overlap(c.interests, career.interests) || overlap(c.strengths, career.strengths)
  )).slice(0, 4);

  // The mesh's satellite nodes are other careers (clickable, re-center the
  // universe), matching the reference video — falling back to the career's
  // own tag satellites only if it has no related careers at all.
  const relatedForMesh = relatedCareers(career, 6);
  const satellites = relatedForMesh.length
    ? relatedForMesh.map(r => ({ id: r.career.id, label: cTitle(r.career), strength: r.score >= 3 ? 'strong' : 'mid' }))
    : buildCareerSatellites(career, state.profile, sName, iName, stName);

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="wrap">
        <div className="eyebrow">{t('constellation_eyebrow')}</div>
        <div className="flex-between" style={{ alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(28px,4.6vw,46px)', marginBottom: 12 }}>{t('constellation_h')}</h1>
            <p style={{ maxWidth: 560, marginBottom: 34 }}>{t('constellation_p')}</p>
          </div>
          <select className="fselect" style={{ minWidth: 220 }} value={career.id} onChange={(e) => navigate(`/constellation/${e.target.value}`)}>
            {CAREERS.map(c => <option key={c.id} value={c.id}>{cTitle(c)}</option>)}
          </select>
        </div>
        <div className="grid-2 constellation-grid" style={{ alignItems: 'start' }}>
          <div className="card" data-tour="constellation-anchor" style={{ height: 560, padding: 0, overflow: 'hidden' }}>
            {loading ? (
              <ConstellationLoader />
            ) : (
              <div className="fade-in" style={{ height: '100%' }}>
                <MeshConstellation
                  centerLabel={cTitle(career)}
                  satellites={satellites}
                  w={760}
                  h={560}
                  onNodeClick={(careerId) => navigate(`/constellation/${careerId}`)}
                />
              </div>
            )}
          </div>
          <div className="card">
            <div className="mono">{cCat(career)}</div>
            <h2 style={{ fontSize: 26, margin: '10px 0 14px' }}>{cTitle(career)}</h2>
            <p>{cDesc(career)}</p>
            <div className="divider" />
            <div className="mono" style={{ marginBottom: 12 }}>{t('connected_careers')}</div>
            <div className="pillgrid">
              {related.length ? related.map(r => (
                <Link key={r.id} to={`/constellation/${r.id}`} className="pill" style={{ textDecoration: 'none' }}>{cTitle(r)}</Link>
              )) : <span style={{ color: 'var(--text-dimmer)' }}>—</span>}
            </div>
            <Link to={`/careers/${career.id}`} className="btn btn-primary" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
              {t('open_career')} {cTitle(career)} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
