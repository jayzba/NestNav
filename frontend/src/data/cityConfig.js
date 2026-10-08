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
};
