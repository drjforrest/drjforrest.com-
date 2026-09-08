import { createHmac, randomBytes, timingSafeEqual, createHash } from "crypto";
import { cookies } from "next/headers";

export const RADAR_COOKIE = "radar_gate";
const SESSION_DAYS = 7;
const CSRF_MAX_AGE = 60 * 60;

function secret(): string {
  return process.env.RADAR_PORTAL_SECRET || "";
}

function password(): string {
  return process.env.RADAR_PORTAL_PASSWORD || "";
}

export function radarAuthConfigured(): boolean {
  const pwd = password();
  const sec = secret();
  return Boolean(
    pwd &&
      sec &&
      pwd !== "change-me-before-deploy" &&
      sec !== "change-me-to-a-long-random-string"
  );
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

export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  const nonce = randomBytes(8).toString("hex");
  return sign(`ok.${exp}.${nonce}`);
}

export function sessionValid(token: string | undefined | null): boolean {
  if (!token) return false;
  const payload = verifySigned(token);
  if (!payload) return false;
  const parts = payload.split(".");
  if (parts.length < 2 || parts[0] !== "ok") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp)) return false;
  return exp >= Math.floor(Date.now() / 1000);
}

export function checkPassword(candidate: string): boolean {
  const pwd = password();
  if (!pwd) return false;
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(pwd).digest();
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Stateless CSRF token (signed timestamp + nonce). */
export function createCsrfToken(): string {
  const exp = Math.floor(Date.now() / 1000) + CSRF_MAX_AGE;
  const nonce = randomBytes(8).toString("hex");
  return sign(`csrf.${exp}.${nonce}`);
}

export function verifyCsrfToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const payload = verifySigned(token);
  if (!payload) return false;
  const parts = payload.split(".");
  if (parts.length < 3 || parts[0] !== "csrf") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp)) return false;
  return exp >= Math.floor(Date.now() / 1000);
}

export async function isRadarAuthenticated(): Promise<boolean> {
  if (!radarAuthConfigured()) return false;
  const jar = await cookies();
  return sessionValid(jar.get(RADAR_COOKIE)?.value);
}

export function secureCookie(): boolean {
  return process.env.RADAR_PORTAL_SECURE === "1" || process.env.NODE_ENV === "production";
}
