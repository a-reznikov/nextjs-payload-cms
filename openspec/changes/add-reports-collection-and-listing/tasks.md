## 1. CMS and Data Model

- [x] 1.1 Add a new `reports` collection with `title`, `date`, `content`, and `image` fields
- [x] 1.2 Register the collection in `src/payload.config.ts` and generate updated Payload types
- [x] 1.3 Add repeatable seed logic for 3 starter reports that all use the placeholder image path

## 2. Public Reports Page

- [x] 2.1 Add a dedicated `/reports` route with a server-rendered reports query against Payload
- [x] 2.2 Sort reports by date descending and pass the required fields to the UI
- [x] 2.3 Build the responsive reports card layout to match the provided design reference
- [x] 2.4 Add a home-page link that navigates to the reports route

## 3. Verification

- [x] 3.1 Confirm the CMS can create and read report entries through the admin/API
- [x] 3.2 Verify the seeded reports appear on the public page
- [x] 3.3 Check responsive behavior at desktop and mobile widths
