import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { verifyPaymobHMAC } from "@/lib/paymob";
import { createSignedQRPayload } from "@/lib/qr";
import { sendTicketEmail } from "@/lib/resend";
import { Ticket } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const hmacParam = url.searchParams.get("hmac") || req.headers.get("x-paymob-hmac") || "";
    const body = await req.json();

    // Paymob transaction callback data is inside `body.obj` or directly in `body`
    const transactionObj = body.obj || body;

    // Check HMAC signature if present
    if (hmacParam && !verifyPaymobHMAC(transactionObj, hmacParam)) {
      console.warn("Paymob Webhook HMAC verification failed!");
      return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
    }

    // Determine merchant order ID and success status
    // Paymob returns merchant order ID in order.merchant_order_id or data.merchant_order_id
    const orderData = transactionObj.order || {};
    const merchantOrderId =
      orderData.merchant_order_id ||
      transactionObj.merchant_order_id ||
      body.merchant_order_id ||
      body.orderId;

    const isSuccess = Boolean(
      transactionObj.success === true ||
      transactionObj.success === "true" ||
      body.success === true
    );

    const paymobTxId = String(transactionObj.id || body.transactionId || "");

    if (!merchantOrderId) {
      return NextResponse.json({ error: "Missing merchant order ID" }, { status: 400 });
    }

    const order = await db.getOrderById(merchantOrderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If payment failed
    if (!isSuccess) {
      await db.updateOrderStatus(order.id, "failed", paymobTxId);
      return NextResponse.json({ received: true, status: "failed" });
    }

    // If payment succeeded:
    await db.updateOrderStatus(order.id, "paid", paymobTxId);

    // Check if tickets already exist to prevent duplicate creation on webhook retries
    const existingTickets = await db.getTicketsByOrderId(order.id);
    let ticketsToDeliver: Ticket[] = existingTickets;

    if (existingTickets.length === 0) {
      const newTickets: Omit<Ticket, "created_at">[] = [];

      // Generate Standard Tickets
      for (let i = 0; i < order.standard_count; i++) {
        const ticketId = crypto.randomUUID();
        const qrString = createSignedQRPayload(ticketId, order.id, "standard", order.user_name);
        newTickets.push({
          id: ticketId,
          order_id: order.id,
          ticket_type: "standard",
          qr_code: qrString,
          is_used: false,
          used_at: null,
        });
      }

      // Generate Premium Tickets
      for (let i = 0; i < order.premium_count; i++) {
        const ticketId = crypto.randomUUID();
        const qrString = createSignedQRPayload(ticketId, order.id, "premium", order.user_name);
        newTickets.push({
          id: ticketId,
          order_id: order.id,
          ticket_type: "premium",
          qr_code: qrString,
          is_used: false,
          used_at: null,
        });
      }

      ticketsToDeliver = await db.createTickets(newTickets);
    }

    // Send tickets via Resend Email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const ticketLinks = ticketsToDeliver.map((t) => ({
      ticketId: t.id,
      type: t.ticket_type,
      url: `${baseUrl}/ticket/${t.id}`,
    }));

    try {
      await sendTicketEmail({
        order,
        tickets: ticketsToDeliver,
        ticketLinks,
      });
    } catch (emailErr) {
      console.error("Failed to send ticket email in webhook:", emailErr);
    }

    return NextResponse.json({
      received: true,
      orderId: order.id,
      status: "paid",
      ticketsCount: ticketsToDeliver.length,
      ticketIds: ticketsToDeliver.map((t) => t.id),
    });
  } catch (error: unknown) {
    console.error("Paymob Webhook error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
