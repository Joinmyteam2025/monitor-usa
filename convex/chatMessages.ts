import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("asc")
      .take(100);
  },
});

// Pre-built AI responses for common security questions
const AI_RESPONSES: Record<string, string> = {
  "arm": "To arm your system, go to your Dashboard or Properties page and tap the 'Armed' button on your property card. You can choose between Armed (home), Away (leaving), or Night mode. Your AI will start full monitoring immediately.",
  "false alarm": "If you receive a false alarm:\n1. Check the alert in your Alerts page\n2. Click 'Resolve' to dismiss it\n3. Check the device that triggered it — it may need repositioning\n4. Our AI learns from resolved false alarms and adjusts sensitivity automatically over time.",
  "ai monitoring": "MonitorUSA.ai uses advanced AI agents that:\n• Analyze sensor data in real-time\n• Cross-reference multiple sensors for accuracy\n• Assess threat level before dispatching\n• Respond in seconds, not minutes like traditional call centers\n• Learn your home patterns to reduce false alarms\n• Dispatch police, fire, or EMS automatically for verified threats",
  "security": "Top home security tips:\n1. Install sensors on all entry points (doors + windows)\n2. Place cameras at front door, back door, and garage\n3. Use motion sensors in main hallways\n4. Keep your emergency contacts up to date\n5. Test your system monthly\n6. Use 'Night' mode every evening for optimized monitoring\n7. Add smart locks for remote access control",
};

function generateResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return `Thank you for reaching out. I'm your MonitorUSA AI security assistant. I can help you with:\n\n• Arming/disarming your system\n• Understanding alerts and notifications\n• Device troubleshooting\n• Home security recommendations\n• Emergency contact management\n• Plan and billing questions\n\nWhat would you like help with?`;
}

export const send = mutation({
  args: { content: v.string() },
  handler: async (ctx, { content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Save user message
    await ctx.db.insert("chatMessages", {
      userId,
      role: "user",
      content,
      createdAt: Date.now(),
    });

    // Generate and save AI response
    const aiResponse = generateResponse(content);
    await ctx.db.insert("chatMessages", {
      userId,
      role: "assistant",
      content: aiResponse,
      createdAt: Date.now() + 1,
    });
  },
});
