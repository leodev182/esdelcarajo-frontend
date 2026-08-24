"use client";

import { useEffect, useRef } from "react";

// Brand fire palette: transparent → dark red → #FF6501 → #FFD42A → white
function buildPalette(): Uint32Array {
  const p = new Uint32Array(256);
  p[0] = 0x00000000;

  for (let i = 1; i < 256; i++) {
    let r: number, g: number, b: number;
    const a = Math.min(255, i * 4);

    if (i < 80) {
      r = Math.min(255, i * 3);
      g = 0;
      b = 0;
    } else if (i < 160) {
      const t = (i - 80) / 80;
      r = 255;
      g = Math.floor(t * 101);
      b = Math.floor(t * 1);
    } else if (i < 220) {
      const t = (i - 160) / 60;
      r = 255;
      g = Math.floor(101 + t * (212 - 101));
      b = Math.floor(1 + t * (42 - 1));
    } else {
      const t = (i - 220) / 35;
      r = 255;
      g = Math.floor(212 + t * (255 - 212));
      b = Math.floor(42 + t * (255 - 42));
    }

    // Little-endian RGBA: (A<<24)|(B<<16)|(G<<8)|R
    p[i] = ((a & 0xFF) << 24) | ((b & 0xFF) << 16) | ((g & 0xFF) << 8) | (r & 0xFF);
  }
  return p;
}

const PALETTE = buildPalette();

interface FireCanvasProps {
  width: number;
  height: number;
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function FireCanvas({ width, height, intensity = 0.85, className, style }: FireCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const fire = new Uint8Array(width * height);
    const imageData = ctx.createImageData(width, height);
    const pixels = new Uint32Array(imageData.data.buffer);

    let animId: number;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      // Seed bottom rows as heat source
      for (let x = 0; x < width; x++) {
        const v = Math.random() < 0.08 ? 0 : Math.floor(220 + Math.random() * 35 * intensity);
        fire[(height - 1) * width + x] = Math.min(255, v);
        fire[(height - 2) * width + x] = Math.min(255, v - 10);
      }

      // Diffuse upward
      for (let y = 0; y < height - 2; y++) {
        for (let x = 0; x < width; x++) {
          const below  = fire[(y + 1) * width + x];
          const belowL = fire[(y + 1) * width + Math.max(0, x - 1)];
          const belowR = fire[(y + 1) * width + Math.min(width - 1, x + 1)];
          const below2 = fire[(y + 2) * width + x];

          const avg = (below + belowL + belowR + below2) >> 2;
          const cool = Math.random() < 0.5 ? 1 : 0;
          fire[y * width + x] = Math.max(0, avg - cool);
        }
      }

      // Render
      for (let i = 0; i < width * height; i++) {
        pixels[i] = PALETTE[fire[i]];
      }

      ctx.putImageData(imageData, 0, 0);
    };

    tick();
    return () => cancelAnimationFrame(animId);
  }, [width, height, intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={style}
    />
  );
}
