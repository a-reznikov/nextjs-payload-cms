# Quickstart: Register for Class

## Purpose

Validate the end-to-end registration modal flow from the public home page through API submission and success-state verification.

## Prerequisites

- Node.js version compatible with the repo `package.json` engines field
- `npm` installed
- Project dependencies installed with `npm install`

## Start the app

```bash
npm run dev
```

Expected outcome: the Next.js application is available at `http://localhost:3000`.

## Manual validation scenario

1. Open `http://localhost:3000`.
2. Confirm the home page shows a visible `Register for class` button.
3. Select the button and confirm a modal opens with:
   - Title `Register for class`
   - Supporting copy
   - Close control
   - Inputs for first name, last name, email, phone, address, postal code, city, sailing club, and optional boat number
4. Close the modal and confirm the page returns to its original state.
5. Reopen the modal and submit the form with one required field missing.
6. Confirm submission is blocked and the missing field is indicated.
7. Complete the form with valid values and submit it.
8. Confirm a loading state appears and the submit action cannot be triggered again while processing.
9. Confirm the modal transitions to a success state that displays the submitted values as readable text.
10. Close the modal, reopen it, and confirm the form is reset rather than showing stale success data.

## Integration validation

Run the integration suite:

```bash
npm run test:int
```

Expected outcome: tests cover the registration endpoint request validation and success/error response behavior described in [register-class-api.yaml](/Users/aliaksandr.reznikau/git/test-projects/nextjs-payload-cms/specs/001-register-class/contracts/register-class-api.yaml).

## Browser validation

Run the end-to-end suite:

```bash
npm run test:e2e
```

Expected outcome: browser tests confirm the home page CTA, modal workflow, loading feedback, and success-state verification behavior.

## Focused regression areas

- Public home page rendering in `src/app/(frontend)/page.tsx`
- Modal visibility and reset behavior
- Required-field validation messaging
- Duplicate-submit prevention while the request is in flight
- API response handling for both success and recoverable error cases
