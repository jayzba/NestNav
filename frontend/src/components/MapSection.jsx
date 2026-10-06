import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useHousingData, CITIES } from '../hooks/useHousingData';
import { UNITS } from '../data/units';

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

export default function MapSection({ cityId, unit, onUnitChange, onNeighborhoodSelect, selectedNeighborhood }) {
  const { data, loading } = useHousingData(cityId);
  const city = CITIES.find(c => c.id === cityId);
  const [filter, setFilter] = useState('all');
  const [showTraffic, setShowTraffic] = useState(true);
  // navigation-night-v1 renders Mapbox's live traffic colors; dark-v11 is the traffic-free equivalent
  const mapStyle = showTraffic ? 'navigation-night-v1' : 'dark-v11';
  const unitLabel = UNITS.find(u => u.key === unit)?.label ?? '1 Bedroom';

  // Resolve each neighborhood's rent + affordability for the selected apartment size
  const neighborhoods = (data?.neighborhoods ?? [])
    .map(n => ({ ...n, rent: n.rents[unit], affordability: n.affordability[unit] }))
    .filter(n => filter === 'all' ? true : n.affordability === filter);

  return (
    <section id="map" className="section map-section">
      <div className="section-inner">
        <p className="section-label">🗺️ Interactive Map Explorer</p>
        <h2 className="section-title">Neighborhood Affordability Map</h2>
        <p className="section-subtitle">
          Click any dot to see rent details. Colors compare each neighborhood's HUD {unitLabel.toLowerCase()} rent to the metro average.
        </p>

        <div className="map-wrapper">
          {/* Sidebar */}
          <aside className="map-sidebar">
            {/* Apartment size (synced with the bar chart in the housing section) */}
            <div className="card">
              <div className="map-filter-group">
                <span className="map-filter-label">Apartment Size</span>
                <div className="toggle-group">
                  {UNITS.map(u => (
                    <button
                      key={u.key}
                      id={`unit-${u.key}`}
                      className={`toggle-btn ${unit === u.key ? 'active' : ''}`}
                      onClick={() => onUnitChange(u.key)}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

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

            {/* Traffic Layer */}
            <div className="card">
              <div className="map-filter-group">
                <span className="map-filter-label">Live Traffic</span>
                <div className="toggle-group">
                  {[{ id: 'on', label: 'On', value: true }, { id: 'off', label: 'Off', value: false }].map(o => (
                    <button
                      key={o.id}
                      id={`traffic-${o.id}`}
                      className={`toggle-btn ${showTraffic === o.value ? 'active' : ''}`}
                      onClick={() => setShowTraffic(o.value)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="card">
              <span className="map-filter-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Legend</span>
              <div className="map-legend">
                <div className="legend-item"><div className="legend-dot" style={{ background: AFFORD_COLOR }} />Affordable (&gt;10% below metro avg.)</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: MODERATE_COLOR }} />Moderate (within 10%)</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: EXPENSIVE_COLOR }} />Expensive (&gt;10% above metro avg.)</div>
                {showTraffic && (
                  <>
                    <div className="legend-item" style={{ marginTop: '0.5rem' }}><div className="legend-dot" style={{ background: '#4ade80' }} />Traffic: flowing</div>
                    <div className="legend-item"><div className="legend-dot" style={{ background: '#fb923c' }} />Traffic: moderate</div>
                    <div className="legend-item"><div className="legend-dot" style={{ background: '#ef4444' }} />Traffic: heavy / severe</div>
                  </>
                )}
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
              {data && !data.hasZipData && (
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
                  HUD doesn't publish ZIP-level rents for this metro, so every neighborhood shows the metro-wide 1-bedroom FMR.
                </p>
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
              {/* Mapbox Dark Theme (navigation style includes live traffic) */}
              <TileLayer
                key={mapStyle}
                url={`https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`}
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
                      <span style={{ color: '#666', fontSize: '0.82rem' }}>HUD {unitLabel} Fair Market Rent{n.isZipLevel ? ' (ZIP)' : ' (metro)'}</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: colorFor(n.affordability) }}>
                        ${n.rent.toLocaleString()}/mo
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        Affordability Score (1-BR): <strong>{n.score}/100</strong>
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
