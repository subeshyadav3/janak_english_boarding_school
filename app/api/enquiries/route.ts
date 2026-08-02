import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ENQUIRY_EMAIL, sendMail } from "@/lib/mail";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();

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
        message,
      },
    });

    if (ENQUIRY_EMAIL) {
      const fields = [
        { label: "Name", value: name },
        { label: "Phone", value: phone },
        { label: "Email", value: email },
        { label: "Message", value: message },
      ].filter((f) => f.value.trim());

      const text = fields.map((f) => `${f.label}: ${f.value}`).join("\n");

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
          <div style="background: #4f46e5; color: #fff; padding: 16px 24px;">
            <h2 style="margin: 0; font-size: 18px;">New website enquiry</h2>
          </div>
          <div style="padding: 24px;">
            ${fields
              .map(
                (f) =>
                  f.label === "Message"
                    ? `<p style="white-space: pre-line; color: #333; margin: 0 0 12px;"><strong>${esc(f.label)}:</strong> ${esc(f.value)}</p>`
                    : `<p style="margin: 0 0 12px;"><strong>${esc(f.label)}:</strong> ${esc(f.value)}</p>`
              )
              .join("")}
          </div>
        </div>
      `;

      sendMail({
        to: ENQUIRY_EMAIL,
        subject: `New website enquiry from ${name}`,
        text,
        html,
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
