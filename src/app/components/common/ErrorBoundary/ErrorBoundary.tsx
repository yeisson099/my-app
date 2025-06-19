"use client"

import React, { Component, ReactNode } from "react";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className={styles.errorBoundary}>
            <h2 className={styles["errorBoundary__title"]}>
              Oops! Something went wrong.
            </h2>
            <p className={styles["errorBoundary__message"]}>
              We're sorry for the inconvenience. Please try again later.
            </p>
            {this.state.error && (
              <details className={styles["errorBoundary__details"]}>
                <summary className={styles["errorBoundary__details-summary"]}>
                  Error Details
                </summary>
                <pre className={styles["errorBoundary__details-pre"]}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
