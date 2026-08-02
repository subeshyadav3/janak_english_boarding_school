import { prisma } from "@/lib/db";
import {
  DEFAULT_SETTINGS,
  DEFAULT_TEACHERS,
  DEFAULT_NOTICES,
  type SiteSettings,
} from "@/lib/constants";

export type { SiteSettings };

let dbOk: boolean | null = null;

async function dbAvailable() {
  if (dbOk !== null) return dbOk;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }
  return dbOk;
}

export async function getSettings(): Promise<SiteSettings> {
  if (!(await dbAvailable())) return DEFAULT_SETTINGS;
  const s = await prisma.setting.findUnique({ where: { id: "main" } });
  if (!s) return DEFAULT_SETTINGS;
  const rest = { ...s };
  delete (rest as { updatedAt?: Date }).updatedAt;
  return rest;
}

export async function getTeachers() {
  if (!(await dbAvailable())) return DEFAULT_TEACHERS;
  const rows = await prisma.teacher.findMany({ orderBy: { order: "asc" } });
  return rows.length ? rows : DEFAULT_TEACHERS;
}

export async function getNotices() {
  if (!(await dbAvailable())) return DEFAULT_NOTICES;
  return prisma.notice.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getResults() {
  if (!(await dbAvailable())) return [];
  return prisma.result.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getGallery() {
  if (!(await dbAvailable())) return [];
  return prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getTestimonials() {
  if (!(await dbAvailable())) return [];
  return prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

export async function getEvents() {
  if (!(await dbAvailable())) return [];
  return prisma.event.findMany({ orderBy: { date: "asc" } });
}

export async function getNoticesPublic() {
  if (!(await dbAvailable())) return DEFAULT_NOTICES;
  return prisma.notice.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}
