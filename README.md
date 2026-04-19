# ng-smart-form-error-mapper

> Centralized, plug-and-play Angular form validation messages with i18n support.
> Zero boilerplate. One line per input.

[![Angular](https://img.shields.io/badge/Angular-17%2B-red)](https://angular.dev)
[![npm](https://img.shields.io/npm/v/ng-smart-form-error-mapper)](https://www.npmjs.com/package/ng-smart-form-error-mapper)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## The Problem

```html
<!-- ❌ Before — repeated in every template -->
<div *ngIf="f.get('email')?.errors?.['required'] && f.get('email')?.touched">
  Email is required.
</div>
```

## The Solution

```html
<!-- ✅ After — one attribute, done -->
<input formControlName="email" appError />
```

## Installation

```bash
npm install ng-smart-form-error-mapper
```

## Quick Start

```ts
// app.config.ts
provideFormErrors({
  required:  () => 'This field is required.',
  email:     () => 'Enter a valid email address.',
  minlength: (p) => `Minimum ${p.requiredLength} characters.`,
})
```

```html
<!-- template -->
<input formControlName="email" appError />
<input formControlName="bio"   appError [errorOnDirty]="true" />
<form-error [control]="form.get('password')" [showAll]="true" />
```

## Demo

Try it: [Demo](https://shivendr-singh.github.io/ng-smart-form-error-mapper/)

See [README](projects/ng-smart-form-error-mapper/README.md) and [CHANGELOG](CHANGELOG.md) for full docs.

## License
MIT
