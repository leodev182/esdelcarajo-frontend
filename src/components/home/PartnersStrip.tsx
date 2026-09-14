"use client";

import Image from "next/image";
import { usePartners } from "@/src/lib/hooks/useLanding";

export function PartnersStrip() {
  const { data: partners } = usePartners();

  if (!partners || partners.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {partners.map((p) =>
            p.linkUrl ? (
              <a
                key={p.id}
                href={p.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity duration-200"
              >
                <Image
                  src={p.imageUrl}
                  alt="partner"
                  width={160}
                  height={60}
                  className="object-contain max-h-14 w-auto"
                />
              </a>
            ) : (
              <div key={p.id} className="opacity-70">
                <Image
                  src={p.imageUrl}
                  alt="partner"
                  width={160}
                  height={60}
                  className="object-contain max-h-14 w-auto"
                />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
