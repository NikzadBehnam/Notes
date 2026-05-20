# Partners Feature — Stepwise Development Checklist

- [ ] **Create central branch `partner-feature` from `master` (no commit)** — use this as the main integration branch for the entire Partners feature.
  - No direct development commits should be added here.
  - Every implementation step should be developed in its own sub-branch created from `partner-feature`.
  - Each step branch merges back into `partner-feature`, and once the full feature is completed, tested, and stable, `partner-feature` will be merged into `master`.
  - This keeps the workflow clean, reviewable, and safe for incremental integration.

- [*] **Branch `partner-feature/schema` → Design flexible and maintainable database structure for partners and relations**

  ## step 1
  - Create a `partners` table structured for reuse across multiple sections of the application.
  - Include fields such as:
    - `id`
    - `language`
    - `title`
    - `description`
    - `logo`
    - timestamps

  - Ensure the structure is flexible enough to support future extension, such as optional external links, ordering, visibility flags, or categorization if needed later.
  - Create or confirm the many-to-many relation between projects and partners using a junction table such as `project_partners`.

  Commit: `Add partners schema with project relation support`

- [ ] **Branch `partner-feature/seed` → Add seed data and fixtures for development/testing**

  ## step 2
  - Create sample partner records in multiple languages to support dashboard filtering and UI testing.
  - Add realistic logo references for local/dev use.
  - Link several partners to sample projects through the relation table.
  - Ensure seed data is enough to test:
    - standalone partner listing
    - project-specific partner display
    - empty vs populated states

  - Update migration/dev fixture flow if required.

  Commit: `Seed sample partners and project relations`

- [*] **Branch `partner-feature/uploads` → Implement validated logo upload flow for partners**

  ## step 3 Implement validated logo upload flow for partners
  - Build upload support for partner logos with proper validation rules:
    - allowed file types
    - max file size
    - single mandatory logo upload

  - Generate preview URLs for instant feedback in the form.
  - Reuse the existing upload infrastructure where possible to keep logic centralized and maintainable.
  - Ensure logo upload integrates cleanly with create/edit partner actions.

  Commit: `Add validated logo upload support for partners`

- [*] **Branch `partner-feature/admin-nav` → Add “Partners” entry to dashboard navigation**

  ## step 4 Add “Partners” entry to dashboard navigation
  - Add a new `Partners` option in the dashboard header/sidebar navigation.
  - Connect it to the dedicated admin partners route.
  - Protect the route with the same admin authorization pattern used by other dashboard modules.
  - If the app supports feature flags, wire the menu entry through the same mechanism for consistency.

  Commit: `Expose Partners entry in admin navigation`

- [*] **Branch `partner-feature/admin-list` → Build partners management page with table and filters**

  ## step 5 Build partners management page with table and filters
  - Create the admin listing page for partners using the **same exact table style/pattern used for Projects** for visual and structural consistency.
  - Include columns such as:
    - logo
    - title
    - language
    - related projects count

  - Add filters:
    - search
    - language

  - Add a `New Partner` button with no action for now.

  Commit: `Add partners management table with search and language filters`

- [*] **Branch `partner-feat/admin-form` → Build create/edit partner modal with validation**

  ## step 6 Build create/edit partner modal with validation
  - Implement a reusable modal form for both creating and editing partners.
  - Form fields should include:
    - `language selector` (mandatory)
    - `logo` (mandatory)
    - `title`
    - `description`

  - Add validation on both client and server side:
    - required language
    - required logo
    - title validation
    - description validation if constraints are needed

  - Add logo preview inside the form.
  - Keep the form architecture maintainable so it can easily support future extra fields like link, order, or active status.

  Commit: `Implement partner create/edit modal with validation`

- [*] **Branch `partner-feat/admin-api` → Add partners CRUD server actions and listing API**

  ## step 7 Add partners CRUD server actions and listing API
  - Implement backend/server actions for:
    - create partner
    - update partner
    - delete partner
    - list partners with filters

  - Ensure filtering supports:
    - search
    - language

  - Return validation errors in a consistent structure matching other admin modules.
  - Ensure uploaded logo handling is properly attached during create/update flows.
  - Keep the API shape reusable so it can also support the standalone public components later.

  Commit: `Add partners CRUD server actions and listing API`

- [*] **Branch `partner-feat/admin-polish` → Improve dashboard UX for partners management**

  ## step 8 Improve dashboard UX for partners management
  - Add user feedback and dashboard polish:
    - success/error toasts
    - loading states
    - empty states
    - optimistic row creation/update if aligned with your current architecture

  - Improve table usability:
    - inline logo rendering
    - smooth modal open/close behavior
    - consistent delete confirmation pattern if delete is supported

  - Ensure the full flow feels identical in quality to the Projects management experience.

  Commit: `Polish partners admin UX states`

- [*] **Branch `partner-feat/public-components` → Build reusable public partners section with integrated data handling**

# Step 9, Step 10 , Step 11, Step 12, Step 13 Build reusable public partners section with integrated data handling

Instead of 5 separate steps, I would merge them into **1 stronger step** like this:

- Create a standalone reusable public Partners component that supports:
  - `mode: "all"` → load all partners
  - `mode: "project"` → load only partners related to the selected project (accepting an array of partners id)

- Design the component so it can:
  - fetch data internally
  - or receive prefetched data via props for flexibility and future optimization

- Implement the supporting public-side data access/helper logic inside the same feature step so the data contract and component API evolve together
- Handle:
  - empty states

- Display:
  - partner logo
  - partner name/title
  - optional click behavior (no action for now)

- Keep the component reusable for:
  - home page global showcase
  - project detail page
  - future public sections

- Structure the internal UI so it can also support broader related-entity presentation patterns, such as chips/tags or compact associated content blocks, without requiring a separate early architectural split
- Keep the design premium and reusable, not a plain list,

- check if you already add these cheracterestics in PartnersSection, if not try to add
  - glassmorphism background
  - blur effects
  - transparency
  - soft borders
  - smooth hover effects
  - entrance animations
  - micro-interactions

- Ensure the section feels iconic and visually distinct, because this is intended to be a highlighted area of the page.
- Keep animations elegant and performant, avoiding overdone motion.
- Make the UI responsive and reusable across page sections.
- Add the standalone Partners showcase component to the home page.
- Use it in `mode: "all"` so it displays all relevant partners for a global showcase section.
- Ensure spacing, responsiveness, and animation timing match the home page design language.
- Keep the integration modular so the section can be reordered or reused later without refactor.

Commit: `Add reusable public partners component with integrated data loading`

- [ ] **Branch `partner-feature/public-project-detail` → Integrate reusable partners component into single project detail page**

  ## step 14
  - Reuse the standalone Partners component inside the single project detail page.
  - Use it in `mode: "project"` with `projectId` so it loads only the partners related to that specific project.
  - Ensure the section visually fits the project detail page while still remaining reusable and independent.
  - If project detail already includes related metadata blocks, align this component with that design flow.

  Commit: `Integrate project-specific partners section into project detail page`

- [ ] **Branch `partner-feat/i18n` → Add translations for partners feature**

# Step 15 Add translations for partners feature

- Add all required translation keys for:
  - dashboard navigation label
  - table labels
  - search/filter labels
  - modal form labels
  - validation messages
  - loading/empty states
  - public section titles

- Ensure all partner queries and render logic remain language-aware.

Commit: `Update i18n resources for partners feature`

- [ ] **Branch `partner-feature/tests` → Add tests for admin and public partner flows**
  - Add coverage for:
    - form validation
    - required logo behavior
    - CRUD server actions
    - search/language filters
    - reusable public component rendering
    - mode-based behavior (`all` vs `project`)
    - loading and empty states

  - Add basic accessibility smoke tests for:
    - modal form
    - table interactions
    - public showcase cards/logos

  Commit: `Add tests for partners feature and reusable public sections`

- [ ] **Merge flow: sequentially merge each step branch into `partner-feature`, resolve conflicts, then merge `partner-feature` into `master`**
  - Merge sub-branches one by one into `partner-feature` in a controlled order.
  - Resolve conflicts carefully, especially around shared UI, upload helpers, project relation logic, and public section reuse.
  - Perform full integration testing before final merge.
  - Once stable, merge `partner-feature` into `master`.

  Final commit on `master`: `Merge partner-feature: add Partners end-to-end`

---
