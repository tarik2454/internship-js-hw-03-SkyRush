import { GameCanvas } from "../modules/GameCanvas";
import { ClaimBonus } from "../modules/ClaimBonus";
import styles from "./HomePage.module.scss";
import Container from "../shared/Container";
import PageWrapper from "../shared/PageWrapper";
import { GameList } from "../modules/GameList";
import { Leaderboard } from "../modules/Leaderboard";

export const HomePage = () => {
  return (
    <PageWrapper>
      <Container>
        <div className={styles.homePage}>
          <div>
            <GameList />
            <GameCanvas />
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
