# Feature Specification: Register for Class

**Feature Branch**: `[001-register-class]`

**Created**: 2026-06-22

**Status**: Draft

**Input**: User description: "Let's create a button Register for class on the home page. When user click this button we should show modal with form (see attached image). After submitting of this form we should send form data to our nextjs api, show loader and then show success state (this form data as text, just for verification that form works)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open Registration Form (Priority: P1)

A visitor on the home page can find and select a clear "Register for class" action that opens a registration form in a modal dialog without leaving the page.

**Why this priority**: The feature has no value unless users can discover the call to action and access the form quickly from the home page.

**Independent Test**: Can be fully tested by visiting the home page, selecting the registration button, and confirming that the modal opens with the expected title, descriptive text, close control, and form fields.

**Acceptance Scenarios**:

1. **Given** a visitor is on the home page, **When** the visitor selects the "Register for class" button, **Then** a modal dialog opens and displays the registration form.
2. **Given** the registration modal is open, **When** the visitor selects the close control, **Then** the modal closes and the visitor returns to the home page context.

---

### User Story 2 - Submit Registration Details (Priority: P1)

A visitor can complete the registration form and submit their class registration details from the modal.

**Why this priority**: Collecting the visitor's registration details is the core business purpose of the feature.

**Independent Test**: Can be fully tested by opening the modal, entering valid data into the form, submitting it, and confirming that the submission is accepted.

**Acceptance Scenarios**:

1. **Given** the registration modal is open, **When** the visitor completes all required fields and submits the form, **Then** the system accepts the submission and begins processing it.
2. **Given** the visitor leaves a required field empty, **When** the visitor attempts to submit the form, **Then** the system prevents submission and indicates which required information is missing.
3. **Given** the visitor enters a boat number, **When** the visitor submits the form, **Then** the boat number is included with the registration details.

---

### User Story 3 - See Submission Progress and Confirmation (Priority: P2)

After submitting, a visitor receives clear feedback that the registration is being processed and then sees a confirmation view that displays the submitted details for verification.

**Why this priority**: Visible progress and confirmation reduce uncertainty and help users verify that the form worked as intended.

**Independent Test**: Can be fully tested by submitting the form and confirming that a loading state appears before a success state that shows the submitted registration details as readable text.

**Acceptance Scenarios**:

1. **Given** a valid registration form has been submitted, **When** the system is processing the submission, **Then** the modal shows a loading state and prevents duplicate submissions.
2. **Given** a registration submission has completed successfully, **When** the success state is shown, **Then** the modal displays the submitted registration details as text for user verification.

---

### Edge Cases

- If the visitor closes the modal before submitting, the system should discard the unfinished entry unless the user has already reached the success state.
- If the submission fails, the modal should remain open, preserve the entered values, and show a clear error message so the visitor can retry.
- If the visitor selects the submit action more than once while processing is in progress, the system should only process one submission.
- If the optional boat number is left blank, the system should still allow the registration to be submitted successfully.
- If the visitor reopens the modal after a successful submission, the system should present a fresh empty form rather than stale success data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a "Register for class" button on the home page.
- **FR-002**: The system MUST open a modal dialog when the visitor selects the "Register for class" button.
- **FR-003**: The modal MUST include a registration form with fields for first name, last name, email, phone, address, postal code, city, sailing club, and boat number.
- **FR-004**: The system MUST treat boat number as optional and all other listed fields as required.
- **FR-005**: The system MUST allow the visitor to close the modal without submitting the form.
- **FR-006**: The system MUST validate required fields before allowing submission.
- **FR-007**: The system MUST send the registration data for processing when the form is submitted successfully.
- **FR-008**: The system MUST show a loading state after submission begins and before a final result is available.
- **FR-009**: The system MUST prevent duplicate submissions while the loading state is active.
- **FR-010**: The system MUST show a success state inside the modal after a successful submission.
- **FR-011**: The success state MUST display the submitted registration data as readable text so the user can verify what was sent.
- **FR-012**: If submission fails, the system MUST keep the modal open, preserve the entered values, and show a retry-friendly error message.
- **FR-013**: The form content and success state MUST remain usable on both desktop and mobile viewport sizes.

### Key Entities *(include if feature involves data)*

- **Class Registration**: A visitor-submitted request to register for a class, including personal and contact details plus sailing-related details.
- **Registration Submission State**: The current state of the modal workflow, including idle, validating, processing, success, and error.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of users can open the registration modal from the home page in a single interaction.
- **SC-002**: 95% of users with complete valid information can submit the registration form and reach a confirmation state in under 1 minute.
- **SC-003**: 100% of successful submissions display the submitted registration details in the success state for user verification.
- **SC-004**: 100% of attempted duplicate submissions during processing are blocked from creating an additional submission.

## Assumptions

- The registration flow is intended for public site visitors and does not require account sign-in.
- The modal form should visually follow the attached mockup, including the same field set and a prominent primary submit action.
- The initial success state is for verification only and does not require persistence beyond the current submission response.
- The application already has a suitable home page where the new call to action can be added without introducing a larger navigation redesign.
