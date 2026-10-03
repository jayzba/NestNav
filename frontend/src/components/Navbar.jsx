import { useState, useEffect } from 'react';

export default function Navbar({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.5)' : 'none' }}>
      <a href="#hero" className="navbar-brand" aria-label="NestNav home">
        <div className="navbar-logo-icon" aria-hidden="true">🏠</div>
        <span className="navbar-brand-text">NestNav</span>
      </a>

      <ul className="navbar-links" role="list">
        <li><a href="#hero"    className={`navbar-link ${activeSection === 'hero'    ? 'active' : ''}`}>Home</a></li>
        <li><a href="#housing" className={`navbar-link ${activeSection === 'housing' ? 'active' : ''}`}>Housing Cost</a></li>
        <li><a href="#map"     className={`navbar-link ${activeSection === 'map'     ? 'active' : ''}`}>Map Explorer</a></li>
        <li><a href="#traffic" className={`navbar-link ${activeSection === 'traffic' ? 'active' : ''}`}>Live Traffic</a></li>
        <li>
          <a
            href="#housing"
            className="navbar-link navbar-cta"
            id="navbar-explore-btn"
          >
            Explore Now
          </a>
        </li>
      </ul>
    </nav>
  );
}
