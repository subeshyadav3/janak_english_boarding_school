"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
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
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
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
        className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark transition-colors disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
