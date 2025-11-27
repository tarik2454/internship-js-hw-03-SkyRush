import { useForm } from "react-hook-form";
import styles from "./Profile.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "@/lib/validation";
import { User } from "@/shared/icons/user";
// import { toast } from "react-toastify";

export const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // TODO: Implement profile update logic
      console.log("Profile data:", data);
      // await updateProfile(data);
      // toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      // TODO: Implement proper error handling
      console.error("Profile update failed:", err);
      // if (err instanceof AxiosError) {
      //   toast.error(err.response?.data?.message || "Profile update failed");
      // } else {
      //   toast.error("Profile update failed");
      // }
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
              placeholder="Username"
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
              Balance <span>$1025.54</span>
            </div>
            <div className={styles.balance}>
              Total Wagered <span>$20.00</span>
            </div>
          </div>

          <div className={styles.statsGroup}>
            <div className={styles.balance}>
              Games Played <span>2</span>
            </div>
            <div className={styles.balance}>
              Total Won <span>$45.54</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button className={styles.saveBtn} disabled={isSubmitting}>
          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </button>
        <button className={styles.resetBtn} disabled={isSubmitting}>
          {isSubmitting ? "Reseting Account..." : "Reset Account"}
        </button>
      </div>
    </div>
  );
};
