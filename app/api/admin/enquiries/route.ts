import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const items = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}
