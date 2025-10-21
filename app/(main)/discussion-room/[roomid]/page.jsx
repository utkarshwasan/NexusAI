"use client";
import { useParams } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/Options";
import Image from "next/image";
import { UserButton, useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import {
  getToken,
  AIModel,
  ConvertTextToSpeech,
  AIModelToGenerateFeedbackAndNotes,
} from "@/services/GlobalServices";
import { Loader2Icon } from "lucide-react";
import ChatBox from "./_components/ChatBox";
import { toast } from "sonner";

export default function DiscussionRoom() {
  const { roomid } = useParams();
  const user = useUser();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });
  const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
  const UpdateSummary = useMutation(api.DiscussionRoom.UpdateSummary);

  const [expert, setExpert] = useState();
  const [enableMic, setEnableMic] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const ttsQueue = useRef([]);
  const ttsRunning = useRef(false);
  const lastProcessedIndex = useRef(-1);

  /* ----------------------------------------------------------
     HYDRATE CHAT when we open a previous room
     ---------------------------------------------------------- */
  useEffect(() => {
    if (DiscussionRoomData?.conversation?.length) {
      setConversation(DiscussionRoomData.conversation);
      lastProcessedIndex.current = DiscussionRoomData.conversation.length - 1;
    }
  }, [DiscussionRoomData]);
  /* ---------------------------------------------------------- */

  useEffect(() => {
    if (!conversation.length || !DiscussionRoomData) return;
    conversation.slice(lastProcessedIndex.current + 1).forEach((msg, index) => {
      const currentIndex = lastProcessedIndex.current + 1 + index;
      if (msg.role === "assistant") {
        ttsQueue.current.push({
          content: msg.content,
          expert: DiscussionRoomData.expertName,
        });
      }
      lastProcessedIndex.current = currentIndex;
    });
    processQueue();
  }, [conversation, DiscussionRoomData]);

  const processQueue = async () => {
    if (ttsRunning.current || !ttsQueue.current.length) return;
    ttsRunning.current = true;
    const { content, expert } = ttsQueue.current.shift();
    const url = await ConvertTextToSpeech(content, expert);
    if (!url) {
      ttsRunning.current = false;
      processQueue();
      return;
    }
    setAudioUrl(url);
  };

  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = audioUrl;
    audio.play().catch(() => {});
    const onEnded = () => {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      ttsRunning.current = false;
      processQueue();
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [audioUrl]);

  const socket = useRef(null);
  const silenceTimeout = useRef(null);

  useEffect(() => {
    if (DiscussionRoomData) {
      const found = CoachingExpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      );
      setExpert(found);
    }
  }, [DiscussionRoomData]);

  const connectToServer = async () => {
    setLoading(true);
    try {
      const { token } = await getToken();
      const ws = new WebSocket(
        `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&token=${token}`
      );
      socket.current = ws;

      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "Turn" && msg.end_of_turn) {
          const userText = msg.transcript.trim();
          if (!userText) return;

          setConversation((prev) => [
            ...prev,
            { role: "user", content: userText, ts: Date.now() },
          ]);

          setTyping(true);
          try {
            const reply = await AIModel(
              DiscussionRoomData.topic,
              DiscussionRoomData.CoachingOptions,
              userText
            );
            setConversation((prev) => [
              ...prev,
              {
                role: "assistant",
                content: reply,
                ts: Date.now(),
                spoken: false,
              },
            ]);
          } catch (err) {
            console.error("AIModel error:", err);
            setConversation((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "Sorry, I could not process that.",
                ts: Date.now(),
                spoken: true,
              },
            ]);
          } finally {
            setTyping(false);
          }
        }
      };

      ws.onopen = async () => {
        setLoading(false);
        setEnableMic(true);
        toast.success("Live connection started!");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true },
        });
        const audioCtx = new AudioContext({ sampleRate: 16000 });
        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const f32 = e.inputBuffer.getChannelData(0);
          const i16 = new Int16Array(f32.length);
          for (let i = 0; i < f32.length; i++) {
            const s = Math.max(-1, Math.min(1, f32[i]));
            i16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }
          ws.send(i16.buffer);
          clearTimeout(silenceTimeout.current);
          silenceTimeout.current = setTimeout(
            () => console.log("User stopped talking"),
            2000
          );
        };

        source.connect(processor);
        processor.connect(audioCtx.destination);
      };

      ws.onerror = (e) => {
        console.error("WebSocket error", e);
        toast.error("Microphone connection failed.");
        setEnableMic(false);
        setLoading(false);
      };
      ws.onclose = () => {
        setEnableMic(false);
        setLoading(false);
      };
    } catch (err) {
      console.error(err);
      toast.error(err.message);
      setEnableMic(false);
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);
    if (socket.current) {
      socket.current.close();
      socket.current = null;
    }
    clearTimeout(silenceTimeout.current);
    setEnableMic(false);
    if (DiscussionRoomData) {
      await UpdateConversation({
        id: DiscussionRoomData._id,
        conversation: conversation,
      });
    }
    setLoading(false);
    setEnableFeedbackNotes(true);
    toast.success("Disconnected successfully.");
  };

  const onGenerateFeedback = async () => {
    if (!DiscussionRoomData) return;
    setLoadingFeedback(true);
    try {
      const result = await AIModelToGenerateFeedbackAndNotes(
        DiscussionRoomData.CoachingOptions,
        conversation
      );
      setFeedbackNotes(result);

      if (result) {
        await UpdateSummary({
          id: DiscussionRoomData._id,
          summary: result,
        });
        toast.success("Feedback/Notes Saved!");
      } else {
        toast.error("Failed to generate feedback.");
      }
    } catch (e) {
      console.error("Feedback generation failed:", e);
      setFeedbackNotes(
        "Sorry, something went wrong while generating feedback."
      );
      toast.error("Failed to save Feedback/Notes.");
    }
    setLoadingFeedback(false);
  };

  return (
    <div className="-mt-12">
      <audio ref={audioRef} className="hidden" />
      <h2 className="text-2xl font-bold">
        {DiscussionRoomData?.CoachingOptions}
      </h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <div className="h-[60vh] bg-secondary border rounded-2xl flex flex-col items-center justify-center relative">
            {expert && (
              <>
                <Image
                  src={expert.avatar}
                  alt="avatar"
                  width={200}
                  height={200}
                  className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
                />
                <h2 className="text-lg font-bold text-gray-500">
                  {expert.name}
                </h2>
              </>
            )}
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>
          <div className="mt-10 flex items-center justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer} disabled={loading}>
                {loading && <Loader2Icon className="animate-spin" />}
                {loading ? "Connecting..." : "Connect"}
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={disconnect}
                disabled={loading}
              >
                {loading && <Loader2Icon className="animate-spin" />}
                {loading ? "Disconnecting..." : "Disconnect"}
              </Button>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          <ChatBox
            conversation={conversation}
            assistantName={DiscussionRoomData?.expertName ?? "AI"}
            typing={typing}
            CoachingOptions={DiscussionRoomData?.CoachingOptions}
            enableFeedbackNotes={enableFeedbackNotes}
            onGenerateFeedback={onGenerateFeedback}
            feedbackNotes={feedbackNotes}
            loadingFeedback={loadingFeedback}
          />
        </div>
      </div>
    </div>
  );
}
