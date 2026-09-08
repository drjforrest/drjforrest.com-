import Link from "next/link";
import { logoutRadar } from "@/app/apps/radar/actions";
import content from "@/lib/radar-content.json";

const IMG = "/apps/radar/img";

function PlatformIcons({ names }: { names: string[] }) {
  return (
    <div className="platforms" aria-hidden="true">
      {names.map((name) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={name} src={`${IMG}/${name}.png`} alt="" />
      ))}
    </div>
  );
}

export function RadarHandbook({
  dmgName,
  dmgHref,
}: {
  dmgName: string | null;
  dmgHref: string | null;
}) {
  return (
    <>
      <header className="top">
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/logo-no-name.png`} alt="" />
          <div>
            <strong>RADAR</strong>
            <span>Internal distribution</span>
          </div>
        </div>
        <div className="top-actions">
          <a className="btn btn-primary" href="#download">
            Download
          </a>
          <form action={logoutRadar}>
            <button className="btn btn-ghost" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="wrap">
        <div className="hero">
          <div>
            <p className="kicker">Social signal · v{content.version}</p>
            <h1>Install Radar, add your keys, start listening.</h1>
            <p className="lede">
              Radar is a Mac app that watches topics you care about across social
              platforms and the web, groups what it finds into themes, and can email
              you a digest. Everything below is written for a first-time install — no
              terminal required.
            </p>
            <p className="lede" style={{ marginTop: "0.6rem" }}>
              {content.buildLabel}
            </p>
            {content.notes ? <p className="lede">{content.notes}</p> : null}
            <nav className="toc" aria-label="On this page">
              <a href="#download">Download</a>
              <a href="#keys">API keys</a>
              <a href="#install">Install</a>
              <a href="#use">Using the app</a>
            </nav>
          </div>
          <div id="download">
            <div className="panel download-card">
              <p className="kicker">Installer</p>
              <h2 style={{ marginTop: "0.35rem" }}>macOS disk image</h2>
              {dmgHref && dmgName ? (
                <>
                  <p className="lede" style={{ margin: "0.6rem 0 1rem" }}>
                    Latest build: <code>{dmgName}</code>
                  </p>
                  <a className="btn btn-primary" href={dmgHref}>
                    Download .dmg
                  </a>
                </>
              ) : (
                <p className="lede" style={{ margin: "0.6rem 0 0" }}>
                  No installer is on the server yet. Drop a <code>.dmg</code> into{" "}
                  <code>content/radar-downloads/</code> and refresh.
                </p>
              )}
            </div>
          </div>
        </div>

        <section className="block" id="keys">
          <p className="kicker">Credentials</p>
          <h2>Get your API keys</h2>
          <p className="lede">
            Radar does not come with vendor accounts. You create a couple of free (or
            cheap) accounts, copy a secret string from each site, and paste those
            strings into Radar → Settings. Keys stay on your Mac.
          </p>
          <p className="lede">
            You need <strong>two things</strong> to start, and one optional extra.
          </p>

          <div className="req-grid" style={{ marginTop: "1.2rem" }}>
            <article className="key-card">
              <span className="pill need">Required</span>
              <h3>1. OpenRouter</h3>
              <p className="lede" style={{ margin: "0 0 0.5rem", fontSize: "0.92rem" }}>
                This is how Radar uses AI to sort posts and write reports. One account
                covers Grok, DeepSeek, and the other models Radar offers.
              </p>
              <ol className="plain">
                <li>
                  Open{" "}
                  <a href="https://openrouter.ai/" rel="noreferrer" target="_blank">
                    openrouter.ai
                  </a>{" "}
                  and create an account.
                </li>
                <li>
                  Go to{" "}
                  <a href="https://openrouter.ai/keys" rel="noreferrer" target="_blank">
                    Keys
                  </a>{" "}
                  and click Create Key.
                </li>
                <li>Copy it immediately — the full key is shown only once.</li>
                <li>Add a little credit (a few dollars is enough to try the app).</li>
                <li>In Radar, open Settings, paste it under OpenRouter, then Save.</li>
              </ol>
              <a
                className="btn btn-primary"
                href="https://openrouter.ai/keys"
                rel="noreferrer"
                target="_blank"
              >
                Open Keys
              </a>
            </article>

            <article className="key-card">
              <span className="pill optional">Optional</span>
              <h3>3. serper.dev</h3>
              <PlatformIcons names={["google-icon"]} />
              <p className="lede" style={{ margin: "0 0 0.5rem", fontSize: "0.92rem" }}>
                Google web and news search for blogs and articles. Skip this if you only
                want social platforms.
              </p>
              <ol className="plain">
                <li>
                  Sign up at{" "}
                  <a href="https://serper.dev" rel="noreferrer" target="_blank">
                    serper.dev
                  </a>
                  .
                </li>
                <li>
                  Open the{" "}
                  <a href="https://serper.dev/dashboard" rel="noreferrer" target="_blank">
                    dashboard
                  </a>{" "}
                  and copy the API key.
                </li>
                <li>Paste it in Radar → Settings → serper.dev, then Save.</li>
              </ol>
              <a
                className="btn btn-ghost"
                href="https://serper.dev/dashboard"
                rel="noreferrer"
                target="_blank"
              >
                Open dashboard
              </a>
            </article>

            <article className="key-card choice span-2">
              <span className="pill need">Required — pick one</span>
              <h3>2. Social search</h3>
              <p className="lede" style={{ margin: 0, fontSize: "0.92rem" }}>
                Radar needs <strong>one</strong> of API Direct, AnyAPI, or XPoz to search
                social platforms. One is enough.
              </p>

              <div className="or-row" aria-hidden="true">
                start here if you are new
              </div>

              <h3 style={{ marginTop: 0 }}>API Direct — no monthly fee</h3>
              <PlatformIcons
                names={[
                  "reddit",
                  "twitter",
                  "youtube",
                  "facebook",
                  "instagram",
                  "tiktok",
                  "threads",
                  "google-icon",
                ]}
              />
              <p className="lede" style={{ margin: "0 0 0.4rem", fontSize: "0.92rem" }}>
                Pay as you go. One key covers Reddit, X, Threads, YouTube, Facebook,
                TikTok, Instagram, and Google web search. First 50 requests per platform
                each month are free.
              </p>
              <ol className="plain">
                <li>
                  Create an account at{" "}
                  <a href="https://apidirect.io/signup" rel="noreferrer" target="_blank">
                    apidirect.io/signup
                  </a>
                  .
                </li>
                <li>Open Dashboard → API Keys and create a key.</li>
                <li>
                  Copy the value that starts with <code>ak_live_</code>.
                </li>
                <li>Paste it in Radar → Settings → API Direct, then Save.</li>
              </ol>
              <p>
                <a
                  className="btn btn-primary"
                  href="https://apidirect.io/signup"
                  rel="noreferrer"
                  target="_blank"
                >
                  Create API Direct account
                </a>
              </p>

              <div className="or-row">or</div>

              <h3>AnyAPI — no monthly fee</h3>
              <PlatformIcons
                names={[
                  "reddit",
                  "twitter",
                  "youtube",
                  "facebook",
                  "instagram",
                  "tiktok",
                  "threads",
                  "google-icon",
                  "linkedin",
                  "hackernews",
                ]}
              />
              <p className="lede" style={{ margin: "0 0 0.4rem", fontSize: "0.92rem" }}>
                Same core platforms as API Direct, plus LinkedIn public post search and
                Hacker News.
              </p>
              <ol className="plain">
                <li>
                  Create an account at{" "}
                  <a href="https://getanyapi.com" rel="noreferrer" target="_blank">
                    getanyapi.com
                  </a>
                  .
                </li>
                <li>
                  Open{" "}
                  <a
                    href="https://getanyapi.com/dashboard/keys"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Dashboard → Keys
                  </a>{" "}
                  and create a key.
                </li>
                <li>
                  Copy the value that starts with <code>aa_live_</code>.
                </li>
                <li>Paste it in Radar → Settings → AnyAPI, then Save.</li>
              </ol>

              <div className="or-row">or</div>

              <h3>XPoz — monthly credit plan</h3>
              <PlatformIcons names={["twitter", "instagram", "reddit", "tiktok"]} />
              <p className="lede" style={{ margin: "0 0 0.4rem", fontSize: "0.92rem" }}>
                Better if you already pay for XPoz Pro. Covers X, Instagram, Reddit, and
                TikTok.
              </p>
              <ol className="plain">
                <li>
                  Create an account at{" "}
                  <a href="https://xpoz.ai/get-token" rel="noreferrer" target="_blank">
                    xpoz.ai
                  </a>
                  .
                </li>
                <li>Copy your access key.</li>
                <li>Paste it in Radar → Settings → XPoz, then Save.</li>
              </ol>
            </article>
          </div>
        </section>

        <section className="block" id="install">
          <p className="kicker">Mac</p>
          <h2>Install the app</h2>
          <div className="steps">
            {[
              {
                n: "01",
                t: "Download the disk image",
                b: "Use the Download button at the top of this page. It is a .dmg file, same idea as most Mac apps.",
              },
              {
                n: "02",
                t: "Open it and drag Radar into Applications",
                b: "A Finder window appears with the Radar icon and the Applications folder. Drag the icon onto Applications, then eject the disk image.",
              },
              {
                n: "03",
                t: "Open Radar from Applications",
                b: "First launch can take a minute while the graph engine starts. If macOS warns that the app is from the internet, choose Open.",
              },
              {
                n: "04",
                t: "Accept the internal-use screen",
                b: "Radar is not licensed for distribution. Click I understand — continue. Do not pass the installer to clients without prior approval.",
              },
              {
                n: "05",
                t: "Paste keys, then download the triage model",
                b: "Gear icon → Settings. Paste OpenRouter plus API Direct, AnyAPI, or XPoz. Save. Then click Download triage model (about 90 MB, once).",
              },
            ].map((step) => (
              <article className="step" key={step.n}>
                <div className="num">{step.n}</div>
                <div>
                  <h3>{step.t}</h3>
                  <p>{step.b}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="block" id="use">
          <p className="kicker">Day to day</p>
          <h2>How to use Radar</h2>
          <p className="lede">
            A <strong>watchlist</strong> is a collection job you set up: a topic,
            keywords, and which platforms to search. Radar then finds{" "}
            <strong>topics</strong> (themes) for you — you do not create those by hand.
          </p>
          <div className="steps" style={{ marginTop: "1rem" }}>
            {[
              {
                n: "01",
                t: "Create a watchlist",
                b: "Sidebar → Watchlists → New. Name it, describe what “on topic” means, add keywords, tick platforms, Save.",
              },
              {
                n: "02",
                t: "Run a sweep",
                b: "Click Run sweep to fetch now. After that, Radar keeps scanning on a timer (default every hour).",
              },
              {
                n: "03",
                t: "Read what came in",
                b: "Dashboard is the overview. Watchlists shows raw items. Topics lists themes. Graph draws connections.",
              },
              {
                n: "04",
                t: "Group work and get a digest",
                b: "Workspaces group related watchlists. Reports lets you generate a digest now, or set Daily / Weekly.",
              },
            ].map((step) => (
              <article className="step" key={step.n}>
                <div className="num">{step.n}</div>
                <div>
                  <h3>{step.t}</h3>
                  <p>{step.b}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="panel" style={{ marginTop: "1.1rem" }}>
            <p className="kicker">Left sidebar</p>
            <h3 style={{ fontFamily: "var(--display)", margin: "0.3rem 0 0.8rem" }}>
              Where things live
            </h3>
            <dl className="nav-map">
              {[
                ["Dashboard", "Watchlist count, new themes, recent items, spend."],
                ["Watchlists", "Create jobs, run sweeps, read the feed."],
                ["Workspaces", "Group watchlists for review or reports."],
                ["Rules", "Scan frequency, pause/resume, inbox thresholds."],
                ["Topics", "Themes Radar clustered."],
                ["Graph", "Network view of themes, posts, and entities."],
                ["Reports", "Written digest, PDF, optional email."],
                ["Settings", "Keys, models, triage download, email, backup."],
              ].map(([dt, dd]) => (
                <div key={dt}>
                  <dt>{dt}</dt>
                  <dd>{dd}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <aside className="notice">
          <p>
            <strong>Internal use only.</strong> Radar bundles Neo4j Community Edition
            (GPLv3) and may be given only to Counterforce employees of the same legal
            entity. Independent contractors are not permitted by default. Do not put this
            installer on GitHub, a public link, or a client share.
          </p>
          {content.contact ? <p>{content.contact}</p> : null}
        </aside>

        <footer className="site-foot">
          <div>
            <p
              style={{
                margin: "0 0 0.35rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Powered by
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/counterforce-dark.png`} alt="Counterforce" />
          </div>
          <p>
            Keys and collected data stay on each person’s Mac. This page only hosts the
            installer.{" "}
            <Link href="/#apps">Back to Apps</Link>
          </p>
        </footer>
      </div>
    </>
  );
}
