import crypto from "crypto";
import QRCode from "qrcode";
import { QRDataPayload, TicketType } from "@/types";

const QR_SECRET =
  process.env.PAYMOB_HMAC_SECRET ||
  process.env.QR_SIGNING_SECRET ||
  "covra-secure-ticket-signing-secret-2026-key";

/**
 * Creates a cryptographic signature for a ticket payload
 */
export function generateTicketSignature(
  ticketId: string,
  orderId: string,
  timestamp: number
): string {
  const data = `${ticketId}:${orderId}:${timestamp}`;
  return crypto.createHmac("sha256", QR_SECRET).update(data).digest("hex");
}

/**
 * Creates signed QR payload string
 */
export function createSignedQRPayload(
  ticketId: string,
  orderId: string,
  ticketType: TicketType,
  userName: string,
  timestamp: number = Date.now()
): string {
  const sig = generateTicketSignature(ticketId, orderId, timestamp);
  const payload: QRDataPayload = {
    ticketId,
    orderId,
    type: ticketType,
    name: userName,
    timestamp,
    sig,
  };
  return JSON.stringify(payload);
}

/**
 * Verifies a QR payload string
 */
export function verifyTicketPayload(payloadString: string): {
  valid: boolean;
  payload?: QRDataPayload;
  error?: string;
} {
  try {
    const payload = JSON.parse(payloadString) as QRDataPayload;
    if (!payload.ticketId || !payload.orderId || !payload.timestamp || !payload.sig) {
      return { valid: false, error: "Invalid QR format or missing fields" };
    }

    const expectedSig = generateTicketSignature(
      payload.ticketId,
      payload.orderId,
      payload.timestamp
    );

    if (payload.sig !== expectedSig) {
      return { valid: false, error: "Signature mismatch. QR code may be counterfeit or tampered with." };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: "Malformed QR code payload" };
  }
}

/**
 * Generates QR code as base64 Data URL (image/png)
 */
export async function generateQRCodeDataURL(payload: string): Promise<string> {
  return await QRCode.toDataURL(payload, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 320,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}
