import { useState, useEffect } from 'react';
import { fetchTrafficProfile } from '../api/firestoreCache';
import { summarizeProfile } from '../lib/trafficBuckets';

// ============================================================
// useTrafficProfile — typical commute by time of day for a city,
// built from traffic_profiles/{cityId} (written by collector/).
// ============================================================
export function useTrafficProfile(cityId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityId) { setProfile(null); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    fetchTrafficProfile(cityId).then(doc => {
      if (cancelled) return;
      setProfile(doc ? summarizeProfile(doc) : null);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [cityId]);

  return { profile, loading };
}
