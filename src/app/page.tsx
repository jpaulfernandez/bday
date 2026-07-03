"use client";

import React, { useState } from "react";
import LandingScreen from "@/components/LandingScreen";
import IslandMap from "@/components/IslandMap";
import { resetIslandProgress } from "@/lib/storage";

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get("escape") === "true" ||
        params.get("unlock") === "all" ||
        params.get("skip") === "true" ||
        params.get("start") === "true"
      ) {
        timer = setTimeout(() => setHasStarted(true), 0);
      }
    }
    return () => clearTimeout(timer);
  }, []);

  const handleStartExploring = () => {
    setHasStarted(true);
  };

  const handleResetGame = () => {
    if (confirm("Would you like to reset island exploration progress and restart?")) {
      resetIslandProgress();
      window.location.href = window.location.pathname;
    }
  };

  const handleEscapeHatch = () => {
    if (confirm("Trigger Escape Hatch? This will unlock all required treasures and NPCs so you can open the Grand Festival Prize immediately!")) {
      window.location.href = "?unlock=all";
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center relative">
      {!hasStarted ? (
        <LandingScreen onStart={handleStartExploring} />
      ) : (
        <>
          <IslandMap />
          
          {/* Subtle testing & escape hatch controls in footer */}
          <div className="hidden sm:flex fixed bottom-2 right-2 z-30 gap-2 opacity-30 hover:opacity-100 transition-opacity">
            <button
              onClick={handleEscapeHatch}
              className="text-[10px] text-reef bg-white/80 px-2.5 py-1 rounded border border-seafoam cursor-pointer hover:bg-white font-semibold shadow-sm"
            >
              🚀 Escape Hatch (Unlock All)
            </button>
            <button
              onClick={handleResetGame}
              className="text-[10px] text-reef bg-white/80 px-2.5 py-1 rounded border border-seafoam cursor-pointer hover:bg-white shadow-sm"
            >
              Reset Progress
            </button>
          </div>
        </>
      )}
    </main>
  );
}
