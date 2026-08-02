import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin(["admin"]);
  if (!admin) return unauthorized();
  const users = await prisma.adminUser.findMany({
    select: { id: true, username: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(["admin"]);
  if (!admin) return unauthorized();
  const body = await request.json();
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  const role = body.role === "teacher" ? "teacher" : "admin";

  if (!username || password.length < 4) {
    return NextResponse.json(
      { error: "Username required and password must be at least 4 characters." },
      { status: 400 }
    );
  }

  const exists = await prisma.adminUser.findUnique({ where: { username } });
  if (exists) {
    return NextResponse.json({ error: "Username already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.adminUser.create({
    data: { username, passwordHash, role, name: body.name ?? "" },
    select: { id: true, username: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json(user, { status: 201 });
}
