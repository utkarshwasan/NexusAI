import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  console.log("[/api/getToken] API key present:", !!apiKey);

  if (!apiKey) {
    console.error("❌ ASSEMBLYAI_API_KEY missing in .env.local");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  try {
    // Generate temporary token from AssemblyAI
    // Token valid for 10 minutes, max session duration 3 hours
    const response = await fetch('https://streaming.assemblyai.com/v3/token', {
      method: 'GET',
      headers: {
        'Authorization': apiKey
      }
    });

    if (!response.ok) {
      console.error("❌ Failed to generate AssemblyAI token:", response.status);
      return NextResponse.json(
        { error: "Failed to generate token" },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("[/api/getToken] Temporary token generated successfully");
    
    // Return temporary token (same format as before for compatibility)
    return NextResponse.json({ token: data.token });
  } catch (error) {
    console.error("❌ Error generating AssemblyAI token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
