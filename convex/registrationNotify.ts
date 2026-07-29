/**
 * Registration Notification System — MonitorUSA.ai
 * Sends new signups to:
 * 1. #portal_signups Slack channel
 * 2. Google Sheet (appended)
 * 3. GoHighLevel CRM with tags
 * 4. Welcome SMS from Ashley via GHL
 * 5. Ashley AI phone call via Bland.ai
 * 6. SMS alert to Zach
 */
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

declare const process: { env: Record<string, string | undefined> };

const VIKTOR_API_URL = process.env.VIKTOR_SPACES_API_URL!;
const PROJECT_NAME = process.env.VIKTOR_SPACES_PROJECT_NAME!;
const PROJECT_SECRET = process.env.VIKTOR_SPACES_PROJECT_SECRET!;

const SLACK_CHANNEL_ID = "C0AUU85MMTP"; // #portal_signups
const SHEETS_ID = "1OhOP8Cr1lR0xDFqvt3NmOb5wrdUCmIVgkke-MqMlKdg";
const GHL_LOCATION_ID = "X3wPZkYJBsP9at86EkcU";
const BLAND_API_KEY = "org_0ca6fb21ed983389d4677569433f2d9b546873e085c9b6237bdd0405e3ffe8c340e053ee70b34dcdd16069";
const ZACH_PHONE = "+12089128555";
const ZACH_GHL_CONTACT_ID = "f6HcrwjJQN0GWf0Il0Ob";

async function callTool<T>(role: string, args: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`${VIKTOR_API_URL}/api/viktor-spaces/tools/call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_name: PROJECT_NAME,
      project_secret: PROJECT_SECRET,
      role,
      arguments: args,
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  const json = await response.json();
  if (!json.success) throw new Error(json.error ?? "Tool call failed");
  return json.result as T;
}

export const notifyNewRegistration = internalAction({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (_ctx, args) => {
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Phoenix", month: "2-digit", day: "2-digit", year: "numeric",
      hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
    });
    const fullName = `${args.firstName} ${args.lastName}`.trim();

    // 1. Slack
    try {
      await callTool("coworker_send_slack_message", {
        channel_id: SLACK_CHANNEL_ID, do_send: true,
        blocks: [{ type: "section", text: { type: "mrkdwn",
          text: `🛡️ *New MonitorUSA.ai Signup*\n\n*Name:* ${fullName}\n*Email:* ${args.email}\n*Phone:* ${args.phone || "-"}\n*Timestamp:* ${timestamp}` } }],
      });
    } catch (err) { console.error("Slack failed:", err); }

    // 2. Google Sheet
    try {
      const csvRow = [args.firstName, args.lastName, args.email, args.phone || "", "monitor_usa", timestamp]
        .map(v => `"${v.replace(/"/g, '""')}"`)
        .join(",");
      await callTool("mcp_gdrive_google_sheets_write", { unified_uri: SHEETS_ID, values_csv: csvRow, sheet_name: "Sheet1" });
    } catch (err) { console.error("Sheet failed:", err); }

    // 3. GHL CRM
    try {
      await callTool("mcp_pd_highlevel_oauth_proxy_post", {
        url: "https://services.leadconnectorhq.com/contacts/upsert",
        headers: { "Version": "2021-07-28" },
        json_body: {
          locationId: GHL_LOCATION_ID, firstName: args.firstName, lastName: args.lastName,
          email: args.email, phone: args.phone || "",
          tags: ["monitor_usa", "portal_signup", "sms_drip_active"],
          source: "MonitorUSA.ai",
          assignedTo: "avHlGDIykH1DOrrGEKuv",
        },
      });
    } catch (err) { console.error("GHL failed:", err); }

    // 4. Welcome SMS
    if (args.phone) {
      try {
        const sr = await callTool<any>("mcp_pd_highlevel_oauth_proxy_get", {
          url: "https://services.leadconnectorhq.com/contacts/",
          query_params: { locationId: GHL_LOCATION_ID, query: args.email, limit: "1" },
          headers: { "Version": "2021-07-28" },
        });
        const body = typeof sr === "string" ? JSON.parse(sr) : sr;
        const parsed = body?.body || body;
        const contactId = parsed?.contacts?.[0]?.id;
        if (contactId) {
          await callTool("mcp_pd_highlevel_oauth_proxy_post", {
            url: "https://services.leadconnectorhq.com/conversations/messages",
            headers: { "Version": "2021-07-28" },
            json_body: { type: "SMS", contactId,
              message: `Hey {name}! 👋 This is Ashley from MonitorUSA.ai. Welcome! 🎉 Your AI-powered home security monitoring dashboard is ready. Set up your system, check alerts, and monitor your property 24/7. Reply here if you need help getting started!`.replace("{name}", args.firstName),
            },
          });
          await new Promise(r => setTimeout(r, 5000));
          await callTool("mcp_pd_highlevel_oauth_proxy_post", {
            url: "https://services.leadconnectorhq.com/conversations/messages",
            headers: { "Version": "2021-07-28" },
            json_body: { type: "SMS", contactId,
              message: `Quick question — do you already have a security system installed, or are you looking to set one up from scratch? I can guide you either way 🛡️`,
            },
          });
        }
      } catch (err) { console.error("SMS failed:", err); }
    }

    // 5. Ashley AI Call
    if (args.phone) {
      try {
        const ph = args.phone.startsWith("+") ? args.phone : `+1${args.phone.replace(/\D/g, "")}`;
        const resp = await fetch("https://api.bland.ai/v1/calls", {
          method: "POST",
          headers: { "Authorization": `Bearer ${BLAND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: ph,
            task: `You are Ashley from MonitorUSA.ai — an AI-powered home security alarm monitoring platform. You are calling {name} who just signed up. Your goal: Welcome them, ask about their home security needs, and help them set up monitoring. Key features: 24/7 AI monitoring, smart alerts, real-time dashboard, professional dispatch, and affordable monthly plans. Keep it brief, warm, and professional. If they want to speak with Zach, transfer the call.`.replace(/{name}/g, fullName),
            voice: "Jane",
            transfer_phone_number: ZACH_PHONE,
            max_duration: 120,
            first_sentence: `Hey {first}! This is Ashley from MonitorUSA. I saw you just signed up for our AI security monitoring platform and wanted to personally welcome you! Do you have a quick second?`.replace("{first}", args.firstName),
            wait_for_greeting: true,
          }),
        });
        if (!resp.ok) console.error("Bland.ai failed:", resp.status, await resp.text());
      } catch (err) { console.error("Call failed:", err); }
    }

    // 6. Zach alert
    try {
      await callTool("mcp_pd_highlevel_oauth_proxy_post", {
        url: "https://services.leadconnectorhq.com/conversations/messages",
        headers: { "Version": "2021-07-28" },
        json_body: { type: "SMS", contactId: ZACH_GHL_CONTACT_ID,
          message: `🛡️ NEW MONITORUSA.AI SIGNUP!\n\n${fullName}\n📧 ${args.email}\n📱 ${args.phone || "No phone"}\n⏰ ${timestamp}\n\nAshley is calling them now + welcome texts sent.`,
        },
      });
    } catch (err) { console.error("Zach alert failed:", err); }

    return null;
  },
});
