import { useGame } from "../providers/GameProvider";
import styles from "./GameCanvas.module.scss";

export const GameCanvas = () => {
  const {
    multiplier,
    cashOut,
    lastWin,
    betAmount,
    setBetAmount,
    startGame,
    gameState,
  } = useGame();

  const isGameActive = gameState === "FLYING";

  return (
    <section className={styles.canvasWrapper}>
      <div className={styles.gameArea}>
        <div className={styles.multiplierContainer}>
          <span
            className={`${styles.multiplier} ${
              gameState === "CRASHED" ? styles.crashed : ""
            } ${gameState === "CASHOUT" ? styles.success : ""}`}
          >
            {multiplier.toFixed(2)}x
          </span>
          {gameState === "CRASHED" && (
            <div className={styles.crashedText}>CRASHED</div>
          )}
          {gameState === "CASHOUT" && (
            <div className={styles.winText}>YOU WON ${lastWin.toFixed(2)}</div>
          )}
        </div>

        <div className={styles.rocket} data-state={gameState}>
          🚀
        </div>
      </div>

      <div className={styles.controls}>
        <p className={styles.label}>Bet Amount</p>
        <div className={styles.controlGroup}>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              disabled={isGameActive}
            />
          </div>

          <div>
            {gameState === "IDLE" ||
            gameState === "CRASHED" ||
            gameState === "CASHOUT" ? (
              <button onClick={startGame} className={styles.startBtn}>
                {gameState === "IDLE" ? "Start" : "Start Again"}
              </button>
            ) : (
              <button onClick={cashOut} className={styles.cashoutBtn}>
                Cash Out
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.quickBets}>
        <button onClick={() => setBetAmount(10)} disabled={isGameActive}>
          $10
        </button>
        <button onClick={() => setBetAmount(50)} disabled={isGameActive}>
          $50
        </button>
        <button onClick={() => setBetAmount(100)} disabled={isGameActive}>
          $100
        </button>
        <button onClick={() => setBetAmount(500)} disabled={isGameActive}>
          $500
        </button>
      </div>
    </section>
  );
};
