## Problem Statement

The public-facing application needs a polished, branded header that matches the provided desktop mockup. Right now the frontend uses a generic starter layout, so the first impression does not reflect the intended visual identity or information architecture.

The user wants the header to feel like the Figma design: brand mark on the left, primary navigation in the center, and a prominent registration call-to-action on the right. The existing logo asset should be reused rather than recreated.

## Solution

Build a reusable desktop header component for the public frontend and mount it in the public layout so it appears consistently across the application.

The header should:

- Use the existing logo asset on the left
- Show the primary navigation items in the center
- Display a standout registration CTA on the right
- Match the dark navy bar, spacing, and visual rhythm from the mockup
- Preserve the current public page content below the header

This PRD intentionally stays desktop-only. Mobile navigation is out of scope for this slice.

## User Stories

1. As a visitor, I want to see the brand logo immediately, so that I can recognize the application at a glance.
2. As a visitor, I want the main navigation links to be visible in the header, so that I can understand the site’s top-level sections quickly.
3. As a visitor, I want the navigation to read as a cohesive desktop menu, so that the interface feels intentional and polished.
4. As a visitor, I want the registration action to stand out visually, so that I can identify the primary next step without hunting for it.
5. As a visitor, I want the header to match the provided design closely, so that the product feels aligned with the intended brand.
6. As a visitor, I want the header to stay consistent across public pages, so that I always have the same orientation and navigation.
7. As a visitor, I want the header to use the existing logo asset, so that the brand presentation remains consistent with the design source.
8. As a visitor, I want the header to avoid unnecessary controls on desktop, so that the layout remains clean and focused.
9. As a visitor, I want hover and focus feedback on interactive elements, so that the header feels responsive and usable.
10. As a visitor, I want the header spacing and alignment to feel balanced, so that the page reads as a professional desktop composition.
11. As a visitor, I want the call-to-action to be easy to scan from the far right, so that I can act on the most important task quickly.
12. As a visitor, I want the header to sit above the page content without disrupting the existing landing page, so that the rest of the experience remains intact.
13. As a maintainer, I want the header to be a reusable component, so that future public pages can share the same structure without duplication.
14. As a maintainer, I want the header to live in the public app shell, so that the current page and future pages inherit the same branding automatically.
15. As a maintainer, I want the implementation to stay minimal, so that we avoid introducing behavior we do not need yet.

## Implementation Decisions

- Create a dedicated header component for the public frontend rather than embedding the markup directly into the page content.
- Mount the header in the public app layout so it becomes part of the shared shell for the frontend area.
- Reuse the existing logo asset instead of introducing a new brand image.
- Keep the navigation labels and CTA text aligned with the mockup.
- Treat the visual design as desktop-first and defer responsive navigation behavior to a later slice.
- Use the existing styling approach already established in the public frontend.
- Preserve the current landing page content below the header so the change is additive rather than disruptive.
- Keep the component free of Payload-specific concerns; it should be a presentational header only.
- Validate the feature at the highest useful seam: render the header through the public layout and compare the visible result against the desktop mockup.

## Testing Decisions

- A good test for this feature checks visible behavior from the user’s perspective, not implementation details.
- The highest-value test seam is the public frontend page rendered with the header in place.
- The test should confirm that the logo, navigation items, and CTA are present in the expected structure and that the header appears above the existing content.
- The test should verify that the desktop presentation remains stable rather than asserting on internal component internals.
- Existing frontend integration and end-to-end tests in the repository provide the prior art for validating rendered output at the page level.

## Out of Scope

- Mobile navigation or a hamburger menu
- Dropdown menus or secondary navigation
- Active-route highlighting
- Authentication-dependent header states
- Sticky or scroll-aware header behavior
- Changes to the Payload admin shell
- Changes to the logo asset itself
- Any broader redesign of the landing page content below the header

## Further Notes

- The implementation should stay close to the provided desktop mockup so the result feels intentional rather than template-driven.
- If later work introduces mobile navigation, it should build on the same component rather than replacing it.
- The header should remain simple enough that future pages can adopt it without extra setup.
