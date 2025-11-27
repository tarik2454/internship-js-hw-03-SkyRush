import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useRef,
} from 'react';

type GameState = 'IDLE' | 'BETTING' | 'FLYING' | 'CRASHED' | 'CASHOUT';

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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(1000.0);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [autoCashOut, setAutoCashOut] = useState<number>(2.0);
  const [lastWin, setLastWin] = useState<number>(0);
  const [lastBonusClaimTime, setLastBonusClaimTime] = useState<number | null>(
    null
  );

  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    if (balance < betAmount) {
      alert('Insufficient balance!');
      return;
    }
    setBalance((prev) => prev - betAmount);
    setGameState('FLYING');
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
        setGameState('CRASHED');
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
    setBalance((prev) => prev + winAmount);
    setLastWin(winAmount);
    setGameState('CASHOUT');
    setMultiplier(finalMultiplier);
  };

  const cashOut = () => {
    if (gameState === 'FLYING') {
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

    setBalance((prev) => prev + 10);
    setLastBonusClaimTime(now);
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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
