"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAdvisors, createAdvisor, updateAdvisor, deleteAdvisor } from "@lib";
import { Advisor, AdvisorPayload, AdvisorUpdatePayload } from "@types";
import styles from "./advisors-page.module.css";
import { useDebounce, useQueryParams, useFilteredAdvisors } from "@hooks";
import { useAlert } from "@context";
import { Button, Input, Modal, Spinner } from "@components";
import AdvisorTable from "./AdvisorTable/AdvisorTable";
import AdvisorForm from "./AdvisorForm/AdvisorForm";
import { noto } from "../_styles/fonts";
import Image from "next/image";

export const metadata = {
  title: "Advisors List",
  description: "View and manage financial advisors.",
};

export default function AdvisorsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { queryParams, setQueryParams } = useQueryParams();
  const { showAlert } = useAlert();

  const [allAdvisors, setAllAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false);
  const [advisorToDelete, setAdvisorToDelete] = useState<Advisor | null>(null);

  const initialSearchQueryParam = searchParams.get("search") || "";
  const initialPageParam = parseInt(searchParams.get("page") || "1");
  const initialSortByParam =
    (searchParams.get("sortBy") as "name" | "income" | "") || "";
  const initialSortOrderParam =
    (searchParams.get("sortOrder") as "asc" | "desc" | "") || "";

  const [searchQuery, setSearchQuery] = useState<string>(
    initialSearchQueryParam
  );
  const [currentPage, setCurrentPage] = useState<number>(initialPageParam);
  const [sortBy, setSortBy] = useState<"name" | "income" | "">(
    initialSortByParam
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">(
    initialSortOrderParam
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchAdvisors = async () => {
      setLoading(true);
      setError(null);
      try {
        const advisors = await getAdvisors();
        setAllAdvisors(advisors);
      } catch (err: any) {
        console.error("Failed to fetch advisors:", err);
        setError(err.message || "Failed to load advisors.");
        showAlert({
          type: "error",
          message: err.message || "Failed to load advisors.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisors();
  }, [showAlert]);

  useEffect(() => {
    const updates: Record<string, string | number> = {};
    if (debouncedSearchQuery) updates.search = debouncedSearchQuery;
    if (currentPage !== 1) updates.page = currentPage;
    if (sortBy) updates.sortBy = sortBy;
    if (sortOrder) updates.sortOrder = sortOrder;

    setQueryParams(updates);
  }, [debouncedSearchQuery, currentPage, sortBy, sortOrder, setQueryParams]);

  const { paginatedAdvisors, totalPages, totalItems } = useFilteredAdvisors(
    allAdvisors,
    currentPage,
    debouncedSearchQuery,
    sortBy,
    sortOrder
  );

  const handlePageChange = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
    router.push(
      `/advisors?${queryParams
        .toString()
        .replace(/page=\d+/, `page=${newPage}`)}`,
      { scroll: false }
    );
  };

  const handleSort = (newSortBy: "name" | "income") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleAddNewAdvisor = () => {
    setEditingAdvisor(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (
    advisorData: AdvisorPayload | AdvisorUpdatePayload
  ) => {
    try {
      if (editingAdvisor) {
        await updateAdvisor(
          editingAdvisor.id,
          advisorData as AdvisorUpdatePayload
        );
        showAlert({
          type: "success",
          message: `Advisor "${
            (advisorData as AdvisorPayload).name
          }" updated successfully!`,
        });
      } else {
        await createAdvisor(advisorData as AdvisorPayload);
        showAlert({
          type: "success",
          message: `Advisor "${
            (advisorData as AdvisorPayload).name
          }" created successfully!`,
        });
      }
      const updatedAdvisors = await getAdvisors();
      setAllAdvisors(updatedAdvisors);
      setIsModalOpen(false);
      setEditingAdvisor(null);
      setCurrentPage(1);
    } catch (err: any) {
      showAlert({ type: "error", message: err.message || "Operation failed." });
      console.error("Form submission error:", err);
    }
  };

  const confirmDeleteAdvisor = async () => {
    if (advisorToDelete) {
      try {
        await deleteAdvisor(advisorToDelete.id);
        showAlert({
          type: "success",
          message: `Advisor "${advisorToDelete.name}" deleted successfully!`,
        });
        setAllAdvisors((prevAdvisors) =>
          prevAdvisors.filter((a) => a.id !== advisorToDelete.id)
        );
        setShowConfirmDeleteModal(false);
        setAdvisorToDelete(null);
        if (paginatedAdvisors.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err: any) {
        showAlert({
          type: "error",
          message: err.message || "Failed to delete advisor.",
        });
        console.error("Delete error:", err);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmDeleteModal(false);
    setAdvisorToDelete(null);
  };

  if (loading) {
    return (
      <div className={styles.advisorsPage__loading}>
        <Spinner size="lg" />
        <p>Loading advisors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.advisorsPage__error}>
        <h2>Error Loading Advisors</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className={styles.advisorsPage}>
      <div className={styles.advisorsPage__headerRow}>
        <div className={styles.advisorsPage__branding}>
          <h1
            className={`${styles.advisorsPage__title} ${noto.className} antialiased`}
          >
            Advisors
          </h1>
        </div>
        <Button
          onClick={handleAddNewAdvisor}
          className={styles.advisorsPage__addNewButton}
        >
          + Add New Advisor
        </Button>
      </div>

      <div className={styles.advisorsPage__contentCard}>
        <div className={styles.advisorsPage__tableHeader}>
          <h2 className={styles.advisorsPage__tableTitle}>Advisors Found</h2>
          <div className={styles.advisorsPage__searchAndFilter}>
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.advisorsPage__tableSearchInput}
              aria-label="Search advisors in table"
            />
          </div>
        </div>

        {paginatedAdvisors.length > 0 ? (
          <AdvisorTable
            advisors={paginatedAdvisors}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        ) : (
          <div className={styles.advisorsPage__noResults}>
            <p>No advisors found matching your criteria.</p>
          </div>
        )}

        <div className={styles.advisorsPage__pagination}>
          <span className={styles["advisorsPage__pagination-info"]}>
            {paginatedAdvisors.length} of {totalItems} Advisors
          </span>

          <div className={styles["advisorsPage__pagination-controls"]}>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="text"
              size="sm"
              className={styles["advisorsPage__pagination-arrow"]}
            >
              <Image
                src="/arrow_left.png"
                alt="Previous"
                width={14}
                height={14}
              />
            </Button>

            {/* Renderizar todas las páginas */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  variant="text"
                  size="sm"
                  className={`${
                    styles["advisorsPage__pagination-pageNumber"]
                  } ${currentPage === pageNum ? styles["active"] : ""}`}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="text"
              size="sm"
              className={styles["advisorsPage__pagination-arrow"]}
            >
              <Image
                src="/arrow_rigth.png"
                alt="Previous"
                width={14}
                height={14}
              />
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={"Add New Advisor"}
        key="user-modal"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              type="button"
            >
              Go Back
            </Button>
            <Button variant="primary" type="submit" form="advisor-form">
              Save Changes
            </Button>
          </>
        }
      >
        <AdvisorForm
          initialData={editingAdvisor || undefined}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      <Modal isOpen={showConfirmDeleteModal} title="Confirm Deletion">
        <div className={styles.advisorsPage__confirmDelete}>
          <p>
            Are you sure you want to delete advisor "{advisorToDelete?.name}"?
          </p>
          <div className={styles["advisorsPage__confirmDelete-actions"]}>
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteAdvisor}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
