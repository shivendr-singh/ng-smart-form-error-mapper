import { ApplicationConfig } from '@angular/core';
import { provideFormErrors } from 'ng-smart-form-error-mapper';

export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Register error messages once here — they apply to every form in the app.
     * For i18n, swap the arrow functions for calls to your translation service,
     * e.g. () => inject(TranslateService).instant('errors.required')
     */
    provideFormErrors({
      required:         () => '⚠ This field cannot be empty.',
      email:            () => '✉ Enter a valid email (e.g. you@example.com).',
      minlength:        (p) => `🔡 Need at least ${p.requiredLength} characters.`,
      maxlength:        (p) => `✂ Max ${p.requiredLength} characters allowed.`,
      min:              (p) => `📉 Minimum value is ${p.min}.`,
      max:              (p) => `📈 Maximum value is ${p.max}.`,
      pattern:          () => '🔤 Doesn\'t match the required format.',
      // Custom validator key — must match what your validator returns:
      passwordStrength: () => '🔒 Password must contain uppercase, number & special char.',
      passwordMatch:    () => '🔑 Passwords do not match.',
    }),
  ],
};
