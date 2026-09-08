interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function callDeepSeek(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Deepseek API error: ${response.status} ${response.statusText}`);
  }

  const data: DeepSeekResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function callDeepSeekWithStructuredOutput<T>(
  prompt: string,
  schema: any,
  parseOutput: (content: string) => T
): Promise<T> {
  const fullPrompt = `${prompt}

Please respond with valid JSON that matches this schema. Do not include any other text.`;
  
  const content = await callDeepSeek(fullPrompt);
  
  try {
    return parseOutput(content);
  } catch (error) {
    // If parsing fails, try to extract JSON from the content
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return parseOutput(jsonMatch[0]);
    }
    throw new Error(`Failed to parse structured output: ${error}`);
  }
}
