import { GameCanvas } from "@/modules/game/GameCanvas";
import { BettingControls } from "@/modules/game/BettingControls";
import styles from "./Game.module.scss";

export const Game = () => {
  return (
    <div className={styles.gamePage}>
      <div className={styles.mainColumn}>
        <GameCanvas />
      </div>
      <div className={styles.controlsColumn}>
        <BettingControls />
      </div>
    </div>
  );
};
