// ============================================================
// mockData.js — shared city list for the demo
// Housing data now comes from the HUD API (see hooks/useHousingData.js)
// and traffic from Mapbox (see hooks/useTrafficData.js).
// ============================================================

export const CITIES = [
  { id: 'austin',      name: 'Austin, TX',      lat: 30.2672, lng: -97.7431 },
  { id: 'chicago',     name: 'Chicago, IL',      lat: 41.8781, lng: -87.6298 },
  { id: 'boston',      name: 'Boston, MA',        lat: 42.3601, lng: -71.0589 },
  { id: 'losangeles',  name: 'Los Angeles, CA',   lat: 34.0522, lng: -118.2437 },
  { id: 'newyork',     name: 'New York, NY',       lat: 40.7128, lng: -74.0060 },
  { id: 'seattle',     name: 'Seattle, WA',        lat: 47.6062, lng: -122.3321 },
];
