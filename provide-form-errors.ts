import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ErrorMessages, FORM_ERRORS, DEFAULT_ERRORS } from './form-errors.token';

/**
 * Provide custom (or i18n-aware) error messages.
 * Merges with DEFAULT_ERRORS — only override what you need.
 *
 * Usage in app.config.ts:
 *   providers: [provideFormErrors({ required: () => t('errors.required') })]
 *
 * @param messages  Partial map of validator key → string | fn
 * @param replace   Set true to replace defaults entirely instead of merging
 */
export function provideFormErrors(
  messages: ErrorMessages,
  replace = false,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: FORM_ERRORS,
      useValue: replace ? messages : { ...DEFAULT_ERRORS, ...messages },
    },
  ]);
}
