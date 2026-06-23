## Context

The current public home page is a server component that renders static marketing content plus auth-aware text. It does not yet include any interactive registration flow, shared UI primitives, or frontend form handling patterns. The requested change adds an interaction that spans the homepage UI, a modal dialog, client-side validation and state transitions, and a Next.js API route that returns submitted values for verification.

This feature is intentionally scoped as a local prototype: no persistence, email delivery, or Payload collection integration is required. The main constraint is to add the flow without converting the entire page into a client component or introducing unnecessary dependencies.

## Goals / Non-Goals

**Goals:**
- Keep the existing server-rendered home page intact while introducing a focused client-side registration flow.
- Add a modal form that matches the requested fields and validation rules.
- Submit the form to a Next.js API route and provide clear loading and success states.
- Keep the success state visible until the modal is closed, then reset on the next open.

**Non-Goals:**
- Persist registrations to Payload or a database.
- Send emails, trigger external services, or add admin reporting.
- Build a generalized reusable design system for dialogs and forms beyond this feature.
- Introduce third-party form or modal libraries unless the implementation becomes blocked without them.

## Decisions

### Use a client component nested inside the server home page

The homepage should remain a server component for its existing auth and layout behavior. A dedicated client component can own the CTA button, modal visibility, form state, submission state, and success rendering.

Alternative considered:
- Convert the entire page to a client component. Rejected because it broadens the interactive surface unnecessarily and mixes server concerns with local UI state.

### Use a local modal implementation styled with existing Tailwind utilities

The repo does not currently expose a shared dialog primitive in app code. A local modal component with an overlay, close button, focusable structure, and responsive layout is the most direct path for the requested UX and styling.

Alternative considered:
- Adopt a transitive modal package already present in the lockfile. Rejected because it is not part of the app’s established frontend surface and would add integration complexity for a single feature.

### Submit to a Next.js API route that echoes normalized request data

The API route should accept the registration payload, validate required fields, and return the submitted values in a JSON success response. This satisfies the current verification goal while preserving a clear future seam for persistence or notifications.

Alternative considered:
- Post directly to Payload. Rejected because there is no persistence requirement and the user only needs request/response verification at this stage.

### Model the modal as a finite set of UI states

The modal flow should move through `form`, `submitting`, and `success` states. Validation errors remain within the form state. Closing the modal should clear local state so the next open starts with a blank form.

Alternative considered:
- Keep form fields mounted and mutate pieces of UI ad hoc. Rejected because explicit states make the loading and success requirements easier to reason about and test.

## Risks / Trade-offs

- [Accessibility details can be missed in a custom modal] -> Add keyboard-close behavior, clear close affordance, and basic dialog semantics during implementation.
- [Prototype API contract may be mistaken for a final backend design] -> Keep the route narrowly named and document that it currently echoes data for verification only.
- [Local component structure may be less reusable later] -> Keep form data shape and modal boundaries clean so the flow can be extracted into shared components if the product expands.
- [Validation drift between client and server] -> Use the same required field list and payload shape in both layers when implementing.

## Migration Plan

No data migration is required.

Deployment path:
1. Add the new client-side registration component to the homepage.
2. Add the API route for registration submissions.
3. Verify the form, loading state, success state, and modal reset behavior locally.

Rollback strategy:
- Revert the homepage CTA and registration route together. The feature is self-contained and does not affect stored data.

## Open Questions

- None at this time. Required fields, optional `boatNumber`, and success-state lifecycle have been clarified during exploration.
