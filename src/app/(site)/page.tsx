import { Hero } from "@/components/home/hero";
import { ConditionsExplorer } from "@/components/home/conditions-explorer";
import { AppsSection } from "@/components/home/apps-section";
import { CitationNetworkSection } from "@/components/home/citation-network-section";
import { LatestSignals } from "@/components/home/latest-signals";
import { CollabCta } from "@/components/home/collab-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <ConditionsExplorer />
      <AppsSection />
      <CitationNetworkSection />
      <LatestSignals />
      <CollabCta />
    </>
  );
}
