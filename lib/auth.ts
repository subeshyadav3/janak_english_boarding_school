import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "admin_session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days in seconds

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET must be set to at least 16 characters");
  }
  return secret;
}

export async function createSession(username: string, role: string) {
  const secret = getSecret();
  const issuedAt = Math.floor(Date.now() / 1000);
  const nonce = randomBytes(16).toString("hex");
  const payload = `${username}.${role}.${issuedAt}.${nonce}`;
  const sig = sign(payload, secret);
  const token = `${payload}.${sig}`;

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL,
    path: "/",
  });
}

export async function destroySession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
}

export async function getSessionUser(): Promise<{
  username: string;
  role: string;
} | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 5) return null;
  const [username, role, issuedAtStr, nonce, sig] = parts;

  const secret = getSecret();
  const expected = sign(`${username}.${role}.${issuedAtStr}.${nonce}`, secret);
  const sigBuf = Buffer.from(sig, "hex");
  const expectedBuf = Buffer.from(expected, "hex");
  if (
    sigBuf.length !== expectedBuf.length ||
    !timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null;
  }

  const issuedAt = parseInt(issuedAtStr, 10);
  if (Number.isNaN(issuedAt) || Date.now() / 1000 - issuedAt > SESSION_TTL) {
    return null;
  }

  return { username, role };
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  const admin = await prisma.adminUser.findUnique({
    where: { username: user.username },
  });
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}

export function isAuthorized() {
  return getSessionUser().then(Boolean);
}
