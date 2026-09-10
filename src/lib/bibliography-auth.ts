import { createHmac, randomBytes, timingSafeEqual, createHash } from "crypto";
import { cookies } from "next/headers";

export const BIBLIOGRAPHY_COOKIE = "bibliography_gate";
export const BIBLIOGRAPHY_URL =
  process.env.BIBLIOGRAPHY_URL || "https://library.drjforrest.com";

const SESSION_DAYS = 7;
const CSRF_MAX_AGE = 60 * 60;

function secret(): string {
  return (
    process.env.BIBLIOGRAPHY_PORTAL_SECRET ||
    process.env.RADAR_PORTAL_SECRET ||
    ""
  );
}

function accessCode(): string {
  return process.env.BIBLIOGRAPHY_ACCESS_CODE || "";
}

export function bibliographyAuthConfigured(): boolean {
  return Boolean(accessCode() && secret());
}

function sign(payload: string): string {
  const digest = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${digest}`;
}

function verifySigned(token: string): string | null {
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  const payload = token.slice(0, idx);
  const digest = token.slice(idx + 1);
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  try {
    const a = Buffer.from(digest, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  return payload;
}

export function createBibliographySessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  const nonce = randomBytes(8).toString("hex");
  return sign(`ok.${exp}.${nonce}`);
}

export function bibliographySessionValid(token: string | undefined | null): boolean {
  if (!token) return false;
  const payload = verifySigned(token);
  if (!payload) return false;
  const parts = payload.split(".");
  if (parts.length < 2 || parts[0] !== "ok") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp)) return false;
  return exp >= Math.floor(Date.now() / 1000);
}

export function checkBibliographyCode(candidate: string): boolean {
  const code = accessCode();
  if (!code) return false;
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(code).digest();
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createBibliographyCsrfToken(): string {
  const exp = Math.floor(Date.now() / 1000) + CSRF_MAX_AGE;
  const nonce = randomBytes(8).toString("hex");
  return sign(`csrf.${exp}.${nonce}`);
}

export function verifyBibliographyCsrfToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const payload = verifySigned(token);
  if (!payload) return false;
  const parts = payload.split(".");
  if (parts.length < 3 || parts[0] !== "csrf") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp)) return false;
  return exp >= Math.floor(Date.now() / 1000);
}

export async function isBibliographyAuthenticated(): Promise<boolean> {
  if (!bibliographyAuthConfigured()) return false;
  const jar = await cookies();
  return bibliographySessionValid(jar.get(BIBLIOGRAPHY_COOKIE)?.value);
}

export function bibliographySecureCookie(): boolean {
  return (
    process.env.BIBLIOGRAPHY_PORTAL_SECURE === "1" ||
    process.env.RADAR_PORTAL_SECURE === "1" ||
    process.env.NODE_ENV === "production"
  );
}
