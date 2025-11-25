import styles from "./History.module.scss";

const MOCK_HISTORY = [
  {
    id: 1,
    date: "2024-11-24 20:15",
    bet: 100,
    multiplier: 2.5,
    profit: 150,
    status: "win",
  },
  {
    id: 2,
    date: "2024-11-24 20:10",
    bet: 50,
    multiplier: 1.2,
    profit: 10,
    status: "win",
  },
  {
    id: 3,
    date: "2024-11-24 20:05",
    bet: 200,
    multiplier: 0,
    profit: -200,
    status: "loss",
  },
  {
    id: 4,
    date: "2024-11-24 19:58",
    bet: 75,
    multiplier: 5.0,
    profit: 300,
    status: "win",
  },
  {
    id: 5,
    date: "2024-11-24 19:50",
    bet: 150,
    multiplier: 0,
    profit: -150,
    status: "loss",
  },
];

export const History = () => {
  return (
    <div className={styles.historyPage}>
      <h2 className={styles.title}>Game History</h2>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Bet</th>
              <th>Multiplier</th>
              <th>Profit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_HISTORY.map((game) => (
              <tr key={game.id} className={styles[game.status]}>
                <td className={styles.date}>{game.date}</td>
                <td className={styles.bet}>${game.bet.toFixed(2)}</td>
                <td className={styles.multiplier}>
                  {game.multiplier > 0 ? `${game.multiplier.toFixed(2)}x` : "-"}
                </td>
                <td
                  className={`${styles.profit} ${
                    game.profit > 0 ? styles.positive : styles.negative
                  }`}
                >
                  {game.profit > 0 ? "+" : ""}${game.profit.toFixed(2)}
                </td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${styles[game.status]}`}
                  >
                    {game.status === "win" ? "Win" : "Loss"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Total Games:</span>
          <span className={styles.value}>{MOCK_HISTORY.length}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Total Profit:</span>
          <span className={`${styles.value} ${styles.positive}`}>
            $
            {MOCK_HISTORY.reduce((sum, game) => sum + game.profit, 0).toFixed(
              2
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
