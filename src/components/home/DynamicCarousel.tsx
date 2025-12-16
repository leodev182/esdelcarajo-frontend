"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LandingSection } from "@/src/lib/api/landing.api";

interface DynamicCarouselProps {
  section: LandingSection;
}

export function DynamicCarousel({ section }: DynamicCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (section.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % section.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [section.images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? section.images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % section.images.length);
  };

  const getTextAlignment = () => {
    switch (section.textPosition) {
      case "LEFT":
        return "left-8 md:left-16 text-left items-start";
      case "RIGHT":
        return "right-8 md:right-16 text-right items-end";
      case "TOP":
        return "top-8 md:top-16 left-1/2 -translate-x-1/2 text-center items-center";
      case "BOTTOM":
        return "bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 text-center items-center";
      case "CENTER":
      default:
        return "left-1/2 -translate-x-1/2 text-center items-center";
    }
  };

  if (section.images.length === 0) {
    return (
      <section
        className="min-h-[400px] flex items-center justify-center"
        style={{ backgroundColor: section.bgColor }}
      >
        <div className="text-center px-6">
          <h2 className="text-4xl md:text-6xl font-bold uppercase mb-4">
            {section.title}
          </h2>
          {section.description && (
            <p className="text-lg md:text-xl font-bold max-w-2xl mx-auto">
              {section.description}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-black group">
      {/* Images */}
      {section.images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>
      ))}

      {/* Content */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 z-20 flex flex-col ${getTextAlignment()} max-w-5xl px-6`}
      >
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white drop-shadow-2xl mb-3 md:mb-4">
          {section.title}
        </h2>
        {section.description && (
          <p className="text-base md:text-xl lg:text-2xl font-bold text-white/95 drop-shadow-lg max-w-2xl leading-snug">
            {section.description}
          </p>
        )}
      </div>

      {/* Navigation Arrows */}
      {section.images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft
              className="w-5 h-5 md:w-6 md:h-6 text-white"
              strokeWidth={2.5}
            />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Siguiente"
          >
            <ChevronRight
              className="w-5 h-5 md:w-6 md:h-6 text-white"
              strokeWidth={2.5}
            />
          </button>
        </>
      )}

      {/* Thumbnails Navigation */}
      {section.images.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 z-30 flex flex-col gap-3">
          {section.images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? "border-primary scale-110 shadow-lg shadow-primary/50"
                  : "border-white/30 hover:border-white/60 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 56px, (max-width: 1024px) 64px, 80px"
              />
              {index === currentIndex && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
