"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, GraduationCap } from "lucide-react";

type Role = "admin" | "teacher";

export default function AdminLoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.push(data.role === "teacher" ? "/teacher" : "/admin");
      router.refresh();
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface p-1.5">
        <button
          type="button"
          onClick={() => setRole("admin")}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
            role === "admin"
              ? "bg-white text-brand shadow"
              : "text-brand-deep/60 hover:text-brand-deep"
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Admin
        </button>
        <button
          type="button"
          onClick={() => setRole("teacher")}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
            role === "teacher"
              ? "bg-white text-accent shadow"
              : "text-brand-deep/60 hover:text-brand-deep"
          }`}
        >
          <GraduationCap className="h-4 w-4" /> Teacher
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={`${role === "admin" ? "Admin" : "Teacher"} username`}
        required
        autoComplete="username"
        className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        required
        autoComplete="current-password"
        className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-lg px-4 py-3 text-sm font-bold text-white transition-colors disabled:opacity-50 ${
          role === "admin"
            ? "bg-brand hover:bg-brand-dark"
            : "bg-gradient-to-r from-accent to-orange-400 hover:opacity-90"
        }`}
      >
        {loading ? "Signing in..." : `Sign In as ${role === "admin" ? "Admin" : "Teacher"}`}
      </button>
    </form>
  );
}
