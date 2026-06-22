# Data Model: Register for Class

## Entity: Class Registration

**Description**: A public visitor's registration submission for a class, collected through the home page modal.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `firstName` | text | Yes | Must be non-empty after trimming | Displayed in success state |
| `lastName` | text | Yes | Must be non-empty after trimming | Displayed in success state |
| `email` | text | Yes | Must be present and formatted like an email address | Used as contact detail |
| `phone` | text | Yes | Must be non-empty after trimming | Free-form contact number |
| `address` | text | Yes | Must be non-empty after trimming | Street or mailing address |
| `postalCode` | text | Yes | Must be non-empty after trimming | Named `Plz` in the mockup |
| `city` | text | Yes | Must be non-empty after trimming | Displayed in success state |
| `sailingClub` | text | Yes | Must be non-empty after trimming | Sailing-related affiliation |
| `boatNumber` | text | No | May be blank; if present, trim leading/trailing whitespace | Optional field |

## Entity: Registration Submission Result

**Description**: The confirmed result returned after a successful submission.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `status` | enum | Yes | Must be `success` for accepted requests | Drives success UI |
| `message` | text | Yes | Human-readable confirmation summary | Shown near verification details |
| `registration` | Class Registration | Yes | Must contain the accepted registration fields | Echoed back for verification |

## Entity: Registration Submission Error

**Description**: A recoverable submission failure returned to the modal so the visitor can retry.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `status` | enum | Yes | Must be `error` | Drives error UI |
| `message` | text | Yes | Human-readable explanation | Shown in modal |
| `fieldErrors` | object | No | Keys map to invalid fields | Optional validation details |

## UI State Model

### Modal Visibility

- `closed`: No dialog content is shown.
- `open`: Dialog is visible and contains either the editable form or a terminal state.

### Submission Lifecycle

- `idle`: Modal is open and ready for input.
- `validating`: Client-side checks are running before the request is sent.
- `submitting`: Request is in flight; submit action is disabled.
- `success`: Response accepted; submitted values are rendered for verification.
- `error`: Submission failed; the form remains editable with preserved values.

## Relationships

- One `Registration Submission Result` contains one accepted `Class Registration`.
- One `Registration Submission Error` may reference multiple field-level validation issues for one attempted `Class Registration`.

## State Transitions

- `closed` -> `idle` when the visitor selects "Register for class"
- `idle` -> `validating` when the visitor submits the form
- `validating` -> `idle` when client-side validation fails
- `validating` -> `submitting` when validation passes
- `submitting` -> `success` when the server accepts the request
- `submitting` -> `error` when the server rejects the request or a transport issue occurs
- `success` -> `closed` when the visitor dismisses the modal
- `closed` -> `idle` when the visitor opens the modal again after success
