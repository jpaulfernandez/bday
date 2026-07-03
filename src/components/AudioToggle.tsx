"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { soundManager } from "@/lib/sound";
import { loadSoundEnabled, saveSoundEnabled } from "@/lib/storage";

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(loadSoundEnabled);

  useEffect(() => {
    soundManager.setEnabled(enabled);
  }, [enabled]);

  const toggleSound = () => {
    const nextState = !enabled;
    setEnabled(nextState);
    saveSoundEnabled(nextState);
    soundManager.setEnabled(nextState);
    if (nextState) {
      soundManager.playSparkle();
    }
  };

  return (
    <button
      onClick={toggleSound}
      aria-label={enabled ? "Mute island audio" : "Enable island audio"}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-pearl/90 backdrop-blur-md shadow-lg border border-seafoam/50 text-reef hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 font-heading text-sm font-semibold group"
    >
      {enabled ? (
        <>
          <Volume2 className="w-5 h-5 text-coral animate-bounce-gentle" />
          <span className="hidden sm:inline">Music & Audio: ON 🌊🎵</span>
        </>
      ) : (
        <>
          <VolumeX className="w-5 h-5 text-reef/60 group-hover:text-coral" />
          <span className="hidden sm:inline">Music & Audio: OFF</span>
        </>
      )}
    </button>
  );
}
