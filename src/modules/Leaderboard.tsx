import { useEffect, useState, useMemo } from "react";
import { LeaderBoard } from "@/shared/icons/leaserboard";
import { Place1 } from "@/shared/icons/place1";
import { Place2 } from "@/shared/icons/place2";
import { Place3 } from "@/shared/icons/place3";
import { getAllUsers, type User, getCurrentUser } from "@/config/authApi";
import { useGame } from "@/providers/GameProvider";
import styles from "./Leaderboard.module.scss";
import { toast } from "react-toastify";

interface LeaderboardUser extends User {
  rank: number;
  winRate: string;
}

export const Leaderboard = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [apiUsers, setApiUsers] = useState<User[]>([]);
  const {
    balance: currentBalance,
    gamesPlayed: currentGamesPlayed,
    totalWon,
    totalWagered: currentTotalWagered,
  } = useGame();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let currentUsername: string | null = null;

        const currentUser = await getCurrentUser();
        currentUsername = currentUser.username;

        const users = await getAllUsers();
        setApiUsers(users);

        if (currentUsername) {
          const matchedUser = users.find(
            (user) => user.username === currentUsername
          );
          if (matchedUser) {
            setCurrentUserId(matchedUser._id);
          } else {
            console.error(
              "Could not find current user in users list by username"
            );
          }
        } else {
          const matchedUser = users.find(
            (user) => Math.abs(user.balance - currentBalance) < 0.01
          );
          if (matchedUser) {
            setCurrentUserId(matchedUser._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load leaderboard data");
      }
    };

    fetchUsers();
  }, [currentBalance]);

  const leaders: LeaderboardUser[] = useMemo(() => {
    // Recalculate balances and ranks dynamically without API calls
    const updatedUsers = apiUsers.map((user) => {
      let calculatedBalance = user.balance;
      let gamesPlayed = user.gamesPlayed;

      // If this is the current user, use real-time balance from GameProvider
      if (currentUserId && user._id === currentUserId) {
        calculatedBalance = currentBalance;
        gamesPlayed = currentGamesPlayed;
      }

      return {
        ...user,
        balance: calculatedBalance,
        gamesPlayed,
      };
    });

    // Sort by balance and assign ranks dynamically, take top 8
    const sortedUsers = updatedUsers
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 8)
      .map((user, index) => {
        // Calculate winRate dynamically for each user
        let calculatedWinRate: string;
        if (currentUserId && user._id === currentUserId) {
          // For current user, use real-time data from GameProvider
          const winRateValue =
            currentTotalWagered > 0
              ? Math.floor((totalWon / currentTotalWagered) * 100)
              : 0;
          calculatedWinRate = `${winRateValue}%`;
        } else {
          // For other users, calculate from their stored data
          const userTotalWagered = user.totalWagered ?? 0;
          const userTotalWon = user.totalWon ?? 0;
          const winRateValue =
            userTotalWagered > 0
              ? Math.floor((userTotalWon / userTotalWagered) * 100)
              : 0;
          calculatedWinRate = `${winRateValue}%`;
        }

        return {
          ...user,
          rank: index + 1,
          winRate: calculatedWinRate,
        };
      });

    return sortedUsers;
  }, [
    apiUsers,
    currentUserId,
    currentBalance,
    currentGamesPlayed,
    totalWon,
    currentTotalWagered,
  ]);

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
        {leaders.map((player) => {
          console.log("Rendering player:", player);
          return (
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
          );
        })}
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
