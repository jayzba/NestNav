// ============================================================
// mockData.js — Realistic placeholder data for demo mode
// Replace these with real Firebase / HUD API calls later.
// ============================================================

export const CITIES = [
  { id: 'austin',      name: 'Austin, TX',      lat: 30.2672, lng: -97.7431 },
  { id: 'chicago',     name: 'Chicago, IL',      lat: 41.8781, lng: -87.6298 },
  { id: 'boston',      name: 'Boston, MA',        lat: 42.3601, lng: -71.0589 },
  { id: 'losangeles',  name: 'Los Angeles, CA',   lat: 34.0522, lng: -118.2437 },
  { id: 'newyork',     name: 'New York, NY',       lat: 40.7128, lng: -74.0060 },
  { id: 'seattle',     name: 'Seattle, WA',        lat: 47.6062, lng: -122.3321 },
];

// Fair Market Rents (FMR) — normally pulled from HUD User API
export const HOUSING_DATA = {
  austin: {
    fmr: { studio: 1350, oneBed: 1580, twoBed: 1870, threeBed: 2200 },
    affordabilityIndex: 54,  // 0–100, higher = more affordable
    neighborhoods: [
      { name: 'East Riverside',    lat: 30.2370, lng: -97.7278, rent: 1250, affordability: 'affordable', score: 78 },
      { name: 'North Loop',        lat: 30.3100, lng: -97.7220, rent: 1450, affordability: 'moderate',   score: 62 },
      { name: 'Hyde Park',         lat: 30.3090, lng: -97.7378, rent: 1650, affordability: 'moderate',   score: 55 },
      { name: 'South Congress',    lat: 30.2444, lng: -97.7500, rent: 1900, affordability: 'expensive',  score: 38 },
      { name: 'Domain Area',       lat: 30.4024, lng: -97.7208, rent: 2100, affordability: 'expensive',  score: 28 },
      { name: 'Rundberg',          lat: 30.3444, lng: -97.7124, rent: 1100, affordability: 'affordable', score: 85 },
    ],
    transitRoutes: [
      { name: 'MetroRapid 803', type: 'bus',   frequency: '10 min', coverage: 'UT Campus ↔ South Congress' },
      { name: 'MetroRail Red',  type: 'rail',  frequency: '30 min', coverage: 'Leander ↔ Downtown' },
      { name: 'Cap Metro 1',    type: 'bus',   frequency: '15 min', coverage: 'North Loop ↔ Campus' },
    ],
    rentTrend: [1100, 1180, 1250, 1310, 1390, 1450, 1530, 1580, 1620, 1700, 1780, 1870],
  },
  chicago: {
    fmr: { studio: 1150, oneBed: 1380, twoBed: 1620, threeBed: 1990 },
    affordabilityIndex: 68,
    neighborhoods: [
      { name: 'Hyde Park',         lat: 41.7943, lng: -87.5907, rent: 1300, affordability: 'affordable', score: 74 },
      { name: 'Wicker Park',       lat: 41.9088, lng: -87.6782, rent: 1700, affordability: 'moderate',   score: 51 },
      { name: 'Logan Square',      lat: 41.9218, lng: -87.7071, rent: 1550, affordability: 'moderate',   score: 59 },
      { name: 'South Loop',        lat: 41.8674, lng: -87.6280, rent: 1950, affordability: 'expensive',  score: 33 },
      { name: 'Pilsen',            lat: 41.8554, lng: -87.6596, rent: 1200, affordability: 'affordable', score: 80 },
      { name: 'Rogers Park',       lat: 42.0099, lng: -87.6720, rent: 1050, affordability: 'affordable', score: 88 },
    ],
    transitRoutes: [
      { name: 'Red Line (L)',    type: 'rail', frequency: '6 min',  coverage: 'Howard ↔ 95th/Dan Ryan' },
      { name: 'Blue Line (L)',   type: 'rail', frequency: '7 min',  coverage: 'O\'Hare ↔ Forest Park' },
      { name: 'Bus 6 - Jackson', type: 'bus',  frequency: '12 min', coverage: 'Hyde Park ↔ Loop' },
    ],
    rentTrend: [980, 1010, 1060, 1100, 1140, 1200, 1250, 1290, 1340, 1390, 1430, 1480],
  },
  boston: {
    fmr: { studio: 1800, oneBed: 2150, twoBed: 2600, threeBed: 3100 },
    affordabilityIndex: 35,
    neighborhoods: [
      { name: 'Allston',           lat: 42.3539, lng: -71.1320, rent: 1850, affordability: 'moderate',   score: 57 },
      { name: 'Mission Hill',      lat: 42.3318, lng: -71.1003, rent: 1700, affordability: 'affordable', score: 65 },
      { name: 'Jamaica Plain',     lat: 42.3109, lng: -71.1059, rent: 2000, affordability: 'moderate',   score: 50 },
      { name: 'Back Bay',          lat: 42.3503, lng: -71.0810, rent: 3200, affordability: 'expensive',  score: 18 },
      { name: 'Fenway',            lat: 42.3445, lng: -71.1002, rent: 2400, affordability: 'expensive',  score: 32 },
      { name: 'Mattapan',          lat: 42.2695, lng: -71.0925, rent: 1550, affordability: 'affordable', score: 72 },
    ],
    transitRoutes: [
      { name: 'Green Line (T)',  type: 'rail', frequency: '8 min',  coverage: 'Lechmere ↔ Riverside' },
      { name: 'Orange Line (T)', type: 'rail', frequency: '6 min',  coverage: 'Oak Grove ↔ Forest Hills' },
      { name: 'Bus 66',          type: 'bus',  frequency: '10 min', coverage: 'Allston ↔ Nubian' },
    ],
    rentTrend: [1600, 1640, 1700, 1760, 1820, 1880, 1950, 2020, 2080, 2140, 2210, 2280],
  },
  losangeles: {
    fmr: { studio: 1600, oneBed: 1900, twoBed: 2400, threeBed: 3100 },
    affordabilityIndex: 30,
    neighborhoods: [
      { name: 'Koreatown',         lat: 34.0586, lng: -118.2989, rent: 1750, affordability: 'moderate',   score: 53 },
      { name: 'Eagle Rock',        lat: 34.1392, lng: -118.2084, rent: 1900, affordability: 'moderate',   score: 47 },
      { name: 'Boyle Heights',     lat: 34.0186, lng: -118.2122, rent: 1500, affordability: 'affordable', score: 68 },
      { name: 'Silver Lake',       lat: 34.0870, lng: -118.2703, rent: 2400, affordability: 'expensive',  score: 25 },
      { name: 'Palms',             lat: 34.0102, lng: -118.3868, rent: 2000, affordability: 'moderate',   score: 44 },
      { name: 'Inglewood',         lat: 33.9617, lng: -118.3531, rent: 1600, affordability: 'affordable', score: 62 },
    ],
    transitRoutes: [
      { name: 'Metro E Line',    type: 'rail', frequency: '10 min', coverage: 'Santa Monica ↔ East LA' },
      { name: 'Metro B Line',    type: 'rail', frequency: '8 min',  coverage: 'North Hollywood ↔ Wilshire/Vermont' },
      { name: 'DASH Koreatown',  type: 'bus',  frequency: '15 min', coverage: 'Koreatown Loop' },
    ],
    rentTrend: [1400, 1450, 1520, 1580, 1640, 1700, 1800, 1880, 1950, 2050, 2150, 2250],
  },
  newyork: {
    fmr: { studio: 2100, oneBed: 2600, twoBed: 3200, threeBed: 4000 },
    affordabilityIndex: 22,
    neighborhoods: [
      { name: 'Washington Heights', lat: 40.8448, lng: -73.9393, rent: 2000, affordability: 'affordable', score: 60 },
      { name: 'Astoria, Queens',    lat: 40.7721, lng: -73.9303, rent: 2200, affordability: 'moderate',   score: 52 },
      { name: 'Bushwick',           lat: 40.6942, lng: -73.9213, rent: 2300, affordability: 'moderate',   score: 48 },
      { name: 'Lower East Side',    lat: 40.7157, lng: -73.9862, rent: 3000, affordability: 'expensive',  score: 22 },
      { name: 'Crown Heights',      lat: 40.6694, lng: -73.9422, rent: 2100, affordability: 'moderate',   score: 55 },
      { name: 'Sunnyside, Queens',  lat: 40.7440, lng: -73.9314, rent: 1900, affordability: 'affordable', score: 66 },
    ],
    transitRoutes: [
      { name: 'Subway A/C/E',    type: 'rail', frequency: '4 min',  coverage: '207 St ↔ Far Rockaway' },
      { name: 'Subway 1/2/3',    type: 'rail', frequency: '5 min',  coverage: 'Van Cortlandt ↔ New Lots' },
      { name: 'BX12 Crosstown',  type: 'bus',  frequency: '8 min',  coverage: 'Fordham ↔ Pelham Bay' },
    ],
    rentTrend: [1800, 1860, 1940, 2020, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800],
  },
  seattle: {
    fmr: { studio: 1500, oneBed: 1850, twoBed: 2300, threeBed: 2900 },
    affordabilityIndex: 42,
    neighborhoods: [
      { name: 'University District', lat: 47.6614, lng: -122.3139, rent: 1750, affordability: 'moderate',   score: 58 },
      { name: 'Rainier Valley',      lat: 47.5584, lng: -122.2920, rent: 1450, affordability: 'affordable', score: 72 },
      { name: 'Capitol Hill',        lat: 47.6235, lng: -122.3204, rent: 2100, affordability: 'moderate',   score: 46 },
      { name: 'Beacon Hill',         lat: 47.5710, lng: -122.3130, rent: 1650, affordability: 'affordable', score: 67 },
      { name: 'South Lake Union',    lat: 47.6267, lng: -122.3367, rent: 2600, affordability: 'expensive',  score: 20 },
      { name: 'Northgate',           lat: 47.7063, lng: -122.3283, rent: 1600, affordability: 'affordable', score: 70 },
    ],
    transitRoutes: [
      { name: 'Link Light Rail',   type: 'rail', frequency: '8 min',  coverage: 'Lynnwood ↔ Angle Lake' },
      { name: 'RapidRide C Line', type: 'bus',  frequency: '10 min', coverage: 'West Seattle ↔ South Lake Union' },
      { name: 'Route 49',          type: 'bus',  frequency: '12 min', coverage: 'U-District ↔ Capitol Hill' },
    ],
    rentTrend: [1300, 1360, 1430, 1500, 1560, 1620, 1700, 1760, 1820, 1880, 1950, 2020],
  },
};

// Mock real-time traffic snapshot (replace with actual GTFS Realtime or transit API)
export const TRAFFIC_SNAPSHOT = {
  avgCommute: { value: '24', unit: 'min', status: 'good' },
  delayedRoutes: { value: '3', unit: 'routes', status: 'moderate' },
  activeBuses: { value: '142', unit: 'active', status: 'good' },
};

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
