const OPENED_TREASURES_KEY = "birthday-island:openedTreasures";
const SOUND_ENABLED_KEY = "birthday-island:soundEnabled";
const FINAL_CHEST_OPENED_KEY = "birthday-island:finalChestOpened";
const SPOKEN_NPCS_KEY = "birthday-island:spokenNpcs";
const HIDDEN_TREASURES_KEY = "birthday-island:foundHiddenTreasures";

export function loadFoundHiddenTreasureIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HIDDEN_TREASURES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load found hidden treasures:", e);
    return [];
  }
}

export function saveFoundHiddenTreasureIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HIDDEN_TREASURES_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error("Failed to save found hidden treasures:", e);
  }
}

export function loadOpenedTreasureIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(OPENED_TREASURES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load opened treasures:", e);
    return [];
  }
}

export function saveOpenedTreasureIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(OPENED_TREASURES_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error("Failed to save opened treasures:", e);
  }
}

export function loadSpokenNpcIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(SPOKEN_NPCS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load spoken NPCs:", e);
    return [];
  }
}

export function saveSpokenNpcIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SPOKEN_NPCS_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error("Failed to save spoken NPCs:", e);
  }
}

export function loadSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const data = localStorage.getItem(SOUND_ENABLED_KEY);
    return data ? JSON.parse(data) : false;
  } catch (e) {
    console.error("Failed to load sound enabled state:", e);
    return false;
  }
}

export function saveSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SOUND_ENABLED_KEY, JSON.stringify(enabled));
  } catch (e) {
    console.error("Failed to save sound enabled state:", e);
  }
}

export function loadFinalChestOpened(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const data = localStorage.getItem(FINAL_CHEST_OPENED_KEY);
    return data ? JSON.parse(data) : false;
  } catch (e) {
    console.error("Failed to load final chest state:", e);
    return false;
  }
}

export function saveFinalChestOpened(opened: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FINAL_CHEST_OPENED_KEY, JSON.stringify(opened));
  } catch (e) {
    console.error("Failed to save final chest state:", e);
  }
}

export function resetIslandProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(OPENED_TREASURES_KEY);
    localStorage.removeItem(FINAL_CHEST_OPENED_KEY);
    localStorage.removeItem(SPOKEN_NPCS_KEY);
    localStorage.removeItem(HIDDEN_TREASURES_KEY);
  } catch (e) {
    console.error("Failed to reset island progress:", e);
  }
}
