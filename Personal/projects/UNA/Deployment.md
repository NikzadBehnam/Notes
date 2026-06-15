I reviewed the project structure and deployment docs. The app uses:

- **Neon/Postgres via Prisma**
- **Better Auth** for admin login
- **UploadThing** for images/contact attachments
- **Vercel** for hosting
- **Prisma seed** currently creates bootstrap admin plus demo services, partners, projects, testimonials
- Required envs are already documented in `.env.example` and `docs/release-runbook.md`

Here is the deployment task split into 3 clean phases.

**Phase 1: Client Private Setups**
Goal: move all private infrastructure to client-owned accounts while testing locally first.

1. Create client-owned service accounts:
   - Neon account/project for production Postgres
   - UploadThing account/app for uploads
   - Generate private Better Auth secret
   - Generate preview secrets
   - Confirm client admin email list

2. Prepare production env values:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
   - `BETTER_AUTH_TRUSTED_ORIGINS`
   - `UPLOADTHING_TOKEN`
   - `PREVIEW_SECRET`
   - `NEXT_PUBLIC_PREVIEW_TOKEN`
   - `ADMIN_EMAILS`
   - `ALLOW_PUBLIC_SIGNUP=false`
   - temporary `ADMIN_BOOTSTRAP_PASSWORD`

3. Set up local `.env` using the new client Neon and UploadThing credentials.

4. Run Prisma migration against the new Neon DB:
   - apply all existing migrations
   - verify `prisma migrate status`
   - generate Prisma client if needed

5. Migrate existing data:
   - export current production/staging database data if we want to preserve it
   - import into the new Neon database
   - verify users, settings, services, products, projects, partners, testimonials, blog posts, contact messages
   - verify uploaded file URLs/keys still make sense, or re-upload/migrate assets if needed

6. Bootstrap first client admin:
   - set `ADMIN_EMAILS`
   - run seed only if needed to create the first admin
   - log in locallygit
   - remove `ADMIN_BOOTSTRAP_PASSWORD` after the first admin exists

7. Local smoke test:
   - public EN/IT pages
   - admin login/logout
   - admin CRUD
   - UploadThing image upload
   - contact form with and without attachments
   - sitemap/robots canonical URLs

**Phase 2: Production Deployment In Vercel**
Goal: deploy the existing app with private client infrastructure and clean production data.

1. Clean demo/seed strategy:
   - stop using the current demo seed for production content
   - keep only safe bootstrap-admin behavior, or split demo seed from production bootstrap
   - make sure demo services, partners, projects, testimonials, and fake URLs are not inserted into production

2. Data entry/final production content:
   - settings/company info
   - services
   - products
   - projects/gallery
   - partners
   - testimonials
   - team
   - blog posts
   - privacy/terms final content
   - contact details/map/social links

3. Configure Vercel env vars:
   - add all production envs in the Vercel project
   - `NEXT_PUBLIC_SITE_URL` should initially be `https://una-allestimenti-website.vercel.app`
   - `BETTER_AUTH_URL` should match the active production origin
   - trusted origins should include both Vercel URL and future client domain

4. Deploy to Vercel:
   - run required checks locally first
   - run production build with env loaded
   - deploy to Vercel
   - confirm build logs contain no `[env]` warnings

5. Production smoke test on Vercel URL:
   - `/en` and `/it`
   - auth/admin access
   - uploads
   - contact form
   - protected attachment download
   - admin tables/forms
   - sitemap/robots
   - no visible demo/fake data unless intentionally approved

6. Lock production:
   - confirm `ALLOW_PUBLIC_SIGNUP=false`
   - remove `ADMIN_BOOTSTRAP_PASSWORD` from Vercel after first admin is created
   - confirm only approved client admin emails have admin access

**Phase 3: Client Domain Setup**
Goal: connect the real domain and make it the canonical production origin.

1. Confirm final client domain, probably:
   - `https://www.una-allestimenti.com`
   - optional redirect from apex `https://una-allestimenti.com`

2. Add domain in Vercel project.

3. Configure DNS with the client/domain owner:
   - Vercel-provided records for `www`
   - apex redirect or Vercel apex record if required

4. Update production env vars after domain is active:
   - `NEXT_PUBLIC_SITE_URL=https://www.una-allestimenti.com`
   - `BETTER_AUTH_URL=https://www.una-allestimenti.com`
   - `BETTER_AUTH_TRUSTED_ORIGINS=https://www.una-allestimenti.com,https://una-allestimenti-website.vercel.app`

5. Redeploy after env changes.

6. Final domain verification:
   - public pages load on client domain
   - login works on client domain
   - uploads work on client domain
   - contact form works
   - sitemap/robots use the client domain
   - Vercel URL still works or redirects according to client preference

7. Post-release monitoring:
   - watch Vercel logs
   - watch Neon metrics
   - watch UploadThing upload/delete logs
   - run one real contact submission
   - run one admin upload
   - confirm no auth origin errors

Main note: the biggest thing to handle carefully is `prisma/seed.ts`, because it currently contains demo content. For production, we should separate “bootstrap first admin” from “insert demo data” before using seeds on the client database.
