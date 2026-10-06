// ============================================================
// trafficBuckets.js — how traffic readings are grouped over time.
//
// Shared by the browser and collector/ (Node), so it uses no imports.
//
// Each city has ONE Firestore document, traffic_profiles/{cityId}:
//   buckets: { "weekday_08": { sumMinutes, sumDelayPct, count }, ... }
// i.e. running sums per (weekday|weekend, local hour). Average = sum / count.
// That's at most 48 buckets per city no matter how long the collector runs.
// ============================================================

// Local hours (0–23) that make up each band on weekdays.
export const RUSH_HOURS  = [7, 8, 16, 17];  // 7–9am and 4–6pm
export const LUNCH_HOURS = [11, 12];        // 11am–1pm

export function bucketKey(dayType, hour) {
  return `${dayType}_${String(hour).padStart(2, '0')}`;
}

/** Day type and hour of `date` as seen in the given IANA time zone. */
export function localBucket(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'short', hour: 'numeric', hourCycle: 'h23',
  }).formatToParts(date);
  const weekday = parts.find(p => p.type === 'weekday').value;
  const hour    = Number(parts.find(p => p.type === 'hour').value);
  const dayType = weekday === 'Sat' || weekday === 'Sun' ? 'weekend' : 'weekday';
  return { dayType, hour, key: bucketKey(dayType, hour) };
}

function averageOf(buckets, dayType, hours) {
  let sumMinutes = 0, sumDelayPct = 0, count = 0;
  for (const h of hours) {
    const b = buckets[bucketKey(dayType, h)];
    if (!b?.count) continue;
    sumMinutes  += b.sumMinutes;
    sumDelayPct += b.sumDelayPct;
    count       += b.count;
  }
  return count
    ? { avgMinutes: sumMinutes / count, avgDelayPct: sumDelayPct / count, samples: count }
    : null;
}

/**
 * Turns a raw traffic_profiles document into chart/summary data.
 * @returns {{
 *   hours: { weekday: (number|null)[], weekend: (number|null)[] },  // avg minutes per local hour
 *   bands: { rush, lunch, offPeak },  // weekday only: { avgMinutes, avgDelayPct, samples } | null
 *   totalSamples: number,
 * }}
 */
export function summarizeProfile(profile) {
  const buckets = profile?.buckets ?? {};
  const allHours = Array.from({ length: 24 }, (_, h) => h);
  const hourly = dayType => allHours.map(h => {
    const b = buckets[bucketKey(dayType, h)];
    return b?.count ? b.sumMinutes / b.count : null;
  });

  const offPeakHours = allHours.filter(h => !RUSH_HOURS.includes(h) && !LUNCH_HOURS.includes(h));
  return {
    hours: { weekday: hourly('weekday'), weekend: hourly('weekend') },
    bands: {
      rush:    averageOf(buckets, 'weekday', RUSH_HOURS),
      lunch:   averageOf(buckets, 'weekday', LUNCH_HOURS),
      offPeak: averageOf(buckets, 'weekday', offPeakHours),
    },
    totalSamples: Object.values(buckets).reduce((s, b) => s + (b?.count ?? 0), 0),
  };
}
