## Why

The public home page currently has no way for a visitor to register interest in a class, which blocks validation of the intended registration flow and its frontend interaction states. We need a scoped end-to-end registration experience now so the homepage can demonstrate the modal form, API submission, loading feedback, and post-submit confirmation behavior.

## What Changes

- Add a new public registration call to action on the home page labeled `Register for class`.
- Add a modal-based registration form that opens from the home page and collects visitor contact and club details.
- Require all form fields except `boatNumber`.
- Submit form data to a Next.js API endpoint and show a loading state while the request is in progress.
- Replace the form with a success state after a successful submission that displays the submitted values for verification.
- Keep the success state visible until the visitor closes the modal, and reset the modal to a fresh form when it is reopened.

## Capabilities

### New Capabilities
- `class-registration-modal`: Public homepage registration modal flow with validation, API submission, loading feedback, and success confirmation.

### Modified Capabilities
- None.

## Impact

- Affects the public frontend home page and styling in `src/app/(frontend)`.
- Adds a new interactive client-side component for the registration CTA and modal workflow.
- Adds a new Next.js API route for receiving and echoing registration submissions.
- May add frontend validation and UI state handling utilities, but does not require external service integration or Payload collection changes.
