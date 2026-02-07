import { NextResponse } from "next/server";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

// Force dynamic - never run at build time
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { text, voiceId } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const accessKeyId = process.env.POLLY_ACCESS_KEY_ID;
    const secretAccessKey = process.env.POLLY_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const client = new PollyClient({
      region: "us-east-1",
      credentials: { accessKeyId, secretAccessKey },
    });

    const command = new SynthesizeSpeechCommand({
      OutputFormat: "mp3",
      Text: text,
      VoiceId: voiceId || "Joanna",
      Engine: "neural",
    });

    const { AudioStream } = await client.send(command);

    if (!AudioStream) {
      return NextResponse.json(
        { error: "No audio stream received" },
        { status: 500 }
      );
    }

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of AudioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    // Return audio as blob
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
