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
  Sparkles,
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
    id: "embeddings",
    title: "Semantic embeddings",
    icon: BookOpen,
    description:
      "Each paper becomes a 768-dimensional vector that captures meaning. Papers about similar topics land close together in that space.",
    technical:
      "Sentence Transformers (all-MiniLM-L6-v2) or Semantic Scholar API embeddings—dense vectors trained on millions of academic papers.",
    example:
      'A paper on "HIV treatment adherence" sits near "antiretroviral therapy compliance," far from climate-change work.',
    stepLabel: "01",
  },
  {
    id: "umap",
    title: "UMAP reduction",
    icon: Layers,
    description:
      "UMAP compresses 768 dimensions to 2D while keeping neighbors intact—papers that were close stay close on the map.",
    technical:
      "Manifold learning that preserves local neighborhoods and more global structure than classic t-SNE.",
    example:
      "COVID papers cluster together; HIV papers form another group; methodology papers can bridge them.",
    stepLabel: "02",
  },
  {
    id: "hdbscan",
    title: "HDBSCAN clustering",
    icon: Network,
    description:
      "Density-based clustering finds research topics without forcing a fixed number of clusters. Sparse papers can remain unassigned.",
    technical:
      "Hierarchical density clustering extracts stable clusters; sparse points become noise (cluster −1).",
    example:
      "Typical runs surface areas like HIV/MSM health, COVID trials, digital health, and misinformation.",
    stepLabel: "03",
  },
  {
    id: "sentiment",
    title: "Sentiment analysis",
    icon: Sparkles,
    description:
      "Abstracts get a tone score from a transformer classifier—extra context on how findings are framed.",
    technical:
      "DistilBERT fine-tuned on SST-2; returns positive/negative/neutral with confidence.",
    example:
      "Successful interventions often score positive; gap analyses tend toward neutral.",
    stepLabel: "04",
  },
  {
    id: "visualization",
    title: "Interactive graph",
    icon: Target,
    description:
      "D3 force layout: nodes sized by citations, colored by cluster, seeded from UMAP, then opened for zoom and click.",
    technical:
      "Forces pull toward UMAP positions, repel overlaps, and support d3-zoom pan/zoom.",
    example:
      "Highly cited papers read larger. Drag, zoom, hover for details, click for the full record.",
    stepLabel: "05",
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
          ML pipeline
        </h2>
        <p className="mt-4 text-lg text-[var(--color-ink-muted)]">
          How embeddings, reduction, and clustering turn a publication list into an
          interactive map.
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
