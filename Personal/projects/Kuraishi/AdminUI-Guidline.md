Below is a commit-by-commit admin UI development process suitable to feed into Codex one step at a time.

Core rule for this phase: build a complete admin UI shell and mocked admin workflows only. No real auth, database, API handlers, server actions, or persistence.

**Branch**
Create one branch first:

```bash
git checkout -b feature/admin-ui-phase
```

**Global Guardrails**
Use these instructions in every Codex step:

- Use existing project style: Next.js App Router, TypeScript strict, Tailwind v4 tokens, shadcn/Radix conventions.
- Reuse existing UI primitives where possible.
- Add missing shadcn-style primitives locally under `src/components/ui`.
- Keep German public UI untouched.
- Do not add backend, database, Prisma, API routes, real auth, or server actions.
- Use typed mock admin data only.
- Support dark mode with existing CSS variables.
- Admin UI must be dense, operational, and dashboard-like, not marketing-style.
- Use lucide icons in navigation, buttons, empty states, and stats.
- Every route should have loading/skeleton/error-ready UI where appropriate.
- Keep commits small and reviewable.

---

**Step 1: Admin Route Foundation**
Goal: create the admin route structure without changing public routes.

Codex prompt:

```text
Create the foundational admin UI route structure only.

Requirements:
- Add a new admin route at /admin using App Router.
- Do not place it inside the existing (public) layout.
- Create a protected-style route group such as src/app/(protected)/admin.
- Add admin layout, admin dashboard page, loading.tsx, error.tsx, and not-found-safe behavior if useful.
- Do not implement real auth or redirects.
- Add a separate admin route config file, for example src/config/admin-navigation.config.ts or src/config/admin-routes.config.ts.
- Do not add admin routes to publicRoutes or sitemap.
- Keep robots disallow for /admin as-is.
- Use existing theme provider from root layout.
- Build only a minimal placeholder dashboard so the route works.
- Run typecheck, lint, and tests.
```

Acceptance:

- `/admin` renders outside public header/footer.
- Public routes remain unchanged.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` pass.

Commit:

```bash
git add .
git commit -m "Create admin route foundation"
```

---

**Step 2: Admin Shell Layout**
Goal: add the persistent admin frame.

Codex prompt:

```text
Build the admin shell layout for /admin.

Requirements:
- Create reusable admin layout components under src/components/admin/layout.
- Include sidebar navigation, top bar, mobile navigation drawer, breadcrumb area, page title slot, and content container.
- Use shadcn-style components and lucide icons.
- Add dark mode support using existing tokens.
- Sidebar items should include:
  Dashboard, Vehicles, Leads, Appointments, Users, Activity, Media, Settings.
- Include theme toggle in admin top bar.
- Include mocked current admin identity area, but no real auth.
- Sidebar should be collapsible or mobile-friendly.
- Use restrained borders, radius, spacing, and dense admin layout styling.
- Avoid public marketing components.
- Run typecheck, lint, tests.
```

Acceptance:

- Admin shell works on desktop and mobile.
- Navigation visually indicates active route.
- Breadcrumb pattern is present.
- No public header/footer appears.

Commit:

```bash
git add .
git commit -m "Build admin shell layout"
```

---

**Step 3: shadcn Admin Primitives**
Goal: add missing UI building blocks needed across admin.

Codex prompt:

```text
Add missing shadcn-style UI primitives needed for the admin section.

Requirements:
- Keep components under src/components/ui.
- Add only primitives actually needed now:
  tabs, dialog, dropdown-menu, sheet, tooltip, separator, checkbox, textarea, label, avatar, scroll-area if useful.
- Match existing button/input/select/card/table style conventions.
- Use Radix packages already installed when available; add lightweight UI dependencies only if necessary.
- Do not refactor public UI unless required for compatibility.
- Add small examples only through admin usage, not standalone demo pages.
- Run typecheck, lint, tests.
```

Acceptance:

- Admin shell can use proper shadcn primitives.
- No duplicated one-off dropdown/dialog implementations.

Commit:

```bash
git add .
git commit -m "Add admin shadcn UI primitives"
```

---

**Step 4: Mock Admin Domain Data**
Goal: create typed mock data for all admin pages.

Codex prompt:

```text
Create typed mock admin data for UI-only admin screens.

Requirements:
- Add types under src/types/admin.ts or focused files.
- Add mock data under src/data/admin.
- Include:
  vehicles with admin status fields
  leads from contact and valuation forms
  appointments
  users/clients
  user activity events
  media assets
  admin stats
- Do not replace public vehicle data yet.
- Include realistic dealership fields:
  vehicle status draft/published/reserved/sold/archived
  lead status new/contacted/qualified/closed/lost
  user role client/admin/staff
  activity type login/favourite/comparison/inquiry/valuation/update
- Keep data typed and reusable for tables/cards.
- Run typecheck, lint, tests.
```

Acceptance:

- All future admin screens can import typed mock data.
- No backend-like fake API is introduced.

Commit:

```bash
git add .
git commit -m "Add typed mock admin data"
```

---

**Step 5: Dashboard Overview**
Goal: build the admin landing page.

Codex prompt:

```text
Build the /admin dashboard overview UI.

Requirements:
- Use admin shell page structure and breadcrumbs.
- Include stat cards for inventory, new leads, appointments, users, sold vehicles, revenue estimate.
- Include recent activity timeline.
- Include recent leads list.
- Include inventory status summary.
- Include quick action buttons with icons:
  Add vehicle, Review leads, Schedule appointment, Manage users.
- Use shadcn Card, Badge, Button, Table or list primitives.
- Add skeleton loading state matching dashboard layout.
- Add subtle motion only where appropriate using existing motion dependency or CSS transitions.
- Keep all data mocked.
- Run typecheck, lint, tests.
```

Acceptance:

- Dashboard feels like an operational admin workspace.
- Loading state mirrors final layout.

Commit:

```bash
git add .
git commit -m "Build admin dashboard overview"
```

---

**Step 6: Vehicles Admin List**
Goal: create inventory management table.

Codex prompt:

```text
Build the /admin/vehicles inventory list UI.

Requirements:
- Add route /admin/vehicles with page, loading, and route-local components.
- Use a proper shadcn-style data table.
- If needed, add @tanstack/react-table for client-side table behavior only.
- Include columns:
  image, title, price, mileage, fuel, status, featured, location, updated date, actions.
- Include sorting, filtering, search input, status filter, pagination, row selection, bulk action toolbar.
- Include row actions dropdown:
  View, Edit, Duplicate, Mark sold, Archive.
- No actual mutation required; show mocked toast or disabled UI if needed.
- Include empty state and skeleton table state.
- Run typecheck, lint, tests.
```

Acceptance:

- Table is usable and dense.
- Admin can visually inspect and filter mocked inventory.

Commit:

```bash
git add .
git commit -m "Build admin vehicle table"
```

---

**Step 7: Vehicle Create/Edit UI**
Goal: create the full vehicle form experience.

Codex prompt:

```text
Build UI-only vehicle create/edit screens.

Requirements:
- Add /admin/vehicles/new.
- Add /admin/vehicles/[id]/edit.
- Use shared VehicleForm component.
- Use react-hook-form and zod.
- Include sections:
  Basics, Pricing, Technical details, Features, Media, Publishing.
- Use shadcn inputs, selects, textarea, checkbox, tabs or grouped panels.
- Include image upload UI as mock only: drag/drop area, existing image grid, reorder/remove buttons visually only.
- Include save draft, preview, publish buttons with icons.
- Do not persist data.
- Use mocked default values on edit page.
- Include form validation messages.
- Run typecheck, lint, tests.
```

Acceptance:

- Form is complete enough to later connect to backend.
- No backend or localStorage persistence added.

Commit:

```bash
git add .
git commit -m "Build admin vehicle form UI"
```

---

**Step 8: Leads Inbox**
Goal: manage contact and valuation leads.

Codex prompt:

```text
Build the /admin/leads UI.

Requirements:
- Add leads table and lead detail drawer/dialog.
- Include tabs or filters:
  All, New, Contacted, Qualified, Closed, Lost.
- Lead rows should show source, customer name, contact info, vehicle interest, status, priority, created date.
- Detail view should show full message, timeline, customer info, related vehicle, and internal notes mock textarea.
- Include action buttons:
  Call, Email, Schedule appointment, Mark contacted, Close.
- Use badges for source/status/priority.
- Include skeleton, empty state, and mobile-friendly layout.
- No real sending or persistence.
- Run typecheck, lint, tests.
```

Acceptance:

- Admin can review and triage mocked leads.

Commit:

```bash
git add .
git commit -m "Build admin leads inbox"
```

---

**Step 9: Appointments UI**
Goal: calendar/list scheduling surface.

Codex prompt:

```text
Build the /admin/appointments UI.

Requirements:
- Include daily agenda and list/table view.
- Use shadcn Calendar or existing calendar/date-picker primitives.
- Show appointments by type:
  test drive, consultation, valuation, workshop, callback.
- Include status badges:
  requested, confirmed, completed, cancelled.
- Include appointment detail dialog with customer, vehicle, notes, and actions.
- Add buttons for Confirm, Reschedule, Cancel.
- Include skeleton and empty states.
- Keep all data mocked.
- Run typecheck, lint, tests.
```

Acceptance:

- Admin has a clear scheduling management screen.

Commit:

```bash
git add .
git commit -m "Build admin appointments UI"
```

---

**Step 10: User Management**
Goal: admin can inspect registered client accounts and activity.

Codex prompt:

```text
Build the /admin/users UI for client/user management.

Requirements:
- Include users table with:
  name, email, phone, role, status, registered date, last login, favourites count, inquiries count.
- Include filters for role/status.
- Include user detail drawer/dialog.
- Detail view must show:
  profile info, account status, saved vehicles, comparison vehicles, inquiries, valuation requests, activity timeline.
- Include UI actions:
  View profile, Disable account, Reset password, Change role.
- Actions are UI-only with mocked toast or disabled state.
- Use shadcn data table, badges, dropdown actions, tabs.
- Include skeleton and empty state.
- Run typecheck, lint, tests.
```

Acceptance:

- Admin can visually track every mocked user’s behavior and history.

Commit:

```bash
git add .
git commit -m "Build admin user management UI"
```

---

**Step 11: Activity Audit**
Goal: global activity tracking screen.

Codex prompt:

```text
Build the /admin/activity UI.

Requirements:
- Show activity events across users, leads, vehicles, and admin actions.
- Include filters:
  event type, actor role, date range, severity.
- Include searchable timeline/table hybrid.
- Each event should show icon, actor, action, target, timestamp, metadata summary.
- Include detail dialog for metadata.
- Keep all activity mocked.
- Include skeleton and empty states.
- Run typecheck, lint, tests.
```

Acceptance:

- User and admin activity can be reviewed globally.

Commit:

```bash
git add .
git commit -m "Build admin activity audit UI"
```

---

**Step 12: Media Library**
Goal: visual asset management UI.

Codex prompt:

```text
Build the /admin/media UI.

Requirements:
- Add media grid with vehicle images and brand/assets from mock data.
- Include search, type filter, usage filter, selected state, and bulk toolbar.
- Include asset detail panel/dialog:
  preview, filename, type, dimensions, size, used by, uploaded date.
- Include mock upload dropzone.
- Include delete/download/copy URL buttons as UI-only.
- Use responsive grid and skeleton loading state.
- No file upload backend.
- Run typecheck, lint, tests.
```

Acceptance:

- Admin has a credible visual media management surface.

Commit:

```bash
git add .
git commit -m "Build admin media library UI"
```

---

**Step 13: Settings UI**
Goal: dealership/admin settings screens.

Codex prompt:

```text
Build the /admin/settings UI.

Requirements:
- Include tabs:
  Dealership, Contact, Opening hours, Notifications, Appearance, Legal placeholders.
- Use shadcn forms, inputs, selects, switches/checkboxes.
- Pre-fill from existing siteConfig where useful, but do not mutate siteConfig.
- Include save buttons with UI-only mocked success toast.
- Include dark mode/appearance controls visually aligned with existing ThemeToggle.
- Include skeleton loading state.
- Run typecheck, lint, tests.
```

Acceptance:

- Settings UI is complete but clearly not backend-connected.

Commit:

```bash
git add .
git commit -m "Build admin settings UI"
```

---

**Step 14: Auth UI Mock**
Goal: login/register pages for future client/admin auth.

Codex prompt:

```text
Build UI-only auth pages.

Requirements:
- Add route group for auth pages, for example src/app/(auth).
- Add /login and /register pages.
- Do not implement real auth.
- Forms should use react-hook-form and zod.
- Login should support email/password UI.
- Register should support client registration fields.
- Include links between login/register and back to public home.
- Include dark mode support and Kuraishi branding.
- Do not add auth redirects or sessions.
- Run typecheck, lint, tests.
```

Acceptance:

- Login/register screens exist visually.
- Admin remains directly accessible for UI review during this phase.

Commit:

```bash
git add .
git commit -m "Build auth UI mock pages"
```

---

**Step 15: Polish, Responsiveness, and Motion**
Goal: make the admin section feel complete.

Codex prompt:

```text
Polish the admin UI across all admin and auth pages.

Requirements:
- Review spacing, radius, border consistency, dark mode contrast, button/icon alignment, table density, empty states, skeleton states.
- Add subtle page/section transitions where appropriate.
- Ensure mobile layouts work for sidebar, tables, dialogs, and forms.
- Ensure no visible text overflows buttons/cards/tables.
- Ensure breadcrumbs and page titles are consistent.
- Do not add new features unless needed to fix consistency.
- Run typecheck, lint, tests, and production build.
```

Acceptance:

- Admin UI feels coherent as one product area.
- Public UI remains unaffected.
- All checks pass.

Commit:

```bash
git add .
git commit -m "Polish admin UI phase"
```

---

**Recommended Final QA**
After Step 15:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Manual routes to inspect:

```text
/admin
/admin/vehicles
/admin/vehicles/new
/admin/vehicles/1/edit
/admin/leads
/admin/appointments
/admin/users
/admin/activity
/admin/media
/admin/settings
/login
/register
```

The most important architectural choice: keep admin routes separate from `publicRoutes`. Public localized routes are for customer-facing canonical URLs; admin should remain `/admin`, excluded from sitemap, disallowed in robots, and later protected by real server-side auth.

- finanzamenti
