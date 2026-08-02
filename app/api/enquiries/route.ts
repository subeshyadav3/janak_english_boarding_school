import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ENQUIRY_EMAIL, sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "").trim();

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required." },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        subject: subject || null,
        message,
      },
    });

    if (ENQUIRY_EMAIL) {
      sendMail({
        to: ENQUIRY_EMAIL,
        subject: `New website enquiry from ${name}`,
        text: [
          `Name: ${name}`,
          `Phone: ${phone || "-"}`,
          `Email: ${email || "-"}`,
          `Subject: ${subject || "-"}`,
          "",
          message,
        ].join("\n"),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
            <div style="background: #4f46e5; color: #fff; padding: 16px 24px;">
              <h2 style="margin: 0; font-size: 18px;">New website enquiry</h2>
            </div>
            <div style="padding: 24px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone || "-"}</p>
              <p><strong>Email:</strong> ${email || "-"}</p>
              <p><strong>Subject:</strong> ${subject || "-"}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
              <p style="white-space: pre-line; color: #333;">${message}</p>
            </div>
          </div>
        `,
      }).catch((e) => console.error("Enquiry email failed:", e));
    }

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (e) {
    console.error("Enquiry save failed:", e);
    return NextResponse.json(
      { error: "Failed to save enquiry." },
      { status: 500 }
    );
  }
}
