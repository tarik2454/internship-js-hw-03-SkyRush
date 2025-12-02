import { useState, useEffect } from "react";
import { getCurrentUser, updateUser } from "../config/authApi";

export const useUserStats = () => {
  const [balance, setBalance] = useState(100);
  const [totalWagered, setTotalWagered] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [totalWon, setTotalWon] = useState(0);

  useEffect(() => {
    // Fetch initial data
    getCurrentUser()
      .then((user) => {
        setBalance(user.balance ?? 100);
        setTotalWagered(user.totalWagered ?? 0);
        setGamesPlayed(user.gamesPlayed ?? 0);
        setTotalWon(user.totalWon ?? 0);
      })
      .catch((err) => console.error("Failed to fetch user data:", err));

    // Listen for balance updates
    const handleBalanceUpdate = (event: CustomEvent) => {
      setBalance(event.detail.balance);
    };

    // Listen for stats updates
    const handleStatsUpdate = (event: CustomEvent) => {
      if (event.detail.totalWagered !== undefined)
        setTotalWagered(event.detail.totalWagered);
      if (event.detail.gamesPlayed !== undefined)
        setGamesPlayed(event.detail.gamesPlayed);
      if (event.detail.totalWon !== undefined)
        setTotalWon(event.detail.totalWon);
    };

    window.addEventListener(
      "balanceUpdate",
      handleBalanceUpdate as EventListener,
    );
    window.addEventListener("statsUpdate", handleStatsUpdate as EventListener);

    return () => {
      window.removeEventListener(
        "balanceUpdate",
        handleBalanceUpdate as EventListener,
      );
      window.removeEventListener(
        "statsUpdate",
        handleStatsUpdate as EventListener,
      );
    };
  }, []);

  const updateBalance = async (
    amount: number,
    extraStats?: {
      totalWagered?: number;
      gamesPlayed?: number;
      totalWon?: number;
    },
  ) => {
    try {
      const user = await getCurrentUser();
      const newBalance = user.balance + amount;
      const newTotalWagered =
        user.totalWagered + (extraStats?.totalWagered || 0);
      const newGamesPlayed = user.gamesPlayed + (extraStats?.gamesPlayed || 0);
      const newTotalWon = user.totalWon + (extraStats?.totalWon || 0);

      // Optimistic update
      setBalance(newBalance);
      setTotalWagered(newTotalWagered);
      setGamesPlayed(newGamesPlayed);
      setTotalWon(newTotalWon);

      // Update API
      await updateUser({
        username: user.username,
        balance: newBalance,
        totalWagered: newTotalWagered,
        gamesPlayed: newGamesPlayed,
        totalWon: newTotalWon,
      });

      // Dispatch events
      window.dispatchEvent(
        new CustomEvent("balanceUpdate", {
          detail: { balance: newBalance },
        }),
      );

      if (extraStats) {
        window.dispatchEvent(
          new CustomEvent("statsUpdate", {
            detail: {
              gamesPlayed: newGamesPlayed,
              totalWon: newTotalWon,
              totalWagered: newTotalWagered,
            },
          }),
        );
      }
    } catch (error) {
      console.error("Failed to update stats:", error);
      // Revert optimistic update on error
      getCurrentUser().then((u) => {
        setBalance(u.balance ?? 100);
        setTotalWagered(u.totalWagered ?? 0);
        setGamesPlayed(u.gamesPlayed ?? 0);
        setTotalWon(u.totalWon ?? 0);
      });
    }
  };

  return { balance, totalWagered, gamesPlayed, totalWon, updateBalance };
};
