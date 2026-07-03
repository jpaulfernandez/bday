"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, Trophy, Gift, Heart, Lock, Unlock } from "lucide-react";
import { Treasure } from "@/data/treasures";
import { soundManager } from "@/lib/sound";
import confetti from "canvas-confetti";

interface FinalTreasureChestProps {
  treasure: Treasure;
  isUnlocked: boolean;
  onClose: () => void;
  onOpenChest: () => void;
}

export default function FinalTreasureChest({
  treasure,
  isUnlocked,
  onClose,
  onOpenChest,
}: FinalTreasureChestProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      soundManager.playVictory();
      // Grand Confetti Explosion!
      try {
        const duration = 3.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const interval: NodeJS.Timeout = setInterval(function () {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: 0.3, y: 0.6 } });
          confetti({ ...defaults, particleCount, origin: { x: 0.7, y: 0.6 } });
        }, 250);

        return () => clearInterval(interval);
      } catch {}
    }
  }, [isOpen]);

  const handleUnlockClick = () => {
    soundManager.playPop();
    soundManager.playSparkle();
    setIsOpen(true);
    onOpenChest();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-reef/80 backdrop-blur-md animate-fadeIn overflow-hidden">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-pearl via-[#FFFDF5] to-sand border-t-4 sm:border-4 border-sunset rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85dvh] sm:max-h-[90vh] text-reef animate-slide-up sm:animate-float">
        {/* Mobile Swipe Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-reef/20 rounded-full mx-auto mt-2 mb-1 flex-shrink-0" />
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-sunset via-coral to-sunset p-4 sm:p-6 flex items-center justify-between border-b-2 border-white/60 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/90 rounded-2xl p-1.5 shadow-md flex items-center justify-center border border-white">
              <Image
                src={isOpen ? "/assets/festival/icon-chest-open.svg" : "/assets/festival/icon-chest-closed.svg"}
                alt="Treasure Chest"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-reef/80 bg-white/60 px-2 py-0.5 rounded-full">
                Grand Finale • {isOpen ? "Unlocked!" : isUnlocked ? "Ready to Open" : "Sealed"}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-reef tracking-tight mt-0.5 flex items-center gap-2">
                <span>{treasure.title}</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-reef flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          
          {/* STATE 1: LOCKED */}
          {!isUnlocked && (
            <div className="py-6 space-y-4">
              <div className="w-24 h-24 mx-auto bg-reef/10 rounded-full flex items-center justify-center border-2 border-reef/20 mb-4 animate-pulse">
                <Lock className="w-12 h-12 text-reef/70" />
              </div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-reef">
                Tied with Festival Ribbon 🎀
              </h3>
              <p className="text-sm sm:text-base text-reef/80 max-w-md mx-auto leading-relaxed">
                {treasure.introText}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sand border border-sunset font-heading font-bold text-xs text-reef">
                <Sparkles className="w-4 h-4 text-coral animate-sparkle" />
                <span>Visit all 5 festival stops around the island first!</span>
              </div>
            </div>
          )}

          {/* STATE 2: UNLOCKED BUT NOT OPENED */}
          {isUnlocked && !isOpen && (
            <div className="py-6 space-y-6">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-sunset/50 blur-xl animate-pulse-glow" />
                <Image
                  src="/assets/festival/icon-chest-closed.svg"
                  alt="Glowing Chest"
                  width={120}
                  height={120}
                  className="relative z-10 animate-bounce-gentle object-contain"
                />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-seafoam/50 text-reef font-heading font-bold text-xs mb-2">
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>The Ribbon Has Untied!</span>
                </span>
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-reef">
                  The Grand Prize is Glowing! ✨
                </h3>
                <p className="text-sm text-reef/80 max-w-md mx-auto mt-2">
                  You visited every stop — the lanterns, the messages, the compliments, the house, and the fortunes. You gathered all 5 ramen ingredients! Are you ready for your birthday feast?
                </p>
              </div>

              <button
                onClick={handleUnlockClick}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-coral via-sunset to-coral text-reef font-heading text-lg sm:text-xl font-extrabold shadow-xl shadow-coral/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mx-auto border-2 border-white cursor-pointer"
              >
                <Gift className="w-6 h-6 animate-bounce" />
                <span>Open the Grand Festival Prize!</span>
                <Sparkles className="w-5 h-5 text-white animate-sparkle" />
              </button>
            </div>
          )}

          {/* STATE 3: OPENED REVEAL! */}
          {isOpen && (
            <div className="py-4 space-y-6 animate-fadeIn">
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-sunset/80 blur-2xl animate-pulse" />
                <Image
                  src="/assets/festival/icon-chest-open.svg"
                  alt="Open Chest Overflowing"
                  width={140}
                  height={140}
                  className="relative z-10 object-contain animate-float"
                />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sunset text-reef font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
                  <Trophy className="w-4 h-4 text-reef" />
                  <span>Grand Festival Reveal</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl sm:text-4xl text-reef tracking-tight leading-tight">
                  You Found Your Surprise! 🎉
                </h3>
              </div>

              <div className="bg-white/90 border-2 border-sunset rounded-3xl p-6 text-left shadow-inner font-body text-sm sm:text-base text-reef leading-relaxed whitespace-pre-line">
                {treasure.body}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-heading font-bold text-coral">
                <Heart className="w-4 h-4 fill-coral animate-pulse" />
                <span>The whole festival is cheering for you! Thank you for playing!</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-white/80 border-t border-sunset/30 p-4 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-reef text-white font-heading font-bold text-sm shadow-md hover:bg-reef/90 transition-all cursor-pointer"
          >
            {isOpen ? "Return to the Festival 🍜" : "Close Window"}
          </button>
        </div>

      </div>
    </div>
  );
}
