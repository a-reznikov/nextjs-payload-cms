# Tasks: Register for Class

**Input**: Design documents from `/specs/001-register-class/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/register-class-api.yaml, quickstart.md

**Tests**: The feature spec did not explicitly request a TDD-first workflow, so this task list focuses on implementation plus end-to-end validation using the scenarios in `specs/001-register-class/quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the feature file structure and shared frontend module entry points

- [X] T001 Create the register-class component module entry in `src/app/(frontend)/components/register-class/index.ts`
- [X] T002 [P] Create shared registration type definitions in `src/app/(frontend)/components/register-class/types.ts`
- [X] T003 [P] Create shared form field defaults and labels in `src/app/(frontend)/components/register-class/form-schema.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared modal workflow pieces required before user story implementation

**⚠️ CRITICAL**: No user story work should begin until this phase is complete

- [X] T004 Create the client-side modal state container in `src/app/(frontend)/components/register-class/RegisterClassModal.tsx`
- [X] T005 [P] Create the reusable form field markup component in `src/app/(frontend)/components/register-class/RegisterClassField.tsx`
- [X] T006 [P] Add shared registration modal and button styling hooks in `src/app/(frontend)/styles.css`

**Checkpoint**: Shared register-class UI foundation is ready for story-specific implementation

---

## Phase 3: User Story 1 - Open Registration Form (Priority: P1) 🎯 MVP

**Goal**: Let a visitor open and close the registration modal from the home page and see the full form layout

**Independent Test**: Visit the home page, select `Register for class`, verify the modal title, copy, close control, and all fields appear, then close it and confirm the page returns to its prior state.

### Implementation for User Story 1

- [X] T007 [P] [US1] Create the registration form layout component in `src/app/(frontend)/components/register-class/RegisterClassForm.tsx`
- [X] T008 [US1] Add the `Register for class` CTA and modal open/close wiring in `src/app/(frontend)/page.tsx`
- [X] T009 [US1] Compose the modal shell, close action, and field layout in `src/app/(frontend)/components/register-class/RegisterClassModal.tsx`
- [X] T010 [US1] Refine responsive modal sizing, spacing, and button presentation in `src/app/(frontend)/styles.css`

**Checkpoint**: User Story 1 should be fully functional and testable on its own

---

## Phase 4: User Story 2 - Submit Registration Details (Priority: P1)

**Goal**: Allow visitors to enter required information, validate it, and submit it to the application API

**Independent Test**: Open the modal, leave a required field blank to confirm submission is blocked, then fill all required values, submit the form, and confirm the request is accepted by the registration endpoint.

### Implementation for User Story 2

- [X] T011 [P] [US2] Implement the registration submission endpoint in `src/app/api/register-class/route.ts`
- [X] T012 [P] [US2] Create the client-side submission request helper in `src/app/(frontend)/components/register-class/submitRegistration.ts`
- [X] T013 [US2] Add required-field validation and inline error state handling in `src/app/(frontend)/components/register-class/RegisterClassModal.tsx`
- [X] T014 [US2] Connect form submission to the API while preserving entered values after recoverable failures in `src/app/(frontend)/components/register-class/RegisterClassModal.tsx`

**Checkpoint**: User Stories 1 and 2 should both work independently, including validation and request submission

---

## Phase 5: User Story 3 - See Submission Progress and Confirmation (Priority: P2)

**Goal**: Show clear loading feedback, prevent duplicate submits, and render the submitted data in a success state

**Independent Test**: Submit a valid registration, confirm the modal shows a loading state with duplicate-submit protection, then verify the success state displays the submitted values as readable text and resets on reopen.

### Implementation for User Story 3

- [X] T015 [P] [US3] Create the success-state details component in `src/app/(frontend)/components/register-class/RegisterClassSuccess.tsx`
- [X] T016 [US3] Add submitting, success, and error workflow states with duplicate-submit protection in `src/app/(frontend)/components/register-class/RegisterClassModal.tsx`
- [X] T017 [US3] Render the success-state verification view and modal reset behavior in `src/app/(frontend)/components/register-class/RegisterClassModal.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup across all stories

- [X] T018 [P] Update the home page metadata and supporting copy for the finished registration experience in `src/app/(frontend)/layout.tsx`
- [X] T019 Run the manual validation flow documented in `specs/001-register-class/quickstart.md`
- [X] T020 Review the endpoint contract against the finished implementation and reconcile any contract wording in `specs/001-register-class/contracts/register-class-api.yaml`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies and can start immediately
- **Phase 2: Foundational**: Depends on Phase 1 and blocks all story work
- **Phase 3: User Story 1**: Depends on Phase 2 and delivers the MVP modal shell
- **Phase 4: User Story 2**: Depends on User Story 1 because the form shell must already exist
- **Phase 5: User Story 3**: Depends on User Story 2 because loading and success states require a working submission flow
- **Phase 6: Polish**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational and has no dependency on later stories
- **User Story 2 (P1)**: Depends on User Story 1’s modal/form structure
- **User Story 3 (P2)**: Depends on User Story 2’s submission path and response handling

### Within Each User Story

- Shared components before page wiring
- Form layout before validation and submission
- Submission path before loading/success states
- Story-specific behavior complete before moving to the next phase

### Parallel Opportunities

- Setup tasks `T002` and `T003` can run in parallel after `T001`
- Foundational tasks `T005` and `T006` can run in parallel after `T004`
- User Story 1 task `T007` can run in parallel with `T008`
- User Story 2 tasks `T011` and `T012` can run in parallel
- User Story 3 task `T015` can run in parallel with `T016`

---

## Parallel Example: User Story 1

```bash
Task: "Create the registration form layout component in src/app/(frontend)/components/register-class/RegisterClassForm.tsx"
Task: "Add the Register for class CTA and modal open/close wiring in src/app/(frontend)/page.tsx"
```

---

## Parallel Example: User Story 2

```bash
Task: "Implement the registration submission endpoint in src/app/api/register-class/route.ts"
Task: "Create the client-side submission request helper in src/app/(frontend)/components/register-class/submitRegistration.ts"
```

---

## Parallel Example: User Story 3

```bash
Task: "Create the success-state details component in src/app/(frontend)/components/register-class/RegisterClassSuccess.tsx"
Task: "Add submitting, success, and error workflow states with duplicate-submit protection in src/app/(frontend)/components/register-class/RegisterClassModal.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the modal open/close flow on the home page

### Incremental Delivery

1. Deliver User Story 1 to establish the visible CTA and modal shell
2. Add User Story 2 to complete validation and API submission
3. Add User Story 3 to finish loading, success, and retry-friendly behavior
4. Use Phase 6 to validate the full flow against `quickstart.md`

### Parallel Team Strategy

1. One teammate handles shared schema and field components in Phases 1-2
2. A second teammate can prepare the API route once User Story 1 is in progress
3. Success-state work can begin once the request/response shape is stable

---

## Notes

- All tasks follow the required checklist format with task ID, optional parallel marker, story label where required, and exact file paths
- The task list intentionally keeps automated test authoring out of scope because the feature spec did not explicitly request test-first execution
- Manual validation remains required through `specs/001-register-class/quickstart.md`
