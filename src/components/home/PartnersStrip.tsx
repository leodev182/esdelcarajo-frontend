"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePartners } from "@/src/lib/hooks/useLanding";

export function PartnersStrip() {
  const { data: partners } = usePartners();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!partners || partners.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container mx-auto px-6 md:px-8">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {partners.map((p, i) => {
            const style: React.CSSProperties = {
              opacity: visible ? 0.7 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 400ms cubic-bezier(0.23,1,0.32,1) ${i * 80}ms, transform 400ms cubic-bezier(0.23,1,0.32,1) ${i * 80}ms`,
            };

            const img = (
              <Image
                src={p.imageUrl}
                alt="partner"
                width={160}
                height={60}
                className="object-contain max-h-14 w-auto"
              />
            );

            return p.linkUrl ? (
              <a
                key={p.id}
                href={p.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={style}
                className="hover:opacity-100 transition-opacity duration-200"
              >
                {img}
              </a>
            ) : (
              <div key={p.id} style={style}>
                {img}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
