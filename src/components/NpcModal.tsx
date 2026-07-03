"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { NPC } from "@/types/game";
import { soundManager } from "@/lib/sound";
import { Sparkles, Heart } from "lucide-react";

interface NpcModalProps {
  npc: NPC | null;
  hasSpoken: boolean;
  onClose: (npcId: string) => void;
}

export default function NpcModal({
  npc,
  hasSpoken,
  onClose,
}: NpcModalProps) {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (npc) {
      if (!hasSpoken) {
        timer = setTimeout(() => setCurrentMessage(npc.initialMessage), 0);
      } else {
        const randomIndex = Math.floor(Math.random() * npc.repeatMessages.length);
        timer = setTimeout(() => setCurrentMessage(npc.repeatMessages[randomIndex]), 0);
      }
    }
    return () => clearTimeout(timer);
  }, [npc, hasSpoken]);

  const pages = currentMessage.split("||");

  useEffect(() => {
    const timer = setTimeout(() => setPageIndex(0), 0);
    return () => clearTimeout(timer);
  }, [currentMessage]);

  const handleNext = React.useCallback(() => {
    if (!npc) return;
    if (pageIndex < pages.length - 1) {
      soundManager.playClick();
      setPageIndex((prev) => prev + 1);
    } else {
      soundManager.playPop();
      onClose(npc.id);
    }
  }, [npc, pageIndex, pages.length, onClose]);

  useEffect(() => {
    if (!npc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [npc, handleNext]);

  if (!npc) return null;

  return (
    <div
      onClick={handleNext}
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:p-6 md:p-10 bg-black/45 backdrop-blur-sm animate-fade-in cursor-pointer select-none"
    >
      {/* Dialogue Outer Container */}
      <div
        onClick={(e) => e.stopPropagation()} // Let clicking inside or outside trigger handleNext
        className="w-full max-w-4xl bg-[#FAF6ED] border-4 border-[#8C6D52] rounded-3xl sm:rounded-[32px] p-4 sm:p-6 md:p-8 shadow-2xl shadow-black/40 relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-8 animate-scale-up border-b-8 border-b-[#6B503B]"
      >
        {/* Floating Sparkles Decoration */}
        <div className="absolute -top-3 -left-3 text-sunset animate-bounce-gentle">
          <Sparkles className="w-8 h-8 fill-sunset text-sunset drop-shadow-md" />
        </div>

        {/* Character Portrait Box */}
        <div className="relative flex-shrink-0 -mt-12 sm:-mt-16 md:-mt-20 flex flex-col items-center" onClick={handleNext}>
          <div className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-b from-[#FFF5E4] to-[#EBDDBE] border-4 sm:border-6 border-[#8C6D52] shadow-xl overflow-hidden flex items-center justify-center relative p-1 group">
            <Image
              src={npc.portrait}
              alt={npc.title}
              width={200}
              height={200}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          {/* Character Name Badge */}
          <div className="-mt-3 sm:-mt-4 px-4 sm:px-6 py-1 sm:py-1.5 rounded-full bg-[#E5D5C5] border-2 border-[#8C6D52] shadow-md flex items-center gap-1.5 z-10">
            <Heart className="w-3.5 h-3.5 text-coral fill-coral animate-pulse" />
            <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base text-[#5C4033] whitespace-nowrap">
              {npc.title}
            </span>
          </div>
        </div>

        {/* Dialogue Text Area */}
        <div className="flex-1 flex flex-col justify-between min-h-[100px] sm:min-h-[140px] pt-1 sm:pt-2 w-full" onClick={handleNext}>
          {/* Message Content */}
          <div className="text-[#4E3524] font-body text-base sm:text-lg md:text-2xl font-medium leading-relaxed tracking-wide">
            {pages[pageIndex]}
          </div>

          {/* Tap to continue indicator */}
          <div className="mt-4 sm:mt-6 flex items-center justify-end gap-2 text-[#8C6D52] font-heading font-bold text-xs sm:text-sm animate-pulse self-end cursor-pointer">
            <span>{pageIndex < pages.length - 1 ? `Page ${pageIndex + 1}/${pages.length} • Tap for next page` : "Tap anywhere or press [Space] to close"}</span>
            <span className="inline-block transform translate-x-0.5">▶</span>
          </div>
        </div>
      </div>
    </div>
  );
}
