import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { useGame } from "@/providers/GameProvider";
import { logoutUser } from "@/config/authApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { Logo } from "@/shared/icons/logo";
import Container from "@/shared/Container";
import { Wallet } from "@/shared/icons/wallet";
import { Settings } from "@/shared/icons/settings";
import { Auth } from "@/shared/icons/auth";
import Modal from "@/shared/Modal";
import { Profile } from "./Profile";

export const Header = () => {
  const navigate = useNavigate();
  const { balance } = useGame();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        await logoutUser(token);
        toast.success("Successfully logged out!");
      }
      localStorage.removeItem("sky_rush_game_data");
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
    <>
      <header className={styles.header}>
        <Container>
          <div className={styles.headerInner}>
            <div className={styles.logo} onClick={() => navigate("/")}>
              <Logo />
              Rocket Casino
            </div>

            <div className={styles.headerActions}>
              <div className={styles.balance}>
                <Wallet />

                <span className={styles.amount}>${balance.toFixed(2)}</span>
              </div>

              <button className={styles.profileBtn} onClick={openModal}>
                <Settings />
              </button>

              <button
                className={styles.logoutButton}
                onClick={handleLogout}
                disabled={loading}
              >
                <Auth />
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Profile />
      </Modal>
    </>
  );
};
