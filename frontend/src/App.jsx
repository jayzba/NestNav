import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import HousingSection from './components/HousingSection.jsx';
import MapSection from './components/MapSection.jsx';
import TrafficSection from './components/TrafficSection.jsx';
import DemoMode from './components/DemoMode.jsx';

export default function App() {
  const [cityId, setCityId]                     = useState(null);
  const [selectedNeighborhood, setNeighborhood] = useState(null);
  const [activeSection, setActiveSection]       = useState('hero');

  // Highlight active nav link based on scroll position
  useEffect(() => {
    const sections = ['hero', 'housing', 'map', 'traffic'];
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleCitySelect = (id) => {
    setCityId(id);
    setNeighborhood(null);
  };

  return (
    <>
      {/* Ambient background orbs */}
      <div className="bg-gradient-orb bg-gradient-orb-1" aria-hidden="true" />
      <div className="bg-gradient-orb bg-gradient-orb-2" aria-hidden="true" />

      <Navbar activeSection={activeSection} />

      <main>
        <Hero onCitySelect={handleCitySelect} selectedCity={cityId} />
        <HousingSection cityId={cityId} />
        <MapSection
          cityId={cityId}
          selectedNeighborhood={selectedNeighborhood}
          onNeighborhoodSelect={setNeighborhood}
        />
        <TrafficSection cityId={cityId} />
      </main>

      <footer className="footer">
        <div>
          <strong style={{ color: 'var(--color-text-secondary)' }}>NestNav</strong> — Built for ImpactHack 2026
        </div>
        <div className="footer-disclaimer">
          This product uses the HUD User Data API but is not endorsed or certified by HUD User.
          Transit data is for demonstration purposes only.
        </div>
      </footer>

      <DemoMode onCitySelect={handleCitySelect} />
    </>
  );
}
