export type WritingSite = {
  id: "mind-the-gap" | "rounds";
  kicker: string;
  name: string;
  blurb: string;
  href: string;
  cta: string;
  index: string;
};

export const MIND_THE_GAP_URL =
  process.env.NEXT_PUBLIC_MIND_THE_GAP_URL ??
  "https://mind-the-gap.drjforrest.com";

export const ROUNDS_URL =
  process.env.NEXT_PUBLIC_ROUNDS_URL ??
  "https://rounds-and-square-pegs.drjforrest.com";

export const writingSites: WritingSite[] = [
  {
    id: "mind-the-gap",
    index: "01",
    kicker: "Technology and inequity",
    name: "Mind the Gap",
    blurb:
      "A London Underground-themed journal on AI, health systems, and who gets left behind.",
    href: MIND_THE_GAP_URL,
    cta: "Enter Mind the Gap",
  },
  {
    id: "rounds",
    index: "02",
    kicker: "Health informatics",
    name: "Rounds & Square Pegs",
    blurb:
      "You're in the right room. Explainers, labs, and field notes for people moving from clinic into systems.",
    href: ROUNDS_URL,
    cta: "Enter Rounds & Square Pegs",
  },
];
