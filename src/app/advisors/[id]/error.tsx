"use client"; 
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {Button} from "@components"; 
import styles from "./error.module.css"; 

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void; 
}

export default function Error({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("Advisor Detail Page Error:", error);
  }, [error]);

  const handleGoBack = () => {
    router.push("/advisors");

  };

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorCode}>Oops!</h1>
      <h2 className={styles.errorMessage}>
        Something went wrong while loading this advisor.
      </h2>
      <p className={styles.errorDescription}>
        It seems like we couldn't fetch the advisor's details. This might be due
        to an invalid ID, the advisor not existing, or a temporary server issue.
      </p>
      {process.env.NODE_ENV === "development" && (
        <p className={styles.errorDetails}>Error: {error.message}</p>
      )}
      <div className={styles.errorActions}>
        <Button onClick={handleGoBack} variant="primary">
          Go to Advisors List
        </Button>
        <Button onClick={() => reset()} variant="secondary">
          Try Again
        </Button>
      </div>
    </div>
  );
}
