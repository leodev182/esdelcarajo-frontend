"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { LandingSection } from "@/src/lib/api/landing.api";
import { getFontStyle } from "@/src/lib/utils/font-family";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface DynamicGalleryProps {
  section: LandingSection;
}

const glassStyle: React.CSSProperties = {
  backdropFilter: "blur(20px) saturate(160%)",
  WebkitBackdropFilter: "blur(20px) saturate(160%)",
  backgroundColor: "rgba(194, 184, 184, 0.12)",
  borderTop: "1px solid rgba(255,255,255,0.18)",
  borderBottom: "1px solid rgba(255,255,255,0.18)",
};

export function DynamicGallery({ section }: DynamicGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const isGlass = section.bgColor === "glass";
  const images = section.images;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null)),
    [images.length]
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null)),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeLightbox();
      if (e.key === "Tab" && lightboxRef.current) {
        const focusable = lightboxRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, [tabindex]:not([tabindex='-1'])"
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first)?.focus();
        }
      }
    };

    window.addEventListener("keydown", handler);
    lightboxRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prev, next, closeLightbox]);

  return (
    <section className="py-20" style={isGlass ? glassStyle : { backgroundColor: section.bgColor }}>
      <style>{`
        .gallery-grid {
          columns: 1;
          column-gap: 0;
        }
        @media (min-width: 480px) {
          .gallery-grid { columns: 2; }
        }
        @media (min-width: 1260px) {
          .gallery-grid { columns: 3; }
        }

        .gallery-item {
          display: block;
          break-inside: avoid;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          width: 100%;
          text-align: left;
        }

        .gallery-figure {
          position: relative;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .gallery-figure::before {
          content: '';
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 0 0px rgba(0,0,0,0.1);
          transition: box-shadow 200ms var(--ease-expo);
          z-index: 1;
          pointer-events: none;
        }

        .gallery-figcaption {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 14px;
          color: rgba(255,255,255,0);
          padding: 1em;
          transition: color 0.2s ease 0.3s;
          font-weight: 600;
          max-width: calc(100% - 9em);
          line-height: 1.25;
          text-align: center;
          z-index: 2;
          pointer-events: none;
        }

        .gallery-img {
          display: block;
          width: 100%;
          height: auto;
          transition: transform 280ms var(--ease-expo);
        }

        /* Hover effects only on real pointer devices */
        @media (hover: hover) and (pointer: fine) {
          .gallery-item:hover .gallery-figure::before {
            box-shadow: inset 0 0 0 16px rgba(0,0,0,0.25);
          }
          .gallery-item:hover .gallery-figcaption {
            color: rgba(255,255,255,1);
            text-shadow: 0 0 1px rgba(0,0,0,0.2);
          }
          .gallery-item:hover .gallery-img {
            transform: scale(1.03);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-img { transition: none; }
          .gallery-figure::before { transition: none; }
        }

        /* Lightbox */
        @keyframes lightbox-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lightbox-in 200ms var(--ease-expo);
        }

        .lightbox-img-wrap {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .lightbox-img-wrap img {
          max-width: 90vw;
          max-height: 90vh;
          width: auto !important;
          height: auto !important;
          object-fit: contain;
          display: block;
        }

        .lightbox-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          cursor: pointer;
          padding: 12px;
          border-radius: 4px;
          transition: background 0.2s;
          z-index: 10;
        }
        .lightbox-btn:hover { background: rgba(255,255,255,0.25); }
        .lightbox-prev { left: -3.5rem; }
        .lightbox-next { right: -3.5rem; }

        .lightbox-close {
          position: absolute;
          top: -2.5rem;
          right: 0;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .lightbox-close:hover { opacity: 1; }

        @media (max-width: 640px) {
          .lightbox-prev { left: 0.25rem; }
          .lightbox-next { right: 0.25rem; }
          .lightbox-btn { background: rgba(0,0,0,0.5); }
        }
      `}</style>

      <div className="container px-6 md:px-8">
        {(section.title || section.description) && (
          <div className="text-center mb-10">
            {section.title && (
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={getFontStyle(section.fontFamily)}>
                {section.title}
              </h2>
            )}
            {section.description && (
              <p className="text-xl leading-relaxed max-w-2xl mx-auto">
                {section.description}
              </p>
            )}
          </div>
        )}

        {images.length > 0 ? (
          <div className="gallery-grid">
            {images.map((image, index) => (
              <button
                key={image.id}
                className="gallery-item"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <figure className="gallery-figure">
                  <Image
                    src={image.url}
                    alt={image.alt || ""}
                    width={0}
                    height={0}
                    sizes="(max-width: 480px) 100vw, (max-width: 1260px) 50vw, 33vw"
                    className="gallery-img"
                  />
                  {image.alt && (
                    <figcaption className="gallery-figcaption">
                      {image.alt}
                    </figcaption>
                  )}
                </figure>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          ref={lightboxRef}
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={images[lightboxIndex].alt || `Imagen ${lightboxIndex + 1}`}
          onClick={closeLightbox}
        >
          <div
            className="lightbox-img-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Cerrar">
              <X size={24} />
            </button>

            {images.length > 1 && (
              <button className="lightbox-btn lightbox-prev" onClick={prev} aria-label="Anterior">
                <ChevronLeft size={24} />
              </button>
            )}

            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt || ""}
              width={0}
              height={0}
              sizes="90vw"
              style={{ maxWidth: "90vw", maxHeight: "90vh", width: "auto", height: "auto" }}
              priority
            />

            {images.length > 1 && (
              <button className="lightbox-btn lightbox-next" onClick={next} aria-label="Siguiente">
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
