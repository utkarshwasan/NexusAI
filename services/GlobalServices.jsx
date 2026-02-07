import axios from "axios";
import { CoachingOptions as CoachingOptionsData } from "./Options";

export const getToken = async () => {
  const { data } = await axios.get("/api/getToken");
  return data; // { token: <temporary_token> }
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

  try {
    const { data } = await axios.post("/api/ai", {
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: msg },
      ],
      mode: "chat"
    });
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.content || "No response";
  } catch (error) {
    console.error("AI Model error:", error);
    throw new Error(error.response?.data?.error || error.message || "Failed to get AI response");
  }
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

  const summaryPrompt = option.summaryPrompt;

  const messagesForAI = conversation.map(({ role, content }) => ({
    role,
    content,
  }));

  try {
    const { data } = await axios.post("/api/ai", {
      messages: [...messagesForAI, { role: "system", content: summaryPrompt }],
      mode: "summary"
    });
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.content || "No response";
  } catch (error) {
    console.error("AI Summary error:", error);
    throw new Error(error.response?.data?.error || error.message || "Failed to generate summary");
  }
};

/* ----------  T T S   ---------- */
export const ConvertTextToSpeech = async (text, expertName) => {
  try {
    const response = await axios.post(
      "/api/tts",
      {
        text: text,
        voiceId: expertName || "Joanna",
      },
      {
        responseType: "blob", // Important: get binary data as blob
      }
    );

    if (!response.data) {
      console.error("No audio data received from TTS endpoint");
      return null;
    }

    // Create object URL from blob (same as before)
    const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("TTS error:", error);
    return null;
  }
};
