import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useRef,
} from "react";
import { getCurrentUser } from "@/config/authApi";

type GameState = "IDLE" | "BETTING" | "FLYING" | "CRASHED" | "CASHOUT";

interface GameContextType {
  balance: number;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  multiplier: number;
  gameState: GameState;
  startGame: () => void;
  cashOut: () => void;
  autoCashOut: number;
  setAutoCashOut: (val: number) => void;
  lastWin: number;
  claimBonus: () => void;
  lastBonusClaimTime: number | null;
  totalWagered: number;
  gamesPlayed: number;
  totalWon: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(100.0);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [autoCashOut, setAutoCashOut] = useState<number>(2.0);
  const [lastWin, setLastWin] = useState<number>(0);
  const [lastBonusClaimTime, setLastBonusClaimTime] = useState<number | null>(
    null
  );
  const [totalWagered, setTotalWagered] = useState<number>(0);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  const [totalWon, setTotalWon] = useState<number>(0);

  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const STORAGE_KEY = "sky_rush_game_data";

  useEffect(() => {
    const initGameData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getCurrentUser(token);

          setBalance(userData.balance ?? 100);
          setTotalWagered(userData.totalWagered ?? 0);
          setGamesPlayed(userData.gamesPlayed ?? 0);
          setTotalWon(userData.totalWon ?? 0);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    initGameData();
  }, []);

  const saveToLocal = (data: {
    balance: number;
    totalWagered: number;
    gamesPlayed: number;
    totalWon: number;
    lastBonusClaimTime: number | null;
  }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const startGame = () => {
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    const newBalance = balance - betAmount;
    const newTotalWagered = totalWagered + betAmount;
    const newGamesPlayed = gamesPlayed + 1;

    setBalance(newBalance);
    setTotalWagered(newTotalWagered);
    setGamesPlayed(newGamesPlayed);

    saveToLocal({
      balance: newBalance,
      totalWagered: newTotalWagered,
      gamesPlayed: newGamesPlayed,
      totalWon,
      lastBonusClaimTime,
    });

    setGameState("FLYING");
    setMultiplier(1.0);
    setLastWin(0);
    startTimeRef.current = Date.now();

    // Determine crash point randomly between 1.00 and 10.00
    // Biased towards lower numbers for realism
    const crashPoint = 1 + Math.pow(Math.random(), 2) * 9;

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current!) / 1000;
      const currentMultiplier = 1 + Math.pow(elapsed, 2) * 0.1;

      if (currentMultiplier >= crashPoint) {
        setGameState("CRASHED");
        setMultiplier(crashPoint);
        return;
      }

      // Auto Cash Out Logic
      if (autoCashOut > 1 && currentMultiplier >= autoCashOut) {
        handleCashOut(currentMultiplier);
        return;
      }

      setMultiplier(currentMultiplier);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  const handleCashOut = (finalMultiplier: number) => {
    cancelAnimationFrame(requestRef.current!);
    const winAmount = betAmount * finalMultiplier;

    const newBalance = balance + winAmount;
    const newTotalWon = totalWon + winAmount;

    setBalance(newBalance);
    setTotalWon(newTotalWon);

    saveToLocal({
      balance: newBalance,
      totalWagered,
      gamesPlayed,
      totalWon: newTotalWon,
      lastBonusClaimTime,
    });

    setLastWin(winAmount);
    setGameState("CASHOUT");
    setMultiplier(finalMultiplier);
  };

  const cashOut = () => {
    if (gameState === "FLYING") {
      handleCashOut(multiplier);
    }
  };

  const claimBonus = () => {
    const now = Date.now();
    const COOLDOWN_MS = 60 * 1000; // 1 minute in milliseconds

    if (lastBonusClaimTime && now - lastBonusClaimTime < COOLDOWN_MS) {
      const remainingSeconds = Math.ceil(
        (COOLDOWN_MS - (now - lastBonusClaimTime)) / 1000
      );
      alert(`Please wait ${remainingSeconds} seconds before claiming again!`);
      return;
    }

    const newBalance = balance + 10;
    setBalance(newBalance);
    setLastBonusClaimTime(now);

    // Explicitly save lastBonusClaimTime to local storage
    saveToLocal({
      balance: newBalance,
      totalWagered,
      gamesPlayed,
      totalWon,
      lastBonusClaimTime: now,
    });
  };

  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <GameContext.Provider
      value={{
        balance,
        betAmount,
        setBetAmount,
        multiplier,
        gameState,
        startGame,
        cashOut,
        autoCashOut,
        setAutoCashOut,
        lastWin,
        claimBonus,
        lastBonusClaimTime,
        totalWagered,
        gamesPlayed,
        totalWon,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
