import { GameRocket } from "../modules/rocket/GameRocket";
import { GameCases } from "../modules/cases/GameCases";
import { Mines } from "../modules/mines/Mines";

export const homeTabs = [
  {
    id: "rocket" as const,
    label: "🚀 Rocket",
    content: <GameRocket />,
  },
  {
    id: "cases" as const,
    label: "📦 Cases",
    content: <GameCases />,
  },
  {
    id: "mines" as const,
    label: "💣 Mines",
    content: <Mines />,
  },
];
