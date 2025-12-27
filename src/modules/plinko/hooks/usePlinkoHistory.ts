import { useState, useEffect, useCallback } from "react";
import { type PlinkoHistoryItem } from "../types";

const STORAGE_KEY = "plinko_history";
const MAX_HISTORY_ITEMS = 50; // Максимальное количество записей в истории

export const usePlinkoHistory = () => {
  const [history, setHistory] = useState<PlinkoHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load Plinko history:", error);
    }
    return [];
  });

  // Сохранение истории в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save Plinko history:", error);
    }
  }, [history]);

  // Добавление новой записи в историю
  const addHistoryItem = useCallback(
    (item: Omit<PlinkoHistoryItem, "id" | "timestamp">) => {
      const newItem: PlinkoHistoryItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev];
        // Ограничиваем количество записей
        return updated.slice(0, MAX_HISTORY_ITEMS);
      });
    },
    []
  );

  // Получение последних N записей
  const getRecentHistory = useCallback(
    (count: number = 10) => {
      return history.slice(0, count);
    },
    [history]
  );

  // Очистка истории
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    history,
    addHistoryItem,
    getRecentHistory,
    clearHistory,
  };
};

