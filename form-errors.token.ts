import { InjectionToken } from '@angular/core';

/**
 * A function that resolves an error message.
 * Receives the validator's error value (e.g. { min: 5, actual: 2 }) 
 * and returns a human-readable string.
 */
export type ErrorMessageFn = (params?: any) => string;

/**
 * Map of validator key → message string or message factory function.
 * e.g. { required: 'This field is required', minlength: (p) => `Min ${p.requiredLength} chars` }
 */
export type ErrorMessages = Record<string, string | ErrorMessageFn>;

/**
 * Injection token for providing global error messages.
 */
export const FORM_ERRORS = new InjectionToken<ErrorMessages>('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => DEFAULT_ERRORS,
});

/**
 * Built-in English defaults — override any or all via provideFormErrors().
 */
export const DEFAULT_ERRORS: ErrorMessages = {
  required:        () => 'This field is required.',
  email:           () => 'Please enter a valid email address.',
  minlength:       (p) => `Minimum ${p.requiredLength} characters (you entered ${p.actualLength}).`,
  maxlength:       (p) => `Maximum ${p.requiredLength} characters (you entered ${p.actualLength}).`,
  min:             (p) => `Value must be at least ${p.min}.`,
  max:             (p) => `Value must be at most ${p.max}.`,
  pattern:         () => 'Please match the required format.',
  nullValidator:   () => '',
};
