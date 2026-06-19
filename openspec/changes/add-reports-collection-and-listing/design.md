## Context

The project is a Next.js app backed by Payload CMS. Today it has starter `users` and `media` collections and a generic public homepage. The requested change introduces a new content model for reports and a public listing page that mirrors a specific card-based design reference.

## Goals / Non-Goals

**Goals:**
- Add a CMS-managed `reports` collection with the requested fields.
- Seed three starter report entries so the public page has content immediately after setup.
- Replace the starter homepage with a responsive report listing driven by Payload data.
- Keep the reports listing on a dedicated `/reports` route and use the home page as a lightweight entry point.
- Match the provided layout style closely enough to preserve the visual rhythm, spacing, and card composition across screen sizes.

**Non-Goals:**
- Building report detail pages or filtering/search.
- Introducing a new media upload flow for reports.
- Converting the `content` field into rich text or markdown.
- Adding editorial workflow features such as drafts, publishing states, or approvals.

## Decisions

- Use a new `reports` collection rather than extending an existing collection. This keeps the content model explicit and avoids coupling report entries to users or media records.
  - Alternatives considered: reusing `media` or adding report data to a generic page model. Those approaches blur ownership and make the data less maintainable.

- Store `image` as a string path, not a Payload upload relation.
  - The request explicitly calls for a string field and a fixed placeholder image path.
  - Alternatives considered: an upload relation to `media` or a custom upload field. Those would be more flexible, but they do not match the requested schema and would add unnecessary CMS complexity.

- Keep `content` as a `textarea`.
  - The user confirmed this choice, and it is sufficient for a simple report summary field.
  - Alternatives considered: rich text or markdown. Those are better for formatted editorial content, but they are overkill here.

- Fetch reports on the server in the frontend page.
  - Move the data fetch to the `/reports` route so the homepage stays lightweight and navigation remains explicit.
  - The app already uses server-side Payload access in the homepage, so continuing with server-side data loading keeps the implementation simple and avoids a separate client data-fetching layer.
  - Alternatives considered: client-side fetching via REST or GraphQL. That would add loading states and extra plumbing without a clear benefit for this page.

- Build the layout as a responsive card grid with alternating card compositions.
  - This matches the reference image more closely than a simple one-column list.
  - On larger screens, the cards can alternate image/text alignment to recreate the asymmetry shown in the design while still collapsing cleanly on mobile.

- Seed the three reports through a repeatable project seed mechanism.
  - A repeatable seed flow keeps the repository easy to bootstrap for other developers and CI environments.
  - Alternatives considered: manual admin entry or ad hoc database inserts. Those are harder to reproduce and verify.

## Risks / Trade-offs

- [Visual matching may drift across breakpoints] → Use shared card primitives, strict spacing tokens, and responsive image sizing to keep the layout stable.
- [String-based image references are less flexible than uploads] → Accept this trade-off because the requirement is intentionally simple and uses a fixed placeholder asset.
- [Seed data can be duplicated if the seed process is not idempotent] → Make the seed step safe to rerun by clearing or upserting the starter report records.
