## Why

The CMS currently only exposes the starter `users` and `media` content models, and the public frontend is still a generic landing page. We need a structured way to publish reports in the CMS and present them on the site in a dedicated, content-driven layout.

## What Changes

- Add a new `reports` collection to Payload CMS.
- Store report `title`, `date`, `content`, and `image` values in the collection.
- Seed the CMS with 3 initial report entries for the new collection.
- Add a dedicated `/reports` frontend route with a responsive reports listing view driven by CMS content.
- Add a link to the reports page from the home page.
- Render each report card with its image, title, and date in a layout that matches the provided design reference.

## Capabilities

### New Capabilities
- `reports`: Manage report entries in the CMS and display them on the public frontend.

### Modified Capabilities

## Impact

- Payload config and collection registration in `src/payload.config.ts`.
- New CMS collection code under `src/collections/`.
- Seed data or bootstrap logic for the initial 3 reports.
- Frontend data fetching and page rendering in `src/app/(frontend)/page.tsx`.
- Public styling/layout in `src/app/(frontend)/styles.css` or related components.
- Type generation and any query code that reads from the new collection.
