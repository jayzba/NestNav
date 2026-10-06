import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// ============================================================
// firestoreCache.js — read-only access to data written by collector/
//
//   housing/{cityId}          — HUD housing data, refreshed daily
//   traffic_profiles/{cityId} — running sums of commute times by local hour
//
// Both return null on any problem (no db, missing doc, rules error) so the
// app can fall back to live APIs / an empty state instead of crashing.
// ============================================================

const READ_TIMEOUT_MS = 4000;

async function readDoc(collection, id) {
  if (!db) return null;
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timed out')), READ_TIMEOUT_MS));
    const snap = await Promise.race([getDoc(doc(db, collection, id)), timeout]);
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.warn(`[NestNav] Firestore read failed (${collection}/${id}):`, e.message);
    return null;
  }
}

export const fetchCachedHousing = cityId => readDoc('housing', cityId);
export const fetchTrafficProfile = cityId => readDoc('traffic_profiles', cityId);
