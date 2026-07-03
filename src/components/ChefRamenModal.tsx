"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, Utensils, Heart, CheckCircle2, ArrowRight } from "lucide-react";
import { Treasure } from "@/data/treasures";
import { soundManager } from "@/lib/sound";
import confetti from "canvas-confetti";
import festivalContent from "@/data/festival_content.json";
import DanaRamenFeast from "@/components/DanaRamenFeast";

interface ChefRamenModalProps {
  treasure: Treasure;
  collectedCount: number;
  totalCount: number;
  openedIds?: string[];
  onClose: () => void;
  onCompleteQuest: () => void;
}

export default function ChefRamenModal({
  treasure,
  collectedCount,
  totalCount,
  openedIds = [],
  onClose,
  onCompleteQuest,
}: ChefRamenModalProps) {
  const isReady = collectedCount >= totalCount;
  const [stage, setStage] = useState<"greeting" | "serving" | "eating" | "fade" | "postCredits">("greeting");
  const [servedIndex, setServedIndex] = useState<number>(0);

  const ingredientsList = [
    { id: "lantern-lake", name: "Broth", icon: "/assets/festival/icon-broth.svg", echo: festivalContent.ingredients.broth.sourceEcho },
    { id: "blossom-garden", name: "Noodles", icon: "/assets/festival/icon-noodles.svg", echo: festivalContent.ingredients.noodles.sourceEcho },
    { id: "secret-spice-stall", name: "Ajitama", icon: "/assets/festival/icon-ajitama.svg", echo: festivalContent.ingredients.ajitama.sourceEcho },
    { id: "danas-house", name: "Chashu Pork", icon: "/assets/festival/icon-chashu.svg", echo: festivalContent.ingredients.chashu.sourceEcho },
    { id: "fortune-booth", name: "Narutomaki", icon: "/assets/festival/icon-narutomaki.svg", echo: festivalContent.ingredients.narutomaki.sourceEcho },
  ];

  // Auto-advance serving sequence when in serving stage
  useEffect(() => {
    if (stage === "serving") {
      if (servedIndex < ingredientsList.length) {
        const timer = setTimeout(() => {
          soundManager.playPop();
          setServedIndex((prev) => prev + 1);
          if (servedIndex + 1 === ingredientsList.length) {
            soundManager.playVictory();
            try {
              confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
            } catch {}
          }
        }, 1200);
        return () => clearTimeout(timer);
      }
    } else if (stage === "fade") {
      const timer = setTimeout(() => {
        setStage("postCredits");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [stage, servedIndex, ingredientsList.length]);

  const handleStartServing = () => {
    soundManager.playSparkle();
    setStage("serving");
    setServedIndex(0);
  };

  const handleStartEating = () => {
    soundManager.playSparkle();
    setStage("eating");
  };

  const handleFadeToBlack = () => {
    soundManager.playSparkle();
    setStage("fade");
  };

  const handleFreeRoamReturn = () => {
    soundManager.playVictory();
    onCompleteQuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-reef/80 backdrop-blur-md animate-fadeIn overflow-hidden select-none">
      
      {/* FULL-SCREEN FADE TO BLACK & POST CREDITS */}
      {(stage === "fade" || stage === "postCredits") && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-6 text-white animate-fadeIn">
          {stage === "fade" ? (
            <div className="text-center space-y-4 animate-pulse">
              <div className="text-6xl sm:text-7xl">🍜</div>
              <p className="text-sm sm:text-lg text-white/70 font-heading tracking-wider uppercase">
                Dana finishes the special birthday bowl...
              </p>
            </div>
          ) : (
            <div className="max-w-md w-full bg-zinc-900 border-2 border-zinc-700 p-8 sm:p-10 rounded-3xl text-center space-y-8 shadow-2xl animate-slide-up">
              <div className="w-full max-w-[200px] sm:max-w-[240px] mx-auto animate-float">
                <DanaRamenFeast initialMode="peace" readOnly />
              </div>
              
              <div className="whitespace-pre-line text-lg sm:text-2xl font-heading font-extrabold text-amber-200 leading-relaxed">
                {festivalContent.chef.finalePrompt}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleFreeRoamReturn}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-coral to-amber-500 hover:opacity-95 text-white font-heading font-bold text-base sm:text-lg shadow-xl shadow-amber-500/20 transform hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Yes, take me back 🍜</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* REGULAR MODAL FOR GREETING, SERVING, EATING */}
      {stage !== "fade" && stage !== "postCredits" && (
        <div className="relative w-full max-w-2xl bg-gradient-to-b from-pearl via-[#FFFDF5] to-sand border-t-4 sm:border-4 border-sunset rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85dvh] sm:max-h-[90vh] text-reef animate-slide-up sm:animate-float">
          
          {/* Mobile Swipe Handle */}
          <div className="sm:hidden w-12 h-1.5 bg-reef/20 rounded-full mx-auto mt-2 mb-1 flex-shrink-0" />
          
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-sunset via-coral to-sunset p-4 sm:p-6 flex items-center justify-between border-b-2 border-white/60 relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/90 rounded-2xl p-1.5 shadow-md flex items-center justify-center border border-white">
                <Image src={treasure.icon} alt={treasure.title} width={40} height={40} className="object-contain" />
              </div>
              <div>
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-reef/80 bg-white/60 px-2 py-0.5 rounded-full">
                  Central Kitchen • {isReady ? "5/5 Ingredients Ready" : `${collectedCount}/5 Gathered`}
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
          <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 text-center">
            
            {/* STAGE 1: GREETING & PROGRESS */}
            {stage === "greeting" && (
              <div className="space-y-6">
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center bg-white rounded-full p-4 shadow-lg border-2 border-sunset">
                  <Image src="/assets/festival/icon-chef.svg" alt="Chef" width={80} height={80} className="object-contain animate-bounce-gentle" />
                </div>

                <div className="bg-white/90 p-5 rounded-3xl border border-sunset/40 text-left shadow-inner font-body text-sm sm:text-base text-reef leading-relaxed">
                  <p className="font-semibold text-reef/90">
                    &quot;{isReady ? festivalContent.chef.completionDialogue : festivalContent.chef.openingDialogue}&quot;
                  </p>
                  {!isReady && (
                    <div className="mt-3 pt-3 border-t border-sunset/20 text-xs sm:text-sm font-heading font-extrabold text-coral flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 animate-sparkle" />
                      <span>{festivalContent.chef.missingDialogue.replace("{collected}", String(collectedCount))}</span>
                    </div>
                  )}
                </div>

                {/* 5 Ingredients Grid Checklist */}
                <div className="space-y-2 text-left">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-reef/70 pl-1">
                    Chef&apos;s Recipe Checklist ({collectedCount}/5 Gathered)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {ingredientsList.map((ing, idx) => {
                      const isHas = openedIds.length > 0 ? openedIds.includes(ing.id) : idx < collectedCount;
                      return (
                        <div
                          key={ing.name}
                          className={`p-2.5 rounded-2xl border flex sm:flex-col items-center gap-2.5 sm:gap-1.5 transition-all ${
                            isHas
                              ? "bg-white border-amber-300 shadow-sm"
                              : "bg-sand/30 border-sand/60 opacity-50 grayscale"
                          }`}
                        >
                          <Image src={ing.icon} alt={ing.name} width={32} height={32} className="object-contain flex-shrink-0" />
                          <div className="text-left sm:text-center min-w-0 flex-1">
                            <div className="text-xs font-heading font-bold text-reef truncate">{ing.name}</div>
                            <div className="text-[10px] text-reef/60">{isHas ? "✨ Ready" : "Missing"}</div>
                          </div>
                          {isHas && <CheckCircle2 className="w-4 h-4 text-emerald-600 sm:hidden ml-auto" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  {isReady ? (
                    <button
                      onClick={handleStartServing}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-coral via-sunset to-coral text-white font-heading text-lg sm:text-xl font-extrabold shadow-xl shadow-coral/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto border-2 border-white animate-pulse"
                    >
                      <Utensils className="w-6 h-6 animate-bounce" />
                      <span>Sit Down &amp; Assemble Ramen 🍜</span>
                    </button>
                  ) : (
                    <button
                      onClick={onClose}
                      className="px-6 py-3 rounded-xl bg-reef text-white font-heading font-bold text-sm shadow-md hover:bg-reef/90 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Keep Exploring the Festival 🍜</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STAGE 2: SERVE SEQUENCE */}
            {stage === "serving" && (
              <div className="space-y-6 py-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sunset text-reef font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-4 h-4 text-reef animate-sparkle" />
                  <span>Master Chef Serving Sequence</span>
                </div>

                {/* Big Animated Ramen Bowl Assembling */}
                <div className="relative w-44 h-44 mx-auto flex items-center justify-center bg-white/80 rounded-full border-4 border-sunset shadow-2xl overflow-hidden p-6">
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-100/50 to-amber-200/50 rounded-full animate-pulse" />
                  
                  {/* Show ingredients inside bowl as they drop */}
                  <div className="relative z-10 flex flex-wrap items-center justify-center gap-2">
                    {ingredientsList.slice(0, servedIndex).map((ing, idx) => (
                      <div key={idx} className="animate-bounce-gentle" style={{ animationDelay: `${idx * 0.2}s` }}>
                        <Image src={ing.icon} alt={ing.name} width={40} height={40} className="object-contain drop-shadow-md" />
                      </div>
                    ))}
                    {servedIndex === 0 && (
                      <span className="text-4xl animate-spin-slow">🍲</span>
                    )}
                  </div>
                </div>

                {/* Source Echo Commentary */}
                <div className="min-h-[60px] flex items-center justify-center">
                  {servedIndex > 0 ? (
                    <div className="bg-white/90 px-6 py-3 rounded-2xl border-2 border-amber-300 font-heading font-bold text-sm sm:text-base text-reef shadow-md animate-fadeIn max-w-md">
                      ✨ {ingredientsList[servedIndex - 1].echo}
                    </div>
                  ) : (
                    <div className="text-sm font-heading font-medium text-reef/70 italic animate-pulse">
                      Simmering the base...
                    </div>
                  )}
                </div>

                {/* Progress bar of assembly */}
                <div className="w-full max-w-xs mx-auto bg-sand/50 h-2.5 rounded-full overflow-hidden border border-sunset/30">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-coral transition-all duration-500 rounded-full"
                    style={{ width: `${(servedIndex / ingredientsList.length) * 100}%` }}
                  />
                </div>

                {servedIndex >= ingredientsList.length && (
                  <div className="pt-4 animate-slide-up">
                    <button
                      onClick={handleStartEating}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-heading text-lg sm:text-xl font-extrabold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto border-2 border-white"
                    >
                      <Utensils className="w-6 h-6" />
                      <span>Enjoy Birthday Ramen 🥢😋</span>
                      <Sparkles className="w-5 h-5 animate-sparkle" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 3: EATING & CELEBRATION */}
            {stage === "eating" && (
              <div className="space-y-4 py-2 animate-fadeIn">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-heading font-bold text-xs">
                    <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 animate-pulse" />
                    <span>Birthday Feast Complete</span>
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-reef tracking-tight">
                    The Best Birthday Ramen Ever! 🎉
                  </h3>
                </div>

                <DanaRamenFeast onFinish={handleFadeToBlack} initialMode="slurping" />
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="bg-white/80 border-t border-sunset/30 p-4 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-reef text-white font-heading font-bold text-sm shadow-md hover:bg-reef/90 transition-all cursor-pointer"
            >
              Back to the Map 🍜
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
