"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PlayerState, Vector, Position, ProximityTarget, GAME_CONSTANTS, NPC, HiddenTreasure } from "@/types/game";
import { treasures, Treasure } from "@/data/treasures";

// Walkable deck shapes from island-map.svg (#deckShapes)
const WALKABLE_RECTS = [
  { x: 520, y: 300, w: 180, h: 340 }, // Lantern Lake launch dock
  { x: 600, y: 440, w: 340, h: 260 }, // Matcha stall area
  { x: 1180, y: 700, w: 260, h: 110 }, // Stage to house bridge
  { x: 1360, y: 620, w: 420, h: 320 }, // Stilt beach house dock
  { x: 1080, y: 1010, w: 340, h: 240 }, // Fortune shrine dock
  { x: 300, y: 1000, w: 400, h: 250 }, // Noodle grove dock
  // New Zen Garden easter egg walkable areas on left side waters!
  { x: 70, y: 530, w: 380, h: 360 }, // Zen Garden courtyard
  { x: 330, y: 620, w: 240, h: 160 }, // Boardwalk bridge connecting Noodle Grove/Central dock to Zen Garden
  // North Harbor dock extending to submerged white car
  { x: 930, y: 100, w: 140, h: 490 },
];

const WALKABLE_CIRCLES = [
  { cx: 1040, cy: 830, r: 250 }, // Central festival stage & ramen plaza
  { cx: 700, cy: 660, r: 190 }, // Matcha stall circle
  { cx: 1450, cy: 750, r: 230 }, // Beach house stilt circle
  { cx: 1200, cy: 1100, r: 200 }, // Fortune telling shrine circle
  { cx: 480, cy: 1100, r: 200 }, // Noodle grove circle
];

const WALKABLE_POLYGONS = [
  // Lantern Lake Shore & Launch Dock Polygon
  [
    { x: 400, y: 380 },
    { x: 750, y: 380 },
    { x: 820, y: 520 },
    { x: 750, y: 680 },
    { x: 620, y: 700 },
    { x: 460, y: 640 },
    { x: 380, y: 500 },
  ],
  // Boardwalk deck polygon connecting Central Stage to Noodle Grove / Message Board
  [
    { x: 840, y: 960 },
    { x: 950, y: 1060 },
    { x: 760, y: 1180 },
    { x: 630, y: 1080 },
  ],
];

function isPointInPolygon(px: number, py: number, polygon: { x: number; y: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const { x: xi, y: yi } = polygon[i];
    const { x: xj, y: yj } = polygon[j];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function isWalkable(x: number, y: number, isGameEnded = true): boolean {
  for (const rect of WALKABLE_RECTS) {
    if (!isGameEnded) {
      if (rect.x === 70 && rect.y === 530) continue;
      if (rect.x === 330 && rect.y === 620) continue;
      if (rect.x === 930 && rect.y === 100) continue;
    }
    if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
      return true;
    }
  }
  for (const circle of WALKABLE_CIRCLES) {
    if ((x - circle.cx) ** 2 + (y - circle.cy) ** 2 <= circle.r ** 2) {
      return true;
    }
  }
  for (const poly of WALKABLE_POLYGONS) {
    if (isPointInPolygon(x, y, poly)) {
      return true;
    }
  }
  return false;
}

interface UseGameLoopProps {
  onInteract?: (treasure: Treasure) => void;
  onInteractNpc?: (npc: NPC) => void;
  onInteractZenGarden?: () => void;
  onInteractHiddenTreasure?: (treasure: HiddenTreasure) => void;
  npcs?: NPC[];
  hiddenTreasures?: HiddenTreasure[];
  isModalOpen: boolean;
  zenGardenActive?: boolean;
  isGameEnded?: boolean;
}

export function useGameLoop({ onInteract, onInteractNpc, onInteractZenGarden, onInteractHiddenTreasure, npcs = [], hiddenTreasures = [], isModalOpen, zenGardenActive = false, isGameEnded = false }: UseGameLoopProps) {
  const [player, setPlayer] = useState<PlayerState>({
    x: 1000, // Center of 2000x1400 world
    y: 1000,
    direction: "down",
    isMoving: false,
    speed: GAME_CONSTANTS.PLAYER_SPEED,
    characterType: "explorer",
  });

  const [camera, setCamera] = useState<Position>({ x: 0, y: 0 });
  const [closestTarget, setClosestTarget] = useState<ProximityTarget | null>(null);

  // Use refs for 60 FPS calculations without re-render delays
  const playerRef = useRef<PlayerState>(player);
  const joystickRef = useRef<Vector>({ dx: 0, dy: 0 });
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const tapTargetRef = useRef<Position | null>(null);
  const isModalOpenRef = useRef(isModalOpen);
  const onInteractRef = useRef(onInteract);
  const onInteractNpcRef = useRef(onInteractNpc);
  const onInteractZenGardenRef = useRef(onInteractZenGarden);
  const onInteractHiddenTreasureRef = useRef(onInteractHiddenTreasure);
  const npcsRef = useRef(npcs);
  const hiddenTreasuresRef = useRef(hiddenTreasures);
  const zenGardenActiveRef = useRef(zenGardenActive);
  const isGameEndedRef = useRef(isGameEnded);

  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
    if (isModalOpen) {
      joystickRef.current = { dx: 0, dy: 0 };
      tapTargetRef.current = null;
      keysRef.current = {};
    }
  }, [isModalOpen]);

  useEffect(() => {
    onInteractRef.current = onInteract;
    onInteractNpcRef.current = onInteractNpc;
    onInteractZenGardenRef.current = onInteractZenGarden;
    onInteractHiddenTreasureRef.current = onInteractHiddenTreasure;
    npcsRef.current = npcs;
    hiddenTreasuresRef.current = hiddenTreasures;
    zenGardenActiveRef.current = zenGardenActive;
    isGameEndedRef.current = isGameEnded;
  }, [onInteract, onInteractNpc, onInteractZenGarden, onInteractHiddenTreasure, npcs, hiddenTreasures, zenGardenActive, isGameEnded]);

  // Set joystick vector from touch control
  const setJoystickVector = useCallback((vec: Vector) => {
    if (isModalOpenRef.current) return;
    joystickRef.current = vec;
    if (vec.dx !== 0 || vec.dy !== 0) {
      tapTargetRef.current = null; // Cancel tap-to-walk if joystick is used
    }
  }, []);

  // Set target position for Tap-to-Walk
  const setTapTarget = useCallback((pos: Position) => {
    if (isModalOpenRef.current) return;
    tapTargetRef.current = pos;
  }, []);

  // Toggle between explorer and turtle character
  const toggleCharacterType = useCallback(() => {
    setPlayer((prev) => {
      const nextType = prev.characterType === "explorer" ? "turtle" : "explorer";
      playerRef.current.characterType = nextType;
      return { ...prev, characterType: nextType };
    });
  }, []);

  // Handle keyboard events (WASD / Arrows / Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpenRef.current) return;
      keysRef.current[e.key.toLowerCase()] = true;
      tapTargetRef.current = null;

      // Space or Enter triggers interaction
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (closestTarget?.isWithinRange) {
          if (closestTarget.type === "treasure" && closestTarget.treasure && onInteractRef.current) {
            onInteractRef.current(closestTarget.treasure);
          } else if (closestTarget.type === "npc" && closestTarget.npc && onInteractNpcRef.current) {
            onInteractNpcRef.current(closestTarget.npc);
          } else if (closestTarget.type === "zengarden" && onInteractZenGardenRef.current) {
            onInteractZenGardenRef.current();
          } else if (closestTarget.type === "hiddenTreasure" && closestTarget.hiddenTreasure && onInteractHiddenTreasureRef.current) {
            onInteractHiddenTreasureRef.current(closestTarget.hiddenTreasure);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [closestTarget]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastUiUpdateTime = 0;

    const loop = (timestamp: number) => {
      if (!isModalOpenRef.current) {
        let dx = joystickRef.current.dx;
        let dy = joystickRef.current.dy;

        // Add keyboard input
        if (keysRef.current["w"] || keysRef.current["arrowup"]) dy -= 1;
        if (keysRef.current["s"] || keysRef.current["arrowdown"]) dy += 1;
        if (keysRef.current["a"] || keysRef.current["arrowleft"]) dx -= 1;
        if (keysRef.current["d"] || keysRef.current["arrowright"]) dx += 1;

        // If tap-to-walk is active, calculate vector to target
        if (tapTargetRef.current) {
          const distX = tapTargetRef.current.x - playerRef.current.x;
          const distY = tapTargetRef.current.y - playerRef.current.y;
          const dist = Math.hypot(distX, distY);

          if (dist > 15) {
            dx = distX / dist;
            dy = distY / dist;
          } else {
            tapTargetRef.current = null; // Reached target
          }
        }

        // Normalize diagonal speed
        const length = Math.hypot(dx, dy);
        if (length > 1) {
          dx /= length;
          dy /= length;
        }

        const isMoving = length > 0.05;
        let newX = playerRef.current.x;
        let newY = playerRef.current.y;
        let direction = playerRef.current.direction;

        if (isMoving) {
          let targetX = playerRef.current.x + dx * GAME_CONSTANTS.PLAYER_SPEED;
          let targetY = playerRef.current.y + dy * GAME_CONSTANTS.PLAYER_SPEED;

          // Clamp to world borders
          targetX = Math.max(80, Math.min(GAME_CONSTANTS.WORLD_WIDTH - 80, targetX));
          targetY = Math.max(80, Math.min(GAME_CONSTANTS.WORLD_HEIGHT - 80, targetY));

          // Prevent moving into the water with smooth wall sliding
          const currentlyWalkable = isWalkable(playerRef.current.x, playerRef.current.y, isGameEndedRef.current);
          if (!currentlyWalkable || isWalkable(targetX, targetY, isGameEndedRef.current)) {
            newX = targetX;
            newY = targetY;
          } else if (isWalkable(targetX, playerRef.current.y, isGameEndedRef.current)) {
            newX = targetX;
          } else if (isWalkable(playerRef.current.x, targetY, isGameEndedRef.current)) {
            newY = targetY;
          } else {
            // Stopped by water boundary; if tap-to-walk was active, cancel target
            if (tapTargetRef.current) {
              tapTargetRef.current = null;
            }
          }

          // Determine direction based on actual movement or attempted direction
          if (newX !== playerRef.current.x || newY !== playerRef.current.y) {
            if (Math.abs(newX - playerRef.current.x) > Math.abs(newY - playerRef.current.y)) {
              direction = newX > playerRef.current.x ? "right" : "left";
            } else {
              direction = newY > playerRef.current.y ? "down" : "up";
            }
          } else if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? "right" : "left";
          } else {
            direction = dy > 0 ? "down" : "up";
          }
        }

        playerRef.current = {
          ...playerRef.current,
          x: newX,
          y: newY,
          direction,
          isMoving,
        };

        // Calculate Proximity to Treasures and NPCs
        let minDistance = Infinity;
        let nearestTreasure: Treasure | null = null;
        let nearestNpc: NPC | null = null;
        let nearestHiddenTreasure: HiddenTreasure | null = null;
        let nearestType: "treasure" | "npc" | "zengarden" | "hiddenTreasure" = "treasure";

        for (const t of treasures) {
          // Map percentage coordinates (x, y) to world pixel coordinates
          const worldX = (t.x / 100) * GAME_CONSTANTS.WORLD_WIDTH;
          const worldY = (t.y / 100) * GAME_CONSTANTS.WORLD_HEIGHT;
          const dist = Math.hypot(worldX - newX, worldY - newY);
          if (dist < minDistance) {
            minDistance = dist;
            nearestTreasure = t;
            nearestNpc = null;
            nearestHiddenTreasure = null;
            nearestType = "treasure";
          }
        }

        for (const n of npcsRef.current) {
          const worldX = (n.x / 100) * GAME_CONSTANTS.WORLD_WIDTH;
          const worldY = (n.y / 100) * GAME_CONSTANTS.WORLD_HEIGHT;
          const dist = Math.hypot(worldX - newX, worldY - newY);
          if (dist < minDistance) {
            minDistance = dist;
            nearestTreasure = null;
            nearestNpc = n;
            nearestHiddenTreasure = null;
            nearestType = "npc";
          }
        }

        for (const ht of hiddenTreasuresRef.current) {
          const worldX = (ht.x / 100) * GAME_CONSTANTS.WORLD_WIDTH;
          const worldY = (ht.y / 100) * GAME_CONSTANTS.WORLD_HEIGHT;
          const dist = Math.hypot(worldX - newX, worldY - newY);
          if (dist < minDistance) {
            minDistance = dist;
            nearestTreasure = null;
            nearestNpc = null;
            nearestHiddenTreasure = ht;
            nearestType = "hiddenTreasure";
          }
        }

        if (zenGardenActiveRef.current) {
          // Zen Garden center in world pixels is around (260, 710)
          const dist = Math.hypot(260 - newX, 710 - newY);
          if (dist < minDistance) {
            minDistance = dist;
            nearestTreasure = null;
            nearestNpc = null;
            nearestHiddenTreasure = null;
            nearestType = "zengarden";
          }
        }

        const currentProximity: ProximityTarget | null = (nearestTreasure || nearestNpc || nearestHiddenTreasure || nearestType === "zengarden") ? {
          treasure: nearestTreasure || undefined,
          npc: nearestNpc || undefined,
          hiddenTreasure: nearestHiddenTreasure || undefined,
          distance: minDistance,
          isWithinRange: minDistance <= (nearestType === "zengarden" ? GAME_CONSTANTS.INTERACTION_RADIUS + 40 : GAME_CONSTANTS.INTERACTION_RADIUS),
          type: nearestType,
        } : null;

        // Throttle UI React state updates to ~30 FPS to prevent render overhead while keeping physics at 60 FPS
        if (timestamp - lastUiUpdateTime > 30 || !isMoving) {
          lastUiUpdateTime = timestamp;
          setPlayer({ ...playerRef.current });

          // Calculate Camera Position centered on player
          const vw = typeof window !== "undefined" ? window.innerWidth : 1000;
          const vh = typeof window !== "undefined" ? window.innerHeight : 700;

          let targetCamX = newX - vw / 2;
          let targetCamY = newY - vh / 2;

          // Clamp camera to world edges
          targetCamX = Math.max(0, Math.min(GAME_CONSTANTS.WORLD_WIDTH - vw, targetCamX));
          targetCamY = Math.max(0, Math.min(GAME_CONSTANTS.WORLD_HEIGHT - vh, targetCamY));

          setCamera({ x: targetCamX, y: targetCamY });
          setClosestTarget(currentProximity);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return {
    player,
    camera,
    closestTarget,
    setJoystickVector,
    setTapTarget,
    toggleCharacterType,
  };
}
