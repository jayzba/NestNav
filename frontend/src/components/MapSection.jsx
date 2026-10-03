import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useHousingData, CITIES } from '../hooks/useHousingData';

const AFFORD_COLOR = '#34d399';
const MODERATE_COLOR = '#fbbf24';
const EXPENSIVE_COLOR = '#f87171';

function colorFor(affordability) {
  if (affordability === 'affordable') return AFFORD_COLOR;
  if (affordability === 'moderate')   return MODERATE_COLOR;
  return EXPENSIVE_COLOR;
}

// Re-centers map when city changes
function MapFlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 12, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function MapSection({ cityId, onNeighborhoodSelect, selectedNeighborhood }) {
  const { data, loading } = useHousingData(cityId);
  const city = CITIES.find(c => c.id === cityId);
  const [filter, setFilter] = useState('all');

  const neighborhoods = data?.neighborhoods?.filter(n =>
    filter === 'all' ? true : n.affordability === filter
  ) ?? [];

  return (
    <section id="map" className="section map-section">
      <div className="section-inner">
        <p className="section-label">🗺️ Interactive Map Explorer</p>
        <h2 className="section-title">Neighborhood Affordability Map</h2>
        <p className="section-subtitle">
          Click any dot to see rent details. Colors indicate affordability level.
        </p>

        <div className="map-wrapper">
          {/* Sidebar */}
          <aside className="map-sidebar">
            {/* Filters */}
            <div className="card">
              <div className="map-filter-group">
                <span className="map-filter-label">Filter by Cost</span>
                <div className="toggle-group">
                  {['all','affordable','moderate','expensive'].map(f => (
                    <button
                      key={f}
                      id={`filter-${f}`}
                      className={`toggle-btn ${filter === f ? 'active' : ''}`}
                      onClick={() => setFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="card">
              <span className="map-filter-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Legend</span>
              <div className="map-legend">
                <div className="legend-item"><div className="legend-dot" style={{ background: AFFORD_COLOR }} />Affordable (&lt; $1,500)</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: MODERATE_COLOR }} />Moderate ($1,500–$2,200)</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: EXPENSIVE_COLOR }} />Expensive (&gt; $2,200)</div>
              </div>
            </div>

            {/* Neighborhood List */}
            <div className="card" style={{ flex: 1 }}>
              <span className="map-filter-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                Neighborhoods {cityId ? `(${neighborhoods.length})` : ''}
              </span>
              {!cityId ? (
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Search for a city to see neighborhoods.</p>
              ) : loading ? (
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Loading…</p>
              ) : (
                <div className="neighborhood-list">
                  {neighborhoods.map((n, i) => (
                    <div
                      key={i}
                      id={`neighborhood-${n.name.replace(/\s+/g,'-').toLowerCase()}`}
                      className={`neighborhood-item ${selectedNeighborhood === n.name ? 'selected' : ''}`}
                      onClick={() => onNeighborhoodSelect(n.name)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && onNeighborhoodSelect(n.name)}
                    >
                      <span className="neighborhood-name">{n.name}</span>
                      <span className={`neighborhood-badge badge-${n.affordability}`}>
                        ${n.rent.toLocaleString()}/mo
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Map */}
          <div className="map-container" style={{ minHeight: 420 }}>
            <MapContainer
              center={city ? [city.lat, city.lng] : [39.5, -98.35]}
              zoom={city ? 12 : 4}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              {/* Mapbox Dark Theme */}
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`}
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
              />
              {city && <MapFlyTo center={[city.lat, city.lng]} />}

              {neighborhoods.map((n, i) => (
                <CircleMarker
                  key={i}
                  center={[n.lat, n.lng]}
                  radius={selectedNeighborhood === n.name ? 18 : 13}
                  pathOptions={{
                    color: colorFor(n.affordability),
                    fillColor: colorFor(n.affordability),
                    fillOpacity: 0.75,
                    weight: selectedNeighborhood === n.name ? 3 : 1.5,
                  }}
                  eventHandlers={{ click: () => onNeighborhoodSelect(n.name) }}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 180 }}>
                      <strong style={{ fontSize: '0.95rem' }}>{n.name}</strong><br />
                      <span style={{ color: '#666', fontSize: '0.82rem' }}>Avg. Rent</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: colorFor(n.affordability) }}>
                        ${n.rent.toLocaleString()}/mo
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        Affordability Score: <strong>{n.score}/100</strong>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
