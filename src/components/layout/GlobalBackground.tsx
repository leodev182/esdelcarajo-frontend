export function GlobalBackground() {
  return (
    <>
      <style>{`
        .scene {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
          background-color: #C2B8B8;
        }

        .scene__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.45;
          animation: blob-drift var(--dur, 20s) ease-in-out infinite alternate;
        }

        /* Naranja de marca — arriba izquierda */
        .scene__blob--1 {
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, #FF6501, #e34d00);
          top: -200px;
          left: -150px;
          --dur: 22s;
        }

        /* Beige cálido — abajo derecha */
        .scene__blob--2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #C9BEA5, #b8ad94);
          bottom: -200px;
          right: -100px;
          --dur: 18s;
          animation-delay: -8s;
        }

        /* Amarillo cálido — centro */
        .scene__blob--3 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #ffd42a, #FF6501);
          top: 40%;
          left: 45%;
          --dur: 26s;
          animation-delay: -14s;
          opacity: 0.25;
        }

        @keyframes blob-drift {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(60px, -40px) scale(1.08); }
          66%  { transform: translate(-40px, 55px) scale(0.94); }
          100% { transform: translate(30px, 25px) scale(1.05); }
        }
      `}</style>

      <div className="scene" aria-hidden="true">
        <div className="scene__blob scene__blob--1" />
        <div className="scene__blob scene__blob--2" />
        <div className="scene__blob scene__blob--3" />
      </div>
    </>
  );
}
