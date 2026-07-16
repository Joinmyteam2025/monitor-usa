import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("properties").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
  },
});

export const get = query({
  args: { id: v.id("properties") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const property = await ctx.db.get(id);
    if (!property || property.userId !== userId) return null;
    return property;
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    type: v.union(v.literal("residential"), v.literal("commercial")),
    plan: v.union(v.literal("smart_watch"), v.literal("ai_protect"), v.literal("total_command")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("properties", {
      ...args,
      userId,
      status: "disarmed",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("properties"),
    status: v.union(v.literal("armed"), v.literal("disarmed"), v.literal("away"), v.literal("night")),
  },
  handler: async (ctx, { id, status }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const property = await ctx.db.get(id);
    if (!property || property.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(id, { status });
  },
});
