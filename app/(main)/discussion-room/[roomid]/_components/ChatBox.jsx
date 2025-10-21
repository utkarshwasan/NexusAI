"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

function ChatBox({
  conversation = [],
  assistantName = "AI",
  typing,
  CoachingOptions,
  onGenerateFeedback,
  feedbackNotes,
  loadingFeedback,
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, typing]);

  const fmtTime = (d) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <div className="h-[60vh] bg-gray-100 dark:bg-gray-900 border rounded-2xl flex flex-col shadow-sm">
        <div className="shrink-0 p-3 px-4 border-b flex items-center justify-between bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 uppercase">
              LIVE
            </span>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {CoachingOptions || "Discussion"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              with {assistantName}
            </p>
          </div>
          <div className="w-12"></div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {conversation.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex flex-col animate-in fade-in ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-2 px-3 transition-transform duration-150 ease-in-out hover:scale-[1.02] shadow-sm ${isUser ? "bg-emerald-500 text-white rounded-t-2xl rounded-bl-2xl" : "bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-t-2xl rounded-br-2xl"}`}
                  >
                    <span>{msg.content}</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1.5 px-1">
                    {fmtTime(msg.ts || Date.now())}
                  </span>
                </div>
              );
            })}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 p-2.5 px-4 rounded-t-2xl rounded-br-2xl">
                  <div className="dot-bounce flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full dot-1"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full dot-2"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full dot-3"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {/* ---- FEEDBACK AREA (hidden when onGenerateFeedback is undefined) ---- */}
      {onGenerateFeedback && !feedbackNotes && conversation.length > 1 && (
        <div className="mt-4 text-sm">
          <Button
            onClick={onGenerateFeedback}
            disabled={loadingFeedback}
            className="w-full"
          >
            {loadingFeedback && <Loader2Icon className="animate-spin mr-2" />}
            {loadingFeedback ? "Generating..." : "Generate Feedback & Notes"}
          </Button>
        </div>
      )}

      {feedbackNotes && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="font-bold mb-2">Feedback & Notes:</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {feedbackNotes}
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
