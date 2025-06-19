import React, { useEffect, useState } from "react";

import { advisorFormSchema } from "@lib";
import styles from "./AdvisorForm.module.css";
import { Advisor, AdvisorPayload, AdvisorUpdatePayload } from "@types";
import { Input, Button, Modal } from "@components";
import { useFormValidation } from "../../_hooks";
import Image from "next/image";

interface AdvisorFormProps {
  initialData?: Advisor | null;
  onSubmit: (data: AdvisorPayload | AdvisorUpdatePayload) => void;
  isLoading?: boolean;
}

const AdvisorForm: React.FC<AdvisorFormProps> = ({ initialData, onSubmit }) => {
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);

  const initialFormState: AdvisorPayload = {
    name: initialData?.name || "",
    avatar: initialData?.avatar || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    income: initialData?.income || 0,
  };

  const {
    formData,
    setFormData,
    errors,
    handleChange,
    validateForm,
    resetForm,
  } = useFormValidation(initialFormState, advisorFormSchema);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        avatar: initialData.avatar,
        email: initialData.email,
        phone: initialData.phone,
        address: initialData.address,
        income: initialData.income,
      });
    }
  }, [initialData]);

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: "/placeholder-avatar.png",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit: AdvisorPayload = {
        ...formData,
        income: Number(formData.income),
      };
      onSubmit(dataToSubmit);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.advisorForm}
      id="advisor-form"
    >
      <div className={styles.advisorForm__avatarSection}>
        <div className={styles.advisorForm__avatarPreview}>
          <img
            src={formData.avatar || "/placeholder-avatar.png"}
            alt="Advisor Avatar"
            className={styles["advisorForm__avatarPreview-img"]}
          />
        </div>
        <div className={styles.advisorForm__avatarActions}>
          <Button
            variant="secondary"
            type="button"
            onClick={() => setShowAvatarModal(true)}
            className={styles.advisorForm_upload}
          >
            <Image src={"/upload.png"} alt={"upload"} width={14} height={14} />
            Upload Picture
          </Button>

          <Modal
            isOpen={showAvatarModal}
            title="Add Avatar URL"
            key="avatar-modal"
            actions={
              <>
                <Button
                  variant="secondary"
                  onClick={() => setShowAvatarModal(false)}
                  type="button"
                >
                  Go Back
                </Button>
              </>
            }
          >
            <Input
              id="avatar"
              label="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              error={errors.avatar}
            />
          </Modal>
          {formData.avatar && formData.avatar !== "/placeholder-avatar.png" && (
            <Button
              variant="danger"
              type="button"
              onClick={handleRemoveAvatar}
              className={styles.advisorForm__removeAvatarButton}
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      <div className={styles.advisorForm__grid}>
        <Input
          label="First Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input label="Last Name" name="lastName" disabled />
        <Input label="ID Number" name="id" disabled />
        <Input
          label="Income"
          type="number"
          name="income"
          value={formData.income || ""}
          onChange={handleChange}
          error={errors.income}
          prefix="$"
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          fullWidth
        />
        <Input
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          fullWidth
        />
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          fullWidth
        />
      </div>
    </form>
  );
};

export default AdvisorForm;
