import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { logoutUser, getCurrentUser } from "../config/authApi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Logo } from "../shared/icons/logo";
import Container from "../shared/Container";
import { Wallet } from "../shared/icons/wallet";
import { Settings } from "../shared/icons/settings";
import { Auth } from "../shared/icons/auth";
import Modal from "../shared/Modal";
import { Profile } from "./Profile";

export const Header = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(100);

  useEffect(() => {
    // Загружаем начальный баланс
    getCurrentUser()
      .then((user) => setBalance(user.balance ?? 100))
      .catch((err) => console.error("Failed to fetch user balance:", err));
  }, []);

  useEffect(() => {
    // Слушаем событие обновления баланса
    const handleBalanceUpdate = (event: CustomEvent) => {
      setBalance(event.detail.balance);
    };

    window.addEventListener(
      "balanceUpdate",
      handleBalanceUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "balanceUpdate",
        handleBalanceUpdate as EventListener,
      );
    };
  }, []);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      toast.success("Successfully logged out!");
      localStorage.removeItem("sky_rush_game_data");
      localStorage.removeItem("leaderboard_users");
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
            <Link className={styles.logo} to="/">
              <Logo />
              Rocket Casino
            </Link>

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
        {isModalOpen && <Profile />}
      </Modal>
    </>
  );
};
