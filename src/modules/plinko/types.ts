export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface PlinkoHistoryItem {
  id: string;
  timestamp: string; // ISO date
  bet: number;
  multiplier: number;
  payout: number;
  risk: "Low" | "Medium" | "High";
  lines: number;
}
