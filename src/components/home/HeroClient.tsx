"use client";

import Image from "next/image";
import { Mail, Instagram } from "lucide-react";
import { BcvDisplay } from "@/src/components/bcv/BcvDisplay";

export function HeroClient() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#1a1a1a] text-white">
      <Image
        src="/images/hero.png"
        alt="background"
        fill
        className="object-cover opacity-40"
        priority
      />

      <div className="relative z-20 container px-6 py-20 min-h-screen flex flex-col justify-center items-center">
        <div className="max-w-2xl w-full space-y-12">
          {/* TASA BCV */}
          <div className="flex justify-center">
            <BcvDisplay />
          </div>

          {/* Caja VISIÓN */}
          <div className="bg-white text-black p-8 border-4 border-black shadow-xl relative">
            <div className="absolute -bottom-3 -right-3 w-full h-full border-4 border-orange-500 pointer-events-none"></div>
            <h2 className="text-4xl font-black mb-4">VISIÓN</h2>
            <p className="font-bold leading-relaxed text-lg">
              Ser la marca de ropa referente de aquellos que se atreven a
              vestirse diferente a través de prendas que cuenten una historia
            </p>
          </div>

          {/* ICONOS */}
          <div className="flex justify-center gap-6">
            <a
              href="https://instagram.com/esdelcarajo"
              target="_blank"
              className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
              rel="noopener noreferrer"
            >
              <Instagram className="text-white w-7 h-7" />
            </a>
            <a
              href="mailto:contacto@esdelcarajo.com"
              className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
              rel="noopener noreferrer"
            >
              <Mail className="text-white w-7 h-7" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
