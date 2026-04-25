### Branching Strategy & Setup

- [*] **Create central branch `projects` from `master` (no commit)**
  Establish a dedicated integration branch that will act as the **single source of truth for the Projects feature**.
  - Do **not add any commits directly** to this branch.
  - All feature sub-branches will be created from `project-feature` and merged back into it.
  - This ensures **clean separation**, easier testing, and avoids polluting `master` with incomplete work.
  - Final merge into `master` will only happen when the entire feature is stable and reviewed.

---

### Database & Schema

- [*] **Branch `project-feature/schema` → Define database structure**
  Design and implement the full database schema required for Projects:
  - Create `projects` table with:
    - `title` (string, required)
    - `summary` (short text, required)
    - `description` (rich text / long text)
    - `start_date`, `end_date` (with constraint: `end_date ≥ start_date`)
    - `fb_link` (string, optional, validated URL)
    - `country_code`, `city` (for geo filtering)
    - `language` (for i18n support)
    - `share_slug` (unique, SEO-friendly identifier)
    - `main_image` (string/path)
    - `gallery` (JSON array storing ordered images)

  - Create junction tables:
    - `project_services` (many-to-many relation)
    - `project_partners` (many-to-many relation)

  - Add indexes:
    - `language` (for filtering)
    - `start_date DESC` (for sorting recent projects)

  - Ensure constraints and referential integrity.

  Commit: Add projects schema with partner/service relations

---

### Seed Data

- [*] **Branch `project-feature/seed` → Add development seed data**
  Provide realistic mock data for development and testing:
  - Create sample:
    - Services and partners
    - Projects with:
      - Multiple images in gallery
      - Relations to services/partners

  - Include stubbed country/city data for local testing.
  - Update migrations if needed to align with schema.
  - Ensure seeds reflect real-world scenarios for UI validation.

  Commit: Seed sample projects with partners and services

---

### File Upload System

- [*] **Branch `project-feature/uploads` → Implement multi-image upload system**

  Implement multi-image upload system

      Build a reusable upload system for project media:

  - Validate:
    - File types (e.g. jpg, png, webp)
    - File size limits
    - Maximum number of images

  - Generate preview URLs for instant UI feedback.
  - Store gallery as ordered JSON array.
  - Extract logic into a shared helper for reuse in admin forms.

  Commit: Support validated multi-image uploads for projects

---

### Geo Provider (Country/City)

- [*] **Branch `project-feature/geo-provider` → Add geo data provider**

LETS PROCEED WITH NEXT STEP
Add geo data provider
Implement a reusable API/service for location selection:

- Provide:
  - List of countries
  - Cities filtered by selected country

- Use caching (server-side or in-memory) to reduce API calls.
- Add fallback handling for failures.
- Return data formatted for ShadCN UI components (combobox/select).

Commit: Add reusable country/city provider API for forms

---

### Admin Navigation

- [*] **Branch `project-feature/admin-nav` → Add Projects to admin UI**

  LETS PROCEED WITH NEXT STEP

  Add Projects to admin UI
  Integrate Projects into the admin dashboard:
  - Add "Projects" item to navigation dashboard header.
  - Protect route with:
    - Admin guard
  - Ensure route structure is consistent with existing modules.

  Commit: Expose Projects entry in admin navigation

---

### Admin Listing Page

- [*] **Branch `project-feature/admin-list` → Build projects table view**

  LETS PROCEED WITH NEXT STEP

  Build projects table view
  Create a full management interface:
  - Table columns:
    - Title, Language, Dates, Services, Partners

  - Filters:
    - Language
    - Country
    - Partner
    - Service
    - Date range

  - Add pagination support.
  - Include CTA button: “New Project”.
  - Include filters (search, byPartner, ByDate, byService) Not: if we delete the partner or service it should not appear here in filters
  - Maintain consistency with blog/posts table UI.

  Commit: Add projects management table with filters

---

### Admin Create/Edit Form

- [*] **Branch `project-feature/admin-form` → Build modal form**
  Implement full-featured project form:
  - Inputs:
    - Title (max 50 words + live counter)
    - Summary (max 100 words)
    - Rich-text description
    - Start/End date pickers (with validation)

  - Media:
    - Multi-image upload
    - Preview thumbnails
    - Per-file validation

  - Additional fields:
    - FB link (length + format validation)
    - Country/City selectors
    - Services & Partners multi-select
    - Language selector (mandatory)

  - Add both client-side and server-side validation.

  Commit: Implement project create/edit modal with validation

---

### Backend / Server Actions

- [*] **Branch `project-feature/admin-api` → Implement CRUD APIs**

  LETS PROCEED WITH NEXT STEP

  Implement CRUD APIs

  Build backend logic:
  - Create / Update / Delete projects
  - Manage relations (services & partners)
  - Handle uploads and attach media
  - Generate unique `share_slug`
  - Provide listing API with:
    - Pagination
    - Filters

  - Return consistent validation errors.

  Commit: Add projects CRUD server actions and listing API

---

### Admin UX Improvements

- [*] **Branch `project-feature/admin-polish` → Enhance UX**

  LETS PROCEED WITH NEXT STEP

  Enhance UX
  Improve usability:
  - Toast notifications (success/error)
  - Optimistic UI updates
  - Loading & empty states
  - Inline image:
    - Remove
    - Reorder

  - Chips/tags for selected services & partners

  Commit: Polish projects admin UX states

---

### Public Navigation

- [*] **Branch `project-feature/public-nav` → Add Projects to frontend**

  LETS PROCEED WITH NEXT STEP
  Add Projects to frontend

  Expose Projects in public UI:
  - Add link to navbar
  - Setup routes:
    - `/projects`
    - `/projects/[slug]`

  - Ensure language-aware routing.

  Commit: Add public Projects routes and navbar link

---

### Infinite Loader (Reusable Component)

- [*] **Branch `project-feature/infinite-list` → Build reusable infinite scroll**

LETS PROCEED WITH NEXT STEP

Build reusable infinite scroll
Create a generic loader component:

- Use **Intersection Observer API**
- Features:
  - Page size = 10
  - Skeleton loaders
  - Retry on failure
  - Abort requests on unmount

- Accept data fetcher via props (reusable for projects/posts).

Commit: Create reusable intersection-based infinite loader

---

### Public Projects List

- [*] **Branch `project-feature/public-list` → Build listing page**

  LETS PROCEED WITH NEXT STEP
  Build listing page

  Create a visually distinct page/detail:
  - Custom card design (different from posts)
  - Display:
    - Country/city badges
    - Partner/service chips

  - Add share CTA
  - Integrate infinite loader
  - Add smooth animations (entry and load transitions)

Commit: Build animated projects listing page with infinite load

---

### Project Detail Page

- [*] **Branch `project-feature/public-detail` → Build detail view**
  LETS PROCEED WITH NEXT STEP
  Build detail view

  Full project page:
  - Hero section with main image
  - Rich description
  - Location + FB link
  - add partners of the project (use the reusable partners display component)
  - Share buttons
  - Gallery:
    - Full-width slider
    - Keyboard navigation
    - Blurred backdrop effect

Commit: Add project detail view with gallery and share actions

---

### Internationalization (i18n)

- [*] **Branch `project-feature/i18n` → Add translations**

  LETS PROCEED WITH NEXT STEP
  Add translations
  Extend i18n system:
  - Add keys for:
    - Labels
    - Validation messages
    - Toasts
    - Share text

  - Ensure:
    - Language-based queries
    - Fallback logic

Commit: Update i18n resources for projects

---

### Testing

- [ ] **Branch `project-feature/tests` → Add tests**
      Cover critical functionality:
  - Validation:
    - Word limits
    - Date constraints

  - CRUD APIs
  - Infinite loader behavior
  - Upload limits
  - Basic accessibility (a11y) checks

Commit: Add tests for projects feature and form constraints

---

### Final Merge Strategy

- [ ] **Merge flow**
  - Sequentially merge each sub-branch into `projects`
  - Resolve conflicts carefully
  - Perform integration testing
  - Once stable:
    - Merge `projects` → `master`

  Final commit:
  Merge project-feature: add Projects end-to-end
