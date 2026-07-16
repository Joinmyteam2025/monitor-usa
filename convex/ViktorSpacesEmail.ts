import { Email } from "@convex-dev/auth/providers/Email";
import { APP_NAME } from "./constants";

declare const process: { env: Record<string, string | undefined> };

function generateOTP() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(array[0] % 1000000).padStart(6, "0");
}

async function sendEmail({
  email,
  token,
  subject,
  heading,
  description,
}: {
  email: string;
  token: string;
  subject: string;
  heading: string;
  description: string;
}) {
  const apiUrl = process.env.VIKTOR_SPACES_API_URL;
  const projectName = process.env.VIKTOR_SPACES_PROJECT_NAME;
  const projectSecret = process.env.VIKTOR_SPACES_PROJECT_SECRET;

  if (!apiUrl || !projectName || !projectSecret) {
    throw new Error(
      "Viktor Spaces environment variables not configured. " +
        "Required: VIKTOR_SPACES_API_URL, VIKTOR_SPACES_PROJECT_NAME, VIKTOR_SPACES_PROJECT_SECRET",
    );
  }

  const emailSubject = `${subject} - ${APP_NAME}`;
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Your ${APP_NAME} verification code is ready</div>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#0A1B33 0%,#007BFF 100%);padding:28px 32px;text-align:center;">
              <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.5px;">${APP_NAME}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 24px;">
              <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:20px;font-weight:600;text-align:center;">${heading}</h2>
              <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.5;text-align:center;">${description}</p>
              <div style="background:#f0f7ff;padding:20px;text-align:center;border-radius:8px;border:1px solid #cce0ff;">
                <span style="font-size:34px;font-weight:700;letter-spacing:8px;color:#0A1B33;font-family:monospace;">${token}</span>
              </div>
              <p style="margin:16px 0 0;color:#888;font-size:13px;text-align:center;">This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8f9fa;padding:20px 32px;border-top:1px solid #eee;">
              <p style="margin:0;color:#999;font-size:11px;text-align:center;line-height:1.5;">
                © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </p>
              <p style="margin:8px 0 0;color:#aaa;font-size:10px;text-align:center;line-height:1.6;">
                Powered by Garner Financial Partners · Scottsdale, AZ 85254
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  const textContent = `${heading}\n\n${description}\n\nYour code is: ${token}\n\nThis code expires in 15 minutes.\n\n---\n© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.`;

  console.log(`[Email] Sending ${subject} to ${email} via Viktor Spaces API...`);

  const response = await fetch(`${apiUrl}/api/viktor-spaces/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_name: projectName,
      project_secret: projectSecret,
      to_email: email,
      subject: emailSubject,
      html_content: htmlContent,
      text_content: textContent,
      reply_to: "contact@garnerfinancialpartners.com",
      from_name: APP_NAME,
      email_type: "otp",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[Email] Failed: ${error}`);
    throw new Error(`Failed to send email: ${error}`);
  }

  const result = (await response.json()) as {
    success: boolean;
    error?: string;
    message_id?: string;
  };
  
  if (!result.success) {
    console.error(`[Email] API returned failure: ${result.error}`);
    throw new Error(`Email sending failed: ${result.error}`);
  }
  
  console.log(`[Email] Sent successfully, message_id: ${result.message_id}`);
}

export const ViktorSpacesEmail = Email({
  id: "viktor-spaces-email",
  maxAge: 60 * 15,
  async generateVerificationToken() {
    return generateOTP();
  },
  async sendVerificationRequest({ identifier: email, token }) {
    await sendEmail({
      email,
      token,
      subject: "Verify your email",
      heading: "Verify your email",
      description: "Enter this code to verify your email address:",
    });
  },
});

export const ViktorSpacesPasswordReset = Email({
  id: "viktor-spaces-password-reset",
  maxAge: 60 * 15,
  async generateVerificationToken() {
    return generateOTP();
  },
  async sendVerificationRequest({ identifier: email, token }) {
    await sendEmail({
      email,
      token,
      subject: "Reset your password",
      heading: "Reset your password",
      description: "Enter this code to reset your password:",
    });
  },
});
