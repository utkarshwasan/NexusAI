import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { useQuery, useMutation } from "convex/react";

export const CreateNewRoom = mutation({
  args: {
    CoachingOptions: v.string(),
    topic: v.string(),
    expertName: v.string(),
    uid: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("DiscussionRoom", {
      CoachingOptions: args.CoachingOptions,
      topic: args.topic,
      expertName: args.expertName,
      uid: args.uid,
    });
    return result;
  },
});

export const GetDiscussionRoom = query({
  args: {
    id: v.id("DiscussionRoom"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.id);
    return result;
  },
});
export const UpdateConversation = mutation({
  args: {
    id: v.id("DiscussionRoom"),
    conversation: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      conversation: args.conversation,
    });
  },
});
export const UpdateSummary = mutation({
  args: {
    id: v.id("DiscussionRoom"),
    summary: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      summary: args.summary,
    });
  },
});
export const GetUserHistory = query({
  args: { uid: v.id("users") },
  handler: async (ctx, { uid }) => {
    return await ctx.db
      .query("DiscussionRoom")
      .withIndex("by_uid", (q) => q.eq("uid", uid))
      .order("desc")
      .collect();
  },
});
export const UpdateUserTokens = mutation({
  args: { uid: v.id("users"), amount: v.number() },
  handler: async (ctx, { uid, amount }) => {
    const user = await ctx.db.get(uid);
    if (!user) return;
    const newTotal = Math.max(0, user.credits + amount); // amount is negative
    await ctx.db.patch(uid, { credits: newTotal });
    return newTotal;
  },
});
