import React from 'react';

// items: [{label, value, color, tipTitle, tipLines:[{text, tone:'default'|'accent'|'dim'}]}]
export function BarChart({ items, fmt = (v) => String(v), maxOverride }) {
  const [hover, setHover] = React.useState(null); // index
  const max = maxOverride || Math.max(...items.map(i => i.value), 1);
  const W = 560, H = 220, padL = 44, chartW = W - padL - 20, chartH = H - 40;
  const bw = (chartW / items.length) * 0.5;
  const ticks = 4;
  const gridLines = [];
  for (let i = 0; i <= ticks; i++) {
    const y = 10 + chartH - (chartH * i) / ticks;
    const val = (max * i) / ticks;
    gridLines.push(
      <React.Fragment key={i}>
        <line x1={padL} y1={y} x2={W - 10} y2={y} stroke="var(--border)" strokeWidth="1" />
        <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--text-dimmer)" fontFamily="IBM Plex Mono,monospace">{fmt(val)}</text>
      </React.Fragment>
    );
  }

  const bars = items.map((it, i) => {
    const x = padL + (chartW / items.length) * i + (chartW / items.length - bw) / 2;
    const h = chartH * (it.value / max);
    const y = 10 + chartH - h;
    return { it, x, y, h };
  });

  const hovered = hover != null ? bars[hover] : null;

  return (
    <div className="chart-svg-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="220" role="img" aria-label="Bar chart">
        {gridLines}
        {bars.map(({ it, x, y, h }, i) => (
          <g
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseMove={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect x={x} y="10" width={bw} height={chartH} fill="transparent" />
            <rect x={x} y={y} width={bw} height={h} rx="4" fill={it.color} opacity={hover == null || hover === i ? 1 : 0.55} />
            <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--text-dimmer)" fontFamily="Inter,sans-serif">{it.label}</text>
          </g>
        ))}
      </svg>
      {hovered && (
        <div
          className="chart-tooltip"
          style={{
            left: `${((hovered.x + bw / 2) / W) * 100}%`,
            top: `${hovered.y}px`,
            transform: 'translate(-50%, -6px)',
          }}
        >
          <div className="ct-title">{hovered.it.tipTitle || hovered.it.label}</div>
          {(hovered.it.tipLines || [{ text: `${hovered.it.label}: ${fmt(hovered.it.value)}`, tone: 'accent' }]).map((line, li) => (
            <div key={li} className={`ct-line ${line.tone || 'default'}`}>{line.text}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// series: [{label, color, values:[5 numbers 0-100]}]
export function RadarChart({ series, dims = ['Alignment', 'Outcomes', 'Affordability', 'Breadth', 'Access'] }) {
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const W = 340, H = 300, cx = W / 2, cy = H / 2 - 6, R = 100;
  const n = dims.length;
  const grid = [];
  for (let ring = 1; ring <= 4; ring++) {
    const r = (R * ring) / 4;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
    }
    grid.push(<polygon key={ring} points={pts.join(' ')} fill="none" stroke="var(--border)" strokeWidth="1" />);
  }

  const axisPoints = [];
  const axes = [], labels = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    axisPoints.push({ x, y });
    axes.push(<line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />);
    const lx = cx + (R + 20) * Math.cos(a), ly = cy + (R + 20) * Math.sin(a);
    labels.push(<text key={i} x={lx} y={ly} textAnchor="middle" fontSize="10.5" fill="var(--text-dimmer)" fontFamily="Inter,sans-serif">{dims[i]}</text>);
  }
  const shapes = series.map((s, si) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const r = R * (s.values[i] / 100);
      pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
    }
    return <polygon key={si} points={pts.join(' ')} fill={s.color} fillOpacity="0.18" stroke={s.color} strokeWidth="2" />;
  });

  const vertexDots = hoverIdx != null ? series.map((s, si) => {
    const a = (hoverIdx / n) * Math.PI * 2 - Math.PI / 2;
    const r = R * (s.values[hoverIdx] / 100);
    const vx = cx + r * Math.cos(a), vy = cy + r * Math.sin(a);
    return <circle key={si} cx={vx} cy={vy} r="4.5" fill={s.color} stroke="var(--bg)" strokeWidth="1.5" />;
  }) : null;

  const hitTargets = axisPoints.map((p, i) => (
    <circle
      key={i}
      cx={p.x}
      cy={p.y}
      r="16"
      fill="transparent"
      onMouseEnter={() => setHoverIdx(i)}
      onMouseLeave={() => setHoverIdx(null)}
      style={{ cursor: 'pointer' }}
    />
  ));

  const hoverPoint = hoverIdx != null ? axisPoints[hoverIdx] : null;

  return (
    <div className="chart-svg-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="260" role="img" aria-label="Radar chart">
        {grid}{axes}{shapes}{vertexDots}{labels}{hitTargets}
      </svg>
      {hoverPoint && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(hoverPoint.x / W) * 100}%`,
            top: `${(hoverPoint.y / H) * 260}px`,
            transform: 'translate(-50%, -110%)',
          }}
        >
          <div className="ct-title">{dims[hoverIdx]}</div>
          {series.map((s, si) => (
            <div key={si} className="ct-line" style={{ color: s.color, fontWeight: 600 }}>{s.label} : {Math.round(s.values[hoverIdx])}</div>
          ))}
        </div>
      )}
      <div style={{ fontSize: 12, marginTop: 6 }}>
        {series.map((s, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginInlineEnd: 14 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, display: 'inline-block' }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
