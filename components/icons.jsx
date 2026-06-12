const ICONS = {
  arrowRight: 'M5 12h13 M13 6l6 6-6 6',
  arrowUpRight: 'M7 17L17 7 M8 7h9v9',
  zap: 'M13 2 4 14h6l-1 8 9-12h-6l1-8z',
  shield: 'M12 3l8 3v5.5c0 4.8-3.4 7.8-8 9-4.6-1.2-8-4.2-8-9V6l8-3z',
  clock: 'M12 7v5l3 2',
  mapPin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z',
  fileText: 'M14 3v5h5 M14 3H6v18h12V8z M9 13h6 M9 17h6',
  trendingUp: 'M3 16l6-6 4 4 8-8 M17 6h4v4',
  pie: 'M12 3a9 9 0 1 0 9 9h-9z M12 3v9',
  wrench: 'M15 6a4 4 0 0 1-5 5L5 16l3 3 5-5a4 4 0 0 0 5-5l-2 2-2-2 2-2z',
  compare: 'M8 4v16 M16 4v16 M4 8h6m-2-3l3 3-3 3 M20 16h-6m2-3l-3 3 3 3',
  download: 'M12 4v11 M8 11l4 4 4-4 M5 20h14',
  building: 'M5 21V5l8-2v18 M13 21V9l6 2v10 M3 21h18 M8 8v0 M8 12v0 M8 16v0',
  home: 'M4 11l8-7 8 7 M6 10v10h12V10',
  euro: 'M16 7a5 6 0 1 0 0 10 M5 10h7 M5 14h6',
  percent: 'M6 6.5h.01 M18 17.5h.01 M18 6L6 18 M5.5 6.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0z M16.5 17.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0z',
  bars: 'M5 20V11 M12 20V5 M19 20v-6 M3 20h18',
  plus: 'M12 5v14 M5 12h14',
  check: 'M5 13l4 4L19 6',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3 M5 11h14v9H5z',
  mail: 'M4 6h16v12H4z M4 7l8 6 8-6',
  sparkles: 'M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-3.5-3.5',
  sliders: 'M4 8h10 M18 8h2 M4 16h2 M10 16h10 M14 5v6 M6 13v6',
  link: 'M9 15l6-6 M10 6l1-1a4 4 0 0 1 6 6l-1 1 M14 18l-1 1a4 4 0 0 1-6-6l1-1',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  layers: 'M12 3l9 5-9 5-9-5 9-5z M3 13l9 5 9-5 M3 17l9 5 9-5',
  x: 'M6 6l12 12 M18 6L6 18',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  message: 'M4 5h16v11H9l-4 3v-3H4z',
  star: 'M12 4l2.3 5 5.4.5-4.1 3.6 1.2 5.3L12 20.7 7.2 23.4l1.2-5.3L4.3 14.5l5.4-.5z',
  building2: 'M4 21V7l7-3v17 M11 21V11l8 3v7 M3 21h18',
  grid: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  ruler: 'M4 8l12 12 4-4L8 4 4 8z M8 8l2 2 M11 11l2 2 M14 14l2 2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M5 20a7 7 0 0 1 14 0',
  bell: 'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6 M10 20a2 2 0 0 0 4 0',
  filter: 'M4 5h16l-6 7v6l-4 2v-8z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  logOut: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
};

export default function Icon({ name, size = 18, stroke = 1.7, color = 'currentColor', fill = 'none', style }) {
  const d = ICONS[name];
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke={color} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      {(d || '').split(' M').map((seg, i) => (
        <path key={i} d={(i ? 'M' : '') + seg} />
      ))}
    </svg>
  );
}
