"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  RADAR_COOKIE,
  checkPassword,
  createSessionToken,
  radarAuthConfigured,
  secureCookie,
  verifyCsrfToken,
} from "@/lib/radar-auth";

type LoginState = { error?: string };

export async function loginRadar(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!radarAuthConfigured()) {
    return {
      error: "Portal is not configured. Set RADAR_PORTAL_PASSWORD and RADAR_PORTAL_SECRET.",
    };
  }

  const csrfField = String(formData.get("csrf") || "");
  if (!verifyCsrfToken(csrfField)) {
    return { error: "Session expired. Refresh and try again." };
  }

  const password = String(formData.get("password") || "");
  if (!checkPassword(password)) {
    return { error: "That access code is not valid." };
  }

  const jar = await cookies();
  jar.set(RADAR_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookie(),
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  redirect("/apps/radar");
}

export async function logoutRadar(): Promise<void> {
  const jar = await cookies();
  jar.delete(RADAR_COOKIE);
  redirect("/apps/radar");
}
