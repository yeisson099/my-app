import React, { useEffect } from "react";

import { advisorFormSchema } from "@lib"; 
import styles from "./AdvisorForm.module.css";
import { Advisor, AdvisorPayload, AdvisorUpdatePayload } from "@types";
import { Input, Button } from "@components";
import { useFormValidation } from "../../_hooks";

interface AdvisorFormProps {
  initialData?: Advisor | null;
  onSubmit: (data: AdvisorPayload | AdvisorUpdatePayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AdvisorForm: React.FC<AdvisorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {

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
    } else {
      // resetForm();
    }
  }, [initialData]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: "/images/placeholder-avatar.png",
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
    <form onSubmit={handleSubmit} className={styles.advisorForm}>
      <div className={styles.advisorForm__avatarSection}>
        <div className={styles.advisorForm__avatarPreview}>
          <img
            src={formData.avatar || "/images/placeholder-avatar.png"}
            alt="Advisor Avatar"
            className={styles["advisorForm__avatarPreview-img"]}
          />
        </div>
        <div className={styles.advisorForm__avatarActions}>
          <Button
            variant="secondary"
            type="button"
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            Upload Picture
          </Button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          {formData.avatar &&
            formData.avatar !== "/images/placeholder-avatar.png" && (
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
          name="firstName"
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
        {/* <Select
          label="Years of Experience"
          name="years_of_experience"
          value={formData.years_of_experience}
          options={yearsOfExperienceOptions}
          onChange={(value) => handleSelectChange("years_of_experience", value)}
          error={errors.years_of_experience}
          fullWidth
        /> */}
      </div>

      <div className={styles.advisorForm__actions}>
        <Button variant="text" onClick={onCancel} type="button">
          Go Back
        </Button>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default AdvisorForm;
