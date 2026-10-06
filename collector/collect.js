// ============================================================
// collect.js — scheduled data collector for NestNav
//
//   node collect.js traffic   [--dry-run]   (every 30 min)
//   node collect.js housing   [--dry-run]   (daily)
//
// traffic: takes one live commute reading per city and adds it to a running
//          sum for that city's local (weekday|weekend, hour) bucket in
//          traffic_profiles/{cityId}. Storage never grows past 48 buckets/city.
// housing: rebuilds the HUD housing data for each city and stores it in
//          housing/{cityId}, so browsers never need to call HUD.
//
// Env vars:
//   FIREBASE_SERVICE_ACCOUNT  service-account JSON (whole file contents)
//   MAPBOX_TOKEN              Mapbox public token (traffic job)
//   HUD_API_TOKEN             HUD User API token (housing job)
// --dry-run skips Firebase entirely and just prints what would be written.
// ============================================================

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { CITIES } from '../frontend/src/data/mockData.js';
import { CITY_CONFIG } from '../frontend/src/data/cityConfig.js';
import { fetchCommuteSnapshot } from '../frontend/src/api/mapboxTraffic.js';
import { loadCityHousing } from '../frontend/src/lib/housing.js';
import { localBucket } from '../frontend/src/lib/trafficBuckets.js';

const [job, ...flags] = process.argv.slice(2);
const DRY_RUN = flags.includes('--dry-run');

function requireEnv(name) {
  if (!process.env[name]) throw new Error(`Missing environment variable ${name}`);
  return process.env[name];
}

function connectFirestore() {
  if (DRY_RUN) return null;
  const serviceAccount = JSON.parse(requireEnv('FIREBASE_SERVICE_ACCOUNT'));
  initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---------------------------------------------------------------- traffic
async function collectTraffic(db) {
  requireEnv('MAPBOX_TOKEN');
  const now = new Date();
  let failures = 0;

  for (const city of CITIES) {
    const cfg = CITY_CONFIG[city.id];
    try {
      const ref = db?.collection('traffic_profiles').doc(city.id);
      const existing = ref ? (await ref.get()).data() : null;

      // Free-flow baseline is stored after the first run, so later runs make
      // one Matrix API call per city instead of two (keeps us under the free tier).
      const snapshot = await fetchCommuteSnapshot(city.id, city, cfg.neighborhoods, {
        freeFlowSeconds: existing?.freeFlowSeconds,
      });
      const { dayType, hour, key } = localBucket(now, cfg.timeZone);

      const update = {
        cityId: city.id,
        timeZone: cfg.timeZone,
        updatedAt: FieldValue.serverTimestamp(),
        buckets: {
          [key]: {
            sumMinutes:  FieldValue.increment(snapshot.avgMinutes),
            sumDelayPct: FieldValue.increment(snapshot.delayPercent),
            count:       FieldValue.increment(1),
          },
        },
      };
      if (!existing?.freeFlowSeconds) update.freeFlowSeconds = snapshot.freeFlowSeconds;

      console.log(`${city.id}: ${dayType} ${hour}:00 local → ${snapshot.avgMinutes} min avg, +${snapshot.delayPercent}% delay`);
      if (ref) await ref.set(update, { merge: true });
    } catch (e) {
      failures++;
      console.error(`${city.id}: FAILED — ${e.message}`);
    }
  }
  if (failures === CITIES.length) throw new Error('Every city failed.');
}

// ---------------------------------------------------------------- housing
async function collectHousing(db) {
  requireEnv('HUD_API_TOKEN');
  let failures = 0;

  for (const [i, city] of CITIES.entries()) {
    try {
      const data = await loadCityHousing(city.id);
      console.log(`${city.id}: FY${data.fiscalYear}, 1BR FMR $${data.fmr.oneBed}, ${data.neighborhoods.length} neighborhoods`);
      if (db) {
        await db.collection('housing').doc(city.id).set({ ...data, syncedAt: FieldValue.serverTimestamp() });
      }
    } catch (e) {
      failures++;
      console.error(`${city.id}: FAILED — ${e.message}`);
    }
    // HUD allows ~60 requests/min; each city uses ~7, so pace ourselves.
    if (i < CITIES.length - 1) await sleep(15_000);
  }
  if (failures === CITIES.length) throw new Error('Every city failed.');
}

// ---------------------------------------------------------------- main
const JOBS = { traffic: collectTraffic, housing: collectHousing };

if (!JOBS[job]) {
  console.error('Usage: node collect.js <traffic|housing> [--dry-run]');
  process.exit(1);
}

try {
  await JOBS[job](connectFirestore());
  console.log(`${job} job finished${DRY_RUN ? ' (dry run — nothing written)' : ''}.`);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
