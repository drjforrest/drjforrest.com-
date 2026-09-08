import { readdir } from "fs/promises";
import path from "path";
import { RadarHandbook } from "@/components/apps/radar-handbook";
import { RadarLoginForm } from "@/components/apps/radar-login-form";
import {
  createCsrfToken,
  isRadarAuthenticated,
  radarAuthConfigured,
} from "@/lib/radar-auth";

export const dynamic = "force-dynamic";

async function latestDmg(): Promise<{ name: string; href: string } | null> {
  const dir = path.join(process.cwd(), "content", "radar-downloads");
  try {
    const files = (await readdir(dir))
      .filter((f) => f.toLowerCase().endsWith(".dmg"))
      .sort()
      .reverse();
    if (!files.length) return null;
    const name = files[0];
    return { name, href: `/apps/radar/downloads/${encodeURIComponent(name)}` };
  } catch {
    return null;
  }
}

export default async function RadarPortalPage() {
  const configured = radarAuthConfigured();
  const authenticated = await isRadarAuthenticated();

  if (!authenticated) {
    const csrf = configured ? createCsrfToken() : "";

    return (
      <div className="lock">
        {!configured ? (
          <main className="lock-card">
            <h1>Radar portal</h1>
            <p className="lede">
              Set <code>RADAR_PORTAL_PASSWORD</code> and{" "}
              <code>RADAR_PORTAL_SECRET</code> in the environment, then reload.
            </p>
          </main>
        ) : (
          <RadarLoginForm csrf={csrf} />
        )}
      </div>
    );
  }

  const dmg = await latestDmg();

  return (
    <div className="radar-portal">
      <RadarHandbook
        dmgName={dmg?.name ?? null}
        dmgHref={dmg?.href ?? null}
      />
    </div>
  );
}
