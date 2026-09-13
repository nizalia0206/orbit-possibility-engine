import { CAREERS, UNIVERSITIES, universitiesForCareer } from './data';

export function overlap(a, b) {
  return a.filter(x => b.includes(x)).length;
}

// Related careers for a given career, ranked by tag overlap — used to
// populate the Constellation page's clickable satellite nodes.
export function relatedCareers(career, max = 6) {
  const scored = CAREERS
    .filter(c => c.id !== career.id)
    .map(c => ({
      career: c,
      score: overlap(c.subjects, career.subjects) * 2 + overlap(c.interests, career.interests) + overlap(c.strengths, career.strengths),
    }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, max);
}

// Returns 0-100 or null if profile is empty
export function computeMatch(profile, career) {
  const hasProfile = profile.subjects.length + profile.interests.length + profile.strengths.length > 0;
  if (!hasProfile) return null;
  const parts = [];
  if (career.subjects.length) parts.push({ w: 0.40, m: overlap(profile.subjects, career.subjects), n: career.subjects.length });
  if (career.interests.length) parts.push({ w: 0.35, m: overlap(profile.interests, career.interests), n: career.interests.length });
  if (career.strengths.length) parts.push({ w: 0.25, m: overlap(profile.strengths, career.strengths), n: career.strengths.length });
  const totalW = parts.reduce((s, p) => s + p.w, 0) || 1;
  let score = 0;
  parts.forEach(p => { score += (p.m / p.n) * (p.w / totalW); });
  let pct = Math.round(score * 100);
  if (pct > 0) pct = Math.max(pct, 8);
  return pct;
}

export function whyMatchText(profile, career) {
  const ms = profile.subjects.filter(s => career.subjects.includes(s));
  const mi = profile.interests.filter(s => career.interests.includes(s));
  const mst = profile.strengths.filter(s => career.strengths.includes(s));
  return { ms, mi, mst };
}

export function rankedCareers(profile) {
  return CAREERS.map(c => ({ career: c, match: computeMatch(profile, c) }))
    .sort((a, b) => (b.match || 0) - (a.match || 0));
}

// Raw point-based score used for the What If possibility space (not a %)
export function whatIfScore(profile, career) {
  const ms = overlap(profile.subjects, career.subjects) * 10;
  const mi = overlap(profile.interests, career.interests) * 8;
  const mst = overlap(profile.strengths, career.strengths) * 6;
  return ms + mi + mst;
}

export function whatIfTop(profile, n = 6) {
  return CAREERS.map(c => ({ career: c, score: whatIfScore(profile, c) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

export function recommendedUniversities(profile) {
  const top = rankedCareers(profile).filter(r => r.match).slice(0, 3);
  const out = [];
  top.forEach(r => {
    universitiesForCareer(r.career).slice(0, 2).forEach(u => {
      if (!out.find(o => o.uni.id === u.id)) {
        out.push({ uni: u, career: r.career, score: Math.min(98, r.match + (u.id.length * 3) % 18) });
      }
    });
  });
  return out.sort((a, b) => b.score - a.score);
}

export function parseTuitionUSD(str) {
  const nums = (str.match(/[\d,]+/g) || ['0']).map(n => parseInt(n.replace(/,/g, ''), 10));
  const avg = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  let rate = 0.27; // AED->USD approx
  if (str.includes('£')) rate = 1.27;
  else if (str.includes('CHF')) rate = 1.1;
  else if (str.includes('CAD')) rate = 0.73;
  else if (str.includes('€')) rate = 1.08;
  return Math.round(avg * rate);
}

export function axisValuesFor(u) {
  const dims = ['Alignment', 'Outcomes', 'Affordability', 'Breadth', 'Access'];
  return dims.map((d, i) => 30 + ((u.id.length * (i + 4) * 7) % 65));
}
