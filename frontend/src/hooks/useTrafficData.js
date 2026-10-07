import { useState, useEffect } from 'react';
import { CITIES } from '../data/mockData';
import { CITY_CONFIG } from '../data/cityConfig';
import { fetchCommuteSnapshot } from '../api/mapboxTraffic';

// ============================================================
// useTrafficData — live commute/traffic metrics from Mapbox
//
// Uses the Mapbox Matrix API with the `driving-traffic` profile (same
// VITE_MAPBOX_TOKEN as the map). Measures drive times from each neighborhood
// to the city center and compares them with free-flow times.
//
// Public transit metrics (delayed routes, active buses) aren't available from
// Mapbox; for that you'd need a city's GTFS-Realtime feed (https://transit.land).
// ============================================================

const REFRESH_MS = 5 * 60_000; // traffic doesn't change second-to-second; saves quota

// delay% vs. free-flow → status used for card colors
function statusFor(delayPercent) {
  if (delayPercent < 15) return 'good';
  if (delayPercent < 40) return 'moderate';
  return 'bad';
}

export function useTrafficData(cityId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!cityId) { setData(null); setLoading(false); return; }
    const city = CITIES.find(c => c.id === cityId);
    const cfg  = CITY_CONFIG[cityId];
    if (!city || !cfg) { setError('City data not available.'); setLoading(false); return; }

    let cancelled = false;
    setData(null);
    setError(null);
    setLoading(true);

    const refresh = () =>
      fetchCommuteSnapshot(cityId, city, cfg.neighborhoods)
        .then(s => {
          if (cancelled) return;
          const status = statusFor(s.delayPercent);
          setData({
            fetchedAt:  Date.now(),
            avgCommute: { value: String(s.avgMinutes),     unit: 'min',                  status },
            delay:      { value: String(s.delayPercent),   unit: '% over free-flow',      status },
            slowest:    { value: String(s.slowestMinutes), unit: `min · ${s.slowestName}`, status },
          });
          setError(null);
          setLoading(false);
        })
        .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });

    refresh();
    return () => { cancelled = true; };
  }, [cityId]);

  return { data, loading, error };
}
