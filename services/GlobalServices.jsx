import axios from "axios";
import OpenAI from "openai";
import { CoachingOptions as CoachingOptionsData } from "./Options";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

export const getToken = async () => {
  const { data } = await axios.get("/api/getToken");
  return data; // { token: <ASSEMBLYAI_API_KEY> }
};

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Helper: retry with exponential backoff
const callWithRetry = async (fn, maxRetries = 2) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error?.status === 429 && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
        console.log(`Rate limited, retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      if (error?.status === 429) {
        throw new Error(
          "Rate limit reached. Please wait a moment and try again."
        );
      }
      if (error?.status === 402) {
        throw new Error(
          "API credits exhausted. The free tier is limited to 50 requests/day."
        );
      }
      throw error;
    }
  }
};

export const AIModel = async (topic, coachingOptionName, msg) => {
  const options = Array.isArray(CoachingOptionsData)
    ? CoachingOptionsData
    : [CoachingOptionsData];
  const option = options.find((item) => item.name === coachingOptionName);
  if (!option) {
    console.warn(`Coaching option "${coachingOptionName}" not found`);
    return "Sorry, I could not find the requested coaching mode.";
  }
  const prompt = option.prompt.replace("{user_topic}", topic);

  return callWithRetry(async () => {
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-small-3.1-24b-instruct:free",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: msg },
      ],
    });
    return completion.choices[0]?.message?.content || "No response";
  });
};

export const AIModelToGenerateFeedbackAndNotes = async (
  coachingOptionName,
  conversation,
) => {
  const options = Array.isArray(CoachingOptionsData)
    ? CoachingOptionsData
    : [CoachingOptionsData];
  const option = options.find((item) => item.name === coachingOptionName);
  if (!option) {
    console.warn(`Coaching option "${coachingOptionName}" not found`);
    return "Sorry, I could not find the requested coaching mode.";
  }

  // CORRECTED TYPO: Using the correct field name
  const summaryPrompt = option.summaryPrompt;

  const messagesForAI = conversation.map(({ role, content }) => ({
    role,
    content,
  }));

  return callWithRetry(async () => {
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-small-3.1-24b-instruct:free",
      messages: [...messagesForAI, { role: "system", content: summaryPrompt }],
    });
    return completion.choices[0]?.message?.content || "No response";
  });
};

/* ----------  T T S   ---------- */
export const ConvertTextToSpeech = async (text, expertName) => {
  const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    console.error("AWS credentials missing");
    return null;
  }

  const client = new PollyClient({
    region: "us-east-1",
    credentials: { accessKeyId, secretAccessKey },
  });

  const command = new SynthesizeSpeechCommand({
    OutputFormat: "mp3",
    Text: text,
    VoiceId: expertName || "Joanna",
    Engine: "neural",
  });

  try {
    const { AudioStream } = await client.send(command);
    if (!AudioStream) return null;

    // CORRECTED: Implemented browser stream reader to handle the audio data
    const chunks = [];
    const reader = AudioStream.getReader();
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      if (doneReading) done = true;
      if (value) chunks.push(value);
    }
    const blob = new Blob(chunks, { type: "audio/mp3" });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("Polly error:", e);
    return null;
  }
};
