import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin(["admin", "teacher"]);
  if (!admin) return unauthorized();
  const items = await prisma.result.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(["admin", "teacher"]);
  if (!admin) return unauthorized();
  const body = await request.json();
  const item = await prisma.result.create({
    data: {
      title: String(body.title ?? ""),
      driveLink: body.driveLink ?? "",
      filePath: body.filePath ?? "",
    },
  });
  return NextResponse.json(item, { status: 201 });
}
