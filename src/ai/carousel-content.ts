'use server';

/**
 * @fileOverview A function to assist with generating content for the publication carousel.
 * 
 * Replaces the Genkit-based implementation with a simple AI client approach.
 */

import { getAIClient } from '@/lib/ai-client';
import { z } from 'zod';

const AssistWithCarouselContentInputSchema = z.object({
  publicationTitle: z.string().describe('The title of the publication.'),
  publicationAbstract: z.string().describe('The abstract of the publication.'),
});

const AssistWithCarouselContentOutputSchema = z.object({
  conciseSummary: z.string().describe('A concise, one-sentence summary of the publication.'),
  keywords: z.array(z.string()).describe('Keywords for the publication.'),
});

export type AssistWithCarouselContentInput = z.infer<typeof AssistWithCarouselContentInputSchema>;
export type AssistWithCarouselContentOutput = z.infer<typeof AssistWithCarouselContentOutputSchema>;

export async function assistWithCarouselContent(
  input: AssistWithCarouselContentInput
): Promise<AssistWithCarouselContentOutput> {
  const client = getAIClient();
  
  const prompt = `You are an expert at summarizing academic publications and identifying relevant keywords.

Given the title and abstract of a publication, generate a concise, one-sentence summary and a list of keywords.

Title: ${input.publicationTitle}
Abstract: ${input.publicationAbstract}

Please provide your response in the exact JSON format specified.`;

  const schema = {
    type: 'object',
    properties: {
      conciseSummary: {
        type: 'string',
        description: 'A concise, one-sentence summary of the publication.'
      },
      keywords: {
        type: 'array',
        items: { type: 'string' },
        description: 'Keywords for the publication.'
      }
    },
    required: ['conciseSummary', 'keywords']
  };

  return await client.generateStructured<AssistWithCarouselContentOutput>(
    prompt, 
    schema,
    { temperature: 0.3 }
  );
}