import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const settings = await prisma.setting.findUnique({ where: { id: "main" } });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const body = await request.json();
  const fields = [
    "schoolName",
    "tagline",
    "motto",
    "address",
    "phone",
    "email",
    "establishedYear",
    "facebook",
    "whatsapp",
    "instagram",
    "youtube",
    "mapUrl",
    "logo",
    "cover1",
    "cover2",
    "cover3",
    "cover4",
    "cover5",
    "cover6",
  ] as const;

  const data: Record<string, string | number | null> = {};
  for (const f of fields) {
    const v = body[f];
    if (f === "establishedYear") {
      data[f] =
        typeof v === "number" && v > 0
          ? v
          : typeof v === "string" && v.trim()
            ? Number(v)
            : null;
      continue;
    }
    data[f] = typeof v === "string" && v.trim() ? v : null;
  }

  const existing = await prisma.setting.findUnique({ where: { id: "main" } });
  const settings = existing
    ? await prisma.setting.update({ where: { id: "main" }, data })
    : await prisma.setting.create({ data: { id: "main", ...data } });

  return NextResponse.json(settings);
}
