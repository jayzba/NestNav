import { useState } from 'react';
import { CITIES } from '../data/cities';

export default function Hero({ onCitySelect, selectedCity }) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const displayedCities = CITIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (city) => {
    setQuery(city.name);
    setShowDropdown(false);
    // App scrolls to the housing section once its data has finished loading
    onCitySelect(city.id, { scroll: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (displayedCities.length > 0) handleSelect(displayedCities[0]);
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-content">

        <h1 className="hero-title">
          Find Where to Live.<br />
          <span>Without the Stress.</span>
        </h1>

        <p className="hero-subtitle">
          NestNav combines government housing cost data with real-time transit information so you can compare neighborhoods on what actually matters: rent and your commute.
        </p>

        <form className="hero-search-bar" onSubmit={handleSearch} style={{ position: 'relative' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              id="city-search-input"
              type="text"
              className="hero-search-input"
              placeholder="Search a city (e.g. Austin, TX)"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              autoComplete="off"
              aria-label="Search for a city"
              aria-autocomplete="list"
              aria-expanded={showDropdown && displayedCities.length > 0}
            />
            {showDropdown && displayedCities.length > 0 && (
              <ul
                role="listbox"
                aria-label="City suggestions"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0, right: 0,
                  marginTop: '0.4rem',
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border-glow)',
                  borderRadius: 'var(--radius-md)',
                  listStyle: 'none',
                  overflow: 'auto',
                  maxHeight: '220px',
                  zIndex: 50,
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                {displayedCities.map(city => (
                  <li key={city.id}>
                    <button
                      type="button"
                      role="option"
                      onClick={() => handleSelect(city)}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.92rem',
                        padding: '0.75rem 1.2rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(78,141,245,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      📍 {city.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button id="hero-search-btn" type="submit" className="btn-primary">
            Explore →
          </button>
        </form>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-number">{CITIES.length}</div>
            <div className="hero-stat-label">Major Cities</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">24+</div>
            <div className="hero-stat-label">Neighborhoods</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">Live</div>
            <div className="hero-stat-label">Transit Data</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">Free</div>
            <div className="hero-stat-label">Always Free</div>
          </div>
        </div>
      </div>
    </section>
  );
}
