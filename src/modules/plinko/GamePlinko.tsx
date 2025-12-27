import { useState } from "react";
import styles from "./GamePlinko.module.scss";
import { cx } from "../../utils/classNames";
import { type RiskLevel, RISK_ORDER, BALS, LINES } from "./data/date-plinko";
import { usePlinkoHistory } from "./hooks/usePlinkoHistory";
import { getMultiplierColor } from "./utils/multiplierColors";

export const GamePlinko = () => {
  const [risk, setRisk] = useState<RiskLevel>("MEDIUM");
  const { getRecentHistory } = usePlinkoHistory();
  const recentHistory = getRecentHistory(10);

  const changeRisk = (direction: -1 | 1) => {
    setRisk((current) => {
      const index = RISK_ORDER.indexOf(current);
      const nextIndex =
        (index + direction + RISK_ORDER.length) % RISK_ORDER.length;

      return RISK_ORDER[nextIndex];
    });
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.gamePlinko}>
      <div className={styles.gameInner}>
        <div className={styles.gameAreaWrapper}>
          <div className={styles.gameArea}></div>

          <div>
            <p className={styles.cardPlinkoTitle}>RECENT DROPS</p>
            <div className={styles.card}>
              <div className={styles.cardDropsList}>
                {recentHistory.length > 0 ? (
                  recentHistory.map((item) => {
                    const multiplierColor = getMultiplierColor(item.multiplier);
                    return (
                      <div key={item.id} className={styles.cardDropsItem}>
                        <div
                          className={styles.cardDropsMultiplier}
                          style={{ color: multiplierColor }}
                        >
                          {item.multiplier.toFixed(2)}x
                        </div>
                        <div className={styles.cardDropsInfo}>
                          <span className={styles.cardDropsPayout}>
                            ${item.payout.toFixed(2)}
                          </span>
                          <span className={styles.cardDropsTime}>
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.cardDropsEmpty}>
                    No recent drops yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h1 className={styles.cardPlinkoTitle}>PLINKO+</h1>
          <div className={styles.cardGroup}>
            <div className={styles.card}>
              <p className={styles.cardTitle}>RISK</p>

              <div className={styles.cardRisk}>
                <button
                  className={styles.cardRiskButton}
                  onClick={() => changeRisk(-1)}
                >
                  -
                </button>
                <span className={styles.cardRiskValue}>
                  {risk.toUpperCase()}
                </span>
                <button
                  className={styles.cardRiskButton}
                  onClick={() => changeRisk(1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTitle}>BALLS</p>
              <div className={styles.ballsGroup}>
                {BALS.map((ball) => (
                  <button key={ball.id} className={styles.ballBtn}>
                    <span className={styles.ballQuantity}>{ball.quantity}</span>
                    <span className={styles.ballCost}>${ball.cost}.00</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <p className={styles.cardTitle}>LINES</p>
              <div className={styles.linesGroup}>
                {LINES.map((line) => (
                  <button
                    key={line.id}
                    className={cx(styles.ballBtn, styles.lineBtn)}
                  >
                    <span className={styles.cardLinesValue}>{line.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className={styles.startBtn}>Drop 1 Ball ($2)</button>
          </div>
        </div>
      </div>
    </div>
  );
};
