"use client";

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
        @keyframes lightningFall {
          0%   { top: -25vh; opacity: 1; }
          88%  { opacity: 1; }
          100% { top: 115vh;  opacity: 0; }
        }

        @keyframes boltReveal {
          0%   { clip-path: inset(0 0 100% 0); opacity: 1; }
          30%  { clip-path: inset(0 0 100% 0); opacity: 1; }
          68%  { clip-path: inset(0 0 0%   0); opacity: 1; }
          78%  { clip-path: inset(0 0 0%   0); opacity: 1; }
          100% { clip-path: inset(0 0 0%   0); opacity: 0; }
        }

        .pg-lightning {
          position: absolute;
          left: 50%;
          top: -25vh;
          width: 3px;
          height: 200px;
          transform: translateX(-50%) rotate(-10deg);
          border-radius: 0 0 3px 3px;
          background: linear-gradient(
            to bottom,
            transparent       0%,
            rgba(255,212,42,0.10) 20%,
            rgba(255,212,42,0.45) 55%,
            rgba(255,255,255,0.92) 82%,
            rgba(255,255,255,1)   100%
          );
          box-shadow:
            0 0  6px  3px rgba(255, 212, 42, 0.65),
            0 0 18px  7px rgba(255, 212, 42, 0.30),
            0 0 40px 16px rgba(255, 200,  0, 0.12);
          animation: lightningFall 1.3s cubic-bezier(0.3, 0, 0.65, 1) forwards;
        }

        .pg-bolt {
          height: 40vh;
          display: flex;
          align-items: center;
          animation: boltReveal 1.3s cubic-bezier(0.3, 0, 0.65, 1) forwards;
        }
      `}</style>

      {/* Rayo que cae */}
      <div className="pg-lightning" />

      {/* Logo bolt dibujado por el rayo al pasar */}
      <div className="pg-bolt">
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
            <path
              fill="url(#pg-grad-applied)"
              d="m 62.945189,260.64372 17.725943,-58.60414 -22.066991,-0.18087 56.976249,-79.58587 -17.54507,60.05115 20.4391,0.54263 z"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
