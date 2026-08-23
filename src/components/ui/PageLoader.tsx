"use client";

// Un solo SVG, un solo path:
//   1. Línea desde top-center hasta P4 (vértice superior del bolt)
//   2. Recorre el borde COMPLETO del bolt (igual que jocoso con el control)
//   3. Línea desde P4 hasta bottom-center
//
// Coordenadas en viewBox 200×1000 (bolt ocupa y:306-694, centrado en x:100)
//   P4 (tope)   176, 306
//   P5          127, 474
//   P6          184, 476
//   P1 (base)    28, 694
//   P2           78, 530
//   P3 (notch)   16, 529
//
// Longitud total del path ≈ 2022 unidades

const PATH =
  "M 100,0 L 176,306 L 127,474 L 184,476 L 28,694 L 78,530 L 16,529 L 176,306 L 28,694 L 100,1000";

const BOLT =
  "M 176,306 L 127,474 L 184,476 L 28,694 L 78,530 L 16,529 Z";

const LEN = 2500;
const SEG = 55;
const DUR = "1.8s";

export function PageLoader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
      }}
    >
      <style>{`
        @keyframes traceRayo {
          from { stroke-dashoffset: ${LEN}; }
          to   { stroke-dashoffset: -${SEG}; }
        }

        .pg-trace {
          stroke-dasharray: ${SEG} ${LEN - SEG};
          stroke-dashoffset: ${LEN};
          filter:
            drop-shadow(0 0 1px #fff)
            drop-shadow(0 0 4px #ffd42a)
            drop-shadow(0 0 10px #ffd42a)
            drop-shadow(0 0 22px rgba(255,200,0,0.5));
          animation: traceRayo ${DUR} ease-in forwards;
        }

        /* Fill: se revela mientras el trace baja por el bolt (15%→40%) */
        @keyframes boltReveal {
          0%   { clip-path: inset(0 0 100% 0); opacity: 1; }
          15%  { clip-path: inset(0 0 100% 0); opacity: 1; }
          42%  { clip-path: inset(0 0 0%   0); opacity: 1; }
          80%  { clip-path: inset(0 0 0%   0); opacity: 1; }
          100% { clip-path: inset(0 0 0%   0); opacity: 0; }
        }

        .pg-fill { animation: boltReveal ${DUR} ease-in forwards; }

        @keyframes loaderFade {
          0% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; }
        }
        .pg-wrap { animation: loaderFade ${DUR} ease-in forwards; }
      `}</style>

      <svg
        viewBox="0 0 200 1000"
        className="pg-wrap"
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          transform: "translateX(-50%)",
          height: "100vh",
          width: "20vh",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient
            id="pg-grad"
            x1="14.6" y1="488" x2="186.6" y2="406"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e34d00" offset="0.32" />
            <stop stopColor="#ffd42a" offset="1" />
          </linearGradient>
        </defs>

        {/* Silueta tenue — el trace sabe adónde va */}
        <path d={BOLT} fill="white" opacity={0.12} />

        {/* Fill naranja/amarillo — se revela mientras el trace baja */}
        <path className="pg-fill" d={BOLT} fill="url(#pg-grad)" />

        {/* El trace: entra desde arriba, dibuja el borde del bolt, sale hacia abajo */}
        <path
          className="pg-trace"
          d={PATH}
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
