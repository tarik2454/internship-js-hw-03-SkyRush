import React, { createContext, useEffect, useState, useRef } from "react";
import { getCurrentUser } from "../config/authApi";

interface UserStats {
  username: string;
  balance: number;
  totalWagered: number;
  gamesPlayed: number;
  totalWon: number;
}

interface UserStatsContextType extends Omit<UserStats, "username"> {
  username: string;
  isLoading: boolean;
  updateBalance: (
    amount: number,
    extraStats?: Partial<Omit<UserStats, "balance" | "username">>,
  ) => Promise<void>;
  refreshStats: () => Promise<void>;
}

export const UserStatsContext = createContext<UserStatsContextType | undefined>(
  undefined,
);

export const UserStatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem("sky_rush_game_data");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      username: "",
      balance: 100,
      totalWagered: 0,
      gamesPlayed: 0,
      totalWon: 0,
    };
  });
  const [isLoading, setIsLoading] = useState(true);

  const statsRef = useRef(stats);

  useEffect(() => {
    statsRef.current = stats;
    localStorage.setItem("sky_rush_game_data", JSON.stringify(stats));
  }, [stats]);

  const fetchUserData = async () => {
    try {
      const user = await getCurrentUser();

      setStats(() => {
        const saved = localStorage.getItem("sky_rush_game_data");
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            username: user.username,
          };
        }

        return {
          username: user.username,
          balance: user.balance ?? 100,
          totalWagered: user.totalWagered ?? 0,
          gamesPlayed: user.gamesPlayed ?? 0,
          totalWon: user.totalWon ?? 0,
        };
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateBalance = async (
    amount: number,
    extraStats?: Partial<Omit<UserStats, "balance" | "username">>,
  ) => {
    const currentStats = statsRef.current;

    const newStats = {
      ...currentStats,
      balance: currentStats.balance + amount,
      totalWagered: currentStats.totalWagered + (extraStats?.totalWagered || 0),
      gamesPlayed: currentStats.gamesPlayed + (extraStats?.gamesPlayed || 0),
      totalWon: currentStats.totalWon + (extraStats?.totalWon || 0),
    };

    setStats(newStats);
  };

  return (
    <UserStatsContext.Provider
      value={{
        ...stats,
        isLoading,
        updateBalance,
        refreshStats: fetchUserData,
      }}
    >
      {children}
    </UserStatsContext.Provider>
  );
};
