import { cx } from "../../../utils/classNames";
import styles from "./GameGrid.module.scss";

interface GameGridProps {
  className?: string;
}

export const GameGrid = ({ className }: GameGridProps) => {
  const cells = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className={cx(styles.grid, className)}>
      {cells.map((i) => (
        <div key={i} className={styles.cell} />
      ))}
    </div>
  );
};
