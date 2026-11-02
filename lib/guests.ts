import guestsData from "./guests.json";

export type Guest = { code: string; name: string; companions: number };

export const SITE_URL = "https://joseymar-xv.vercel.app";

const guests: Guest[] = guestsData;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function getGuests() {
  return guests;
}

export function getGuest(code: string) {
  if (!UUID_RE.test(code)) return undefined;
  const normalized = code.toLowerCase();
  return guests.find((g) => g.code === normalized);
}

export function companionsLabel(n: number) {
  if (n === 0) return "Sin acompañantes";
  return `${n} ${n === 1 ? "acompañante" : "acompañantes"}`;
}
