import { type RiskLevel } from "../types";
import { type PlinkoHistoryItem } from "../types";

/**
 * Преобразует RiskLevel в формат для истории
 */
export const formatRiskForHistory = (risk: RiskLevel): PlinkoHistoryItem["risk"] => {
  switch (risk) {
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
    default:
      return "Medium";
  }
};

