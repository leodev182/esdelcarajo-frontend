"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { LandingSection } from "@/src/lib/api/landing.api";
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
    };
    window.addEventListener("keydown", handler);
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

        .gallery-figure::before,
        .gallery-figure::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 16px solid rgba(0,0,0,0.1);
          transition: border-width 0.2s ease;
          z-index: 1;
          pointer-events: none;
        }
        .gallery-figure::after {
          border-width: 0;
        }

        .gallery-item:hover .gallery-figure::before {
          border-width: 16px;
        }
        .gallery-item:hover .gallery-figure::after {
          border-width: 32px;
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

        .gallery-item:hover .gallery-figcaption {
          color: rgba(255,255,255,1);
          text-shadow: 0 0 1px rgba(0,0,0,0.2);
        }

        .gallery-img {
          display: block;
          width: 100%;
          height: auto;
          transition: transform 0.3s ease;
        }

        .gallery-item:hover .gallery-img {
          transform: scale(1.03);
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
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
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
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
          className="lightbox-overlay"
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
