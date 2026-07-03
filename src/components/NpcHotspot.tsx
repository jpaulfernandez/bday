"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { NPC } from "@/types/game";
import { soundManager } from "@/lib/sound";

interface NpcHotspotProps {
  npc: NPC;
  hasSpoken: boolean;
  isWithinRange?: boolean;
  onClick: (npc: NPC) => void;
}

export default function NpcHotspot({
  npc,
  hasSpoken,
  isWithinRange = false,
  onClick,
}: NpcHotspotProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isWalking, setIsWalking] = useState(false);
  const [currentBubble, setCurrentBubble] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWithinRange) {
      const bubbles = npc.proximityBubbles || [
        "Hey Dana! 🍜",
        "Happy Birthday! 🎉",
        "Having fun? ✨",
        "Birthday Queen! 👑",
      ];
      const randomBubble = bubbles[Math.floor(Math.random() * bubbles.length)];
      timer = setTimeout(() => setCurrentBubble(randomBubble), 0);
    } else {
      timer = setTimeout(() => setCurrentBubble(null), 0);
    }
    return () => clearTimeout(timer);
  }, [isWithinRange, npc.proximityBubbles]);

  useEffect(() => {
    if (npc.id === "angry-daens") return;
    let timeoutId: NodeJS.Timeout;
    let walkTimerId: NodeJS.Timeout;

    const scheduleNextMove = () => {
      // Random wait between 1.5s and 3.5s before taking a step or standing still
      const delay = Math.random() * 2000 + 1500;
      timeoutId = setTimeout(() => {
        // 75% chance to pace to a new nearby coordinate on the dock, 25% chance to pause
        if (Math.random() > 0.25) {
          // Tight safe wandering box around home position: ±1.2% in X (~24px), ±0.8% in Y (~11px)
          const newX = (Math.random() - 0.5) * 2.4;
          const newY = (Math.random() - 0.5) * 1.6;

          setIsWalking(true);
          setOffset({ x: newX, y: newY });

          // Walk step duration is 1200ms
          walkTimerId = setTimeout(() => {
            setIsWalking(false);
          }, 1200);
        } else {
          setIsWalking(false);
        }
        scheduleNextMove();
      }, delay);
    };

    scheduleNextMove();
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(walkTimerId);
    };
  }, [offset.x]);

  const handleClick = () => {
    soundManager.playPop();
    onClick(npc);
  };

  return (
    <div
      style={{
        left: `${npc.x + offset.x}%`,
        top: `${npc.y + offset.y}%`,
        transition: "left 1200ms ease-in-out, top 1200ms ease-in-out",
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-25 flex flex-col items-center group cursor-pointer pointer-events-auto"
    >
      {/* Speech bubble or check badge above character */}
      <button
        onClick={handleClick}
        aria-label={`Talk to ${npc.name}`}
        className="absolute -top-10 sm:-top-12 z-10 transition-transform duration-200 group-hover:scale-110 active:scale-95"
      >
        {isWithinRange && currentBubble ? (
          <div className="bg-gradient-to-r from-pearl via-white to-pearl border-2 border-coral rounded-2xl px-3 py-1 shadow-xl flex items-center gap-1.5 animate-bounce font-heading font-extrabold text-xs sm:text-sm text-reef whitespace-nowrap">
            <span>💬</span>
            <span>{currentBubble}</span>
          </div>
        ) : hasSpoken ? (
          <span className="w-6 h-6 rounded-full bg-seafoam text-reef flex items-center justify-center border-2 border-white shadow-md text-xs font-bold" title="Already greeted">
            ✓
          </span>
        ) : (
          <div className="bg-pearl border-2 border-coral rounded-2xl px-2.5 py-1 shadow-lg flex items-center gap-1 animate-bounce font-heading font-bold text-xs text-reef">
            <span className="w-4 h-4 rounded-full bg-sunset text-reef flex items-center justify-center font-extrabold text-[10px]">!</span>
            <span>Talk 💬</span>
          </div>
        )}
      </button>

      {/* Character Sprite Model */}
      <div
        onClick={handleClick}
        className="w-[68px] h-[102px] sm:w-[84px] sm:h-[126px] relative cursor-pointer transition-transform duration-300"
      >
        <div
          className={`absolute inset-0 flex items-end justify-center ${
            isWalking ? "animate-bounce-gentle" : ""
          } group-hover:scale-105 transition-transform duration-200`}
        >
          <Image
            src={npc.sprite}
            alt={npc.title}
            width={140}
            height={210}
            sizes="(max-width: 640px) 72px, 92px"
            className="max-h-full w-auto object-contain filter drop-shadow-md"
            priority
          />
        </div>
      </div>

      {/* Nameplate Tag */}
      <div
        className={`mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold whitespace-nowrap shadow-md transition-all duration-300 border ${
          hasSpoken
            ? "bg-pearl/80 text-reef/70 border-seafoam/50"
            : "bg-pearl text-reef border-coral/60 group-hover:bg-coral group-hover:text-white"
        }`}
      >
        {npc.name}
      </div>
    </div>
  );
}
