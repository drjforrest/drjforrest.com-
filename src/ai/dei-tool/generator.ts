import { getAIClient } from '@/lib/ai-client';
import { ChatMessage } from '@/lib/ai-client';

interface DEIResponse {
  answer: string;
  followUp?: string;
}

interface DEIResponses {
  [key: string]: DEIResponse;
}

export async function generateDEIProposal(responses: DEIResponses): Promise<string> {

  try {
    // Validate responses object
    if (!responses || typeof responses !== 'object') {
      throw new Error('Invalid responses object provided');
    }

    // Limit the size of responses to prevent abuse
    const responseCount = Object.keys(responses).length;
    if (responseCount > 100) {
      throw new Error('Too many responses provided');
    }

    // Create the AI prompt based on user responses
    const prompt = `Generate a professional DEI (Diversity, Equity, and Inclusion) section for a research proposal based on the following responses:

${JSON.stringify(responses, null, 2)}

Instructions:
1. Create a well-structured proposal section that addresses diversity, equity, and inclusion aspects of the research
2. Use academic and professional language appropriate for research proposals
3. Organize the content in clear sections with headings
4. Incorporate the user's responses into relevant sections
5. Add a brief introduction and conclusion
6. Include specific examples based on their answers
7. Keep the tone professional and focused on research excellence
8. Format the response in plain text (not markdown)

Important: Only return the proposal text, nothing else.`;

    // Get AI client and generate text
    const aiClient = getAIClient();
    
    const response = await aiClient.chat([
      {
        role: 'system',
        content: 'You are an expert research proposal writer specializing in DEI (Diversity, Equity, and Inclusion) sections for academic proposals. You help researchers create compelling DEI sections based on their project details.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], {
      temperature: 0.7,
      max_tokens: 2000
    });

    return response.content;
  } catch (error: any) {
    // Re-throw with more context for the API route to handle
    if (error.message && (error.message.includes('AI API error') || error.message.includes('429'))) {
      throw new Error('AI service rate limit exceeded. Please try again in a few minutes.');
    }
    
    if (error.message && error.message.includes('401')) {
      throw new Error('AI service authentication failed. Please contact support.');
    }
    
    throw new Error(`Failed to generate DEI proposal: ${error.message || 'Unknown error'}`);
  }
}