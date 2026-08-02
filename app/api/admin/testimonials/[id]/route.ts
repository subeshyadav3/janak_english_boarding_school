import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/testimonials/[id]">) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  const body = await request.json();
  const item = await prisma.testimonial.update({
    where: { id },
    data: {
      name: String(body.name ?? ""),
      message: String(body.message ?? ""),
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/admin/testimonials/[id]">) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
