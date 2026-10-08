import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import HousingSection from './components/HousingSection.jsx';
import MapSection from './components/MapSection.jsx';
import TrafficSection from './components/TrafficSection.jsx';

export default function App() {
  const [cityId, setCityId]                     = useState(null);
  const [selectedNeighborhood, setNeighborhood] = useState(null);
  const [activeSection, setActiveSection]       = useState('hero');
  const [unit, setUnit]                           = useState('oneBed'); // apartment size shown in charts + map
  const cityIdRef                                = useRef(null);
  const pendingScroll                            = useRef(false);

  const scrollToHousing = () =>
    document.getElementById('housing')?.scrollIntoView({ behavior: 'smooth' });

  // Highlight active nav link based on scroll position
  useEffect(() => {
    // Force page to load at the very top on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    
    // Clear any lingering #hash from the URL
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

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

  // `scroll: true` (search bar) defers the scroll until HousingSection reports
  // its data has loaded, so the layout has stopped growing before we scroll.
  const handleCitySelect = (id, { scroll = false } = {}) => {
    if (scroll && id === cityIdRef.current) {
      scrollToHousing(); // same city re-selected: data is already on screen
    } else {
      pendingScroll.current = scroll;
    }
    cityIdRef.current = id;
    setCityId(id);
    setNeighborhood(null);
  };

  const handleHousingReady = () => {
    if (!pendingScroll.current) return;
    pendingScroll.current = false;
    scrollToHousing();
  };

  return (
    <>
      {/* Ambient background orbs */}
      <div className="bg-gradient-orb bg-gradient-orb-1" aria-hidden="true" />
      <div className="bg-gradient-orb bg-gradient-orb-2" aria-hidden="true" />

      <Navbar activeSection={activeSection} />

      <main>
        <Hero onCitySelect={handleCitySelect} selectedCity={cityId} />
        <HousingSection cityId={cityId} onReady={handleHousingReady} unit={unit} onUnitChange={setUnit} />
        <MapSection
          cityId={cityId}
          unit={unit}
          onUnitChange={setUnit}
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
    </>
  );
}
