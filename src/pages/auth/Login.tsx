import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import styles from "./Auth.module.scss";
import { loginSchema, type LoginFormData } from "../../lib/validation";
import { Auth } from "../../shared/icons/auth";
import { loginUser } from "../../config/authApi";
import { toast } from "react-toastify";

export const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "test-user@gmail.com",
      password: "123456",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginUser(data);
      toast.success("Login successful!");

      navigate("/");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Invalid credentials");
      } else {
        toast.error("Invalid credentials");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      <p className={styles.linkWrapper}>
        <Link to="/auth/register" className={styles.link}>
          Don't have an account? Register
        </Link>
      </p>
    </form>
  );
};
