import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

async function authed() {
  const user = await getSessionUser();
  if (!user) return null;
  const admin = await prisma.adminUser.findUnique({ where: { username: user.username } });
  return admin;
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/teachers/[id]">) {
  const admin = await authed();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await request.json();
  const item = await prisma.teacher.update({
    where: { id },
    data: {
      name: String(body.name ?? ""),
      position: body.position ?? "",
      subject: body.subject ?? "",
      phone: body.phone ?? "",
      photo: body.photo ?? "",
      order: Number(body.order ?? 1),
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/admin/teachers/[id]">) {
  const admin = await authed();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  await prisma.teacher.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
