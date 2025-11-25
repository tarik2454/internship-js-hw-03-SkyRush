import { useGame } from "@/providers/GameProvider";
import styles from "./BettingControls.module.scss";
import { Minus, Plus } from "lucide-react";

export const BettingControls = () => {
  const {
    betAmount,
    setBetAmount,
    autoCashOut,
    setAutoCashOut,
    startGame,
    gameState,
  } = useGame();

  const adjustBet = (amount: number) => {
    setBetAmount(Math.max(1, betAmount + amount));
  };

  const isGameActive = gameState === "FLYING";

  return (
    <div className={styles.controls}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.active}`}>Manual</button>
        <button className={styles.tab}>Auto</button>
      </div>

      <div className={styles.controlGroup}>
        <label>Bet Amount</label>
        <div className={styles.inputWrapper}>
          <button onClick={() => adjustBet(-1)} disabled={isGameActive}>
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            disabled={isGameActive}
          />
          <button onClick={() => adjustBet(1)} disabled={isGameActive}>
            <Plus size={16} />
          </button>
        </div>
        <div className={styles.quickBets}>
          <button onClick={() => setBetAmount(10)} disabled={isGameActive}>
            10
          </button>
          <button onClick={() => setBetAmount(100)} disabled={isGameActive}>
            100
          </button>
          <button onClick={() => setBetAmount(500)} disabled={isGameActive}>
            500
          </button>
          <button onClick={() => setBetAmount(1000)} disabled={isGameActive}>
            1k
          </button>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label>Auto Cash Out</label>
        <div className={styles.inputWrapper}>
          <button
            onClick={() => setAutoCashOut(Math.max(1.01, autoCashOut - 0.1))}
            disabled={isGameActive}
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            step="0.01"
            value={autoCashOut.toFixed(2)}
            onChange={(e) => setAutoCashOut(Number(e.target.value))}
            disabled={isGameActive}
          />
          <button
            onClick={() => setAutoCashOut(autoCashOut + 0.1)}
            disabled={isGameActive}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        className={styles.placeBetBtn}
        onClick={startGame}
        disabled={isGameActive}
      >
        BET
      </button>
    </div>
  );
};
