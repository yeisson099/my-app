import React, { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
    
  const inputClasses = [
    styles.input__field,
    fullWidth ? styles["input__field--full-width"] : "",
    error ? styles["input__field--error"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.input}>
      {label && (
        <label htmlFor={id} className={styles.input__label}>
          {label}
        </label>
      )}
      <input id={id} className={inputClasses} {...props} />
      {error && (
        <p className={styles["input__error-message "]} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
