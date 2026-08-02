import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    await createSession(admin.username, admin.role);
    return NextResponse.json({
      success: true,
      username: admin.username,
      role: admin.role,
    });
  } catch (e) {
    console.error("Login failed:", e);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
