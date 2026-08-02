import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

async function authed() {
  const user = await getSessionUser();
  if (!user) return null;
  const admin = await prisma.adminUser.findUnique({ where: { username: user.username } });
  return admin;
}

export async function GET() {
  const admin = await authed();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.teacher.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const admin = await authed();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const maxOrder = await prisma.teacher.aggregate({ _max: { order: true } });
  const item = await prisma.teacher.create({
    data: {
      name: String(body.name ?? ""),
      position: body.position ?? "",
      subject: body.subject ?? "",
      qualification: body.qualification ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      photo: body.photo ?? "",
      order: Number(body.order ?? (maxOrder._max.order ?? 0) + 1),
      active: body.active ?? true,
      joinedAt: body.joinedAt ? new Date(body.joinedAt) : null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
