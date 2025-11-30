import { useEffect, useState, useMemo } from "react";
import { LeaderBoard } from "../shared/icons/leaserboard";
import { getAllUsers, getCurrentUser, type User } from "../config/authApi";
import { useGame } from "../providers/GameProvider";
import styles from "./Leaderboard.module.scss";
import { toast } from "react-toastify";
import { Place1 } from "../shared/icons/place1";
import { Place2 } from "../shared/icons/place2";
import { Place3 } from "../shared/icons/place3";

interface LeaderboardUser extends User {
  rank: number;
  winRate: string;
}

export const Leaderboard = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [apiUsers, setApiUsers] = useState<User[]>([]);
  const { balance, gamesPlayed, totalWon, totalWagered } = useGame();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = await getCurrentUser();
        const users = await getAllUsers();

        setApiUsers(users);

        const matchedUser = users.find(
          (u) => u.username === currentUser.username
        );
        if (matchedUser) setCurrentUserId(matchedUser._id);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        toast.error("Failed to load leaderboard data");
      }
    };

    fetchUsers();
  }, []);

  const leaders: LeaderboardUser[] = useMemo(() => {
    return apiUsers
      .map((user) => {
        const isCurrent = user._id === currentUserId;

        const userBalance = isCurrent ? balance : user.balance;
        const userGames = isCurrent ? gamesPlayed : user.gamesPlayed;
        const userTotalWon = isCurrent ? totalWon : (user.totalWon ?? 0);
        const userTotalWagered = isCurrent
          ? totalWagered
          : (user.totalWagered ?? 0);

        const winRate =
          userTotalWagered > 0
            ? Math.floor((userTotalWon / userTotalWagered) * 100)
            : 0;

        return {
          ...user,
          balance: userBalance,
          gamesPlayed: userGames,
          rank: 0,
          winRate: `${winRate}%`,
        };
      })
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 8)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  }, [apiUsers, currentUserId, balance, gamesPlayed, totalWon, totalWagered]);

  return (
    <section className={styles.leaderboardSection}>
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
            className={`${player.rank <= 3 ? styles.topRank : ""} ${
              player._id === currentUserId ? styles.currentUser : ""
            }`}
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

      {currentUserId && (
        <div className={styles.ownRank}>
          Your rank: #
          {leaders.find((player) => player._id === currentUserId)?.rank || "?"}
        </div>
      )}
    </section>
  );
};
