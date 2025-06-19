"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import Button from "../Button/Button";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  actions,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modal__overlay}>
      <div
        className={styles.modal__container}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        {/* Modal Header */}
        <div className={styles.modal__header}>
          <h2 className={styles.modal__title}>{title}</h2>
        </div>

        {/* Modal Body */}
        <div className={styles.modal__body}>{children}</div>

        {/* Modal (Actions) */}
        {actions && <div className={styles.modal__footer}>{actions}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
