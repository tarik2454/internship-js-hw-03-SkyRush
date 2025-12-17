import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    return (
      <div className={`${styles.inputGroup} ${className || ""}`}>
        <label htmlFor={id}>{label}</label>
        <div className={styles.inputWrapper}>
          <input
            id={id}
            ref={ref}
            className={error ? "errorInput" : ""}
            {...props}
          />
        </div>
        {error && <span className="errorMessage">{error.message}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
