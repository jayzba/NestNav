import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useTrafficData } from '../hooks/useTrafficData';
import { CITIES } from '../data/cities';
import TrafficProfile from './TrafficProfile';

const STATUS_LABEL = { good: 'Normal', moderate: 'Delays', bad: 'Disrupted' };

export default function TrafficSection({ cityId }) {
  const { data, loading, error } = useTrafficData(cityId);
  const cityName = CITIES.find(c => c.id === cityId)?.name ?? '';
  const lastUpdated = data ? new Date(data.fetchedAt) : new Date();

  const metrics = data ? [
    {
      id: 'avg-commute',
      icon: '⏱️',
      label: 'Avg. Drive to Downtown',
      value: data.avgCommute.value,
      unit: data.avgCommute.unit,
      status: data.avgCommute.status,
    },
    {
      id: 'traffic-delay',
      icon: '🚦',
      label: 'Traffic Delay',
      value: data.delay.value,
      unit: data.delay.unit,
      status: data.delay.status,
    },
    {
      id: 'slowest-commute',
      icon: '🐢',
      label: 'Slowest Commute',
      value: data.slowest.value,
      unit: data.slowest.unit,
      status: data.slowest.status,
    },
  ] : [];



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
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
            <p>Couldn't load live traffic: {error}</p>
          </div>
        ) : loading || !data ? (
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

            {/* Stored history: typical commute by time of day (Firestore) */}
            <TrafficProfile cityId={cityId} />

            {/* Disclaimer */}
            <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              📡 Live driving times from Mapbox (neighborhoods → city center). Transit delays aren't included — add your city's GTFS Realtime feed for that.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
