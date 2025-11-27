import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { updateUserStats } from '@/config/authApi';
import { AxiosError } from 'axios';

export interface UserStats {
  balance: number;
  totalWagered: number;
  gamesPlayed: number;
  totalWon: number;
}

export const useUserStats = (initialStats: UserStats = {
  balance: 0,
  totalWagered: 0,
  gamesPlayed: 0,
  totalWon: 0,
}) => {
  const [stats, setStats] = useState<UserStats>(initialStats);

  const updateStats = useCallback(async (statsUpdate: Partial<UserStats>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please login again.');
        return false;
      }

      const updatedStats = await updateUserStats(statsUpdate, token);

      // Update local state
      setStats(updatedStats);
      return true;
    } catch (err) {
      console.error('Failed to update statistics:', err);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Failed to update statistics');
      } else {
        toast.error('Failed to update statistics');
      }
      return false;
    }
  }, []);

  const addGameResult = useCallback(async (amountWon: number, amountWagered: number) => {
    return updateStats({
      gamesPlayed: stats.gamesPlayed + 1,
      totalWon: stats.totalWon + amountWon,
      totalWagered: stats.totalWagered + amountWagered,
      balance: stats.balance + amountWon - amountWagered,
    });
  }, [stats, updateStats]);

  const updateBalance = useCallback(async (newBalance: number) => {
    return updateStats({ balance: newBalance });
  }, [updateStats]);

  const refreshStats = useCallback(async () => {
    // This would typically fetch current stats from the server
    // For now, just return current stats
    return stats;
  }, [stats]);

  return {
    stats,
    setStats,
    updateStats,
    addGameResult,
    updateBalance,
    refreshStats,
  };
};
