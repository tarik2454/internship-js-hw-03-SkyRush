import { GameCanvas } from '@/modules/GameCanvas';
import { ClaimBonus } from '@/modules/ClaimBonus';
import styles from './HomePage.module.scss';
import Container from '@/shared/Container';
import PageWrapper from '@/shared/PageWrapper';
import { GameList } from '@/modules/GameList';

export const HomePage = () => {
  return (
    <PageWrapper>
      <Container>
        <div className={styles.homePage}>
          <div className={styles.mainColumn}>
            <GameList />
            <GameCanvas />
          </div>

          <ClaimBonus />
        </div>
      </Container>
    </PageWrapper>
  );
};
