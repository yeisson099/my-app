"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import { useAlert } from "@context";
import { Button, Input } from "@components";

export default function HomePage() {
  const [income, setIncome] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { showAlert } = useAlert();

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,5}$/.test(value)) {
      setIncome(value);
      if (error && value.length === 5) {
        setError("");
      }
    }
  };

  const handleSearch = () => {
    if (income.length !== 5) {
      setError("Income must be exactly 5 digits long.");
      showAlert({
        type: "error",
        message: "Please enter a valid 5-digit income.",
      });
      return;
    }
    router.push(`/advisors?income=${income}`);
  };

  return (
    <div className={styles.home__container}>
      <div className={styles.home__content}>
        <div className={styles.home__branding}>
          <Image
            src="/zoe_logo.png"
            alt="Zoe Financial Logo"
            width={140}
            height={64}
            priority
            className={styles.home__logo}
          />
        </div>
        <Image
          src="/profile.png"
          alt="Advisor Icon"
          width={80}
          height={80}
          className={styles.home__icon}
        />
        <h1 className={styles.home__title}>Find Your Company Advisors!</h1>{" "}
        <p className={styles.home__description}>
          Search by income to find your advisors.{" "}
        </p>
        <div className={styles["home__search-box"]}>
          <Input
            type="number"
            name="income"
            id="income"
            label="Curren Icome"
            value={income}
            onChange={handleIncomeChange}
            placeholder="Current income"
            error={error}
            maxLength={5}
            aria-describedby={error ? "income-error" : undefined}
            className={styles.home__incomeInput}
          />
          <Button
            onClick={handleSearch}
            className={styles["home__search-button"]}
          >
            Search Now
            <Image
              src="/search.png"
              alt="search advisor"
              width={16}
              height={16}
              priority
              className={styles["home__search-button-icon"]}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
