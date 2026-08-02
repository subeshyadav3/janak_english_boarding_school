import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const items = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const body = await request.json();
  const item = await prisma.testimonial.create({
    data: {
      name: String(body.name ?? ""),
      message: String(body.message ?? ""),
      role: body.role ?? "parent",
      rating: Number(body.rating ?? 5),
      photo: body.photo ?? null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
