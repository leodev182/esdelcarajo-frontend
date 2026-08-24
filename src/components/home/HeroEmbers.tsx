"use client";

import { useEffect, useRef } from "react";

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  hue: number;
  flickerSpeed: number;
  flickerPhase: number;
  type: "large" | "medium" | "spark";
}

// Flame spawn zones as fractions of canvas size
const ZONES = [
  { xMin: 0.03, xMax: 0.22, yMin: 0.5, yMax: 1.0 },  // left flames
  { xMin: 0.78, xMax: 0.97, yMin: 0.5, yMax: 1.0 },  // right flames
  { xMin: 0.34, xMax: 0.66, yMin: 0.6, yMax: 1.0 },  // center behind character
];

function spawnEmber(w: number, h: number): Ember {
  const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
  const rand = Math.random();
  const type: Ember["type"] = rand < 0.15 ? "spark" : rand < 0.5 ? "large" : "medium";

  const cfg = {
    large:  { size: [3, 6],   vy: [-0.6, -1.8],  decay: [0.003, 0.006], hue: [8, 28]  },
    medium: { size: [1.5, 3], vy: [-1.2, -2.8],  decay: [0.005, 0.010], hue: [18, 42] },
    spark:  { size: [0.5, 2], vy: [-3.0, -6.5],  decay: [0.018, 0.035], hue: [35, 55] },
  }[type];

  const lerp = (a: number, b: number) => a + Math.random() * (b - a);

  return {
    x: w * lerp(zone.xMin, zone.xMax),
    y: h * lerp(zone.yMin, zone.yMax),
    vx: (Math.random() - 0.5) * (type === "spark" ? 2.5 : 1.0),
    vy: lerp(cfg.vy[0], cfg.vy[1]),
    size: lerp(cfg.size[0], cfg.size[1]),
    alpha: lerp(0.5, 0.95),
    decay: lerp(cfg.decay[0], cfg.decay[1]),
    hue: lerp(cfg.hue[0], cfg.hue[1]),
    flickerSpeed: lerp(0.04, 0.12),
    flickerPhase: Math.random() * Math.PI * 2,
    type,
  };
}

function drawBaseGlow(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  ZONES.forEach((zone, i) => {
    const cx = w * (zone.xMin + zone.xMax) / 2;
    const cy = h;
    const rx = w * (zone.xMax - zone.xMin) * 1.1;
    const ry = rx * 0.55;
    const pulse = Math.sin(frame * 0.018 + i * 2.1) * 0.12 + 0.28;

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grd.addColorStop(0,   `rgba(255, 90, 0, ${pulse})`);
    grd.addColorStop(0.4, `rgba(220, 50, 0, ${pulse * 0.5})`);
    grd.addColorStop(1,   `rgba(0, 0, 0, 0)`);

    ctx.save();
    ctx.scale(1, ry / rx);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy * (rx / ry), rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

export function HeroEmbers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let embers: Ember[] = [];
    let animId: number;
    let frame = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base flame glow
      drawBaseGlow(ctx, canvas.width, canvas.height, frame);

      // Spawn: 4 embers every frame, 1 extra spark every 3 frames
      for (let i = 0; i < 4; i++) embers.push(spawnEmber(canvas.width, canvas.height));
      if (frame % 3 === 0) embers.push(spawnEmber(canvas.width, canvas.height));

      // Hard cap to avoid memory growth
      if (embers.length > 400) embers.splice(0, embers.length - 400);

      // Update + draw
      embers = embers.filter((e) => {
        e.x  += e.vx;
        e.y  += e.vy;
        e.vy *= 0.992;                         // slight drag
        e.vx += (Math.random() - 0.5) * 0.08; // organic drift
        e.alpha -= e.decay;

        if (e.alpha <= 0) return false;

        const flicker = Math.sin(frame * e.flickerSpeed + e.flickerPhase) * 0.18 + 0.82;
        const lightness = e.type === "spark" ? 80 : 65;
        const blur      = e.type === "large" ? 18 : e.type === "medium" ? 10 : 6;

        ctx.save();
        ctx.globalAlpha  = Math.min(e.alpha * flicker, 1);
        ctx.shadowBlur   = blur;
        ctx.shadowColor  = `hsl(${e.hue}, 100%, 60%)`;
        ctx.fillStyle    = `hsl(${e.hue}, 100%, ${lightness}%)`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
}
