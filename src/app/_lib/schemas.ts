import { AdvisorPayload, ValidationSchema } from '@types';


export const advisorFormSchema: ValidationSchema<AdvisorPayload> = {
    name: [
        { type: 'required', message: 'Name is required.' },
        { type: 'minLength', value: 3, message: 'Name must be at least 3 characters long.' },
        { type: 'maxLength', value: 100, message: 'Name cannot exceed 100 characters.' },
    ],
    avatar: [
        { type: 'required', message: 'Avatar URL is required.' },
        { type: 'pattern', regex: /^https?:\/\/.+\.(png|jpg|jpeg|gif|svg)$/i, message: 'Avatar must be a valid image URL.' },
    ],
    email: [
        { type: 'required', message: 'Email is required.' },
        { type: 'email', message: 'Please enter a valid email address.' },
    ],
    phone: [
        { type: 'required', message: 'Phone number is required.' },
        { type: 'pattern', regex: /^\d{3}-\d{3}-\d{4}$/, message: 'Phone must be in XXX-XXX-XXXX format.' },
    ],
    address: [
        { type: 'required', message: 'Address is required.' },
        { type: 'minLength', value: 5, message: 'Address must be at least 5 characters long.' },
        { type: 'maxLength', value: 200, message: 'Address cannot exceed 200 characters.' },
    ],
    income: [
        { type: 'required', message: 'Income is required.' },
        { type: 'min', value: 0, message: 'Income cannot be negative.' }
    ],
};