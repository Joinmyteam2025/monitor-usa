import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listByProperty = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, { propertyId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("alerts")
      .withIndex("by_property", (q) => q.eq("propertyId", propertyId))
      .order("desc")
      .take(50);
  },
});

export const listRecent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("alerts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const allAlerts = await ctx.db.query("alerts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return allAlerts.filter(a => a.status === "active" || a.status === "dispatched");
  },
});

export const resolve = mutation({
  args: { id: v.id("alerts") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const alert = await ctx.db.get(id);
    if (!alert || alert.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(id, { status: "resolved", resolvedAt: Date.now() });
  },
});

export const acknowledge = mutation({
  args: { id: v.id("alerts") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const alert = await ctx.db.get(id);
    if (!alert || alert.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(id, { status: "acknowledged" });
  },
});
