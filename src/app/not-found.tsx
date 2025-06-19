import Link from "next/link";
import React from "react";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.notFound__container}>
      <h1 className={styles.notFound__title}>404 - Page Not Found</h1>
      <p className={styles.notFound__message}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className={styles.notFound__link}>
        Go back to Home
      </Link>
    </div>
  );
}
