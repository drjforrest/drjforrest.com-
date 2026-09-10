"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Network,
  ChevronRight,
  BookOpen,
  Zap,
  Target,
  Layers,
} from "lucide-react";

interface ExplainerStep {
  id: string;
  title: string;
  icon: typeof BookOpen;
  description: string;
  technical: string;
  example: string;
  stepLabel: string;
}

const ML_STEPS: ExplainerStep[] = [
  {
    id: "openalex",
    title: "Public scholarly record",
    icon: BookOpen,
    description:
      "Papers are pulled from OpenAlex—the open catalog of scholarly works—using an author name, ORCID, or OpenAlex ID. No private profile scrape required.",
    technical:
      "REST calls to api.openalex.org with a polite User-Agent and mailto. Works are paged (up to 200) with title, year, citations, venue, and abstract.",
    example:
      "Jamie Forrest resolves to OpenAlex author A5022908989; visitor lookups confirm the match with one or two well-cited papers before generating.",
    stepLabel: "01",
  },
  {
    id: "topics",
    title: "Thematic clustering",
    icon: Layers,
    description:
      "Each paper is assigned a research theme from the title and abstract, with OpenAlex topics as a fallback. Clusters are the groups you see in colour.",
    technical:
      "Rule-based labels for HIV, COVID trials, health systems, digital health/AI, and population methods; otherwise the work’s primary OpenAlex field.",
    example:
      "Fluvoxamine trial papers land in COVID-19 & clinical trials; Rwanda HIV cascade papers land in HIV & infectious disease.",
    stepLabel: "02",
  },
  {
    id: "layout",
    title: "Spatial layout",
    icon: Network,
    description:
      "Themes are placed around a circle so related papers sit together. Node size follows citation count.",
    technical:
      "Polar layout by cluster, then D3 forceX/forceY pull nodes toward those seeds. No UMAP or HDBSCAN required at request time.",
    example:
      "A dense COVID cluster sits apart from HIV work; bridging methods papers appear between them.",
    stepLabel: "03",
  },
  {
    id: "visualization",
    title: "Interactive graph",
    icon: Target,
    description:
      "D3 force layout: zoom, pan, hover for details, click for the full record. Visitor-generated graphs revert to the default after two minutes.",
    technical:
      "SVG + d3-zoom. Forces hold cluster positions; highly cited papers render larger.",
    example:
      "Click a node for authors, venue, and abstract. Filter the legend to isolate one theme.",
    stepLabel: "04",
  },
];

const TWEEN_FACTOR = 4.2;
const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

export function MLExplainer() {
  const [api, setApi] = useState<CarouselApi>();
  const [tweenValues, setTweenValues] = useState<number[]>([]);
  const [showTechnical, setShowTechnical] = useState<Record<string, boolean>>({});

  const onScroll = useCallback(() => {
    if (!api) return;

    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slides = api.scrollSnapList();

    const values = slides.map((scrollSnap, index) => {
      let diff = scrollSnap - scrollProgress;
      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diff = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diff = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      const tween = 1 - Math.abs(diff * TWEEN_FACTOR);
      return numberWithinRange(tween, 0, 1);
    });
    setTweenValues(values);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onScroll();
    api.on("scroll", onScroll);
    api.on("reInit", onScroll);
  }, [api, onScroll]);

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <p className="meta-label text-[var(--color-cobalt)]">How it works</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight text-[var(--color-ink)] md:text-5xl">
          How the map is built
        </h2>
        <p className="mt-4 text-lg text-[var(--color-ink-muted)]">
          From the public scholarly record to a clustered, interactive graph—without
          a separate Python service.
        </p>
      </div>

      <Carousel
        setApi={setApi}
        plugins={[Autoplay({ delay: 6000, stopOnInteraction: true })]}
        opts={{ align: "center", loop: true, containScroll: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 [perspective:1000px]">
          {ML_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <CarouselItem
                key={step.id}
                className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
                style={{
                  ...(tweenValues.length && {
                    transform: `
                        rotateY(${(tweenValues[index] - 1) * 20}deg)
                        scale(${1 - Math.abs((tweenValues[index] - 1) * 0.12)})
                        translateZ(${Math.abs(tweenValues[index] - 1) * -40}px)
                        translateX(${(tweenValues[index] - 1) * -15}px)
                      `,
                    filter: `blur(${Math.abs(tweenValues[index] - 1) * 1.5}px) brightness(${1 - Math.abs((tweenValues[index] - 1) * 0.2)})`,
                    transformStyle: "preserve-3d",
                    zIndex: Math.round((1 - Math.abs(tweenValues[index] - 1)) * 10),
                    opacity: Math.abs(tweenValues[index] - 1) > 0.85 ? 0.3 : 1,
                  }),
                }}
              >
                <article className="flex h-[460px] flex-col border-2 border-[var(--color-ink)] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="meta-label text-[var(--color-cobalt)]">
                      {step.stepLabel} / {String(ML_STEPS.length).padStart(2, "0")}
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center bg-[var(--color-ink)] text-[var(--color-signal)]">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="font-display text-2xl tracking-tight text-[var(--color-ink)]">
                    {step.title}
                  </h3>
                  <div className="mt-4 flex-1 space-y-4 overflow-y-auto">
                    <div>
                      <p className="meta-label">What it does</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                        {step.description}
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setShowTechnical((prev) => ({
                            ...prev,
                            [step.id]: !prev[step.id],
                          }))
                        }
                        className="h-auto w-full justify-between rounded-none px-0 hover:bg-transparent"
                      >
                        <span className="meta-label flex items-center text-[var(--color-ink)]">
                          <Zap className="mr-2 h-3 w-3" />
                          Technical details
                        </span>
                        <ChevronRight
                          className={`h-3 w-3 transition-transform ${showTechnical[step.id] ? "rotate-90" : ""}`}
                        />
                      </Button>
                      {showTechnical[step.id] ? (
                        <p className="mt-2 border border-[var(--color-line)] bg-[var(--color-chalk)] p-3 font-mono text-xs leading-relaxed text-[var(--color-ink-muted)]">
                          {step.technical}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <p className="meta-label">In practice</p>
                      <p className="mt-2 border-l-4 border-[var(--color-cobalt)] bg-[var(--color-chalk)] p-3 text-xs italic leading-relaxed text-[var(--color-ink)]">
                        {step.example}
                      </p>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden h-11 w-11 rounded-none border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-white hover:bg-[var(--color-cobalt)] hover:text-white sm:flex" />
        <CarouselNext className="hidden h-11 w-11 rounded-none border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-white hover:bg-[var(--color-cobalt)] hover:text-white sm:flex" />
      </Carousel>
    </div>
  );
}
