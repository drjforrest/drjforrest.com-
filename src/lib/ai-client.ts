/**
 * Simple AI client supporting Mistral and DeepSeek APIs
 * Cost-effective alternative to Genkit
 */

export interface AIClientConfig {
  provider: 'mistral' | 'deepseek';
  apiKey: string;
  model?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class AIClient {
  private config: AIClientConfig;
  private baseUrl: string;
  private defaultModel: string;

  constructor(config: AIClientConfig) {
    this.config = config;
    
    switch (config.provider) {
      case 'mistral':
        this.baseUrl = 'https://api.mistral.ai/v1';
        this.defaultModel = config.model || 'mistral-small-latest';
        break;
      case 'deepseek':
        this.baseUrl = 'https://api.deepseek.com/v1';
        this.defaultModel = config.model || 'deepseek-chat';
        break;
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  async chat(
    messages: ChatMessage[],
    options?: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
    }
  ): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || this.defaultModel,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
    };
  }

  async generateStructured<T>(
    prompt: string,
    schema: any,
    options?: {
      model?: string;
      temperature?: number;
    }
  ): Promise<T> {
    const systemMessage = `You are a helpful assistant that responds only with valid JSON that matches the provided schema. Do not include any explanation or markdown formatting.

Schema: ${JSON.stringify(schema, null, 2)}`;

    const response = await this.chat([
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt }
    ], {
      ...options,
      temperature: options?.temperature ?? 0.3,
    });

    try {
      return JSON.parse(response.content.trim());
    } catch (error) {
      throw new Error(`Failed to parse AI response as JSON: ${response.content}`);
    }
  }
}

// Singleton instance
let aiClient: AIClient | null = null;

export function getAIClient(): AIClient {
  if (!aiClient) {
    const provider = (process.env.AI_PROVIDER as 'mistral' | 'deepseek') || 'deepseek';
    
    // Try provider-specific API key first, then fallback to generic AI_API_KEY
    let apiKey: string | undefined;
    if (provider === 'deepseek') {
      apiKey = process.env.DEEPSEEK_API_KEY || process.env.AI_API_KEY;
    } else if (provider === 'mistral') {
      apiKey = process.env.MISTRAL_API_KEY || process.env.AI_API_KEY;
    } else {
      apiKey = process.env.AI_API_KEY;
    }
    
    if (!apiKey) {
      const requiredVar = provider === 'deepseek' ? 'DEEPSEEK_API_KEY' : 
                         provider === 'mistral' ? 'MISTRAL_API_KEY' : 'AI_API_KEY';
      throw new Error(`${requiredVar} environment variable is required`);
    }

    aiClient = new AIClient({
      provider,
      apiKey,
      model: process.env.AI_MODEL,
    });
  }
  
  return aiClient;
}

export { AIClient };