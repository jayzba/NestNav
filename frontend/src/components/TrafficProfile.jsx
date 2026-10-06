import {
  Chart as ChartJS,
  CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTrafficProfile } from '../hooks/useTrafficProfile';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, Filler);

const HOUR_LABELS = Array.from({ length: 24 }, (_, h) =>
  h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`);

const BANDS = [
  { key: 'rush',    icon: '🚗', label: 'Rush hour',  hint: '7–9am, 4–6pm' },
  { key: 'lunch',   icon: '🥪', label: 'Lunch',      hint: '11am–1pm' },
  { key: 'offPeak', icon: '🌙', label: 'Off-peak',   hint: 'all other hours' },
];

// Typical weekday commute by time of day, from readings the collector has
// been recording into Firestore (traffic_profiles/{cityId}).
export default function TrafficProfile({ cityId }) {
  const { profile, loading } = useTrafficProfile(cityId);
  const headingStyle = { fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' };

  if (loading) return null;

  if (!profile || profile.totalSamples === 0) {
    return (
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={headingStyle}>Typical Commute by Time of Day</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
          No history for this city yet. The background collector records a reading every 30 minutes, so the chart fills in over the first few days.
        </p>
      </div>
    );
  }

  const { bands, hours, totalSamples } = profile;
  const offPeak = bands.offPeak?.avgMinutes;

  const chartData = {
    labels: HOUR_LABELS,
    datasets: [
      {
        label: 'Weekday',
        data: hours.weekday,
        borderColor: '#4e8df5',
        backgroundColor: 'rgba(78,141,245,0.1)',
        pointBackgroundColor: '#4e8df5',
        borderWidth: 2, pointRadius: 3, tension: 0.4, fill: true, spanGaps: true,
      },
      {
        label: 'Weekend',
        data: hours.weekend,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52,211,153,0.06)',
        pointBackgroundColor: '#34d399',
        borderWidth: 2, pointRadius: 3, tension: 0.4, fill: false, spanGaps: true,
      },
    ],
  };

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <h3 style={headingStyle}>Typical Commute by Time of Day</h3>

      {/* Weekday band summary */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {BANDS.map(b => {
          const band = bands[b.key];
          const diff = band && offPeak && b.key !== 'offPeak'
            ? Math.round((band.avgMinutes / offPeak - 1) * 100) : null;
          return (
            <div key={b.key} id={`traffic-band-${b.key}`} style={{
              flex: '1 1 160px', padding: '0.85rem 1rem',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {b.icon} {b.label} <span style={{ opacity: 0.7 }}>· {b.hint}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
                {band ? `${Math.round(band.avgMinutes)} min` : '—'}
              </div>
              {diff !== null && (
                <div style={{ fontSize: '0.75rem', color: diff > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                  {diff > 0 ? `+${diff}%` : `${diff}%`} vs. off-peak
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ height: 240 }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { labels: { color: '#8fa8cc', font: { size: 12 } } } },
            scales: {
              x: { ticks: { color: '#4a6080', font: { size: 11 }, maxTicksLimit: 12 }, grid: { color: 'rgba(99,155,255,0.05)' } },
              y: {
                ticks: { color: '#4a6080', font: { size: 11 }, callback: v => `${v}m` },
                grid: { color: 'rgba(99,155,255,0.05)' },
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        Average drive time from neighborhoods to downtown, by the city's local time. Based on {totalSamples.toLocaleString()} readings.
      </p>
    </div>
  );
}
