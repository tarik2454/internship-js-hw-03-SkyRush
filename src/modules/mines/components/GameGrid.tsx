import { cx } from "../../../utils/classNames";
import { BombIcon } from "../../../shared/icons/bomb";
import { DiamondIcon } from "../../../shared/icons/diamond";
import styles from "./GameGrid.module.scss";

type CellStatus = "hidden" | "gem" | "mine";

interface GameGridProps {
  className?: string;
}

export const GameGrid = ({ className }: GameGridProps) => {
  const cells: CellStatus[] = Array(25).fill("hidden");
  cells[2] = "mine";
  cells[4] = "gem";

  return (
    <div className={cx(styles.grid, className)}>
      {cells.map((status, i) => (
        <div
          key={i}
          className={cx(styles.cell, {
            [styles.cellSuccess]: status === "gem",
            [styles.cellFail]: status === "mine",
          })}
        >
          {status === "gem" && <DiamondIcon />}
          {status === "mine" && <BombIcon />}
        </div>
      ))}
    </div>
  );
};
