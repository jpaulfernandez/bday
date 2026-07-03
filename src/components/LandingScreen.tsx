"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";
import { islandConfig } from "@/data/config";
import { soundManager } from "@/lib/sound";
import AudioToggle from "./AudioToggle";

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const loadingMsg = islandConfig.loadingMessages[0];
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    soundManager.playClick();
    soundManager.playSparkle();
    setIsStarting(true);
    setTimeout(() => {
      onStart();
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-[#F6A8C8]/25 via-[#7EC8E3]/40 to-[#A8E6CF]/30">
      <AudioToggle />

      {/* Animated Background Ramen & Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-[12%] left-[8%] text-3xl animate-float opacity-60">🍥</span>
        <span className="absolute top-[58%] left-[12%] text-2xl animate-float-slow opacity-50" style={{ animationDelay: "1s" }}>🏮</span>
        <span className="absolute top-[22%] right-[10%] text-2xl animate-float opacity-60" style={{ animationDelay: "0.5s" }}>🍜</span>
        <span className="absolute bottom-[18%] right-[14%] text-3xl animate-float-slow opacity-50" style={{ animationDelay: "2s" }}>🏮</span>
        <span className="absolute bottom-[30%] left-[20%] text-xl animate-float opacity-40" style={{ animationDelay: "1.5s" }}>✨</span>
      </div>

      {/* Main Welcome Card */}
      <div className={`relative z-10 max-w-lg w-full bg-pearl/90 backdrop-blur-xl border-2 border-white/80 rounded-3xl p-6 sm:p-10 pt-16 sm:pt-20 shadow-2xl text-center transform transition-all duration-500 ${isStarting ? "scale-95 opacity-0 -translate-y-4" : "scale-100 opacity-100 animate-float"}`}>

        {/* Dana Portrait (dateables style) */}
        <div className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 w-28 h-32 sm:w-36 sm:h-40 pointer-events-none drop-shadow-xl">
          <Image src="/assets/festival/dana-portrait.svg" alt={`${islandConfig.friendName} portrait`} width={300} height={340} className="object-contain w-full h-full" priority unoptimized />
        </div>

        {/* Decorative Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand/80 border border-coral/30 text-reef font-heading text-xs sm:text-sm font-semibold uppercase tracking-wider mt-2 mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-coral animate-sparkle" />
          <span>Guest of Honor: {islandConfig.friendName}</span>
        </div>

        {/* Title & Greeting */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-reef mb-4 tracking-tight leading-tight">
          Happy Birthday, <span className="text-coral underline decoration-sunset decoration-wavy decoration-2">{islandConfig.friendName}</span>! 🌺
        </h1>

        <p className="text-base sm:text-lg text-reef/80 font-body mb-8 leading-relaxed">
          {islandConfig.landingSubtitle}
        </p>

        {/* Cute Story Quote Box */}
        <div className="bg-white/60 rounded-2xl p-4 mb-8 border border-seafoam/50 text-left flex items-start gap-3.5 shadow-inner">
          <span className="text-3xl">🐢</span>
          <div>
            <p className="font-heading font-bold text-sm text-reef">
              {islandConfig.guideName} • {islandConfig.guideTitle}
            </p>
            <p className="text-xs sm:text-sm text-reef/75 mt-1 italic">
              &quot;The whole committee has been preparing for weeks! The lanterns are lit and the festival stops are ready — all we needed was you!&quot;
            </p>
          </div>
        </div>

        {/* Primary Start Button */}
        <button
          onClick={handleStart}
          disabled={isStarting}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-coral via-[#FF9E80] to-sunset text-reef font-heading text-lg sm:text-xl font-bold shadow-xl shadow-coral/30 hover:shadow-coral/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mx-auto group border-2 border-white/60 cursor-pointer relative overflow-hidden"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform duration-500">🏮</span>
          <span>Enter the Festival</span>
          <Sparkles className="w-5 h-5 text-white animate-sparkle" />
        </button>

        {/* Footer Loading Message */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-reef/60">
          <span className="w-2 h-2 rounded-full bg-seafoam animate-ping" />
          <span>{loadingMsg}</span>
        </div>
      </div>

      {/* Bottom Tagline */}
      <p className="relative z-10 mt-8 text-xs sm:text-sm text-reef/70 font-medium flex items-center gap-1.5">
        Made with <Heart className="w-4 h-4 text-coral fill-coral animate-pulse" /> for {islandConfig.friendName}&apos;s special day
      </p>
    </div>
  );
}
