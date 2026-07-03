"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, RefreshCw, Hand } from "lucide-react";
import { ProximityTarget, CharacterType } from "@/types/game";
import { soundManager } from "@/lib/sound";

interface ActionButtonProps {
  target: ProximityTarget | null;
  characterType: CharacterType;
  onInteract: () => void;
  onToggleCharacter: () => void;
}

export default function ActionButton({
  target,
  characterType,
  onInteract,
  onToggleCharacter,
}: ActionButtonProps) {
  const isWithinRange = target?.isWithinRange || false;

  const handleActionClick = () => {
    soundManager.playSparkle();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([15]);
      } catch {}
    }
    onInteract();
  };

  const handleToggleClick = () => {
    soundManager.playPop();
    onToggleCharacter();
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 sm:gap-3 pointer-events-auto select-none">
      {/* Secondary button: Character Switcher */}
      <button
        onClick={handleToggleClick}
        aria-label="Switch playable character"
        className="px-3 py-1.5 rounded-full bg-pearl/90 backdrop-blur-md border border-seafoam/60 text-reef font-heading font-bold text-[11px] sm:text-xs shadow-md hover:bg-white active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5 text-coral" />
        <span>Play as: {characterType === "explorer" ? "Dana 🍜" : "Bubbles 🐢"}</span>
      </button>

      {/* Primary Action Button */}
      {isWithinRange && target ? (
        <button
          onClick={handleActionClick}
          aria-label={target.type === "treasure" && target.treasure ? `Examine ${target.treasure.title}` : target.npc ? `Talk to ${target.npc.name}` : target.type === "zengarden" ? "Enter Suntukan sa Zen Garden" : "Interact"}
          className="relative px-4 py-3 sm:px-8 sm:py-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-coral via-sunset to-coral text-reef font-heading font-extrabold text-sm sm:text-lg shadow-2xl shadow-coral/50 border-4 border-white flex items-center gap-2 sm:gap-3 animate-bounce cursor-pointer hover:scale-105 active:scale-95 transition-all group"
        >
          {/* Glowing Halo */}
          <div className="absolute -inset-1 rounded-3xl bg-white/40 blur-sm animate-pulse pointer-events-none" />

          <div className="hidden sm:flex w-12 h-12 bg-white rounded-2xl p-1 shadow-inner items-center justify-center flex-shrink-0 overflow-hidden">
            {target.type === "treasure" && target.treasure ? (
              <Image
                src={target.treasure.icon}
                alt={target.treasure.title}
                width={40}
                height={40}
                className="object-contain"
              />
            ) : target.npc ? (
              <Image
                src={target.npc.portrait}
                alt={target.npc.name}
                width={40}
                height={40}
                className="object-contain rounded-xl"
              />
            ) : target.type === "zengarden" ? (
              <span className="text-2xl animate-bounce">🥊</span>
            ) : target.type === "hiddenTreasure" ? (
              <Sparkles className="w-7 h-7 text-amber-500 animate-spin-slow" />
            ) : null}
          </div>

          <div className="text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-reef/80 block font-bold">
              <span className="hidden sm:inline">Press [Space] or </span>Tap
            </span>
            <span className="flex items-center gap-1">
              <span>{target.type === "treasure" && target.treasure ? `Examine ${target.treasure.mapLabel}` : target.npc ? `Talk to ${target.npc.name}` : target.type === "zengarden" ? "Suntukan sa Zen Garden 🥊" : target.type === "hiddenTreasure" ? "Glimmering Star" : "Interact"}</span>
              <Sparkles className="w-4 h-4 text-white animate-sparkle" />
            </span>
          </div>
        </button>
      ) : (
        <div className="px-3 py-2 sm:px-4 sm:py-3 rounded-2xl bg-pearl/80 backdrop-blur-sm border border-white/60 text-reef/70 font-heading text-[11px] sm:text-xs font-semibold shadow-sm flex items-center gap-2">
          <Hand className="w-4 h-4 text-coral animate-pulse" />
          <span className="sm:hidden">Find a marker</span>
          <span className="hidden sm:inline">Walk near a marker to explore!</span>
        </div>
      )}
    </div>
  );
}
