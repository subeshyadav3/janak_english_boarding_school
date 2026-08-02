import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/admin/users/[id]">) {
  const admin = await requireAdmin(["admin"]);
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });
  if (target.id === admin.id) {
    return NextResponse.json({ error: "Cannot delete your own account." }, { status: 400 });
  }
  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/users/[id]">) {
  const admin = await requireAdmin(["admin"]);
  if (!admin) return unauthorized();
  const { id } = await ctx.params;
  const body = await request.json();
  const data: { passwordHash?: string; role?: string; name?: string } = {};
  if (typeof body.role === "string" && (body.role === "admin" || body.role === "teacher")) {
    data.role = body.role;
  }
  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.password === "string" && body.password.length >= 4) {
    data.passwordHash = await bcrypt.hash(body.password, 10);
  }
  const user = await prisma.adminUser.update({
    where: { id },
    data,
    select: { id: true, username: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json(user);
}
