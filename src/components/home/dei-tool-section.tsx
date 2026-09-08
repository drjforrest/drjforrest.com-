"use client";

import Image from "next/image";
import Link from "next/link";

export function DEIToolSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl p-8 md:p-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-1/2 text-left">
              <h2 className="text-5xl text-primary-950 font-bold font-headline tracking-tight mb-4">
                DEI Proposal Writing Assistant
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                The Diversity Equity and Inclusion (DEI) section of a grant
                application can be one of the hardest to write. For many
                quantitative researchers, it often feels forced or disconnected
                from the rest of the proposal. Still, reviewers increasingly
                expect thoughtful, evidence-based attention to DEI—and for good
                reason.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                This tool, adapted from a public resource at Maastricht
                University, is designed to help you think through the most
                relevant DEI considerations for your project. Paired with AI
                support, it can guide you toward a compelling and
                well-structured response that highlights your project's
                potential impact.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <Image
                src="/images/contrasting-innovations.png"
                alt="Contrasting Innovations"
                width={500}  // Set appropriate width
                height={300} // Set appropriate height
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          </div>

          {/* Centered important note section */}
          <div className="max-w-3xl mx-auto text-center mt-12">
            <h3 className="text-2xl text-jungle-950 font-bold mt-8 mb-4">
              Important Note
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              AI can help generate ideas, organize your thinking, and strengthen
              your writing. But the final product should always reflect your own
              perspective and professional judgment. Reviewing the output,
              editing for accuracy, and crafting the response in your own words
              is essential for both integrity and effectiveness.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              The Maastricht University resource can be found at:{" "}
              <Link
                href="https://www.maastrichtuniversity.nl/about-um/diversity-inclusivity/di-research/how-address-diversity-research-proposals-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                How to Address Diversity in Research Proposals: A Guide
              </Link>
            </p>
            <div className="flex justify-center mt-8">
              <Link
                href="/dei-tool"
                className="px-6 py-3 bg-jungle-950 text-white font-medium rounded-lg hover:bg-jungle-700 transition-colors shadow-md"
              >
                Access the DEI Tool
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
