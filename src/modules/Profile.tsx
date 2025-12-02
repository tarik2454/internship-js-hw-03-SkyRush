import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "../shared/icons/user";
import { toast } from "react-toastify";
import { getCurrentUser, updateUser } from "../config/authApi";
import { AxiosError } from "axios";
import { updateUserSchema, type UpdateUserFormData } from "../lib/validation";

export const Profile = () => {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [balance, setBalance] = useState(100);
  const [totalWagered, setTotalWagered] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [totalWon, setTotalWon] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setValue("username", userData.username);
        setBalance(userData.balance ?? 100);
        setTotalWagered(userData.totalWagered ?? 0);
        setGamesPlayed(userData.gamesPlayed ?? 0);
        setTotalWon(userData.totalWon ?? 0);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message || "Failed to load user data",
          );
        } else {
          toast.error("Failed to load user data");
        }
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserData();
  }, [setValue]);

  const resetAccount = () => {
    setBalance(100);
    setTotalWagered(0);
    setGamesPlayed(0);
    setTotalWon(0);
    localStorage.removeItem("sky_rush_game_data");
  };

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateUser({
        username: data.username,
        balance,
        totalWagered,
        gamesPlayed,
        totalWon,
      });
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

  const usernameValue = watch("username");
  const maxChars = 20;
  const remainingChars = maxChars - (usernameValue?.length || 0);

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
              maxLength={20}
              placeholder={isLoadingUser ? "Loading..." : "Username"}
              disabled={isLoadingUser}
              {...register("username")}
              className={errors.username ? "errorInput" : ""}
            />
          </div>
          {errors.username && (
            <span className="errorMessage">{errors.username.message}</span>
          )}
        </div>
      </form>

      <div className={styles.characters}>
        {remainingChars}/20 <span>characters</span>
      </div>

      <div className={styles.amountStats}>
        <p className={styles.titleStats}>Account Stats</p>
        <div className={styles.statsWrapper}>
          <div className={styles.statsGroup}>
            <div className={styles.balance}>
              Balance <span>${balance.toFixed(2)}</span>
            </div>
            <div className={styles.balance}>
              Total Wagered <span>${totalWagered.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.statsGroup}>
            <div className={styles.balance}>
              Games Played <span>{gamesPlayed}</span>
            </div>
            <div className={styles.balance}>
              Total Won <span>${totalWon.toFixed(2)}</span>
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
          onClick={() => resetAccount()}
        >
          {isSubmitting ? "Reseting Account..." : "Reset Account"}
        </button>
      </div>
    </div>
  );
};
