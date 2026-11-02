import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { verifyTicketPayload } from "@/lib/qr";

export async function POST(req: NextRequest) {
  try {
    const { qrPayload } = await req.json();

    if (!qrPayload) {
      return NextResponse.json({ error: "Missing QR payload" }, { status: 400 });
    }

    // 1. Verify cryptographic HMAC signature
    const verification = verifyTicketPayload(qrPayload);
    if (!verification.valid || !verification.payload) {
      return NextResponse.json(
        {
          success: false,
          status: "INVALID",
          message: verification.error || "Cryptographic verification failed. Fraudulent or altered QR code.",
        },
        { status: 400 }
      );
    }

    const { ticketId } = verification.payload;

    // 2. Lookup ticket in DB
    const ticketWithOrder = await db.getTicketById(ticketId);
    if (!ticketWithOrder) {
      return NextResponse.json(
        {
          success: false,
          status: "NOT_FOUND",
          message: "Ticket not found in the official registry.",
        },
        { status: 404 }
      );
    }

    // 3. Check if already used
    if (ticketWithOrder.is_used) {
      return NextResponse.json(
        {
          success: false,
          status: "ALREADY_USED",
          message: "⚠️ WARNING: This ticket has already been used for entry!",
          usedAt: ticketWithOrder.used_at,
          attendeeName: ticketWithOrder.order?.user_name || verification.payload.name,
          ticketType: ticketWithOrder.ticket_type,
        },
        { status: 409 }
      );
    }

    // 4. Mark ticket as used
    const result = await db.markTicketAsUsed(ticketId);
    if (!result.success) {
      if (result.alreadyUsed) {
        return NextResponse.json(
          {
            success: false,
            status: "ALREADY_USED",
            message: "⚠️ WARNING: This ticket has already been used for entry!",
            usedAt: result.ticket?.used_at,
          },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: "Failed to mark ticket as used" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      status: "VERIFIED",
      message: "Ticket verified successfully. Welcome to COVRA Launch!",
      attendeeName: ticketWithOrder.order?.user_name || verification.payload.name,
      ticketType: ticketWithOrder.ticket_type,
      ticketId: ticketWithOrder.id,
      verifiedAt: result.ticket?.used_at || new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Ticket verify error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
