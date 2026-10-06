// ============================================================
// cityConfig.js — static per-city configuration (NOT live data)
//
//  hudEntityId  : HUD Fair Market Rent area ID. Found via
//                 GET https://www.huduser.gov/hudapi/public/fmr/listMetroAreas
//  timeZone     : IANA zone used to bucket traffic readings by local hour.
//  neighborhoods: map-pin coordinates. `zip` is used to look up
//                 ZIP-level "Small Area FMR" rents from HUD. HUD only
//                 publishes ZIP-level rents for some metros (Chicago,
//                 Los Angeles and Seattle at the time of writing); for the
//                 rest, neighborhoods fall back to the metro-wide FMR.
//  transitRoutes: hand-curated reference list (HUD has no transit data).
//                 Swap for GTFS static feeds if you want these live.
// ============================================================

export const CITY_CONFIG = {
  austin: {
    hudEntityId: 'METRO12420M12420', // Austin-Round Rock-San Marcos, TX MSA
    timeZone: 'America/Chicago',
    neighborhoods: [
      { name: 'East Riverside',    lat: 30.2370, lng: -97.7278 },
      { name: 'North Loop',        lat: 30.3100, lng: -97.7220 },
      { name: 'Hyde Park',         lat: 30.3090, lng: -97.7378 },
      { name: 'South Congress',    lat: 30.2444, lng: -97.7500 },
      { name: 'Domain Area',       lat: 30.4024, lng: -97.7208 },
      { name: 'Rundberg',          lat: 30.3444, lng: -97.7124 },
    ],
    transitRoutes: [
      { name: 'MetroRapid 803', type: 'bus',   frequency: '10 min', coverage: 'UT Campus ↔ South Congress' },
      { name: 'MetroRail Red',  type: 'rail',  frequency: '30 min', coverage: 'Leander ↔ Downtown' },
      { name: 'Cap Metro 1',    type: 'bus',   frequency: '15 min', coverage: 'North Loop ↔ Campus' },
    ],
  },
  chicago: {
    hudEntityId: 'METRO16980M16980', // Chicago-Joliet-Naperville, IL HUD Metro FMR Area
    timeZone: 'America/Chicago',
    neighborhoods: [
      { name: 'Hyde Park',         lat: 41.7943, lng: -87.5907, zip: '60615' },
      { name: 'Wicker Park',       lat: 41.9088, lng: -87.6782, zip: '60622' },
      { name: 'Logan Square',      lat: 41.9218, lng: -87.7071, zip: '60647' },
      { name: 'South Loop',        lat: 41.8674, lng: -87.6280, zip: '60616' },
      { name: 'Pilsen',            lat: 41.8554, lng: -87.6596, zip: '60608' },
      { name: 'Rogers Park',       lat: 42.0099, lng: -87.6720, zip: '60626' },
    ],
    transitRoutes: [
      { name: 'Red Line (L)',    type: 'rail', frequency: '6 min',  coverage: 'Howard ↔ 95th/Dan Ryan' },
      { name: 'Blue Line (L)',   type: 'rail', frequency: '7 min',  coverage: 'O\'Hare ↔ Forest Park' },
      { name: 'Bus 6 - Jackson', type: 'bus',  frequency: '12 min', coverage: 'Hyde Park ↔ Loop' },
    ],
  },
  boston: {
    hudEntityId: 'METRO14460MM1120', // Boston-Cambridge-Quincy, MA-NH HUD Metro FMR Area
    timeZone: 'America/New_York',
    neighborhoods: [
      { name: 'Allston',           lat: 42.3539, lng: -71.1320 },
      { name: 'Mission Hill',      lat: 42.3318, lng: -71.1003 },
      { name: 'Jamaica Plain',     lat: 42.3109, lng: -71.1059 },
      { name: 'Back Bay',          lat: 42.3503, lng: -71.0810 },
      { name: 'Fenway',            lat: 42.3445, lng: -71.1002 },
      { name: 'Mattapan',          lat: 42.2695, lng: -71.0925 },
    ],
    transitRoutes: [
      { name: 'Green Line (T)',  type: 'rail', frequency: '8 min',  coverage: 'Lechmere ↔ Riverside' },
      { name: 'Orange Line (T)', type: 'rail', frequency: '6 min',  coverage: 'Oak Grove ↔ Forest Hills' },
      { name: 'Bus 66',          type: 'bus',  frequency: '10 min', coverage: 'Allston ↔ Nubian' },
    ],
  },
  losangeles: {
    hudEntityId: 'METRO31080MM4480', // Los Angeles-Long Beach-Glendale, CA HUD Metro FMR Area
    timeZone: 'America/Los_Angeles',
    neighborhoods: [
      { name: 'Koreatown',         lat: 34.0586, lng: -118.2989, zip: '90005' },
      { name: 'Eagle Rock',        lat: 34.1392, lng: -118.2084, zip: '90041' },
      { name: 'Boyle Heights',     lat: 34.0186, lng: -118.2122, zip: '90033' },
      { name: 'Silver Lake',       lat: 34.0870, lng: -118.2703, zip: '90026' },
      { name: 'Palms',             lat: 34.0102, lng: -118.3868, zip: '90034' },
      { name: 'Inglewood',         lat: 33.9617, lng: -118.3531, zip: '90301' },
    ],
    transitRoutes: [
      { name: 'Metro E Line',    type: 'rail', frequency: '10 min', coverage: 'Santa Monica ↔ East LA' },
      { name: 'Metro B Line',    type: 'rail', frequency: '8 min',  coverage: 'North Hollywood ↔ Wilshire/Vermont' },
      { name: 'DASH Koreatown',  type: 'bus',  frequency: '15 min', coverage: 'Koreatown Loop' },
    ],
  },
  newyork: {
    hudEntityId: 'METRO35620MM5600', // New York, NY HUD Metro FMR Area
    timeZone: 'America/New_York',
    neighborhoods: [
      { name: 'Washington Heights', lat: 40.8448, lng: -73.9393 },
      { name: 'Astoria, Queens',    lat: 40.7721, lng: -73.9303 },
      { name: 'Bushwick',           lat: 40.6942, lng: -73.9213 },
      { name: 'Lower East Side',    lat: 40.7157, lng: -73.9862 },
      { name: 'Crown Heights',      lat: 40.6694, lng: -73.9422 },
      { name: 'Sunnyside, Queens',  lat: 40.7440, lng: -73.9314 },
    ],
    transitRoutes: [
      { name: 'Subway A/C/E',    type: 'rail', frequency: '4 min',  coverage: '207 St ↔ Far Rockaway' },
      { name: 'Subway 1/2/3',    type: 'rail', frequency: '5 min',  coverage: 'Van Cortlandt ↔ New Lots' },
      { name: 'BX12 Crosstown',  type: 'bus',  frequency: '8 min',  coverage: 'Fordham ↔ Pelham Bay' },
    ],
  },
  seattle: {
    hudEntityId: 'METRO42660MM7600', // Seattle-Bellevue, WA HUD Metro FMR Area
    timeZone: 'America/Los_Angeles',
    neighborhoods: [
      { name: 'University District', lat: 47.6614, lng: -122.3139, zip: '98105' },
      { name: 'Rainier Valley',      lat: 47.5584, lng: -122.2920, zip: '98118' },
      { name: 'Capitol Hill',        lat: 47.6235, lng: -122.3204, zip: '98122' },
      { name: 'Beacon Hill',         lat: 47.5710, lng: -122.3130, zip: '98108' },
      { name: 'South Lake Union',    lat: 47.6267, lng: -122.3367, zip: '98109' },
      { name: 'Northgate',           lat: 47.7063, lng: -122.3283, zip: '98125' },
    ],
    transitRoutes: [
      { name: 'Link Light Rail',   type: 'rail', frequency: '8 min',  coverage: 'Lynnwood ↔ Angle Lake' },
      { name: 'RapidRide C Line', type: 'bus',  frequency: '10 min', coverage: 'West Seattle ↔ South Lake Union' },
      { name: 'Route 49',          type: 'bus',  frequency: '12 min', coverage: 'U-District ↔ Capitol Hill' },
    ],
  },
};
