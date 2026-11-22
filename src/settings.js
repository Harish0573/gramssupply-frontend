// Website-wide settings kept on this device. Applied once at start-up (see main.jsx).
const KEY = "gs_settings";
export const defaults = { zoom: 1, offers: true, orderUpdates: true, reduceMotion: false };
export const getSettings = () => { try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return { ...defaults }; } };
export function applySettings(s = getSettings()) {
  document.body.style.zoom = s.zoom === 1 ? "" : s.zoom;
  document.documentElement.classList.toggle("reduce-motion", !!s.reduceMotion);
}
export function saveSettings(next) { localStorage.setItem(KEY, JSON.stringify(next)); applySettings(next); return next; }
applySettings();
