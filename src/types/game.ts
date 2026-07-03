import { Treasure } from "@/data/treasures";

export interface NPC {
  id: string;
  name: string;
  title: string;
  sprite: string;
  portrait: string;
  x: number; // % from left on map
  y: number; // % from top on map
  initialMessage: string;
  repeatMessages: string[];
  proximityBubbles?: string[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Vector {
  dx: number;
  dy: number;
}

export type CharacterType = "explorer" | "turtle";
export type Direction = "up" | "down" | "left" | "right";

export interface PlayerState {
  x: number;
  y: number;
  direction: Direction;
  isMoving: boolean;
  speed: number;
  characterType: CharacterType;
}

export interface HiddenTreasure {
  id: string;
  title: string;
  photo: string;
  caption: string;
  x: number;
  y: number;
}

export interface ProximityTarget {
  treasure?: Treasure;
  npc?: NPC;
  hiddenTreasure?: HiddenTreasure;
  distance: number;
  isWithinRange: boolean;
  type: "treasure" | "npc" | "zengarden" | "hiddenTreasure";
}

export const GAME_CONSTANTS = {
  WORLD_WIDTH: 2000,
  WORLD_HEIGHT: 1400,
  INTERACTION_RADIUS: 160,
  PLAYER_SPEED: 7,
  CAMERA_SMOOTHING: 0.15,
};
