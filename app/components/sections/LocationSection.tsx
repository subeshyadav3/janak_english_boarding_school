import { MapPin, Navigation } from "lucide-react";
import { MAP_DIRECTIONS, MAP_EMBED } from "@/lib/constants";

export default function LocationSection({ address }: { address: string }) {
  return (
    <section id="location" className="section-pad bg-surface-muted">
      <div className="container-site">
        <h2 className="section-title">Our Location</h2>
        <div className="section-title-line" />
        <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-lg ring-1 ring-line">
          <iframe
            title="Janak English Boarding School Location"
            src={MAP_EMBED}
            className="h-[400px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
          <p className="inline-flex items-center gap-2 font-medium">
            <MapPin className="h-4 w-4 text-accent" /> {address}
          </p>
          <a
            href={MAP_DIRECTIONS}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-white font-semibold hover:bg-brand-dark transition-colors shadow-sm"
          >
            <Navigation className="h-4 w-4" /> Get Directions on Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
