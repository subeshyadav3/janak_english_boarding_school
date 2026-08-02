import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/events/[id]">) {
  const admin = await requireAdmin(["admin", "teacher"]);
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  const body = await request.json();
  const item = await prisma.event.update({
    where: { id },
    data: {
      title: String(body.title ?? ""),
      description: body.description ?? null,
      date: body.date ? new Date(body.date) : undefined,
      time: body.time ?? null,
      location: body.location ?? null,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/admin/events/[id]">) {
  const admin = await requireAdmin(["admin", "teacher"]);
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
