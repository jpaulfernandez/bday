"use client";

import React from "react";

export default function NorthDockTerrain() {
  return (
    <div
      style={{
        left: "930px",
        top: "160px",
        width: "140px",
        height: "400px",
      }}
      className="absolute z-10 pointer-events-auto select-none group"
    >
      {/* Long Wooden Dock extending into North Waters */}
      <div className="w-full h-full bg-gradient-to-b from-[#8f5e38] via-[#a6714a] to-[#8f5e38] border-x-4 border-y-4 border-[#5c3a21] shadow-2xl relative overflow-hidden rounded-t-lg">
        {/* Horizontal wood plank lines */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24px,rgba(0,0,0,0.18)_25px)] bg-[length:100%_26px] pointer-events-none" />
        
        {/* Dock edge posts / bollards */}
        <div className="absolute top-4 left-1 w-3 h-3 bg-[#422814] rounded-full shadow-inner" />
        <div className="absolute top-4 right-1 w-3 h-3 bg-[#422814] rounded-full shadow-inner" />
        <div className="absolute top-1/4 left-1 w-3 h-3 bg-[#422814] rounded-full shadow-inner" />
        <div className="absolute top-1/4 right-1 w-3 h-3 bg-[#422814] rounded-full shadow-inner" />
        <div className="absolute top-1/2 left-1 w-3 h-3 bg-[#422814] rounded-full shadow-inner" />
        <div className="absolute top-1/2 right-1 w-3 h-3 bg-[#422814] rounded-full shadow-inner" />
        <div className="absolute top-3/4 left-1 w-3 h-3 bg-[#422814] rounded-full shadow-inner" />
        <div className="absolute top-3/4 right-1 w-3 h-3 bg-[#422814] rounded-full shadow-inner" />
        <div className="absolute bottom-4 left-1 w-3 h-3 bg-[#422814] rounded-full shadow-inner" />
        <div className="absolute bottom-4 right-1 w-3 h-3 bg-[#422814] rounded-full shadow-inner" />

        {/* Decorative sign on dock */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-90">
          <span className="text-xs font-heading font-bold text-amber-100 bg-black/60 px-3 py-1 rounded-full border border-amber-300/60 shadow-inner whitespace-nowrap flex items-center gap-1.5">
            <span>⚓ North Harbor Dock</span>
          </span>
        </div>
      </div>

      {/* Wrecked White Car with tail sticking out at the right most end of the bridge in water */}
      <div
        style={{
          left: "75px",
          top: "-60px",
          width: "190px",
          height: "110px",
        }}
        className="absolute z-20 flex flex-col items-center justify-center animate-float"
      >
        {/* Water Splash & Bubbles around front */}
        <div className="absolute inset-x-4 bottom-2 h-10 bg-blue-400/30 rounded-full blur-sm animate-pulse" />
        <div className="absolute inset-x-8 bottom-0 h-4 border-2 border-white/60 rounded-full animate-ping opacity-70" />
        
        {/* Tilted Rear Tail of White Car sticking out */}
        <div className="relative w-36 h-20 bg-gradient-to-b from-white via-slate-100 to-slate-300 rounded-t-3xl border-2 border-slate-400 shadow-2xl transform -rotate-12 translate-y-2 flex flex-col items-center justify-end pb-3 overflow-hidden">
          {/* Rear Windshield / Roof transition */}
          <div className="absolute top-0 inset-x-4 h-8 bg-gradient-to-b from-slate-800 to-blue-900/80 rounded-t-xl border-b-2 border-slate-400 opacity-90" />

          {/* Left & Right Red Taillights */}
          <div className="absolute bottom-4 left-2 w-7 h-4 bg-gradient-to-r from-red-600 to-red-500 rounded-sm border border-red-800 shadow-md animate-pulse flex items-center justify-center">
            <div className="w-4 h-1.5 bg-yellow-300/80 rounded-xs" />
          </div>
          <div className="absolute bottom-4 right-2 w-7 h-4 bg-gradient-to-l from-red-600 to-red-500 rounded-sm border border-red-800 shadow-md animate-pulse flex items-center justify-center">
            <div className="w-4 h-1.5 bg-yellow-300/80 rounded-xs" />
          </div>

          {/* Trunk badge / emblem */}
          <div className="w-4 h-2 bg-slate-300 rounded-full border border-slate-500 mb-1 flex items-center justify-center text-[7px] font-bold text-slate-700">
            🚙
          </div>

          {/* License Plate: NEY 2231 (White Plate!) */}
          <div className="bg-white border-2 border-black px-2.5 py-0.5 rounded shadow-lg flex items-center justify-center transform scale-105">
            <span className="font-mono font-extrabold text-xs text-black tracking-widest drop-shadow-xs">
              NEY 2231
            </span>
          </div>

          {/* Water splashes hitting tail */}
          <div className="absolute -bottom-1 -left-2 text-base animate-bounce">💦</div>
          <div className="absolute -bottom-1 -right-2 text-base animate-bounce" style={{ animationDelay: "0.5s" }}>🌊</div>
        </div>
      </div>
    </div>
  );
}
