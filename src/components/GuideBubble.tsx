"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { islandConfig } from "@/data/config";
import { soundManager } from "@/lib/sound";
import festivalContent from "@/data/festival_content.json";

interface GuideBubbleProps {
  collectedCount: number;
  totalCount: number;
}

export default function GuideBubble({ collectedCount, totalCount }: GuideBubbleProps) {
  const [customQuote, setCustomQuote] = useState<string | null>(null);
  const [isBounce, setIsBounce] = useState(false);

  const tips = [
    ...festivalContent.guide.nudges,
    "Tip: Look for glowing stops on the map! Each one holds a ramen ingredient. 🗺️",
    "Did you know? Sea turtles can navigate across entire oceans, but I came straight to your birthday festival! 🐢🍜",
    "The lanterns on the lake hold school memories that are certified 100% iconic! 🏮",
    "Don't skip the Fortune Tent — the birthday predictions for age 26 are OFF THE CHARTS! 🔮",
    "Visit the Compliment Board to read all the sweet things your friends think about you! 💖",
    "Once you gather all 5 ramen ingredients, return to the Festival Chef in the center! 👨‍🍳✨"
  ];

  const getMessage = () => {
    if (customQuote) return customQuote;
    if (collectedCount === 0) return festivalContent.guide.welcomeMessage;
    if (collectedCount === totalCount) return festivalContent.guide.completionMessage;
    const remaining = totalCount - collectedCount;
    return `${remaining} ingredient${remaining > 1 ? "s" : ""} left — the chef's getting hungry! 🍜`;
  };

  const handleTurtleClick = () => {
    soundManager.playSparkle();
    setIsBounce(true);
    setTimeout(() => setIsBounce(false), 500);
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCustomQuote(randomTip);
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-40 z-40 max-w-[340px] sm:max-w-[380px] flex items-end gap-3 pointer-events-auto">
      {/* Interactive Turtle Avatar */}
      <button
        onClick={handleTurtleClick}
        aria-label="Ask Bubbles for a tip"
        className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pearl border-2 border-seafoam shadow-xl p-1 hover:scale-110 transition-transform duration-300 group cursor-pointer ${isBounce ? "animate-bounce" : "animate-float-slow"}`}
      >
        <Image
          src="/assets/festival/turtle-guide.svg"
          alt={islandConfig.guideName}
          width={56}
          height={56}
          className="w-full h-full object-contain"
          priority
        />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-coral text-[9px] font-bold text-white items-center justify-center">?</span>
        </span>
      </button>

      {/* Speech Bubble */}
      <div className="relative bg-pearl/95 backdrop-blur-md border-2 border-white/80 rounded-2xl rounded-bl-none p-3.5 sm:p-4 shadow-xl text-reef text-xs sm:text-sm font-body leading-relaxed animate-float">
        <div className="flex items-center justify-between gap-2 mb-1 border-b border-seafoam/40 pb-1">
          <span className="font-heading font-bold text-reef flex items-center gap-1.5">
            <span>🐢 {islandConfig.guideName}</span>
            <span className="text-[10px] uppercase tracking-wider bg-seafoam/40 px-1.5 py-0.5 rounded text-reef/80">Guide</span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-coral animate-sparkle" />
        </div>
        <p className="text-reef/90">{getMessage()}</p>
        <p className="mt-1.5 text-[10px] text-reef/60 italic font-medium">
          (Tap {islandConfig.guideName} for birthday secrets & tips!)
        </p>
      </div>
    </div>
  );
}
