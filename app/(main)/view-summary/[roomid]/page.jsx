"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { CoachingOptions } from "@/services/Options";
import ChatBox from "../../discussion-room/[roomid]/_components/ChatBox";

export default function ViewSummary() {
  const { roomid } = useParams();
  const data = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });

  if (!data) {
    return (
      <div className="grid place-content-center h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const option = CoachingOptions.find((o) => o.name === data.CoachingOptions);
  const iconUrl = option?.abstract || "/ab1.png";

  return (
    <div className="min-h-[70px] rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg">
          <Image
            src={iconUrl}
            alt={data.CoachingOptions}
            width={64}
            height={64}
            className="rounded-full object-cover h-16 w-16 ring-4 ring-white/50 dark:ring-gray-700/50"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
              {data.topic}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {data.CoachingOptions}
            </p>
          </div>
          <time className="text-sm text-gray-400 dark:text-gray-500">
            {formatDistanceToNow(new Date(data._creationTime), {
              addSuffix: true,
            })}
          </time>
        </div>
      </div>

      {/* Grid – 3 : 2 ratio */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Summary – 3 parts */}
        <section className="lg:col-span-3 p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Summary of Your Conversation
          </h2>
          {/* AUTO-HIDE SCROLLBAR */}
          <div
            className="h-[60vh] overflow-y-auto pr-2
                          scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600
                          scrollbar-track-transparent hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500
                          scrollbar-thumb-rounded-full"
          >
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {data.summary || "No summary available."}
            </p>
          </div>
        </section>

        {/* Chat – 2 parts (wider) */}
        <section className="lg:col-span-2 p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Your Conversation
          </h2>
          <div className="h-[60vh] overflow-hidden">
            {/* PASS FALSE → button hidden */}
            <ChatBox
              conversation={data.conversation || []}
              assistantName={data.expertName}
              typing={false}
              enableFeedbackNotes={false}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
