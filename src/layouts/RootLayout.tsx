import { Outlet } from "react-router-dom";
import styles from "./RootLayout.module.scss";
import { Header } from "../modules/Header";

export const RootLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
