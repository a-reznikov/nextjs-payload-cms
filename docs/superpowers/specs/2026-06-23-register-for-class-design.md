# Register For Class Modal Design

## Summary

Add a new `Register for class` call to action to the public home page. Clicking the button opens a modal with a registration form based on the provided mockup. Submitting the form sends the entered values to a Next.js API route, shows a loading state while the request is in flight, and then replaces the form with a success view that renders the submitted data as plain text for verification.

## Goals

- Add a visible `Register for class` button to the home page.
- Show a modal form that matches the provided layout closely enough to feel intentional within the current frontend.
- Require every field except `Boat number`.
- Submit the form to a local Next.js API endpoint.
- Show a pending state during submission.
- Show a success state containing the submitted values returned by the API.

## Non-Goals

- Persisting registrations in Payload or a database.
- Sending emails or integrating third-party services.
- Building a reusable design system for modal and form primitives.
- Reworking unrelated parts of the landing page.

## Current Context

The public home page lives in [src/app/(frontend)/page.tsx](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/src/app/(frontend)/page.tsx) as a server component that reads the current Payload auth state and renders a Tailwind-based hero layout. There is no existing modal or form infrastructure in the frontend, and the current end-to-end frontend test only verifies that the page loads and shows the welcome heading.

## Proposed Approach

Keep the page entry point as a server component and introduce a focused client component responsible for the registration interaction. The server component will continue to render the overall home page and will include the new client component near the existing call-to-action buttons.

The client component will own:

- opening and closing the modal
- controlled form state
- client-side required-field validation
- submit request lifecycle
- loader state
- success state rendering

The submission target will be a plain Next.js route handler under the frontend app. The route will validate that required fields are present and return the sanitized payload in JSON so the UI can present it back to the user.

## Component Design

### Home Page Integration

Add a `Register for class` button alongside the current CTA buttons on the home page. The button will use the rounded, filled visual style from the provided screenshot while still fitting the existing Tailwind-based page styling.

### Client Component Boundary

Create a dedicated client component, for example `RegisterForClass`, under the frontend app directory. This component will keep the interactive form logic out of the server-rendered page and make the modal behavior easier to test and evolve.

### Modal Layout

The modal will:

- open centered over a full-screen backdrop
- include a close button in the top-right corner
- render title and helper copy
- use a responsive layout that stacks fields on small screens
- render the following fields in this order:
  - `First name`
  - `Last name`
  - `Email`
  - `Phone`
  - `Address`
  - `Plz`
  - `City`
  - `Sailing club`
  - `Boat number (optional)`
- include a submit button pinned at the bottom of the form content flow

On desktop widths, the paired rows from the mockup can remain side-by-side:

- `First name` and `Last name`
- `Plz` and `City`

On small screens, all inputs will stack into a single column.

### Form State

The form will use a single typed state object with string values for all fields:

- `firstName`
- `lastName`
- `email`
- `phone`
- `address`
- `plz`
- `city`
- `sailingClub`
- `boatNumber`

The component will also track:

- whether the modal is open
- whether a submission is pending
- field-level validation errors after submit attempt
- the successful API response payload
- any submission-level error returned by the route

## Validation Design

### Client Validation

Before sending the request, the client will validate that the following fields are non-empty after trimming whitespace:

- `firstName`
- `lastName`
- `email`
- `phone`
- `address`
- `plz`
- `city`
- `sailingClub`

`boatNumber` remains optional.

For this iteration, validation stays intentionally light:

- required-field checks only
- no custom email format validation beyond the browser's native email input behavior
- no phone or postal-code formatting rules

Inline error text will appear near fields that fail validation after submit is attempted.

### Server Validation

The API route will repeat the same required-field validation on the server so the endpoint does not trust the browser. If validation fails, it will return `400` with a structured JSON error response that the client can surface in the modal.

## API Design

Add a `POST` route at `src/app/api/register-for-class/route.ts`.

Request body:

```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com",
  "phone": "123456789",
  "address": "Main Street 1",
  "plz": "8000",
  "city": "Zurich",
  "sailingClub": "Lake Club",
  "boatNumber": "SUI"
}
```

Behavior:

- parse JSON request body
- trim all string values
- validate required fields
- return `400` with an error payload if any required field is missing
- return `200` with the sanitized form payload if validation succeeds

Response body on success:

```json
{
  "success": true,
  "submission": {
    "firstName": "Ada",
    "lastName": "Lovelace",
    "email": "ada@example.com",
    "phone": "123456789",
    "address": "Main Street 1",
    "plz": "8000",
    "city": "Zurich",
    "sailingClub": "Lake Club",
    "boatNumber": "SUI"
  }
}
```

## Success State

After a successful submission, the modal will replace the form with a success view that:

- confirms the registration was submitted
- renders the returned field values as readable text
- keeps the user inside the modal for verification

The success state should not auto-close. This keeps the behavior obvious during testing and matches the user's request to display the submitted form data.

## Error Handling

- Client validation failures prevent the network request.
- Server validation errors show a message in the modal and preserve entered values.
- Unexpected request failures show a generic submission error and preserve entered values.
- While loading, inputs, close action, and submit button should be disabled to avoid duplicate requests and state conflicts.

## Accessibility

- The button must be keyboard reachable.
- The modal should use dialog semantics with `role="dialog"` and `aria-modal="true"`.
- The modal should have a programmatically associated title.
- The close control should have an accessible label.
- Error text should be associated clearly enough for screen-reader use.
- Focus management should be reasonable for this iteration: move focus into the modal on open and return focus to the trigger on close if practical within the chosen implementation.

## Testing Strategy

### End-to-End

Extend [tests/e2e/frontend.e2e.spec.ts](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/tests/e2e/frontend.e2e.spec.ts) to cover:

- the `Register for class` button is visible
- clicking the button opens the modal
- submitting an empty form shows validation feedback
- filling the required fields and submitting shows the success state
- the success state contains representative submitted values returned from the API

### Route-Level Test

Add a small automated test around the route handler if the current setup supports it cleanly. The primary assertions should verify:

- valid payload returns `200`
- missing required fields return `400`

If route-level testing would create disproportionate setup overhead in this repo, the end-to-end flow remains the higher priority coverage for this iteration.

## Files Expected To Change

- [src/app/(frontend)/page.tsx](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/src/app/(frontend)/page.tsx)
- new client component file under `src/app/(frontend)/`
- new API route at `src/app/api/register-for-class/route.ts`
- [tests/e2e/frontend.e2e.spec.ts](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/tests/e2e/frontend.e2e.spec.ts)

## Risks And Mitigations

- Mixing server and client concerns:
  Keep the existing page as the server wrapper and isolate interactivity in a dedicated client component.

- Fragile modal behavior in tests:
  Prefer stable accessible selectors and explicit assertions around the dialog and success text.

- Styling drift from the mockup:
  Match the button shape, modal spacing, and field grouping closely while still using the project's Tailwind-driven implementation style.

## Acceptance Criteria

- Home page displays a `Register for class` button.
- Clicking the button opens a modal form.
- All fields except `Boat number` are required.
- Submitting valid data calls a Next.js API route.
- The UI shows a loading state while waiting for the response.
- The modal shows a success state with the submitted data rendered as text after a successful response.
- Invalid or failed submissions keep the modal open and show errors without clearing the form.
