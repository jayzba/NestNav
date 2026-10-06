import { useState } from 'react';
import { CITIES } from '../data/mockData';

export default function Hero({ onCitySelect, selectedCity }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length < 2) { setSuggestions([]); return; }
    setSuggestions(
      CITIES.filter(c => c.name.toLowerCase().includes(val.toLowerCase()))
    );
  };

  const handleSelect = (city) => {
    setQuery(city.name);
    setSuggestions([]);
    // App scrolls to the housing section once its data has finished loading
    onCitySelect(city.id, { scroll: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) handleSelect(suggestions[0]);
    else if (CITIES.find(c => c.name.toLowerCase() === query.toLowerCase())) {
      const city = CITIES.find(c => c.name.toLowerCase() === query.toLowerCase());
      handleSelect(city);
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span>🎓</span> Built for University Students
        </div>

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
              onChange={handleInput}
              autoComplete="off"
              aria-label="Search for a city"
              aria-autocomplete="list"
              aria-expanded={suggestions.length > 0}
            />
            {suggestions.length > 0 && (
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
                  overflow: 'hidden',
                  zIndex: 50,
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                {suggestions.map(city => (
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

        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Try: Austin, TX · Chicago, IL · Boston, MA · Seattle, WA
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-number">6</div>
            <div className="hero-stat-label">Major Cities</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">36+</div>
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
