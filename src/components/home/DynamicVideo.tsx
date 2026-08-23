"use client";

import { LandingSection } from "@/src/lib/api/landing.api";

interface DynamicVideoProps {
  section: LandingSection;
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);

    // YouTube: watch?v=ID or youtu.be/ID or shorts/ID
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      let id =
        u.searchParams.get("v") ||
        (u.hostname === "youtu.be" ? u.pathname.slice(1) : null) ||
        (u.pathname.startsWith("/shorts/") ? u.pathname.split("/")[2] : null);
      if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
    }

    // Vimeo: vimeo.com/ID
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    return null;
  } catch {
    return null;
  }
}

export function DynamicVideo({ section }: DynamicVideoProps) {
  const embedUrl = section.videoUrl ? getEmbedUrl(section.videoUrl) : null;

  return (
    <section className="py-20" style={{ backgroundColor: section.bgColor }}>
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

        {embedUrl ? (
          <div className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border-4 border-dark"
               style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={embedUrl}
              title={section.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full max-w-5xl mx-auto aspect-video rounded-xl border-4 border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-400 text-sm">URL de video no válida</p>
          </div>
        )}
      </div>
    </section>
  );
}
