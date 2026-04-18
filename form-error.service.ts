import { inject, Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ErrorMessageFn, FORM_ERRORS } from './form-errors.token';

@Injectable({ providedIn: 'root' })
export class FormErrorService {
  private readonly errorMap = inject(FORM_ERRORS);

  /**
   * Returns the first human-readable error message for the given control,
   * or null if the control is valid / untouched.
   *
   * @param control   The AbstractControl to inspect
   * @param onlyWhenTouched  Default true — suppresses messages until blurred
   */
  getError(control: AbstractControl, onlyWhenTouched = true): string | null {
    if (!control.errors) return null;
    if (onlyWhenTouched && !control.touched) return null;

    for (const key of Object.keys(control.errors)) {
      const msg = this.errorMap[key];
      if (msg == null) {
        // Fallback: show raw validator key so devs notice unmapped errors
        return `Validation error: ${key}`;
      }
      const params = control.errors[key];
      return typeof msg === 'function'
        ? (msg as ErrorMessageFn)(params)
        : msg;
    }
    return null;
  }

  /**
   * Returns ALL active error messages (useful for verbose UIs).
   */
  getAllErrors(control: AbstractControl, onlyWhenTouched = true): string[] {
    if (!control.errors) return [];
    if (onlyWhenTouched && !control.touched) return [];

    return Object.keys(control.errors).map((key) => {
      const msg = this.errorMap[key];
      if (msg == null) return `Validation error: ${key}`;
      const params = control.errors![key];
      return typeof msg === 'function' ? (msg as ErrorMessageFn)(params) : msg;
    });
  }
}
