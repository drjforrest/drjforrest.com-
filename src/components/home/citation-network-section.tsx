"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CitationNetworkSection() {
  return (
    <section className="py-12 md:py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl p-8 md:p-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-1/2 text-left">
              <h2 className="text-5xl text-primary-950 font-bold font-headline tracking-tight mb-4">
                Citation Network Visualization
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Explore your research network through interactive visualizations that reveal connections between your publications, 
                citation patterns, and thematic clusters. This tool helps you understand the landscape of your research impact 
                and identify connections you might not have noticed.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                The visualization uses advanced machine learning techniques to map your publications based on semantic similarity, 
                creating a network that reflects how your research areas interconnect.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                The backend leverages sophisticated ML algorithms including semantic embeddings, dimensionality reduction, and 
                clustering to create meaningful representations of your research portfolio.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-jungle-950 hover:bg-jungle-700 text-white">
                  <Link href="/research-network">
                    Explore Your Network
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/research-network/ml-explainer">
                    Learn About the ML Pipeline
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <Image
                src="/images/neural-network.png"
                alt="Citation Network Visualization"
                width={500}
                height={300}
                className="rounded-lg max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}