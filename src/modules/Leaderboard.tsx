import { useEffect, useState } from "react";
import { LeaderBoard } from "@/shared/icons/leaserboard";
import { Place1 } from "@/shared/icons/place1";
import { Place2 } from "@/shared/icons/place2";
import { Place3 } from "@/shared/icons/place3";
import { getAllUsers, type User, getCurrentUser } from "@/config/authApi";
import { useGame } from "@/providers/GameProvider";
import styles from "./Leaderboard.module.scss";

interface LeaderboardUser extends User {
  rank: number;
  winRate: string;
}

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [apiUsers, setApiUsers] = useState<User[]>([]);
  const [winRateMap, setWinRateMap] = useState<Map<string, string>>(new Map());
  const {
    balance: currentBalance,
    gamesPlayed: currentGamesPlayed,
    totalWon,
  } = useGame();

  // Initial data loading from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Starting to fetch users...");
        const token = localStorage.getItem("token");
        console.log("Token found:", !!token);
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        // Get current user data first to know who we are
        console.log("Fetching current user...");
        console.log("Token being used:", token ? "present" : "missing");
        let currentUsername: string | null = null;

        try {
          const currentUser = await getCurrentUser(token);
          console.log("Raw currentUser response:", currentUser);
          console.log("Current user keys:", Object.keys(currentUser));
          console.log("Current user username:", currentUser.username);

          // Store username to find user in the list later
          currentUsername = currentUser.username;
          console.log("Stored currentUsername:", currentUsername);
        } catch (currentUserError) {
          console.error("Failed to get current user:", currentUserError);
          console.log(
            "Will try to identify current user from API users list..."
          );
        }

        // Get all users from API
        console.log("Fetching all users...");
        const users = await getAllUsers(token);
        console.log("Users from API:", users);
        setApiUsers(users);

        // Calculate winRate once for each user and store in Map
        const newWinRateMap = new Map<string, string>();
        users.forEach((user) => {
          // Calculate win rate based on totalWon and totalWagered
          const totalWagered = user.totalWagered ?? 0;
          const totalWon = user.totalWon ?? 0;
          const winRate =
            totalWagered > 0 ? Math.floor((totalWon / totalWagered) * 100) : 0;
          newWinRateMap.set(user._id, `${winRate}%`);
        });
        setWinRateMap(newWinRateMap);

        // Find current user by username in the users list
        if (currentUsername) {
          const matchedUser = users.find(
            (user) => user.username === currentUsername
          );
          if (matchedUser) {
            console.log("✅ Found current user by username:", matchedUser);
            console.log("Current user _id:", matchedUser._id);
            setCurrentUserId(matchedUser._id);
          } else {
            console.error(
              "Could not find current user in users list by username"
            );
          }
        } else {
          console.log("No username available, trying balance match...");
          // Fallback: try to identify current user by matching balance
          const matchedUser = users.find(
            (user) => Math.abs(user.balance - currentBalance) < 0.01
          );
          if (matchedUser) {
            console.log(
              "Identified current user by balance match:",
              matchedUser
            );
            setCurrentUserId(matchedUser._id);
          }
        }

        setLoading(false);
        console.log("Data loading completed");
      } catch (err) {
        console.error("Failed to fetch users:", err);
        const error = err as Error & { response?: { data?: unknown } };
        console.error("Error details:", error.response?.data || error.message);
        console.error("Error status:", (err as any).response?.status);
        console.error("Full error object:", err);
        setError(
          `Failed to load leaderboard: ${error.message || "Unknown error"}`
        );
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Only run once on mount

  // Dynamic balance recalculation when game data changes
  useEffect(() => {
    console.log("Dynamic update triggered:", {
      apiUsersLength: apiUsers.length,
      currentUserId,
      currentBalance,
      currentGamesPlayed,
    });

    if (apiUsers.length === 0) {
      console.log("Skipping update: no users in API");
      return;
    }

    console.log("Processing users data...");

    // Recalculate balances and ranks dynamically without API calls
    const updatedUsers = apiUsers.map((user) => {
      let calculatedBalance = user.balance;
      let gamesPlayed = user.gamesPlayed;

      console.log("Processing user:", {
        userId: user._id,
        username: user.username,
        isCurrentUser: user._id === currentUserId,
        currentUserId,
      });

      // If this is the current user, use real-time balance from GameProvider
      if (currentUserId && user._id === currentUserId) {
        // Use balance directly from GameProvider as it already contains the actual balance
        calculatedBalance = currentBalance;
        gamesPlayed = currentGamesPlayed;
        console.log("✅ Applied real-time balance to current user:", {
          userId: user._id,
          username: user.username,
          apiBalance: user.balance,
          gameProviderBalance: currentBalance,
          displayedBalance: calculatedBalance,
          gamesPlayed,
        });
      }

      return {
        ...user,
        balance: calculatedBalance,
        gamesPlayed,
      };
    });

    // Sort by balance and assign ranks dynamically
    const sortedUsers = updatedUsers
      .sort((a, b) => b.balance - a.balance)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
        // Use static winRate from Map (calculated once on load)
        winRate: winRateMap.get(user._id) || "0%",
      }));

    console.log("Final leaders:", sortedUsers);
    console.log("Setting leaders with length:", sortedUsers.length);
    setLeaders(sortedUsers);
  }, [
    apiUsers,
    currentUserId,
    currentBalance,
    currentGamesPlayed,
    totalWon,
    winRateMap,
  ]);
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

  console.log("Render state:", {
    loading,
    error,
    leadersLength: leaders.length,
    leaders: leaders,
  });

  if (leaders.length === 0 && !loading && !error) {
    return (
      <section className={styles.leaderboarSection}>
        <div className={styles.leaderboardHeader}>
          <LeaderBoard />
          <div>
            <h2 className={styles.title}>Leaderboard</h2>
            <h3 className={styles.subtitle}>Top players</h3>
          </div>
        </div>
        <div className={styles.error}>No users found</div>
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
