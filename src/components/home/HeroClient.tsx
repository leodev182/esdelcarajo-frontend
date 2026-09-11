"use client";

import { Mail, Instagram } from "lucide-react";

export function HeroClient() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black -mt-20">

      {/* Video wrap — altura = 100% del hero, ancho calculado por aspect-ratio */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full overflow-hidden bg-black"
        style={{ aspectRatio: "832 / 560" }}
      >
        <video
          src="/images/goyollamas.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="block w-full h-full object-cover"
        />
        {/* Fade edges hacia negro */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `
              linear-gradient(to right, #000 0%, transparent 7%, transparent 93%, #000 100%),
              linear-gradient(to bottom, #000 0%, transparent 7%, transparent 93%, #000 100%)
            `,
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* Iconos sociales */}
      <div className="absolute bottom-12 left-12 z-20 flex gap-6">
        <a
          href="https://instagram.com/esdelcarajo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
        >
          <Instagram className="text-white w-7 h-7" />
        </a>
        <a
          href="mailto:contacto@esdelcarajo.com"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
        >
          <Mail className="text-white w-7 h-7" />
        </a>
      </div>
    </section>
  );
}
