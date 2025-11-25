import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { useGame } from "@/providers/GameProvider";
import { logoutUser } from "@/config/authApi";
import { useState } from "react";
import { toast } from "react-toastify";

export const Header = () => {
  const navigate = useNavigate();
  const { balance } = useGame();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        await logoutUser(token);
        toast.success("Successfully logged out!");
      }
      localStorage.removeItem("token");
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className={styles.header}>
      <div
        className={styles.logo}
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        SkyRush
      </div>
      <div className={styles.balance}>
        <span>Balance:</span>
        <span className={styles.amount}>${balance.toFixed(2)}</span>
      </div>
      <div
        className={styles.profile}
        onClick={() => navigate("/profile")}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.avatar} />
      </div>
      <button
        className={styles.logoutButton}
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </header>
  );
};
