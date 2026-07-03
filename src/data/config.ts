import festivalContent from "./festival_content.json";

export interface IslandConfig {
  friendName: string;
  appTitle: string;
  landingSubtitle: string;
  guideName: string;
  guideTitle: string;
  guideWelcomeMessage: string;
  guideCompletionMessage: string;
  loadingMessages: string[];
}

export const islandConfig: IslandConfig = {
  // 🎈 Loaded from festival_content.json so you can edit easily!
  friendName: festivalContent.friendName,

  appTitle: festivalContent.appTitle,

  landingSubtitle: festivalContent.landingSubtitle,

  guideName: festivalContent.guide.name,
  guideTitle: festivalContent.guide.title,

  guideWelcomeMessage: festivalContent.guide.welcomeMessage,

  guideCompletionMessage: festivalContent.guide.completionMessage,

  loadingMessages: [
    "Simmering a fresh pot of rich sabaw...",
    "Rolling out homemade noodles...",
    "Marinating the special soy egg...",
    "Slicing chashu pork from the fridge...",
    "Stringing up the festival bunting...",
    "Lighting the paper lanterns...",
    "Scattering narutomaki toppings across the lake...",
  ],
};

