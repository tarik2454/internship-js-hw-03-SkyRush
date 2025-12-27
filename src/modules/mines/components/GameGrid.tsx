import { cx } from "../../../utils/classNames";
import { BombIcon } from "../../../shared/icons/bomb";
import { DiamondIcon } from "../../../shared/icons/diamond";
import type { CellStatus } from "../hooks/useMinesGame";
import styles from "./GameGrid.module.scss";

interface GameGridProps {
  className?: string;
  cells: CellStatus[];
  onCellClick: (index: number) => void;
  disabled?: boolean;
  hidden?: boolean;
}

export const GameGrid = ({
  className,
  cells,
  onCellClick,
  disabled,
  hidden,
}: GameGridProps) => {
  return (
    <div className={cx(styles.grid, className)}>
      {cells.map((status, i) => (
        <div
          key={i}
          className={cx(styles.cell, {
            [styles.cellSuccess]: status === "gem",
            [styles.cellFail]: status === "mine",
          })}
          onClick={() => !disabled && onCellClick(i)}
          style={{
            opacity: status === "hidden" && hidden ? 0 : 1,
            pointerEvents: disabled ? "none" : "auto",
          }}
        >
          {status === "gem" && <DiamondIcon />}
          {status === "mine" && <BombIcon />}
        </div>
      ))}
    </div>
  );
};
