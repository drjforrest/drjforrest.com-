'use server';
/**
 * @fileOverview This file defines functions for summarizing blog posts, focusing on digital health equity issues.
 *
 * - summarizeBlogPost - A function that takes blog post content as input and returns a summary highlighting key digital health equity issues.
 * - SummarizeBlogPostInput - The input type for the summarizeBlogPost function, which is the blog post content.
 * - SummarizeBlogPostOutput - The return type for the summarizeBlogPost function, which is the AI-powered summary.
 */

import { callDeepSeekWithStructuredOutput } from './deepseek';
import { z } from 'zod';

const SummarizeBlogPostInputSchema = z.object({
  blogPostContent: z
    .string()
    .describe('The complete content of the blog post to be summarized.'),
});
export type SummarizeBlogPostInput = z.infer<typeof SummarizeBlogPostInputSchema>;

const SummarizeBlogPostOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary highlighting the key digital health equity issues discussed in the blog post.'
    ),
});
export type SummarizeBlogPostOutput = z.infer<typeof SummarizeBlogPostOutputSchema>;

export async function summarizeBlogPost(input: SummarizeBlogPostInput): Promise<SummarizeBlogPostOutput> {
  const prompt = `You are an AI assistant tasked with summarizing blog posts related to digital health equity.

Your goal is to provide a concise "gap analysis" highlighting the key issues discussed in the post.

Please provide a summary of the following blog post content:

${input.blogPostContent}

Return your response as JSON with a "summary" field containing the summary.`;

  return await callDeepSeekWithStructuredOutput(
    prompt,
    SummarizeBlogPostOutputSchema,
    (content: string) => {
      const parsed = JSON.parse(content);
      return SummarizeBlogPostOutputSchema.parse(parsed);
    }
  );
}
