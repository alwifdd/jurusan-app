// File: src/components/Modal/Modal.tsx
"use client";
import React from "react";
import styles from "../styles/Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <span role="img" aria-label="warning">
              ⚠️
            </span>{" "}
            {title}
          </h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div className={styles.content}>{children}</div>
        <div className={styles.footer}>
          <button onClick={onClose} className={styles.cancelButton}>
            Batal
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
