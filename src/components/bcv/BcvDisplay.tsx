"use client";

import { useBcv } from "@/src/lib/hooks/useBcv";

export function BcvDisplay() {
  const { rate, isLoading } = useBcv();

  if (isLoading || !rate) {
    return (
      <div className="flex gap-4">
        <div className="bg-white text-black font-black px-4 py-2 border-4 border-orange-500">
          TASA $ BCV
        </div>
        <div className="bg-white text-black font-black px-4 py-2 border-4 border-orange-500 min-w-[110px] text-center">
          &nbsp;
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="bg-white text-black font-black px-4 py-2 border-4 border-orange-500">
        TASA $ BCV
      </div>
      <div className="bg-white text-black font-black px-4 py-2 border-4 border-orange-500 min-w-[110px] text-center">
        {rate.toFixed(2)} BS
      </div>
    </div>
  );
}
