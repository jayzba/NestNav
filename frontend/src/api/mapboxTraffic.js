// ============================================================
// mapboxTraffic.js — live commute times via the Mapbox Matrix API
//
// Uses the same public token as the map (VITE_MAPBOX_TOKEN); no extra key.
// Compares the `driving-traffic` profile (live conditions) against `driving`
// (no traffic) for trips from each neighborhood to the city center.
// Free tier: 100,000 matrix elements/month (each call here = 6 elements).
//
// Also runs in Node (collector/), where the token comes from MAPBOX_TOKEN.
// ============================================================

const TOKEN = (import.meta.env ?? {}).VITE_MAPBOX_TOKEN
  ?? (typeof process !== 'undefined' ? process.env.MAPBOX_TOKEN : undefined);
const freeFlowCache = new Map(); // free-flow times don't change, so cache per city

async function matrix(profile, coords) {
  if (!TOKEN) throw new Error('Missing VITE_MAPBOX_TOKEN in frontend/.env');
  const path    = coords.map(c => `${c.lng},${c.lat}`).join(';');
  const sources = coords.slice(1).map((_, i) => i + 1).join(';');
  const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/${profile}/${path}` +
              `?sources=${sources}&destinations=0&annotations=duration&access_token=${TOKEN}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mapbox Matrix API error ${res.status}`);
  const json = await res.json();
  if (json.code !== 'Ok') throw new Error(json.message ?? `Mapbox Matrix API: ${json.code}`);
  return json.durations.map(row => row[0]); // seconds, null if unroutable
}

/**
 * @param {string} cityId
 * @param {{lat:number,lng:number}} center  city center (destination)
 * @param {{name:string,lat:number,lng:number}[]} origins  neighborhoods (max 9)
 * @param {{freeFlowSeconds?: (number|null)[]}} [options]  pass previously stored
 *        free-flow times to skip the second Matrix call (the collector persists these)
 */
export async function fetchCommuteSnapshot(cityId, center, origins, options = {}) {
  const coords = [center, ...origins];

  if (options.freeFlowSeconds) {
    freeFlowCache.set(cityId, Promise.resolve(options.freeFlowSeconds));
  } else if (!freeFlowCache.has(cityId)) {
    freeFlowCache.set(cityId, matrix('driving', coords));
  }
  const [live, free] = await Promise.all([
    matrix('driving-traffic', coords),
    freeFlowCache.get(cityId).catch(e => { freeFlowCache.delete(cityId); throw e; }),
  ]);

  const trips = origins
    .map((o, i) => ({ name: o.name, live: live[i], free: free[i] }))
    .filter(t => t.live != null && t.free != null);
  if (!trips.length) throw new Error('No routable commutes found.');

  const avgLive = trips.reduce((s, t) => s + t.live, 0) / trips.length;
  const avgFree = trips.reduce((s, t) => s + t.free, 0) / trips.length;
  const slowest = trips.reduce((a, b) => (b.live > a.live ? b : a));

  return {
    avgMinutes:     Math.round(avgLive / 60),
    delayPercent:   Math.max(0, Math.round((avgLive / avgFree - 1) * 100)),
    slowestName:    slowest.name,
    slowestMinutes: Math.round(slowest.live / 60),
    freeFlowSeconds: free, // lets callers persist the baseline
  };
}
