import { useEffect, useState } from "react";

// the offers reset at midnight every day
export const SALE_END = new Date("2026-11-09T23:59:59+05:30").getTime();
export const pad = (n) => String(n).padStart(2, "0");

export default function useCountdown(end = SALE_END) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.max(0, Math.floor((end - now) / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
