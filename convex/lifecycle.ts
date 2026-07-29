/**
 * MonitorUSA Customer Lifecycle Engine
 * ==========================================
 * Implements the full lifecycle state machine from the Customer Lifecycle Blueprint.
 * 
 * Central rule: Every person is always in one correct lifecycle bucket,
 * receiving one relevant next-best action based on what they did — or failed to do.
 * 
 * States: NEW_LEAD → MQL → DEMO_BOOKED → NO_SHOW → SQL → TRIAL_NEW →
 *         CUSTOMER_NEW → CUSTOMER_HEALTHY → CUSTOMER_AT_RISK → RENEWAL →
 *         CHURNED → ADVOCATE
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ═══ LIFECYCLE STATES (canonical, ordered by precedence) ═══
export const LIFECYCLE_STATES = [
  "COMPLIANCE_SUPPRESSED", // Overrides everything
  "CUSTOMER_AT_RISK",      // At-risk overrides normal customer
  "CUSTOMER_HEALTHY",      // Customer overrides prospect
  "CUSTOMER_NEW",          // New customer overrides prospect
  "RENEWAL",               // Can coexist with customer health
  "ADVOCATE",              // Only when healthy + verified success
  "SQL",                   // Sales-qualified overrides nurture
  "DEMO_BOOKED",           // Demo overrides general lead
  "NO_SHOW",               // No-show state
  "MQL",                   // Marketing qualified
  "TRIAL_NEW",             // Trial/free signup
  "NEW_LEAD",              // Entry state
  "CHURNED",               // Canceled/expired
] as const;

// ═══ ACTIVATION MILESTONES ═══
export const ACTIVATION_MILESTONES = [
  "company_profile_completed",
  "service_catalog_configured",
  "calendar_connected",
  "billing_workflow_configured",
  "template_ready",
  "first_inspection_scheduled",
  "first_value_completed",    // ← This is THE activation event
  "team_member_invited",      // Only for multi-team member
] as const;

// ═══ LEAD SCORING TABLE ═══
const LEAD_SCORE_SIGNALS: Record<string, number> = {
  "team member_2_5": 10,
  "team member_6_15": 20,
  "team member_16_plus": 30,
  "has_paid_software": 10,
  "migration_requested": 15,
  "demo_booked": 30,
  "pricing_viewed_twice": 10,
  "email_reply": 20,
  "go_live_30_days": 20,
  "student_research": -15,
  "invalid_competitor": -50,
};

// ═══ HEALTH SCORE WEIGHTS ═══
const HEALTH_WEIGHTS = {
  core_product_usage: 30,
  activation_adoption: 20,
  business_outcome: 20,
  support_reliability: 10,
  relationship: 10,
  commercial_health: 10,
};

// ═══ MUTATIONS ═══

/** Track a lifecycle event */
export const trackEvent = mutation({
  args: {
    eventName: v.string(),
    contactEmail: v.string(),
    contactName: v.optional(v.string()),
    companyName: v.optional(v.string()),
    properties: v.optional(v.any()),
    sourceSystem: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const event = {
      eventName: args.eventName,
      contactEmail: args.contactEmail,
      contactName: args.contactName ?? "",
      companyName: args.companyName ?? "",
      properties: args.properties ?? {},
      sourceSystem: args.sourceSystem ?? "monitorusa_portal",
      occurredAt: Date.now(),
    };
    
    // Store event
    const eventId = await ctx.db.insert("lifecycleEvents", event);
    
    // Update contact lifecycle state based on event
    const contact = await ctx.db
      .query("lifecycleContacts")
      .withIndex("by_email", (q) => q.eq("email", args.contactEmail))
      .first();
    
    if (contact) {
      // Calculate new state based on event
      const newState = determineState(args.eventName, contact.lifecycleState);
      if (newState && newState !== contact.lifecycleState) {
        await ctx.db.patch(contact._id, {
          previousState: contact.lifecycleState,
          lifecycleState: newState,
          stateChangedAt: Date.now(),
          lastEventAt: Date.now(),
        });
      } else {
        await ctx.db.patch(contact._id, { lastEventAt: Date.now() });
      }
    } else {
      // Create new contact
      await ctx.db.insert("lifecycleContacts", {
        email: args.contactEmail,
        name: args.contactName ?? "",
        companyName: args.companyName ?? "",
        lifecycleState: "NEW_LEAD",
        previousState: "",
        stateChangedAt: Date.now(),
        lastEventAt: Date.now(),
        leadScore: 0,
        healthScore: 0,
        activationScore: 0,
        activationMilestones: [],
        plan: "",
        source: "",
        createdAt: Date.now(),
      });
    }
    
    return { eventId, eventName: args.eventName };
  },
});

/** Update lead score */
export const updateLeadScore = mutation({
  args: {
    contactEmail: v.string(),
    signals: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const contact = await ctx.db
      .query("lifecycleContacts")
      .withIndex("by_email", (q) => q.eq("email", args.contactEmail))
      .first();
    
    if (!contact) return null;
    
    let score = 0;
    for (const signal of args.signals) {
      score += LEAD_SCORE_SIGNALS[signal] ?? 0;
    }
    
    // Determine tier: 0-19 nurture, 20-39 MQL, 40+ sales priority
    const tier = score >= 40 ? "SALES_PRIORITY" : score >= 20 ? "MQL" : "NURTURE";
    
    await ctx.db.patch(contact._id, { leadScore: score });
    
    // Auto-promote to MQL if score crosses threshold
    if (tier === "MQL" && contact.lifecycleState === "NEW_LEAD") {
      await ctx.db.patch(contact._id, {
        previousState: contact.lifecycleState,
        lifecycleState: "MQL",
        stateChangedAt: Date.now(),
      });
    }
    
    return { score, tier };
  },
});

/** Record activation milestone */
export const recordMilestone = mutation({
  args: {
    contactEmail: v.string(),
    milestone: v.string(),
  },
  handler: async (ctx, args) => {
    const contact = await ctx.db
      .query("lifecycleContacts")
      .withIndex("by_email", (q) => q.eq("email", args.contactEmail))
      .first();
    
    if (!contact) return null;
    
    const milestones = contact.activationMilestones || [];
    if (!milestones.includes(args.milestone)) {
      milestones.push(args.milestone);
    }
    
    // Calculate activation score (% of required milestones completed)
    const required = ACTIVATION_MILESTONES.filter(m => m !== "team_member_invited");
    const completed = required.filter(m => milestones.includes(m));
    const activationScore = Math.round((completed.length / required.length) * 100);
    
    // Check if fully activated
    const isActivated = milestones.includes("first_value_completed");
    
    const updates: any = {
      activationMilestones: milestones,
      activationScore,
    };
    
    if (isActivated && contact.lifecycleState === "CUSTOMER_NEW") {
      updates.previousState = contact.lifecycleState;
      updates.lifecycleState = "CUSTOMER_HEALTHY";
      updates.stateChangedAt = Date.now();
    }
    
    if (args.milestone === "first_value_completed") {
      updates.firstValueAt = Date.now();
    }
    
    await ctx.db.patch(contact._id, updates);
    
    return { activationScore, milestones, isActivated };
  },
});

/** Update health score */
export const updateHealthScore = mutation({
  args: {
    contactEmail: v.string(),
    scores: v.object({
      coreProductUsage: v.number(),    // 0-100
      activationAdoption: v.number(),  // 0-100
      businessOutcome: v.number(),     // 0-100
      supportReliability: v.number(),  // 0-100
      relationship: v.number(),        // 0-100
      commercialHealth: v.number(),    // 0-100
    }),
  },
  handler: async (ctx, args) => {
    const contact = await ctx.db
      .query("lifecycleContacts")
      .withIndex("by_email", (q) => q.eq("email", args.contactEmail))
      .first();
    
    if (!contact) return null;
    
    const healthScore = Math.round(
      (args.scores.coreProductUsage * HEALTH_WEIGHTS.core_product_usage +
       args.scores.activationAdoption * HEALTH_WEIGHTS.activation_adoption +
       args.scores.businessOutcome * HEALTH_WEIGHTS.business_outcome +
       args.scores.supportReliability * HEALTH_WEIGHTS.support_reliability +
       args.scores.relationship * HEALTH_WEIGHTS.relationship +
       args.scores.commercialHealth * HEALTH_WEIGHTS.commercial_health) / 100
    );
    
    // Determine health band: 80-100 healthy, 60-79 watch, 40-59 at risk, <40 critical
    const band = healthScore >= 80 ? "HEALTHY" : healthScore >= 60 ? "WATCH" : healthScore >= 40 ? "AT_RISK" : "CRITICAL";
    
    const updates: any = { healthScore, healthBand: band };
    
    // Auto-transition to at-risk if score drops
    if ((band === "AT_RISK" || band === "CRITICAL") && contact.lifecycleState === "CUSTOMER_HEALTHY") {
      updates.previousState = contact.lifecycleState;
      updates.lifecycleState = "CUSTOMER_AT_RISK";
      updates.stateChangedAt = Date.now();
    }
    
    // Auto-recover if score improves
    if (band === "HEALTHY" && contact.lifecycleState === "CUSTOMER_AT_RISK") {
      updates.previousState = contact.lifecycleState;
      updates.lifecycleState = "CUSTOMER_HEALTHY";
      updates.stateChangedAt = Date.now();
    }
    
    await ctx.db.patch(contact._id, updates);
    
    return { healthScore, band };
  },
});

// ═══ QUERIES ═══

/** Get lifecycle dashboard stats */
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const contacts = await ctx.db.query("lifecycleContacts").collect();
    
    const stateCounts: Record<string, number> = {};
    let totalLeadScore = 0;
    let totalHealthScore = 0;
    let customerCount = 0;
    
    for (const c of contacts) {
      stateCounts[c.lifecycleState] = (stateCounts[c.lifecycleState] || 0) + 1;
      totalLeadScore += c.leadScore;
      if (c.lifecycleState.startsWith("CUSTOMER")) {
        totalHealthScore += c.healthScore;
        customerCount++;
      }
    }
    
    return {
      totalContacts: contacts.length,
      stateCounts,
      avgLeadScore: contacts.length > 0 ? Math.round(totalLeadScore / contacts.length) : 0,
      avgHealthScore: customerCount > 0 ? Math.round(totalHealthScore / customerCount) : 0,
    };
  },
});

/** Get contacts by lifecycle state */
export const getContactsByState = query({
  args: { state: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lifecycleContacts")
      .withIndex("by_state", (q) => q.eq("lifecycleState", args.state))
      .collect();
  },
});

/** Get contact lifecycle history */
export const getContactHistory = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const contact = await ctx.db
      .query("lifecycleContacts")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!contact) return null;
    
    const events = await ctx.db
      .query("lifecycleEvents")
      .withIndex("by_email", (q) => q.eq("contactEmail", args.email))
      .order("desc")
      .take(50);
    
    return { contact, events };
  },
});

/** Get at-risk customers */
export const getAtRiskCustomers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("lifecycleContacts")
      .withIndex("by_state", (q) => q.eq("lifecycleState", "CUSTOMER_AT_RISK"))
      .collect();
  },
});

/** Get stalled trials (no activation progress) */
export const getStalledTrials = query({
  args: {},
  handler: async (ctx) => {
    const trials = await ctx.db
      .query("lifecycleContacts")
      .withIndex("by_state", (q) => q.eq("lifecycleState", "TRIAL_NEW"))
      .collect();
    
    const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
    return trials.filter(t => t.lastEventAt < twoDaysAgo);
  },
});

// ═══ HELPER FUNCTIONS ═══

function determineState(eventName: string, currentState: string): string | null {
  // State transition map based on events
  const transitions: Record<string, Record<string, string>> = {
    "lead_created": { "*": "NEW_LEAD" },
    "lead_qualified": { "NEW_LEAD": "MQL", "MQL": "MQL" },
    "demo_booked": { "*": "DEMO_BOOKED" },
    "demo_attended": { "DEMO_BOOKED": "SQL", "NO_SHOW": "SQL" },
    "demo_no_show": { "DEMO_BOOKED": "NO_SHOW" },
    "lead_disqualified": { "*": "CHURNED" },
    "account_created": { "*": "TRIAL_NEW" },
    "subscription_started": { "*": "CUSTOMER_NEW" },
    "first_value_completed": { "CUSTOMER_NEW": "CUSTOMER_HEALTHY", "TRIAL_NEW": "TRIAL_NEW" },
    "subscription_canceled": { "*": "CHURNED" },
    "payment_failed": { "CUSTOMER_HEALTHY": "CUSTOMER_AT_RISK", "CUSTOMER_NEW": "CUSTOMER_AT_RISK" },
    "payment_recovered": { "CUSTOMER_AT_RISK": "CUSTOMER_HEALTHY" },
    "review_submitted": { "CUSTOMER_HEALTHY": "ADVOCATE" },
    "opt_out": { "*": "COMPLIANCE_SUPPRESSED" },
  };
  
  const eventTransitions = transitions[eventName];
  if (!eventTransitions) return null;
  
  // Check for specific state transition first, then wildcard
  if (eventTransitions[currentState]) return eventTransitions[currentState];
  if (eventTransitions["*"]) return eventTransitions["*"];
  
  return null;
}
