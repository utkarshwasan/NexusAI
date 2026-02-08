import { NextResponse } from "next/server";

// Force dynamic - never run at build time
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    console.error("❌ ASSEMBLYAI_API_KEY is missing from environment variables");
    return NextResponse.json(
      { error: "Server misconfigured: Missing API Key" },
      { status: 500 }
    );
  }

  try {
    // Generate temporary token from AssemblyAI v3 streaming API
    // Docs: https://www.assemblyai.com/docs/speech-to-text/universal-streaming
    const response = await fetch("https://streaming.assemblyai.com/v3/token", {
      method: "GET",
      headers: {
        "Authorization": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ AssemblyAI v3 Token Error: ${response.status} ${response.statusText}`, errorText);
      return NextResponse.json(
        { error: `Failed to generate token: ${response.status}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Return temporary token (same format as before for compatibility)
    return NextResponse.json({ token: data.token });
  } catch (error) {
    console.error("❌ Exception during token generation:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
