import { useState, useEffect } from "react";
import styles from "./Bonuses.module.scss";
import { Timer, Gift, Zap } from "lucide-react";

export const Bonuses = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [streak] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.bonusesPage}>
      <h2 className={styles.title}>Daily Rewards</h2>

      <div className={styles.timerCard}>
        <div className={styles.iconWrapper}>
          <Timer size={48} color="#00e5ff" />
        </div>
        <h3>Next Bonus In</h3>
        <div className={styles.countdown}>{formatTime(timeLeft)}</div>
        <button className={styles.claimBtn} disabled={timeLeft > 0}>
          {timeLeft > 0 ? "Wait for Timer" : "Claim Bonus"}
        </button>
      </div>

      <div className={styles.streakSection}>
        <h3>
          <Zap size={24} /> Login Streak
        </h3>
        <div className={styles.streakContainer}>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div
              key={day}
              className={`${styles.dayCard} ${
                day <= streak ? styles.completed : ""
              } ${day === streak + 1 ? styles.next : ""}`}
            >
              <div className={styles.dayLabel}>Day {day}</div>
              <div className={styles.reward}>
                <Gift size={20} />
                <span>${day * 10}</span>
              </div>
              {day <= streak && <div className={styles.check}>✓</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
