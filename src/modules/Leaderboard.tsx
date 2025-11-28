import { useEffect, useState } from "react";
import { LeaderBoard } from "@/shared/icons/leaserboard";
import { Place1 } from "@/shared/icons/place1";
import { Place2 } from "@/shared/icons/place2";
import { Place3 } from "@/shared/icons/place3";
import { getAllUsers, type User } from "@/config/authApi";
import styles from "./Leaderboard.module.scss";

interface LeaderboardUser extends User {
  rank: number;
  winRate: string;
}

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const users = await getAllUsers(token);

        // Sort users by balance in descending order and add ranks
        const sortedUsers = users
          .sort((a, b) => b.balance - a.balance)
          .map((user, index) => ({
            ...user,
            rank: index + 1,
            // For now, keep winRate static or you can calculate it based on some logic
            winRate: `${Math.floor(Math.random() * 100)}%`,
          }));

        setLeaders(sortedUsers);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load leaderboard");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  if (loading) {
    return (
      <section className={styles.leaderboarSection}>
        <div className={styles.leaderboardHeader}>
          <LeaderBoard />
          <div>
            <h2 className={styles.title}>Leaderboard</h2>
            <h3 className={styles.subtitle}>Top players</h3>
          </div>
        </div>
        <div className={styles.loading}>Loading leaderboard...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.leaderboarSection}>
        <div className={styles.leaderboardHeader}>
          <LeaderBoard />
          <div>
            <h2 className={styles.title}>Leaderboard</h2>
            <h3 className={styles.subtitle}>Top players</h3>
          </div>
        </div>
        <div className={styles.error}>{error}</div>
      </section>
    );
  }

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
        {leaders.map((player) => (
          <li
            key={player._id}
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
                <div className={styles.gamesPlayed}>
                  {player.gamesPlayed} games
                </div>
              </div>
              <div>
                <div className={styles.win}>${player.balance.toFixed(0)}</div>
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
