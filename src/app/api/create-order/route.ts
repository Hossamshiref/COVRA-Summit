import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase";
import { initializePaymobPayment } from "@/lib/paymob";
import { rateLimit } from "@/lib/rate-limit";

const STANDARD_PRICE = 450;
const PREMIUM_PRICE = 750;

const createOrderSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is too short").max(20),
  jobTitle: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  standardCount: z.number().int().min(0),
  premiumCount: z.number().int().min(0),
}).refine((data) => data.standardCount + data.premiumCount > 0, {
  message: "At least one ticket must be selected",
  path: ["standardCount"],
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting per IP
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = rateLimit({ identifier: `create-order:${ip}`, limit: 10, windowMs: 60000 });

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    // 2. Validate input
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { fullName, email, phone, jobTitle, company, standardCount, premiumCount } =
      parsed.data;

    // 3. Calculate total
    const totalAmount = standardCount * STANDARD_PRICE + premiumCount * PREMIUM_PRICE;
    const orderId = crypto.randomUUID();

    // 4. Initialize Paymob transaction (or mock if keys not set)
    const paymobResult = await initializePaymobPayment({
      orderId,
      amountEgp: totalAmount,
      userName: fullName,
      userEmail: email,
      userPhone: phone,
    });

    // 5. Store pending order in Supabase
    const order = await db.createOrder({
      id: orderId,
      user_name: fullName,
      user_email: email,
      user_phone: phone,
      job_title: jobTitle || null,
      company: company || null,
      standard_count: standardCount,
      premium_count: premiumCount,
      total_amount: totalAmount,
      payment_status: "pending",
      paymob_order_id: paymobResult.paymobOrderId,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      totalAmount,
      paymobOrderId: paymobResult.paymobOrderId,
      paymentToken: paymobResult.paymentToken,
      iframeUrl: paymobResult.iframeUrl,
      isMock: paymobResult.isMock,
    });
  } catch (error: unknown) {
    console.error("Create order error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
