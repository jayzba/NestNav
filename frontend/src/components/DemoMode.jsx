import { useState, useEffect, useCallback } from 'react';
import { CITIES } from '../data/mockData';

// ============================================================
// DemoMode — Automated hackathon walkthrough
// Cycles through: city select → housing → map → traffic
// ============================================================
const DEMO_STEPS = [
  { cityId: 'austin',    section: '#housing', label: 'Austin, TX — Housing' },
  { cityId: 'austin',    section: '#map',     label: 'Austin — Neighborhood Map' },
  { cityId: 'austin',    section: '#traffic', label: 'Austin — Live Traffic' },
  { cityId: 'chicago',   section: '#housing', label: 'Chicago, IL — Housing' },
  { cityId: 'chicago',   section: '#map',     label: 'Chicago — Neighborhood Map' },
  { cityId: 'boston',    section: '#housing', label: 'Boston, MA — Housing' },
  { cityId: 'boston',    section: '#traffic', label: 'Boston — Live Traffic' },
  { cityId: 'newyork',   section: '#map',     label: 'New York — Neighborhood Map' },
];

export default function DemoMode({ onCitySelect }) {
  const [running, setRunning] = useState(false);
  const [step, setStep]       = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [countdown, setCountdown] = useState(4);

  const runStep = useCallback((stepIdx) => {
    const s = DEMO_STEPS[stepIdx];
    if (!s) { setRunning(false); setStep(0); return; }
    onCitySelect(s.cityId);
    setTimeout(() => {
      document.querySelector(s.section)?.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  }, [onCitySelect]);

  useEffect(() => {
    if (!running) return;
    runStep(step);
    const interval = setInterval(() => {
      setStep(prev => {
        const next = prev + 1;
        if (next >= DEMO_STEPS.length) {
          setRunning(false);
          clearInterval(interval);
          return 0;
        }
        runStep(next);
        return next;
      });
      setCountdown(4);
    }, 4000);

    const countInterval = setInterval(() => {
      setCountdown(c => Math.max(0, c - 1));
    }, 1000);

    return () => { clearInterval(interval); clearInterval(countInterval); };
  }, [running]);

  if (dismissed) return null;

  return (
    <div className="demo-banner" role="complementary" aria-label="Demo mode panel">
      <div className="demo-banner-title">
        🎬 Demo Mode
        {running && (
          <span style={{
            marginLeft: 'auto',
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: '0.7rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '100px',
          }}>
            {step + 1}/{DEMO_STEPS.length}
          </span>
        )}
      </div>
      <p className="demo-banner-text">
        {running
          ? `→ ${DEMO_STEPS[step]?.label} (next in ${countdown}s)`
          : 'Run an automated walkthrough for hackathon judges.'}
      </p>
      <div className="demo-controls">
        {running ? (
          <button id="demo-stop-btn" className="demo-btn" onClick={() => { setRunning(false); setStep(0); }}>
            ⏹ Stop
          </button>
        ) : (
          <>
            <button id="demo-start-btn" className="demo-btn primary" onClick={() => { setStep(0); setCountdown(4); setRunning(true); }}>
              ▶ Start Demo
            </button>
            <button id="demo-dismiss-btn" className="demo-btn" onClick={() => setDismissed(true)}>
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  );
}
