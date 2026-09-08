import type { Metadata } from "next";
import "./portal.css";

export const metadata: Metadata = {
  title: "Radar — Download & setup",
  description: "Password-protected Radar installer and setup handbook.",
  robots: { index: false, follow: false },
};

export default function RadarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="radar-shell">{children}</div>;
}
