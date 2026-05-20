Implement checklist step 29 only.

```json
{
  "step_number": 29,
  "id": "29",
  "title": "Migration governance cleanup",
  "branch": "general-fixes/28-prisma-migration-governance",
  "commit_message": "chore(db): establish migration governance and normalize migration strategy",
  "depends_on": ["28"],
  "tasks": [
    "Choose migration approach (keep full history vs pre-prod baseline squash)",
    "Create docs/db-migration-policy.md with strict migration rules",
    "Prevent duplicate or conflicting migration naming going forward",
    "Verify prisma migrate status is clean"
  ],
  "verification": ["pnpm lint", "npx prisma migrate status"]
}
```

If blocked, stop and report blocker with exact file/line and proposed fix.

Output:

1. changed files
2. why
3. verification results
4. do not commit changes, I will manually after the code review

---

Right now, with `ALLOW_PUBLIC_SIGNUP=false`, nobody can register from `/register` (including admins).  
Current safe process is:

1. Set `ALLOW_PUBLIC_SIGNUP="true"` in env.
2. Restart the app (or redeploy if on Vercel).
3. Admin opens `/en/register` (or `/it/register`) and creates the user account.
4. If that user must be admin, add their email to `ADMIN_EMAILS` (and/or set `role=ADMIN` in DB).
5. Set `ALLOW_PUBLIC_SIGNUP="false"` again and restart/redeploy.

Important: the **bootstrap flow** is mainly for creating the first admin when none exists, not for day-to-day user onboarding.

If you want, the next improvement is an **admin-only “Create User/Invite User”** flow so public signup can stay disabled permanently.
