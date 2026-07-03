"use client";

import React from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { Treasure } from "@/data/treasures";
import { soundManager } from "@/lib/sound";

interface TreasureHotspotProps {
  treasure: Treasure;
  isCollected: boolean;
  isUnlocked?: boolean; // For final chest
  isQuestLocked?: boolean; // When Dana hasn't spoken to the chef yet!
  hasSpokenToChef?: boolean; // When Dana has already had the initial interaction
  onClick: (treasure: Treasure) => void;
}

export default function TreasureHotspot({
  treasure,
  isCollected,
  isUnlocked = true,
  isQuestLocked = false,
  hasSpokenToChef = false,
  onClick,
}: TreasureHotspotProps) {
  const isFinalChest = treasure.contentType === "final" || treasure.contentType === "chef";
  const iconSrc = isCollected && treasure.completedIcon ? treasure.completedIcon : treasure.icon;

  const handleClick = () => {
    soundManager.playClick();
    onClick(treasure);
  };

  // Special NPC Sprite rendering for the Festival Chef in the center
  if (isFinalChest) {
    return (
      <div
        style={{
          left: `${treasure.x}%`,
          top: `${treasure.y}%`,
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-25 flex flex-col items-center group cursor-pointer pointer-events-auto"
      >
        {/* Animated Speech Bubble */}
        {(isUnlocked || !hasSpokenToChef) && (
          <button
            onClick={handleClick}
            aria-label="Talk to Festival Chef"
            className="absolute -top-12 sm:-top-14 z-10 transition-transform duration-200 group-hover:scale-110 active:scale-95"
          >
            <div className="bg-gradient-to-r from-coral via-sunset to-coral text-white border-2 border-white rounded-2xl px-3 py-1.5 shadow-xl flex items-center gap-1.5 animate-bounce font-heading font-extrabold text-xs sm:text-sm whitespace-nowrap">
              <span className="text-base sm:text-lg">🍜</span>
              <span>{isUnlocked ? "Dana get over here!" : "Get your ramen here!"}</span>
            </div>
          </button>
        )}

        {/* Chef Sprite Model */}
        <div
          onClick={handleClick}
          className="w-[72px] h-[108px] sm:w-[90px] sm:h-[135px] relative cursor-pointer transition-transform duration-300 group-hover:scale-105 animate-float-slow"
        >
          <Image
            src="/assets/festival/npc-chef-sprite.svg"
            alt="Festival Chef"
            width={140}
            height={210}
            sizes="(max-width: 640px) 72px, 90px"
            className="max-h-full w-auto object-contain filter drop-shadow-lg"
            priority
          />
        </div>

        {/* Nameplate Tag */}
        <div className="mt-1 px-3 py-0.5 rounded-full text-xs font-heading font-extrabold whitespace-nowrap shadow-md bg-pearl text-reef border-2 border-coral group-hover:bg-coral group-hover:text-white transition-all duration-300">
          Festival Chef 👨‍🍳
        </div>
      </div>
    );
  }

  // Regular Hotspot Button for all 5 ingredient stops
  return (
    <div
      style={{
        left: `${treasure.x}%`,
        top: `${treasure.y}%`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer pointer-events-auto"
    >
      {/* Halo / Glow effect for uncollected treasures */}
      {!isCollected && !isQuestLocked && isUnlocked && (
        <div className="absolute -inset-2 rounded-full bg-sunset/40 blur-md animate-pulse-glow pointer-events-none" />
      )}

      {/* Button Marker */}
      <button
        onClick={handleClick}
        aria-label={`Open ${treasure.mapLabel}`}
        className={`relative flex items-center justify-center p-2 sm:p-2.5 rounded-2xl border-2 shadow-xl transition-all duration-300 transform group-hover:scale-110 active:scale-95 ${
          isCollected
            ? "bg-seafoam/90 border-white text-reef shadow-md"
            : isQuestLocked || (isFinalChest && !isUnlocked)
            ? "bg-reef/80 border-sand/50 text-sand shadow-inner opacity-80"
            : "bg-pearl border-coral shadow-coral/30 animate-float"
        }`}
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex items-center justify-center">
          <Image
            src={iconSrc}
            alt={treasure.title}
            width={48}
            height={48}
            className={`w-full h-full object-contain filter drop-shadow-sm ${isQuestLocked ? "grayscale opacity-75" : ""}`}
          />
        </div>

        {/* Status Badge */}
        <span className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center filter drop-shadow-md">
          {isCollected ? (
            <span className="w-6 h-6 rounded-full bg-seafoam-dark text-white flex items-center justify-center border-2 border-white shadow-md text-xs font-bold" title="Visited">
              ✓
            </span>
          ) : isQuestLocked || (isFinalChest && !isUnlocked) ? (
            <span className="bg-reef text-sand w-6 h-6 rounded-full flex items-center justify-center border border-white shadow-md" title="Talk to the Festival Chef first!">
              <Lock className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className="w-6 h-6 rounded-full bg-sunset text-reef flex items-center justify-center border-2 border-white shadow-md text-sm font-extrabold animate-bounce" title="Tap to explore!">
              !
            </span>
          )}
        </span>
      </button>

      {/* Map Label Tag */}
      <div
        className={`mt-1 px-2.5 py-1 rounded-full text-xs font-heading font-semibold whitespace-nowrap shadow-md transition-all duration-300 border ${
          isCollected
            ? "bg-pearl/80 text-reef/70 border-seafoam/50"
            : isQuestLocked
            ? "bg-pearl/70 text-reef/60 border-sand/60"
            : "bg-pearl text-reef border-coral/40 group-hover:bg-coral group-hover:text-white"
        }`}
      >
        {treasure.mapLabel}
      </div>
    </div>
  );
}
