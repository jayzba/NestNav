import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useHousingData, CITIES } from '../hooks/useHousingData';
import { UNITS } from '../data/units';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const CHART_DEFAULTS = {
  color: '#8fa8cc',
  plugins: { legend: { labels: { color: '#8fa8cc', font: { family: 'Inter', size: 12 } } } },
  scales: {
    x: { ticks: { color: '#4a6080', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(99,155,255,0.06)' } },
    y: { ticks: { color: '#4a6080', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(99,155,255,0.06)' } },
  },
};

const AFFORD_COLOR = '#34d399';
const MODERATE_COLOR = '#fbbf24';
const EXPENSIVE_COLOR = '#f87171';

export default function HousingSection({ cityId, onReady, unit, onUnitChange }) {
  const { data, loading, error, loadedCityId } = useHousingData(cityId);
  const cityName = CITIES.find(c => c.id === cityId)?.name ?? '';

  // Tell the parent once this city's data (or error) is on screen
  useEffect(() => {
    if (cityId && loadedCityId === cityId) onReady?.();
  }, [cityId, loadedCityId]);

  if (!cityId) return (
    <section id="housing" className="section">
      <div className="section-inner" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏙️</div>
        <h2 className="section-title">Housing Cost Overview</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Search for a city above to see housing data.</p>
      </div>
    </section>
  );

  if (error) return (
    <section id="housing" className="section">
      <div className="section-inner" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 className="section-title">Housing Cost Overview</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Couldn't load HUD data: {error}</p>
      </div>
    </section>
  );

  if (loading || !data) return (
    <section id="housing" className="section">
      <div className="section-inner" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
        }} />
        <p style={{ color: 'var(--color-text-muted)' }}>Loading housing data…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </section>
  );

  const selectedIdx = UNITS.findIndex(u => u.key === unit);
  const selectedUnit = UNITS[selectedIdx];

  const fmrBarData = {
    labels: UNITS.map(u => u.label),
    datasets: [{
      label: 'Fair Market Rent ($/mo)',
      data: UNITS.map(u => data.fmr[u.key]),
      // Selected bar is solid, the rest are dimmed
      backgroundColor: UNITS.map((u, i) => (i === selectedIdx ? u.color : u.color.replace(/[\d.]+\)$/, '0.3)'))),
      borderColor: UNITS.map(u => u.color.replace(/[\d.]+\)$/, '1)')),
      borderWidth: UNITS.map((_, i) => (i === selectedIdx ? 2 : 0)),
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const fmrBarOptions = {
    ...CHART_DEFAULTS,
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_evt, elements) => {
      if (elements.length) onUnitChange(UNITS[elements[0].index].key);
    },
    onHover: (evt, elements) => {
      evt.native.target.style.cursor = elements.length ? 'pointer' : 'default';
    },
  };

  const trendLineData = {
    labels: data.trendLabels,
    datasets: [{
      label: `${selectedUnit.label} FMR ($/mo)`,
      data: data.rentTrend[unit],
      borderColor: selectedUnit.line,
      backgroundColor: selectedUnit.line + '1a',
      borderWidth: 2,
      pointBackgroundColor: selectedUnit.line,
      pointRadius: 4,
      fill: true,
      tension: 0.4,
    }],
  };

  const afIndex = data.affordabilityIndex;
  const afColor = afIndex >= 65 ? AFFORD_COLOR : afIndex >= 45 ? MODERATE_COLOR : EXPENSIVE_COLOR;
  const afLabel = afIndex >= 65 ? 'Affordable' : afIndex >= 45 ? 'Moderate' : 'Expensive';

  return (
    <section id="housing" className="section">
      <div className="section-inner">
        <p className="section-label">📊 HUD Fair Market Rents</p>
        <h2 className="section-title">Housing Costs in {cityName}</h2>
        <p className="section-subtitle">
          Rental data sourced from the U.S. Dept. of Housing and Urban Development (HUD), fiscal year {data.fiscalYear}.
        </p>

        {/* Affordability Index */}
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 auto' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: `conic-gradient(${afColor} ${afIndex}%, rgba(255,255,255,0.06) 0%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                width: 76, height: 76, borderRadius: '50%',
                background: 'var(--color-bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: afColor }}>{afIndex}</span>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Affordability Index</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: afColor, marginBottom: '0.25rem' }}>{afLabel}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', maxWidth: 360 }}>
              A score of {afIndex}/100 means {cityName.split(',')[0]} is {afLabel.toLowerCase()} for students on a typical budget. Scores above 65 are considered student-friendly.
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="affordability-bands">
              {[
                { label: 'Studio',    value: `$${data.fmr.studio.toLocaleString()}`, pct: Math.min(100, data.fmr.studio / 40), color: '#4e8df5' },
                { label: '1-Bed',     value: `$${data.fmr.oneBed.toLocaleString()}`, pct: Math.min(100, data.fmr.oneBed  / 40), color: '#7c6ef7' },
                { label: '2-Bed',     value: `$${data.fmr.twoBed.toLocaleString()}`, pct: Math.min(100, data.fmr.twoBed  / 40), color: '#34d399' },
                { label: '3-Bed',     value: `$${data.fmr.threeBed.toLocaleString()}`, pct: Math.min(100, data.fmr.threeBed / 40), color: '#fbbf24' },
              ].map(b => (
                <div key={b.label} className="band">
                  <span className="band-label">{b.label}</span>
                  <div className="band-bar-bg">
                    <div className="band-bar" style={{ width: `${b.pct}%`, background: b.color }} />
                  </div>
                  <span className="band-value">{b.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="housing-grid">
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>
              Fair Market Rents by Unit Size <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>(click a bar)</span>
            </h3>
            <div className="chart-container">
              <Bar data={fmrBarData} options={fmrBarOptions} />
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>
              {selectedUnit.label} Rent Trend (HUD, by Fiscal Year)
            </h3>
            <div className="chart-container">
              <Line data={trendLineData} options={{ ...CHART_DEFAULTS, responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Transit Routes */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>
            🚌 Major Transit Routes Near Campus
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.transitRoutes.map((route, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.85rem 1rem',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{route.type === 'rail' ? '🚇' : '🚌'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{route.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.1rem' }}>{route.coverage}</div>
                </div>
                <div style={{
                  background: 'rgba(78,141,245,0.12)',
                  color: 'var(--color-primary)',
                  border: '1px solid rgba(78,141,245,0.25)',
                  borderRadius: '100px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  Every {route.frequency}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
