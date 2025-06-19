import React from "react";
import styles from "./SkeletonLoaderTable.module.css";

export default function SkeletonLoaderTable() {
  return (
    <div className={styles.skeletonContainer}>

      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonButton}></div>
      </div>

      <div className={styles.skeletonTable}>
        <div className={styles.skeletonTableHeader}>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
        </div>

        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className={styles.skeletonTableRow}>
            <div className={styles.skeletonCell}></div>
            <div className={styles.skeletonCell}></div>
          </div>
        ))}
      </div>

      <div className={styles.skeletonPagination}>
        <div className={styles.skeletonPaginationItem}></div>
        <div className={styles.skeletonPaginationItem}></div>
        <div className={styles.skeletonPaginationItem}></div>
      </div>
    </div>
  );
}
