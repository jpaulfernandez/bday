"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Sparkles } from "lucide-react";
import { HiddenTreasure } from "@/types/game";
import { soundManager } from "@/lib/sound";
import confetti from "canvas-confetti";

interface HiddenTreasureModalProps {
  treasure: HiddenTreasure;
  foundCount: number;
  totalCount: number;
  isNewlyFound: boolean;
  onClose: () => void;
}

export default function HiddenTreasureModal({
  treasure,
  foundCount,
  totalCount,
  isNewlyFound,
  onClose,
}: HiddenTreasureModalProps) {
  const isAllFound = foundCount >= totalCount;

  useEffect(() => {
    if (isNewlyFound || isAllFound) {
      soundManager.playVictory();
      try {
        confetti({
          particleCount: isAllFound ? 150 : 60,
          spread: isAllFound ? 100 : 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [isNewlyFound, isAllFound]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#2a1b0d] via-[#3a2613] to-[#1f1309] border-4 border-amber-400 rounded-3xl p-5 sm:p-7 shadow-2xl text-amber-100 animate-scale-up overflow-hidden">
        
        {/* Background glow lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 border border-amber-400/40 text-amber-300 hover:bg-black/80 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex flex-col items-center text-center mb-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/60 px-3 py-1 rounded-full text-xs font-heading font-extrabold text-amber-300 uppercase tracking-wider mb-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Glimmering Treasure</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white drop-shadow-md">
            {treasure.title}
          </h2>
        </div>

        {/* Photo Container - Supports both landscape and vertical/portrait media without cropping */}
        <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border-4 border-amber-300/60 shadow-2xl bg-black/90 mb-5 group flex items-center justify-center">
          <Image
            src={treasure.photo}
            alt={treasure.title}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Caption */}
        <div className="bg-black/40 border border-amber-400/30 rounded-2xl p-4 mb-5 text-center shadow-inner">
          <p className="font-medium text-sm sm:text-base text-amber-100/90 leading-relaxed italic">
            &ldquo;{treasure.caption}&rdquo;
          </p>
        </div>

        {/* Counter & Completion Banner */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between bg-amber-950/80 border border-amber-500/40 px-4 py-2.5 rounded-xl shadow-inner">
            <span className="text-xs sm:text-sm font-bold text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Glimmering Treasures Found:</span>
            </span>
            <span className="font-heading font-extrabold text-base sm:text-lg text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-lg border border-amber-400/40">
              {foundCount} / {totalCount}
            </span>
          </div>

          {/* All Found Special Message */}
          {isAllFound && (
            <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black font-heading font-extrabold p-4 rounded-2xl text-center shadow-lg border-2 border-white animate-bounce-gentle">
              <div className="text-lg sm:text-xl mb-1 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 animate-spin-slow" />
                <span>🎉 ALL GLIMMERING TREASURES FOUND! ✨</span>
              </div>
              <div className="text-xs sm:text-sm font-bold opacity-90 leading-snug">
                You discovered every secret glimmer across Birthday Island! Truly the master explorer, Dana! ✨💛
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-black font-heading font-extrabold text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Keep Exploring Island</span>
            <Sparkles className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
