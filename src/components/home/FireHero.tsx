"use client";

import { useEffect, useRef } from "react";

function getZone(fill: string): number {
  const m = fill.match(/#[0-9a-f]{2}([0-9a-f]{2})/i);
  if (!m) return 4;
  const green = parseInt(m[1], 16);
  if (green > 180) return 0; // yellow tips — most movement
  if (green > 100) return 1; // bright orange
  if (green >  50) return 2; // orange-red middle
  if (green >  25) return 3; // red lower
  return 4;                  // dark base — least movement
}

export function FireHero() {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const fpsRef          = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container) return;

    let rafId = 0;

    // Defer SVG load so it doesn't block LCP / main thread on mount
    const timer = setTimeout(() => {
      fetch("/images/Burn2.svg")
        .then(r => r.text())
        .then(svgText => {
          container.innerHTML = svgText;
          const svg = container.querySelector("svg");
          if (!svg) return;

          // Responsive + cheaper rendering (geometricPrecision is expensive)
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.setAttribute("viewBox", "0 0 1536 1024");
          svg.setAttribute("preserveAspectRatio", "xMidYMax meet");
          svg.style.cssText = "width:100%;height:100%;display:block;shape-rendering:auto;";

        // Snapshot all direct <g> children before DOM manipulation
        const NS = "http://www.w3.org/2000/svg";
        const allGroups = Array.from(svg.children) as Element[];

        // Create 5 zone wrappers (index 0 = tips rendered last = on top)
        const wrappers = Array.from({ length: 5 }, (_, i) => {
          const w = document.createElementNS(NS, "g");
          w.setAttribute("data-zone", String(i));
          return w;
        });

        // Move each <g><path> into its zone wrapper
        allGroups.forEach(g => {
          const path = g.querySelector("path");
          const fill = path?.getAttribute("fill") ?? "";
          wrappers[getZone(fill)].appendChild(g);
        });

        // Re-append wrappers: base first (bottom z), tips last (top z)
        // Reverse order so zone 4 (base) renders first, zone 0 (tips) last
        [4, 3, 2, 1, 0].forEach(i => svg.appendChild(wrappers[i]));

        const counts = wrappers.map(w => w.children.length);
        console.log("[FireHero] zone counts (0=tips … 4=base):", counts);
        console.log("[FireHero] total elements:", counts.reduce((a, b) => a + b, 0));

          // GSAP animation temporarily disabled for performance baseline

          // FPS counter
          let frames = 0;
          let lastTs = performance.now();
          const countFps = () => {
            frames++;
            const now = performance.now();
            if (now - lastTs >= 1000) {
              if (fpsRef.current) fpsRef.current.textContent = `${frames} FPS`;
              frames = 0;
              lastTs = now;
            }
            rafId = requestAnimationFrame(countFps);
          };
          rafId = requestAnimationFrame(countFps);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div ref={svgContainerRef} className="absolute inset-0" />
      <span
        ref={fpsRef}
        className="absolute top-4 right-4 z-50 bg-black/70 text-green-400 font-mono text-xs px-2 py-1 rounded pointer-events-none"
      />
    </div>
  );
}
