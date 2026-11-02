import { Resend } from "resend";
import { Order, Ticket } from "@/types";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendTicketEmail({
  order,
  tickets,
  ticketLinks,
}: {
  order: Order;
  tickets: Ticket[];
  ticketLinks: { ticketId: string; type: string; url: string }[];
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const emailHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d1117; color: #f0f6fc; margin: 0; padding: 24px; }
        .container { max-width: 600px; margin: 0 auto; background: #161b22; border: 1px solid #30363d; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #30363d; }
        .logo { font-size: 26px; font-weight: 800; letter-spacing: 2px; color: #58a6ff; }
        .tagline { color: #8b949e; font-size: 14px; margin-top: 6px; }
        .content { padding: 32px 24px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: rgba(57, 197, 207, 0.15); color: #39c5cf; border: 1px solid rgba(57, 197, 207, 0.3); }
        .ticket-card { background: #21262d; border: 1px solid #30363d; border-radius: 8px; padding: 20px; margin: 16px 0; }
        .btn { display: inline-block; background: #58a6ff; color: #0d1117; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-top: 12px; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .details-table td { padding: 8px 0; border-bottom: 1px solid #30363d; font-size: 14px; }
        .footer { text-align: center; padding: 24px; font-size: 12px; color: #8b949e; border-top: 1px solid #30363d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">COVRA LAUNCH EVENT</div>
          <div class="tagline">AI-Powered Security Scanner for Developers</div>
        </div>
        <div class="content">
          <h2 style="color: #f0f6fc; margin-top: 0;">Your Tickets are Ready! 🎟️</h2>
          <p style="color: #c9d1d9; font-size: 15px;">
            Hello <strong>${order.user_name}</strong>, thank you for securing your place at the COVRA Launch Event. Your payment has been confirmed successfully.
          </p>

          <table class="details-table">
            <tr>
              <td style="color: #8b949e;">Event</td>
              <td style="text-align: right; color: #f0f6fc; font-weight: 600;">COVRA Launch Event</td>
            </tr>
            <tr>
              <td style="color: #8b949e;">Venue</td>
              <td style="text-align: right; color: #f0f6fc; font-weight: 600;">Creativa Giza</td>
            </tr>
            <tr>
              <td style="color: #8b949e;">Date & Time</td>
              <td style="text-align: right; color: #f0f6fc; font-weight: 600;">November 28, 2026 • 10:00 AM</td>
            </tr>
            <tr>
              <td style="color: #8b949e;">Total Paid</td>
              <td style="text-align: right; color: #3fb950; font-weight: 700;">${order.total_amount} EGP</td>
            </tr>
          </table>

          <h3 style="color: #f0f6fc; margin-top: 28px; margin-bottom: 12px;">Your Digital Passes</h3>
          ${ticketLinks
            .map(
              (t, idx) => `
            <div class="ticket-card">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge">${t.type.toUpperCase()} PASS</span>
                <span style="color: #8b949e; font-size: 12px;">Pass #${idx + 1}</span>
              </div>
              <p style="margin: 12px 0 6px 0; color: #f0f6fc; font-weight: 600;">Attendee: ${order.user_name}</p>
              <a href="${t.url}" class="btn" style="display: block; text-align: center; margin-top: 14px;">
                View & Download Ticket QR Pass
              </a>
            </div>
          `
            )
            .join("")}

          <p style="color: #8b949e; font-size: 13px; margin-top: 24px;">
            ⚠️ Please keep your QR code ready on your phone or printed when entering Creativa Giza. Each QR code is cryptographically signed and allows a single admission scan.
          </p>
        </div>
        <div class="footer">
          © 2026 COVRA Security. Creativa Giza, Egypt.<br />
          Need assistance? Reply directly to this email or reach us on WhatsApp.
        </div>
      </div>
    </body>
  </html>
  `;

  if (!resend) {
    console.log(`[Resend Mock] Email would be sent to: ${order.user_email}`);
    console.log(`[Resend Mock] Ticket URLs:`, ticketLinks.map((t) => t.url));
    return { success: true, id: `mock-email-${Date.now()}` };
  }

  try {
    const data = await resend.emails.send({
      from: "COVRA Launch <tickets@resend.dev>",
      to: [order.user_email],
      subject: `🎟️ Your COVRA Launch Event Tickets (${order.user_name})`,
      html: emailHtml,
    });

    return { success: true, id: data.data?.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Resend send error:", errorMsg);
    return { success: false, error: errorMsg };
  }
}
