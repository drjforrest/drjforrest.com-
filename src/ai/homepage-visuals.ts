'use server';

/**
 * @fileOverview A function for generating visual descriptions for the homepage using AI.
 * 
 * Note: This simplified version generates image descriptions rather than actual images,
 * as image generation typically requires specialized APIs and is more expensive.
 * For actual image generation, consider using services like DALL-E, Midjourney, or Stable Diffusion.
 */

import { getAIClient } from '@/lib/ai-client';
import { z } from 'zod';

const GenerateHomepageVisualsInputSchema = z.object({
  theme: z
    .string()
    .describe(
      'The theme for the visual asset, e.g., "global collaboration", "digital health", etc.'
    ),
  style: z
    .string()
    .describe(
      'The desired style for the visual asset, e.g., "abstract", "modern", "inclusive", etc.'
    ),
  keywords: z
    .string()
    .describe(
      'Keywords to guide the image generation, e.g., "network, data, collaboration".'
    ),
  visualAssetDescription: z
    .string()
    .describe(
      'A description of the visual asset to generate, including the theme, style, and keywords.'
    ),
});

const GenerateHomepageVisualsOutputSchema = z.object({
  imageDescription: z
    .string()
    .describe(
      'A detailed description that could be used to generate an image with AI image generation tools.'
    ),
  altText: z
    .string()
    .describe(
      'Accessible alt text for the described image.'
    ),
  suggestedPrompt: z
    .string()
    .describe(
      'A refined prompt optimized for image generation APIs.'
    ),
});

export type GenerateHomepageVisualsInput = z.infer<typeof GenerateHomepageVisualsInputSchema>;
export type GenerateHomepageVisualsOutput = z.infer<typeof GenerateHomepageVisualsOutputSchema>;

export async function generateHomepageVisuals(
  input: GenerateHomepageVisualsInput
): Promise<GenerateHomepageVisualsOutput> {
  const client = getAIClient();
  
  const prompt = `You are an expert at creating detailed image descriptions for AI image generation.

Create a detailed image description based on the following requirements:

Theme: ${input.theme}
Style: ${input.style}
Keywords: ${input.keywords}
Description: ${input.visualAssetDescription}

Generate:
1. A detailed image description that captures the essence of the requirements
2. Accessible alt text for the image
3. An optimized prompt for AI image generation tools

The description should be professional, academic, and suitable for a researcher's website.`;

  const schema = {
    type: 'object',
    properties: {
      imageDescription: {
        type: 'string',
        description: 'A detailed description that could be used to generate an image with AI image generation tools.'
      },
      altText: {
        type: 'string',
        description: 'Accessible alt text for the described image.'
      },
      suggestedPrompt: {
        type: 'string',
        description: 'A refined prompt optimized for image generation APIs.'
      }
    },
    required: ['imageDescription', 'altText', 'suggestedPrompt']
  };

  return await client.generateStructured<GenerateHomepageVisualsOutput>(
    prompt,
    schema,
    { temperature: 0.7 }
  );
}