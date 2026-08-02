"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, GraduationCap, LogIn, LayoutDashboard } from "lucide-react";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/constants";

export interface NavUser {
  username: string;
  role: string;
}

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "facilities", label: "Facilities" },
  { id: "teachers", label: "Teachers" },
  { id: "notices", label: "Notices" },
  { id: "results", label: "Results" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({
  settings = DEFAULT_SETTINGS,
  user,
}: {
  settings?: SiteSettings;
  user?: NavUser | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-white/95 backdrop-blur shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-site flex items-center justify-between py-3">
        <button onClick={() => goTo("home")} className="flex items-center gap-3">
          {settings.logo ? (
            <Image
              src={settings.logo}
              alt={settings.schoolName}
              width={44}
              height={44}
              className="rounded-xl object-contain bg-white shadow"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <GraduationCap className="h-6 w-6" />
            </span>
          )}
          <div className="text-left">
            <p
              className={`font-bold leading-tight text-sm sm:text-base ${
                scrolled || open ? "text-brand-deep" : "text-white"
              }`}
            >
              Janak English Boarding School
            </p>
            <p className="text-accent text-[11px] uppercase tracking-wider">
              Gaur, Rautahat
            </p>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                scrolled || open
                  ? "text-brand-deep/80 hover:text-brand"
                  : "text-white/90 hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
          {user ? (
            <Link
              href={user.role === "admin" ? "/admin" : "/teacher"}
              className={`ml-2 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold transition-colors ${
                scrolled || open
                  ? "bg-brand text-white hover:bg-brand-dark"
                  : "bg-white/15 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/25"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={`ml-2 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold transition-colors ${
                scrolled || open
                  ? "bg-brand text-white hover:bg-brand-dark"
                  : "bg-white/15 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/25"
              }`}
            >
              <LogIn className="h-4 w-4" /> Login
            </Link>
          )}
        </nav>

        <button
          className={`lg:hidden p-2 ${scrolled || open ? "text-brand-deep" : "text-white"}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden bg-white border-t border-line px-4 py-3 shadow-lg">
          <div className="grid grid-cols-2 gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className="px-3 py-2 text-sm text-left font-medium text-brand-deep/80 hover:text-brand transition-colors"
              >
                {item.label}
              </button>
            ))}
            {user ? (
              <Link
                href={user.role === "admin" ? "/admin" : "/teacher"}
                onClick={() => setOpen(false)}
                className="col-span-2 mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="col-span-2 mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors"
              >
                <LogIn className="h-4 w-4" /> Staff Login
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
