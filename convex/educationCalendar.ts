/**
 * 52-Week Customer Education Calendar
 * =====================================
 * One email per week to healthy customers, personalized by role,
 * plan, company size, season, and feature usage.
 * 
 * Transactional notices and risk interventions are separate.
 * Education stops if health score drops below threshold.
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ═══ FULL 52-WEEK CALENDAR ═══
export const EDUCATION_CALENDAR = [
  { week: 1,  subject: "Your 30-minute MonitorUSA setup plan", lesson: "Complete the next incomplete milestone", cta: "Open checklist", category: "onboarding" },
  { week: 2,  subject: "Build one clea service workflow", lesson: "Run a test job end to end", cta: "Start test", category: "onboarding" },
  { week: 3,  subject: "Set services and pricing once", lesson: "Reduce repeated entry", cta: "Review services", category: "onboarding" },
  { week: 4,  subject: "Make your availability bookable", lesson: "Improve scheduling reliability", cta: "Configure calendar", category: "onboarding" },
  { week: 5,  subject: "Create a professional agreement flow", lesson: "Reduce unsigned-work risk", cta: "Review agreements", category: "workflow" },
  { week: 6,  subject: "Collect payment without chasing", lesson: "Improve payment completion", cta: "Review payment settings", category: "workflow" },
  { week: 7,  subject: "Build a reusable inspection template", lesson: "Increase consistency", cta: "Open templates", category: "workflow" },
  { week: 8,  subject: "Make customer messages sound like your brand", lesson: "Improve experience", cta: "Edit messages", category: "workflow" },
  { week: 9,  subject: "The pre-inspection communication checklist", lesson: "Set expectations", cta: "Use checklist", category: "workflow" },
  { week: 10, subject: "The day-of-inspection workflow", lesson: "Eliminate missed steps", cta: "View workflow", category: "workflow" },
  { week: 11, subject: "Deliver reports customers can understand", lesson: "Improve clarity and trust", cta: "Review output", category: "workflow" },
  { week: 12, subject: "Ask for a review at the right moment", lesson: "Generate reputation after value", cta: "Enable request", category: "growth" },
  { week: 13, subject: "Quarter 1 value review", lesson: "Show usage and outcomes", cta: "View account summary", category: "review" },
  { week: 14, subject: "Add ancillary services without chaos", lesson: "Increase revenue per job", cta: "Review service options", category: "growth" },
  { week: 15, subject: "Reduce scheduling gaps", lesson: "Use availability and capacity", cta: "Review calendar", category: "optimization" },
  { week: 16, subject: "Create a backup administrator", lesson: "Reduce account risk", cta: "Invite teammate", category: "team" },
  { week: 17, subject: "Standardize team permissions", lesson: "Give the right access", cta: "Review roles", category: "team" },
  { week: 18, subject: "Train a new team member faster", lesson: "Create repeatable onboarding", cta: "Open training", category: "team" },
  { week: 19, subject: "Spot incomplete jobs before they become problems", lesson: "Use exception reporting", cta: "View exceptions", category: "optimization" },
  { week: 20, subject: "Know which agents and partners send business", lesson: "Track referral sources", cta: "Review source data", category: "growth" },
  { week: 21, subject: "Improve your booking conversion", lesson: "Remove friction in inquiry-to-booking", cta: "Audit booking", category: "optimization" },
  { week: 22, subject: "Automate without sounding robotic", lesson: "Use behavior and plain language", cta: "Review automations", category: "optimization" },
  { week: 23, subject: "Create a cancellation and reschedule policy", lesson: "Protect capacity", cta: "Review policy", category: "workflow" },
  { week: 24, subject: "Clean your client and agent data", lesson: "Improve deliverability and reporting", cta: "Run cleanup", category: "optimization" },
  { week: 25, subject: "Quarter 2 workflow audit", lesson: "Compare process to baseline", cta: "Book review", category: "review" },
  { week: 26, subject: "Midyear MonitorUSA value report", lesson: "Quantify activity and outcomes", cta: "View report", category: "review" },
  { week: 27, subject: "Plan for busy-season capacity", lesson: "Prepare calendars, staff, templates", cta: "Use planner", category: "seasonal" },
  { week: 28, subject: "Plan for slow-season demand", lesson: "Activate re-engagement and partnerships", cta: "Use campaign", category: "seasonal" },
  { week: 29, subject: "Build a realtor partner experience", lesson: "Make referrals easy and professional", cta: "Review partner flow", category: "growth" },
  { week: 30, subject: "Build a buyer experience people remember", lesson: "Improve clarity and follow-through", cta: "Review client flow", category: "workflow" },
  { week: 31, subject: "Use photos and media consistently", lesson: "Improve documentation quality", cta: "Review standards", category: "workflow" },
  { week: 32, subject: "Reduce report rework", lesson: "Create QA checks", cta: "Open QA checklist", category: "optimization" },
  { week: 33, subject: "Know your average revenue per inspection", lesson: "Improve business visibility", cta: "View metric", category: "metrics" },
  { week: 34, subject: "Know your time per inspection", lesson: "Find operational bottlenecks", cta: "Track time", category: "metrics" },
  { week: 35, subject: "Know your attach rate by service", lesson: "Find responsible expansion", cta: "View services", category: "metrics" },
  { week: 36, subject: "Know your unpaid and unsigned jobs", lesson: "Resolve exceptions", cta: "View exception list", category: "metrics" },
  { week: 37, subject: "Quarter 3 business review", lesson: "Set next 90-day goal", cta: "Book review", category: "review" },
  { week: 38, subject: "Prepare a clean software migration", lesson: "Protect data and operations", cta: "Use migration checklist", category: "operations" },
  { week: 39, subject: "Document your company's standard operating procedure", lesson: "Reduce owner dependence", cta: "Download SOP", category: "operations" },
  { week: 40, subject: "Create an incident and support escalation plan", lesson: "Respond clearly when systems fail", cta: "Review plan", category: "operations" },
  { week: 41, subject: "Protect account access", lesson: "Use strong access and role practices", cta: "Review security", category: "operations" },
  { week: 42, subject: "Archive and retain records responsibly", lesson: "Apply the published retention policy", cta: "Review settings", category: "operations" },
  { week: 43, subject: "Improve customer feedback collection", lesson: "Turn comments into action", cta: "Send survey", category: "growth" },
  { week: 44, subject: "Turn a success into a case study", lesson: "Document measurable proof", cta: "Nominate account", category: "advocacy" },
  { week: 45, subject: "Refer an business you respect", lesson: "Invite only when value is proven", cta: "Refer", category: "advocacy" },
  { week: 46, subject: "Plan next year's services", lesson: "Align catalog and capacity", cta: "Review plan", category: "planning" },
  { week: 47, subject: "Plan next year's team", lesson: "Model seats, roles, and territories", cta: "Open planner", category: "planning" },
  { week: 48, subject: "Plan next year's technology stack", lesson: "Consolidate responsibly", cta: "Book architecture review", category: "planning" },
  { week: 49, subject: "Your annual usage highlights", lesson: "Show personalized value", cta: "View summary", category: "review" },
  { week: 50, subject: "Your next-best MonitorUSA capability", lesson: "Recommend based on unused relevant value", cta: "Explore feature", category: "growth" },
  { week: 51, subject: "Prepare for renewal with no surprises", lesson: "Confirm term, contacts, and value", cta: "Review renewal", category: "renewal" },
  { week: 52, subject: "Set your next 12-month success plan", lesson: "Agree goals and cadence", cta: "Book annual review", category: "renewal" },
];

// ═══ ENROLLMENT ═══

/** Enroll a customer in the education calendar */
export const enrollInEducation = mutation({
  args: {
    contactEmail: v.string(),
    startWeek: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if already enrolled
    const existing = await ctx.db
      .query("educationEnrollments")
      .withIndex("by_email", (q) => q.eq("contactEmail", args.contactEmail))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (existing) return { enrolled: false, reason: "already_active" };

    const id = await ctx.db.insert("educationEnrollments", {
      contactEmail: args.contactEmail,
      currentWeek: args.startWeek ?? 1,
      status: "active",
      enrolledAt: Date.now(),
      lastSentAt: 0,
      completedWeeks: [],
      pauseReason: "",
    });

    return { enrolled: true, enrollmentId: id };
  },
});

/** Get the next education email to send for a contact */
export const getNextEducationEmail = query({
  args: { contactEmail: v.string() },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db
      .query("educationEnrollments")
      .withIndex("by_email", (q) => q.eq("contactEmail", args.contactEmail))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!enrollment) return null;

    const week = EDUCATION_CALENDAR.find(w => w.week === enrollment.currentWeek);
    if (!week) return null;

    return {
      enrollment,
      email: week,
      daysSinceLastSent: enrollment.lastSentAt > 0
        ? Math.floor((Date.now() - enrollment.lastSentAt) / (1000 * 60 * 60 * 24))
        : null,
    };
  },
});

/** Mark a week as sent and advance to next */
export const advanceEducationWeek = mutation({
  args: { contactEmail: v.string() },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db
      .query("educationEnrollments")
      .withIndex("by_email", (q) => q.eq("contactEmail", args.contactEmail))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!enrollment) return null;

    const completedWeeks = [...enrollment.completedWeeks, enrollment.currentWeek];
    const nextWeek = enrollment.currentWeek + 1;

    if (nextWeek > 52) {
      await ctx.db.patch(enrollment._id, {
        completedWeeks,
        status: "completed",
        lastSentAt: Date.now(),
      });
      return { completed: true, week: 52 };
    }

    await ctx.db.patch(enrollment._id, {
      currentWeek: nextWeek,
      completedWeeks,
      lastSentAt: Date.now(),
    });

    return { completed: false, nextWeek };
  },
});

/** Pause education for at-risk customers */
export const pauseEducation = mutation({
  args: {
    contactEmail: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db
      .query("educationEnrollments")
      .withIndex("by_email", (q) => q.eq("contactEmail", args.contactEmail))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!enrollment) return null;

    await ctx.db.patch(enrollment._id, {
      status: "paused",
      pauseReason: args.reason,
    });

    return { paused: true };
  },
});

/** Resume education */
export const resumeEducation = mutation({
  args: { contactEmail: v.string() },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db
      .query("educationEnrollments")
      .withIndex("by_email", (q) => q.eq("contactEmail", args.contactEmail))
      .filter((q) => q.eq(q.field("status"), "paused"))
      .first();

    if (!enrollment) return null;

    await ctx.db.patch(enrollment._id, {
      status: "active",
      pauseReason: "",
    });

    return { resumed: true, currentWeek: enrollment.currentWeek };
  },
});

/** Get education stats */
export const getEducationStats = query({
  args: {},
  handler: async (ctx) => {
    const enrollments = await ctx.db.query("educationEnrollments").collect();

    const stats = {
      total: enrollments.length,
      active: enrollments.filter(e => e.status === "active").length,
      paused: enrollments.filter(e => e.status === "paused").length,
      completed: enrollments.filter(e => e.status === "completed").length,
      avgWeek: 0,
    };

    const activeEnrollments = enrollments.filter(e => e.status === "active");
    if (activeEnrollments.length > 0) {
      stats.avgWeek = Math.round(
        activeEnrollments.reduce((sum, e) => sum + e.currentWeek, 0) / activeEnrollments.length
      );
    }

    return stats;
  },
});
