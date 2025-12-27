import { type RiskLevel } from "../types";
import { formatRiskForHistory } from "./riskFormatter";

/**
 * Пример функции для добавления результата игры в историю
 * 
 * Использование:
 * ```typescript
 * const { addHistoryItem } = usePlinkoHistory();
 * 
 * // После завершения игры:
 * const result = calculateGameResult(bet, risk, lines);
 * addHistoryItem({
 *   bet: result.bet,
 *   multiplier: result.multiplier,
 *   payout: result.payout,
 *   risk: formatRiskForHistory(risk),
 *   lines: lines,
 * });
 * ```
 */
export const createHistoryEntry = (
  bet: number,
  multiplier: number,
  risk: RiskLevel,
  lines: number
) => {
  const payout = bet * multiplier;
  
  return {
    bet,
    multiplier,
    payout,
    risk: formatRiskForHistory(risk),
    lines,
  };
};

