/**
 * MonitorUSA Email Sequence Engine
 * ======================================
 * Complete email/SMS sequences from the Customer Lifecycle Blueprint.
 * 
 * Sequences:
 * 1. New Lead (Day 0-14): 8 emails + 4 SMS
 * 2. Demo Confirmation & Reminders
 * 3. No-Show Rescue
 * 4. 21-Day Decision Sequence
 * 5. Trial Onboarding (behavioral)
 * 6. Dunning / Failed Payment
 * 7. Win-Back
 * 
 * Exit rules: Reply, booking, signup, disqualification, or opt-out
 * immediately stops any active sequence.
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ═══ NEW LEAD SEQUENCE: Days 0-14 ═══
// Goal: Convert consented, unbooked lead into conversation, demo, or signup
export const NEW_LEAD_SEQUENCE = [
  {
    step: 1,
    channel: "email",
    delayHours: 0,
    subject: "Your MonitorUSA request is ready",
    body: `Hi {{first_name}},

Thanks for taking a look at MonitorUSA. We help businesses bring the work around a service into one connected system—from setup and scheduling through delivery, payment, communication, and growth, based on the features available in your plan.

The fastest next step is to choose what you want to accomplish:

1. Save administrative time
2. Improve the service and report workflow
3. Manage multiple team members
4. Replace or consolidate current software

Reply with the number that fits best, or use this link to book a short walkthrough: {{demo_link}}

— {{owner_name}}
MonitorUSA`,
  },
  {
    step: 2,
    channel: "sms",
    delayHours: 0,
    subject: "",
    body: `Hi {{first_name}}, this is {{owner_name}} with MonitorUSA. I saw your request — what is the biggest time drain in your inspection workflow right now? Reply and I'll point you to the right starting point. Or book a demo here: {{demo_link}}`,
  },
  {
    step: 3,
    channel: "email",
    delayHours: 2,
    subject: "See one inspection move from start to finish",
    body: `Hi {{first_name}},

Software is easier to judge when you can see the whole job move through it.

Watch this short walkthrough to see how MonitorUSA is designed to take an business from the first booking step to a completed customer experience: {{short_demo_link}}

As you watch, make a note of the task that currently wastes the most time in your company. Reply and tell me what it is. I'll point you to the most relevant workflow.

— {{owner_name}}`,
  },
  {
    step: 4,
    channel: "email",
    delayHours: 24,
    subject: "How many systems touch one inspection?",
    body: `Hi {{first_name}},

A single inspection can involve a calendar, text messages, email, agreements, invoices, payments, field notes, photos, reports, staff assignments, and follow-up.

When those steps live in different places, the owner becomes the integration.

MonitorUSA is being built to make the process easier to see, repeat, and improve. If you show me your current workflow, I'll help you identify where time and jobs are leaking.

Book a workflow review here: {{demo_link}}

— {{owner_name}}`,
  },
  {
    step: 5,
    channel: "sms",
    delayHours: 48,
    subject: "",
    body: `Quick question, {{first_name}}: which is the bigger problem for your business right now — (1) too much admin time, (2) inconsistent scheduling, (3) slow reports, or (4) managing a team? Reply 1-4.`,
  },
  {
    step: 6,
    channel: "email",
    delayHours: 72,
    subject: "Built for your kind of business",
    body: `Hi {{first_name}},

A solo team member and a ten-team member company should not receive the same demonstration.

For a solo owner, the focus is usually speed, professionalism, and fewer late nights.
For a growing team, the focus is scheduling, permissions, handoffs, consistency, and visibility.

Which describes you?

A. Solo
B. 2–5 team members
C. 6–15 team members
D. 16+ or multiple locations

Reply with A, B, C, or D and I'll send the right overview.

— {{owner_name}}`,
  },
  {
    step: 7,
    channel: "email",
    delayHours: 120,
    subject: "Switching software should not feel dangerous",
    body: `Hi {{first_name}},

The biggest concern for many established businesses is not whether new software looks better. It is whether switching will interrupt the business.

A responsible migration plan should answer:

• What data and templates can move?
• What must be rebuilt?
• How will the team be trained?
• Can the workflow be tested before go-live?
• What is the rollback plan?

If you are considering a switch, request a migration review here: {{migration_link}}

We will map the transition before asking you to make a decision.

— {{owner_name}}`,
  },
  {
    step: 8,
    channel: "email",
    delayHours: 168,
    subject: "What would MonitorUSA need to prove?",
    body: `Hi {{first_name}},

Before you change anything, what would MonitorUSA need to prove to earn your business?

Is it faster reporting, simpler scheduling, better team control, easier payments, stronger follow-up, better support, or something else?

Reply with the honest answer. Your response will determine what we show you—and whether MonitorUSA is actually a fit.

If you prefer, choose a demo time here: {{demo_link}}

— {{owner_name}}`,
  },
  {
    step: 9,
    channel: "sms",
    delayHours: 168,
    subject: "",
    body: `What would MonitorUSA need to prove before you would consider switching? Reply with one thing — I'll show you exactly how we handle it.`,
  },
  {
    step: 10,
    channel: "email",
    delayHours: 240,
    subject: "Put a number on the hours you lose",
    body: `Hi {{first_name}},

If your company loses only 30 minutes of avoidable administration per inspection, 40 inspections a month equals 20 hours.

Use our workflow time calculator to estimate the cost of scheduling, duplicate entry, chasing agreements, payment follow-up, report cleanup, and manual customer messages: {{calculator_link}}

Bring the result to a walkthrough and we'll focus on the highest-value bottleneck first.

— {{owner_name}}`,
  },
  {
    step: 11,
    channel: "email",
    delayHours: 336,
    subject: "Should I keep this open?",
    body: `Hi {{first_name}},

I do not want to fill your inbox with messages that are not useful.

Which next step would you prefer?

1. Book a short MonitorUSA demo: {{demo_link}}
2. Send me educational resources only
3. Revisit this in 30 days
4. Close my request

Reply with the number. If now is not the right time, that is completely fine.

— {{owner_name}}`,
  },
  {
    step: 12,
    channel: "sms",
    delayHours: 336,
    subject: "",
    body: `Should I keep your MonitorUSA request open, send resources instead, or check back later? Just reply with what you prefer. — {{owner_name}}`,
  },
];

// ═══ DEMO CONFIRMATION SEQUENCE ═══
export const DEMO_CONFIRMATION_SEQUENCE = [
  {
    step: 1,
    channel: "email",
    delayHours: 0,
    subject: "Confirmed: your MonitorUSA walkthrough",
    body: `Hi {{first_name}},

Your MonitorUSA walkthrough is confirmed for {{date}} at {{time}} {{timezone}}.

Join: {{meeting_link}}
Reschedule: {{reschedule_link}}

We will use the time to:

1. Map how your company handles a service today.
2. Show the MonitorUSA workflow most relevant to your goals.
3. Decide whether the platform is a fit and identify the next step.

To make the session useful, reply with:

• Number of team members
• Approximate inspections per month
• Current software
• The step you most want to improve

If another decision-maker or operations lead should attend, forward this invitation.

— {{owner_name}}`,
  },
  {
    step: 2,
    channel: "sms",
    delayHours: 0,
    subject: "",
    body: `Confirmed: MonitorUSA walkthrough on {{date}} at {{time}}. Join: {{meeting_link}} — Reply with your # of team members and current software so we can customize. — {{owner_name}}`,
  },
  {
    step: 3,
    channel: "email",
    delayHours: -24, // 24 hours BEFORE demo
    subject: "Tomorrow: your MonitorUSA walkthrough",
    body: `Hi {{first_name}},

Quick reminder — your MonitorUSA walkthrough is tomorrow at {{time}} {{timezone}}.

Join: {{meeting_link}}

We'll focus on your stated goal and show the most relevant workflow. If anyone else should attend, forward this link.

See you tomorrow.

— {{owner_name}}`,
  },
  {
    step: 4,
    channel: "sms",
    delayHours: -2, // 2 hours BEFORE demo
    subject: "",
    body: `Your MonitorUSA walkthrough starts in 2 hours. Join here: {{meeting_link}} — {{owner_name}}`,
  },
  {
    step: 5,
    channel: "sms",
    delayHours: -0.17, // 10 minutes BEFORE
    subject: "",
    body: `Starting in 10 minutes: {{meeting_link}}`,
  },
];

// ═══ NO-SHOW RESCUE SEQUENCE ═══
export const NO_SHOW_SEQUENCE = [
  {
    step: 1,
    channel: "sms",
    delayHours: 0.17, // 10 minutes after missed demo
    subject: "",
    body: `I'm on the MonitorUSA call and wanted to make sure you're okay. Here's the link if you can still join: {{meeting_link}} — Otherwise, grab a new time: {{reschedule_link}}`,
  },
  {
    step: 2,
    channel: "email",
    delayHours: 0.5, // 30 minutes after
    subject: "We missed you — here's a quick rebook link",
    body: `Hi {{first_name}},

No worries at all — things come up. Here's a quick link to rebook your MonitorUSA walkthrough at a time that works better: {{reschedule_link}}

In the meantime, here's a 2-minute overview of the platform: {{short_demo_link}}

— {{owner_name}}`,
  },
  {
    step: 3,
    channel: "sms",
    delayHours: 18, // Next morning
    subject: "",
    body: `Hi {{first_name}}, was it a timing issue or did something change about your interest in MonitorUSA? Either way is fine — just want to know the best next step. {{reschedule_link}}`,
  },
  {
    step: 4,
    channel: "email",
    delayHours: 72, // Day 3
    subject: "One relevant example for your business",
    body: `Hi {{first_name}},

Here's a quick case study showing how a {{segment}} business used MonitorUSA to {{outcome}}: {{case_study_link}}

If this resonates, rebook your walkthrough here: {{reschedule_link}}

— {{owner_name}}`,
  },
  {
    step: 5,
    channel: "email",
    delayHours: 168, // Day 7
    subject: "Closing the loop on your MonitorUSA demo",
    body: `Hi {{first_name}},

I'm closing the active follow-up on your missed walkthrough. If you'd like to revisit later, here are your options:

1. Rebook anytime: {{reschedule_link}}
2. Watch the self-guided overview: {{short_demo_link}}
3. Start a free trial directly: {{signup_link}}

No pressure — just wanted to leave the door open.

— {{owner_name}}`,
  },
];

// ═══ 21-DAY DECISION SEQUENCE (post-demo, no decision yet) ═══
export const DECISION_SEQUENCE = [
  {
    step: 1, channel: "email", delayHours: 0,
    subject: "Your MonitorUSA walkthrough recap",
    body: `Hi {{first_name}},

Thanks for your time today. Here's a quick recap:

Current state: {{current_state}}
Target state: {{target_state}}
Recommended plan: {{recommended_plan}}
Agreed next step: {{next_step}}

If you have questions or want to revisit anything, reply here or book a follow-up: {{followup_link}}

— {{owner_name}}`,
  },
  {
    step: 2, channel: "email", delayHours: 24,
    subject: "The information you requested",
    body: `Hi {{first_name}},

Following up with the {{requested_info}} you asked about during our walkthrough.

{{proof_content}}

Let me know if this answers your question or if you need anything else.

— {{owner_name}}`,
  },
  {
    step: 3, channel: "email", delayHours: 72,
    subject: "The cost of waiting",
    body: `Hi {{first_name}},

Based on your numbers — {{monthly_volume}} inspections/month at roughly {{time_per_inspection}} minutes of avoidable admin — your company is spending approximately {{total_hours}} hours per month on work MonitorUSA can handle.

At your billing rate, that's roughly ${"{{cost}}"} per month in lost capacity.

Worth a conversation? {{followup_link}}

— {{owner_name}}`,
  },
  {
    step: 4, channel: "email", delayHours: 120,
    subject: "A company like yours made the switch",
    body: `Hi {{first_name}},

Here's how a {{similar_segment}} business handled the transition to MonitorUSA: {{case_study_link}}

Key results: {{key_results}}

Reply with any concern and I'll address it directly.

— {{owner_name}}`,
  },
  {
    step: 5, channel: "email", delayHours: 168,
    subject: "What's preventing a decision?",
    body: `Hi {{first_name}},

Common reasons businesses hesitate:

• Migration risk — we handle data transfer and templates
• Team adoption — we train every team member
• Cost — the platform pays for itself in 3 inspections
• Current contract — we can plan around your timeline
• Need more proof — tell me what would convince you

Which one applies? Reply honestly and I'll address it.

— {{owner_name}}`,
  },
  {
    step: 6, channel: "email", delayHours: 240,
    subject: "Decision checklist: is MonitorUSA right for you?",
    body: `Hi {{first_name}},

MonitorUSA is a good fit if:
✅ You run a property business
✅ You want scheduling, reports, payments, and client communication in one place
✅ You value time saved over feature count
✅ You want to grow without adding admin staff

MonitorUSA may NOT be a good fit if:
❌ You only need a standalone report writer
❌ You have no interest in digital workflows
❌ You're not ready to change any part of your process

If the first list describes you, let's finalize: {{followup_link}}

— {{owner_name}}`,
  },
  {
    step: 7, channel: "email", delayHours: 336,
    subject: "Honest question",
    body: `Hi {{first_name}},

What is genuinely preventing a decision? I'd rather know the real answer than keep following up.

Reply with one sentence. If MonitorUSA isn't the right fit, that's completely fine — I'll close this out respectfully.

— {{owner_name}}`,
  },
  {
    step: 8, channel: "email", delayHours: 504,
    subject: "Closing the loop",
    body: `Hi {{first_name}},

I'm moving your request to long-term follow-up. If your situation changes, here are your options:

1. Book a walkthrough anytime: {{demo_link}}
2. Start a free trial: {{signup_link}}
3. Request educational resources: reply "resources"

I'll check in once in 90 days unless you tell me otherwise. Thanks for your time.

— {{owner_name}}`,
  },
];

// ═══ TRIAL ONBOARDING SEQUENCE (behavioral, event-based) ═══
export const TRIAL_ONBOARDING_SEQUENCE = [
  {
    step: 1, channel: "email", delayHours: 0, triggerEvent: "account_created",
    subject: "Welcome to MonitorUSA — complete these first 3 steps",
    body: `Your account is ready. Start with company profile, services, and your first test inspection. Here's your personalized checklist: {{checklist_link}}

Complete these 3 steps and you'll have a working inspection workflow in under 30 minutes.`,
  },
  {
    step: 2, channel: "email", delayHours: 1, triggerEvent: "!onboarding_started",
    subject: "One click to get started",
    body: `You created your MonitorUSA account but haven't started setup yet. Click here to pick up where you left off: {{return_link}}

It takes about 5 minutes to complete step 1.`,
  },
  {
    step: 3, channel: "email", delayHours: 24, triggerEvent: "!company_profile_completed",
    subject: "Finish the foundation of your account",
    body: `MonitorUSA uses your company details to personalize customer-facing reports, agreements, and communications. Complete your company profile to unlock the next step: {{profile_link}}`,
  },
  {
    step: 4, channel: "email", delayHours: 48, triggerEvent: "!service_catalog_configured",
    subject: "Tell MonitorUSA what you inspect",
    body: `Add the services you actually sell, your base pricing rules, and any ancillary add-ons. This takes about 3 minutes and unlocks scheduling and quoting: {{services_link}}`,
  },
  {
    step: 5, channel: "email", delayHours: 72, triggerEvent: "!calendar_connected",
    subject: "Make your availability bookable",
    body: `Connect your calendar so MonitorUSA can schedule around your real availability. Supports Google Calendar, Outlook, and iCal: {{calendar_link}}`,
  },
  {
    step: 6, channel: "email", delayHours: 96, triggerEvent: "!template_ready",
    subject: "Pick your inspection template",
    body: `Choose from our library of 300+ point checklists or import your own template. This is the foundation of every report you'll deliver: {{templates_link}}`,
  },
  {
    step: 7, channel: "email", delayHours: 120, triggerEvent: "!first_inspection_scheduled",
    subject: "Run your first test inspection",
    body: `The fastest way to understand MonitorUSA is to run one complete workflow. Schedule a test inspection (you can use a fake address) and walk through every step: {{test_link}}`,
  },
  {
    step: 8, channel: "email", delayHours: 168, triggerEvent: "stalled",
    subject: "Where did setup get stuck?",
    body: `I can see that setup has not reached the next milestone. Which of these is blocking you?

1. I got confused on a step
2. I need to connect something that isn't working
3. I haven't had time yet
4. I'm not sure this is the right software

Reply with the number and I'll help immediately. Or book a free activation session: {{activation_link}}`,
  },
];

// ═══ DUNNING SEQUENCE (failed payment recovery) ═══
export const DUNNING_SEQUENCE = [
  {
    step: 1, channel: "email", delayHours: 0,
    subject: "Action needed: payment update required",
    body: `Hi {{first_name}},

Your latest MonitorUSA payment of {{amount}} did not process successfully.

Invoice: {{invoice_id}}
Amount: {{amount}}
Due: {{due_date}}

Please update your payment method here: {{update_link}}

If you need help or have questions about your account, contact support: {{support_link}}

— MonitorUSA Billing`,
  },
  {
    step: 2, channel: "email", delayHours: 48,
    subject: "Payment reminder — update your method",
    body: `Hi {{first_name}},

This is a reminder that your payment of {{amount}} is still outstanding. Common causes include expired card, insufficient funds, or a changed card number.

Update here: {{update_link}}

We also accept ACH bank transfers if that's easier: {{ach_link}}

— MonitorUSA Billing`,
  },
  {
    step: 3, channel: "email", delayHours: 120,
    subject: "Important: your MonitorUSA account",
    body: `Hi {{first_name}},

Your payment of {{amount}} remains unresolved. To avoid any interruption to your inspection workflows, please update your payment method by {{deadline}}: {{update_link}}

If there's a billing question or account concern, reply to this email — a real person will respond within one business day.

— MonitorUSA Billing`,
  },
  {
    step: 4, channel: "email", delayHours: 168,
    subject: "Final notice: service impact on {{deadline}}",
    body: `Hi {{first_name}},

Your MonitorUSA account has an outstanding balance of {{amount}}. Without payment by {{deadline}}, access to scheduling, reports, and client-facing features may be restricted.

Your data will be preserved according to our data retention policy.

Update now: {{update_link}}
Contact billing: {{support_link}}

We want to keep you — please reach out if there's an issue we can help resolve.

— MonitorUSA Billing`,
  },
  {
    step: 5, channel: "email", delayHours: 0, // Triggered on payment recovery
    subject: "Payment confirmed — you're all set",
    body: `Hi {{first_name}},

Your payment of {{amount}} has been processed successfully. Your MonitorUSA account is fully active.

Receipt: {{receipt_link}}

Thank you for continuing with MonitorUSA. If you need anything, we're here.

— MonitorUSA Billing`,
  },
];

// ═══ SEQUENCE MANAGEMENT MUTATIONS ═══

/** Enroll a contact in a sequence */
export const enrollInSequence = mutation({
  args: {
    contactEmail: v.string(),
    sequenceName: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already enrolled in this sequence
    const existing = await ctx.db
      .query("sequenceEnrollments")
      .withIndex("by_email", (q) => q.eq("contactEmail", args.contactEmail))
      .filter((q) => q.and(
        q.eq(q.field("sequenceName"), args.sequenceName),
        q.eq(q.field("status"), "active"),
      ))
      .first();
    
    if (existing) return { enrolled: false, reason: "already_active" };
    
    const id = await ctx.db.insert("sequenceEnrollments", {
      contactEmail: args.contactEmail,
      sequenceName: args.sequenceName,
      currentStep: 0,
      status: "active",
      enrolledAt: Date.now(),
    });
    
    return { enrolled: true, enrollmentId: id };
  },
});

/** Exit a contact from all active sequences (on reply, booking, signup, opt-out) */
export const exitAllSequences = mutation({
  args: {
    contactEmail: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const active = await ctx.db
      .query("sequenceEnrollments")
      .withIndex("by_email", (q) => q.eq("contactEmail", args.contactEmail))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    
    let exited = 0;
    for (const enrollment of active) {
      await ctx.db.patch(enrollment._id, {
        status: "exited",
        exitReason: args.reason,
      });
      exited++;
    }
    
    return { exited };
  },
});

/** Get active sequences for a contact */
export const getActiveSequences = query({
  args: { contactEmail: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sequenceEnrollments")
      .withIndex("by_email", (q) => q.eq("contactEmail", args.contactEmail))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
  },
});
