import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSessionToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (!verifyCredentials(email, password)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = createSessionToken();

    const response = NextResponse.json({ success: true });
    response.cookies.set("covra_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}