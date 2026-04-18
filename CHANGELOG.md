# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- `FORM_ERRORS` injection token with built-in English defaults
- `provideFormErrors()` helper — merges or replaces defaults
- `FormErrorService` — resolves first or all active error messages
- `AppErrorDirective` (`appError`) — plug-and-play, auto-injects sibling `<span>`
- `FormErrorComponent` (`<form-error>`) — explicit placement with `showAll` support
- Full accessibility: `aria-describedby`, `aria-invalid`, `aria-live`
- i18n support via factory functions
- `[errorOnDirty]` input for instant feedback mode
