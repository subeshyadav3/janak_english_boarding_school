import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const body = await request.json();
  const item = await prisma.galleryItem.create({
    data: {
      imagePath: String(body.imagePath ?? ""),
      title: body.title ?? "",
    },
  });
  return NextResponse.json(item, { status: 201 });
}
