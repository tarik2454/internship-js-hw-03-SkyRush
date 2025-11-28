import { Outlet } from "react-router-dom";
import styles from "./RootLayout.module.scss";
import { Header } from "@/modules/Header";
// import { Sidebar } from "@/modules/Sidebar";
import { GameProvider } from "@/providers/GameProvider";

export const RootLayout = () => {
  return (
    <GameProvider>
      <div className={styles.layout}>
        <Header />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </GameProvider>
  );
};
