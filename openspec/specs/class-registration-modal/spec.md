## Purpose

Define the public homepage class registration flow, including modal access, validation, submission, and success-state behavior.

## Requirements

### Requirement: Home page registration call to action
The system SHALL display a `Register for class` call to action on the public home page that opens the class registration modal.

#### Scenario: Visitor opens the registration modal
- **WHEN** a visitor activates the `Register for class` button on the home page
- **THEN** the system opens a registration modal on top of the current page

### Requirement: Registration modal collects required visitor details
The system SHALL present a registration form in the modal with fields for first name, last name, email, phone, address, postal code, city, sailing club, and optional boat number. All fields except boat number MUST be required before submission.

#### Scenario: Visitor views the registration form
- **WHEN** the registration modal opens
- **THEN** the system shows inputs for first name, last name, email, phone, address, postal code, city, sailing club, and boat number
- **AND** the system marks every field except boat number as required

#### Scenario: Visitor attempts to submit incomplete required data
- **WHEN** a visitor submits the registration form with one or more required fields missing
- **THEN** the system prevents submission
- **AND** the system keeps the modal open in the form state

### Requirement: Registration submission uses the Next.js API
The system SHALL submit registration data from the modal to a Next.js API endpoint and SHALL show a loading state while the submission is in progress.

#### Scenario: Submission is in progress
- **WHEN** a visitor submits a valid registration form
- **THEN** the system sends the registration payload to the Next.js API endpoint
- **AND** the system shows a loading state until the response is received

### Requirement: Successful submission shows verification details
The system SHALL replace the form with a success state after a successful API response and SHALL display the submitted registration values as text for verification.

#### Scenario: Submission succeeds
- **WHEN** the API endpoint returns a successful registration response
- **THEN** the system replaces the form with a success state inside the modal
- **AND** the system displays the submitted registration values as text

### Requirement: Success state persists until the modal is closed
The system SHALL keep the success state visible until the visitor closes the modal and SHALL reset to an empty form when the modal is reopened.

#### Scenario: Visitor closes the modal after success
- **WHEN** a visitor closes the modal from the success state
- **THEN** the system dismisses the modal

#### Scenario: Visitor reopens the registration modal
- **WHEN** a visitor opens the registration modal after previously closing it from the success state
- **THEN** the system shows a fresh empty form instead of the prior success state
