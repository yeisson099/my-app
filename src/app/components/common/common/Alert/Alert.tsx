import React from "react";
import styles from "./Alert.module.css";
import { AlertMessage } from "@types";

interface AlertProps {
  alert: AlertMessage;
  onClose: (id: string) => void;
}

const Alert: React.FC<AlertProps> = ({ alert, onClose }) => {
  const alertClasses = [
    styles.alert,
    styles[`alert--${alert.type}`],
  ].filter(Boolean).join(" ");

  return (
    <div className={alertClasses} role="alert" aria-live="polite">
      <p className={styles.alert__message}>{alert.message}</p>
      <button
        onClick={() => onClose(alert.id)}
        className={styles["alert__close-button"]}
        aria-label="Close alert"
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;
