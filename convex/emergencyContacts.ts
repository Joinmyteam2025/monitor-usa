import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listByProperty = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, { propertyId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("emergencyContacts")
      .withIndex("by_property", (q) => q.eq("propertyId", propertyId))
      .collect();
  },
});

export const add = mutation({
  args: {
    propertyId: v.id("properties"),
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    relationship: v.string(),
    priority: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("emergencyContacts", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("emergencyContacts") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const contact = await ctx.db.get(id);
    if (!contact || contact.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(id);
  },
});
