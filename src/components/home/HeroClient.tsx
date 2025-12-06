"use client";

import Image from "next/image";
import { Mail, Instagram } from "lucide-react";
import { BcvDisplay } from "@/src/components/bcv/BcvDisplay";

export function HeroClient() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#1a1a1a] text-white -mt-20">
      <Image
        src="/images/hero.png"
        alt="background"
        fill
        className="object-cover opacity-40"
        priority
        unoptimized
      />

      <div className="relative z-20 w-full h-screen flex items-center justify-between px-12 pt-20">
        {/* IZQUIERDA - Contenido agrupado */}
        <div className="flex flex-col gap-8 max-w-md">
          {/* TASA BCV */}
          <BcvDisplay />

          {/* VISIÓN - Más delgado y alargado */}
          <div className="bg-[#C9BEA5] text-black p-6 py-12 border-4 border-black shadow-xl relative max-w-sm">
            <div className="absolute -bottom-3 -right-3 w-full h-full border-4 border-[#FF6501] pointer-events-none"></div>
            <h2 className="text-3xl font-black mb-4 uppercase">Visión</h2>
            <p className="font-bold leading-relaxed text-base">
              Ser la marca de ropa referente de aquellos que se atreven a
              vestirse diferente a través de prendas que cuenten una historia
            </p>
          </div>

          {/* ICONOS */}
          <div className="flex gap-6">
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

        {/* DERECHA - Modelo posicionada en la zona amarilla */}
        <div className="hidden md:block absolute right-12 bottom-0 h-[90vh] w-[500px]">
          <Image
            src="/images/modelo1.png"
            alt="Modelo Del Carajo"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>
    </section>
  );
}
