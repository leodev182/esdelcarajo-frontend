"use client";

import Image from "next/image";
import { LandingSection } from "@/src/lib/api/landing.api";

interface DynamicSectionProps {
  section: LandingSection;
}

export function DynamicSection({ section }: DynamicSectionProps) {
  const getLayoutClass = () => {
    switch (section.textPosition) {
      case "LEFT":
        return "grid md:grid-cols-2 gap-8 items-center";
      case "RIGHT":
        return "grid md:grid-cols-2 gap-8 items-center";
      case "TOP":
        return "flex flex-col gap-8";
      case "BOTTOM":
        return "flex flex-col-reverse gap-8";
      case "CENTER":
      default:
        return "flex flex-col gap-8 items-center text-center";
    }
  };

  const getTextAlignClass = () => {
    switch (section.textPosition) {
      case "LEFT":
        return "text-left";
      case "RIGHT":
        return "text-right md:order-2";
      case "CENTER":
        return "text-center";
      default:
        return "text-left";
    }
  };

  return (
    <section className="py-20" style={{ backgroundColor: section.bgColor }}>
      <div className="container px-6 md:px-8">
        <div className={getLayoutClass()}>
          <div className={getTextAlignClass()}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {section.title}
            </h2>
            {section.description && (
              <p className="text-xl leading-relaxed max-w-2xl">
                {section.description}
              </p>
            )}
          </div>

          {section.images.length > 0 && (
            <div
              className={`grid gap-4 ${
                section.images.length === 1
                  ? "grid-cols-1"
                  : section.images.length === 2
                  ? "grid-cols-2"
                  : section.images.length === 3
                  ? "grid-cols-3"
                  : section.images.length === 4
                  ? "grid-cols-2 md:grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3"
              } ${section.textPosition === "RIGHT" ? "md:order-1" : ""}`}
            >
              {section.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square rounded-lg overflow-hidden border-4 border-dark shadow-lg hover:scale-105 transition-transform"
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
