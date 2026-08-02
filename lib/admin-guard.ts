import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function requireAdmin(roles: string[] = ["admin"]) {
  const user = await getSessionUser();
  if (!user) return null;
  const admin = await prisma.adminUser.findUnique({
    where: { username: user.username },
  });
  if (!admin) return null;
  if (!roles.includes(admin.role)) return null;
  return admin;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
