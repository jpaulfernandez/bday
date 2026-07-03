"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface ProgressBarProps {
  collectedCount: number;
  totalCount: number;
  openedIds?: string[];
  hiddenFoundCount?: number;
  hiddenTotalCount?: number;
}

export default function ProgressBar({
  collectedCount,
  totalCount,
  openedIds = [],
  hiddenFoundCount,
  hiddenTotalCount,
}: ProgressBarProps) {
  const percentage = Math.round((collectedCount / totalCount) * 100);
  const isComplete = collectedCount >= totalCount;

  const ingredients = [
    { id: "lantern-lake", name: "Broth", icon: "/assets/festival/icon-broth.svg" },
    { id: "blossom-garden", name: "Noodles", icon: "/assets/festival/icon-noodles.svg" },
    { id: "secret-spice-stall", name: "Ajitama", icon: "/assets/festival/icon-ajitama.svg" },
    { id: "danas-house", name: "Chashu", icon: "/assets/festival/icon-chashu.svg" },
    { id: "fortune-booth", name: "Naruto", icon: "/assets/festival/icon-narutomaki.svg" },
  ];

  return (
    <div className="fixed top-3 left-3 right-28 sm:top-6 sm:left-6 sm:right-auto z-40 w-auto sm:w-full max-w-none sm:max-w-[380px] bg-pearl/95 backdrop-blur-md border-2 border-white/80 rounded-3xl p-3 sm:p-4 shadow-xl text-reef transition-all duration-300">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-heading font-bold mb-2">
        <span className="flex min-w-0 items-center gap-2 text-reef">
          <span className="text-xl animate-bounce-gentle inline-block filter drop-shadow-sm">🍜</span>
          <span className="truncate">
            <span className="font-extrabold text-reef">Birthday Ramen</span>: {collectedCount}/{totalCount} Ingredients
          </span>
        </span>
        <span className="text-coral font-bold flex items-center gap-1 bg-coral/10 px-2 py-0.5 rounded-full">
          <span>{percentage}%</span>
          {isComplete && <Sparkles className="w-3.5 h-3.5 text-sunset animate-sparkle" />}
        </span>
      </div>

      {/* Progress Bar Track (Simmering Ramen Bowl Level) */}
      <div className="w-full h-3.5 bg-ocean/20 rounded-full overflow-hidden p-0.5 border border-seafoam/50 shadow-inner relative">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-amber-400 via-coral to-sunset relative ${percentage > 0 ? "shadow-sm" : ""}`}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated glow shimmer on bar */}
          <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
        </div>
      </div>

      {/* 5 Ramen Ingredients Tracker Badges */}
      <div className="mt-3 grid grid-cols-5 gap-1.5 pt-2 border-t border-seafoam/40">
        {ingredients.map((ing, idx) => {
          // Check if collected either by openedIds or by fallback index count
          const isCollected = openedIds.length > 0 ? openedIds.includes(ing.id) : idx < collectedCount;
          return (
            <div
              key={ing.id}
              className={`flex flex-col items-center justify-center p-1 rounded-xl border transition-all duration-300 ${
                isCollected
                  ? "bg-gradient-to-b from-white to-amber-50/80 border-amber-300 shadow-sm scale-105"
                  : "bg-sand/30 border-sand/60 opacity-50 grayscale hover:opacity-75 hover:grayscale-0"
              }`}
              title={isCollected ? `${ing.name} (Collected!)` : `${ing.name} (Missing)`}
            >
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                <Image
                  src={ing.icon}
                  alt={ing.name}
                  width={28}
                  height={28}
                  className={`object-contain ${isCollected ? "animate-float-slow" : ""}`}
                />
                {isCollected && (
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 shadow-xs">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-heading font-bold mt-1 truncate max-w-full ${isCollected ? "text-reef" : "text-reef/60"}`}>
                {ing.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hidden Glimmering Stars Tracker */}
      {typeof hiddenFoundCount === "number" && typeof hiddenTotalCount === "number" && (
        <div className="mt-2.5 pt-2 border-t border-seafoam/40 flex items-center justify-between gap-2 bg-gradient-to-r from-amber-400/15 via-yellow-400/25 to-amber-400/15 px-2.5 py-1.5 rounded-2xl border border-amber-300/70 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-sm animate-spin-slow">
              <Sparkles className="w-3 h-3 text-black" />
            </span>
            <span className="text-xs font-heading font-extrabold text-reef">
              Glimmering Treasures:
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-amber-400 shadow-inner">
            <span className="text-xs font-heading font-extrabold text-amber-600">
              {hiddenFoundCount} / {hiddenTotalCount} ✨
            </span>
          </div>
        </div>
      )}

      {/* Status Footer */}
      <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-reef/80">
        <span>Chef&apos;s Pot</span>
        <span className="italic font-bold text-coral">
          {isComplete ? "✨ 5/5 Ready! Visit Festival Chef!" : `${totalCount - collectedCount} more ingredient${totalCount - collectedCount > 1 ? "s" : ""} to cook!`}
        </span>
      </div>
    </div>
  );
}
