import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const items = await prisma.notice.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const body = await request.json();
  const item = await prisma.notice.create({
    data: {
      title: String(body.title ?? ""),
      description: body.description ?? "",
      filePath: body.filePath ?? "",
    },
  });
  return NextResponse.json(item, { status: 201 });
}
