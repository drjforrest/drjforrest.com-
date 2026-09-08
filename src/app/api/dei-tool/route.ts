import { NextRequest } from 'next/server';
import { generateDEIProposal } from '@/ai/dei-tool/generator';

// Simple in-memory rate limiting (for production, consider using Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per minute per IP

function getIP(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim();
  }
  return 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || record.resetTime < now) {
    // Reset the counter
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  // Increment the counter
  record.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getIP(request);
    
    // Rate limiting
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please wait a moment before trying again.'
        }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '60'
          } 
        }
      );
    }

    const body = await request.json();
    const { responses } = body;

    // Validate responses
    if (!responses) {
      return new Response(
        JSON.stringify({ error: 'Responses are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate that responses is an object
    if (typeof responses !== 'object' || responses === null || Array.isArray(responses)) {
      return new Response(
        JSON.stringify({ error: 'Responses must be an object' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Limit the size of responses to prevent abuse
    const responseCount = Object.keys(responses).length;
    if (responseCount > 50) {
      return new Response(
        JSON.stringify({ error: 'Too many responses. Please contact support if you need to process more responses.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const text = await generateDEIProposal(responses);

    return new Response(
      JSON.stringify({ text }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('DEI tool generation error:', error);
    
    // Handle specific error cases
    if (error.message && (error.message.includes('rate limit') || error.message.includes('429'))) {
      return new Response(
        JSON.stringify({ 
          error: 'Service temporarily unavailable',
          message: 'We\'re experiencing high demand. Please try again in a few minutes.'
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (error.message && error.message.includes('authentication')) {
      return new Response(
        JSON.stringify({ 
          error: 'Service configuration error',
          message: 'Our service is temporarily misconfigured. Please contact support.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (error.message && error.message.includes('Invalid responses')) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request',
          message: 'The request data was invalid. Please try again.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate DEI text',
        message: 'We encountered an unexpected error. Please try again in a few minutes.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Add OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}