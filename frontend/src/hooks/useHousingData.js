import { useState, useEffect } from 'react';
import { CITIES } from '../data/cities';
import { loadCityHousing } from '../lib/housing';
import { fetchCachedHousing } from '../api/firestoreCache';

// ============================================================
// useHousingData — housing data for a city
//
// 1. Reads the pre-computed document from Firestore (housing/{cityId}),
//    kept fresh by the daily collector job. One read, no HUD calls.
// 2. If that's missing, falls back to calling the HUD API directly
//    (needs VITE_HUD_API_TOKEN in frontend/.env).
// ============================================================

async function getCityHousing(cityId) {
  const cached = await fetchCachedHousing(cityId);
  if (cached?.fiscalYear) return cached;
  return loadCityHousing(cityId);
}

export function useHousingData(cityId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  // City whose fetch (success or failure) most recently finished
  const [loadedCityId, setLoadedCityId] = useState(null);

  useEffect(() => {
    if (!cityId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCityHousing(cityId)
      .then(result => { if (!cancelled) { setData(result); setLoading(false); setLoadedCityId(cityId); } })
      .catch(e => { if (!cancelled) { setData(null); setError(e.message); setLoading(false); setLoadedCityId(cityId); } });

    return () => { cancelled = true; };
  }, [cityId]);

  return { data, loading, error, loadedCityId };
}

export { CITIES };
