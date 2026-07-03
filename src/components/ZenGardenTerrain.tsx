"use client";

import React from "react";
import Image from "next/image";
import { soundManager } from "@/lib/sound";

interface ZenGardenTerrainProps {
  onOpenSuntukan: () => void;
  isNear?: boolean;
}

export default function ZenGardenTerrain({
  onOpenSuntukan,
  isNear = false,
}: ZenGardenTerrainProps) {
  const handleClick = () => {
    soundManager.playSparkle();
    onOpenSuntukan();
  };

  return (
    <div
      style={{
        left: "80px",
        top: "540px",
        width: "360px",
        height: "340px",
      }}
      className="absolute z-20 pointer-events-auto select-none group"
    >
      {/* Connecting Wooden Boardwalk Bridge to central docks */}
      <div
        style={{
          left: "340px",
          top: "120px",
          width: "220px",
          height: "100px",
        }}
        className="absolute bg-gradient-to-r from-[#9c6644] via-[#b07d56] to-[#9c6644] border-y-4 border-[#5c3a21] shadow-xl flex items-center justify-between px-6 z-10"
      >
        {/* Wood plank lines */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_20px,rgba(0,0,0,0.15)_21px)] bg-[length:24px_100%] pointer-events-none" />
        <span className="text-xl animate-float">🏮</span>
        <span className="text-xs font-heading font-bold text-amber-100 bg-black/40 px-2.5 py-1 rounded-full border border-amber-300/40 shadow-inner">
          To Zen Garden 🎋
        </span>
        <span className="text-xl animate-float" style={{ animationDelay: "1s" }}>🏮</span>
      </div>

      {/* Floating Sign Banner above Zen Garden */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto">
        <button
          onClick={handleClick}
          className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:scale-105 active:scale-95 transition-all text-white border-2 border-amber-300 px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-2 font-heading font-extrabold text-xs sm:text-sm whitespace-nowrap animate-bounce cursor-pointer"
        >
          <span>🥊</span>
          <span>Suntukan sa Zen Garden</span>
          <span className="bg-white text-red-600 text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
            Easter Egg
          </span>
        </button>
      </div>

      {/* Brutalist Concrete Stepped Terraces (Outer Step) */}
      <div
        onClick={handleClick}
        className={`w-full h-full bg-gradient-to-br from-[#d4d4d0] via-[#b8b8b0] to-[#9c9c94] border-4 border-[#7a7a72] rounded-[36px] shadow-2xl p-5 cursor-pointer transition-transform duration-300 hover:scale-[1.02] relative overflow-hidden ${
          isNear ? "ring-8 ring-amber-400/80 animate-pulse" : ""
        }`}
      >
        {/* Corner Bonsai & Shrubs */}
        <span className="absolute top-3 left-3 text-2xl drop-shadow-md">🌲</span>
        <span className="absolute top-3 right-3 text-2xl drop-shadow-md">🪴</span>
        <span className="absolute bottom-3 left-3 text-2xl drop-shadow-md">🎋</span>
        <span className="absolute bottom-3 right-3 text-2xl drop-shadow-md">🪨</span>

        {/* Middle Concrete Step */}
        <div className="w-full h-full bg-gradient-to-br from-[#c2c2bc] via-[#a8a8a0] to-[#8a8a82] border-2 border-[#696962] rounded-[28px] p-5 shadow-inner relative flex items-center justify-center">
          
          {/* Inner Sunken Courtyard (Golden Sand / Moss) */}
          <div className="w-full h-full bg-gradient-to-br from-[#e6c594] via-[#d4af37] to-[#b8860b] border-2 border-[#8b6508] rounded-[20px] shadow-inner relative flex flex-col items-center justify-center p-3 overflow-hidden">
            {/* Raked sand lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#8b6508_1px,transparent_1px)] [background-size:12px_12px] opacity-30 pointer-events-none" />

            {/* Arena Title */}
            <div className="text-[11px] font-heading font-extrabold text-amber-950 bg-white/70 px-3 py-0.5 rounded-full mb-2 shadow-sm uppercase tracking-wider">
              Zen Garden
            </div>

            {/* Fighter Sprites Facing Each Other */}
            <div className="flex items-center justify-center gap-3 relative z-10">
              {/* Dana */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-full border-2 border-red-500 p-1 flex items-center justify-center shadow-lg animate-bounce-gentle">
                  <Image
                    src="/assets/festival/dana-portrait.svg"
                    alt="Dana"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className="text-[10px] font-heading font-bold text-red-950 bg-red-200 px-1.5 py-0.2 rounded-full mt-1 border border-red-400">
                  Dana 👑
                </span>
              </div>

              {/* VS Clash Effect */}
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold text-red-600 animate-pulse drop-shadow-md">
                  VS
                </span>
                <span className="text-lg animate-ping">💥</span>
              </div>

              {/* Paul */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-full border-2 border-blue-500 p-1 flex items-center justify-center shadow-lg animate-bounce-gentle" style={{ animationDelay: "0.5s" }}>
                  <Image
                    src="/assets/festival/npc-paul-portrait.svg"
                    alt="Paul"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className="text-[10px] font-heading font-bold text-blue-950 bg-blue-200 px-1.5 py-0.2 rounded-full mt-1 border border-blue-400">
                  Paul 🥡
                </span>
              </div>
            </div>

            {/* Click to Fight Instruction */}
            <div className="mt-2 text-[10px] font-bold text-amber-950 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-500/50 shadow-sm animate-pulse">
              Tap to enter Suntukan mode! ✨
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
