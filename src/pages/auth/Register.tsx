import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import styles from "./Auth.module.scss";
import { registerSchema, type RegisterFormData } from "../../lib/validation";
import { Auth } from "../../shared/icons/auth";
import { registerUser } from "../../config/authApi";
import { toast } from "react-toastify";

export const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      toast.success("Registration successful!");

      navigate("/auth/login");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Registration failed");
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="username">Username</label>
        <div className={styles.inputWrapper}>
          <input
            id="username"
            type="text"
            placeholder="Username"
            {...register("username")}
            className={errors.username ? "errorInput" : ""}
          />
        </div>
        {errors.username && (
          <span className="errorMessage">{errors.username.message}</span>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <div className={styles.inputWrapper}>
          <input
            id="email"
            type="text"
            placeholder="Email"
            {...register("email")}
            className={errors.email ? "errorInput" : ""}
          />
        </div>
        {errors.email && (
          <span className="errorMessage">{errors.email.message}</span>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <div className={styles.inputWrapper}>
          <input
            id="password"
            type="password"
            placeholder="Password"
            {...register("password")}
            className={errors.password ? "errorInput" : ""}
          />
        </div>
        {errors.password && (
          <span className="errorMessage">{errors.password.message}</span>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitting}
      >
        <Auth />
        {isSubmitting ? "Creating Account..." : "Register"}
      </button>

      <p className={styles.linkWrapper}>
        <Link to="/auth/login" className={styles.link}>
          Already have an account? Sign In
        </Link>
      </p>
    </form>
  );
};
