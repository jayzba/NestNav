// Apartment sizes reported by HUD Fair Market Rents.
// `color` is the bar-chart fill, `line` the trend-line color.
export const UNITS = [
  { key: 'studio',   label: 'Studio',    color: 'rgba(78,141,245,0.7)',  line: '#4e8df5' },
  { key: 'oneBed',   label: '1 Bedroom', color: 'rgba(124,110,247,0.7)', line: '#7c6ef7' },
  { key: 'twoBed',   label: '2 Bedroom', color: 'rgba(52,211,153,0.7)',  line: '#34d399' },
  { key: 'threeBed', label: '3 Bedroom', color: 'rgba(251,191,36,0.7)',  line: '#fbbf24' },
];

export const UNIT_KEYS = UNITS.map(u => u.key);
