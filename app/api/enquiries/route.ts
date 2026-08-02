import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required." },
        { status: 400 }
      );
    }

    await prisma.enquiry.create({
      data: { name, phone: phone || null, message },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Enquiry save failed:", e);
    return NextResponse.json(
      { error: "Failed to save enquiry." },
      { status: 500 }
    );
  }
}
