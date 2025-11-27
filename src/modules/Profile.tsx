import { useForm } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import styles from "./Profile.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "@/lib/validation";
import { User } from "@/shared/icons/user";
import { toast } from "react-toastify";
import { updateUsername, getCurrentUser, updateUserStats } from "@/config/authApi";
import { AxiosError } from "axios";

export const Profile = () => {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userStats, setUserStats] = useState({
    balance: 0,
    totalWagered: 0,
    gamesPlayed: 0,
    totalWon: 0,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoadingUser(false);
          return;
        }

        const userData = await getCurrentUser(token);
        setValue("username", userData.username);
        setUserStats({
          balance: userData.balance,
          totalWagered: userData.totalWagered,
          gamesPlayed: userData.gamesPlayed,
          totalWon: userData.totalWon,
        });
      } catch (err) {
        console.error("Failed to load user data:", err);
        toast.error("Failed to load user data");
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserData();
  }, [setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    console.log(data);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      await updateUsername({ username: data.username }, token);
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Profile update failed");
      } else {
        toast.error("Profile update failed");
      }
    }
  };

  // Function to update user statistics (can be called from other components)
  const updateStats = useCallback(async (statsUpdate: {
    balance?: number;
    totalWagered?: number;
    gamesPlayed?: number;
    totalWon?: number;
  }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      const updatedStats = await updateUserStats(statsUpdate, token);

      // Update local state
      setUserStats(prevStats => ({
        ...prevStats,
        ...updatedStats,
      }));

      toast.success("Statistics updated successfully!");
    } catch (err) {
      console.error("Failed to update statistics:", err);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to update statistics");
      } else {
        toast.error("Failed to update statistics");
      }
    }
  }, [setUserStats]);

  // Example functions for updating specific stats
  const addGameResult = (amountWon: number, amountWagered: number) => {
    updateStats({
      gamesPlayed: userStats.gamesPlayed + 1,
      totalWon: userStats.totalWon + amountWon,
      totalWagered: userStats.totalWagered + amountWagered,
      balance: userStats.balance + amountWon - amountWagered,
    });
  };

  const updateBalance = (newBalance: number) => {
    updateStats({
      balance: newBalance,
    });
  };

  return (
    <div className={styles.profileContainer}>
      <p className={styles.profileTitle}>Profile Settings</p>
      <p className={styles.profileSubtitle}>
        Customize your profile and manage your account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputGroup}>
          <div className={styles.labelWrapper}>
            <User /> <label htmlFor="username">Username</label>
          </div>

          <div className={styles.inputWrapper}>
            <input
              id="username"
              type="text"
              placeholder={isLoadingUser ? "Loading..." : "Username"}
              disabled={isLoadingUser}
              {...register("username")}
              className={errors.username ? styles.errorInput : ""}
            />
          </div>
          {errors.username && (
            <span className={styles.errorMessage}>
              {errors.username.message}
            </span>
          )}
        </div>
      </form>

      <div className={styles.characters}>
        4/20 <span>characters</span>
      </div>

      <div className={styles.amountStats}>
        <p className={styles.titleStats}>Account Stats</p>
        <div className={styles.statsWrapper}>
          <div className={styles.statsGroup}>
            <div className={styles.balance}>
              Balance <span>${userStats.balance.toFixed(2)}</span>
            </div>
            <div className={styles.balance}>
              Total Wagered <span>${userStats.totalWagered.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.statsGroup}>
            <div className={styles.balance}>
              Games Played <span>{userStats.gamesPlayed}</span>
            </div>
            <div className={styles.balance}>
              Total Won <span>${userStats.totalWon.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button
          className={styles.saveBtn}
          disabled={isSubmitting || isLoadingUser}
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </button>
        <button
          className={styles.resetBtn}
          disabled={isSubmitting || isLoadingUser}
        >
          {isSubmitting ? "Reseting Account..." : "Reset Account"}
        </button>
      </div>

      {/* Development buttons for testing statistics updates */}
      <div className={styles.buttonWrapper} style={{ marginTop: '20px', opacity: 0.7 }}>
        <button
          className={styles.saveBtn}
          onClick={() => addGameResult(10, 5)}
          style={{ background: '#10b981' }}
        >
          Test Win (+$10, -$5 wagered)
        </button>
        <button
          className={styles.saveBtn}
          onClick={() => updateBalance(userStats.balance + 50)}
          style={{ background: '#3b82f6' }}
        >
          Add $50 Balance
        </button>
      </div>
    </div>
  );
};
