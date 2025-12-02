import { useState, useRef, useEffect } from "react";
import { getCurrentUser, updateUser } from "../../config/authApi";
import { toast } from "react-toastify";
import { OpenAnimal } from "../../shared/icons/open-animal";
import styles from "./GameCases.module.scss";
import {
  animalContents,
  foodContents,
  spaceContents,
  sportsContents,
} from "./data/icon-contents";

export const GameCases = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastResult, setLastResult] = useState<{
    index: number;
    offset: number;
  } | null>(null);
  const [balance, setBalance] = useState(100);
  const [selectedCase, setSelectedCase] = useState<
    "animal" | "space" | "food" | "sports"
  >("animal");

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Загружаем баланс при монтировании компонента
  useEffect(() => {
    getCurrentUser()
      .then((user) => setBalance(user.balance ?? 100))
      .catch((err) => console.error("Failed to fetch user balance:", err));
  }, []);

  // Обновляем локальный баланс при получении события
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      setBalance(event.detail.balance);
    };

    window.addEventListener(
      "balanceUpdate",
      handleBalanceUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "balanceUpdate",
        handleBalanceUpdate as EventListener,
      );
    };
  }, []);

  const updateBalance = async (amount: number) => {
    try {
      const user = await getCurrentUser();
      const newBalance = user.balance + amount;
      // Обновляем баланс через API
      await updateUser({
        username: user.username,
        balance: newBalance,
        totalWagered: user.totalWagered,
        gamesPlayed: user.gamesPlayed,
        totalWon: user.totalWon,
      });

      // Отправляем событие обновления баланса
      window.dispatchEvent(
        new CustomEvent("balanceUpdate", {
          detail: { balance: newBalance },
        }),
      );
    } catch (error) {
      console.error("Failed to update balance:", error);
    }
  };

  const CASE_PRICES = {
    animal: 50,
    space: 75,
    food: 40,
    sports: 60,
  };

  const calculateItemValue = (
    caseType: "animal" | "space" | "food" | "sports",
    rarity: string,
  ) => {
    const price = CASE_PRICES[caseType];
    let multiplier = 0;

    switch (rarity) {
      case "common":
        multiplier = -0.6; // -60% (Loss)
        break;
      case "uncommon":
        multiplier = -0.2; // -20% (Small Loss)
        break;
      case "rare":
        multiplier = 0.2; // +20% (Profit)
        break;
      case "epic":
        multiplier = 1.0; // +100% (x2)
        break;
      case "legendary":
        multiplier = 2.0; // +200% (x3)
        break;
      case "gold":
        multiplier = 5.0; // +500% (x6)
        break;
      default:
        multiplier = 0;
    }

    const value = price * (1 + multiplier);
    return Math.ceil(value);
  };

  const getCurrentContents = () => {
    switch (selectedCase) {
      case "animal":
        return animalContents;
      case "space":
        return spaceContents;
      case "food":
        return foodContents;
      case "sports":
        return sportsContents;
      default:
        return animalContents;
    }
  };

  const getItemClassName = (index: number) => {
    if (index < 5) return "common";
    if (index < 8) return "uncommon";
    if (index < 10) return "rare";
    if (index < 12) return "epic";
    if (index < 13) return "legendary";
    return "gold";
  };

  const getCaseButtonClassName = (
    caseType: "animal" | "space" | "food" | "sports",
  ) => {
    return `${styles.betBtn} ${styles[`${caseType}Case`]} ${
      selectedCase === caseType ? styles.active : ""
    }`;
  };

  const handleStartAnimation = () => {
    if (isAnimating) return;

    // Проверяем достаточность баланса
    const casePrice = CASE_PRICES[selectedCase];
    if (balance < casePrice) {
      return toast.warning("Insufficient balance!");
    }

    // Сначала вычитаем стоимость кейса
    updateBalance(-casePrice);

    // Система вероятностей для выбора карточки
    const rarityProbabilities = [
      { rarity: "common", chance: 55, indices: [0, 1, 2, 3, 4] }, // 55%
      { rarity: "uncommon", chance: 25, indices: [5, 6, 7] }, // 25%
      { rarity: "rare", chance: 12, indices: [8, 9] }, // 12%
      { rarity: "epic", chance: 5, indices: [10, 11] }, // 5%
      { rarity: "legendary", chance: 2.5, indices: [12] }, // 2.5%
      { rarity: "gold", chance: 0.5, indices: [13] }, // 0.5%
    ];

    // Выбираем карточку на основе вероятностей
    const selectCardByProbability = () => {
      const random = Math.random() * 100; // 0-100
      let cumulative = 0;

      for (const { indices, chance } of rarityProbabilities) {
        cumulative += chance;
        if (random <= cumulative) {
          // Выбираем случайный индекс из доступных для этой редкости
          return indices[Math.floor(Math.random() * indices.length)];
        }
      }
      return 0; // Fallback на common
    };

    const targetIndex = selectCardByProbability();
    // Случайное смещение ±50px для естественности
    const randomOffset = Math.random() * 100 - 50;

    if (gameAreaRef.current) {
      const area = gameAreaRef.current;

      // Логика сброса позиции (бесшовный переход)
      if (lastResult) {
        // Если была предыдущая прокрутка, мы сейчас визуально на Set 8.
        // Мгновенно перепрыгиваем на Set 5 (безопасная середина), который выглядит так же.
        // Формула сдвига: (70 - (set * 14 + index)) * 146 - 73 + offset
        const resetShift =
          (70 - (5 * 14 + lastResult.index)) * 146 - 73 + lastResult.offset;

        // Отключаем transition для мгновенного прыжка
        area.classList.remove(styles.transitionActive);
        area.style.transform = `translate(calc(-50% + ${resetShift}px), -50%)`;

        // Форсируем reflow, чтобы браузер применил изменения до включения анимации
        void area.offsetWidth;
      }

      // Логика анимации к новой цели
      // Крутим до Set 8 (достаточно далеко для эффекта вращения)
      const targetSet = 8;
      const endShift =
        (70 - (targetSet * 14 + targetIndex)) * 146 - 73 + randomOffset;

      // Включаем transition и применяем новую позицию
      area.classList.add(styles.transitionActive);
      area.style.transform = `translate(calc(-50% + ${endShift}px), -50%)`;

      setIsAnimating(true);
      setLastResult({ index: targetIndex, offset: randomOffset });

      setTimeout(() => {
        setIsAnimating(false);
        // Позиция остается зафиксированной благодаря style.transform

        // Calculate and log result
        const rarity = getItemClassName(targetIndex);
        const itemValue = calculateItemValue(selectedCase, rarity);
        const casePrice = CASE_PRICES[selectedCase];

        // Добавляем стоимость предмета (цена кейса уже вычтена в начале)
        updateBalance(itemValue);

        const profit = itemValue - casePrice;
        console.log(
          `Game Finished! Case: ${selectedCase} ($${casePrice}), Item Value: $${itemValue}, Result: ${
            profit >= 0 ? "+" : ""
          }${profit}`,
        );
      }, 1500);
    }
  };

  return (
    <section>
      <p className={styles.casesTitle}>Select a Case</p>

      <div className={styles.casesWrapper}>
        <button
          className={getCaseButtonClassName("animal")}
          onClick={() => setSelectedCase("animal")}
        >
          <span className={styles.icon}>🦁</span>
          <p className={styles.title}>Animal Case</p>
          <span className={styles.price}>$50</span>
        </button>
        <button
          className={getCaseButtonClassName("space")}
          onClick={() => setSelectedCase("space")}
        >
          <span className={styles.icon}>🚀</span>
          <p className={styles.title}>Space Case</p>
          <span className={styles.price}>$75</span>
        </button>
        <button
          className={getCaseButtonClassName("food")}
          onClick={() => setSelectedCase("food")}
        >
          <span className={styles.icon}>🍕</span>
          <p className={styles.title}>Food Case</p>
          <span className={styles.price}>40</span>
        </button>
        <button
          className={getCaseButtonClassName("sports")}
          onClick={() => setSelectedCase("sports")}
        >
          <span className={styles.icon}>⚽</span>
          <p className={styles.title}>Sports Case</p>
          <span className={styles.price}>$60</span>
        </button>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.contentGameArea} ref={gameAreaRef}>
          {/* Дублируем карточки несколько раз для эффекта бесконечной прокрутки */}
          {Array.from({ length: 10 }).flatMap((_, repeatIndex) =>
            getCurrentContents().map((item, index) => {
              const rarity = getItemClassName(index);
              const value = calculateItemValue(selectedCase, rarity);
              return (
                <div
                  className={`${styles.contentItemGameArea} ${styles[rarity]}`}
                  key={`${item.id}-${repeatIndex}`}
                >
                  <div className={styles.contentIconGameArea}>{item.emoji}</div>
                  <div className={styles.itemValue}>+{value}</div>
                </div>
              );
            }),
          )}
        </div>
      </div>

      <button
        className={styles.startBtn}
        onClick={handleStartAnimation}
        disabled={isAnimating}
      >
        <span>
          <OpenAnimal />
        </span>
        {isAnimating ? (
          "Opening..."
        ) : (
          <>
            {selectedCase === "animal" && "Open Animal Case - $50"}
            {selectedCase === "space" && "Open Space Case - $75"}
            {selectedCase === "food" && "Open Food Case - 40"}
            {selectedCase === "sports" && "Open Sports Case - $60"}
          </>
        )}
      </button>

      <div className={styles.contentWrapper}>
        <p className={styles.contentTitle}>Case Contents</p>
        <div className={styles.contentInner}>
          {getCurrentContents().map((item, index) => {
            const rarity = getItemClassName(index);
            const value = calculateItemValue(selectedCase, rarity);
            return (
              <div
                className={`${styles.contentItem} ${styles[rarity]}`}
                key={item.id}
              >
                <div className={styles.contentIcon}>{item.emoji}</div>
                <div className={styles.itemValueSmall}>+{value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.rarityGuide}>
        <h3 className={styles.rarityTitle}>Rarity Guide</h3>
        <div className={styles.rarityList}>
          <div className={styles.rarityItem}>
            <span className={`${styles.rarityСircle} ${styles.common}`}></span>
            Common
            <span className={styles.rarityPercent}>(55%)</span>
          </div>
          <div className={styles.rarityItem}>
            <span
              className={`${styles.rarityСircle} ${styles.uncommon}`}
            ></span>
            Uncommon
            <span className={styles.rarityPercent}>(25%)</span>
          </div>
          <div className={styles.rarityItem}>
            <span className={`${styles.rarityСircle} ${styles.rare}`}></span>
            Rare
            <span className={styles.rarityPercent}>(12%)</span>
          </div>
          <div className={styles.rarityItem}>
            <span className={`${styles.rarityСircle} ${styles.epic}`}></span>
            Epic
            <span className={styles.rarityPercent}>(5%)</span>
          </div>
          <div className={styles.rarityItem}>
            <span
              className={`${styles.rarityСircle} ${styles.legendary}`}
            ></span>
            Legendary
            <span className={styles.rarityPercent}>(2.5%)</span>
          </div>
          <div className={styles.rarityItem}>
            <span className={`${styles.rarityСircle} ${styles.gold}`}></span>
            Gold
            <span className={styles.rarityPercent}>(0.5%)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
