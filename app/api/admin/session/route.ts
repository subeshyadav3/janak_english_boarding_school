import { NextResponse } from "next/server";
import { destroySession, getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({
    authenticated: Boolean(user),
    username: user?.username,
    role: user?.role,
  });
}

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true });
}
