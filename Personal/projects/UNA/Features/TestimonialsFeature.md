# Testimonials Feature — Stepwise Development Checklist

- [ ] **Create central branch `testimonial-feature` from `master` (no commit)** — use this branch as the main integration branch for the full Testimonials feature.
  - Do not add direct implementation commits on this branch.
  - Every development step should be created in its own dedicated sub-branch starting from `testimonial-feature`.
  - Each completed sub-branch should merge back into `testimonial-feature`, and only after the entire feature is completed, reviewed, and tested should `testimonial-feature` be merged into `master`.
  - This keeps the workflow modular, reviewable, and aligned with the same branching strategy already used for Projects, Partners, and Services.

---

## Database & Schema

- [ ] **Branch `testimonial-feature/schema` → Design flexible and maintainable database structure for testimonials and relations**
  - Create a `testimonials` table structured for reuse across different parts of the application.
  - Include fields that support both admin management and public presentation, such as:
    - `id`
    - `language`
    - `author_name`
    - `author_role` or `author_title` (optional)
    - `company_name` (optional)
    - `quote` or testimonial content
    - `avatar` or author image (optional, depending on design)
    - `rating` (optional, if the design may show stars or score)
    - `is_featured` or visibility flag (optional but recommended for future flexibility)
    - timestamps

  - Keep the schema extensible so you can later add:
    - external profile link
    - ordering / priority
    - source type
    - approval status
    - video testimonial URL

  - Create or confirm the many-to-many relation between projects and testimonials using a junction table such as `project_testimonials`, so multiple testimonials can belong to one project and one testimonial can potentially be reused if needed.
  - Add useful indexes, especially:
    - `language`
    - `is_featured` if used
    - searchable author/company/title fields if needed

  - Ensure foreign key behavior and cleanup strategy are properly defined.

  Commit: `Add testimonials schema with project relation support`

---

## Seed Data

- [ ] **Branch `testimonial-feature/seed` → Add seed data and fixtures for development/testing**
  - Create sample testimonial records in different languages for realistic admin and public-side testing.
  - Include variations such as:
    - short testimonials
    - longer testimonials
    - with and without avatar
    - with and without company/role
    - featured and non-featured entries if supported

  - Link several testimonials to sample projects through the relation table.
  - Ensure the seed data is enough to test:
    - standalone testimonial showcase
    - project-specific testimonial section
    - empty vs populated states
    - card/carousel layout variations

  - Update migration/dev fixture flow where needed.

  Commit: `Seed sample testimonials and project relations`

---

## Uploads / Media

- [ ] **Branch `testimonial-feature/uploads` → Implement validated avatar/image upload support for testimonials**
  - Build upload support for testimonial avatar or author image, if the feature includes visual identity for the testimonial author.
  - Add validation for:
    - allowed image types
    - file size limits
    - optional or required image behavior depending on business rules

  - Generate preview URLs for a better admin form experience.
  - Reuse the existing shared upload helper architecture used for Projects, Partners, and Services to keep logic centralized and maintainable.
  - Ensure avatar/image handling integrates cleanly with create/update flows.

  Commit: `Add validated image upload support for testimonials`

---

## Admin Navigation

- [ ] **Branch `testimonial-feature/admin-nav` → Add “Testimonials” entry to dashboard navigation**
  - Add a new `Testimonials` option to the dashboard header/sidebar navigation.
  - Connect it to the dedicated admin route for testimonial management.
  - Protect the route using the same admin authorization and optional feature flag pattern used by the other modules.
  - Keep route naming and menu structure aligned with Projects, Partners, and Services.

  Commit: `Expose Testimonials entry in admin navigation`

---

## Admin Listing Page

- [ ] **Branch `testimonial-feature/admin-list` → Build testimonials management page with table and filters**
  - Create a management table page using the **same exact structural and design pattern already used for Projects, Partners, and Services**.
  - Suggested columns:
    - author name
    - company or role
    - language
    - quote preview
    - related projects count or usage summary if useful
    - featured/visibility state if supported

  - Add filters such as:
    - search
    - language
    - featured status if included in the schema

  - Add pagination support using the same reusable admin table pattern.
  - Include a `New Testimonial` button that opens the create modal.

  Commit: `Add testimonials management table with filters`

---

## Admin Create/Edit Form

- [ ] **Branch `testimonial-feature/admin-form` → Build create/edit testimonial modal with validation**
  - Implement a reusable modal form for creating and editing testimonials.
  - Include fields such as:
    - `language selector` (mandatory)
    - `author name` (mandatory)
    - `author role/title` (optional)
    - `company name` (optional)
    - `quote` / testimonial text (mandatory)
    - `avatar/image` (optional or mandatory based on design choice)
    - `rating` (optional)
    - `featured toggle` if supported

  - Add both client-side and server-side validation for:
    - required language
    - required author name
    - required testimonial content
    - max length / content constraints if needed
    - valid rating range if supported

  - Provide immediate image preview in the form if avatar upload exists.
  - Keep the form extensible so future fields can be added without major refactor.

  Commit: `Implement testimonial create/edit modal with validation`

---

## Backend / Server Actions

- [ ] **Branch `testimonial-feature/admin-api` → Add testimonials CRUD server actions and listing API**
  - Implement backend/server-side logic for:
    - create testimonial
    - update testimonial
    - delete testimonial
    - list testimonials with filtering and pagination

  - Support filters for:
    - search
    - language
    - featured state if supported

  - Ensure avatar/image handling is correctly connected with create/update logic.
  - Return validation errors in the same structured format used by the other dashboard modules.
  - Keep the API reusable so it can also support standalone public testimonial components later.

  Commit: `Add testimonials CRUD server actions and listing API`

---

## Admin UX Improvements

- [ ] **Branch `testimonial-feature/admin-polish` → Improve dashboard UX for testimonials management**
  - Add polish and user feedback improvements:
    - success/error toasts
    - loading states
    - empty states
    - optimistic row creation/update if aligned with your current architecture

  - Improve usability with:
    - quote preview truncation
    - inline avatar rendering if present
    - consistent modal transitions
    - delete confirmation flow if delete is supported

  - Ensure the Testimonials admin experience matches the same quality level and behavior as Projects, Partners, and Services.

  Commit: `Polish testimonials admin UX states`

---

## Public Data Layer

- [ ] **Branch `testimonial-feature/public-api` → Prepare reusable public-facing data access for testimonials and related entities**
  - Build a reusable public-side fetch layer for testimonials.
  - Design it so components can work in two modes:
    - `mode: "all"` → load all testimonials
    - `mode: "project"` + `projectId` → load only testimonials related to a specific project

  - Make the data layer flexible so components can:
    - fetch data internally
    - or receive prefetched data via props

  - Ensure language-aware querying is supported from the start.

  Commit: `Add reusable public data layer for testimonials sections`

---

## Reusable Public Components

- [ ] **Branch `testimonial-feature/public-testimonials-component` → Build standalone reusable Testimonials showcase component**
  - Create a standalone reusable component dedicated to displaying testimonials.
  - It must support:
    - `mode: "all"` for global showcase usage
    - `mode: "project"` + `projectId` for project detail usage

  - Allow both:
    - internal fetching
    - prefetched props-based rendering

  - Add handling for:
    - loading state
    - skeleton/shimmer UI
    - empty state

  - UI should present:
    - quote content
    - author name
    - role/company
    - avatar if available
    - rating if enabled

  - The component can be built as cards, slider, carousel, or stacked motion-based quotes depending on the final design direction, but it should remain standalone and reusable.

  Commit: `Add reusable public testimonials showcase component`

- [ ] **Branch `testimonial-feature/public-related-component` → Build standalone reusable related entities section for testimonials/projects usage**
  - Create a second standalone reusable component intended for broader related-entity presentation and contextual use across public pages.
  - This should support use cases such as:
    - testimonials related to a project
    - featured social-proof section on landing pages
    - future combined presentation with services, partners, or project highlights

  - Add support for:
    - motion-based transitions
    - glassmorphism layout
    - loading and empty states
    - chips/tags or compact metadata where appropriate
    - optional CTA links or “see more” behavior if later needed

  - Keep the architecture reusable and aligned with the same public section conventions used in the other modules.

  Commit: `Add reusable related entities section for testimonials and projects`

---

## Public UI & Motion Design

- [ ] **Branch `testimonial-feature/public-ui` → Implement modern motion-based UI design for public reusable testimonial components**
  - Apply the same premium visual language planned for Partners and Services:
    - glassmorphism background
    - blur effects
    - transparency
    - soft borders
    - smooth hover states
    - entrance animations
    - subtle micro-interactions

  - Because testimonials are social proof, the design should feel especially polished, trustworthy, and visually memorable.
  - Keep the motion elegant and performant, avoiding distracting transitions.
  - Make the section fully responsive and reusable in multiple page layouts.

  Commit: `Add motion-based glassmorphism UI for testimonial sections`

---

## Public Integrations

- [ ] **Branch `testimonial-feature/public-home` → Integrate reusable testimonials component into home page**
  - Add the standalone Testimonials showcase component to the home page as a highlighted social-proof section.
  - Use it in `mode: "all"` so it displays all or featured testimonials as part of the global site presentation.
  - Ensure spacing, responsiveness, and animation timing fit naturally within the home page layout.
  - Keep the section modular so it can be repositioned or reused later without structural refactor.

  Commit: `Integrate testimonials showcase section into home page`

- [ ] **Branch `testimonial-feature/public-project-detail` → Integrate reusable testimonials component into single project detail page**
  - Reuse the standalone Testimonials component inside the single project detail page.
  - Use it in `mode: "project"` with `projectId` so it loads only the testimonials related to that specific project.
  - Ensure the section feels contextually connected to the project while remaining fully standalone and reusable.
  - Align its design flow with the related services and partners sections if those already exist.

  Commit: `Integrate project-specific testimonials section into project detail page`

---

## Internationalization (i18n)

- [ ] **Branch `testimonial-feature/i18n` → Add translations for testimonials feature**
  - Add all required translation keys for:
    - dashboard navigation label
    - table labels
    - search/filter labels
    - modal form labels
    - validation messages
    - loading states
    - empty states
    - public section titles and optional CTA texts

  - Ensure all testimonial-related queries and UI output remain language-aware and consistent with the rest of the app.

  Commit: `Update i18n resources for testimonials feature`

---

## Testing

- [ ] **Branch `testimonial-feature/tests` → Add tests for admin and public testimonial flows**
  - Add coverage for:
    - form validation
    - required field behavior
    - CRUD server actions
    - search/language filters
    - featured filter behavior if supported
    - reusable public component rendering
    - mode-based behavior (`all` vs `project`)
    - loading and empty states

  - Add accessibility smoke tests for:
    - modal form
    - table interactions
    - public testimonial cards / carousel / quote section

  Commit: `Add tests for testimonials feature and reusable public sections`

---

## Final Merge Strategy

- [ ] **Merge flow: sequentially merge each step branch into `testimonial-feature`, resolve conflicts, then merge `testimonial-feature` into `master`**
  - Merge step branches one by one into `testimonial-feature` in a controlled order.
  - Resolve conflicts carefully, especially in shared areas such as:
    - admin table patterns
    - upload helpers
    - relation logic with projects
    - reusable public section architecture
    - i18n key namespaces

  - Perform integration testing before the final merge.
  - Once the feature is stable, merge `testimonial-feature` into `master`.

  Final commit on `master`: `Merge testimonial-feature: add Testimonials end-to-end`

---
