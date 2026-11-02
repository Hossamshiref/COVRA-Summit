import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { sendTicketEmail } from "@/lib/resend";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = rateLimit({ identifier: `send-email:${ip}`, limit: 3, windowMs: 60000 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Please wait a minute before requesting another email." },
        { status: 429 }
      );
    }

    const { ticketId } = await req.json();
    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    const ticketWithOrder = await db.getTicketById(ticketId);
    if (!ticketWithOrder || !ticketWithOrder.order) {
      return NextResponse.json({ error: "Ticket or order not found" }, { status: 404 });
    }

    const order = ticketWithOrder.order;
    const allOrderTickets = await db.getTicketsByOrderId(order.id);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const ticketLinks = allOrderTickets.map((t) => ({
      ticketId: t.id,
      type: t.ticket_type,
      url: `${baseUrl}/ticket/${t.id}`,
    }));

    const result = await sendTicketEmail({
      order,
      tickets: allOrderTickets,
      ticketLinks,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Ticket pass sent to ${order.user_email}`,
    });
  } catch (error: unknown) {
    console.error("Resend ticket email error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
