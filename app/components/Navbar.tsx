"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, GraduationCap } from "lucide-react";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/constants";

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
}: {
  settings?: SiteSettings;
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
          </div>
        </nav>
      )}
    </header>
  );
}
