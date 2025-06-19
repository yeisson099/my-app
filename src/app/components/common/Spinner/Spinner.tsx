import React from "react";
import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md", color }) => {
  const spinnerClasses = [styles.spinner, styles[`spinner--${size}`]]
    .filter(Boolean)
    .join(" ");

  const spinnerStyle: React.CSSProperties = color
    ? { borderTopColor: color }
    : {};

  return (
    <div
      className={spinnerClasses}
      style={spinnerStyle}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only"></span>
    </div>
  );
};

export default Spinner;
