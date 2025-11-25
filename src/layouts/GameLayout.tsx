import { Outlet } from "react-router-dom";
import styles from "./GameLayout.module.scss";
import { Header } from "@/modules/Header";
import { Sidebar } from "@/modules/Sidebar";
import { GameProvider } from "@/providers/GameProvider";

export const GameLayout = () => {
  return (
    <GameProvider>
      <div className={styles.layout}>
        <Header />
        <div className={styles.main}>
          <Sidebar />
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </GameProvider>
  );
};
