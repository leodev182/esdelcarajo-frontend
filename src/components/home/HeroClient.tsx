"use client";

import { Mail, Instagram } from "lucide-react";
import { FireHero } from "@/src/components/home/FireHero";

export function HeroClient() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black -mt-20">

      {/* Fuego SVG animado */}
      <FireHero />

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
