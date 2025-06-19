import { ValidationErrors, ValidationRule, ValidationSchema } from '@types';

/**
 * Validates a data object against a provided validation schema.
 * @param data The data object to validate.
 * @param schema The validation schema defining rules for each field.
 * @returns An object containing validation errors, where keys are field names and values are error messages.
 */
export const validate = <T extends Record<string, any>>(
    data: T,
    schema: ValidationSchema<T>
): ValidationErrors<T> => {
    const errors: ValidationErrors<T> = {};

    for (const key in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, key)) {
            const rules = schema[key as keyof T];
            const value = data[key];

            if (rules) {
                for (const rule of rules) {
                    let isValid = true;
                    let errorMessage = rule.message || `Invalid value for ${String(key)}.`;

                    switch (rule.type) {
                        case 'required':
                            isValid = (value !== null && value !== undefined && value !== '');
                            errorMessage = rule.message || `${String(key)} is required.`;
                            break;
                        case 'minLength':
                            isValid = typeof value === 'string' && value.length >= rule.value;
                            errorMessage = rule.message || `${String(key)} must be at least ${rule.value} characters long.`;
                            break;
                        case 'maxLength':
                            isValid = typeof value === 'string' && value.length <= rule.value;
                            errorMessage = rule.message || `${String(key)} cannot exceed ${rule.value} characters.`;
                            break;
                        case 'email':
                            isValid = typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                            errorMessage = rule.message || `${String(key)} must be a valid email address.`;
                            break;
                        case 'pattern':
                            isValid = typeof value === 'string' && rule.regex.test(value);
                            errorMessage = rule.message || `${String(key)} format is invalid.`;
                            break;
                        case 'min':
                            isValid = (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) && Number(value) >= rule.value;
                            errorMessage = rule.message || `${String(key)} must be at least ${rule.value}.`;
                            break;
                        case 'max':
                            isValid = (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) && Number(value) <= rule.value;
                            errorMessage = rule.message || `${String(key)} cannot exceed ${rule.value}.`;
                            break;
                        default:
                            console.warn(`Unknown validation rule type: ${(rule as any).type}`);
                            break;
                    }

                    if (!isValid) {
                        errors[key as keyof T] = errorMessage;
                        break;
                    }
                }
            }
        }
    }
    return errors;
};