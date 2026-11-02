import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ceo@covra.site";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ShifOo0011";
const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || "covra-admin-secret-key-2026";

export function verifyCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function createSessionToken(): string {
  const payload = `admin:${Date.now()}`;
  return crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex") + "." + Buffer.from(payload).toString("base64");
}

export function verifySessionToken(token: string): boolean {
  try {
    const [sig, data] = token.split(".");
    if (!sig || !data) return false;
    const payload = Buffer.from(data, "base64").toString();
    const expected = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
    return sig === expected;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("covra_admin_session")?.value;
  if (!token) return false;
  return verifySessionToken(token);
}