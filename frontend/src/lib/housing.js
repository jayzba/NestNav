import { CITY_CONFIG } from '../data/cityConfig.js';
import { UNIT_KEYS } from '../data/units.js';
import { fetchLatestFmr, fetchFmrForYear } from '../api/hud.js';

// ============================================================
// housing.js — builds a city's housing data from the HUD FMR API.
//
// Runs in two places:
//   • the browser (fallback when the Firestore cache has no entry), and
//   • collector/ (Node) which writes the result to Firestore daily.
// Imports use explicit .js extensions so Node can load this file.
//
// What's real:  FMRs by unit size, per-neighborhood rent (ZIP-level where HUD
//               publishes it), and the multi-year rent trend.
// What's derived: affordability scores (see scoreFromRent below).
// ============================================================

const TREND_YEARS = 7; // latest fiscal year + the 6 before it

// Heuristic 0–100 score (higher = more affordable) based on a 1-bedroom FMR.
// $700/mo → 100, $3,300/mo → 0. HUD's Income Limits API isn't enabled on
// standard tokens, so we don't have local incomes to compute a true
// rent-to-income ratio. Tune these constants to taste.
const SCORE_BEST_RENT  = 700;
const SCORE_WORST_RENT = 3300;
function scoreFromRent(rent) {
  const pct = 1 - (rent - SCORE_BEST_RENT) / (SCORE_WORST_RENT - SCORE_BEST_RENT);
  return Math.max(0, Math.min(100, Math.round(pct * 100)));
}

// Neighborhoods are classified relative to the metro-wide 1BR FMR.
function classify(rent, metroRent) {
  const ratio = rent / metroRent;
  if (ratio < 0.9) return 'affordable';
  if (ratio > 1.1) return 'expensive';
  return 'moderate';
}

export async function loadCityHousing(cityId) {
  const cfg = CITY_CONFIG[cityId];
  if (!cfg) throw new Error('City data not available.');

  const latest = await fetchLatestFmr(cfg.hudEntityId);

  // Historical metro-wide FMRs (all unit sizes), one request per prior fiscal year.
  const priorYears = Array.from({ length: TREND_YEARS - 1 }, (_, i) => latest.year - (TREND_YEARS - 1) + i);
  const prior = await Promise.allSettled(priorYears.map(y => fetchFmrForYear(cfg.hudEntityId, y)));
  const trend = [
    ...prior
      .map((r, i) => (r.status === 'fulfilled' ? { year: priorYears[i], fmr: r.value.metro } : null))
      .filter(Boolean),
    { year: latest.year, fmr: latest.metro },
  ];

  const hasZipData = latest.zipFmr.size > 0;
  const neighborhoods = cfg.neighborhoods.map(n => {
    const zipFmr = n.zip ? latest.zipFmr.get(n.zip) : null;
    const rents = zipFmr ?? latest.metro; // { studio, oneBed, twoBed, threeBed }
    return {
      name: n.name,
      lat: n.lat,
      lng: n.lng,
      rents,
      // Per-unit classification vs. the metro-wide FMR for that same unit size
      affordability: Object.fromEntries(UNIT_KEYS.map(k => [k, classify(rents[k], latest.metro[k])])),
      score: scoreFromRent(rents.oneBed), // score is defined on the 1-bedroom rent
      isZipLevel: Boolean(zipFmr),
    };
  });

  return {
    fiscalYear: latest.year,
    fmr: latest.metro,
    affordabilityIndex: scoreFromRent(latest.metro.oneBed),
    neighborhoods,
    hasZipData,
    transitRoutes: cfg.transitRoutes,
    // { studio: [...], oneBed: [...], twoBed: [...], threeBed: [...] }, one value per fiscal year
    rentTrend: Object.fromEntries(
      UNIT_KEYS.map(k => [k, trend.map(t => t.fmr[k])])
    ),
    trendLabels: trend.map(t => `FY${t.year}`),
  };
}
