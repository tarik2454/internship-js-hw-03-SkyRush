import styles from './Leaderboard.module.scss';

const MOCK_LEADERS = [
  { rank: 1, username: 'SkyMaster99', win: 5000.0, multiplier: '50.00x' },
  { rank: 2, username: 'RocketMan', win: 2500.0, multiplier: '25.00x' },
  { rank: 3, username: 'LuckyDucky', win: 1000.0, multiplier: '10.00x' },
  { rank: 4, username: 'CrashKing', win: 500.0, multiplier: '5.00x' },
  { rank: 5, username: 'MoonWalker', win: 250.0, multiplier: '2.50x' },
];

export const Leaderboard = () => {
  return (
    <div className={styles.leaderboardPage}>
      <h2 className={styles.title}>Top Pilots</h2>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Best Win</th>
              <th>Multiplier</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LEADERS.map((player) => (
              <tr
                key={player.rank}
                className={player.rank <= 3 ? styles.topRank : ''}
              >
                <td className={styles.rank}>
                  {player.rank === 1
                    ? '🥇'
                    : player.rank === 2
                      ? '🥈'
                      : player.rank === 3
                        ? '🥉'
                        : `#${player.rank}`}
                </td>
                <td className={styles.username}>{player.username}</td>
                <td className={styles.win}>${player.win.toFixed(2)}</td>
                <td className={styles.multiplier}>{player.multiplier}</td>
              </tr>
            ))}
            {/* Current User Placeholder */}
            <tr className={styles.currentUser}>
              <td className={styles.rank}>#42</td>
              <td className={styles.username}>You</td>
              <td className={styles.win}>$0.00</td>
              <td className={styles.multiplier}>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
