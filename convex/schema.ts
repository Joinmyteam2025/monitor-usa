import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // SEO Blog articles (auto-generated daily by content engine)
  articles: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    metaTitle: v.string(),
    metaDescription: v.string(),
    schemaMarkup: v.string(),
    ctaUrl: v.string(),
    ctaText: v.string(),
    author: v.string(),
    readTime: v.number(),
    status: v.string(),
    publishedAt: v.number(),
    featuredImage: v.optional(v.string()),
    heroImage: v.optional(v.string()),
    heroImageAlt: v.optional(v.string()),
    viewCount: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_published", ["publishedAt"]),

  // Article engagement: likes
  articleLikes: defineTable({
    articleId: v.id("articles"),
    visitorId: v.string(),
    createdAt: v.number(),
  })
    .index("by_article", ["articleId"])
    .index("by_visitor", ["articleId", "visitorId"]),

  // Article engagement: comments
  articleComments: defineTable({
    articleId: v.id("articles"),
    name: v.string(),
    content: v.string(),
    visitorId: v.string(),
    parentId: v.optional(v.id("articleComments")),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_article", ["articleId"])
    .index("by_visitor_id", ["visitorId"]),



  // Article engagement: emoji reactions
  articleReactions: defineTable({
    articleId: v.id("articles"),
    visitorId: v.string(),
    emoji: v.string(),
    createdAt: v.number(),
  })
    .index("by_article", ["articleId"])
    .index("by_visitor", ["articleId", "visitorId"]),
  // Properties being monitored
  properties: defineTable({
    userId: v.id("users"),
    name: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    type: v.union(v.literal("residential"), v.literal("commercial")),
    status: v.union(v.literal("armed"), v.literal("disarmed"), v.literal("away"), v.literal("night")),
    plan: v.union(v.literal("smart_watch"), v.literal("ai_protect"), v.literal("total_command")),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Connected devices (sensors, cameras, panels)
  devices: defineTable({
    propertyId: v.id("properties"),
    userId: v.id("users"),
    name: v.string(),
    type: v.union(
      v.literal("camera"),
      v.literal("doorbell"),
      v.literal("motion_sensor"),
      v.literal("door_sensor"),
      v.literal("window_sensor"),
      v.literal("smoke_detector"),
      v.literal("co_detector"),
      v.literal("flood_sensor"),
      v.literal("air_quality"),
      v.literal("glass_break"),
      v.literal("alarm_panel"),
      v.literal("thermostat"),
      v.literal("smart_lock")
    ),
    location: v.string(), // "Front Door", "Living Room", etc.
    status: v.union(v.literal("online"), v.literal("offline"), v.literal("low_battery"), v.literal("triggered")),
    batteryLevel: v.optional(v.number()),
    lastPing: v.number(),
    createdAt: v.number(),
  }).index("by_property", ["propertyId"]).index("by_user", ["userId"]),

  // Alert events
  alerts: defineTable({
    propertyId: v.id("properties"),
    userId: v.id("users"),
    deviceId: v.optional(v.id("devices")),
    type: v.union(
      v.literal("intrusion"),
      v.literal("fire"),
      v.literal("co_leak"),
      v.literal("gas_leak"),
      v.literal("flood"),
      v.literal("air_quality"),
      v.literal("glass_break"),
      v.literal("door_open"),
      v.literal("motion"),
      v.literal("camera_offline"),
      v.literal("low_battery"),
      v.literal("system_test"),
      v.literal("panic")
    ),
    severity: v.union(v.literal("critical"), v.literal("warning"), v.literal("info")),
    title: v.string(),
    description: v.string(),
    status: v.union(v.literal("active"), v.literal("acknowledged"), v.literal("resolved"), v.literal("dispatched")),
    aiResponse: v.optional(v.string()), // What the AI did in response
    dispatchedTo: v.optional(v.string()), // "police", "fire", "ems"
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_property", ["propertyId"]).index("by_user", ["userId"]).index("by_status", ["status"]),

  // Emergency contacts
  emergencyContacts: defineTable({
    userId: v.id("users"),
    propertyId: v.id("properties"),
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    relationship: v.string(),
    priority: v.number(), // 1 = primary, 2 = secondary, etc.
    createdAt: v.number(),
  }).index("by_property", ["propertyId"]).index("by_user", ["userId"]),

  // Subscriptions
  subscriptions: defineTable({
    userId: v.id("users"),
    plan: v.union(v.literal("smart_watch"), v.literal("ai_protect"), v.literal("total_command")),
    status: v.union(v.literal("active"), v.literal("cancelled"), v.literal("past_due"), v.literal("trialing")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // AI Chat messages for support
  chatMessages: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});

export default schema;
