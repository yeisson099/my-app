export type ValidationRule =
    | { type: 'required'; message?: string }
    | { type: 'minLength'; value: number; message?: string }
    | { type: 'maxLength'; value: number; message?: string }
    | { type: 'email'; message?: string }
    | { type: 'pattern'; regex: RegExp; message?: string }
    | { type: 'min'; value: number; message?: string }
    | { type: 'max'; value: number; message?: string };

export type ValidationSchema<T> = {
    [K in keyof T]?: ValidationRule[];
};

export type ValidationErrors<T> = {
    [K in keyof T]?: string;
};