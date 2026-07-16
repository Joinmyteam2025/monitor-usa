import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listByProperty = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, { propertyId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("devices").withIndex("by_property", (q) => q.eq("propertyId", propertyId)).collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("devices").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
  },
});

export const add = mutation({
  args: {
    propertyId: v.id("properties"),
    name: v.string(),
    type: v.union(
      v.literal("camera"), v.literal("doorbell"), v.literal("motion_sensor"),
      v.literal("door_sensor"), v.literal("window_sensor"), v.literal("smoke_detector"),
      v.literal("co_detector"), v.literal("flood_sensor"), v.literal("air_quality"),
      v.literal("glass_break"), v.literal("alarm_panel"), v.literal("thermostat"),
      v.literal("smart_lock")
    ),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("devices", {
      ...args,
      userId,
      status: "online",
      batteryLevel: 100,
      lastPing: Date.now(),
      createdAt: Date.now(),
    });
  },
});
