import React from "react";
import { useRouter } from "next/navigation";
import styles from "./AdvisorTable.module.css";
import { Advisor, SortState } from "@types";
import { Button } from "@components";
import Image from "next/image";

interface AdvisorTableProps {
  advisors: Advisor[];
  sortBy: SortState["sortBy"];
  sortOrder: SortState["sortOrder"];
  onSort: (column: "name" | "income") => void;
}

const AdvisorTable: React.FC<AdvisorTableProps> = ({
  advisors,
  sortBy,
  sortOrder,
  onSort
}) => {
  const router = useRouter();

  const handleSeeDetailsClick = (advisorId: number) => {
    router.push(`/advisors/${advisorId}`);
  };

  const getSortIcon = (column: "name" | "income") => {
    if (sortBy === column) {
      const iconSrc = sortOrder === "asc" ? "/arrow_up.png" : "/arrow_down.png";
      return (
        <Image
          src={iconSrc} 
          alt={`${sortOrder} icon`} 
          width={12} 
          height={12} 
          className={styles.advisorTable__sortIcon}
        />
      );
    }
    return null;
  };

  return (
    <div className={styles.advisorTable__wrapper}>
      <table className={styles.advisorTable}>
        <thead className={styles.advisorTable__head}>
          <tr className={styles.advisorTable__row}>
            <th
              className={`${styles.advisorTable__header} ${styles["advisorTable__header--sortable"]}`}
              onClick={() => onSort("name")}
            >
              <span>Advisor Name</span>
              {getSortIcon("name")}
            </th>
            <th
              className={`${styles.advisorTable__header} ${styles["advisorTable__header--sortable"]}`}
              onClick={() => onSort("income")}
            >
              Income {getSortIcon("income")}
            </th>
            <th
              className={`${styles.advisorTable__header} ${styles["advisorTable__header--button-column"]}`}
            ></th>
          </tr>
        </thead>
        <tbody className={styles.advisorTable__body}>
          {advisors.map((advisor) => (
            <tr
              key={advisor.id}
              className={styles.advisorTable__row}
            >
              <td className={styles.advisorTable__data}>
                <span>
                  {advisor.name}
                </span>
              </td>
              <td className={styles.advisorTable__data}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(advisor.income)}
              </td>
              <td
                className={`${styles.advisorTable__data} ${styles["advisorTable__data--button-cell"]}`}
              >
                <div className={styles.advisorTable__hoverActions}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleSeeDetailsClick(advisor.id);
                    }}
                    className={styles.advisorTable__detailButton}
                  >
                    See Advisor Details
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvisorTable;
