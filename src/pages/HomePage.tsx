import { GameRocket } from "../modules/rocket/GameRocket";
import { ClaimBonus } from "../modules/rocket/ClaimBonus";
import styles from "./HomePage.module.scss";
import Container from "../shared/Container";
import PageWrapper from "../shared/PageWrapper";
import { Leaderboard } from "../modules/Leaderboard";
import { useState } from "react";
import { GameCases } from "../modules/cases/GameCases";

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState<"rocket" | "cases">("rocket");

  const tabs = [
    {
      id: "rocket" as const,
      label: "🚀 Rocket",
      content: <GameRocket />,
    },
    {
      id: "cases" as const,
      label: "📦 Cases",
      content: <GameCases />,
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <div className={styles.homePage}>
          <div>
            <section className={styles.tabsWrapper}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.gameButton} ${activeTab === tab.id ? styles.isActive : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </section>

            <div className={styles.gameContent}>
              {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>
          </div>

          <div className={styles.sideColumn}>
            <ClaimBonus />
            <Leaderboard />
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
};
