import { useState } from "react";
import { Input } from "../../shared/components/Input";
import { cx } from "../../utils/classNames";
import { GameGrid } from "./components/GameGrid";
import styles from "./Mines.module.scss";

export const Mines = () => {
  const [betAmount, setBetAmount] = useState(10);
  const [minesCount, setMinesCount] = useState(3);

  return (
    <section className={styles.mainSection}>
      <div className={styles.gameContainer}>
        <div className={styles.gameWrapper}>
          <h2 className={styles.gameTitle}>Mines</h2>
          <div className={styles.gameBoard}>
            <GameGrid />
          </div>
        </div>

        <div className={styles.gameOverOverlay}>
          <p className={styles.gameOverTitle}>
            <span>💣</span> You hit a mine!
          </p>
          <button className={styles.newGameBtn}>New Game</button>
        </div>
      </div>

      <div className={styles.sidebar}>
        <p className={styles.cardTitle}>Game Settings</p>
        <div className={styles.card}>
          <div className={styles.controlGroup}>
            <Input
              label="Bet Amount"
              classNameLabel={styles.label}
              classNameInput={styles.input}
              value={betAmount}
              type="number"
              min={10}
              max={500}
              onChange={(e) => setBetAmount(Number(e.target.value))}
            />
            <div className={styles.quickBets}>
              {[10, 50, 100, 500].map((amount) => (
                <button
                  key={amount}
                  className={styles.betOption}
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
              {[1, 3, 5, 10, 15].map((count) => (
                <button
                  key={count}
                  className={cx(
                    styles.mineOption,
                    minesCount === count && styles.active,
                  )}
                  onClick={() => setMinesCount(count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <button className={styles.startGameBtn}>
            <span className={styles.btnIcon}>$</span> Start Game
          </button>
        </div>

        <div className={styles.card}>
          <p className={cx(styles.cardTitle, styles.cardTitleCurrentGame)}>
            Current Game
          </p>
          <div className={styles.statsWrapper}>
            <div className={styles.statsRow}>
              <span className={styles.statsLabel}>Bet Amount:</span>
              <span className={styles.statsValue}>$0.00</span>
            </div>
            <div className={styles.statsRow}>
              <span className={styles.statsLabel}>Current Value:</span>
              <span className={styles.statsValueSuccess}>$0.00</span>
            </div>
          </div>
          <div className={cx(styles.statsRow, styles.statsRowSafeTilesLeft)}>
            <span className={styles.statsLabel}>Safe Tiles Left:</span>
            <span className={styles.statsValueAccent}>22</span>
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
