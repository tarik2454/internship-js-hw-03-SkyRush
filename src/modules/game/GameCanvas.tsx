import { useGame } from "@/providers/GameProvider";
import styles from "./GameCanvas.module.scss";

export const GameCanvas = () => {
  const { multiplier, gameState, startGame, cashOut, lastWin } = useGame();

  return (
    <div className={styles.canvasContainer}>
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

      {gameState === "IDLE" ||
      gameState === "CRASHED" ||
      gameState === "CASHOUT" ? (
        <button onClick={startGame} className={styles.startBtn}>
          {gameState === "IDLE" ? "Start Game" : "Play Again"}
        </button>
      ) : (
        <button onClick={cashOut} className={styles.cashoutBtn}>
          Cash Out
        </button>
      )}
    </div>
  );
};
