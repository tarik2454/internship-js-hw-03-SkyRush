import { useState, useRef, useEffect } from "react";
import { getCurrentUser, updateUser } from "../../config/authApi";
import { toast } from "react-toastify";
import styles from "./GameRocket.module.scss";

type GameState = "IDLE" | "BETTING" | "FLYING" | "CRASHED" | "CASHOUT";

export const GameRocket = () => {
  const [balance, setBalance] = useState(100);
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [lastWin, setLastWin] = useState(0);

  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setBalance(user.balance ?? 100))
      .catch((err) => console.error("Failed to fetch user data:", err));
  }, []);

  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      setBalance(event.detail.balance);
    };

    window.addEventListener(
      "balanceUpdate",
      handleBalanceUpdate as EventListener,
    );
    return () => {
      window.removeEventListener(
        "balanceUpdate",
        handleBalanceUpdate as EventListener,
      );
    };
  }, []);

  const updateStats = async (
    newBalance: number,
    newTotalWon = 0,
    extraWagered = 0,
    extraGames = 0,
  ) => {
    setBalance(newBalance);
    try {
      const user = await getCurrentUser();
      await updateUser({
        username: user.username,
        balance: newBalance,
        totalWagered: user.totalWagered + extraWagered,
        gamesPlayed: user.gamesPlayed + extraGames,
        totalWon: user.totalWon + newTotalWon,
      });

      // Отправляем событие обновления баланса
      window.dispatchEvent(
        new CustomEvent("balanceUpdate", {
          detail: { balance: newBalance },
        }),
      );

      // Отправляем событие обновления статистики
      window.dispatchEvent(
        new CustomEvent("statsUpdate", {
          detail: {
            gamesPlayed: user.gamesPlayed + extraGames,
            totalWon: user.totalWon + newTotalWon,
            totalWagered: user.totalWagered + extraWagered,
          },
        }),
      );
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  };

  const startGame = () => {
    if (balance < betAmount) return toast.warning("Insufficient balance!");

    const crashPoint = 1 + Math.pow(Math.random(), 2) * 9;
    updateStats(balance - betAmount, 0, betAmount, 1);

    setGameState("FLYING");
    setMultiplier(1);
    setLastWin(0);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const currentMultiplier = 1 + Math.pow(elapsed, 2) * 0.1;

      if (currentMultiplier >= crashPoint) {
        setGameState("CRASHED");
        setMultiplier(crashPoint);
        return;
      }

      setMultiplier(currentMultiplier);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  const handleCashOut = (finalMultiplier: number) => {
    cancelAnimationFrame(requestRef.current);
    const winAmount = betAmount * finalMultiplier;
    updateStats(balance + winAmount, winAmount);
    setLastWin(winAmount);
    setMultiplier(finalMultiplier);
    setGameState("CASHOUT");
  };

  const cashOut = () => {
    if (gameState === "FLYING") handleCashOut(multiplier);
  };

  useEffect(() => () => cancelAnimationFrame(requestRef.current), []);

  const isGameActive = gameState === "FLYING";

  return (
    <section>
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

      <div>
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
