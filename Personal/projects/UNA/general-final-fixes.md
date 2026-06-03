**Audit Result**

I did not edit code. I inspected configs, Prisma, auth, API routes, layouts, public/admin UI, i18n messages, styling primitives, docs, and deployment scripts.

Verification run:

- `pnpm lint:messages`: passed
- `pnpm lint:migrations`: passed
- `pnpm test:api-contract`: passed after sandbox approval
- `pnpm test:auth-boundary`: passed after sandbox approval
- `pnpm test:admin-data-table`: passed after sandbox approval
- `pnpm lint`: passed with 7 warnings
- `pnpm build`: passed
- `prisma migrate status`: database schema is up to date

Main risks found:

- `ALLOW_PUBLIC_SIGNUP` defaults to `true` in [config/feature-flags.ts](/C:/Projects/una-allestimenti-website/config/feature-flags.ts), while docs/comments say production should fail closed.
- Blog and project rich HTML render with `dangerouslySetInnerHTML` without the sanitizer already used by About.
- `.env.example` does not document all likely production env requirements, especially UploadThing and Better Auth secrets/origins.
- Build and sitemap can depend on live database availability, which can break deployments if env/database are unavailable during build.
- `NEXT_PUBLIC_SITE_URL` falls back to localhost, which can produce bad production canonical/OG URLs if missing.
- Existing hardcoded i18n strings remain in admin/product/team/settings/shared upload/header areas; current hardcoded check only scans changed files.
- CI script omits some useful tests and deployment checks already present locally.
- Admin UI has inconsistent dialog/form/table patterns in older areas.
- Styling uses a generally neutral shadcn base, but public sections mix `rounded-xl/2xl`, card shells, gradients, and bespoke hero/card treatments inconsistently.
- Lint warnings show React Compiler skipped several components using React Hook Form/TanStack Table APIs and unused symbols.

**Implementation Checklist**

Base integration branch:

- Main branch: `final-general-fixes`
- Create it from current production base, likely `master`, after confirming the 13 local commits ahead of `origin/master` are intended.

1. Branch: `01-production-env-policy`
   Commit: `fix(config): harden production environment defaults`
   Description: Change public signup default to fail closed, align `.env.example` and docs, document required production env vars for database, site URL, preview, Better Auth, UploadThing, and admin bootstrap. Add explicit validation/warnings for missing production-critical envs.

2. Branch: `02-managed-html-sanitization`
   Commit: `fix(content): sanitize managed html before public rendering`
   Description: Reuse or strengthen `sanitizeManagedHtml` for blog post content and project descriptions before `dangerouslySetInnerHTML`. Add focused tests for blocked tags, event handlers, and dangerous protocols.

3. Branch: `03-build-db-resilience`
   Commit: `fix(deploy): guard build-time database reads`
   Description: Review `sitemap`, metadata, root layout branding, public layout data loading, and settings reads. Add safe fallbacks where build-time DB access can fail, while preserving runtime behavior.

4. Branch: `04-site-url-canonical-safety`
   Commit: `fix(seo): require safe production site url`
   Description: Prevent production metadata from silently using `http://localhost:3000`. Normalize `NEXT_PUBLIC_SITE_URL`, strip trailing slashes, validate URL shape, and document deployment setup.

5. Branch: `05-uploadthing-contact-attachment-policy`
   Commit: `fix(upload): validate stored attachment origins and metadata`
   Description: Tighten contact attachment schema so stored URLs/keys match UploadThing expectations. Avoid redirecting/fetching arbitrary stored URLs in attachment download flow.

6. Branch: `06-i18n-product-admin`
   Commit: `fix(i18n): localize product admin dialog and validation`
   Description: Replace hardcoded strings in product dialog/schema/toasts with `ProductDialog`, `ProductImagesUpload`, and validation message keys already present in locale files. Ensure EN/IT parity.

7. Branch: `07-i18n-team-admin`
   Commit: `fix(i18n): localize team admin form`
   Description: Move `NewTeam` dialog labels, placeholders, buttons, toasts, and social field labels into `TeamAdmin` or a new `TeamDialog` namespace.

8. Branch: `08-i18n-settings-admin`
   Commit: `fix(i18n): localize settings admin form`
   Description: Add a `SettingsForm` namespace and replace hardcoded settings labels, descriptions, placeholders, hero labels, social toggles, and toast messages.

9. Branch: `09-i18n-shared-controls`
   Commit: `fix(i18n): localize shared control labels`
   Description: Replace remaining shared hardcoded labels such as multi-image reorder aria labels, admin mobile menu aria label, logo alt text, upload fallback messages, and partner carousel action labels.

10. Branch: `10-admin-ui-consistency`
    Commit: `refactor(admin): align dialogs and tables with shared patterns`
    Description: Bring older admin screens closer to `AdminPageShell` and `AdminDataTable` conventions. Standardize empty/loading/error states, row actions, dialog footers, destructive confirmations, and form spacing.

11. Branch: `11-style-token-consistency`
    Commit: `style(ui): normalize public and admin visual tokens`
    Description: Consolidate repeated card/section radius, border, background, shadow, and hero classes. Reduce mixed `rounded-xl/2xl` usage where not intentional and make public section treatments more consistent.

12. Branch: `12-react-compiler-lint-cleanup`
    Commit: `fix(lint): resolve compiler warnings and unused symbols`
    Description: Remove unused imports/variables and refactor React Hook Form `watch()` and TanStack Table usage where feasible to reduce React Compiler skip warnings.

13. Branch: `13-ci-release-gates`
    Commit: `ci: expand required release checks`
    Description: Update `ci:required-checks` or docs to include `test:api-contract`, `test:admin-data-table`, `lint:messages`, `lint:i18n-hardcoded`, `build`, and a documented `prisma migrate status` release gate.

14. Branch: `14-hardcoded-i18n-full-scan`
    Commit: `test(i18n): add full hardcoded literal audit`
    Description: Improve or add a script mode that scans the full locale-dependent project, not only changed files. Add allowlist comments only for intentional technical literals.

15. Branch: `15-final-regression-docs`
    Commit: `docs(release): update final general fixes runbook`
    Description: Rename/update docs from `general-fixes` to `final-general-fixes`, record final verification commands, manual smoke checklist, env checklist, rollback plan, and post-release monitoring steps.

Recommended merge order is the same as above: security/deployment first, then i18n, UI consistency, CI/docs last.
