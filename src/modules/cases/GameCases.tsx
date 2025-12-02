import { useState } from "react";
import { OpenAnimal } from "../../shared/icons/open-animal";
import styles from "./GameCases.module.scss";
import {
  animalContents,
  foodContents,
  spaceContents,
  sportsContents,
} from "./data/icon-contents";

export const GameCases = () => {
  const [selectedCase, setSelectedCase] = useState<
    "animal" | "space" | "food" | "sports"
  >("animal");

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
        <div className={styles.contentGameArea}>
          {getCurrentContents().map((item, index) => (
            <div
              className={`${styles.contentItemGameArea} ${styles[getItemClassName(index)]}`}
              key={item.id}
            >
              <div className={styles.contentIconGameArea}>{item.emoji}</div>
            </div>
          ))}
        </div>
      </div>

      <button className={styles.startBtn}>
        <span>
          <OpenAnimal />
        </span>
        {selectedCase === "animal" && "Open Animal Case - $50"}
        {selectedCase === "space" && "Open Space Case - $75"}
        {selectedCase === "food" && "Open Food Case - 40"}
        {selectedCase === "sports" && "Open Sports Case - $60"}
      </button>

      <div className={styles.contentWrapper}>
        <p className={styles.contentTitle}>Case Contents</p>
        <div className={styles.contentInner}>
          {getCurrentContents().map((item, index) => (
            <div
              className={`${styles.contentItem} ${styles[getItemClassName(index)]}`}
              key={item.id}
            >
              <div className={styles.contentIcon}>{item.emoji}</div>
            </div>
          ))}
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
