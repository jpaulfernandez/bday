"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, CheckCircle2, MessageCircleHeart, Utensils } from "lucide-react";
import { Treasure } from "@/data/treasures";
import { soundManager } from "@/lib/sound";
import confetti from "canvas-confetti";
import festivalContent from "@/data/festival_content.json";

interface TreasureModalProps {
  treasure: Treasure;
  isCollected: boolean;
  onClose: (collectedIng?: { name: string; icon: string }) => void;
  onCollect: (treasureId: string) => void;
}

export default function TreasureModal({
  treasure,
  isCollected,
  onClose,
  onCollect,
}: TreasureModalProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [viewedMemories, setViewedMemories] = useState<number[]>([0]);
  const [bloomedCompliments, setBloomedCompliments] = useState<number[]>([]);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [currentFortune, setCurrentFortune] = useState<string | null>(null);
  const [activeFortuneTab, setActiveFortuneTab] = useState<number>(0);
  const [hasCollectedThisTurn, setHasCollectedThisTurn] = useState(isCollected);

  // Spice stall puzzle state
  const [spiceSequence, setSpiceSequence] = useState<string[]>([]);
  const [spiceFeedback, setSpiceFeedback] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      soundManager.restoreMusic();
    };
  }, []);

  const handleCloseModal = () => {
    soundManager.restoreMusic();
    if (hasCollectedThisTurn && treasure.ingredient) {
      onClose({ name: treasure.ingredient.name, icon: treasure.ingredient.icon });
    } else {
      onClose();
    }
  };

  // Trigger ingredient drop and celebration effects
  const handleCollectAction = () => {
    if (!hasCollectedThisTurn) {
      soundManager.playSparkle();
      soundManager.playPop();
      setHasCollectedThisTurn(true);
      onCollect(treasure.id);
      
      // Mini confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  // 1. Lantern Memories: track viewed tabs
  const handleSelectMemory = (idx: number) => {
    soundManager.playPop();
    setActiveTab(idx);
    if (!viewedMemories.includes(idx)) {
      const updated = [...viewedMemories, idx];
      setViewedMemories(updated);
      if (treasure.gallery && updated.length >= treasure.gallery.length && !hasCollectedThisTurn) {
        handleCollectAction();
      }
    }
  };

  // 2. Message Board: track bloomed compliments
  const handleBloom = (index: number) => {
    if (!bloomedCompliments.includes(index)) {
      soundManager.playPop();
      const updated = [...bloomedCompliments, index];
      setBloomedCompliments(updated);
      if (treasure.compliments && updated.length >= treasure.compliments.length && !hasCollectedThisTurn) {
        handleCollectAction();
      }
    }
  };

  // 3. Spice Stall: sequence puzzle
  const handleSpiceTap = (stepId: string) => {
    soundManager.playPop();
    const expectedSteps = ["chili", "garlic", "egg"];
    const currentStepIndex = spiceSequence.length;

    if (expectedSteps[currentStepIndex] === stepId) {
      const nextSeq = [...spiceSequence, stepId];
      setSpiceSequence(nextSeq);
      setSpiceFeedback(null);

      if (nextSeq.length === expectedSteps.length) {
        soundManager.playVictory();
        setSpiceFeedback(festivalContent.spiceRecipe.successMessage);
        if (!hasCollectedThisTurn) {
          handleCollectAction();
        }
      }
    } else {
      // Gentle reset
      soundManager.playSparkle();
      setSpiceSequence([]);
      setSpiceFeedback(festivalContent.spiceRecipe.tryAgainMessage);
    }
  };

  // 4. Fortune Tent: oracle crystal ball
  const handleOracle = () => {
    soundManager.playSparkle();
    setCurrentFortune(treasure.body || festivalContent.fortuneTent.fortuneText);
    if (!hasCollectedThisTurn) {
      handleCollectAction();
    }
  };

  // 5. Dana's House: borrow chashu
  const handleBorrowChashu = () => {
    soundManager.playSparkle();
    if (!hasCollectedThisTurn) {
      handleCollectAction();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-reef/60 backdrop-blur-sm animate-fadeIn overflow-hidden">
      {/* Modal Card / Bottom Sheet */}
      <div className="relative w-full max-w-2xl bg-pearl border-t-4 sm:border-4 border-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85dvh] sm:max-h-[90vh] animate-slide-up sm:animate-float">
        {/* Mobile Swipe Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-reef/20 rounded-full mx-auto mt-2 mb-1 flex-shrink-0" />
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-ocean via-seafoam to-sand p-4 sm:p-6 flex items-center justify-between border-b-2 border-white/60 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/90 rounded-2xl p-1.5 shadow-md flex items-center justify-center border border-white">
              <Image src={treasure.icon} alt={treasure.title} width={40} height={40} className="object-contain" />
            </div>
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-reef/75 bg-white/50 px-2 py-0.5 rounded-full">
                {treasure.mapLabel} • {treasure.contentType}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-reef tracking-tight mt-0.5 flex items-center gap-2">
                <span>{treasure.title}</span>
              </h2>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
            aria-label="Close modal"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-reef flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-reef font-body flex-1">
          
          {/* JUICY INGREDIENT ACQUIRED TOAST BANNER */}
          {hasCollectedThisTurn && treasure.ingredient && (
            <div className="bg-gradient-to-r from-coral via-sunset to-coral p-4 sm:p-5 rounded-3xl text-white font-heading font-extrabold flex items-center justify-between shadow-xl animate-bounce-gentle border-2 border-white transform scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/90 p-2 flex items-center justify-center shadow-md border border-white flex-shrink-0">
                  <Image src={treasure.ingredient.icon} alt={treasure.ingredient.name} width={44} height={44} className="object-contain animate-float" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm uppercase tracking-widest text-sand flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-white animate-sparkle" />
                    <span>Ramen Ingredient Obtained!</span>
                  </div>
                  <div className="text-lg sm:text-2xl drop-shadow-sm mt-0.5">Got: {treasure.ingredient.name}! ✨</div>
                  <div className="text-xs text-white/90 font-normal italic mt-0.5">
                    &quot;{treasure.ingredient.themeTieIn}&quot;
                  </div>
                </div>
              </div>
              <span className="text-3xl sm:text-4xl animate-spin-slow hidden xs:block">🍜</span>
            </div>
          )}

          {/* Intro Text */}
          {treasure.introText && (
            <div className="bg-sand/40 border border-sand/80 rounded-2xl p-3.5 text-xs sm:text-sm italic text-reef/85 flex items-center gap-2.5 shadow-inner">
              <Sparkles className="w-5 h-5 text-coral flex-shrink-0 animate-sparkle" />
              <span>{treasure.introText}</span>
            </div>
          )}

          <p className="text-sm sm:text-base text-reef/90 leading-relaxed font-medium">
            {treasure.body}
          </p>

          {/* 1. MEMORY GALLERY (Lantern Memories -> Broth) */}
          {treasure.contentType === "memory" && treasure.gallery && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-heading font-bold text-reef/70 bg-white/50 px-3 py-1.5 rounded-full">
                <span>🏮 Tap all 3 lanterns to simmer the broth!</span>
                <span>{viewedMemories.length}/{treasure.gallery.length} Viewed</span>
              </div>

              {/* Tabs for switching memories */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {treasure.gallery.map((_, idx) => {
                  const isViewed = viewedMemories.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectMemory(idx)}
                      className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === idx
                          ? "bg-coral text-white shadow-md scale-105"
                          : isViewed
                          ? "bg-seafoam/40 text-reef hover:bg-seafoam/60"
                          : "bg-white/70 text-reef hover:bg-white border border-dashed border-coral/40"
                      }`}
                    >
                      <span>{isViewed ? "🏮" : "✨"}</span>
                      <span>Lantern #{idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Polaroid Card */}
              {treasure.gallery[activeTab] && (
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border-2 border-seafoam/40 transform rotate-1 transition-all duration-300 max-w-md mx-auto">
                  <div className="relative w-full h-[260px] sm:h-[320px] rounded-xl overflow-hidden bg-black/90 mb-4 border border-reef/10 flex items-center justify-center">
                    <Image
                      src={treasure.gallery[activeTab].src}
                      alt={treasure.gallery[activeTab].alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-heading font-semibold text-reef/60 mb-2">
                    <span className="bg-sand/50 px-2 py-0.5 rounded">{treasure.gallery[activeTab].date || "Timeless Memory"}</span>
                  </div>
                  <p className="font-heading font-bold text-sm sm:text-base text-reef text-center italic">
                    &quot;{treasure.gallery[activeTab].caption}&quot;
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. COMPLIMENT REEF (Message Board & Compliment Board) */}
          {treasure.contentType === "compliment" && treasure.compliments && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs sm:text-sm font-heading font-bold text-reef/80 bg-white/70 px-4 py-2 rounded-2xl shadow-sm border border-white">
                <span>💌 {treasure.id === "secret-spice-stall" ? "Read all compliments to reveal the reward!" : "Read all messages to reveal the Noodles!"}</span>
                <span className="bg-coral text-white px-2.5 py-0.5 rounded-full">{bloomedCompliments.length}/{treasure.compliments.length} Read</span>
              </div>

              {selectedMessageIndex !== null ? (
                /* Message / Video Detail Screen */
                <div className="bg-[#FAF6ED] border-4 border-[#8C6D52] rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 animate-scale-up relative">
                  <div className="flex items-center justify-between border-b-2 border-[#8C6D52]/20 pb-3">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        soundManager.restoreMusic();
                        setSelectedMessageIndex(null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#E5D5C5] hover:bg-[#D4C0AB] text-[#5C4033] font-heading font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span>← Back to List</span>
                    </button>
                    <span className="text-xs font-heading font-bold text-[#8C6D52] uppercase tracking-wider">
                      Message {selectedMessageIndex + 1} of {treasure.compliments.length}
                    </span>
                  </div>

                  {(() => {
                    const raw = treasure.compliments[selectedMessageIndex];
                    const item = typeof raw === "string" ? { sender: `Friend #${selectedMessageIndex + 1}`, subject: `Message #${selectedMessageIndex + 1}`, content: raw, type: "text", videoUrl: "" } : raw;

                    return (
                      <div className="space-y-4 pt-1">
                        <div className="flex items-center gap-3 bg-white/60 p-3 rounded-2xl border border-[#8C6D52]/30">
                          <span className="text-3xl">{item.type === "video" ? "🎬" : "💌"}</span>
                          <div>
                            <h4 className="font-heading font-extrabold text-base sm:text-lg text-[#5C4033]">
                              {item.subject || `A message from ${item.sender}`}
                            </h4>
                            <span className="text-xs text-[#8C6D52] font-semibold">From: {item.sender || "Special Friend"}</span>
                          </div>
                        </div>

                        {item.type === "video" && item.videoUrl ? (
                          <div className="space-y-2">
                            <div className="bg-black/90 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#8C6D52] relative flex items-center justify-center">
                              <video
                                src={item.videoUrl}
                                controls
                                autoPlay
                                playsInline
                                onPlay={() => soundManager.duckMusic()}
                                onPause={() => soundManager.restoreMusic()}
                                onEnded={() => soundManager.restoreMusic()}
                                className="w-full max-h-[55vh] object-contain mx-auto"
                              />
                            </div>
                            <p className="text-xs text-[#8C6D52] text-center italic">
                              💡 Tip: Background music automatically lowers while video is playing!
                            </p>
                          </div>
                        ) : null}

                        {item.content && (
                          <div className="bg-white/80 p-4 sm:p-6 rounded-2xl border-2 border-dashed border-[#8C6D52]/40 text-[#4E3524] font-body text-sm sm:text-base leading-relaxed whitespace-pre-wrap shadow-inner">
                            {item.content}
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              soundManager.restoreMusic();
                              if (selectedMessageIndex < treasure.compliments!.length - 1) {
                                const nextIdx = selectedMessageIndex + 1;
                                handleBloom(nextIdx);
                                setSelectedMessageIndex(nextIdx);
                              } else {
                                setSelectedMessageIndex(null);
                              }
                            }}
                            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-coral to-sunset text-white font-heading font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          >
                            {selectedMessageIndex < treasure.compliments!.length - 1 ? "Next Message →" : "Finish Reading ✓"}
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* Mailing List / Game Inbox View */
                <div className="bg-white/90 rounded-3xl border-2 border-coral/30 shadow-md overflow-hidden divide-y divide-coral/15">
                  {treasure.compliments.map((raw, idx) => {
                    const isBloomed = bloomedCompliments.includes(idx);
                    const item = typeof raw === "string" ? { sender: `Friend #${idx + 1}`, subject: `Message #${idx + 1}`, content: raw, type: "text", videoUrl: "" } : raw;

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          handleBloom(idx);
                          setSelectedMessageIndex(idx);
                        }}
                        className={`w-full p-4 text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer hover:bg-seafoam/20 group ${
                          isBloomed ? "bg-white/50" : "bg-amber-50/70 font-semibold"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl shadow-sm border ${
                            isBloomed ? "bg-seafoam/30 border-seafoam text-reef" : "bg-gradient-to-br from-coral to-sunset border-white text-white animate-pulse"
                          }`}>
                            {item.type === "video" ? "🎬" : isBloomed ? "📖" : "✉️"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs sm:text-sm font-heading font-extrabold truncate ${isBloomed ? "text-reef/70" : "text-reef"}`}>
                                {item.subject || `A message from ${item.sender}`}
                              </span>
                              {!isBloomed && (
                                <span className="bg-coral text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 animate-bounce-gentle">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-reef/60 truncate mt-0.5 font-medium">
                              {item.type === "video" ? "🎥 Tap to watch video greeting..." : item.content?.substring(0, 60) + "..."}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs font-heading font-bold px-2.5 py-1 rounded-full ${
                            isBloomed ? "bg-seafoam/40 text-reef/80" : "bg-amber-200/80 text-amber-900"
                          }`}>
                            {isBloomed ? "Read ✓" : "Unread"}
                          </span>
                          <span className="text-reef/40 group-hover:text-coral group-hover:translate-x-1 transition-all text-lg font-bold">
                            ›
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. SECRET SPICE STALL (Sequence Puzzle -> Ajitama Egg) */}
          {treasure.contentType === "spice" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-sand via-[#FFD166]/40 to-sand p-6 rounded-3xl border-2 border-sunset text-center shadow-lg">
                <Utensils className="w-10 h-10 text-coral mx-auto mb-2 animate-bounce-gentle" />
                <h3 className="font-heading font-bold text-lg text-reef mb-1">Master the 3-Step Spice Recipe 🌶️</h3>
                <p className="text-xs sm:text-sm text-reef/80 mb-4">
                  Tap the spices below in order: <span className="font-extrabold text-coral">Chili 🌶️ → Garlic 🧄 → Egg 🥚</span> to season the Ajitama!
                </p>

                {/* Sequence progress indicators */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  {["chili", "garlic", "egg"].map((step, idx) => {
                    const isDone = spiceSequence.length > idx && spiceSequence[idx] === step;
                    const isCurrent = spiceSequence.length === idx;
                    return (
                      <div
                        key={idx}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border-2 transition-all duration-300 ${
                          isDone
                            ? "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-md"
                            : isCurrent
                            ? "bg-white border-coral shadow-md animate-pulse"
                            : "bg-white/50 border-reef/20 text-reef/30"
                        }`}
                      >
                        {isDone ? (idx === 0 ? "🌶️" : idx === 1 ? "🧄" : "🥚") : idx + 1}
                      </div>
                    );
                  })}
                </div>

                {/* Spice Tap Buttons */}
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                  {[
                    { id: "chili", label: "Chili", icon: "🌶️" },
                    { id: "garlic", label: "Garlic", icon: "🧄" },
                    { id: "egg", label: "Egg", icon: "🥚" },
                  ].map((spice) => (
                    <button
                      key={spice.id}
                      onClick={() => handleSpiceTap(spice.id)}
                      className="p-3.5 bg-white hover:bg-pearl border-2 border-seafoam/80 hover:border-coral rounded-2xl shadow-md flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform">{spice.icon}</span>
                      <span className="font-heading font-bold text-xs text-reef">{spice.label}</span>
                    </button>
                  ))}
                </div>

                {/* Feedback Message */}
                {spiceFeedback && (
                  <div className={`mt-5 p-3.5 rounded-2xl font-heading font-semibold text-xs sm:text-sm animate-fadeIn shadow-inner ${
                    spiceSequence.length === 3
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      : "bg-amber-100 text-amber-900 border border-amber-300"
                  }`}>
                    {spiceFeedback}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. DANA'S HOUSE (Borrow Chashu) */}
          {treasure.contentType === "house" && (
            <div className="space-y-6">
              <div className="bg-[#FFFDF5] border-2 border-sunset rounded-3xl p-6 sm:p-8 shadow-inner relative font-body text-reef/90 space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-sand mx-auto flex items-center justify-center text-3xl shadow-md border border-sunset">
                  🏡
                </div>
                <h3 className="font-heading font-extrabold text-xl text-reef">Welcome to Your Cozy Beach House</h3>
                <div className="bg-white/80 p-4 rounded-2xl border border-sunset/40 text-sm sm:text-base font-medium italic text-reef/90 leading-relaxed">
                  &quot;{treasure.body}&quot;
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleBorrowChashu}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-coral via-sunset to-coral text-white font-heading font-bold text-sm sm:text-base shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto border border-white"
                  >
                    <span className="text-xl">🥩</span>
                    <span>{hasCollectedThisTurn ? "Chashu Borrowed from Fridge!" : "Borrow Chashu from Fridge"}</span>
                    <Sparkles className="w-4 h-4 text-white animate-sparkle" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. FORTUNE TENT (Starfish Oracle -> Narutomaki) */}
          {treasure.contentType === "fortune" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#2D1B4E] via-[#432C7A] to-[#1E1035] p-5 sm:p-7 rounded-3xl border-4 border-amber-400 text-amber-100 shadow-2xl relative overflow-hidden">
                {/* Mystical glow background */}
                <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
                
                <div className="text-center mb-6 relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/60 px-3 py-1 rounded-full text-xs font-heading font-extrabold text-amber-300 uppercase tracking-wider mb-2 shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                    <span>Birthday Prophecy 🔮</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white drop-shadow-md mb-2">
                    Dana&apos;s Once-in-12-Years Jupiter Return
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-200/90 max-w-lg mx-auto leading-relaxed">
                    With Leo as both your Moon and Rising sign, Jupiter enters Leo on June 30, 2026! Consult the crystal ball tabs below to read your complete age 26 astrological reading.
                  </p>
                </div>

                {!currentFortune ? (
                  <div className="text-center py-6 relative z-10">
                    <button
                      onClick={handleOracle}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-black font-heading font-extrabold text-base shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5 animate-spin-slow" />
                      <span>Reveal Complete Astrological Prophecy 🔮</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5 relative z-10 animate-fadeIn">
                    {/* Tabs Bar */}
                    {treasure.fortuneTabs && treasure.fortuneTabs.length > 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-2 pb-2 border-b border-amber-400/30">
                        {treasure.fortuneTabs.map((tab, idx) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              soundManager.playPop();
                              setActiveFortuneTab(idx);
                            }}
                            className={`px-3.5 py-2 rounded-xl font-heading font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                              activeFortuneTab === idx
                                ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-black shadow-lg scale-105 border border-white"
                                : "bg-black/40 text-amber-200 border border-amber-400/30 hover:bg-black/60 hover:text-white"
                            }`}
                          >
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Tab Content Box */}
                    {treasure.fortuneTabs && treasure.fortuneTabs[activeFortuneTab] ? (
                      <div className="bg-black/60 p-5 sm:p-6 rounded-2xl border-2 border-amber-400/50 shadow-inner space-y-3 text-left">
                        <div className="flex items-center gap-2 border-b border-amber-400/20 pb-2">
                          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />
                          <h4 className="font-heading font-extrabold text-base sm:text-lg text-amber-300">
                            {treasure.fortuneTabs[activeFortuneTab].title}
                          </h4>
                        </div>
                        <div className="text-amber-100/90 font-body text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                          {treasure.fortuneTabs[activeFortuneTab].content}
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 bg-black/60 rounded-2xl border-2 border-amber-400/50 text-amber-200 font-heading font-semibold text-sm sm:text-base shadow-inner leading-relaxed text-center">
                        &quot;{currentFortune}&quot;
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LAGOON CAFE OR OTHER LEGACY CONTENT FALLBACK */}
          {treasure.contentType === "cafe" && treasure.cafeMenu && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-seafoam shadow-md space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {treasure.cafeMenu.map((item, idx) => (
                    <div key={idx} onClick={handleCollectAction} className="p-3.5 rounded-2xl bg-sand/30 border border-sand/80 flex items-start gap-3 hover:bg-sand/50 transition-all cursor-pointer">
                      <span className="text-3xl flex-shrink-0">{item.icon || "🥥"}</span>
                      <div className="flex-1">
                        <h4 className="font-heading font-bold text-sm text-reef">{item.name}</h4>
                        <p className="text-xs text-reef/75 mt-0.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="bg-white/90 border-t border-seafoam/40 p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-heading font-bold text-reef/80">
            {hasCollectedThisTurn ? (
              <span className="flex items-center gap-1.5 text-seafoam-dark bg-seafoam/30 px-3 py-1 rounded-full text-reef">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Stop Complete! Ramen Ingredient Added</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-coral">
                <Sparkles className="w-4 h-4" />
                <span>Complete the activity above to get the ingredient!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {!hasCollectedThisTurn && (
              <button
                onClick={handleCollectAction}
                className="px-5 py-2 rounded-xl bg-coral text-white font-heading font-bold text-xs sm:text-sm shadow-md hover:bg-coral/90 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <MessageCircleHeart className="w-4 h-4" />
                <span>Claim Ingredient Now</span>
              </button>
            )}
            <button
              onClick={handleCloseModal}
              className="px-5 py-2 rounded-xl bg-reef text-white font-heading font-bold text-xs sm:text-sm shadow-md hover:bg-reef/90 transition-all cursor-pointer"
            >
              Back to Map 🍜
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
