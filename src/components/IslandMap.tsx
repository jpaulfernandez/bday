"use client";

import React, { useState } from "react";
import Image from "next/image";
import { treasures, Treasure } from "@/data/treasures";
import { islandConfig } from "@/data/config";
import { GAME_CONSTANTS, NPC } from "@/types/game";
import { getRandomNpcPlacements } from "@/data/npcs";
import { loadOpenedTreasureIds, saveOpenedTreasureIds, saveFinalChestOpened, loadSpokenNpcIds, saveSpokenNpcIds, loadFoundHiddenTreasureIds, saveFoundHiddenTreasureIds } from "@/lib/storage";
import { useGameLoop } from "@/hooks/useGameLoop";
import { soundManager } from "@/lib/sound";
import hiddenTreasuresData from "@/data/hidden_treasures.json";
import { HiddenTreasure } from "@/types/game";
import AudioToggle from "./AudioToggle";
import ProgressBar from "./ProgressBar";
import TreasureHotspot from "./TreasureHotspot";
import TreasureModal from "./TreasureModal";
import ChefRamenModal from "./ChefRamenModal";
import NpcHotspot from "./NpcHotspot";
import NpcModal from "./NpcModal";
import VirtualJoystick from "./game/VirtualJoystick";
import ActionButton from "./game/ActionButton";
import PlayerCharacter from "./game/PlayerCharacter";
import ZenGardenTerrain from "./ZenGardenTerrain";
import NorthDockTerrain from "./NorthDockTerrain";
import SuntukanModal from "./SuntukanModal";
import HiddenTreasureHotspot from "./HiddenTreasureHotspot";
import HiddenTreasureModal from "./HiddenTreasureModal";

const hiddenTreasures = hiddenTreasuresData as HiddenTreasure[];

export default function IslandMap() {
  const [openedIds, setOpenedIds] = useState<string[]>(loadOpenedTreasureIds);
  const [activeTreasure, setActiveTreasure] = useState<Treasure | null>(null);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [spokenNpcIds, setSpokenNpcIds] = useState<string[]>([]);
  const [activeNpc, setActiveNpc] = useState<NPC | null>(null);
  const [lockedQuestTreasure, setLockedQuestTreasure] = useState<Treasure | null>(null);
  const [celebratingIngredient, setCelebratingIngredient] = useState<{ name: string; icon: string } | null>(null);
  const [activeSuntukan, setActiveSuntukan] = useState<boolean>(false);
  const [foundHiddenIds, setFoundHiddenIds] = useState<string[]>(loadFoundHiddenTreasureIds);
  const [activeHiddenTreasure, setActiveHiddenTreasure] = useState<HiddenTreasure | null>(null);
  const [newlyFoundHidden, setNewlyFoundHidden] = useState<boolean>(false);

  React.useEffect(() => {
    const placements = getRandomNpcPlacements();
    const timer = setTimeout(() => {
      setNpcs(placements);

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (
          params.get("escape") === "true" ||
          params.get("unlock") === "all" ||
          params.get("skip") === "true" ||
          params.get("start") === "true"
        ) {
          const allRequiredIds = treasures.filter((t) => t.requiredForFinalUnlock).map((t) => t.id);
          const allNpcIds = placements.map((n) => n.id);

          setOpenedIds(allRequiredIds);
          saveOpenedTreasureIds(allRequiredIds);

          setSpokenNpcIds([...allNpcIds, "festival-chef"]);
          saveSpokenNpcIds([...allNpcIds, "festival-chef"]);

          const allHiddenIds = hiddenTreasures.map((t) => t.id);
          setFoundHiddenIds(allHiddenIds);
          saveFoundHiddenTreasureIds(allHiddenIds);
        } else if (params.get("reset") === "true") {
          setOpenedIds([]);
          setSpokenNpcIds([]);
          setFoundHiddenIds([]);
        } else {
          setSpokenNpcIds(loadSpokenNpcIds());
          setFoundHiddenIds(loadFoundHiddenTreasureIds());
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Check if Dana has talked to the Festival Chef yet
  const hasSpokenToChef = spokenNpcIds.includes("festival-chef") || openedIds.includes("festival-chef") || openedIds.includes("final-chest");

  // Calculate unlock progress
  const requiredTreasures = treasures.filter((t) => t.requiredForFinalUnlock);
  const collectedRequiredCount = requiredTreasures.filter((t) => openedIds.includes(t.id)).length;
  const isFinalChefUnlocked = collectedRequiredCount >= requiredTreasures.length;

  const isGameEnded = openedIds.includes("festival-chef") || openedIds.includes("final-chest") || (typeof window !== "undefined" && (window.location.search.includes("zengarden=true") || window.location.search.includes("escape=true") || window.location.search.includes("unlock=all") || window.location.search.includes("start=true") || window.location.search.includes("skip=true")));

  const handleOpenTreasure = (treasure: Treasure) => {
    if (treasure.contentType === "chef" || treasure.contentType === "final") {
      if (!spokenNpcIds.includes("festival-chef")) {
        const next = [...spokenNpcIds, "festival-chef"];
        setSpokenNpcIds(next);
        saveSpokenNpcIds(next);
      }
    } else if (!hasSpokenToChef) {
      // Quest is locked! Show alert modal!
      soundManager.playSparkle();
      setLockedQuestTreasure(treasure);
      return;
    }
    setActiveTreasure(treasure);
  };

  const handleOpenNpc = (npc: NPC) => {
    setActiveNpc(npc);
  };

  const handleCloseModal = (collectedIng?: { name: string; icon: string }) => {
    setActiveTreasure(null);
    if (collectedIng && typeof collectedIng?.name === "string") {
      setCelebratingIngredient(collectedIng);
      soundManager.playVictory();
    }
  };

  const handleCloseNpcModal = (npcId: string) => {
    if (!spokenNpcIds.includes(npcId)) {
      const next = [...spokenNpcIds, npcId];
      setSpokenNpcIds(next);
      saveSpokenNpcIds(next);
    }
    setActiveNpc(null);
  };

  const handleCollectTreasure = (treasureId: string) => {
    if (!openedIds.includes(treasureId)) {
      const updated = [...openedIds, treasureId];
      setOpenedIds(updated);
      saveOpenedTreasureIds(updated);
    }
  };

  const handleCompleteQuest = () => {
    if (!openedIds.includes("festival-chef")) {
      const updated = [...openedIds, "festival-chef"];
      setOpenedIds(updated);
      saveOpenedTreasureIds(updated);
    }
    saveFinalChestOpened(true);
  };

  const handleOpenHiddenTreasure = (treasure: HiddenTreasure) => {
    const isAlreadyFound = foundHiddenIds.includes(treasure.id);
    if (!isAlreadyFound) {
      const next = [...foundHiddenIds, treasure.id];
      setFoundHiddenIds(next);
      saveFoundHiddenTreasureIds(next);
      setNewlyFoundHidden(true);
    } else {
      setNewlyFoundHidden(false);
    }
    setActiveHiddenTreasure(treasure);
  };

  // Initialize 60 FPS Game Engine Hook
  const {
    player,
    camera,
    closestTarget,
    setJoystickVector,
    setTapTarget,
    toggleCharacterType,
  } = useGameLoop({
    onInteract: handleOpenTreasure,
    onInteractNpc: handleOpenNpc,
    onInteractZenGarden: () => setActiveSuntukan(true),
    onInteractHiddenTreasure: handleOpenHiddenTreasure,
    npcs,
    hiddenTreasures,
    isModalOpen: !!activeTreasure || !!activeNpc || !!lockedQuestTreasure || activeSuntukan || !!activeHiddenTreasure,
    zenGardenActive: isGameEnded,
    isGameEnded,
  });

  // Clear celebration when Dana moves around
  React.useEffect(() => {
    if (player.isMoving && celebratingIngredient) {
      const timer = setTimeout(() => setCelebratingIngredient(null), 0);
      return () => clearTimeout(timer);
    }
  }, [player.isMoving, celebratingIngredient]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-ocean select-none">
      {/* Top HUD Controls */}
      <AudioToggle />
      <ProgressBar
        collectedCount={collectedRequiredCount}
        totalCount={requiredTreasures.length}
        openedIds={openedIds}
        hiddenFoundCount={foundHiddenIds.length}
        hiddenTotalCount={hiddenTreasures.length}
      />

      {/* Floating Notification for Zen Garden Easter Egg */}
      {isGameEnded && !activeSuntukan && !activeTreasure && !activeNpc && !lockedQuestTreasure && (
        <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-40 animate-bounce pointer-events-auto">
          <button
            onClick={() => setActiveSuntukan(true)}
            className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white font-heading font-extrabold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-2xl border-2 border-white flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <span>✨ EASTER EGG UNLOCKED:</span>
            <span className="underline">Suntukan sa Zen Garden 🥊</span>
            <span>(Click or head left!)</span>
          </button>
        </div>
      )}

      {/* Mobile Touch & Proximity Controls */}
      {!activeTreasure && !activeNpc && !lockedQuestTreasure && !activeSuntukan && (
        <>
          <VirtualJoystick onMove={setJoystickVector} />
          <ActionButton
            target={closestTarget}
            characterType={player.characterType}
            onInteract={() => {
              if (closestTarget?.type === "treasure" && closestTarget.treasure) {
                handleOpenTreasure(closestTarget.treasure);
              } else if (closestTarget?.type === "npc" && closestTarget.npc) {
                handleOpenNpc(closestTarget.npc);
              } else if (closestTarget?.type === "zengarden") {
                setActiveSuntukan(true);
              }
            }}
            onToggleCharacter={toggleCharacterType}
          />
        </>
      )}

      {/* Viewport Camera Panning Window */}
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
        
        {/* World Map Canvas (2000px x 1400px) */}
        <div
          onClick={(e) => {
            if (activeTreasure || activeNpc || lockedQuestTreasure) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const tapX = e.clientX - rect.left;
            const tapY = e.clientY - rect.top;
            setTapTarget({ x: tapX, y: tapY });
          }}
          style={{
            width: `${GAME_CONSTANTS.WORLD_WIDTH}px`,
            height: `${GAME_CONSTANTS.WORLD_HEIGHT}px`,
            transform: `translate3d(-${camera.x}px, -${camera.y}px, 0)`,
          }}
          className="absolute top-0 left-0 origin-top-left shadow-2xl cursor-crosshair"
        >
          {/* Background SVG Map — hand-drawn festival island */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Image
              src="/assets/festival/island-map.svg"
              alt={`${islandConfig.friendName}'s Ramen Festival Island`}
              fill
              sizes="2000px"
              className="object-cover object-center pointer-events-none"
              priority
              unoptimized
            />
          </div>

          {/* Drifting festival ramen steam & toppings overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <span className="absolute left-[20%] top-[30%] text-lg animate-float opacity-70">🍥</span>
            <span className="absolute left-[55%] top-[15%] text-sm animate-float-slow opacity-60" style={{ animationDelay: "1s" }}>✨</span>
            <span className="absolute left-[70%] top-[65%] text-lg animate-float opacity-60" style={{ animationDelay: "2s" }}>🍜</span>
            <span className="absolute left-[38%] top-[70%] text-sm animate-float-slow opacity-70" style={{ animationDelay: "0.5s" }}>🍥</span>
            <span className="absolute left-[85%] top-[25%] text-base animate-float opacity-50" style={{ animationDelay: "1.5s" }}>🏮</span>
          </div>

          {/* Clickable / Proximity Treasure Hotspots */}
          {treasures.map((treasure) => {
            const isCollected = openedIds.includes(treasure.id);
            const isFinal = treasure.contentType === "final" || treasure.contentType === "chef";
            
            return (
              <TreasureHotspot
                key={treasure.id}
                treasure={treasure}
                isCollected={isCollected}
                isUnlocked={isFinal ? isFinalChefUnlocked : true}
                isQuestLocked={!isFinal && !hasSpokenToChef}
                hasSpokenToChef={hasSpokenToChef}
                onClick={handleOpenTreasure}
              />
            );
          })}

          {/* North Harbor Dock & Submerged Car (Easter Egg after completing quest) */}
          {isGameEnded && <NorthDockTerrain />}

          {/* Clickable / Proximity Friend NPC Hotspots */}
          {npcs.map((npc) => {
            if (npc.id === "angry-daens" && !isGameEnded) return null;
            const isWithinRange =
              closestTarget?.type === "npc" &&
              closestTarget?.npc?.id === npc.id &&
              closestTarget.isWithinRange;
            return (
              <NpcHotspot
                key={npc.id}
                npc={npc}
                hasSpoken={spokenNpcIds.includes(npc.id)}
                isWithinRange={isWithinRange}
                onClick={handleOpenNpc}
              />
            );
          })}

          {/* New Easter Egg: Sunken Brutalist Zen Garden in left side waters! */}
          {isGameEnded && (
            <ZenGardenTerrain
              onOpenSuntukan={() => setActiveSuntukan(true)}
              isNear={closestTarget?.type === "zengarden" && closestTarget.isWithinRange}
            />
          )}

          {/* Hidden Star Treasures scattered around the island */}
          {hiddenTreasures.map((ht) => {
            const isWithinRange =
              closestTarget?.type === "hiddenTreasure" &&
              closestTarget?.hiddenTreasure?.id === ht.id &&
              closestTarget.isWithinRange;
            return (
              <HiddenTreasureHotspot
                key={ht.id}
                treasure={ht}
                isFound={foundHiddenIds.includes(ht.id)}
                isWithinRange={isWithinRange}
                onClick={handleOpenHiddenTreasure}
              />
            );
          })}

          {/* Playable Character Sprite */}
          <PlayerCharacter
            player={player}
            closestTarget={closestTarget}
            celebratingIngredient={celebratingIngredient}
            onInteract={() => {
              if (closestTarget?.type === "treasure" && closestTarget.treasure) {
                handleOpenTreasure(closestTarget.treasure);
              } else if (closestTarget?.type === "npc" && closestTarget.npc) {
                handleOpenNpc(closestTarget.npc);
              } else if (closestTarget?.type === "zengarden") {
                setActiveSuntukan(true);
              } else if (closestTarget?.type === "hiddenTreasure" && closestTarget.hiddenTreasure) {
                handleOpenHiddenTreasure(closestTarget.hiddenTreasure);
              }
            }}
          />

          {/* Map Title Watermark */}
          <div className="absolute bottom-6 right-8 pointer-events-none text-right opacity-70">
            <p className="font-heading font-extrabold text-white text-3xl drop-shadow-lg">
              {islandConfig.appTitle}
            </p>
            <p className="text-sm text-white font-semibold drop-shadow-md">
              Use the joystick or tap anywhere to walk 🍜
            </p>
          </div>
        </div>
      </div>

      {/* Modals with Native Mobile Bottom-Sheet upgrades */}
      {activeTreasure && activeTreasure.contentType !== "final" && activeTreasure.contentType !== "chef" && (
        <TreasureModal
          treasure={activeTreasure}
          isCollected={openedIds.includes(activeTreasure.id)}
          onClose={handleCloseModal}
          onCollect={handleCollectTreasure}
        />
      )}

      {activeTreasure && (activeTreasure.contentType === "final" || activeTreasure.contentType === "chef") && (
        <ChefRamenModal
          treasure={activeTreasure}
          collectedCount={collectedRequiredCount}
          totalCount={requiredTreasures.length}
          openedIds={openedIds}
          onClose={() => handleCloseModal()}
          onCompleteQuest={handleCompleteQuest}
        />
      )}

      {/* Friend NPC Coral Island Birthday Dialogue Modal */}
      <NpcModal
        npc={activeNpc}
        hasSpoken={activeNpc ? spokenNpcIds.includes(activeNpc.id) : false}
        onClose={handleCloseNpcModal}
      />

      {/* Quest Locked Alert Modal when Dana hasn't spoken to Chef yet */}
      {lockedQuestTreasure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-reef/70 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-pearl border-4 border-white rounded-3xl p-6 text-center shadow-2xl space-y-4 animate-scale-up text-reef">
            <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-3xl shadow-md border-2 border-coral animate-bounce-gentle">
              🔒
            </div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-reef">Ramen Quest Locked! 🍜</h3>
            <p className="text-sm sm:text-base font-medium text-reef/80 leading-relaxed">
              Talk to the <span className="font-bold text-coral">Festival Chef</span> in the center of the island first before collecting ramen ingredients at <span className="font-bold">{lockedQuestTreasure.mapLabel}</span>!
            </p>
            <button
              onClick={() => setLockedQuestTreasure(null)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-coral to-sunset text-white font-heading font-bold text-base shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Go Find the Ramen Chef 👨‍🍳✨
            </button>
          </div>
        </div>
      )}

      {/* New Mode: Suntukan sa Zen Garden Fighting Arena Modal */}
      {activeSuntukan && (
        <SuntukanModal onClose={() => setActiveSuntukan(false)} />
      )}

      {/* Hidden Star Treasure Modal */}
      {activeHiddenTreasure && (
        <HiddenTreasureModal
          treasure={activeHiddenTreasure}
          foundCount={foundHiddenIds.length}
          totalCount={hiddenTreasures.length}
          isNewlyFound={newlyFoundHidden}
          onClose={() => setActiveHiddenTreasure(null)}
        />
      )}
    </div>
  );
}
