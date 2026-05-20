**Execution Model**
`Program branch:` `generalfixes`  
`Per-step branch rule:` create each step branch from latest `general-fixes`, merge back into `general-fixes` after review.  
`Per-step commit rule:` 1 focused commit per step (or 2 max if migration/generate split is unavoidable).  
`Per-step verification rule:` run relevant checks before merge and include results in PR description.

**Global done checklist for every step**

- [ ] Branch created from latest `general-fixes`
- [ ] Only step-scoped files changed
- [ ] Checks executed (`pnpm lint` + step-specific checks)
- [ ] PR merged into `general-fixes`

---

1. **Program bootstrap**  
   `Branch:` `general-fixes/00-program-bootstrap`  
   `Commit:` `chore(repo): bootstrap refactor program workflow and guardrails`

- [ ] Create `docs/refactor-program.md` with branch/commit/PR rules
- [ ] Add `docs/definition-of-done.md` for security, UI, i18n, production criteria
- [ ] Add PR template section for “step id”, “scope”, “verification”
- [ ] Confirm no runtime logic changes in this step

2. **Fail-closed admin check**  
   `Branch:` `general-fixes/01-admin-fail-closed`  
   `Commit:` `fix(auth): make admin authorization fail-closed by default`

- [ ] Update `lib/auth-guard.ts` so empty `ADMIN_EMAILS` does **not** grant admin access
- [ ] Add explicit error/log path for missing admin configuration
- [ ] Update `.env.example` with required `ADMIN_EMAILS` format
- [ ] Verify admin routes block non-admin users

3. **User role model in DB**  
   `Branch:` `general-fixes/02-user-role-model`  
   `Commit:` `feat(auth): introduce UserRole enum and role field`

- [ ] Add `UserRole` enum and `role` field in `prisma/schema.prisma` (`USER` default)
- [ ] Create Prisma migration
- [ ] Update seed/bootstrap logic to create at least one admin user safely
- [ ] Regenerate Prisma client and verify type usage compiles

4. **Centralized authz helpers**  
   `Branch:` `general-fixes/03-central-authz-guards`  
   `Commit:` `refactor(auth): add centralized requireAuthenticated and requireAdmin guards`

- [ ] Add shared server authz utility (`requireAuthenticatedUser`, `requireAdminUser`)
- [ ] Ensure helper returns consistent typed result/error behavior
- [ ] Replace direct session calls where easy in touched auth modules
- [ ] Add unit tests for helper behavior

5. **Layout-level guard hardening**  
   `Branch:` `general-fixes/04-admin-layout-hardening`  
   `Commit:` `refactor(auth): enforce role guard in protected and admin layouts`

- [ ] Update protected/admin layouts to use centralized guard helper
- [ ] Ensure locale-safe redirects for unauthorized access
- [ ] Validate no redirect loops for expired/deleted sessions
- [ ] Verify admin layout blocks USER role accounts

6. **Server actions admin enforcement**  
   `Branch:` `general-fixes/05-server-actions-admin-enforcement`  
   `Commit:` `fix(auth): enforce admin authorization on mutating server actions`

- [ ] Add admin guard to mutating actions in blog/products/partners/team/settings/contact-status
- [ ] Keep public actions public (e.g., contact submit) with clear separation
- [ ] Standardize unauthorized response payload (`success:false`, message/code)
- [ ] Verify mutations fail for non-admin users

7. **Secure contact attachments endpoint**  
   `Branch:` `general-fixes/06-api-attachments-auth`  
   `Commit:` `fix(security): protect contact attachments download endpoint`

- [ ] Add admin auth check in `app/api/contact/[id]/attachments/route.ts`
- [ ] Ensure 401/403 behavior is explicit and non-leaky
- [ ] Keep existing zip/single redirect behavior for authorized users
- [ ] Verify endpoint cannot be accessed anonymously

8. **Upload authorization consistency**  
   `Branch:` `general-fixes/07-uploadthing-authz`  
   `Commit:` `fix(upload): align uploadthing middleware with role-based authorization`

- [ ] Enforce admin role for admin upload endpoints (`blogCoverImage`, `productGallery`, `projectGallery`, `partnerLogo`)
- [ ] Keep `contactAttachments` public only if explicitly intended
- [ ] Add comments/docs for each endpoint auth policy
- [ ] Verify upload attempts by USER role fail on admin endpoints

9. **Registration policy hardening**  
   `Branch:` `general-fixes/08-signup-policy`  
   `Commit:` `feat(auth): gate public signup behind feature flag`

- [ ] Add feature flag `allowPublicSignup` in config/env
- [ ] Hide/disable register route when flag is false
- [ ] Add friendly UX message for disabled registration
- [ ] Document admin bootstrap flow for first account creation

10. **Auth boundary tests**  
    `Branch:` `general-fixes/09-authz-tests`  
    `Commit:` `test(auth): add integration coverage for admin and user boundaries`

- [ ] Add tests for admin-only routes/actions/apis
- [ ] Add tests for USER-denied behavior
- [ ] Add tests for missing `ADMIN_EMAILS` / role bootstrap edge cases
- [ ] Add CI test command for auth boundary suite

11. **Contact submission single-path refactor**  
    `Branch:` `general-fixes/10-contact-submit-unification`  
    `Commit:` `refactor(contact): unify contact submission through one backend path`

- [ ] Choose one path (preferred: server action) as single source of truth
- [ ] Update public contact form to use selected path
- [ ] Remove or deprecate duplicate submission path (`/api/contact` or action)
- [ ] Verify attachment persistence and status defaults unchanged

12. **Consistent API result contract**  
    `Branch:` `general-fixes/11-api-response-contract`  
    `Commit:` `refactor(api): standardize API success and error envelopes`

- [ ] Define shared API result shape for routes
- [ ] Apply to project/blog/contact/search endpoints where practical
- [ ] Standardize error codes/messages for frontend mapping
- [ ] Update consumers to handle normalized contract

13. **About content wiring**  
    `Branch:` `general-fixes/12-about-content-wiring`  
    `Commit:` `feat(content): render managed about content on public about page`

- [ ] Render `settings.aboutHtml` on public about page
- [ ] Sanitize/validate HTML rendering path
- [ ] Add empty fallback content state
- [ ] Verify localized metadata still works

14. **Shared admin page shell component**  
    `Branch:` `general-fixes/13-admin-shell-component`  
    `Commit:` `feat(ui): introduce reusable AdminPageShell component`

- [ ] Create shared admin page wrapper with header/title/description/actions area
- [ ] Normalize spacing/container/sticky header behavior
- [ ] Support loading and empty states slots
- [ ] Document usage pattern

15. **Migrate admin pages to shared shell**  
    `Branch:` `general-fixes/14-admin-pages-shell-migration`  
    `Commit:` `refactor(ui): migrate admin pages to AdminPageShell`

- [ ] Migrate dashboard/blog/messages/partners/products/projects/settings/team/profile pages
- [ ] Remove duplicate page scaffolding markup
- [ ] Keep route behavior unchanged
- [ ] Visual-check desktop/mobile layout consistency

16. **Shared data table foundation**  
    `Branch:` `general-fixes/15-shared-table-foundation`  
    `Commit:` `feat(ui): add shared AdminDataTable foundation`

- [ ] Create reusable table scaffolding: toolbar, filters row, pagination, empty row
- [ ] Provide unified action cell and destructive action hooks
- [ ] Add i18n-ready labels/props for all text
- [ ] Keep TanStack compatibility for advanced tables

17. **Migrate custom tables (partners/products/messages)**  
    `Branch:` `general-fixes/16-table-migration-partners-products-messages`  
    `Commit:` `refactor(ui): migrate custom admin tables to shared table framework`

- [ ] Move partners/products/messages tables to shared table foundation
- [ ] Normalize search/filter/pagination behavior
- [ ] Replace hardcoded labels with translated keys
- [ ] Verify row actions and destructive dialogs are consistent

18. **Loading and skeleton coverage**  
    `Branch:` `general-fixes/17-loading-skeleton-coverage`  
    `Commit:` `feat(ui): add consistent route loading and skeleton states`

- [ ] Add missing `loading.tsx` for primary public/admin routes
- [ ] Replace ad-hoc `animate-pulse` blocks with shared `Skeleton` components
- [ ] Ensure table pages show consistent loading placeholders
- [ ] Verify no layout shift regressions

19. **Primitive enforcement pass**  
    `Branch:` `general-fixes/18-ui-primitives-enforcement`  
    `Commit:` `refactor(ui): replace raw controls with shared UI primitives`

- [ ] Replace raw checkboxes in blog/settings with `Checkbox` primitive
- [ ] Replace raw interaction buttons where appropriate with shared `Button`
- [ ] Keep raw hidden file input only when technically necessary
- [ ] Align focus/disabled/error states across controls

20. **Modal/menu/button consistency pass**  
    `Branch:` `general-fixes/19-modal-button-consistency`  
    `Commit:` `refactor(ui): normalize dialogs, menus, and button semantics`

- [ ] Standardize destructive confirmation copy and button variants
- [ ] Standardize icon button sizes and aria labels
- [ ] Standardize dropdown menu action ordering (edit first, delete last)
- [ ] Verify keyboard accessibility across dialogs/menus

21. **Admin/auth i18n extraction**  
    `Branch:` `general-fixes/20-i18n-admin-auth`  
    `Commit:` `refactor(i18n): externalize admin and auth hardcoded strings`

- [ ] Extract literals from auth forms, admin tables, admin pages
- [ ] Add keys in `i18n/messages/en.json` and `i18n/messages/it.json`
- [ ] Remove hardcoded toast messages and placeholders
- [ ] Verify no missing-key runtime warnings

22. **Public/shared i18n extraction**  
    `Branch:` `general-fixes/21-i18n-public-shared`  
    `Commit:` `refactor(i18n): externalize public and shared component literals`

- [ ] Extract literals from navbar/footer/search/legal/public cards/components
- [ ] Localize metadata labels and helper text where applicable
- [ ] Ensure fallback strategy for optional translations
- [ ] Verify EN/IT parity for new keys

23. **i18n automation checks**  
    `Branch:` `general-fixes/22-i18n-validation-automation`  
    `Commit:` `chore(i18n): add automated checks for message completeness and hardcoded literals`

- [ ] Stabilize/repair `scripts/validate-messages.ts` execution path
- [ ] Add script to detect hardcoded UI text in locale-dependent areas
- [ ] Add checks to CI pipeline
- [ ] Fail build on missing translation keys in touched namespaces

24. **Legal pages production content**  
    `Branch:` `general-fixes/23-legal-pages-production-content`  
    `Commit:` `feat(content): replace legal placeholder pages with approved localized copy`

- [ ] Replace lorem text in privacy/terms with approved legal copy
- [ ] Add EN/IT localized legal content
- [ ] Ensure metadata descriptions are production-safe
- [ ] Add review note for legal sign-off before release

25. **Brand source-of-truth unification**  
    `Branch:` `general-fixes/24-brand-source-unification`  
    `Commit:` `refactor(branding): centralize branding source across metadata and UI`

- [ ] Define one brand source strategy (`settings` with fallback to static config)
- [ ] Update root metadata generation to use unified source
- [ ] Align navbar/footer/hero branding with same source
- [ ] Verify OG/Twitter/canonical metadata consistency

26. **Typography token normalization**  
    `Branch:` `general-fixes/25-font-token-normalization`  
    `Commit:` `refactor(ui): normalize font tokens and remove conflicting body font bindings`

- [ ] Remove conflicting multi-font body class application
- [ ] Map CSS font tokens correctly to declared font variables
- [ ] Define clear usage rules (sans/headline/mono)
- [ ] Visual QA on key public/admin pages

27. **Upload flow consolidation**  
    `Branch:` `general-fixes/26-media-uploader-unification`  
    `Commit:` `refactor(media): consolidate image upload components and validation rules`

- [ ] Extract shared uploader core for product/project/partner
- [ ] Reuse shared validation helpers and text formatting
- [ ] Keep endpoint-specific constraints configurable
- [ ] Verify alt text/order/remove flows across all galleries

28. **Dependency cleanup**  
    `Branch:` `general-fixes/27-dependency-cleanup`  
    `Commit:` `chore(deps): remove unused dependencies and align package hygiene`

- [ ] Remove verified-unused packages (`recharts`, `@radix-ui/react-scroll-area`, etc.) if truly unused
- [ ] Keep CSS-imported/runtime-required packages (`shadcn`, `tw-animate-css`) if needed
- [ ] Re-run lockfile install and lint/build checks
- [ ] Document removed packages and rationale

29. **Migration governance cleanup**  
    `Branch:` `general-fixes/28-prisma-migration-governance`  
    `Commit:` `chore(db): establish migration governance and normalize migration strategy`

- [ ] Decide mode: keep history (prod-safe) vs squash baseline (pre-prod only)
- [ ] Add `docs/db-migration-policy.md` with strict rules
- [ ] Ensure no duplicate/conflicting migration names going forward
- [ ] Verify `prisma migrate status` is clean

30. **CI/build hardening**  
    `Branch:` `general-fixes/29-ci-build-hardening`  
    `Commit:` `ci: harden lint/build pipelines and fix platform-specific failures`

- [ ] Fix `pnpm lint:messages` reliability (esbuild EPERM handling/runtime pinning)
- [ ] Fix build path for Turbopack/Prisma symlink permission issue
- [ ] Pin CI Node version and OS matrix explicitly
- [ ] Enforce required checks: lint, i18n, build, auth tests

31. **Release runbook and final integration**  
    `Branch:` `general-fixes/30-release-checklist-and-merge`  
    `Commit:` `docs(release): finalize production readiness checklist and merge protocol`

- [ ] Add final release checklist (security/i18n/ui/legal/build/db)
- [ ] Run full regression pass on `general-fixes`
- [ ] Open final PR `general-fixes -> main`
- [ ] Include rollback plan and post-release verification plan

---

**Suggested merge cadence**

- Security/Auth block first: steps `01` to `09`
- Backend/API consistency: steps `10` to `12`
- UI systemization: steps `13` to `20`
- i18n/content/branding: steps `21` to `26`
- Platform hardening/release: steps `27` to `31`

If you want, I can now produce the same checklist in a strict machine format (`YAML` or `JSON`) so another AI agent can execute it with deterministic step IDs and dependencies.
