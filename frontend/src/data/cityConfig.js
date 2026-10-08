// ============================================================
// cityConfig.js — static per-city configuration (NOT live data)
//
//  hudEntityId  : HUD Fair Market Rent area ID.
//  timeZone     : IANA zone used to bucket traffic readings by local hour.
//  neighborhoods: map-pin coordinates.
//  transitRoutes: hand-curated reference list (HUD has no transit data).
// ============================================================

export const CITY_CONFIG = {
  austin: {
    hudEntityId: 'METRO12420M12420',
    timeZone: 'America/Chicago',
    neighborhoods: [
      { name: 'Round Rock',       lat: 30.5083, lng: -97.6789, zip: '78664' },
      { name: 'Pflugerville',     lat: 30.4548, lng: -97.6223, zip: '78660' },
      { name: 'Cedar Park',       lat: 30.5050, lng: -97.8303, zip: '78613' },
      { name: 'Buda',             lat: 30.0866, lng: -97.8422, zip: '78610' },
      { name: 'Lakeway',          lat: 30.3655, lng: -97.9761, zip: '78734' },
      { name: 'Manor',            lat: 30.3408, lng: -97.5567, zip: '78653' },
    ],
    transitRoutes: [
      { name: 'MetroRapid 803', type: 'bus',   frequency: '10 min', coverage: 'Domain ↔ Southpark Meadows' },
      { name: 'MetroRail Red',  type: 'rail',  frequency: '30 min', coverage: 'Leander ↔ Downtown' },
    ],
  },
  dallas: {
    hudEntityId: 'METRO19100M19100',
    timeZone: 'America/Chicago',
    neighborhoods: [
      { name: 'Plano',            lat: 33.0198, lng: -96.6989, zip: '75074' },
      { name: 'Irving',           lat: 32.8140, lng: -96.9489, zip: '75061' },
      { name: 'Garland',          lat: 32.9126, lng: -96.6389, zip: '75040' },
      { name: 'Grand Prairie',    lat: 32.7460, lng: -96.9978, zip: '75051' },
      { name: 'Mesquite',         lat: 32.7668, lng: -96.5992, zip: '75149' },
      { name: 'Richardson',       lat: 32.9483, lng: -96.7299, zip: '75080' },
    ],
    transitRoutes: [
      { name: 'DART Red Line',   type: 'rail', frequency: '15 min', coverage: 'Plano ↔ Downtown' },
      { name: 'DART Orange Line',type: 'rail', frequency: '20 min', coverage: 'DFW Airport ↔ Downtown' },
    ],
  },
  denver: {
    hudEntityId: 'METRO19740M19740',
    timeZone: 'America/Denver',
    neighborhoods: [
      { name: 'Aurora',           lat: 39.7294, lng: -104.8319, zip: '80012' },
      { name: 'Centennial',       lat: 39.5807, lng: -104.8772, zip: '80112' },
      { name: 'Littleton',        lat: 39.6133, lng: -105.0166, zip: '80120' },
      { name: 'Arvada',           lat: 39.8028, lng: -105.0875, zip: '80004' },
      { name: 'Thornton',         lat: 39.8680, lng: -104.9719, zip: '80229' },
      { name: 'Parker',           lat: 39.5186, lng: -104.7614, zip: '80134' },
    ],
    transitRoutes: [
      { name: 'RTD A Line',      type: 'rail', frequency: '15 min', coverage: 'Airport ↔ Union Station' },
      { name: 'RTD W Line',      type: 'rail', frequency: '15 min', coverage: 'Golden ↔ Union Station' },
    ],
  },
  newyork: {
    hudEntityId: 'METRO35620MM5600',
    timeZone: 'America/New_York',
    neighborhoods: [
      { name: 'Yonkers',          lat: 40.9312, lng: -73.8987, zip: '10701' },
      { name: 'Flushing',         lat: 40.7684, lng: -73.8321, zip: '11354' },
      { name: 'Jamaica',          lat: 40.7027, lng: -73.7890, zip: '11432' },
      { name: 'Staten Island',    lat: 40.5795, lng: -74.1502, zip: '10306' },
      { name: 'New Rochelle',     lat: 40.9115, lng: -73.7824, zip: '10801' },
      { name: 'Bay Ridge',        lat: 40.6261, lng: -74.0322, zip: '11209' },
    ],
    transitRoutes: [
      { name: 'Subway A/C/E',    type: 'rail', frequency: '4 min',  coverage: 'Uptown ↔ Downtown' },
      { name: 'LIRR',            type: 'rail', frequency: '30 min', coverage: 'Long Island ↔ Penn Station' },
    ],
  },
  la: {
    hudEntityId: 'METRO31080M31080',
    timeZone: 'America/Los_Angeles',
    neighborhoods: [
      { name: 'Santa Monica',     lat: 34.0195, lng: -118.4912, zip: '90401' },
      { name: 'Pasadena',         lat: 34.1478, lng: -118.1445, zip: '91101' },
      { name: 'Glendale',         lat: 34.1425, lng: -118.2551, zip: '91203' },
      { name: 'Long Beach',       lat: 33.7701, lng: -118.1937, zip: '90802' },
      { name: 'Inglewood',        lat: 33.9617, lng: -118.3531, zip: '90301' },
      { name: 'Burbank',          lat: 34.1808, lng: -118.3090, zip: '91502' },
    ],
    transitRoutes: [
      { name: 'Metro E Line',    type: 'rail', frequency: '12 min', coverage: 'Santa Monica ↔ Downtown LA' },
      { name: 'Metro B Line',    type: 'rail', frequency: '15 min', coverage: 'North Hollywood ↔ Union Station' },
    ],
  },
  chicago: {
    hudEntityId: 'METRO16980M16980',
    timeZone: 'America/Chicago',
    neighborhoods: [
      { name: 'Evanston',         lat: 42.0411, lng: -87.6901, zip: '60201' },
      { name: 'Oak Park',         lat: 41.8850, lng: -87.7845, zip: '60302' },
      { name: 'Des Plaines',      lat: 42.0334, lng: -87.8834, zip: '60016' },
      { name: 'Cicero',           lat: 41.8456, lng: -87.7539, zip: '60804' },
      { name: 'Skokie',           lat: 42.0324, lng: -87.7416, zip: '60076' },
      { name: 'Oak Lawn',         lat: 41.7109, lng: -87.7400, zip: '60453' },
    ],
    transitRoutes: [
      { name: 'CTA Red Line',    type: 'rail', frequency: '7 min',  coverage: 'Howard ↔ 95th/Dan Ryan' },
      { name: 'CTA Blue Line',   type: 'rail', frequency: '10 min', coverage: 'O\'Hare ↔ Forest Park' },
    ],
  },
  seattle: {
    hudEntityId: 'METRO42660M42660',
    timeZone: 'America/Los_Angeles',
    neighborhoods: [
      { name: 'Bellevue',         lat: 47.6101, lng: -122.2015, zip: '98004' },
      { name: 'Redmond',          lat: 47.6739, lng: -122.1215, zip: '98052' },
      { name: 'Renton',           lat: 47.4828, lng: -122.2170, zip: '98057' },
      { name: 'Kirkland',         lat: 47.6768, lng: -122.2059, zip: '98033' },
      { name: 'Lynnwood',         lat: 47.8209, lng: -122.3151, zip: '98036' },
      { name: 'Kent',             lat: 47.3809, lng: -122.2348, zip: '98032' },
    ],
    transitRoutes: [
      { name: 'Link 1 Line',     type: 'rail', frequency: '8 min',  coverage: 'Angle Lake ↔ Northgate' },
      { name: 'RapidRide C',     type: 'bus',  frequency: '10 min', coverage: 'West Seattle ↔ Downtown' },
    ],
  },
  miami: {
    hudEntityId: 'METRO33100M33100',
    timeZone: 'America/New_York',
    neighborhoods: [
      { name: 'Miami Beach',      lat: 25.7906, lng: -80.1300, zip: '33139' },
      { name: 'Coral Gables',     lat: 25.7214, lng: -80.2683, zip: '33134' },
      { name: 'Hialeah',          lat: 25.8575, lng: -80.2781, zip: '33012' },
      { name: 'Hollywood',        lat: 26.0112, lng: -80.1494, zip: '33020' },
      { name: 'Fort Lauderdale',  lat: 26.1224, lng: -80.1373, zip: '33301' },
      { name: 'Doral',            lat: 25.8195, lng: -80.3553, zip: '33178' },
    ],
    transitRoutes: [
      { name: 'Metrorail Green', type: 'rail', frequency: '15 min', coverage: 'Palmetto ↔ Dadeland South' },
      { name: 'Metromover',      type: 'rail', frequency: '5 min',  coverage: 'Downtown Loop' },
    ],
  },
  boston: {
    hudEntityId: 'METRO14460M14460',
    timeZone: 'America/New_York',
    neighborhoods: [
      { name: 'Cambridge',        lat: 42.3736, lng: -71.1097, zip: '02138' },
      { name: 'Somerville',       lat: 42.3875, lng: -71.0995, zip: '02143' },
      { name: 'Brookline',        lat: 42.3317, lng: -71.1211, zip: '02445' },
      { name: 'Quincy',           lat: 42.2528, lng: -71.0022, zip: '02169' },
      { name: 'Newton',           lat: 42.3370, lng: -71.2092, zip: '02458' },
      { name: 'Malden',           lat: 42.4250, lng: -71.0661, zip: '02148' },
    ],
    transitRoutes: [
      { name: 'MBTA Red Line',   type: 'rail', frequency: '10 min', coverage: 'Alewife ↔ Ashmont/Braintree' },
      { name: 'MBTA Green Line', type: 'rail', frequency: '8 min',  coverage: 'Lechmere ↔ B/C/D/E' },
    ],
  },
  atlanta: {
    hudEntityId: 'METRO12060M12060',
    timeZone: 'America/New_York',
    neighborhoods: [
      { name: 'Decatur',          lat: 33.7748, lng: -84.2963, zip: '30030' },
      { name: 'Sandy Springs',    lat: 33.9304, lng: -84.3733, zip: '30328' },
      { name: 'Marietta',         lat: 33.9526, lng: -84.5499, zip: '30060' },
      { name: 'Alpharetta',       lat: 34.0753, lng: -84.2940, zip: '30009' },
      { name: 'Roswell',          lat: 34.0232, lng: -84.3615, zip: '30075' },
      { name: 'Smyrna',           lat: 33.8839, lng: -84.5143, zip: '30080' },
    ],
    transitRoutes: [
      { name: 'MARTA Red Line',  type: 'rail', frequency: '15 min', coverage: 'North Springs ↔ Airport' },
      { name: 'MARTA Gold Line', type: 'rail', frequency: '15 min', coverage: 'Doraville ↔ Airport' },
    ],
  },
};
