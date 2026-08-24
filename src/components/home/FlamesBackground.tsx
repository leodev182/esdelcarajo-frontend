"use client";

export function FlamesBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
      <style>{`
        @keyframes fl1 {
          0%,100% { transform: scaleX(1) scaleY(1) translateX(0px); }
          25%      { transform: scaleX(0.88) scaleY(1.12) translateX(-12px); }
          55%      { transform: scaleX(1.08) scaleY(0.93) translateX(7px); }
          80%      { transform: scaleX(0.95) scaleY(1.05) translateX(-4px); }
        }
        @keyframes fl2 {
          0%,100% { transform: scaleX(1) scaleY(1) translateX(0px) translateY(0px); }
          30%      { transform: scaleX(1.1) scaleY(0.91) translateX(10px) translateY(-8px); }
          65%      { transform: scaleX(0.9) scaleY(1.09) translateX(-7px) translateY(5px); }
        }
        @keyframes fl3 {
          0%,100% { transform: scaleX(1) scaleY(1); }
          35%      { transform: scaleX(0.85) scaleY(1.15) translateX(5px); }
          70%      { transform: scaleX(1.12) scaleY(0.88) translateX(-9px); }
        }
        @keyframes fl4 {
          0%,100% { transform: scaleX(1) scaleY(1) translateX(0px); }
          45%      { transform: scaleX(1.15) scaleY(0.9) translateX(6px); }
          75%      { transform: scaleX(0.9) scaleY(1.1) translateX(-5px); }
        }
        @keyframes fl5 {
          0%,100% { transform: scaleX(1) scaleY(1) translateY(0px); }
          40%      { transform: scaleX(0.93) scaleY(1.07) translateY(-12px); }
          70%      { transform: scaleX(1.06) scaleY(0.95) translateY(6px); }
        }
      `}</style>

      {/*
        El truco: filter blur+contrast sobre fondo oscuro.
        El blur fusiona los blobs y el contrast crea bordes afilados
        que imitan las lenguas de fuego reales.
      */}
      <div style={{
        position: 'absolute',
        inset: 0,
        filter: 'blur(14px) contrast(22)',
        background: '#1a1a1a',
      }}>

        {/* ── LLAMAS IZQUIERDA ─────────────────────── */}
        <div style={{ position:'absolute', width:180, height:340,
          background:'#FF6501', borderRadius:'50% 50% 42% 42%',
          left:'16%', bottom:-40,
          animation:'fl1 2.2s ease-in-out infinite' }} />

        <div style={{ position:'absolute', width:130, height:260,
          background:'#FF6501', borderRadius:'50% 50% 42% 42%',
          left:'10%', bottom:-30,
          animation:'fl2 1.85s ease-in-out infinite',
          animationDelay:'-0.6s' }} />

        <div style={{ position:'absolute', width:90, height:200,
          background:'#FFD42A', borderRadius:'50% 50% 42% 42%',
          left:'19%', bottom:10,
          animation:'fl3 1.55s ease-in-out infinite',
          animationDelay:'-0.25s' }} />

        <div style={{ position:'absolute', width:60, height:140,
          background:'#FFD42A', borderRadius:'50% 50% 42% 42%',
          left:'13%', bottom:5,
          animation:'fl5 1.4s ease-in-out infinite',
          animationDelay:'-0.9s' }} />

        {/* base izquierda */}
        <div style={{ position:'absolute', width:260, height:110,
          background:'#CC2200', borderRadius:'50%',
          left:'6%', bottom:-60,
          animation:'fl4 2.6s ease-in-out infinite' }} />


        {/* ── LLAMAS DERECHA ───────────────────────── */}
        <div style={{ position:'absolute', width:180, height:340,
          background:'#FF6501', borderRadius:'50% 50% 42% 42%',
          right:'16%', bottom:-40,
          animation:'fl2 2.4s ease-in-out infinite',
          animationDelay:'-1.1s' }} />

        <div style={{ position:'absolute', width:130, height:260,
          background:'#FF6501', borderRadius:'50% 50% 42% 42%',
          right:'10%', bottom:-30,
          animation:'fl1 2s ease-in-out infinite',
          animationDelay:'-0.75s' }} />

        <div style={{ position:'absolute', width:90, height:200,
          background:'#FFD42A', borderRadius:'50% 50% 42% 42%',
          right:'19%', bottom:10,
          animation:'fl4 1.6s ease-in-out infinite',
          animationDelay:'-0.4s' }} />

        <div style={{ position:'absolute', width:60, height:140,
          background:'#FFD42A', borderRadius:'50% 50% 42% 42%',
          right:'13%', bottom:5,
          animation:'fl5 1.45s ease-in-out infinite',
          animationDelay:'-1.3s' }} />

        {/* base derecha */}
        <div style={{ position:'absolute', width:260, height:110,
          background:'#CC2200', borderRadius:'50%',
          right:'6%', bottom:-60,
          animation:'fl3 2.5s ease-in-out infinite',
          animationDelay:'-0.5s' }} />


        {/* ── LLAMAS CENTRO (detrás del personaje) ─── */}
        <div style={{ position:'absolute', width:200, height:300,
          background:'#FF6501', borderRadius:'50% 50% 42% 42%',
          left:'50%', bottom:-30,
          transform:'translateX(-50%)',
          animation:'fl3 2.1s ease-in-out infinite',
          animationDelay:'-0.35s' }} />

        <div style={{ position:'absolute', width:140, height:240,
          background:'#FF6501', borderRadius:'50% 50% 42% 42%',
          left:'43%', bottom:-20,
          animation:'fl1 1.9s ease-in-out infinite',
          animationDelay:'-0.8s' }} />

        <div style={{ position:'absolute', width:140, height:240,
          background:'#FF6501', borderRadius:'50% 50% 42% 42%',
          left:'57%', bottom:-20,
          animation:'fl2 2.0s ease-in-out infinite',
          animationDelay:'-1.4s' }} />

        <div style={{ position:'absolute', width:100, height:170,
          background:'#FFD42A', borderRadius:'50% 50% 42% 42%',
          left:'50%', bottom:20,
          transform:'translateX(-50%)',
          animation:'fl5 1.5s ease-in-out infinite',
          animationDelay:'-0.6s' }} />

        {/* base centro */}
        <div style={{ position:'absolute', width:380, height:100,
          background:'#CC2200', borderRadius:'50%',
          left:'50%', bottom:-60,
          transform:'translateX(-50%)',
          animation:'fl4 2.8s ease-in-out infinite' }} />

      </div>
    </div>
  );
}
