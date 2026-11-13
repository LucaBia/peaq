/** Pure validation rules shared by forms and tests. Server functions enforce the same rules. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isEmail = (v: string) => EMAIL_RE.test(v.trim());

export const isStrongPassword = (v: string) => v.length >= 8 && /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v);

export const USERNAME_RE = /^[a-z0-9_.]{3,20}$/;
export const isValidUsername = (v: string) => USERNAME_RE.test(v);

export function ageOn(dob: string, today = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  let age = today.getFullYear() - y;
  const md = today.getMonth() + 1 - mo || today.getDate() - d;
  if (md < 0) age--;
  return age;
}
export const isAdult = (dob: string, today = new Date()) => {
  const a = ageOn(dob, today);
  return a !== null && a >= 18 && a < 120;
};

export type BibStatus = "available" | "taken" | "reserved" | "invalid";
/** Local range check only; availability is always confirmed by the database. */
export function bibRangeStatus(n: number): BibStatus | null {
  if (!Number.isInteger(n) || n < 1 || n > 9999) return "invalid";
  if (n <= 100) return "reserved";
  return null;
}

/** Plausible pace window: 2:30/km to 10:00/km. */
export function isPlausibleRun(distanceKm: 5 | 10, totalSeconds: number) {
  return totalSeconds >= distanceKm * 150 && totalSeconds <= distanceKm * 600;
}
export const isPlausibleWkg = (v: number) => Number.isFinite(v) && v >= 0.5 && v <= 7.5;
