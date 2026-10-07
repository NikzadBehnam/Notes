# Kuraishi Car Dealer — Better Auth Implementation Prompts for Codex

Use these prompts in order, one prompt per Codex turn. Do not paste all prompts at once. Commit only after you have reviewed and tested the result of the current step.

## Confirmed architecture

- Next.js App Router with TypeScript
- Tailwind CSS and shadcn/ui
- `pnpm`
- Better Auth, latest stable version compatible with the project
- Prisma ORM 7
- Neon PostgreSQL
- Resend for verification and password-reset emails
- Google as the first social provider
- Public registration; new users receive `CUSTOMER`
- Roles: `ADMIN`, `STAFF`, and `CUSTOMER`
- Only `ADMIN` can access `/admin`
- Email/password users must verify their email before login
- Production URL: `https://kuraishi-car-dealer.vercel.app`
- First administrator created with an idempotent seed script

## Documentation supplied to Codex

- Better Auth: https://better-auth.com/docs/introduction
- Better Auth + Next.js: https://better-auth.com/docs/integrations/next
- Better Auth Prisma adapter: https://better-auth.com/docs/adapters/prisma
- Better Auth email/password: https://better-auth.com/docs/authentication/email-password
- Better Auth Google provider: https://better-auth.com/docs/authentication/google
- Prisma ORM: https://www.prisma.io/docs/orm
- Prisma PostgreSQL: https://www.prisma.io/docs/orm/core-concepts/supported-databases/postgresql
- Prisma 7 upgrade guide: https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7
- Neon connection guide: https://neon.com/docs/connect/connect-intro
- Resend + Next.js: https://resend.com/docs/send-with-nextjs
- Resend quotas: https://resend.com/docs/knowledge-base/account-quotas-and-limits

---

## Prompt 1 — Repository audit and implementation plan

```md
You are working in the Kuraishi Car Dealer repository. Before changing any code, perform a complete authentication-readiness audit.

Confirmed target stack:

- Next.js App Router and TypeScript
- pnpm
- latest stable Better Auth compatible with this project
- Prisma ORM 7
- Neon PostgreSQL
- Resend
- Google OAuth
- Vercel production URL: https://kuraishi-car-dealer.vercel.app

Authentication requirements:

- Public email/password registration
- Email verification required before email/password login
- Login, logout, persistent sessions, and Remember Me
- Forgot/reset password
- Google login
- Roles: ADMIN, STAFF, CUSTOMER
- Public registration always creates CUSTOMER
- Only ADMIN can access /admin
- First ADMIN must be created by an idempotent seed script

Mandatory documentation-first workflow:

1. Inspect package.json, pnpm-lock.yaml, Next.js configuration, TypeScript configuration, source structure, auth pages/forms/schemas, route groups, admin layouts, middleware/proxy, environment examples, and any existing database/auth code.
2. Determine the exact installed Next.js and React versions from the lockfile. Do not assume that `latest` in package.json tells you the installed version.
3. Review the current official documentation before making recommendations:
   - https://better-auth.com/docs/introduction
   - https://better-auth.com/docs/integrations/next
   - https://better-auth.com/docs/adapters/prisma
   - https://www.prisma.io/docs/orm
   - https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7
   - https://neon.com/docs/connect/connect-intro
4. If documentation has changed since this prompt was written, follow the current official documentation and explicitly describe the difference.
5. Do not use blogs or old tutorials when official documentation covers the subject.

Tasks:

- Confirm whether the repository is ready for Prisma 7 and Better Auth.
- Identify conflicts, obsolete patterns, missing files, existing mock authentication behaviour, and migration risks.
- Identify the exact files likely to be created or modified in every later step.
- Recommend the correct implementation order.
- Identify decisions that truly block implementation. Do not ask for information that can safely be derived from the repository or official docs.
- Pay particular attention to Prisma 7 driver-adapter requirements, ESM requirements, Next.js `proxy.ts` versus `middleware.ts`, and secure server-side admin authorization.

Output:

- Current repository findings with file references
- Installed versions
- Risks and conflicts
- Proposed file map
- Ordered implementation plan
- Remaining blockers, if any

Do not install packages or modify files in this step. Stop after the audit.
```

## Prompt 2 — Install and pin dependencies

```md
Implement only the dependency-installation step for the Kuraishi authentication stack.

Before changing package.json or pnpm-lock.yaml:

1. Inspect the repository and the findings from the previous audit.
2. Read the latest official Better Auth Prisma adapter documentation and Prisma 7 documentation:
   - https://better-auth.com/docs/adapters/prisma
   - https://www.prisma.io/docs/orm
   - https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7
   - https://resend.com/docs/send-with-nextjs
3. Confirm the current stable, mutually compatible versions of Better Auth, its Prisma adapter, Prisma 7, the required PostgreSQL driver adapter, `pg`, and Resend.
4. Follow the current official package names. Do not blindly copy package names or commands from this prompt if the official docs changed.

Requirements:

- Use pnpm only.
- Install only dependencies needed for Better Auth + Prisma 7 + Neon PostgreSQL + Resend.
- Do not upgrade unrelated dependencies.
- Do not use broad `latest` ranges in package.json unless the repository deliberately uses that policy and you explain why it is safe.
- Ensure Prisma CLI belongs in devDependencies and runtime packages belong in dependencies.
- Include TypeScript types when required.
- Preserve unrelated package.json scripts.

After installation:

- Show the exact package changes and why each is needed.
- Run `pnpm install` if needed and verify the lockfile.
- Run the existing typecheck/lint commands only if this step does not yet require missing generated files; otherwise explain the expected temporary failure precisely.
- Check `git diff` and confirm no unrelated changes.

Do not configure Prisma or Better Auth yet. Stop after dependency installation and verification.
```

## Prompt 3 — Establish environment-variable contracts

```md
Implement only the environment-variable contract for Better Auth, Prisma 7, Neon, Resend, Google OAuth, and the first-admin seed.

Before editing:

1. Review the current official docs:
   - https://better-auth.com/docs/introduction
   - https://better-auth.com/docs/authentication/google
   - https://neon.com/docs/connect/connect-intro
   - https://resend.com/docs/send-with-nextjs
   - https://www.prisma.io/docs/orm
2. Inspect all existing `.env*`, ignore rules, configuration utilities, and validation conventions.
3. Never print, copy, or commit real secrets.

Required configuration concepts:

- Neon pooled runtime connection
- Neon direct migration connection when current Prisma/Neon docs recommend it
- Better Auth secret
- Better Auth local and production base URL
- Resend API key and sender
- Google client ID and secret
- Seed-admin identity inputs

Tasks:

- Update or create `.env.example` using safe placeholders and useful comments.
- Ensure secret-bearing local env files are ignored.
- Add typed runtime validation only if the repository already uses an env-validation pattern, or propose a minimal standard implementation supported by the current stack.
- Clearly distinguish server-only variables from any browser-exposed variables. Do not expose secrets with `NEXT_PUBLIC_`.
- Use `http://localhost:3000` locally and document `https://kuraishi-car-dealer.vercel.app` for production.
- Document how to generate a strong Better Auth secret using the current official recommendation.

Validation:

- Confirm no real credentials are in the diff.
- Confirm variable names exactly match the current libraries' expectations or the explicit configuration that will consume them.
- Run relevant formatting/type checks.

Do not create the Neon database, Prisma schema, auth configuration, or Vercel variables in this step. Stop after the environment contract is ready.
```

## Prompt 4 — Configure Neon manually (instruction-only checkpoint)

```md
Guide me through creating and configuring the Neon PostgreSQL database for this repository. This step is documentation and validation only unless authenticated Neon tooling is already explicitly configured in the repository.

Before giving instructions:

1. Review https://neon.com/docs/connect/connect-intro and the latest official Prisma 7 PostgreSQL guidance.
2. Confirm whether Prisma 7 currently recommends a pooled URL for runtime and a direct URL for migrations with Neon.
3. If the recommendation changed, use the new recommendation and explain it.

Provide exact instructions for:

- Creating the Neon project and database
- Choosing a sensible region
- Finding pooled and direct connection strings
- Mapping them to the variable names already established in `.env.example`
- Enabling SSL parameters as currently required
- Adding local values without committing them
- Safely testing connectivity without exposing credentials

Do not fabricate connection strings and do not ask me to paste secrets into chat. Do not modify application code. End with a short checklist and wait for me to confirm that Neon is ready.
```

## Prompt 5 — Initialize and configure Prisma 7

```md
Implement the Prisma 7 foundation for the Kuraishi repository, but do not add Better Auth models yet.

Documentation-first requirements:

1. Read the latest official Prisma ORM, Prisma 7 upgrade, PostgreSQL, and Better Auth Prisma adapter documentation:
   - https://www.prisma.io/docs/orm
   - https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7
   - https://www.prisma.io/docs/orm/core-concepts/supported-databases/postgresql
   - https://better-auth.com/docs/adapters/prisma
2. Confirm the current Prisma 7 generator syntax, explicit generated-client output, `prisma.config.ts` syntax, datasource URL placement, and driver-adapter requirement.
3. Follow current official documentation if it differs from old Prisma 6 examples.

Tasks:

- Initialize Prisma for PostgreSQL using pnpm-compatible commands.
- Configure `prisma/schema.prisma` with the Prisma 7 generator and a project-appropriate generated-client location.
- Configure `prisma.config.ts` correctly for migrations.
- Preserve the repository's ESM and path-alias conventions.
- Do not invent application models yet.
- Add useful package scripts for Prisma generate, format, validate, migrations, and production migration deploy without deleting existing scripts.

Validation:

- Run Prisma format, validate, and generate.
- Run the repository typecheck and lint where applicable.
- Inspect the diff for generated artifacts that should be ignored or committed according to current Prisma guidance.
- Explain each created/changed file and any Prisma 7-specific decision.

Do not configure Better Auth or run the initial database migration yet. Stop after Prisma 7 is valid.
```

## Prompt 6 — Create the reusable Prisma client

```md
Implement only the runtime Prisma client for Prisma 7 + Neon in the Next.js application.

Before editing:

1. Review the current Prisma 7 driver-adapter and Next.js guidance, plus https://better-auth.com/docs/adapters/prisma.
2. Inspect the generated-client output chosen in the previous step and the repository's import aliases.
3. Confirm the current constructor/API for the PostgreSQL driver adapter. Do not copy a Prisma 6 singleton blindly.

Requirements:

- Use the current Prisma 7 PostgreSQL driver adapter required by the installed version.
- Use the pooled Neon runtime connection where recommended.
- Reuse a global client during Next.js development to avoid hot-reload connection multiplication.
- Keep the module server-only.
- Fail clearly when the required database variable is missing without logging its value.
- Do not create a client per request.

Validation:

- Run Prisma generate, typecheck, and lint.
- Confirm imports resolve against the actual generated path.
- Explain serverless/Neon connection behaviour and why the chosen singleton is correct.

Do not configure Better Auth yet. Stop after the Prisma client is verified.
```

## Prompt 7 — Design Better Auth schema and user fields

```md
Design and implement the Better Auth database schema for this project.

Before editing:

1. Review the current official docs for the Better Auth Prisma adapter, database schema generation, email/password, Google provider, and admin plugin.
2. Inspect the existing registration and login UI and schemas. Treat the actual UI as the source of truth for user-entered fields.
3. Inspect the installed Better Auth version and use its current CLI and schema requirements.

Confirmed domain rules:

- Roles: ADMIN, STAFF, CUSTOMER
- Public registration defaults to CUSTOMER
- Only ADMIN may access /admin
- Email registration collects first name, last name, email, phone, password, password confirmation, and consent
- `confirmPassword` and `remember` are form-only
- Google users may not provide phone, so the database must not make phone universally mandatory
- Store consent evidence as an acceptance timestamp and, if appropriate, a terms version—not merely a mutable boolean
- Include account status only when it has a clear authorization meaning; reconcile it with Better Auth admin-plugin ban fields instead of duplicating concepts carelessly
- Better Auth owns core auth/session/account/verification fields

Tasks:

- Propose the exact User fields and explain which are core, plugin-generated, and application-specific.
- Configure Better Auth additional fields/plugins sufficiently for schema generation, using temporary minimal modules if necessary.
- Generate the Better Auth Prisma models using the current official CLI workflow.
- Review the generated schema rather than accepting it blindly.
- Use safe defaults and ensure users cannot submit their own role, status, verification state, or administrative fields.
- Keep names compatible with the repository's conventions and Prisma 7.

Validation:

- Run Prisma format and validate.
- Show the resulting model/field summary and important indexes/constraints.
- Confirm the design supports both credential and Google accounts.
- Do not run a migration until I review the schema.

Stop after schema generation and validation. Clearly list any schema question that genuinely requires my decision.
```

## Prompt 8 — Create and apply the initial migration

```md
Create and apply the reviewed initial Prisma migration for the Better Auth schema.

Before running migration commands:

1. Re-read the current Prisma 7 migration documentation and Neon-specific connection recommendations.
2. Inspect the schema and existing migration history.
3. Confirm the target is the intended development Neon database without printing credentials.
4. Show me any destructive or surprising SQL before applying it.

Tasks:

- Create a clearly named initial authentication migration using pnpm/Prisma 7 commands.
- Inspect the generated SQL for tables, foreign keys, unique constraints, indexes, defaults, and delete behaviour.
- Apply it only to the confirmed development database.
- Regenerate Prisma Client.
- Do not use `db push` as a substitute for a committed migration unless official/current project policy explicitly requires it.

Validation:

- Run migrate status, Prisma validate, generate, typecheck, and lint.
- Summarize the database objects created.
- Confirm the migration file is suitable for source control and production `migrate deploy`.

Do not add Resend, route handlers, UI integration, or seed users yet. Stop after migration verification.
```

## Prompt 9 — Implement Resend email infrastructure

```md
Implement the reusable Resend transactional-email infrastructure for authentication emails only.

Before editing:

1. Review the latest Resend Next.js documentation, domain/sender requirements, error handling, and current free-plan limits:
   - https://resend.com/docs/send-with-nextjs
   - https://resend.com/docs/knowledge-base/account-quotas-and-limits
2. Review Better Auth's current email verification and password-reset callback recommendations, including serverless background-work guidance.
3. Inspect existing email utilities/templates and styling conventions.

Requirements:

- Use the server-side Resend SDK and server-only environment variables.
- Create a small typed email-sending abstraction.
- Create separate branded verification and password-reset templates.
- Escape or safely render dynamic content; do not construct unsafe HTML from user-controlled strings.
- Do not leak verification/reset URLs to logs.
- Handle provider errors predictably while avoiding account-enumeration leaks.
- Keep sender configuration environment-driven.
- Do not pretend the Vercel subdomain is a Resend sending domain. Document the verified custom-domain requirement.
- If using React Email would add a new dependency, justify it from the current official guidance and project needs before adding it.

Validation:

- Unit-test template generation or the email wrapper without sending a real email.
- Run typecheck, lint, and relevant tests.
- Document the one manual Resend/domain setup action still required.

Do not connect these emails to Better Auth yet. Stop after the email layer is ready.
```

## Prompt 10 — Configure Better Auth server

```md
Implement the production-quality Better Auth server configuration using the existing Prisma and email layers.

Before editing:

1. Review the latest official Better Auth docs for options, Prisma adapter, email/password, email verification, Next.js, Google, sessions, cookies, trusted origins, and admin roles.
2. Confirm the installed Better Auth API signatures. If they differ from examples in this prompt, follow the installed/current official API.
3. Inspect the schema generated earlier and keep configuration synchronized with it.

Required behaviour:

- Prisma PostgreSQL adapter
- Email/password enabled
- Email verification required before credential login
- Verification email sent on signup
- Forgot/reset password enabled through Resend
- Resetting password revokes existing sessions
- Google provider configured from environment variables
- Default public role CUSTOMER
- Roles ADMIN, STAFF, CUSTOMER
- ADMIN is the only admin role for this project's `/admin`
- Secure production cookies/base URL/trusted origins for localhost and https://kuraishi-car-dealer.vercel.app
- Application-specific fields aligned with the schema
- No browser-provided role/status/verified/consent-timestamp privilege fields
- Safe account linking between Google and credential accounts according to current Better Auth defaults/guidance

Important:

- Validate registration consent server-side. The public Better Auth signup endpoint must not provide a bypass that creates a noncompliant account. Choose a design supported by current Better Auth hooks/API and explain it.
- Avoid awaiting email delivery when current Better Auth/serverless guidance recommends background dispatch, but make sure Vercel does not terminate the work. Use the currently recommended mechanism.
- Do not weaken account enumeration or token security.

Validation:

- Run Prisma generate, typecheck, lint, and focused tests.
- Explain the complete auth configuration by concern.
- Identify any behaviour that still depends on a later route/UI step.

Do not mount the API route or alter forms yet. Stop after the server configuration is valid.
```

## Prompt 11 — Mount Next.js handler and create auth client

```md
Mount Better Auth in the Next.js App Router and create the browser auth client.

Before editing:

1. Review https://better-auth.com/docs/integrations/next and the current client/plugin docs.
2. Inspect the actual App Router source root and existing API routes.
3. Confirm whether this installed version requires any Next.js cookie plugin for the APIs we will use.

Tasks:

- Add the recommended catch-all Better Auth handler under the correct `/api/auth/[...all]` App Router path.
- Create one reusable client instance using the correct React import.
- Add only client plugins required by the configured server plugins.
- Keep server configuration out of client bundles.
- Preserve the repository's aliases and module boundaries.

Validation:

- Confirm GET/POST handler exports match current official docs.
- Run typecheck, lint, build if practical, and focused route checks.
- Verify no secrets are bundled into client code.
- List the generated auth endpoints that matter for upcoming UI work.

Do not modify registration/login UI yet. Stop after handler/client integration.
```

## Prompt 12 — Implement credential registration and verification flow

```md
Replace the existing UI-only registration flow with real Better Auth email/password registration and required email verification.

Before editing:

1. Review current Better Auth signup and email-verification APIs.
2. Inspect the existing registration form, Zod schema, shared auth fields, design system, toast conventions, and route structure.
3. Preserve the existing visual design unless a functional state requires a small addition.

Requirements:

- Submit firstName, lastName, composed display name, email, phone, password, and preferred language as supported by the configured schema.
- Validate password confirmation and consent before submission.
- Enforce consent on the server, not only in React/Zod.
- Record trustworthy consent metadata.
- Never accept role, status, emailVerified, or administrative properties from the form.
- New public users must become CUSTOMER.
- After successful signup, show a neutral “check your email” flow and do not create an authenticated credential session before required verification.
- Add a verification-pending page and success/error handling for verification callbacks.
- Provide a safe resend-verification action with throttling behaviour supplied by Better Auth/current design.
- Prevent duplicate submission and show accessible loading/errors.
- Avoid revealing whether an email already exists more than necessary.

Testing:

- Add/update unit/component tests for validation, successful request mapping, provider error, consent rejection, and pending-verification UI.
- Run typecheck, lint, tests, and build if practical.
- Manually describe the end-to-end test using a real development inbox.

Do not implement login, Google, or password reset in this step. Stop after registration/verification is complete.
```

## Prompt 13 — Implement credential login, session, logout, Remember Me

```md
Replace the mock login with Better Auth credential login and add session/logout support.

Before editing:

1. Review current Better Auth email sign-in, session, React client, Remember Me, and sign-out docs.
2. Inspect the existing login UI and all navigation/header components where login state appears.
3. Confirm the exact installed-client method signatures.

Requirements:

- Submit email and password through Better Auth.
- Map the existing “Remember this device” checkbox to Better Auth's supported session persistence option.
- Respect `callbackURL` safely for return-to navigation, preventing open redirects.
- Show useful but non-enumerating error messages for bad credentials and unverified email.
- Provide a clear path to resend verification when appropriate.
- Replace mock login toasts.
- Add a reusable server-side session helper and use the reactive client session only where client reactivity is genuinely needed.
- Implement logout and update navigation/auth state.
- Keep authorization decisions on the server.

Testing and verification:

- Test successful login, invalid credentials, unverified account, Remember Me true/false, logout, and callback URL validation.
- Run typecheck, lint, tests, and build.
- Describe browser checks for cookies and persistence without exposing cookie contents.

Do not implement Google or password reset yet. Stop after credential session flow works.
```

## Prompt 14 — Implement Google authentication

```md
Implement Google login as the first social provider.

Before editing:

1. Review the latest Better Auth Google documentation:
   https://better-auth.com/docs/authentication/google
2. Verify current Google Cloud OAuth requirements from official Google documentation linked by Better Auth.
3. Inspect the existing auth pages for the best design-system-compatible Google button placement.

Requirements:

- Use the configured Better Auth Google provider.
- Add Google login to the login page and, if UX-consistent, registration page.
- Use safe callback URLs.
- New Google users must receive CUSTOMER.
- Google users count as email-verified only according to Better Auth/provider verified-email handling.
- Handle users whose Google profile does not provide phone by allowing later profile completion.
- Review account-linking behaviour when a credential account already uses the same email; follow current secure Better Auth guidance and explain the decision.
- Do not request unnecessary Google scopes.

Also provide a manual Google Cloud setup checklist with exact development and production origins and callback URLs for:

- http://localhost:3000
- https://kuraishi-car-dealer.vercel.app

Never request that secrets be pasted into chat or committed.

Validation:

- Add focused tests around invoking the Google flow and safe callbacks.
- Run typecheck, lint, tests, and build.
- Explain how to diagnose `redirect_uri_mismatch` without exposing credentials.

Do not implement password reset or admin protection in this step. Stop after Google auth is ready.
```

## Prompt 15 — Implement forgot/reset password

```md
Implement the complete forgot-password and reset-password flows with Better Auth and Resend.

Before editing:

1. Review the current Better Auth password-reset documentation and exact client APIs.
2. Review current security guidance on account enumeration, reset-token handling, expiry, and session revocation.
3. Inspect existing auth shell/form components so the new pages match the project UI.

Requirements:

- Replace the mock “Forgot?” action with navigation to a real page.
- Forgot-password submission always shows a neutral response regardless of whether the email exists.
- Use Better Auth's reset request API and Resend callback already configured.
- Implement the reset page using the token/callback format generated by the installed Better Auth version.
- Validate and confirm the new password.
- Handle missing, invalid, used, and expired tokens.
- Revoke existing sessions after successful reset.
- Redirect to login with a clear success message.
- Do not log tokens or put them in analytics/toasts.
- Maintain accessible loading, focus, and error states.

Testing:

- Test request success with neutral messaging, provider failure handling, password mismatch, invalid token, successful reset, and session revocation configuration.
- Run typecheck, lint, tests, and build.
- Provide a manual end-to-end email test checklist.

Do not implement admin protection yet. Stop after password recovery works.
```

## Prompt 16 — Secure `/admin` with role-based authorization

```md
Implement secure authentication and ADMIN-only authorization for the entire `/admin` area.

Before editing:

1. Review the latest Better Auth Next.js session/protection guidance and admin-plugin documentation.
2. Review the current Next.js version's official guidance on `proxy.ts` versus `middleware.ts`.
3. Inspect the actual `/admin` route group/layout, all admin route handlers, server actions, and data mutations.

Security requirements:

- Unauthenticated users are redirected to login with a safe return URL.
- Authenticated STAFF and CUSTOMER users receive an unauthorized response/page and cannot access admin content.
- Only ADMIN can access `/admin`.
- Early proxy/middleware checks may improve UX, but must not be the security boundary.
- The protected server layout must validate the real session and role.
- Every admin route handler and server action must independently verify session and ADMIN role before reading sensitive data or mutating state.
- Never rely only on the presence of a session cookie.
- Prevent open redirects and avoid leaking protected page content during redirects.
- Centralize server-side `requireSession`/`requireAdmin` helpers to prevent inconsistent checks.

Tasks:

- Implement the server authorization helpers.
- Protect the admin layout.
- Add the appropriate Next.js proxy/middleware only if current docs and project version justify it.
- Audit and protect all current admin server entry points.
- Create an accessible unauthorized page or use appropriate 403 behaviour.

Testing:

- Add authorization tests for anonymous, CUSTOMER, STAFF, and ADMIN.
- Test direct URLs and direct route/server-action calls, not only navigation.
- Run typecheck, lint, tests, and build.
- Provide a matrix showing expected result by role and entry point.

Stop after admin authorization is fully verified.
```

## Prompt 17 — Create the first-admin seed script

```md
Implement a safe, idempotent seed/setup script for the first ADMIN account.

Before editing:

1. Review current Better Auth server/admin APIs and Prisma 7 seeding guidance.
2. Prefer creating credentials through Better Auth rather than manually hashing passwords or inserting incomplete auth records.
3. Inspect existing scripts and environment conventions.

Requirements:

- Read email, password, first name, and last name from server-only environment variables.
- Never hard-code or log the password.
- Validate required inputs and enforce a strong password.
- Create the credential account through supported Better Auth APIs so password hashing and account records are correct.
- Mark the seed admin's email verified using a supported trusted server/admin operation.
- Assign ADMIN only from trusted server code.
- Be idempotent: rerunning must not duplicate the user, reset a working password unexpectedly, or downgrade/overwrite unrelated data.
- Refuse ambiguous conflicts and print a safe, useful result.
- Do not expose this operation as a public HTTP endpoint.
- Add a narrowly named pnpm script.

Testing and verification:

- Test first run, second run, missing variables, and existing non-admin conflict.
- Run typecheck, lint, tests, and build.
- Explain exactly how I should run it locally and in a controlled production setup without showing real secrets.

Stop after the seed script is ready. Do not execute it against production without my explicit confirmation.
```

## Prompt 18 — Vercel deployment configuration

```md
Prepare the Better Auth + Prisma 7 + Neon + Resend + Google implementation for Vercel deployment.

Before editing:

1. Review the latest official Vercel guidance linked by Next.js/Prisma/Better Auth, current Prisma 7 deployment guidance, Neon connection guidance, Resend domain guidance, and Better Auth production configuration.
2. Inspect the current build script, Vercel configuration, deployment workflow, and production domain settings.

Tasks:

- Ensure Prisma Client is generated during the build using the repository's pnpm workflow.
- Define the safe production migration procedure using `prisma migrate deploy`; do not run development migrations during builds unless current project architecture explicitly requires and justifies it.
- Produce the exact Vercel environment-variable checklist without values.
- Confirm `BETTER_AUTH_URL`, trusted origins, secure cookies, and callback URLs for https://kuraishi-car-dealer.vercel.app.
- Confirm Google OAuth production origin and redirect URI.
- Confirm Resend cannot use the Vercel subdomain as an owned sending domain and document the custom-domain prerequisite.
- Check Node/runtime compatibility and ensure auth/Prisma routes are not incorrectly deployed to Edge when the selected adapter requires Node.
- Ensure secrets never use `NEXT_PUBLIC_`.
- Add or update deployment documentation.

Validation:

- Run the production build locally.
- Run Prisma validate/generate and relevant tests.
- Inspect output for accidental secret exposure or runtime incompatibility.
- Provide an ordered deployment checklist with a rollback note.

Do not deploy or change external Vercel/Google/Neon/Resend settings without explicit authorization. Stop after the repository is deployment-ready.
```

## Prompt 19 — Complete authentication security and quality audit

```md
Perform the final security, correctness, and UX audit of the completed Kuraishi authentication implementation. Fix only issues clearly within the implemented authentication scope.

Documentation-first workflow:

1. Re-read current official Better Auth, Prisma 7, Neon, Next.js, Resend, and Google documentation relevant to the installed versions.
2. Inspect the complete diff and all auth/database/admin files.
3. If current official guidance conflicts with earlier implementation, identify and correct the outdated behaviour.

Audit areas:

- Dependency compatibility and pinned versions
- Prisma 7 driver adapter and generated client
- Migration correctness and production deployability
- Secret separation and environment validation
- Email verification and resend behaviour
- Password reset security and session revocation
- Credential login and Remember Me
- Google callback/origin/account-linking security
- Public registration always yielding CUSTOMER
- Consent validation and audit evidence
- Server-side ADMIN authorization for layouts, handlers, and actions
- Open redirect prevention
- Account enumeration resistance
- CSRF/origin/cookie/session settings
- Rate limiting or abuse protections recommended by Better Auth
- Error handling and sensitive logging
- Accessibility and loading/error UI states
- Vercel/Neon serverless compatibility

Required verification matrix:

- New credential registration
- Duplicate registration
- Unverified credential login
- Verification success/expired token/resend
- Credential login with Remember Me on/off
- Logout
- Forgot password for existing and nonexistent email
- Valid/invalid/expired/used reset token
- Google new user and existing-email behaviour
- Anonymous/CUSTOMER/STAFF/ADMIN access to `/admin`
- Direct calls to protected handlers/actions
- Seed script first and repeated run

Run:

- pnpm typecheck
- pnpm lint
- all tests
- production build
- Prisma format, validate, generate, and migrate status
- any focused security/integration tests added by the project

Output:

- Findings ordered by severity with file references
- Fixes made
- Commands and results
- Remaining manual external checks
- Final go/no-go recommendation

Do not deploy. Stop after the final audit and report.
```

## Recommended commit boundaries

Use small commits after reviewing each completed logical phase. Suggested commit messages:

1. `chore(auth): add Better Auth and Prisma dependencies`
2. `chore(env): document authentication configuration`
3. `feat(database): configure Prisma 7 with Neon`
4. `feat(auth): add Better Auth schema and migration`
5. `feat(auth): configure transactional auth emails`
6. `feat(auth): configure Better Auth server and client`
7. `feat(auth): implement registration and email verification`
8. `feat(auth): implement login and session management`
9. `feat(auth): add Google authentication`
10. `feat(auth): implement password recovery`
11. `feat(auth): enforce admin authorization`
12. `chore(auth): add first-admin seed script`
13. `docs(deploy): document authentication deployment`
14. `test(auth): complete authentication security coverage`

Do not force a commit when a step is incomplete or failing.
