import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { generateQRCodeDataURL } from "@/lib/qr";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    const ticketWithOrder = await db.getTicketById(id);
    if (!ticketWithOrder) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Generate high resolution QR Data URL from the signed QR payload string
    const qrDataUrl = await generateQRCodeDataURL(ticketWithOrder.qr_code);

    return NextResponse.json({
      ticket: {
        id: ticketWithOrder.id,
        orderId: ticketWithOrder.order_id,
        ticketType: ticketWithOrder.ticket_type,
        isUsed: ticketWithOrder.is_used,
        usedAt: ticketWithOrder.used_at,
        createdAt: ticketWithOrder.created_at,
        qrPayload: ticketWithOrder.qr_code,
        qrDataUrl,
      },
      order: ticketWithOrder.order
        ? {
            id: ticketWithOrder.order.id,
            userName: ticketWithOrder.order.user_name,
            userEmail: ticketWithOrder.order.user_email,
            userPhone: ticketWithOrder.order.user_phone,
            jobTitle: ticketWithOrder.order.job_title,
            company: ticketWithOrder.order.company,
            standardCount: ticketWithOrder.order.standard_count,
            premiumCount: ticketWithOrder.order.premium_count,
            totalAmount: ticketWithOrder.order.total_amount,
            paymentStatus: ticketWithOrder.order.payment_status,
          }
        : null,
      event: {
        name: "COVRA Launch Event",
        tagline: "AI-Powered Security Scanner for Developers",
        venue: "Creativa Giza",
        location: "Giza, Egypt",
        date: "November 28, 2026",
        time: "10:00 AM - 6:00 PM (EET)",
      },
    });
  } catch (error: unknown) {
    console.error("Get ticket error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
