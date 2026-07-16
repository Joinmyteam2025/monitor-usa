"use node";
declare const process: { env: Record<string, string | undefined> };

import { action } from "./_generated/server";
import { v } from "convex/values";

/* ═══════════════════════════════════════════════════════════
   MONITORUSA — Stripe Checkout
   ═══════════════════════════════════════════════════════════ */

const VALID_PRICES: Record<string, { plan: string; billing: string }> = {
  // Smart Watch $14.99/mo
  "price_1Tte0vDal1LtHX1Vfcl42U9K": { plan: "smart_watch", billing: "monthly" },
  // AI Protect $24.99/mo
  "price_1Tte0vDal1LtHX1V13waLHxt": { plan: "ai_protect", billing: "monthly" },
  // Total Command $34.99/mo
  "price_1Tte0wDal1LtHX1ViIQuxxTT": { plan: "total_command", billing: "monthly" },
};

export const createCheckoutSession = action({
  args: {
    priceId: v.string(),
  },
  handler: async (_ctx, { priceId }) => {
    const STRIPE_SK =
      process.env.STRIPE_SECRET_KEY ||
      "STRIPE_KEY_REMOVED";

    const priceInfo = VALID_PRICES[priceId];
    if (!priceInfo) throw new Error("Invalid price ID.");

    const siteUrl = process.env.SITE_URL || "https://monitorusa.ai";

    const params = new URLSearchParams();
    params.append("mode", "subscription");
    params.append("line_items[0][price]", priceId);
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", `${siteUrl}/dashboard?checkout=success`);
    params.append("cancel_url", `${siteUrl}/?checkout=cancelled`);
    params.append("allow_promotion_codes", "true");
    params.append("billing_address_collection", "required");
    params.append("metadata[plan]", priceInfo.plan);
    params.append("metadata[billing]", priceInfo.billing);
    params.append("metadata[portal]", "monitor-usa");
    params.append("subscription_data[metadata][plan]", priceInfo.plan);
    params.append("subscription_data[metadata][portal]", "monitor-usa");

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SK}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const body = await resp.json();
    if (!resp.ok) {
      const msg = body?.error?.message || "Stripe error";
      console.error("Stripe error:", JSON.stringify(body?.error || body));
      throw new Error(msg);
    }

    return { url: body.url as string };
  },
});
