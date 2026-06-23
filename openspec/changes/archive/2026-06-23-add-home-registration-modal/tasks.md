## 1. Homepage registration UI

- [x] 1.1 Add a `Register for class` CTA to the public home page and mount a client-side registration flow component from the existing server page.
- [x] 1.2 Build the registration modal layout, close behavior, and responsive field arrangement to match the requested form structure.
- [x] 1.3 Implement client-side form state and required-field validation for all fields except `boatNumber`.

## 2. Submission flow

- [x] 2.1 Add a Next.js API route that accepts the registration payload, validates the required fields, and returns the submitted values in a success response.
- [x] 2.2 Connect the modal form to the API route and implement the submitting/loading state while the request is in flight.
- [x] 2.3 Replace the form with a success state that displays the submitted values and keep that state visible until the modal is closed.

## 3. Reset and verification

- [x] 3.1 Reset modal state on close so reopening starts with a fresh empty form after a completed submission.
- [x] 3.2 Verify the end-to-end flow locally for open, validate, submit, loading, success, close, and reopen behavior.
