import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/gallery/[id]">) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  const body = await request.json();
  const item = await prisma.galleryItem.update({
    where: { id },
    data: {
      imagePath: String(body.imagePath ?? ""),
      title: body.title ?? "",
      album: body.album ?? undefined,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/admin/gallery/[id]">) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
