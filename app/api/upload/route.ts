import { NextResponse, type NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WEBP, GIF images or PDF files are allowed." },
        { status: 400 }
      );
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be under 8MB." },
        { status: 400 }
      );
    }

    const ext =
      path.extname(file.name) ||
      (file.type === "application/pdf" ? ".pdf" : ".jpg");
    const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;

    // Primary: Vercel Blob (persistent across deploys)
    try {
      const { url } = await put(filename, file, {
        access: "public",
        contentType: file.type,
      });
      return NextResponse.json({ url });
    } catch (blobErr) {
      console.warn(
        "Vercel Blob upload failed, falling back to local storage:",
        blobErr
      );
    }

    // Fallback: local /public/uploads
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });

  } catch (e) {
    console.error("Upload failed:", e);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
