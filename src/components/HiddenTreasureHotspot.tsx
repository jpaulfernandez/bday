"use client";

import React from "react";
import { HiddenTreasure, GAME_CONSTANTS } from "@/types/game";
import { soundManager } from "@/lib/sound";

interface HiddenTreasureHotspotProps {
  treasure: HiddenTreasure;
  isFound: boolean;
  isWithinRange?: boolean;
  onClick: (treasure: HiddenTreasure) => void;
}

export default function HiddenTreasureHotspot({
  treasure,
  isFound,
  isWithinRange = false,
  onClick,
}: HiddenTreasureHotspotProps) {
  // Map coordinates (percentages) to pixels
  const leftPx = (treasure.x / 100) * GAME_CONSTANTS.WORLD_WIDTH;
  const topPx = (treasure.y / 100) * GAME_CONSTANTS.WORLD_HEIGHT;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playSparkle();
    onClick(treasure);
  };

  return (
    <div
      style={{
        left: `${leftPx}px`,
        top: `${topPx}px`,
      }}
      onClick={handleClick}
      className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer select-none group transition-all duration-300 ${
        isWithinRange ? "scale-125 z-30" : "hover:scale-110"
      }`}
    >
      {/* Outer Shimmer Glow */}
      <div
        className={`absolute -inset-3 rounded-full blur-sm transition-opacity duration-500 pointer-events-none ${
          isWithinRange
            ? "bg-amber-300/90 opacity-100 animate-pulse"
            : isFound
            ? "bg-amber-200/20 opacity-30"
            : "bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 opacity-80 animate-pulse"
        }`}
      />

      {/* Small Glimmering Star Crystal (No emoji) */}
      <div
        className={`relative flex items-center justify-center transition-all duration-300 ${
          isFound ? "opacity-60 scale-90" : "animate-float-slow"
        }`}
      >
        {/* Shimmering 4-point diamond star SVG */}
        <svg
          viewBox="0 0 32 32"
          className={`w-6 h-6 sm:w-7 sm:h-7 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] transition-transform duration-500 ${
            isFound ? "text-amber-200" : "text-amber-400 animate-spin-slow"
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`glimmer-${treasure.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
          </defs>
          {/* Main diamond star */}
          <path
            d="M16 0 C16 10, 22 16, 32 16 C22 16, 16 22, 16 32 C16 22, 10 16, 0 16 C10 16, 16 10, 16 0 Z"
            fill={`url(#glimmer-${treasure.id})`}
          />
          {/* Inner sparkling highlight */}
          <path
            d="M16 4 C16 11, 21 16, 28 16 C21 16, 16 21, 16 28 C16 21, 11 16, 4 16 C11 16, 16 11, 16 4 Z"
            fill="#ffffff"
            className="animate-pulse opacity-90"
          />
        </svg>

        {/* Small orbiting sparkle ray */}
        {!isFound && (
          <svg
            viewBox="0 0 16 16"
            className="absolute -top-1 -right-1 w-3 h-3 text-white animate-ping opacity-75 pointer-events-none"
            fill="currentColor"
          >
            <path d="M8 0 C8 5, 11 8, 16 8 C11 8, 8 11, 8 16 C8 11, 5 8, 0 8 C5 8, 8 5, 8 0 Z" />
          </svg>
        )}

        {/* Found Checkmark badge */}
        {isFound && (
          <span className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold border border-white shadow-sm">
            ✓
          </span>
        )}
      </div>

      {/* Label Tooltip on Hover / Near (No emoji) */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 -top-8 bg-black/90 backdrop-blur-sm text-amber-200 font-heading font-bold text-[11px] sm:text-xs px-2.5 py-1 rounded-full whitespace-nowrap shadow-md pointer-events-none transition-all duration-200 border border-amber-400/40 ${
          isWithinRange ? "opacity-100 -translate-y-1" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <span>{isFound ? `${treasure.title} (Found)` : "Glimmering Star"}</span>
      </div>
    </div>
  );
}
