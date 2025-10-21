"use client";

import { useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserContext } from "@/app/_context/UserContext";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { CoachingOptions } from "@/services/Options";

export default function History() {
  const { userData } = useContext(UserContext);
  const list = useQuery(
    api.DiscussionRoom.GetUserHistory,
    userData?._id ? { uid: userData._id } : "skip"
  );

  if (!list) {
    return (
      <div>
        <h2 className="text-xl font-bold">Your Previous Lectures</h2>
        <div className="mt-4 space-y-4">
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (list.length === 0)
    return (
      <div>
        <h2 className="text-xl font-bold">Your Previous Lectures</h2>
        <p className="text-gray-400 mt-2">
          You don't have any previous lectures
        </p>
      </div>
    );

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Your Previous Lectures</h2>
      {list.map((item) => {
        const option = CoachingOptions.find(
          (o) => o.name === item.CoachingOptions
        );
        const iconUrl = option?.abstract || "/ab1.png";

        return (
          <Link
            key={item._id}
            href={`/view-summary/${item._id}`}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <Image
              src={iconUrl}
              alt={item.CoachingOptions}
              width={40}
              height={40}
              className="rounded-full object-cover h-10 w-10"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.topic}</p>
              <p className="text-sm text-gray-500">{item.CoachingOptions}</p>
            </div>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(item._creationTime), {
                addSuffix: true,
              })}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
