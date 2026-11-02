import crypto from "crypto";

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || "";
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID || "";
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID || "";
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || "";

export const isPaymobConfigured = Boolean(
  PAYMOB_API_KEY &&
    PAYMOB_INTEGRATION_ID &&
    PAYMOB_IFRAME_ID &&
    PAYMOB_HMAC_SECRET
);

export interface PaymobBillingData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  apartment?: string;
  floor?: string;
  street?: string;
  building?: string;
  shipping_method?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  state?: string;
}

export interface PaymobOrderResult {
  paymobOrderId: string;
  paymentToken: string;
  iframeUrl: string;
  isMock: boolean;
}

/**
 * Step 1: Get Paymob Authentication Token
 */
export async function getPaymobAuthToken(): Promise<string> {
  const res = await fetch("https://accept.paymob.com/api/auth/tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Paymob Auth Error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data.token;
}

/**
 * Step 2: Register Order with Paymob
 */
export async function registerPaymobOrder(
  authToken: string,
  amountCents: number,
  merchantOrderId: string
): Promise<number> {
  const res = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: "false",
      amount_cents: amountCents.toString(),
      currency: "EGP",
      merchant_order_id: merchantOrderId,
      items: [],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Paymob Order Register Error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data.id; // Paymob numeric order ID
}

/**
 * Step 3: Obtain Payment Key (Token)
 */
export async function getPaymobPaymentKey(
  authToken: string,
  paymobOrderId: number,
  amountCents: number,
  billingData: PaymobBillingData
): Promise<string> {
  const res = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents.toString(),
      expiration: 3600,
      order_id: paymobOrderId.toString(),
      billing_data: {
        apartment: billingData.apartment || "NA",
        email: billingData.email,
        floor: billingData.floor || "NA",
        first_name: billingData.first_name || "Guest",
        street: billingData.street || "NA",
        building: billingData.building || "NA",
        phone_number: billingData.phone_number || "01000000000",
        shipping_method: "NA",
        postal_code: "NA",
        city: "Cairo",
        country: "EG",
        last_name: billingData.last_name || "Attendee",
        state: "Cairo",
      },
      currency: "EGP",
      integration_id: parseInt(PAYMOB_INTEGRATION_ID, 10),
      lock_order_when_paid: "true",
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Paymob Payment Key Error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data.token;
}

/**
 * Full Paymob Checkout initiator
 */
export async function initializePaymobPayment({
  orderId,
  amountEgp,
  userName,
  userEmail,
  userPhone,
}: {
  orderId: string;
  amountEgp: number;
  userName: string;
  userEmail: string;
  userPhone: string;
}): Promise<PaymobOrderResult> {
  const amountCents = amountEgp * 100;

  // Split name for Paymob billing data
  const nameParts = userName.trim().split(" ");
  const firstName = nameParts[0] || "Guest";
  const lastName = nameParts.slice(1).join(" ") || "Attendee";

  // If Paymob credentials are not configured, provide a seamless Sandbox / Test checkout experience
  if (!isPaymobConfigured) {
    const mockPaymobId = `MOCK-PAYMOB-${Date.now()}`;
    const mockToken = `mock_token_${orderId}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return {
      paymobOrderId: mockPaymobId,
      paymentToken: mockToken,
      iframeUrl: `${baseUrl}/checkout/mock-paymob?orderId=${orderId}&amount=${amountEgp}`,
      isMock: true,
    };
  }

  try {
    const authToken = await getPaymobAuthToken();
    const paymobOrderId = await registerPaymobOrder(authToken, amountCents, orderId);
    const paymentToken = await getPaymobPaymentKey(authToken, paymobOrderId, amountCents, {
      first_name: firstName,
      last_name: lastName,
      email: userEmail,
      phone_number: userPhone,
    });

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;

    return {
      paymobOrderId: paymobOrderId.toString(),
      paymentToken,
      iframeUrl,
      isMock: false,
    };
  } catch (error) {
    console.error("Paymob initialization failed, falling back to mock:", error);
    const mockPaymobId = `FALLBACK-PAYMOB-${Date.now()}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return {
      paymobOrderId: mockPaymobId,
      paymentToken: `mock_${orderId}`,
      iframeUrl: `${baseUrl}/checkout/mock-paymob?orderId=${orderId}&amount=${amountEgp}`,
      isMock: true,
    };
  }
}

/**
 * Paymob HMAC-SHA512 verification for Webhook requests
 */
export function verifyPaymobHMAC(obj: Record<string, unknown>, receivedHmac: string): boolean {
  if (!PAYMOB_HMAC_SECRET) {
    // If secret not configured in dev, allow in non-production
    return process.env.NODE_ENV !== "production";
  }

  try {
    // Paymob concatenation order
    const concatenatedString = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      (obj.order as Record<string, unknown>)?.id ?? "",
      obj.owner,
      obj.pending,
      (obj.source_data as Record<string, unknown>)?.pan ?? "",
      (obj.source_data as Record<string, unknown>)?.sub_type ?? "",
      (obj.source_data as Record<string, unknown>)?.type ?? "",
      obj.success,
    ].join("");

    const calculatedHmac = crypto
      .createHmac("sha512", PAYMOB_HMAC_SECRET)
      .update(concatenatedString)
      .digest("hex");

    return calculatedHmac.toLowerCase() === receivedHmac.toLowerCase();
  } catch (err) {
    console.error("HMAC calculation error:", err);
    return false;
  }
}
