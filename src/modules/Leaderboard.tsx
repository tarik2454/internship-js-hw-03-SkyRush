import { LeaderBoard } from "@/shared/icons/leaserboard";
import { Place1 } from "@/shared/icons/place1";
import { Place2 } from "@/shared/icons/place2";
import { Place3 } from "@/shared/icons/place3";
import styles from "./Leaderboard.module.scss";

const MOCK_LEADERS = [
  {
    rank: 1,
    username: "SkyMaster99",
    gamesPlayed: 10,
    balance: 5000.0,
    winRate: "50%",
  },
  {
    rank: 2,
    username: "RocketMan",
    gamesPlayed: 5,
    balance: 2500.0,
    winRate: "25%",
  },
  {
    rank: 3,
    username: "LuckyDucky",
    gamesPlayed: 3,
    balance: 1000.0,
    winRate: "10%",
  },
  {
    rank: 4,
    username: "CrashKing",
    gamesPlayed: 2,
    balance: 500.0,
    winRate: "5%",
  },
  {
    rank: 5,
    username: "MoonWalker",
    gamesPlayed: 1,
    balance: 250.0,
    winRate: "2%",
  },
];

export const Leaderboard = () => {
  return (
    <section className={styles.leaderboarSection}>
      <div className={styles.leaderboardHeader}>
        <LeaderBoard />
        <div>
          <h2 className={styles.title}>Leaderboard</h2>
          <h3 className={styles.subtitle}>Top players</h3>
        </div>
      </div>

      <ul className={styles.listContainer}>
        {MOCK_LEADERS.map((player) => (
          <li
            key={player.rank}
            className={player.rank <= 3 ? styles.topRank : ""}
          >
            <div className={styles.rank}>
              {player.rank === 1 ? (
                <Place1 />
              ) : player.rank === 2 ? (
                <Place2 />
              ) : player.rank === 3 ? (
                <Place3 />
              ) : (
                `#${player.rank}`
              )}
            </div>

            <div className={styles.playerInfo}>
              <div>
                <div className={styles.username}>{player.username}</div>
                <div className={styles.gamesPlayed}>{player.gamesPlayed}</div>
              </div>
              <div>
                <div className={styles.win}>${player.win.toFixed(0)}</div>
                <div className={styles.winRate}>{player.winRate} win</div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.ownRank}>Your rank: #8</div>
    </section>
  );
};
