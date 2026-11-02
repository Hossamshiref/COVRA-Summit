import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("speakers")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ speakers: data });
}

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const bio = (formData.get("bio") as string) || null;
    const badge = (formData.get("badge") as string) || null;
    const sort_order = parseInt((formData.get("sort_order") as string) || "0", 10);
    const is_active = formData.get("is_active") === "true";
    const image = formData.get("image") as File | null;

    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
    }

    let image_url: string | null = null;

    if (image && image.size > 0) {
      const ext = image.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const buffer = Buffer.from(await image.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("speakers")
        .upload(fileName, buffer, {
          contentType: image.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json({ error: "Image upload failed: " + uploadError.message }, { status: 500 });
      }

      const { data: urlData } = supabase.storage.from("speakers").getPublicUrl(fileName);
      image_url = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("speakers")
      .insert([{ name, role, bio, badge, sort_order, is_active, image_url }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ speaker: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const bio = (formData.get("bio") as string) || null;
    const badge = (formData.get("badge") as string) || null;
    const sort_order = parseInt((formData.get("sort_order") as string) || "0", 10);
    const is_active = formData.get("is_active") === "true";
    const image = formData.get("image") as File | null;

    if (!id || !name || !role) {
      return NextResponse.json({ error: "ID, name and role are required" }, { status: 400 });
    }

    const updates: any = { name, role, bio, badge, sort_order, is_active };

    if (image && image.size > 0) {
      const ext = image.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await image.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("speakers")
        .upload(fileName, buffer, { contentType: image.type, upsert: false });

      if (uploadError) {
        return NextResponse.json({ error: "Image upload failed: " + uploadError.message }, { status: 500 });
      }

      const { data: urlData } = supabase.storage.from("speakers").getPublicUrl(fileName);
      updates.image_url = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("speakers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ speaker: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabase.from("speakers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}