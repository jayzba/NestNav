// ============================================================
// hud.js — HUD User Fair Market Rent (FMR) API client
//
// Docs: https://www.huduser.gov/portal/dataset/fmr-api.html
// Token: VITE_HUD_API_TOKEN in frontend/.env
//
// NOTE: any VITE_* variable is bundled into the browser JS, so the
// token is visible to anyone who loads the site. The Firestore cache
// (see lib/housing + collector/) lets the browser avoid calling HUD at all;
// this client is then only a fallback for when the cache is empty.
//
// This module also runs in Node (collector/), where the token comes from
// the HUD_API_TOKEN environment variable instead.
// ============================================================

const BASE  = 'https://www.huduser.gov/hudapi/public/fmr';
const TOKEN = (import.meta.env ?? {}).VITE_HUD_API_TOKEN
  ?? (typeof process !== 'undefined' ? process.env.HUD_API_TOKEN : undefined);

// In-memory cache of in-flight/finished requests. HUD rate-limits to
// ~60 requests/min, and FMRs only change once a year.
const cache = new Map();

function hudGet(path) {
  if (!TOKEN) return Promise.reject(new Error('Missing VITE_HUD_API_TOKEN in frontend/.env'));
  if (cache.has(path)) return cache.get(path);

  const request = fetch(`${BASE}/${path}`, { headers: { Authorization: `Bearer ${TOKEN}` } })
    .then(async res => {
      if (!res.ok) throw new Error(`HUD API error ${res.status}`);
      const json = await res.json();
      return json.data;
    })
    .catch(err => { cache.delete(path); throw err; });

  cache.set(path, request);
  return request;
}

// HUD returns `basicdata` as an object for metro-level areas, or as an
// array of ZIP rows (plus an "MSA level" row) for Small Area FMR metros.
function toFmr(row) {
  return {
    studio:   Number(row['Efficiency']),
    oneBed:   Number(row['One-Bedroom']),
    twoBed:   Number(row['Two-Bedroom']),
    threeBed: Number(row['Three-Bedroom']),
  };
}

function parseArea(data) {
  const basic = data.basicdata;
  const isSmallArea = Array.isArray(basic);
  const metroRow = isSmallArea ? (basic.find(r => r.zip_code === 'MSA level') ?? basic[0]) : basic;
  const zipFmr = new Map();
  if (isSmallArea) {
    basic.forEach(r => { if (r.zip_code !== 'MSA level') zipFmr.set(String(r.zip_code), toFmr(r)); });
  }
  return {
    year: Number(data.year ?? metroRow.year),
    metro: toFmr(metroRow),
    zipFmr,
  };
}

/** Latest published FMR (metro-wide + ZIP-level where available) for an area. */
export async function fetchLatestFmr(entityId) {
  return parseArea(await hudGet(`data/${entityId}`));
}

/** Metro-wide FMR for a specific fiscal year. */
export async function fetchFmrForYear(entityId, year) {
  return parseArea(await hudGet(`data/${entityId}?year=${year}`));
}
