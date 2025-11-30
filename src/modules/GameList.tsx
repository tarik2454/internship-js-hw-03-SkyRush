import styles from './GameList.module.scss';

export const GameList = () => {
  return (
    <section>
      <div className={styles.gameWrapper}>
        <button type="button" className={styles.gameButton}>
          🚀 Rocket
        </button>
      </div>
    </section>
  );
};
