import Link from "next/link";
import { MapPin, Mail, Phone, ThumbsUp } from "lucide-react";
import { MAP_SHORT } from "@/lib/constants";
import type { SiteSettings } from "@/lib/constants";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-brand-deep text-white/80">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="font-bold text-white">Janak English Boarding School</h4>
          <p className="mt-3 text-sm">{settings.address}</p>
          <p className="mt-1 text-sm">Nursery to Grade 8</p>
        </div>
        <div>
          <h4 className="font-bold text-white">Contact</h4>
          <div className="mt-3 space-y-2 text-sm">
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2 hover:text-accent transition-colors break-all"
              >
                <Mail className="h-4 w-4 shrink-0" /> {settings.email}
              </a>
            )}
            <a
              href={MAP_SHORT}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <MapPin className="h-4 w-4" /> Get Directions
            </a>
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <ThumbsUp className="h-4 w-4" /> Facebook Page
              </a>
            )}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-white">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="hover:text-accent transition-colors"
              >
                Admin
              </Link>
            </li>
            <li>
              <Link
                href="/teacher"
                className="hover:text-accent transition-colors"
              >
                Teacher
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white">Visit Us</h4>
          <p className="mt-3 text-sm">
            Gaur-3, Rautahat
            <br />
            Madhesh Province, Nepal
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Janak English Boarding School Pvt. Ltd. | Quality
        Education - High Discipline - Bright Future
      </div>
    </footer>
  );
}
