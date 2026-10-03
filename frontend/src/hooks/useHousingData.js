import { useState, useEffect } from 'react';
import { HOUSING_DATA, CITIES } from '../data/mockData';

// ============================================================
// useHousingData — fetches city housing data
// Currently uses mock data; swap fetch() calls with real
// HUD User API endpoints once you have a bearer token.
//
// Required API Keys:
//   HUD User API token — https://www.huduser.gov/portal/home.html
//   After signing in, go to "API Keys" to generate a free token.
//
// HUD Fair Market Rents endpoint:
//   GET https://www.huduser.gov/hudapi/public/fmr/statedata/{statecode}
//   Header: Authorization: Bearer YOUR_TOKEN
// ============================================================
export function useHousingData(cityId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!cityId) { setLoading(false); return; }
    setLoading(true);
    setError(null);

    // Simulate async API call
    const timer = setTimeout(() => {
      const result = HOUSING_DATA[cityId];
      if (result) {
        setData(result);
      } else {
        setError('City data not available.');
      }
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);

    /* ── REAL HUD API CALL (uncomment when you have a token) ──
    const HUD_TOKEN = import.meta.env.VITE_HUD_API_TOKEN;
    fetch(`https://www.huduser.gov/hudapi/public/fmr/statedata/${stateCode}`, {
      headers: { Authorization: `Bearer ${HUD_TOKEN}` }
    })
      .then(r => r.json())
      .then(json => { setData(json.data); setLoading(false); })
      .catch(e  => { setError(e.message);  setLoading(false); });
    */
  }, [cityId]);

  return { data, loading, error };
}

export { CITIES };
