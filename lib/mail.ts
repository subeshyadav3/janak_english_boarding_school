import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM = process.env.RESEND_FROM || "Janak English Boarding School <onboarding@resend.dev>";

export const ENQUIRY_EMAIL = process.env.ENQUIRY_EMAIL || "";

export function mailConfigured() {
  return Boolean(RESEND_API_KEY && ENQUIRY_EMAIL);
}

type MailArgs = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendMail({ to, subject, text, html }: MailArgs) {
  if (!mailConfigured()) {
    console.warn("[mail] Resend not configured. Skipping email send.");
    return;
  }
  const resend = new Resend(RESEND_API_KEY);
  await resend.emails.send({
    from: RESEND_FROM,
    to,
    subject,
    text,
    html,
  });
}
