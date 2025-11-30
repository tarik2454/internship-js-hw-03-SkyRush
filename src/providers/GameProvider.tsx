import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { getCurrentUser, hasToken } from "../config/authApi";
import { toast } from "react-toastify";

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
  resetAccount: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(100);
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [autoCashOut, setAutoCashOut] = useState(2);
  const [lastWin, setLastWin] = useState(0);
  const [lastBonusClaimTime, setLastBonusClaimTime] = useState<number | null>(
    null
  );
  const [totalWagered, setTotalWagered] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [totalWon, setTotalWon] = useState(0);

  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const STORAGE_KEY = "sky_rush_game_data";

  useEffect(() => {
    if (!hasToken()) return;
    getCurrentUser()
      .then((user) => {
        setBalance(user.balance ?? 100);
        setTotalWagered(user.totalWagered ?? 0);
        setGamesPlayed(user.gamesPlayed ?? 0);
        setTotalWon(user.totalWon ?? 0);
      })
      .catch((err) => console.error("Failed to fetch user data:", err));
  }, []);

  const saveToLocal = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        balance,
        totalWagered,
        gamesPlayed,
        totalWon,
        lastBonusClaimTime,
      })
    );
  };

  const updateStats = (
    newBalance: number,
    newTotalWon = totalWon,
    extraWagered = 0,
    extraGames = 0
  ) => {
    setBalance(newBalance);
    setTotalWon(newTotalWon);
    setTotalWagered((prev) => prev + extraWagered);
    setGamesPlayed((prev) => prev + extraGames);
    saveToLocal();
  };

  const startGame = () => {
    if (balance < betAmount) return toast.warning("Insufficient balance!");

    const crashPoint = 1 + Math.pow(Math.random(), 2) * 9;
    updateStats(balance - betAmount, totalWon, betAmount, 1);

    setGameState("FLYING");
    setMultiplier(1);
    setLastWin(0);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const currentMultiplier = 1 + Math.pow(elapsed, 2) * 0.1;

      if (currentMultiplier >= crashPoint) {
        setGameState("CRASHED");
        setMultiplier(crashPoint);
        return;
      }

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
    cancelAnimationFrame(requestRef.current);
    const winAmount = betAmount * finalMultiplier;
    updateStats(balance + winAmount, totalWon + winAmount);
    setLastWin(winAmount);
    setMultiplier(finalMultiplier);
    setGameState("CASHOUT");
  };

  const cashOut = () => {
    if (gameState === "FLYING") handleCashOut(multiplier);
  };

  const claimBonus = () => {
    const now = Date.now();
    const COOLDOWN = 60 * 1000;
    if (lastBonusClaimTime && now - lastBonusClaimTime < COOLDOWN) {
      const remaining = Math.ceil(
        (COOLDOWN - (now - lastBonusClaimTime)) / 1000
      );
      return toast.warning(
        `Please wait ${remaining} seconds before claiming again!`
      );
    }
    setBalance((prev) => prev + 10);
    setLastBonusClaimTime(now);
    saveToLocal();
  };

  const resetAccount = () => {
    setBalance(100);
    setTotalWagered(0);
    setGamesPlayed(0);
    setTotalWon(0);
    setLastWin(0);
    setLastBonusClaimTime(null);
    setGameState("IDLE");
    setMultiplier(1);
    saveToLocal();
  };

  useEffect(() => () => cancelAnimationFrame(requestRef.current), []);

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
        resetAccount,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
