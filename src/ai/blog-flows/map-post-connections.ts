"use server";

/**
 * @fileOverview AI function to identify thematic connections between blog posts.
 *
 * - mapPostConnections - Finds and explains connections between a target post and other posts
 * - MapPostConnectionsInput - Input schema for the connection mapping function
 * - MapPostConnectionsOutput - Output schema containing identified connections
 */

import { callDeepSeekWithStructuredOutput } from "./deepseek";
import { z } from "zod";

const PostConnectionSchema = z.object({
  connectedPostTitle: z.string().describe("The title of the connected post"),
  connectedPostSlug: z.string().describe("The slug of the connected post"),
  connectionReason: z
    .string()
    .describe("Brief explanation of how the posts connect thematically"),
  connectionType: z
    .enum([
      "Similar Issue",
      "Complementary Perspective",
      "Shared Solution",
      "Common Stakeholder",
      "Sequential Topic",
    ])
    .describe("The type of connection between the posts"),
});

const MapPostConnectionsInputSchema = z.object({
  targetPost: z
    .object({
      title: z.string(),
      slug: z.string(),
      content: z.string(),
      tags: z.array(z.string()),
      category: z.string(),
    })
    .describe("The post to find connections for"),
  otherPosts: z
    .array(
      z.object({
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        tags: z.array(z.string()),
        category: z.string(),
      }),
    )
    .describe("Other posts to compare against"),
});
export type MapPostConnectionsInput = z.infer<
  typeof MapPostConnectionsInputSchema
>;

const MapPostConnectionsOutputSchema = z.object({
  connections: z
    .array(PostConnectionSchema)
    .max(3)
    .describe("Up to 3 most relevant connections found"),
});
export type MapPostConnectionsOutput = z.infer<
  typeof MapPostConnectionsOutputSchema
>;

export async function mapPostConnections(
  input: MapPostConnectionsInput,
): Promise<MapPostConnectionsOutput> {
  const prompt = `You are an AI assistant specialized in identifying thematic connections between digital health equity blog posts.

Target Post:
Title: ${input.targetPost.title}
Category: ${input.targetPost.category}
Tags: ${input.targetPost.tags?.join(", ") || "None"}
Content: ${input.targetPost.content}

Other Posts to Compare:
${input.otherPosts
  .map(
    (post) => `
Title: ${post.title}
Category: ${post.category}
Tags: ${post.tags?.join(", ") || "None"}
Content: ${post.content.substring(0, 500)}...
`,
  )
  .join("\n")}

Please identify 1-3 meaningful connections between the target post and the other posts. Focus on:

1. Thematic connections (shared digital health equity issues, similar stakeholder impacts, related solutions)
2. Complementary perspectives on related topics
3. Sequential or building concepts

Connection types to use:
- Similar Issue: Posts addressing the same core equity problem
- Complementary Perspective: Posts offering different angles on related topics
- Shared Solution: Posts discussing similar approaches or interventions
- Common Stakeholder: Posts focusing on the same affected populations
- Sequential Topic: Posts that build on each other conceptually

For each connection, provide:
- The connected post's title and slug
- A brief, specific explanation of the connection
- The connection type

Return ONLY a valid JSON object in this exact format:

{
  "connections": [
    {
      "connectedPostTitle": "Title of the connected post",
      "connectedPostSlug": "slug-of-connected-post",
      "connectionReason": "Brief explanation of how the posts connect",
      "connectionType": "Similar Issue"
    }
  ]
}

Use only these exact connectionType values: "Similar Issue", "Complementary Perspective", "Shared Solution", "Common Stakeholder", "Sequential Topic"`;

  return await callDeepSeekWithStructuredOutput(
    prompt,
    MapPostConnectionsOutputSchema,
    (content: string) => {
      console.log("Raw AI response:", content);

      try {
        const parsed = JSON.parse(content);
        console.log("Parsed JSON:", JSON.stringify(parsed, null, 2));

        // Validate against schema and provide detailed error info
        const result = MapPostConnectionsOutputSchema.safeParse(parsed);
        if (!result.success) {
          console.error("Schema validation failed:", result.error.issues);
          console.error("Parsed data:", JSON.stringify(parsed, null, 2));

          // Return empty connections array as fallback
          console.warn("Returning empty connections array as fallback");
          return { connections: [] };
        }

        return result.data;
      } catch (parseError) {
        console.error("JSON parsing failed:", parseError);
        throw parseError;
      }
    },
  );
}
