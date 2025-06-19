import { useState, useCallback } from 'react';
import { validate } from '@lib';
import { ValidationErrors, ValidationSchema } from '@types';

export const useFormValidation = <T extends Record<string, any>>(
    initialData: T,
    schema: ValidationSchema<T>
) => {
    const [formData, setFormData] = useState<T>(initialData);
    const [errors, setErrors] = useState<ValidationErrors<T>>({});

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = event.target;

        const newValue: string | number = type === 'number' ? parseFloat(value) : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));

        if (errors[name as keyof T]) {
            setErrors((prevErrors: any) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name as keyof T];
                return newErrors;
            });
        }
    }, [errors]);

    const setFieldValue = useCallback((fieldName: keyof T, value: T[keyof T]) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
        if (errors[fieldName]) {
            setErrors((prevErrors: any) => {
                const newErrors = { ...prevErrors };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    }, [errors]);

    const validateForm = useCallback(() => {
        const newErrors = validate(formData, schema);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, schema]);

    const resetForm = useCallback(() => {
        setFormData(initialData);
        setErrors({});
    }, [initialData]);

    return {
        formData,
        setFormData,
        errors,
        handleChange,
        setFieldValue,
        validateForm,
        resetForm,
    };
};