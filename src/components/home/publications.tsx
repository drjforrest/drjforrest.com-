"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { publications } from "@/lib/data";
import Autoplay from "embla-carousel-autoplay";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const TWEEN_FACTOR = 4.2;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

export function Publications() {
  const [api, setApi] = useState<CarouselApi>();
  const [tweenValues, setTweenValues] = useState<number[]>([]);

  const onScroll = useCallback(() => {
    if (!api) return;

    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();

    const styles = api.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      const tweenValue = 1 - Math.abs(diffToTarget * TWEEN_FACTOR);
      return numberWithinRange(tweenValue, 0, 1);
    });
    setTweenValues(styles);
  }, [api, setTweenValues]);

  useEffect(() => {
    if (!api) return;
    onScroll();
    api.on("scroll", onScroll);
    api.on("reInit", onScroll);
  }, [api, onScroll]);

  return (
    <section>
      <div className="container">
        <div className="mx-auto max-w-5xl text-primary-950 text-center">
          <h2 className="font-headline text-5xl text-primary-950 font-bold tracking-tight">
            Publications & Research Highlights
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive collection of my co-authored and published scientific papers
            and contributions to the field, presented in a digital art
            gallery format. Click on any paper to read more.
          </p>
        </div>

        <div className="mt-12">
          <Carousel
            setApi={setApi}
            plugins={[
              Autoplay({
                delay: 8000,
                stopOnInteraction: true,
              }),
            ]}
            opts={{
              align: "center",
              loop: true,
              containScroll: false,
            }}
            className="w-full"
          >
            <CarouselContent className="[perspective:1000px] -ml-4">
              {publications.map((publication, index) => (
                <CarouselItem
                  key={publication.id}
                  className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4"
                  style={{
                    ...(tweenValues.length && {
                      transform: `
                        rotateY(${(tweenValues[index] - 1) * 25}deg)
                        scale(${1 - Math.abs((tweenValues[index] - 1) * 0.15)})
                        translateZ(${Math.abs(tweenValues[index] - 1) * -50}px)
                        translateX(${(tweenValues[index] - 1) * -20}px)
                      `,
                      filter: `blur(${Math.abs(tweenValues[index] - 1) * 2}px) brightness(${1 - Math.abs((tweenValues[index] - 1) * 0.3)})`,
                      transformStyle: "preserve-3d",
                      zIndex: Math.round(
                        (1 - Math.abs(tweenValues[index] - 1)) * 10,
                      ),
                      opacity: Math.abs(tweenValues[index] - 1) > 0.8 ? 0.3 : 1,
                    }),
                  }}
                >
                  <Link
                    href={`/publications/${publication.slug}`}
                    className="group block h-[400px] w-full"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-xl border-2 border-white/20 shadow-2xl transition-all duration-300 ease-in-out group-hover:scale-105 backdrop-blur-sm bg-white/10">
                      <Image
                        src={publication.imageUrl}
                        alt={publication.title}
                        fill
                        className="object-cover"
                        data-ai-hint={publication.aiHint}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent transition-all duration-300 group-hover:from-black/60 group-hover:to-black/20 group-hover:backdrop-blur-sm" />

                      <div className="absolute inset-0 flex translate-y-4 flex-col items-center justify-center p-4 text-center text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <h3 className="font-headline text-xl font-bold">
                          {publication.title}
                        </h3>
                        <p className="mt-2 text-sm">({publication.year})</p>
                        <Button size="sm" className="mt-4">
                          <ExternalLink className="mr-2 h-4 w-4" /> Read More
                        </Button>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex h-16 w-16 text-white bg-accent-600 border-2 border-accent-600 hover:bg-accent-950 hover:text-white shadow-lg" />
            <CarouselNext className="hidden sm:flex h-16 w-16 text-white bg-accent-600 border-2 border-accent-600 hover:bg-accent-950 hover:text-white shadow-lg" />
          </Carousel>
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            className="bg-accent-600 text-white border-accent-600 hover:bg-accent-950 hover:text-white"
          >
            <Link href="/publications">View All Publications</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
