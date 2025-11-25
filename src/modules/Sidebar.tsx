import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.scss";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <div
          className={`${styles.navItem} ${isActive("/") ? styles.active : ""}`}
          onClick={() => navigate("/")}
        >
          Game
        </div>
        <div
          className={`${styles.navItem} ${
            isActive("/history") ? styles.active : ""
          }`}
          onClick={() => navigate("/history")}
        >
          History
        </div>
        <div
          className={`${styles.navItem} ${
            isActive("/leaderboard") ? styles.active : ""
          }`}
          onClick={() => navigate("/leaderboard")}
        >
          Leaderboard
        </div>
        <div
          className={`${styles.navItem} ${
            isActive("/bonuses") ? styles.active : ""
          }`}
          onClick={() => navigate("/bonuses")}
        >
          Bonuses
        </div>
      </nav>
    </aside>
  );
};
