"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryItem = {
  id: string;
  imagePath: string;
  title?: string | null;
};

export default function GallerySection({ items }: { items: GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () =>
      setLightbox((v) =>
        v === null ? v : (v - 1 + items.length) % items.length
      ),
    [items.length]
  );
  const next = useCallback(
    () => setLightbox((v) => (v === null ? v : (v + 1) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, prev, next]);

  return (
    <section id="gallery" className="section-pad">
      <div className="container-site">
        <h2 className="section-title">Gallery</h2>
        <div className="section-title-line" />
        {items.length === 0 ? (
          <p className="text-center text-sm text-brand-deep/60">
            Photos coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setLightbox(i)}
                className="relative aspect-square overflow-hidden rounded-xl group"
              >
                <Image
                  src={item.imagePath}
                  alt={item.title || "Gallery photo"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && items[lightbox] && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-5 right-5 text-white hover:text-accent"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 text-white hover:text-accent"
            aria-label="Previous"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
          <Image
            src={items[lightbox].imagePath}
            alt={items[lightbox].title || "Gallery photo"}
            width={1200}
            height={800}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full object-contain rounded-lg"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 text-white hover:text-accent"
            aria-label="Next"
          >
            <ChevronRight className="h-10 w-10" />
          </button>
        </div>
      )}
    </section>
  );
}
