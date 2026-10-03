import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useTrafficData } from '../hooks/useTrafficData';
import { CITIES } from '../data/mockData';

const STATUS_LABEL = { good: 'Normal', moderate: 'Delays', bad: 'Disrupted' };

export default function TrafficSection({ cityId }) {
  const { data, loading } = useTrafficData(cityId);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const cityName = CITIES.find(c => c.id === cityId)?.name ?? '';

  useEffect(() => {
    if (!loading && data) setLastUpdated(new Date());
  }, [data]);

  const metrics = data ? [
    {
      id: 'avg-commute',
      icon: '⏱️',
      label: 'Avg. Commute Time',
      value: data.avgCommute.value,
      unit: 'min',
      status: data.avgCommute.status,
    },
    {
      id: 'delayed-routes',
      icon: '⚠️',
      label: 'Delayed Routes',
      value: data.delayedRoutes.value,
      unit: 'routes',
      status: data.delayedRoutes.status,
    },
    {
      id: 'active-buses',
      icon: '🚌',
      label: 'Buses Active Now',
      value: data.activeBuses.value,
      unit: 'active',
      status: data.activeBuses.status,
    },
  ] : [];

  // Build a sparkline out of last 10 simulated readings
  const [history, setHistory] = useState([24, 23, 25, 22, 26, 24, 27, 23, 24, 25]);
  useEffect(() => {
    if (data) setHistory(h => [...h.slice(-9), Number(data.avgCommute.value)]);
  }, [data?.avgCommute?.value]);

  const sparkData = {
    labels: history.map((_, i) => `T-${history.length - 1 - i}m`),
    datasets: [{
      label: 'Commute (min)',
      data: history,
      borderColor: '#4e8df5',
      backgroundColor: 'rgba(78,141,245,0.08)',
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: '#4e8df5',
      fill: true,
      tension: 0.4,
    }],
  };

  return (
    <section id="traffic" className="section">
      <div className="section-inner">
        <p className="section-label">🚦 Live Transit Data</p>
        <h2 className="section-title">Real-Time Traffic Overview</h2>
        <p className="section-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {cityId ? (
            <>
              <span className="traffic-status-dot status-good" style={{ display: 'inline-block' }} />
              Live feed for {cityName} · Updated {lastUpdated.toLocaleTimeString()}
            </>
          ) : 'Search for a city above to see live transit data.'}
        </p>

        {!cityId ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚇</div>
            <p>No city selected yet.</p>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)',
              animation: 'spin 0.8s linear infinite', margin: '0 auto',
            }} />
          </div>
        ) : (
          <>
            {/* Metric Cards */}
            <div className="traffic-grid">
              {metrics.map(m => (
                <div key={m.id} id={m.id} className={`traffic-metric-card ${m.status}`}>
                  <div className="traffic-icon">{m.icon}</div>
                  <div className="traffic-metric-value" style={{
                    color: m.status === 'good' ? 'var(--color-success)'
                         : m.status === 'moderate' ? 'var(--color-warning)'
                         : 'var(--color-danger)',
                  }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>{m.unit}</div>
                  <div className="traffic-metric-label">{m.label}</div>
                  <div style={{ marginTop: '0.6rem', fontSize: '0.75rem' }}>
                    <span className={`traffic-status-dot status-${m.status}`} />
                    {STATUS_LABEL[m.status]}
                  </div>
                </div>
              ))}
            </div>

            {/* Commute Sparkline */}
            <div className="card" style={{ marginTop: '0.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>
                Commute Time History (Last 10 Readings)
              </h3>
              <div style={{ height: 200 }}>
                <Line
                  data={sparkData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { ticks: { color: '#4a6080', font: { size: 11 } }, grid: { color: 'rgba(99,155,255,0.05)' } },
                      y: {
                        ticks: { color: '#4a6080', font: { size: 11 }, callback: v => `${v}m` },
                        grid: { color: 'rgba(99,155,255,0.05)' },
                        min: 10, max: 45,
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Disclaimer */}
            <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              🔌 Demo mode: data refreshes every 30 seconds with simulated variance. Wire in your city's GTFS Realtime feed to show true live data.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
