import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/notices/[id]">) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  const body = await request.json();
  const item = await prisma.notice.update({
    where: { id },
    data: {
      title: String(body.title ?? ""),
      description: body.description ?? "",
      filePath: body.filePath ?? "",
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/admin/notices/[id]">) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  await prisma.notice.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
