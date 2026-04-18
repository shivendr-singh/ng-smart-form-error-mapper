# smart-form-error-mapper

> Centralized, plug-and-play Angular form validation messages with i18n support.  
> Zero boilerplate. One line per input.

[![Angular](https://img.shields.io/badge/Angular-17%2B-red)](https://angular.dev)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## The Problem

```ts
// ❌ Before — repeated in every template
<div *ngIf="f.get('email')?.errors?.['required'] && f.get('email')?.touched">
  Email is required.
</div>
<div *ngIf="f.get('email')?.errors?.['email'] && f.get('email')?.touched">
  Invalid email address.
</div>
```

## The Solution

```html
<!-- ✅ After — one attribute, done -->
<input formControlName="email" appError />
```

---

## Installation

```bash
npm install smart-form-error-mapper
```

---

## Quick Start

### 1. Register global messages (`app.config.ts`)

```ts
import { provideFormErrors } from 'smart-form-error-mapper';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormErrors({
      required:  () => 'This field is required.',
      email:     () => 'Enter a valid email address.',
      minlength: (p) => `Minimum ${p.requiredLength} characters.`,
      maxlength: (p) => `Maximum ${p.requiredLength} characters.`,
      min:       (p) => `Value must be at least ${p.min}.`,
      max:       (p) => `Value must be at most ${p.max}.`,
    }),
  ],
};
```

### 2. Use the directive in any template

```ts
import { AppErrorDirective } from 'smart-form-error-mapper';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, AppErrorDirective],
  template: `
    <input formControlName="email" appError />
  `,
})
export class MyComponent { ... }
```

The directive automatically:
- Injects a `<span class="form-error">` sibling element
- Sets `aria-describedby` and `aria-invalid` for accessibility
- Shows the first active error on blur

---

## API Reference

### `provideFormErrors(messages, replace?)`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `messages` | `ErrorMessages` | — | Map of validator key → string \| fn |
| `replace` | `boolean` | `false` | Replace defaults entirely (vs. merge) |

### `AppErrorDirective` inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `appError` | — | — | Selector (required) |
| `errorId` | `string` | `${inputId}-error` | id on the generated `<span>` |
| `errorClass` | `string` | `'form-error'` | CSS class on the generated `<span>` |
| `errorOnDirty` | `boolean` | `false` | Show errors while typing (not only on blur) |

### `<form-error>` component inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `control` | `AbstractControl` | — | The control to observe (required) |
| `showAll` | `boolean` | `false` | Show all failing validators at once |
| `onlyWhenTouched` | `boolean` | `true` | Suppress messages until touched |

### `FormErrorService`

```ts
// Inject directly if you need programmatic access
const svc = inject(FormErrorService);

svc.getError(control)              // → first error string | null
svc.getAllErrors(control)          // → string[]
svc.getError(control, false)       // → ignore touched state
```

---

## i18n / Dynamic Messages

```ts
// With ngx-translate
import { TranslateService } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: FORM_ERRORS,
      useFactory: (t: TranslateService) => ({
        required:  () => t.instant('validation.required'),
        minlength: (p) => t.instant('validation.minlength', p),
      }),
      deps: [TranslateService],
    },
  ],
};
```

---

## Custom Validators

```ts
// 1. Define your validator
function noSpaces(ctrl: AbstractControl): ValidationErrors | null {
  return ctrl.value?.includes(' ') ? { noSpaces: true } : null;
}

// 2. Register its message
provideFormErrors({ noSpaces: () => 'No spaces allowed.' })

// 3. Attach to a control — error shows automatically
this.fb.control('', [noSpaces])
```

---

## CSS Customisation

Style the auto-injected error spans globally:

```css
/* Global styles */
.form-error {
  display: block;
  font-size: 0.8rem;
  color: #e53e3e;
  margin-top: 0.25rem;
}

/* Style the input when an error is active */
input.ng-error-active {
  border-color: #e53e3e;
}
```

Override the CSS variable used by `<form-error>`:

```css
:root {
  --fe-error-color: #c53030;
}
```

---

## File Structure

```
lib/
  src/
    lib/
      form-errors.token.ts      ← InjectionToken + DEFAULT_ERRORS
      provide-form-errors.ts    ← provideFormErrors() helper
      form-error.service.ts     ← FormErrorService (resolves messages)
      app-error.directive.ts    ← appError directive (plug & play)
      form-error.component.ts   ← <form-error> component (explicit placement)
    public-api.ts               ← exports
  ng-package.json
  package.json
```

---

## License

MIT
