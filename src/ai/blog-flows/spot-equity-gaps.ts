'use server';

/**
 * @fileOverview AI function to identify specific digital health equity gaps in blog posts.
 * 
 * - spotEquityGaps - Identifies and categorizes digital health equity gaps mentioned in blog content
 * - SpotEquityGapsInput - Input schema for the gap spotting function
 * - SpotEquityGapsOutput - Output schema containing identified gaps with categories
 */

import { callDeepSeekWithStructuredOutput } from './deepseek';
import { z } from 'zod';

const EquityGapSchema = z.object({
  gap: z.string().describe('A specific digital health equity gap identified in the content'),
  category: z.enum(['Access', 'Affordability', 'Digital Literacy', 'Infrastructure', 'Privacy & Security', 'Cultural Barriers', 'Data Representation']).describe('The category this gap falls under'),
  impact: z.string().describe('Brief description of who this gap affects most'),
});

const SpotEquityGapsInputSchema = z.object({
  blogPostContent: z.string().describe('The complete content of the blog post to analyze for equity gaps'),
  title: z.string().describe('The title of the blog post for context'),
});
export type SpotEquityGapsInput = z.infer<typeof SpotEquityGapsInputSchema>;

const SpotEquityGapsOutputSchema = z.object({
  gaps: z.array(EquityGapSchema).max(3).describe('Up to 3 most significant equity gaps identified in the content'),
});
export type SpotEquityGapsOutput = z.infer<typeof SpotEquityGapsOutputSchema>;

export async function spotEquityGaps(input: SpotEquityGapsInput): Promise<SpotEquityGapsOutput> {
  const prompt = `You are an AI assistant specialized in identifying digital health equity gaps. Your task is to analyze blog post content and identify specific, actionable equity gaps.

Blog Post Title: ${input.title}

Blog Post Content: ${input.blogPostContent}

Please identify 1-3 of the most significant digital health equity gaps mentioned or implied in this content. For each gap:

1. Be specific and actionable (not just "digital divide" but "lack of high-speed internet in rural areas prevents telehealth access")
2. Categorize using these categories: Access, Affordability, Digital Literacy, Infrastructure, Privacy & Security, Cultural Barriers, Data Representation
3. Identify who is most impacted

Focus on gaps that are directly related to the post content, not general digital health equity issues.

Return your response as JSON with a "gaps" array containing objects with "gap", "category", and "impact" fields.`;

  return await callDeepSeekWithStructuredOutput(
    prompt,
    SpotEquityGapsOutputSchema,
    (content: string) => {
      const parsed = JSON.parse(content);
      return SpotEquityGapsOutputSchema.parse(parsed);
    }
  );
}