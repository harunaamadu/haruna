import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ─── Resend client ────────────────────────────────────────────────────────────
// Add to .env.local:
//   RESEND_API_KEY=re_your_api_key_here
//   CONTACT_TO_EMAIL=cupidruna95@gmail.com
//
// Get your free API key at: https://resend.com
const resend = new Resend(process.env.RESEND_API_KEY);

// The Gmail address that receives submissions
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "cupidruna95@gmail.com";

// ─── In-memory rate limiter ───────────────────────────────────────────────────
const store  = new Map<string, number[]>();
const WIN_MS = 60_000; // 1-minute window
const MAX_REQ = 3;     // max 3 submissions per IP per minute

function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const hits = (store.get(ip) ?? []).filter((t) => now - t < WIN_MS);
  if (hits.length >= MAX_REQ) return true;
  store.set(ip, [...hits, now]);
  return false;
}

// ─── POST /api/contact ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      { status: 429 },
    );
  }

  // Parse body
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, subject, message } =
    (raw ?? {}) as Record<string, string | undefined>;

  // ── Validation ───────────────────────────────────────────────────────────
  if (!name?.trim() || name.trim().length < 2) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 },
    );
  }
  if (!subject?.trim()) {
    return NextResponse.json({ error: "Subject is required." }, { status: 400 });
  }
  if (!message?.trim() || message.trim().length < 20) {
    return NextResponse.json(
      { error: "Message must be at least 20 characters." },
      { status: 400 },
    );
  }

  // ── Send via Resend ───────────────────────────────────────────────────────
  try {
    await resend.emails.send({
      // "From" must be a domain you've verified in Resend.
      // Until you verify a domain, use the Resend sandbox address:
      //   onboarding@resend.dev
      // After verifying harunadev.com (or similar), change this to:
      //   from: "Haruna Portfolio <contact@harunadev.com>"
      from:     "Haruna Portfolio <onboarding@resend.dev>",
      to:       [TO_EMAIL],
      replyTo:  email.trim(),
      subject:  `[Portfolio] ${subject.trim()}`,
      html:     buildEmailHtml({ name, email, subject, message }),
      text:     buildEmailText({ name, email, subject, message }),
    });

    // Send an auto-reply to the sender
    await resend.emails.send({
      from:    "Haruna <onboarding@resend.dev>",
      to:      [email.trim()],
      subject: "Got your message — I'll be in touch soon!",
      html:    buildAutoReplyHtml({ name }),
      text:    buildAutoReplyText({ name }),
    });

    return NextResponse.json(
      { message: "Message sent successfully." },
      { status: 200 },
    );
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again or email me directly." },
      { status: 500 },
    );
  }
}

// ─── Email templates ──────────────────────────────────────────────────────────

interface EmailData {
  name:    string | undefined;
  email:   string | undefined;
  subject: string | undefined;
  message: string | undefined;
}

function buildEmailHtml({ name, email, subject, message }: EmailData): string {
  const safeMessage = (message ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Portfolio Message</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;
                 box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:oklch(45% 0.22 290);padding:32px 40px;">
              <p style="margin:0;font-size:22px;font-weight:600;
                         color:#ffffff;letter-spacing:-0.01em;">
                Haruna<span style="display:inline-block;width:5px;height:5px;
                  border-radius:50%;background:oklch(72% 0.16 60);
                  margin-left:3px;vertical-align:bottom;margin-bottom:4px;"></span>
              </p>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);
                         letter-spacing:0.06em;text-transform:uppercase;">
                New Portfolio Message
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <!-- Sender info -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#f9f9fb;border-radius:10px;padding:20px;margin-bottom:28px;">
                <tr>
                  <td style="padding:6px 0;">
                    <span style="font-size:11px;text-transform:uppercase;
                                 letter-spacing:0.12em;color:#888;font-weight:600;">From</span><br/>
                    <span style="font-size:15px;font-weight:600;color:#111;">
                      ${name ?? ""}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <span style="font-size:11px;text-transform:uppercase;
                                 letter-spacing:0.12em;color:#888;font-weight:600;">Email</span><br/>
                    <a href="mailto:${email ?? ""}"
                       style="font-size:14px;color:oklch(45% 0.22 290);text-decoration:none;">
                      ${email ?? ""}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <span style="font-size:11px;text-transform:uppercase;
                                 letter-spacing:0.12em;color:#888;font-weight:600;">Subject</span><br/>
                    <span style="font-size:14px;font-weight:600;color:#111;">
                      ${subject ?? ""}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;
                         color:#888;font-weight:600;margin:0 0 12px;">Message</p>
              <div style="font-size:15px;line-height:1.8;color:#333;
                           border-left:3px solid oklch(45% 0.22 290);padding-left:16px;">
                ${safeMessage}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #f0f0f0;">
              <p style="margin:0;font-size:12px;color:#aaa;text-align:center;">
                Sent from your portfolio contact form •
                <a href="mailto:${email ?? ""}"
                   style="color:oklch(45% 0.22 290);text-decoration:none;">
                  Reply directly
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildEmailText({ name, email, subject, message }: EmailData): string {
  return [
    "NEW PORTFOLIO MESSAGE",
    "─────────────────────",
    `From:    ${name ?? ""}`,
    `Email:   ${email ?? ""}`,
    `Subject: ${subject ?? ""}`,
    "",
    "Message:",
    message ?? "",
    "",
    "─────────────────────",
    "Sent from your portfolio contact form.",
  ].join("\n");
}

function buildAutoReplyHtml({ name }: { name: string | undefined }): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;
                 box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:oklch(45% 0.22 290);padding:32px 40px;">
              <p style="margin:0;font-size:22px;font-weight:600;
                         color:#ffffff;letter-spacing:-0.01em;">
                Haruna<span style="display:inline-block;width:5px;height:5px;
                  border-radius:50%;background:oklch(72% 0.16 60);
                  margin-left:3px;vertical-align:bottom;margin-bottom:4px;"></span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">
              <p style="font-size:18px;font-weight:600;color:#111;
                         margin:0 0 16px;letter-spacing:-0.01em;">
                Hey ${name ?? "there"}, got your message! 👋
              </p>
              <p style="font-size:15px;line-height:1.8;color:#555;margin:0 0 20px;">
                Thanks for reaching out through my portfolio. I've received your
                message and will get back to you within <strong>24 hours</strong>.
              </p>
              <p style="font-size:15px;line-height:1.8;color:#555;margin:0 0 32px;">
                In the meantime, feel free to check out my work or connect with
                me on LinkedIn.
              </p>
              <p style="font-size:15px;line-height:1.8;color:#555;margin:0;">
                Talk soon,<br/>
                <strong style="color:#111;">Haruna</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #f0f0f0;">
              <p style="margin:0;font-size:12px;color:#aaa;text-align:center;">
                This is an automated reply from harunadev.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildAutoReplyText({ name }: { name: string | undefined }): string {
  return [
    `Hey ${name ?? "there"},`,
    "",
    "Thanks for reaching out through my portfolio! I've received your message",
    "and will get back to you within 24 hours.",
    "",
    "Talk soon,",
    "Haruna",
    "",
    "─────────────────────",
    "This is an automated reply from harunadev.com",
  ].join("\n");
}