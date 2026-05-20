# Services Feature — Stepwise Development Checklist

- [ ] **Create central branch `service-feature` from `master` (no commit)** — use this branch as the main integration branch for the full Services feature.
  - Do not add direct implementation commits on this branch.
  - Every development step should be created in its own dedicated sub-branch starting from `service-feature`.
  - Each completed sub-branch should merge back into `service-feature`, and only after the entire feature is completed, reviewed, and tested should `service-feature` be merged into `master`.
  - This keeps the workflow modular, maintainable, and aligned with the branching strategy already used for Projects and Partners.

---

## Database & Schema

- [ ] **Branch `service-feature/schema` → Design flexible and maintainable database structure for services and relations**
  - Create a `services` table designed to be reusable across different parts of the application.
  - Include the core fields needed for both dashboard management and public presentation, such as:
    - `id`
    - `language`
    - `title`
    - `summary` or short description
    - `description` or rich description if needed
    - `main_image`
    - optional `share_slug` if service detail pages may exist in the future
    - timestamps

  - Keep the structure extensible for future additions such as icon, ordering, visibility flag, CTA link, featured status, or category grouping.
  - Create or confirm the many-to-many relation between projects and services using a junction table such as `project_services`.
  - Add useful indexes for maintainability and filter performance, especially:
    - `language`
    - searchable title if needed

  - Ensure foreign key rules and relation cleanup behavior are defined properly.

  Commit: `Add services schema with project relation support`

---

## Seed Data

- [ ] **Branch `service-feature/seed` → Add seed data and fixtures for development/testing**
  - Create sample service records in different languages for realistic testing.
  - Include mock image references for each service so dashboard and public UI can be tested with real visual content.
  - Link several services to sample projects through the relation table.
  - Make sure the seed data is sufficient to test:
    - standalone services showcase
    - project-specific related services section
    - search/filter behavior
    - empty and populated states

  - Update migration and fixture flow where necessary.

  Commit: `Seed sample services and project relations`

---

## Uploads / Media

- [ ] **Branch `service-feature/uploads` → Implement validated image upload support for services**
  - Build upload support for service images using the same architectural pattern used for Projects and Partners.
  - Add validation for:
    - allowed file formats
    - file size limits
    - single required image upload

  - Generate preview URLs for a better admin form UX.
  - Keep the upload logic reusable and centralized so future modules can rely on the same helper structure.
  - Ensure images are correctly attached during create/update flows.

  Commit: `Add validated image upload support for services`

---

## Admin Navigation

- [ ] **Branch `service-feature/admin-nav` → Add “Services” entry to dashboard navigation**
  - Add a new `Services` option to the dashboard header/sidebar navigation.
  - Connect it to the dedicated admin route for service management.
  - Protect the route with the same admin guard and optional feature flag pattern used in the rest of the dashboard.
  - Keep route naming and navigation structure consistent with Projects and Partners.

  Commit: `Expose Services entry in admin navigation`

---

## Admin Listing Page

- [ ] **Branch `service-feature/admin-list` → Build services management page with table and filters**
  - Create a management table page using the **same exact structural pattern already used for Projects and Partners**.
  - Suggested columns:
    - image
    - title
    - language
    - related projects count or related usage summary if useful

  - Add filters such as:
    - search
    - language

  - Add pagination support based on the same reusable admin table pattern.
  - Include a `New Service` button that opens the create modal.

  Commit: `Add services management table with search and language filters`

---

## Admin Create/Edit Form

- [ ] **Branch `service-feature/admin-form` → Build create/edit service modal with validation**
  - Implement a reusable modal form for creating and editing services.
  - Include fields such as:
    - `language selector` (mandatory)
    - `main image` (mandatory)
    - `title`
    - `summary` if included in schema
    - `description`

  - Add both client-side and server-side validation for:
    - required language
    - required image
    - title validity
    - description/summary constraints if needed

  - Provide immediate image preview inside the form.
  - Keep the form structure extensible so future additional service metadata can be added without major refactor.

  Commit: `Implement service create/edit modal with validation`

---

## Backend / Server Actions

- [ ] **Branch `service-feature/admin-api` → Add services CRUD server actions and listing API**
  - Implement backend/server-side logic for:
    - create service
    - update service
    - delete service
    - list services with filtering and pagination

  - Support filters for:
    - search
    - language

  - Ensure image handling is correctly connected with create/update logic.
  - Return validation errors in the same consistent format used by other admin modules.
  - Keep the API shape reusable so it can power public-facing service components too.

  Commit: `Add services CRUD server actions and listing API`

---

## Admin UX Improvements

- [ ] **Branch `service-feature/admin-polish` → Improve dashboard UX for services management**
  - Add polish and feedback improvements:
    - success/error toasts
    - loading states
    - empty states
    - optimistic row creation/update if compatible with current project architecture

  - Improve usability with:
    - inline image rendering in table rows
    - consistent modal transitions
    - delete confirmation flow if delete is supported

  - Ensure the Services admin experience matches the same quality level and UI conventions used in Projects and Partners.

  Commit: `Polish services admin UX states`

---

## Public Data Layer

- [ ] **Branch `service-feature/public-api` → Prepare reusable public-facing data access for services and related entities**
  - Build a reusable public-side fetch layer for services.
  - Design it so components can work in two modes:
    - `mode: "all"` → load all services
    - `mode: "project"` + `projectId` → load only services related to a specific project

  - Make the data layer flexible so components can:
    - fetch data internally
    - or receive prefetched data via props

  - Ensure language-aware querying is supported from the start.

  Commit: `Add reusable public data layer for services sections`

---

## Reusable Public Components

- [ ] **Branch `service-feature/public-services-component` → Build standalone reusable Services showcase component**
  - Create a standalone reusable component dedicated to displaying services.
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
    - service image
    - service title
    - optional short description
    - optional click behavior if future detail pages or links are added

  - Design it as a premium reusable section, not a basic list.

  Commit: `Add reusable public services showcase component`

- [ ] **Branch `service-feature/public-related-component` → Build standalone reusable related entities section for services/projects usage**
  - Create a second standalone reusable component meant for broader related-entity presentation across the public website.
  - This component should support consistent rendering of associated content in contexts such as:
    - services related to a project
    - projects tags/chips related to services
    - future service-partner-project cross-display

  - Add support for:
    - motion-based interactions
    - glassmorphism layout
    - loading and empty states
    - chips/tags
    - optional CTA links

  - Keep the architecture generic and reusable without making it unnecessarily complex.

  Commit: `Add reusable related entities section for services and projects`

---

## Public UI & Motion Design

- [ ] **Branch `service-feature/public-ui` → Implement modern motion-based UI design for public reusable service components**
  - Apply the same premium visual language planned for Partners:
    - glassmorphism background
    - blur effects
    - transparency
    - soft borders
    - smooth hover states
    - entrance animations
    - subtle micro-interactions

  - Ensure the section feels modern, iconic, and visually distinct enough to serve as a highlighted area on the page.
  - Keep the motion elegant and performant, avoiding visual noise.
  - Make the section fully responsive and reusable in multiple layouts.

  Commit: `Add motion-based glassmorphism UI for service sections`

---

## Public Integrations

- [ ] **Branch `service-feature/public-home` → Integrate reusable services component into home page**
  - Add the standalone Services showcase component to the home page as a highlighted reusable section.
  - Use it in `mode: "all"` so it displays all services as part of the global site presentation.
  - Ensure spacing, responsiveness, and motion timing fit naturally within the home page layout.
  - Keep the section modular so it can be repositioned or reused later without structural changes.

  Commit: `Integrate services showcase section into home page`

- [ ] **Branch `service-feature/public-project-detail` → Integrate reusable services component into single project detail page**
  - Reuse the standalone Services component inside the project detail page.
  - Use it in `mode: "project"` with `projectId` so it loads only the services related to that specific project.
  - Ensure the UI fits naturally into the project detail page while keeping the component standalone and reusable.
  - Align its visual flow with the partner/project metadata sections if those already exist.

  Commit: `Integrate project-specific services section into project detail page`

---

## Internationalization (i18n)

- [ ] **Branch `service-feature/i18n` → Add translations for services feature**
  - Add all required translation keys for:
    - dashboard navigation label
    - table labels
    - filter/search labels
    - modal form labels
    - validation messages
    - loading states
    - empty states
    - public section titles and optional CTA texts

  - Ensure all service-related queries and UI output remain language-aware and consistent with the rest of the app.

  Commit: `Update i18n resources for services feature`

---

## Testing

- [ ] **Branch `service-feature/tests` → Add tests for admin and public service flows**
  - Add coverage for:
    - form validation
    - required image behavior
    - CRUD server actions
    - search/language filters
    - reusable public component rendering
    - mode-based behavior (`all` vs `project`)
    - loading and empty states

  - Add accessibility smoke tests for:
    - modal form
    - table interactions
    - public service cards and sections

  Commit: `Add tests for services feature and reusable public sections`

---

## Final Merge Strategy

- [ ] **Merge flow: sequentially merge each step branch into `service-feature`, resolve conflicts, then merge `service-feature` into `master`**
  - Merge step branches one by one into `service-feature` in a controlled order.
  - Resolve conflicts carefully, especially in shared areas such as:
    - admin table patterns
    - upload helpers
    - relation logic with projects
    - reusable public section architecture
    - i18n key namespaces

  - Perform integration testing before the final merge.
  - Once the feature is stable, merge `service-feature` into `master`.

  Final commit on `master`: `Merge service-feature: add Services end-to-end`
