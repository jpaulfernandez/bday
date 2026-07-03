import { NPC } from "@/types/game";
import festivalContent from "./festival_content.json";

export const NPC_DEFINITIONS: Omit<NPC, "x" | "y">[] = festivalContent.npcs;


// Curated safe walkable wooden deck coordinates (% of map width/height)
export const DECK_POSITIONS = [
  { x: 29, y: 38, label: "Lantern Lake Lower Dock" },
  { x: 44, y: 46, label: "Matcha Stall East Deck" },
  { x: 33, y: 47, label: "Matcha Stall West Deck" },
  { x: 65, y: 54, label: "Central Bridge Deck" },
  { x: 73, y: 61, label: "Beach House South Dock" },
  { x: 84, y: 59, label: "Beach House East Dock" },
  { x: 68, y: 85, label: "Fortune Shrine East Deck" },
  { x: 57, y: 83, label: "Fortune Shrine West Deck" },
  { x: 19, y: 84, label: "Noodle Grove West Dock" },
  { x: 32, y: 85, label: "Noodle Grove East Dock" },
];

/**
 * shuffles available deck positions and returns 4 randomized NPCs placed along the deck.
 */
export function getRandomNpcPlacements(): NPC[] {
  const shuffledPositions = [...DECK_POSITIONS].sort(() => 0.5 - Math.random());
  let deckIndex = 0;
  return NPC_DEFINITIONS.map((def) => {
    if (def.id === "angry-daens") {
      return {
        ...def,
        x: 50,
        y: 14,
      };
    }
    const pos = shuffledPositions[deckIndex % shuffledPositions.length];
    deckIndex++;
    return {
      ...def,
      x: pos.x,
      y: pos.y,
    };
  });
}
