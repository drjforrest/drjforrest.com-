'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { 
  Brain, 
  Network, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Zap,
  Target,
  Layers
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ExplainerStep {
  id: string;
  title: string;
  icon: any;
  description: string;
  technical: string;
  example: string;
  color: string;
}

const ML_STEPS: ExplainerStep[] = [
  {
    id: 'embeddings',
    title: 'Step 1: Semantic Embeddings',
    icon: BookOpen,
    description: 'Each paper is converted into a 768-dimensional vector that captures its semantic meaning. Papers about similar topics have similar vectors.',
    technical: 'Using Sentence Transformers (all-MiniLM-L6-v2) or Semantic Scholar API embeddings. These are dense vector representations trained on millions of academic papers.',
    example: 'A paper about "HIV treatment adherence" will have a vector close to papers about "antiretroviral therapy compliance" but far from papers about "climate change".',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'umap',
    title: 'Step 2: UMAP Dimensionality Reduction',
    icon: Layers,
    description: 'UMAP (Uniform Manifold Approximation and Projection) compresses 768 dimensions down to 2D while preserving the neighborhood structure - papers that were close in 768D stay close in 2D.',
    technical: 'UMAP uses manifold learning and topological data analysis. It\'s better than t-SNE for preserving global structure while maintaining local neighborhoods.',
    example: 'Your COVID papers cluster together, your HIV papers form another group, but you can still see how methodology bridges them.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'hdbscan',
    title: 'Step 3: HDBSCAN Clustering',
    icon: Network,
    description: 'HDBSCAN (Hierarchical Density-Based Spatial Clustering) automatically discovers research topics by finding dense regions of papers without requiring you to specify how many clusters exist.',
    technical: 'Unlike k-means, HDBSCAN doesn\'t force every paper into a cluster. It builds a hierarchy based on density and extracts stable clusters. Papers in sparse regions become "noise" (-1 cluster).',
    example: 'Discovered 6-8 distinct research areas: HIV/MSM health, COVID trials, digital health, misinformation, etc. Some cross-cutting papers don\'t belong to any single cluster.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'sentiment',
    title: 'Step 4: Sentiment Analysis',
    icon: Sparkles,
    description: 'Each abstract is analyzed for tone using a transformer model fine-tuned on sentiment classification. This adds emotional context to academic work.',
    technical: 'DistilBERT model fine-tuned on SST-2 (Stanford Sentiment Treebank). Returns positive/negative/neutral with confidence scores.',
    example: 'Papers describing successful interventions often score positive, while those identifying gaps or challenges may score more neutral or negative.',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'visualization',
    title: 'Step 5: Interactive Visualization',
    icon: Target,
    description: 'D3.js creates a force-directed graph where papers are nodes sized by citations, colored by cluster, positioned by UMAP coordinates, and interactive for exploration.',
    technical: 'Force simulation with multiple forces: attraction to UMAP positions, repulsion between nodes (charge), collision detection. Zoom/pan via d3-zoom.',
    example: 'Highly cited papers appear larger. You can drag nodes, zoom in on clusters, hover for details, and click for full paper information.',
    color: 'from-indigo-500 to-violet-500'
  }
];

const TWEEN_FACTOR = 4.2;
const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

export function MLExplainer() {
  const [api, setApi] = useState<CarouselApi>();
  const [tweenValues, setTweenValues] = useState<number[]>([]);
  const [showTechnical, setShowTechnical] = useState<{[key: string]: boolean}>({});

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
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-5xl text-primary-950 font-bold font-headline tracking-tight">
          ML Pipeline Explained
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Understanding how machine learning transforms your research network into an interactive visualization
        </p>
      </div>

      <div className="mt-12">
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 6000,
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
            {ML_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <CarouselItem
                  key={step.id}
                  className="basis-full sm:basis-1/2 lg:basis-1/3 pl-4"
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
                      zIndex: Math.round(
                        (1 - Math.abs(tweenValues[index] - 1)) * 10,
                      ),
                      opacity: Math.abs(tweenValues[index] - 1) > 0.85 ? 0.3 : 1,
                    }),
                  }}
                >
                  <Card className="h-[500px] relative overflow-hidden border-2 border-white/20 shadow-2xl backdrop-blur-sm bg-white/95">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10`} />
                    
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          Step {index + 1} of {ML_STEPS.length}
                        </Badge>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${step.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-headline">{step.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="relative space-y-4 overflow-y-auto max-h-[340px]">
                      {/* Description */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                          What it does
                        </h4>
                        <p className="text-sm leading-relaxed">{step.description}</p>
                      </div>

                      {/* Technical Details Toggle */}
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowTechnical(prev => ({...prev, [step.id]: !prev[step.id]}))}
                          className="w-full justify-between p-2 h-auto"
                        >
                          <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wide flex items-center">
                            <Zap className="h-3 w-3 mr-2" />
                            Technical Details
                          </span>
                          <ChevronRight className={`h-3 w-3 transition-transform ${showTechnical[step.id] ? 'rotate-90' : ''}`} />
                        </Button>
                        
                        {showTechnical[step.id] && (
                          <div className="p-3 bg-muted/50 rounded-lg border">
                            <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                              {step.technical}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Example */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                          In Practice
                        </h4>
                        <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg border border-accent/30">
                          <p className="text-xs italic leading-relaxed">{step.example}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex h-12 w-12 text-white bg-accent-600 border-2 border-accent-600 hover:bg-accent-950 hover:text-white shadow-lg" />
          <CarouselNext className="hidden sm:flex h-12 w-12 text-white bg-accent-600 border-2 border-accent-600 hover:bg-accent-950 hover:text-white shadow-lg" />
        </Carousel>
      </div>
    </div>
  );
}
