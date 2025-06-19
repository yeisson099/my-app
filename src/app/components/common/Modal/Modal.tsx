'use client'

import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import { Button } from "@components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modal__overlay} onClick={handleOverlayClick}>
      <div
        className={styles.modal__content}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        ref={modalRef}
      >
        <div className={styles.modal__header}>
          {title && (
            <h2 id="modal-title" className={styles.modal__title}>
              {title}
            </h2>
          )}
          <Button
            variant="text"
            onClick={onClose}
            className={styles["modal__close-button"]}
            aria-label="Close modal"
          >
            &times;
          </Button>
        </div>
        <div className={styles.modal__body}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
