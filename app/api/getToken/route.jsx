import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.ASSEMBLYAI_API_KEY;
  console.log("[/api/getToken] key present:", !!key);

  if (!key) {
    console.error("❌ ASSEMBLYAI_API_KEY missing in .env.local");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  // Universal-streaming needs the account key itself – no token endpoint.
  return NextResponse.json({ token: key });
}
