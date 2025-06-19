"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { AlertMessage } from "@types";
import styles from "./AlertContext.module.css";
import { Alert } from "@components";

interface AlertContextType {
  showAlert: (alert: Omit<AlertMessage, "id">) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const showAlert = useCallback((alert: Omit<AlertMessage, "id">) => {
    const id =
      Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setAlerts((prevAlerts) => [...prevAlerts, { ...alert, id }]);
  }, []);

  const closeAlert = useCallback((id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  }, []);

  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts((prevAlerts) => prevAlerts.slice(1));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [alerts]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className={styles.alertContainer}>
        {alerts.map((alert) => (
          <Alert key={alert.id} alert={alert} onClose={closeAlert} />
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
