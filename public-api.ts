/*
 * Public API Surface of smart-form-error-mapper
 */
export { FORM_ERRORS, DEFAULT_ERRORS } from './lib/form-errors.token';
export type { ErrorMessages, ErrorMessageFn } from './lib/form-errors.token';
export { provideFormErrors }        from './lib/provide-form-errors';
export { FormErrorService }         from './lib/form-error.service';
export { AppErrorDirective }        from './lib/app-error.directive';
export { FormErrorComponent }       from './lib/form-error.component';
