'use client'

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getAdvisors,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor,
} from "@lib";
import { Advisor, AdvisorPayload, AdvisorUpdatePayload } from "@types";
import styles from "./advisors-page.module.css";
import { useDebounce, useQueryParams } from "../_hooks";
import { useAlert } from "@context";
import { Button, Input, Modal, Spinner } from "@components";
import AdvisorTable from "./AdvisorTable/AdvisorTable";
import AdvisorForm from "./AdvisorForm/AdvisorForm";
import Image from "next/image";
import { noto } from "../_styles/fonts";

const ITEMS_PER_PAGE = 10;

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
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
  const [advisorToDelete, setAdvisorToDelete] = useState<Advisor | null>(null);

  const initialSearchQueryParam = searchParams.get('search') || '';
  const initialPageParam = parseInt(searchParams.get('page') || '1');
  const initialSortByParam = (searchParams.get('sortBy') as 'name' | 'income' | '') || '';
  const initialSortOrderParam = (searchParams.get('sortOrder') as 'asc' | 'desc' | '') || '';

  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQueryParam);
  const [currentPage, setCurrentPage] = useState<number>(initialPageParam);
  const [sortBy, setSortBy] = useState<'name' | 'income' | ''>(initialSortByParam);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>(initialSortOrderParam);

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
        setError(err.message || 'Failed to load advisors.');
        showAlert({ type: 'error', message: err.message || 'Failed to load advisors.' });
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

  const filteredAdvisors = useMemo(() => {
    let currentAdvisors = [...allAdvisors ?? []];

    if (debouncedSearchQuery) {
      const searchLower = debouncedSearchQuery.toLowerCase();
      currentAdvisors = currentAdvisors.filter(
        (advisor) =>
          advisor.name.toLowerCase().includes(searchLower) ||
          advisor.email.toLowerCase().includes(searchLower) ||
          advisor.address.toLowerCase().includes(searchLower) ||
          advisor.phone.toLowerCase().includes(searchLower)
      );
    }

    if (sortBy && sortOrder) {
      currentAdvisors.sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        if (sortBy === 'name') {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        } else if (sortBy === 'income') {
          valA = a.income;
          valB = b.income;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return currentAdvisors;
  }, [allAdvisors, debouncedSearchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAdvisors.length / ITEMS_PER_PAGE);
  const paginatedAdvisors = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAdvisors.slice(startIndex, endIndex);
  }, [filteredAdvisors, currentPage]);

  const handlePageChange = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
    router.push(`/advisors?${queryParams.toString().replace(/page=\d+/, `page=${newPage}`)}`, { scroll: false });
  };

  const handleSort = (newSortBy: 'name' | 'income') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleAddNewAdvisor = () => {
    setEditingAdvisor(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (advisorData: AdvisorPayload | AdvisorUpdatePayload) => {
    try {
      if (editingAdvisor) {
        await updateAdvisor(editingAdvisor.id, advisorData as AdvisorUpdatePayload);
        showAlert({ type: 'success', message: `Advisor "${(advisorData as AdvisorPayload).name}" updated successfully!` });
      } else {
        await createAdvisor(advisorData as AdvisorPayload);
        showAlert({ type: 'success', message: `Advisor "${(advisorData as AdvisorPayload).name}" created successfully!` });
      }
      const updatedAdvisors = await getAdvisors();
      setAllAdvisors(updatedAdvisors);
      setIsModalOpen(false);
      setEditingAdvisor(null);
      setCurrentPage(1);
    } catch (err: any) {
      showAlert({ type: 'error', message: err.message || 'Operation failed.' });
      console.error('Form submission error:', err);
    }
  };

  const confirmDeleteAdvisor = async () => {
    if (advisorToDelete) {
      try {
        await deleteAdvisor(advisorToDelete.id);
        showAlert({ type: 'success', message: `Advisor "${advisorToDelete.name}" deleted successfully!` });
        setAllAdvisors((prevAdvisors) => prevAdvisors.filter(a => a.id !== advisorToDelete.id));
        setShowConfirmDeleteModal(false);
        setAdvisorToDelete(null);
        if (paginatedAdvisors.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err: any) {
        showAlert({ type: 'error', message: err.message || 'Failed to delete advisor.' });
        console.error('Delete error:', err);
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
            {paginatedAdvisors.length} of {filteredAdvisors.length} Advisors
          </span>
          <div className={styles["advisorsPage__pagination-controls"]}>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="text"
              size="sm"
              className={styles["advisorsPage__pagination-arrow"]}
            >
              &lt;
            </Button>
            <span className={styles["advisorsPage__pagination-pageNumber"]}>
              {currentPage}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="text"
              size="sm"
              className={styles["advisorsPage__pagination-arrow"]}
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAdvisor ? "Edit Advisor Information" : "Add New Advisor"} // Updated title as per image
      >
        <AdvisorForm
          initialData={editingAdvisor || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={showConfirmDeleteModal}
        onClose={cancelDelete}
        title="Confirm Deletion"
      >
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
