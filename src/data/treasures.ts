import festivalContent from "./festival_content.json";

export type TreasureContentType =
  | "memory"
  | "letter"
  | "compliment"
  | "joke"
  | "cafe"
  | "spice"
  | "house"
  | "fortune"
  | "final"
  | "chef";

export interface RamenIngredient {
  name: string;
  stop: string;
  themeTieIn: string;
  completionMessage: string;
  sourceEcho: string;
  icon: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  jokeRating?: string;
  date?: string;
}

export interface CafeMenuItem {
  name: string;
  description: string;
  price: string;
  icon?: string;
}

export type ComplimentItem = string | { sender?: string; subject?: string; content?: string; type?: string; videoUrl?: string };

export interface Treasure {
  id: string;
  title: string;
  mapLabel: string;
  contentType: TreasureContentType;
  icon: string;
  completedIcon?: string;
  x: number; // % from left on map
  y: number; // % from top on map
  requiredForFinalUnlock: boolean;
  locked?: boolean;
  introText?: string;
  body: string;
  image?: string;
  gallery?: GalleryItem[];
  compliments?: ComplimentItem[];
  fortunes?: string[];
  fortuneTabs?: { id: string; label: string; title: string; content: string }[];
  insideJokes?: { title: string; story: string; tag: string }[];
  cafeMenu?: CafeMenuItem[];
  playlistUrl?: string;
  completionText?: string;
  ingredient?: RamenIngredient;
}

export const treasures: Treasure[] = [
  {
    id: "lantern-lake",
    title: "Lantern Memories 🏮",
    mapLabel: "Lantern Memories",
    contentType: "memory",
    icon: "/assets/festival/icon-lantern.svg",
    x: 30,
    y: 24,
    requiredForFinalUnlock: true,
    introText:
      "Tap each lantern to reveal a special school memory together!",
    body: "Every memory adds flavor to life. Tap all lanterns to simmer the broth!",
    gallery: festivalContent.photos,
    completionText: festivalContent.ingredients.broth.completionMessage,
    ingredient: {
      ...festivalContent.ingredients.broth,
      icon: "/assets/festival/icon-broth.svg",
    },
  },
  {
    id: "blossom-garden",
    title: "Message Board 💌",
    mapLabel: "Message Board",
    contentType: "compliment",
    icon: "/assets/festival/icon-noodles.svg",
    x: 25,
    y: 80,
    requiredForFinalUnlock: true,
    introText:
      "The Message Board is filled with heartfelt birthday greeting cards from all your closest friends across the island!",
    body: "Tap each card to read a birthday greeting. Once all are read, the Noodles will be revealed!",
    compliments: (festivalContent as unknown as Record<string, ComplimentItem[]>).messageBoard || festivalContent.bloomBoard,
    completionText: festivalContent.ingredients.noodles.completionMessage,
    ingredient: {
      ...festivalContent.ingredients.noodles,
      icon: "/assets/festival/icon-noodles.svg",
    },
  },
  {
    id: "secret-spice-stall",
    title: "Compliment Board 💖",
    mapLabel: "Compliment Board",
    contentType: "compliment",
    icon: "/assets/festival/icon-ajitama.svg",
    x: 38,
    y: 40,
    requiredForFinalUnlock: true,
    introText: festivalContent.spiceRecipe.introText,
    body: festivalContent.spiceRecipe.hint,
    compliments: (festivalContent as unknown as Record<string, ComplimentItem[]>).complimentBoard || festivalContent.bloomBoard,
    completionText: festivalContent.ingredients.ajitama.completionMessage,
    ingredient: {
      ...festivalContent.ingredients.ajitama,
      icon: "/assets/festival/icon-ajitama.svg",
    },
  },
  {
    id: "danas-house",
    title: "Dana's House 🏡",
    mapLabel: "Dana's House",
    contentType: "house",
    icon: "/assets/festival/icon-mailbox.svg",
    x: 78,
    y: 52,
    requiredForFinalUnlock: true,
    introText: festivalContent.danasHouse.introText,
    body: festivalContent.danasHouse.jokeDialogue,
    completionText: festivalContent.ingredients.chashu.completionMessage,
    ingredient: {
      ...festivalContent.ingredients.chashu,
      icon: "/assets/festival/icon-chashu.svg",
    },
  },
  {
    id: "fortune-booth",
    title: "Fortune Tent ⭐",
    mapLabel: "Fortune Tent",
    contentType: "fortune",
    icon: "/assets/festival/icon-fortune.svg",
    x: 62,
    y: 80,
    requiredForFinalUnlock: true,
    introText: festivalContent.fortuneTent.introText,
    body: festivalContent.fortuneTent.fortuneText,
    fortuneTabs: festivalContent.fortuneTent.tabs,
    completionText: festivalContent.ingredients.narutomaki.completionMessage,
    ingredient: {
      ...festivalContent.ingredients.narutomaki,
      icon: "/assets/festival/icon-narutomaki.svg",
    },
  },
  {
    id: "festival-chef",
    title: "Festival Chef 👨‍🍳",
    mapLabel: "Festival Chef",
    contentType: "chef",
    icon: "/assets/festival/icon-chef.svg",
    completedIcon: "/assets/festival/icon-chef.svg",
    x: 52,
    y: 58,
    requiredForFinalUnlock: false,
    locked: true,
    introText: festivalContent.chef.openingDialogue,
    body: festivalContent.chef.completionDialogue,
    completionText: "THE SPECIAL BIRTHDAY RAMEN IS SERVED! HAPPY BIRTHDAY DANA! 🍜🎉",
  },
];
