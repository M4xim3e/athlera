// src/components/ui/Icons.jsx
// 28 icônes SVG custom — monoline, rounded
// Usage : <Icons.dumbbell size={20} color="var(--acc)" />

const Icon = ({ d, size = 20, color = 'currentColor', strokeWidth = 1.7, style = {} }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke={color} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, transition: 'all .18s', ...style }}
  >
    {d}
  </svg>
)

const paths = {
  logo:      <><path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/><path d="M12 22V12"/><path d="M4 7l8 5 8-5"/></>,
  sun:       <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
  moon:      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
  globe:     <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12 15.3 15.3 0 0 1 12 2z"/></>,
  menu:      <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  x:         <path d="M18 6L6 18M6 6l12 12"/>,
  user:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  dumbbell:  <><line x1="6.5" y1="5" x2="6.5" y2="19"/><line x1="17.5" y1="5" x2="17.5" y2="19"/><line x1="6.5" y1="12" x2="17.5" y2="12"/><rect x="2" y="9" width="5" height="6" rx="1.5"/><rect x="17" y="9" width="5" height="6" rx="1.5"/></>,
  timer:     <><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M8.5 2.5h7M12 2.5v2"/></>,
  flame:     <path d="M8.5 14.5A4.5 4.5 0 0 0 12 19a4.5 4.5 0 0 0 4-2.5c1-2 .5-4-.5-5.5-.5 1-1.5 2-2.5 2-.5-2-1.5-4-.5-7-2 1.5-4 4-4 8z"/>,
  bolt:      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  target:    <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
  replace:   <><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"/></>,
  chevDown:  <polyline points="6 9 12 15 18 9"/>,
  chevUp:    <polyline points="18 15 12 9 6 15"/>,
  chevRight: <polyline points="9 18 15 12 9 6"/>,
  chevLeft:  <polyline points="15 18 9 12 15 6"/>,
  check:     <polyline points="20 6 9 17 4 12"/>,
  plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  pin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  activity:  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
  calendar:  <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  eyeOff:    <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
  edit:      <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  lock:      <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  trending:  <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  scale:     <><path d="M6 20h12M3 4l9 16L21 4"/></>,
  info:      <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
}

const Icons = {}
Object.keys(paths).forEach(name => {
  Icons[name] = (props) => <Icon d={paths[name]} {...props} />
})

export default Icons