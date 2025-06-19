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
            <div className={styles.advisorDetailPage__actions}>
              <Button
                variant="danger"
                onClick={handleDeleteClick}
                className={styles.advisorDetailPage__deleteButton}
              >
                <Image
                  src={"/delete.png"}
                  alt={"delete"}
                  width={16}
                  height={16}
                />
                Delete
              </Button>
              <Button
                variant="secondary"
                onClick={handleEditClick}
                className={styles.advisorDetailPage__editButton}
              >
                <Image src={"/edit.png"} alt={"edit"} width={16} height={16} />
                Edit Advisor
              </Button>
            </div>
          </div>
          <div className={styles.advisorDetailPage__locationAndFirm}>
            <h2
              className={`${styles.advisorDetailPage__name} ${noto.className} antialiased`}
            >
              {advisor.name}{" "}
            </h2>
            <span className={styles.advisorDetailPage__credentials}>
              N/A
              {/* {certification} */}
            </span>
            <span className={styles.advisorDetailPage__location}>
              <Image src={"/location.png"} alt={"location"} width={10} height={14} />
              N/A
              {/* city  */}
            </span>
            <span className={styles.advisorDetailPage__firm}>
              <Image src={"/company.png"} alt={"company"} width={14} height={14} />
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
