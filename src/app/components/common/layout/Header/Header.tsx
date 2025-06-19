"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <div className={styles.header__left}>
          <Link
            href="/"
            className={styles['header__logo-link']}
            aria-label="Go to Home Page"
          >
            <Image
              src="/zoe_logo.png"
              alt="Zoe Financial Logo"
              width={86}
              height={40}
              priority
              className={styles.header__logo}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
