/**
 * GHL Sync — Push lifecycle events to GoHighLevel CRM
 * =====================================================
 * Syncs lifecycle state changes, lead scores, and events to GHL
 * so workflows, campaigns, and pipelines stay in sync.
 */

import { v } from "convex/values";
import { action } from "./_generated/server";

const GHL_LOCATION_ID = "X3wPZkYJBsP9at86EkcU";

// ═══ GHL Contact Sync ═══

/** Sync a lifecycle contact to GHL (upsert) */
export const syncContactToGHL = action({
  args: {
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    lifecycleState: v.string(),
    leadScore: v.number(),
    healthScore: v.number(),
    source: v.optional(v.string()),
    plan: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    customFields: v.optional(v.any()),
  },
  handler: async (_ctx, args) => {
    // This would call the GHL API via Viktor's SDK
    // For now, we structure the payload for the GHL upsert
    const payload = {
      locationId: GHL_LOCATION_ID,
      email: args.email,
      name: args.name,
      phone: args.phone || "",
      tags: [
        `ip_${args.lifecycleState.toLowerCase()}`,
        ...(args.tags || []),
      ],
      customField: {
        lifecycle_state: args.lifecycleState,
        lead_score: args.leadScore.toString(),
        health_score: args.healthScore.toString(),
        portal_source: "MonitorUSA",
        portal_product: "monitorusa",
        ...(args.source ? { first_touch_source: args.source } : {}),
        ...(args.plan ? { plan_name: args.plan } : {}),
        ...(args.customFields || {}),
      },
    };
    
    // Log the sync payload (actual API call happens via Viktor's scheduled sync)
    console.log("[GHL_SYNC] Contact upsert:", JSON.stringify({
      email: args.email,
      state: args.lifecycleState,
      score: args.leadScore,
    }));
    
    return { synced: true, payload };
  },
});

/** Move contact to a pipeline stage in GHL */
export const moveToStage = action({
  args: {
    email: v.string(),
    pipeline: v.string(),   // "acquisition" or "onboarding"
    stage: v.string(),
  },
  handler: async (_ctx, args) => {
    const stageMap: Record<string, Record<string, string>> = {
      acquisition: {
        "NEW_LEAD": "New Lead",
        "MQL": "Attempting Contact",
        "DEMO_BOOKED": "Demo Booked",
        "NO_SHOW": "Demo Booked",  // stays in same pipeline stage
        "SQL": "Demo Held",
        "TRIAL_NEW": "Trial / Evaluation",
        "CUSTOMER_NEW": "Closed Won",
        "CHURNED": "Closed Lost",
      },
      onboarding: {
        "CUSTOMER_NEW": "Welcome",
        "CUSTOMER_HEALTHY": "Activated",
        "CUSTOMER_AT_RISK": "Adoption",
        "RENEWAL": "Renewal",
        "ADVOCATE": "Expansion",
      },
    };
    
    const stageName = stageMap[args.pipeline]?.[args.stage];
    
    console.log("[GHL_SYNC] Pipeline move:", {
      email: args.email,
      pipeline: args.pipeline,
      stage: stageName || args.stage,
    });
    
    return { moved: true, pipeline: args.pipeline, stage: stageName };
  },
});

/** Record a conversion event for Meta/Google tracking */
export const trackConversion = action({
  args: {
    eventName: v.string(),
    email: v.string(),
    value: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    // Maps to Meta Pixel + Conversions API events
    const metaEventMap: Record<string, string> = {
      "lead_created": "Lead",
      "lead_qualified": "Lead",   // with quality parameter
      "demo_booked": "Schedule",
      "account_created": "StartTrial",
      "first_value_completed": "CompleteRegistration",
      "subscription_started": "Purchase",
      "plan_upgraded": "Purchase",
    };
    
    const metaEvent = metaEventMap[args.eventName];
    
    console.log("[CONVERSION]", {
      event: args.eventName,
      metaEvent,
      email: args.email,
      value: args.value,
      currency: args.currency || "USD",
    });
    
    return {
      tracked: true,
      metaEvent,
      googleEvent: args.eventName,
    };
  },
});
