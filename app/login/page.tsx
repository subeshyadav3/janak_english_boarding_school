import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import AdminLoginForm from "@/app/components/AdminLoginForm";

export const metadata: Metadata = {
  title: "Login - Janak English Boarding School",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-deep via-brand-dark to-brand-deep px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <GraduationCap className="h-7 w-7 text-accent" />
          </span>
          <span className="text-xl font-bold text-white">
            School Portal
          </span>
        </Link>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h1 className="text-center text-2xl font-bold text-brand-deep">
            Sign In
          </h1>
          <p className="mt-1 text-center text-sm text-brand-deep/60">
            Janak English Boarding School
          </p>

          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
