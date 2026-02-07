import { NextResponse } from "next/server";
import OpenAI from "openai";

// Force dynamic - never run at build time
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Lazy-load OpenAI client inside handler to avoid build-time errors
function getOpenAIClient() {
  const apiKey = process.env.AI_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("AI_OPENROUTER_API_KEY missing");
  }
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
  });
}

// Helper: retry with exponential backoff
const callWithRetry = async (fn, maxRetries = 2) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error?.status === 429 && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt + 1) * 1000;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      if (error?.status === 429) {
        throw new Error("Rate limit reached. Please wait a moment and try again.");
      }
      if (error?.status === 402) {
        throw new Error("API credits exhausted. The free tier is limited to 50 requests/day.");
      }
      throw error;
    }
  }
};

export async function POST(request) {
  try {
    const { messages, mode } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Lazy-load client at request time, not build time
    const openai = getOpenAIClient();

    const response = await callWithRetry(async () => {
      const completion = await openai.chat.completions.create({
        model: "mistralai/mistral-small-3.1-24b-instruct:free",
        messages: messages,
      });
      return completion.choices[0]?.message?.content || "No response";
    });

    return NextResponse.json({ 
      content: response,
      mode: mode 
    });
  } catch (error) {
    const errorMessage = error.message || "Failed to process AI request";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
