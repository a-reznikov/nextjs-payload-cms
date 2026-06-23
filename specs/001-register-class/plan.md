# Implementation Plan: Register for Class

**Branch**: `[codex/001-register-class]` | **Date**: 2026-06-22 | **Spec**: [spec.md](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/specs/001-register-class/spec.md)

**Input**: Feature specification from `/specs/001-register-class/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a prominent "Register for class" call to action to the public home page that opens a modal form matching the provided design, validates required visitor fields, submits the form to a dedicated application endpoint, shows an in-modal loading state during submission, and then renders a success view with the submitted values for verification.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 16

**Primary Dependencies**: Next.js App Router, Payload CMS 3, React DOM, Tailwind CSS 4

**Storage**: N/A for v1 verification flow; the response may echo validated submission data without persistence

**Testing**: Vitest for integration coverage, Playwright for end-to-end browser validation

**Target Platform**: Responsive web browsers served by a Next.js application

**Project Type**: Web application with a public frontend and app-routed server endpoints

**Performance Goals**: Modal opens in the current page interaction, and successful submissions return a visible confirmation without forcing navigation or refresh

**Constraints**: Preserve the existing public frontend route group, keep the flow accessible from the home page, prevent duplicate submissions while processing, and maintain usability across mobile and desktop sizes

**Scale/Scope**: One home page CTA, one modal workflow, one submission endpoint, one success-state verification view, and matching test coverage for the primary path

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The current `.specify/memory/constitution.md` contains placeholder template content rather than enforceable project rules. No concrete constitutional gates are defined yet, so there are no blocking violations before research or after design.

## Project Structure

### Documentation (this feature)

```text
specs/001-register-class/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── register-class-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (frontend)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── styles.css
│   ├── (payload)/
│   │   ├── admin/
│   │   └── api/
│   └── my-route/
│       └── route.ts
├── collections/
├── payload.config.ts
└── payload-types.ts

tests/
├── e2e/
│   ├── admin.e2e.spec.ts
│   └── frontend.e2e.spec.ts
└── int/
    └── api.int.spec.ts
```

**Structure Decision**: Use the existing single Next.js application structure. The feature belongs in `src/app/(frontend)` for the public UI and in a new app-route endpoint under `src/app` for submission handling, with automated validation added to the existing `tests/e2e` and `tests/int` suites.

## Complexity Tracking

No constitutional violations or exceptional complexity require justification at planning time.
