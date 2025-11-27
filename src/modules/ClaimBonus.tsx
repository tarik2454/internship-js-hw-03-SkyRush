import { Bonus } from "@/shared/icons/bonus";
import styles from "./ClaimBonus.module.scss";
import { Timer } from "@/shared/icons/timer";

export const ClaimBonus = () => {
  return (
    <section className={styles.claimSection}>
      <div className={styles.claimHeader}>
        <div className={styles.iconWrapper}>
          <Bonus />
        </div>

        <div>
          <h2 className={styles.title}>Claim Bonus</h2>
          <p className={styles.description}>Free money every minutes</p>
        </div>
      </div>

      <div className={styles.claimContent}>
        <div className={styles.claimTimer}>
          Next Claim:
          <span>
            <Timer /> 0:53
          </span>
        </div>
        <div className={styles.claimAmount}>
          Amount: <span>$10</span>
        </div>
      </div>

      <button className={styles.claimBtn}>Claim Now!</button>
    </section>
  );
};
