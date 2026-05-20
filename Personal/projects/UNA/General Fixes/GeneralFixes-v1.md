**Prep / Meta**

- [ ] Draft updated `AGENT_BRIEF.md` prompt: include tech stack (Next.js, Prisma/Postgres on Neon, BetterAuth, ShadCN, UploadThing, etc.), curated folder tree (use `REPO_MAP.md` as base), current project state, global components inventory, auth/routing safety notes, DB schema summary, and ask-for-more-info prompt.
- [ ] Run `scripts/validate-messages.ts` after any copy/i18n edits.

**Auth & UX polish**
branch: auth-ux-polish

- [x] Add icons to login/register buttons (initial & loading states).
- [-] Tighten signin form validation (enforce max lengths; block overflows).
- [x] Ensure `router.redirect` usage is valid in client components.
- [x] On logout, redirect to home page (not login).
- [x] Clean login & register pages (remove leftover copy/UI noise).
- [x] Add Terms & Services section/page.
- [x] in case of any protectd page rout, like when you click the "get start button" on the public nav, if not authenticated, redirect to login page not register

**Dashboard: Blog**
branch: var-fixes-feat-dashboard-blog

- [x] Design dashboard blog posts table
- [x] Add language filter dropdown.
- [x] Add date filter.
- [x] Add image upload to post creation (with button disabled while uploading).
- [x] Improve new-post content editor to rich text.
- [x] Auto-generate slugs for posts while typing post title.
- [x] Limit field lengths (especially summaries).
- [x] Remove “view” option from dashboard blog actions (non-working).
- [x] Ensure cover image alt text requirement is consistent create/edit.
- [x] Move toast position per design.
- [x] [DC] the field "conver image alt text" is miss aligned in laptop screen

**Dashboard: Messages**

- [ ] Remove download icon from deleted message row.
- [ ] Add “Download as PDF” button with office branding (header, footer, containing "address, logo, phone, title, email").

**Dashboard: Products/Projects**

- [ ] Add visibility toggle (show/hide product).
- [ ] Update `en.json`/`it.json` for products (admin + client).
- [ ] Include products and projects in global search.
- [ ] Auto-generate slugs for products/subproducts.
- [ ] Limit field lengths (titles, summaries).
- [ ] Investigate gallery view issues; fix layout.
- [ ] In sub-product form, clarify/remove top/bottom arrows on images.
- [ ] Image removal should propagate to UploadThing portal.

**Dashboard: Team/Other Admin**

- [ ] Add proper ShadCN tooltips to all action controls.
- [ ] Change toast position globally (if shared config).

**Public Site**

- [ ] Add branded 404 page for all not-found cases.
- [ ] Remove inner frame on contact form.
- [ ] Add footer map component (admin-configurable location).
- [ ] Make post detail page social-ready (share/copy buttons).
- [ ] Ensure global search covers products/projects (mirror dashboard task).
- [ ] From public nav, the team option goes inside about-us
- [ ] change the theme toggler behevier, (2 option, change by single click)

**Images & Uploads**

- [ ] Implement blur-up placeholder for images.
- [ ] Hide image placeholder in “Create New Post” until an image is chosen.
- [ ] Disable action buttons while uploads run.
- [ ] Verify UploadThing deletion sync when files are removed in-app.

**Services Section**

- [ ] Build Services dropdown with two static items: Allestementi & Deallestementi.
- [ ] For each: hero title/content, hero image, request form (distinct labels).

**Projects / Partners / Testimonials / Home**

- [ ] Flesh out Projects section structure/content.
- [ ] Define Partners section.
- [ ] Define Testimonials section.
- [ ] Finalize Home page design.

**Dahboard - Partners**

- [ ] Add the externalURL field in partner creation form

-[] reuse established UI pieces instead of inventing a parallel implementation

---

Do a very deep, precise, accurated and analytic check to the project, take your time to produce a very precise and usefull outcome

- look at every single compnent, files and dependencies we are using
- look at the mechanism of the admin guard contolling
- look how we do use the shared components to prevent reusing established UI pieces instead of inventing a parallel implementation
- check the consistency of the different logics,
  - is the UI is consistent with each other on every section of the project,
  - do we have skeleton loading every where,
  - do we use same table UI every where needed,
  - do we have a consistent UI logic for every peace of the UI (buttons, menue, colors, modal .....)
  - do we have a standard and corporate logic of branding

keeping the points above, I need you to give me every possible suggestions we should perform in order to refactore our project to be a standard, coporative and production ready

Do not start to change anything

I need a very detailed, precised and AI Agent understandable step by step checklist to perform all the fixes, and feature and refactores you are mentioning step by step in small segments of implementaion

# ------------------------------
