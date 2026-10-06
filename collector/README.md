# NestNav collector

Scheduled jobs (run by GitHub Actions, free) that fill Firestore:

| Job | Schedule | Writes |
| --- | --- | --- |
| `traffic` | every 30 min | `traffic_profiles/{cityId}` — running sums per (weekday/weekend, local hour) |
| `housing` | daily | `housing/{cityId}` — HUD housing data, so browsers never call HUD |

The browser only ever **reads** these (see `firestore.rules`).

## One-time setup

1. **Create the database:** Firebase console → Build → Firestore Database → *Create database* (production mode).
2. **Publish the rules:** paste `firestore.rules` into the console's *Rules* tab and Publish
   (or `npm i -g firebase-tools && firebase login && firebase deploy --only firestore:rules`).
3. **Service account:** Console → Project settings → Service accounts → *Generate new private key*.
   Don't commit the file.
4. **GitHub secrets** (repo → Settings → Secrets and variables → Actions):
   - `FIREBASE_SERVICE_ACCOUNT` — the entire contents of the JSON key file
   - `MAPBOX_TOKEN` — same value as `VITE_MAPBOX_TOKEN`
   - `HUD_API_TOKEN` — same value as `VITE_HUD_API_TOKEN`
5. **First run:** repo → Actions → run *Sync housing data* and *Collect traffic* manually (`workflow_dispatch`).

## Testing locally (no Firebase needed)

```bash
cd collector
npm install
MAPBOX_TOKEN=... npm run traffic:dry
HUD_API_TOKEN=... npm run housing:dry
```

## Quota notes

- Mapbox Matrix free tier is 100k elements/month. Collecting every 30 min uses about 52k
  (6 cities x 6 elements x 48 runs x 30 days). Don't go below 30-minute intervals.
- GitHub Actions is unlimited for public repos; private repos get 2,000 min/month and each
  run bills at least 1 minute (about 1,500 min/month for the traffic job alone).
- Scheduled workflows on public repos are paused after 60 days without repo activity.
