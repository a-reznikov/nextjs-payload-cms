## ADDED Requirements

### Requirement: Reports collection
The system MUST provide a `reports` collection in Payload CMS with `title`, `date`, `content`, and `image` fields.

#### Scenario: Editors can create reports
- **WHEN** an editor opens the CMS
- **THEN** the editor can create a report with a title, date, textarea content, and image value

#### Scenario: Reports are readable through the CMS API
- **WHEN** the frontend or another consumer queries the `reports` collection
- **THEN** the system returns report entries with the expected fields

### Requirement: Reports seed data
The system MUST seed three initial report entries and assign the same placeholder image path to each seeded report.

#### Scenario: Fresh setup includes three reports
- **WHEN** the project is initialized with its seed data
- **THEN** the `reports` collection contains exactly three starter entries

#### Scenario: Seeded reports use the placeholder image
- **WHEN** the seeded report records are read from the CMS
- **THEN** each report's image field contains `public/images/placeholder.png` or an equivalent public path reference

### Requirement: Reports listing page
The public frontend MUST provide a `/reports` route that fetches reports from the CMS and renders them in a responsive card layout that includes each report's image, title, and date.

#### Scenario: Reports are rendered on the public page
- **WHEN** a visitor loads the `/reports` page
- **THEN** the page displays report cards backed by CMS data

#### Scenario: Layout responds to viewport size
- **WHEN** the page is viewed on a narrow screen
- **THEN** the report cards reflow into a mobile-friendly stacked layout

#### Scenario: Reports are sorted by recency
- **WHEN** multiple reports are displayed
- **THEN** the newest report appears before older reports

#### Scenario: Layout follows the provided visual reference
- **WHEN** the `/reports` page renders the report cards
- **THEN** the cards use large rounded containers, strong image presence, and bold typography consistent with the reference design

### Requirement: Home page link to reports
The home page MUST include a visible link to the `/reports` route so visitors can navigate to the reports listing from the main page.

#### Scenario: Visitor can reach reports from home
- **WHEN** a visitor loads the home page
- **THEN** the page includes a link or button that navigates to `/reports`
