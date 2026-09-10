"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  BIBLIOGRAPHY_COOKIE,
  bibliographyAuthConfigured,
  bibliographySecureCookie,
  checkBibliographyCode,
  createBibliographySessionToken,
  verifyBibliographyCsrfToken,
} from "@/lib/bibliography-auth";

type LoginState = { error?: string };

export async function loginBibliography(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!bibliographyAuthConfigured()) {
    return {
      error: "Portal is not configured. Set BIBLIOGRAPHY_ACCESS_CODE.",
    };
  }

  const csrfField = String(formData.get("csrf") || "");
  if (!verifyBibliographyCsrfToken(csrfField)) {
    return { error: "Session expired. Refresh and try again." };
  }

  const code = String(formData.get("code") || "");
  if (!checkBibliographyCode(code)) {
    return { error: "That access code is not valid." };
  }

  const jar = await cookies();
  jar.set(BIBLIOGRAPHY_COOKIE, createBibliographySessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: bibliographySecureCookie(),
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  redirect("/apps/bibliography");
}

export async function logoutBibliography(): Promise<void> {
  const jar = await cookies();
  jar.delete(BIBLIOGRAPHY_COOKIE);
  redirect("/apps/bibliography");
}
