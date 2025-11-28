import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/shared/icons/user";
import { toast } from "react-toastify";
import { getCurrentUser, updateUser } from "@/config/authApi";
import { AxiosError } from "axios";
import { useGame } from "@/providers/GameProvider";
import { updateUserSchema, type UpdateUserFormData } from "@/lib/validation";

export const Profile = () => {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { balance, totalWagered, gamesPlayed, totalWon } = useGame();

  const {
    register,
    handleSubmit,
    setValue,
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
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        const userData = await getCurrentUser(token);
        setValue("username", userData.username);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message || "Failed to load user data"
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

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      await updateUser(
        {
          username: data.username,
          balance,
          totalWagered,
          gamesPlayed,
          totalWon,
        },
        token
      );
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
        >
          {isSubmitting ? "Reseting Account..." : "Reset Account"}
        </button>
      </div>
    </div>
  );
};
