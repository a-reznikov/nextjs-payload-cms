# Research: Register for Class

## Decision 1: Implement the registration experience as a client-side modal launched from the existing home page

- **Decision**: Keep the current home page route and add a client-driven modal workflow instead of navigating to a separate registration page.
- **Rationale**: The spec explicitly calls for a button on the home page that opens a modal and preserves page context. This approach aligns with the desired interaction model and keeps the success state contained within the same flow.
- **Alternatives considered**:
  - Navigate to a standalone registration page: rejected because it breaks the requested modal interaction.
  - Render the full form inline on the home page: rejected because it would materially change the current layout and does not match the provided mockup.

## Decision 2: Submit the form through a dedicated Next.js app-route endpoint

- **Decision**: Create a dedicated server endpoint in the application for registration submissions and have the modal post validated form data to it.
- **Rationale**: The feature explicitly requires sending the form data to the Next.js API. An app-route endpoint keeps the public frontend and request handling in the same application structure already used by the project.
- **Alternatives considered**:
  - Submit directly to Payload collections: rejected for this iteration because the success state only needs request verification and not CMS persistence.
  - Handle submission purely on the client: rejected because the requirements call for server-side API submission.

## Decision 3: Treat the server response as a verification echo rather than persistent storage in v1

- **Decision**: Validate incoming request data on the server and return the accepted registration payload for display in the success state without saving it.
- **Rationale**: The user asked to show the form data as text "just for verification that form works." This keeps scope focused on interaction correctness while still exercising the full request/response path.
- **Alternatives considered**:
  - Save registrations to a database or Payload collection: rejected as unnecessary scope for the requested verification milestone.
  - Return only a generic success message: rejected because the success view must display the submitted details.

## Decision 4: Manage form state with explicit modal workflow states

- **Decision**: Model the UI around idle, editing, submitting, success, and error states, with a single in-flight submission at a time.
- **Rationale**: The specification requires validation, loading feedback, duplicate-submit prevention, retry handling, and a clean success transition. A clear state model reduces ambiguous UI behavior.
- **Alternatives considered**:
  - Implicit state derived from scattered booleans: rejected because it increases the risk of inconsistent modal behavior.
  - Full-page loading transitions: rejected because the feature is modal-scoped.

## Decision 5: Cover the feature with both browser and server-facing automated checks

- **Decision**: Extend Playwright for the modal flow and add integration coverage for the submission endpoint behavior.
- **Rationale**: The feature spans interactive UI behavior and request validation. Existing project tooling already supports both browser and integration testing.
- **Alternatives considered**:
  - Only end-to-end testing: rejected because endpoint validation and error handling are easier to assert directly at the integration level.
  - Only unit/integration testing: rejected because modal behavior and responsive interaction need browser verification.
