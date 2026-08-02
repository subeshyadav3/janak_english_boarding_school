import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin(["admin", "teacher"]);
  if (!admin) return unauthorized();
  const items = await prisma.event.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(["admin", "teacher"]);
  if (!admin) return unauthorized();
  const body = await request.json();
  const item = await prisma.event.create({
    data: {
      title: String(body.title ?? ""),
      description: body.description ?? null,
      date: new Date(body.date || Date.now()),
      time: body.time ?? null,
      location: body.location ?? null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
