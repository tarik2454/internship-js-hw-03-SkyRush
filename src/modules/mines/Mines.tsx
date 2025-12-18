import { cx } from "../../utils/classNames";
import { Input } from "../../shared/components/Input";
import { GameGrid } from "./components/GameGrid";
import { useMinesGame } from "./hooks/useMinesGame";
import styles from "./Mines.module.scss";

export const Mines = () => {
  const {
    gameState,
    cells,
    betAmount,
    setBetAmount,
    minesCount,
    setMinesCount,
    startGame,
    revealTile,
    cashOut,
    resetGame,
    currentMultiplier,
    currentValue,
    revealedCount,
    nextMultiplier,
  } = useMinesGame();

  const isPlaying = gameState === "PLAYING";
  const isGameEnded = gameState === "WON" || gameState === "LOST";
  const canInteract = !isPlaying;

  const handleMainButtonClick = () => {
    if (isPlaying) {
      // Игра идет - забираем выигрыш
      cashOut();
    } else {
      // Игра не идет (IDLE, WON, или LOST) - начинаем новую игру
      // Если игра закончилась (WON/LOST), сначала сбрасываем состояние
      if (isGameEnded) {
        resetGame();
      }
      // startGame сам сбросит состояние если нужно, но resetGame гарантирует чистый старт
      startGame();
    }
  };

  return (
    <section className={styles.mainSection}>
      <div className={styles.gameContainer}>
        <div className={styles.gameWrapper}>
          <div className={styles.gameHeader}>
            <h2 className={styles.gameTitle}>Mines</h2>
            <div className={styles.headerCounters}>
              <p className={styles.headerCounterItem}>
                Revealed:{" "}
                <span className={styles.headerCounterItemCount}>
                  {revealedCount}
                </span>
              </p>
              <p className={styles.headerCounterItem}>
                Multiplier:{" "}
                <span className={styles.headerCounterItemMultiplier}>
                  {currentMultiplier.toFixed(2)}x
                </span>
              </p>
            </div>
          </div>

          <div
            className={cx(styles.gameBoard, {
              [styles.playing]: isPlaying || isGameEnded,
            })}
          >
            <GameGrid
              cells={cells}
              onCellClick={revealTile}
              disabled={!isPlaying}
              hidden={gameState === "IDLE"}
            />
          </div>
        </div>

        {gameState === "LOST" && (
          <div className={styles.gameOverlay}>
            <p className={styles.gameOverlayTitle}>
              <span>💣</span> You hit a mine!
            </p>
          </div>
        )}
        {gameState === "WON" && (
          <div className={cx(styles.gameOverlay, styles.won)}>
            <p className={cx(styles.gameOverlayTitle, styles.won)}>
              <span>🎉</span> Cashed out successfully!
            </p>
            <p className={styles.wonAmount}>Won: ${currentValue.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div className={styles.sidebar}>
        <p className={styles.cardTitle}>Game Settings</p>
        {/* ... settings card content ... */}
        <div className={styles.card}>
          {/* ... inputs ... */}
          <div className={styles.controlGroup}>
            <Input
              label="Bet Amount"
              classNameLabel={styles.label}
              classNameInput={styles.input}
              value={betAmount}
              type="number"
              min={0.1}
              max={500}
              step={0.1}
              disabled={!canInteract}
              onChange={(e) => setBetAmount(Number(e.target.value))}
            />
            <div className={styles.quickBets}>
              {[10, 50, 100, 500].map((amount) => (
                <button
                  key={amount}
                  className={styles.betOption}
                  disabled={!canInteract}
                  onClick={() => setBetAmount(amount)}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <p className={styles.label}>Mines: {minesCount}</p>
            <div className={styles.minesOptions}>
              {[1, 3, 5, 10, 15, 24].map((count) => (
                <button
                  key={count}
                  className={cx(
                    styles.mineOption,
                    minesCount === count && styles.active,
                  )}
                  disabled={!canInteract}
                  onClick={() => setMinesCount(count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <button
            className={cx(styles.startGameBtn, {
              [styles.playing]: isPlaying,
            })}
            onClick={handleMainButtonClick}
            disabled={isPlaying && revealedCount === 0}
          >
            {isPlaying ? (
              <>
                <span className={styles.btnIcon}>💰</span> Cash Out $
                {currentValue.toFixed(2)}
              </>
            ) : (
              <>
                <span className={styles.btnIcon}>$</span> Start Game
              </>
            )}
          </button>
        </div>

        <div className={styles.card}>
          <p className={cx(styles.cardTitle, styles.cardTitleCurrentGame)}>
            Current Game
          </p>
          <div className={styles.statsWrapper}>
            <div className={styles.statsRow}>
              <span className={styles.statsLabel}>Bet Amount:</span>
              <span className={styles.statsValue}>${betAmount.toFixed(2)}</span>
            </div>
            <div className={styles.statsRow}>
              <span className={styles.statsLabel}>Current Value:</span>
              <span className={styles.statsValueSuccess}>
                ${currentValue.toFixed(2)}
              </span>
            </div>
            <div className={styles.statsRow}>
              <span className={styles.statsLabel}>Next Tile:</span>
              <span className={styles.statsValueNextTile}>
                {nextMultiplier.toFixed(2)}x
              </span>
            </div>
          </div>

          <div className={cx(styles.statsRow, styles.statsRowSafeTilesLeft)}>
            <span className={styles.statsLabel}>Safe Tiles Left:</span>
            <span className={styles.statsValueAccent}>
              {25 - minesCount - revealedCount}
            </span>
          </div>
        </div>

        <div className={cx(styles.card, styles.tipsCard)}>
          <p className={cx(styles.cardTitle, styles.cardTitleTips)}>
            <span className={styles.bulbIcon}>💡</span> Tips
          </p>
          <ul className={styles.tipsList}>
            <li>More mines = higher multiplier</li>
            <li>Cash out anytime to secure wins</li>
            <li>Each safe tile increases payout</li>
            <li>One mine ends the game</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
