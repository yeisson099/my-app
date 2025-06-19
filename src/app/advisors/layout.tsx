import React from "react";
import styles from "./advisors-layout.module.css"; 
import { ErrorBoundary, Header } from "@components";

export default function AdvisorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout__container}>
      <Header />
      <main className={styles.layout__main}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}
