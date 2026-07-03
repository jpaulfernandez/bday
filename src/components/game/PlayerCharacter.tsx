"use client";

import React from "react";
import Image from "next/image";
import { PlayerState, ProximityTarget } from "@/types/game";
import { islandConfig } from "@/data/config";
import { soundManager } from "@/lib/sound";

interface PlayerCharacterProps {
  player: PlayerState;
  closestTarget: ProximityTarget | null;
  celebratingIngredient?: { name: string; icon: string } | null;
  onInteract: () => void;
}

export default function PlayerCharacter({
  player,
  closestTarget,
  celebratingIngredient = null,
  onInteract,
}: PlayerCharacterProps) {
  const isWithinRange = closestTarget?.isWithinRange || false;
  const isExplorer = player.characterType === "explorer";
  const spriteSrc = isExplorer ? "/assets/festival/dana-sprite.svg" : "/assets/festival/turtle-guide.svg";

  const handleBubbleClick = () => {
    if (isWithinRange) {
      soundManager.playSparkle();
      onInteract();
    }
  };

  return (
    <div
      style={{
        left: `${player.x}px`,
        top: `${player.y}px`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-auto transition-transform duration-75"
    >
      {/* Celebrating Ingredient Overlay! */}
      {celebratingIngredient && (
        <div className="absolute -top-24 sm:-top-28 z-40 flex flex-col items-center animate-bounce">
          <div className="bg-gradient-to-r from-coral via-sunset to-coral text-white border-2 border-white rounded-2xl px-3.5 py-1.5 shadow-2xl flex items-center gap-1.5 font-heading font-extrabold text-xs sm:text-sm whitespace-nowrap">
            <span>Got {celebratingIngredient.name}! ✨</span>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/95 rounded-full p-2 border-2 border-amber-300 shadow-xl flex items-center justify-center -mt-2 animate-spin-slow">
            <Image
              src={celebratingIngredient.icon}
              alt={celebratingIngredient.name}
              width={48}
              height={48}
              className="object-contain animate-float"
            />
          </div>
        </div>
      )}

      {/* Exclamation Proximity Bubble */}
      {!celebratingIngredient && isWithinRange && (
        <button
          onClick={handleBubbleClick}
          aria-label="Examine target"
          className="absolute -top-12 sm:-top-14 bg-pearl border-2 border-coral rounded-2xl px-3 py-1 shadow-xl flex items-center gap-1.5 animate-bounce font-heading font-extrabold text-xs sm:text-sm text-reef cursor-pointer hover:scale-110 active:scale-95 transition-all"
        >
          <span className="w-5 h-5 rounded-full bg-coral text-white flex items-center justify-center font-bold text-xs animate-ping absolute opacity-40" />
          <span className="w-5 h-5 rounded-full bg-coral text-white flex items-center justify-center font-bold text-xs relative z-10">!</span>
          <span className="whitespace-nowrap">{closestTarget?.type === "zengarden" ? "Suntukan! 🥊" : closestTarget?.type === "hiddenTreasure" ? "Glimmer! ✨" : "Examine 🔍"}</span>
        </button>
      )}

      {/* Character Sprite (no directional mirroring) */}
      <div
        onClick={handleBubbleClick}
        className={`${isExplorer ? "w-[68px] h-[102px] sm:w-[84px] sm:h-[126px]" : "w-16 h-16 sm:w-20 sm:h-20"} relative cursor-pointer`}
      >
        <div className={`absolute inset-0 flex items-end justify-center ${celebratingIngredient ? "animate-bounce" : player.isMoving ? "animate-bounce-gentle" : "animate-float-slow"}`}>
          <Image
            src={spriteSrc}
            alt={isExplorer ? `${islandConfig.friendName} explorer sprite` : "Bubbles turtle sprite"}
            width={isExplorer ? 140 : 80}
            height={isExplorer ? 210 : 80}
            sizes={isExplorer ? "(max-width: 640px) 72px, 92px" : "(max-width: 640px) 64px, 80px"}
            className="max-h-full w-auto object-contain filter drop-shadow-lg"
            priority
          />
        </div>
      </div>

      {/* Player nameplate tag */}
      <span className="mt-0.5 px-2 py-0.5 rounded-full bg-pearl/80 border border-white/60 text-[10px] font-heading font-bold text-reef/80 shadow-xs whitespace-nowrap">
        {isExplorer ? `${islandConfig.friendName} 🍜` : "Bubbles 🐢"}
      </span>
    </div>
  );
}

