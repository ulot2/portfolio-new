import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText, convertToModelMessages, createTextStreamResponse } from 'ai';
import { buildSystemPrompt } from '@/lib/knowledge';
import { checkRateLimit } from '@/lib/ratelimit';

export async function POST(req: Request) {
  try {
    // 1. IP extraction and Rate Limiting check before calling LLM
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateLimit = await checkRateLimit(ip);

    if (!rateLimit.success) {
      const limitMsg = "I've hit my daily message limit for now! Feel free to reach out to Tolu directly via the contact section below.";
      return new Response(limitMsg, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // 2. OpenRouter Key Verification
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error('OPENROUTER_API_KEY environment variable is missing.');
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key is missing. Please check .env.local.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const openrouter = createOpenRouter({ apiKey });

    // 3. Extract and parse messages
    const body = await req.json();
    let rawMessages = body.messages;

    if (!rawMessages && body.message) {
      rawMessages = [{ role: 'user', content: body.message }];
    }

    if (!rawMessages || !Array.isArray(rawMessages) || rawMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'A non-empty messages array or message string is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = await convertToModelMessages(rawMessages);
    const systemPrompt = buildSystemPrompt();

    // 4. Stream response from model
    const result = streamText({
      model: openrouter('google/gemma-4-26b-a4b-it:free'),
      system: systemPrompt,
      messages,
    });

    return createTextStreamResponse({ stream: result.textStream });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate response';
    console.error('Streaming Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
