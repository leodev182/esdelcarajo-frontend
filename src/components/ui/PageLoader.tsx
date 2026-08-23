"use client";

// Path reordenado para que el trace arranque desde el vértice superior del rayo
// y recorra de arriba hacia abajo. Longitud total ≈ 360 unidades SVG.
const BOLT_PATH =
  "M 115.580,122.273 L 98.035,182.324 L 118.474,182.867 L 62.945,260.644 L 80.671,202.040 L 58.604,201.859 Z";

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
          from { stroke-dashoffset: 400; }
          to   { stroke-dashoffset: -30; }
        }

        @keyframes fadeRayo {
          0%   { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }

        .pg-wrap {
          height: 40vh;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeRayo 1.4s ease-in forwards;
        }

        .pg-ghost {
          opacity: 0.12;
        }

        .pg-trace {
          stroke-dasharray: 30 370;
          stroke-dashoffset: 400;
          filter:
            drop-shadow(0 0 3px #fff)
            drop-shadow(0 0 6px #ffd42a)
            drop-shadow(0 0 16px #ffd42a)
            drop-shadow(0 0 32px rgba(255, 200, 0, 0.45));
          animation: traceRayo 1.4s ease-in forwards;
        }
      `}</style>

      <div className="pg-wrap">
        <svg
          viewBox="0 0 64.334862 142.83391"
          style={{ height: "100%", width: "auto" }}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <linearGradient id="pg-grad">
              <stop stopColor="#e34d00" stopOpacity={1} offset="0.32054454" />
              <stop stopColor="#ffd42a" stopOpacity={1} offset="1" />
            </linearGradient>
            <linearGradient
              xlinkHref="#pg-grad"
              id="pg-grad-applied"
              x1="57.999741"
              y1="187.2981"
              x2="119.44058"
              y2="157.99603"
              gradientUnits="userSpaceOnUse"
            />
          </defs>

          <g transform="translate(-56.37185,-120.04131)">
            {/* Silueta tenue del rayo — referencia visual */}
            <path
              className="pg-ghost"
              fill="url(#pg-grad-applied)"
              d={BOLT_PATH}
            />

            {/* Neon trace — recorre el contorno del rayo de arriba a abajo */}
            <path
              className="pg-trace"
              d={BOLT_PATH}
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
