"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./advisor-detail-page.module.css";
import { Advisor, AdvisorPayload, AdvisorUpdatePayload } from "@types";
import { useAlert } from "@context";
import { deleteAdvisor, updateAdvisor } from "@lib";
import { Button, Modal, Spinner } from "@components";
import AdvisorForm from "../AdvisorForm/AdvisorForm";
import { noto } from "../../_styles/fonts";

interface AdvisorDetailPageContentProps {
  initialAdvisorData: Advisor;
}

export default function AdvisorDetailPageContent({
  initialAdvisorData,
}: AdvisorDetailPageContentProps) {
  const [advisor, setAdvisor] = useState<Advisor>(initialAdvisorData);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false);
  const router = useRouter();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAdvisor(initialAdvisorData);
  }, [initialAdvisorData]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (
    advisorData: AdvisorPayload | AdvisorUpdatePayload
  ) => {
    setLoading(true);
    try {
      await updateAdvisor(advisor.id, advisorData as AdvisorUpdatePayload);
      setAdvisor((prev: Advisor) => ({
        ...prev,
        ...(advisorData as AdvisorUpdatePayload),
      }));
      showAlert({
        type: "success",
        message: `Advisor "${advisorData.name}" updated successfully!`,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      showAlert({
        type: "error",
        message: err.message || "Failed to update advisor.",
      });
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDeleteModal(true);
  };

  const confirmDeleteAdvisor = async () => {
    setLoading(true);
    try {
      await deleteAdvisor(advisor.id);
      showAlert({
        type: "success",
        message: `Advisor "${advisor.name}" deleted successfully!`,
      });
      setShowConfirmDeleteModal(false);
      router.push("/advisors");
    } catch (err: any) {
      showAlert({
        type: "error",
        message: err.message || "Failed to delete advisor.",
      });
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.advisorDetailPage}>
      {loading && <Spinner />}
      <div className={styles.advisorDetailPage__contentCard}>
        <div className={styles.advisorDetailPage__header}>
          <Button
            onClick={() => router.back()}
            variant="secondary"
            size="sm"
            className={styles.advisorDetailPage__goBackButton}
          >
            Go Back
          </Button>
          <div className={styles.advisorDetailPage__actions}>
            <Button
              variant="danger"
              onClick={handleDeleteClick}
              className={styles.advisorDetailPage__deleteButton}
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={handleEditClick}
              className={styles.advisorDetailPage__editButton}
            >
              Edit Advisor
            </Button>
          </div>
        </div>

        <div className={styles.advisorDetailPage__profileInfo}>
          <div className={styles.advisorDetailPage__avatarContainer}>
            <Image
              src={advisor.avatar || "/images/placeholder-avatar.png"}
              alt={advisor.name}
              width={120}
              height={120}
              className={styles.advisorDetailPage__avatar}
            />
          </div>
          <h2
            className={`${styles.advisorDetailPage__name} ${noto.className} antialiased`}
          >
            {advisor.name}{" "}
            <span className={styles.advisorDetailPage__credentials}>
              N/A
              {/* {certification} */}
            </span>
          </h2>
          <div className={styles.advisorDetailPage__locationAndFirm}>
            <span className={styles.advisorDetailPage__location}>
              <svg
                className={styles["advisorDetailPage__icon"]}
                viewBox="0 0 24 24"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
              N/A
              {/* city  */}
            </span>
            <span className={styles.advisorDetailPage__firm}>
              <svg
                className={styles["advisorDetailPage__icon"]}
                viewBox="0 0 24 24"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              N/A
              {/* company  */}
            </span>
          </div>
        </div>

        <div className={styles.advisorDetailPage__detailsGrid}>
          <div className={styles.advisorDetailPage__detailItem}>
            <span className={styles.advisorDetailPage__detailLabel}>
              ID Number
            </span>
            <span className={styles.advisorDetailPage__detailValue}>
              {advisor.id}
            </span>
          </div>
          <div className={styles.advisorDetailPage__detailItem}>
            <span className={styles.advisorDetailPage__detailLabel}>
              Income
            </span>
            <span className={styles.advisorDetailPage__detailValue}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(advisor.income)}
            </span>
          </div>
          <div className={styles.advisorDetailPage__detailItem}>
            <span className={styles.advisorDetailPage__detailLabel}>
              Education
            </span>
            <span className={styles.advisorDetailPage__detailValue}>
              N/A
              {/* university */}
            </span>
          </div>
          <div className={styles.advisorDetailPage__detailItem}>
            <span className={styles.advisorDetailPage__detailLabel}>Title</span>
            <span className={styles.advisorDetailPage__detailValue}>
              N/A
              {/* title*/}
            </span>
          </div>
          <div className={styles.advisorDetailPage__detailItem}>
            <span className={styles.advisorDetailPage__detailLabel}>
              Years of Experience
            </span>
            <span className={styles.advisorDetailPage__detailValue}>
              N/A
              {/* exprience */}
            </span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Edit Advisor Information"
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
        <AdvisorForm initialData={advisor} onSubmit={handleFormSubmit} />
      </Modal>

      <Modal
        isOpen={showConfirmDeleteModal}
        title="Confirm Deletion"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteAdvisor}>
              Delete
            </Button>
          </>
        }
      >
        <div className={styles.advisorDetailPage__confirmDelete}>
          <p>Are you sure you want to delete advisor "{advisor.name}"?</p>
        </div>
      </Modal>
    </div>
  );
}
