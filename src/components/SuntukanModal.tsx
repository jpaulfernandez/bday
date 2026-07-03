"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, RefreshCw, ArrowRight } from "lucide-react";
import { soundManager } from "@/lib/sound";
import confetti from "canvas-confetti";

interface SuntukanModalProps {
  onClose: () => void;
}

const HIT_WORDS = [
  "💥 BAM!",
  "🥊 POW!",
  "💢 SAPAK!",
  "⭐ CRITICAL HIT!",
  "🔥 BOOF!",
  "🥊 SUNTOK!",
  "💥 ARAY KO!",
  "⚡ RAMEN PUNCH!",
  "💥 SLAP!",
];

export default function SuntukanModal({ onClose }: SuntukanModalProps) {
  const [paulHp, setPaulHp] = useState<number>(100);
  const [combo, setCombo] = useState<number>(0);
  const [isPunching, setIsPunching] = useState<boolean>(false);
  const [lastHitText, setLastHitText] = useState<string | null>(null);
  const [hitPos, setHitPos] = useState<{ x: number; y: number }>({ x: 50, y: 30 });

  // Trigger confetti and sound on KO
  useEffect(() => {
    if (paulHp <= 0) {
      soundManager.playVictory();
      try {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      } catch {}
    }
  }, [paulHp]);

  const handlePunch = useCallback(() => {
    if (paulHp <= 0) return;

    soundManager.playPop();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([25, 10, 40]);
      } catch {}
    }

    const nextHp = Math.max(0, paulHp - 15);
    setPaulHp(nextHp);
    setCombo((prev) => prev + 1);
    setIsPunching(true);

    // Random hit word and position
    const randomWord = HIT_WORDS[Math.floor(Math.random() * HIT_WORDS.length)];
    setLastHitText(randomWord);
    setHitPos({
      x: Math.floor(Math.random() * 60) + 20, // 20% to 80%
      y: Math.floor(Math.random() * 40) + 10, // 10% to 50%
    });

    setTimeout(() => {
      setIsPunching(false);
    }, 300);
  }, [paulHp]);

  // Keyboard support for rapid-fire punching!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "Enter") && paulHp > 0) {
        e.preventDefault();
        handlePunch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paulHp, handlePunch]);

  const handleReset = () => {
    soundManager.playSparkle();
    setPaulHp(100);
    setCombo(0);
    setLastHitText(null);
  };

  // Determine damage stage
  const isKO = paulHp <= 0;
  const isHeavilyBruised = paulHp > 0 && paulHp <= 40;
  const isBruised = paulHp > 40 && paulHp <= 70;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none overflow-hidden">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#2c2b29] via-[#3a3834] to-[#1f1e1c] border-4 border-amber-500 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95dvh] text-white animate-scale-up">
        
        {/* TOP ARCADE VS HEADER BAR */}
        <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 p-3 sm:p-4 flex items-center justify-between border-b-4 border-amber-400 relative">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl animate-bounce">🥊</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-black/60 text-amber-300 text-[10px] sm:text-xs px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wider border border-amber-400/50">
                  Easter Egg Arena
                </span>
                <span className="bg-red-950 text-red-300 text-[10px] sm:text-xs px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                  SPECIAL REMATCH
                </span>
              </div>
              <h2 className="text-base sm:text-2xl font-heading font-extrabold text-white tracking-tight drop-shadow-md">
                SUNTUKAN SA ZEN GARDEN
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close arena"
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center border-2 border-white/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* HEALTH BARS (STREET FIGHTER STYLE) */}
        <div className="bg-black/90 px-4 sm:px-8 py-3 border-b-2 border-zinc-700 flex items-center justify-between gap-4">
          {/* Dana HP */}
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs sm:text-sm font-heading font-bold text-emerald-400">
              <span>👑 DANA (CHALLENGER)</span>
              <span>100% (INVINCIBLE)</span>
            </div>
            <div className="w-full h-4 sm:h-5 bg-zinc-800 rounded-full overflow-hidden border border-emerald-500 p-0.5">
              <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-lg animate-pulse" />
            </div>
          </div>

          <div className="font-heading font-extrabold text-xl sm:text-3xl text-amber-400 italic px-2 animate-pulse">
            VS
          </div>

          {/* Paul HP */}
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs sm:text-sm font-heading font-bold text-amber-300">
              <span>{isKO ? "💀 K.O.!" : "🥡 PAUL (TARGET)"}</span>
              <span>{paulHp}% HP</span>
            </div>
            <div className="w-full h-4 sm:h-5 bg-zinc-800 rounded-full overflow-hidden border border-amber-500 p-0.5">
              <div
                style={{ width: `${paulHp}%` }}
                className={`h-full rounded-full transition-all duration-300 shadow-lg ${
                  paulHp > 60
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                    : paulHp > 30
                    ? "bg-gradient-to-r from-orange-600 to-amber-500 animate-pulse"
                    : "bg-gradient-to-r from-red-700 to-red-500 animate-ping"
                }`}
              />
            </div>
          </div>
        </div>

        {/* BRUTALIST CONCRETE ZEN GARDEN ARENA CONTENT */}
        <div className="relative flex-1 p-4 sm:p-8 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(#4a4843_1px,transparent_1px)] [background-size:20px_20px] bg-[#2c2a27] min-h-[380px] sm:min-h-[440px]">
          
          {/* Concrete background terraces visual representation */}
          <div className="absolute inset-4 bg-gradient-to-br from-[#9c9c94]/20 via-[#7a7a72]/30 to-[#5c5c56]/40 border-4 border-[#8a8a82]/40 rounded-[40px] pointer-events-none flex items-center justify-center">
            <div className="w-4/5 h-4/5 bg-[#4a4843]/50 border-2 border-[#696962]/50 rounded-[30px] flex items-center justify-center">
              <div className="w-3/5 h-3/5 bg-amber-900/20 border border-amber-600/30 rounded-[20px]" />
            </div>
          </div>

          {/* Arena Ambient Decor */}
          <span className="absolute top-6 left-6 text-3xl sm:text-4xl animate-float">🏮</span>
          <span className="absolute top-6 right-6 text-3xl sm:text-4xl animate-float" style={{ animationDelay: "1s" }}>🏮</span>
          <span className="absolute bottom-6 left-8 text-2xl sm:text-3xl opacity-70">🌲</span>
          <span className="absolute bottom-6 right-8 text-2xl sm:text-3xl opacity-70">🎋</span>

          {/* COMBO COUNTER OVERLAY */}
          {combo > 1 && !isKO && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-amber-500 to-red-600 text-white font-heading font-extrabold text-sm sm:text-lg px-4 py-1 rounded-full shadow-2xl border-2 border-white animate-bounce flex items-center gap-1.5">
              <span>🔥</span>
              <span>COMBO x{combo}!</span>
              <span className="text-amber-200">SUPER DAMAGE!</span>
              <span>🔥</span>
            </div>
          )}

          {/* COMIC ACTION WORD POPUP */}
          {lastHitText && isPunching && (
            <div
              style={{ left: `${hitPos.x}%`, top: `${hitPos.y}%` }}
              className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-ping text-3xl sm:text-5xl font-heading font-extrabold text-yellow-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] border-text"
            >
              {lastHitText}
            </div>
          )}

          {/* THE FIGHTERS ARENA */}
          <div className="relative z-20 flex items-center justify-center gap-4 sm:gap-16 w-full max-w-xl my-4">
            
            {/* DANA (THE CHALLENGER) */}
            <div className={`flex flex-col items-center transition-all duration-150 ${isPunching ? "translate-x-8 sm:translate-x-16 scale-110" : ""}`}>
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-red-500/30 to-amber-500/30 rounded-full border-4 border-red-500 p-2 flex items-center justify-center shadow-2xl animate-float">
                <Image
                  src="/assets/festival/dana-portrait.svg"
                  alt="Dana"
                  width={110}
                  height={110}
                  className="object-contain drop-shadow-xl"
                />
                {/* Boxing glove emoji overlay on Dana */}
                <span className="absolute -right-2 -bottom-2 text-3xl sm:text-4xl animate-bounce">
                  🥊
                </span>
              </div>
              <div className="mt-3 bg-red-600 text-white font-heading font-extrabold text-xs sm:text-sm px-3 py-1 rounded-full border-2 border-white shadow-lg flex items-center gap-1">
                <span>DANA 👑</span>
              </div>
              <span className="text-[11px] text-amber-200/80 mt-1 font-semibold">Birthday Puncher!</span>
            </div>

            {/* VS OR CLASH EFFECT */}
            <div className="flex flex-col items-center justify-center z-10">
              {isPunching ? (
                <span className="text-5xl sm:text-7xl animate-ping">💥</span>
              ) : isKO ? (
                <span className="text-4xl sm:text-6xl animate-bounce">🏁</span>
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center font-heading font-extrabold text-amber-400 text-sm sm:text-base animate-pulse">
                  VS
                </div>
              )}
            </div>

            {/* PAUL (THE TARGET / DEFENDER) */}
            <div
              onClick={handlePunch}
              className={`flex flex-col items-center cursor-pointer group transition-all duration-150 ${
                isPunching ? "-translate-x-6 sm:-translate-x-12 rotate-12 scale-95" : ""
              } ${isKO ? "rotate-90 opacity-80 translate-y-6" : ""}`}
            >
              <div
                className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 p-2 flex items-center justify-center shadow-2xl transition-colors ${
                  isKO
                    ? "bg-red-950/80 border-red-700"
                    : isHeavilyBruised
                    ? "bg-orange-950/60 border-orange-600 animate-shake"
                    : isBruised
                    ? "bg-amber-950/40 border-amber-500"
                    : "bg-blue-500/20 border-blue-500"
                }`}
              >
                <Image
                  src="/assets/festival/npc-paul-portrait.svg"
                  alt="Paul"
                  width={110}
                  height={110}
                  className={`object-contain drop-shadow-xl transition-all ${
                    isKO
                      ? "grayscale contrast-150 brightness-75"
                      : isHeavilyBruised
                      ? "sepia-[.4] hue-rotate-[-30deg]"
                      : isBruised
                      ? "sepia-[.2]"
                      : ""
                  }`}
                />

                {/* --- DAMAGE OVERLAYS FOR BRUISED TO KNOCK OUT --- */}
                
                {/* Stage 2: Bruised Face (HP 41-70) */}
                {isBruised && (
                  <>
                    <span className="absolute top-4 right-6 text-2xl animate-pulse" title="Black eye">
                      🤕
                    </span>
                    <span className="absolute bottom-4 left-6 text-xl" title="Band-aid">
                      🩹
                    </span>
                    <span className="absolute top-2 left-6 text-xl animate-bounce">
                      💧
                    </span>
                  </>
                )}

                {/* Stage 3: Heavily Bruised & Battered (HP 1-40) */}
                {isHeavilyBruised && (
                  <>
                    <div className="absolute inset-0 bg-purple-900/30 rounded-full pointer-events-none animate-pulse" />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl animate-spin-slow">
                      ⭐
                    </span>
                    <span className="absolute top-4 left-5 text-2xl" title="Black eye">
                      🤕
                    </span>
                    <span className="absolute top-6 right-5 text-2xl" title="Black eye 2">
                      🤕
                    </span>
                    <span className="absolute bottom-5 left-8 text-2xl">
                      🩹
                    </span>
                    <span className="absolute bottom-4 right-8 text-2xl">
                      🩹
                    </span>
                  </>
                )}

                {/* Stage 4: KNOCKOUT! (HP 0) */}
                {isKO && (
                  <>
                    <div className="absolute inset-0 bg-red-900/50 rounded-full pointer-events-none" />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
                      💀
                    </span>
                    <span className="absolute top-6 left-6 text-3xl font-extrabold text-red-400 drop-shadow-md">
                      ❌
                    </span>
                    <span className="absolute top-6 right-6 text-3xl font-extrabold text-red-400 drop-shadow-md">
                      ❌
                    </span>
                    <span className="absolute -right-4 top-2 text-3xl animate-float">
                      🏳️
                    </span>
                    <span className="absolute -left-4 bottom-2 text-3xl animate-spin-slow">
                      ⭐
                    </span>
                  </>
                )}
              </div>

              <div
                className={`mt-3 font-heading font-extrabold text-xs sm:text-sm px-3 py-1 rounded-full border-2 shadow-lg flex items-center gap-1 ${
                  isKO
                    ? "bg-red-800 text-red-200 border-red-500"
                    : "bg-blue-600 text-white border-white group-hover:scale-105"
                }`}
              >
                <span>{isKO ? "PAUL (KNOCKED OUT!) 💀" : "PAUL 🥡"}</span>
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 font-semibold">
                {isKO ? "Complete T.K.O.!" : "Click him to punch!"}
              </span>
            </div>
          </div>

          {/* DYNAMIC PAUL DIALOGUE BOX */}
          <div className="w-full max-w-lg bg-black/80 border-2 border-amber-500/60 rounded-2xl p-3 sm:p-4 text-center shadow-xl relative z-20 mt-2">
            <p className="font-body text-xs sm:text-base text-amber-100 italic">
              {isKO
                ? '"X_X ... Tell the chef... the birthday ramen noodles... were worth the beating... Happy birthday Dana..."'
                : isHeavilyBruised
                ? '"TAMA NA DANA!! Grabe ang lakas mong sumuntok! My jaw is vibrating!! I YIELD!! 🤕🏳️"'
                : isBruised
                ? '"Aray ko! Not in the face Dana!! I brought you birthday ramen! Why are we fighting in a Zen Garden?! 🩹"'
                : '"Hey Dana! Nice Zen Garden! Wait... why are you putting on boxing gloves?! Are we sparring?! ❓"'}
            </p>
          </div>
        </div>

        {/* BOTTOM ACTION CONTROLS */}
        <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 p-4 sm:p-6 border-t-2 border-amber-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {!isKO ? (
            <>
              <button
                onClick={handlePunch}
                className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:scale-105 active:scale-95 text-white font-heading font-black text-lg sm:text-2xl shadow-2xl shadow-red-600/50 border-4 border-white flex items-center justify-center gap-3 animate-bounce cursor-pointer transition-all"
              >
                <span className="text-3xl">💥</span>
                <span>PUNCH PAUL! (SPACEBAR)</span>
                <span className="text-3xl">🥊</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-heading font-bold text-sm sm:text-base border border-zinc-600 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Take a Break 🌿</span>
              </button>
            </>
          ) : (
            <>
              {/* KO VICTORY BANNER CONTROLS */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
                <div className="flex items-center gap-3 text-amber-300">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-2xl border border-amber-400 flex items-center justify-center text-2xl animate-bounce">
                    🏆
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Supreme Victory!
                    </div>
                    <div className="font-heading font-extrabold text-base sm:text-xl text-white">
                      Dana Knocked Out Paul in {combo} Punches! 👑
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleReset}
                    className="flex-1 sm:flex-initial py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:scale-105 active:scale-95 text-black font-heading font-extrabold text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Rematch Paul 🥊</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="flex-1 sm:flex-initial py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 active:scale-95 text-white font-heading font-bold text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Return to Island 🏝️</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
