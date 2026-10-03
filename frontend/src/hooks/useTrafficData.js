import { useState, useEffect, useRef } from 'react';
import { TRAFFIC_SNAPSHOT } from '../data/mockData';

// ============================================================
// useTrafficData — real-time traffic/transit hook
// Currently returns mock snapshots that update every 30s.
// Replace with real streaming data sources:
//
// Option A: GTFS-Realtime (free, city-specific)
//   - Find your city's feed at https://transitfeeds.com
//   - Use protobuf or the GTFS-realtime-bindings npm package
//
// Option B: Google Maps Roads API
//   - GET https://roads.googleapis.com/v1/snapToRoads
//   - Key: VITE_GOOGLE_MAPS_KEY in your .env
//
// Option C: Mapbox Traffic Tiles (visual only, no raw data)
//   - Add traffic layer to map with your Mapbox token
// ============================================================
export function useTrafficData(cityId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef           = useRef(null);

  const fetchSnapshot = () => {
    // Mock: randomize the commute slightly each tick to simulate "live"
    const jitter = Math.floor(Math.random() * 8) - 4;
    setData({
      avgCommute:    { ...TRAFFIC_SNAPSHOT.avgCommute,    value: String(24 + jitter) },
      delayedRoutes: { ...TRAFFIC_SNAPSHOT.delayedRoutes, value: String(Math.max(0, 3 + Math.floor(Math.random() * 3))) },
      activeBuses:   { ...TRAFFIC_SNAPSHOT.activeBuses,   value: String(138 + Math.floor(Math.random() * 15)) },
    });
    setLoading(false);
  };

  useEffect(() => {
    if (!cityId) return;
    fetchSnapshot();
    // Refresh every 30 seconds — simulates streaming updates
    intervalRef.current = setInterval(fetchSnapshot, 30_000);
    return () => clearInterval(intervalRef.current);
  }, [cityId]);

  return { data, loading };
}
