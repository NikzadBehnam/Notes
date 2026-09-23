Below is a complete UI testing workflow for the new Better Auth implementation in Kuraishi Car Dealer. Follow the segments in order because later tests depend on accounts created earlier.

> Adapt route names if your implementation uses different URLs, such as `/auth/login` instead of `/login`.

# 1. Prepare the test environment

Before testing, confirm:

* The application is running locally or deployed to a test environment.
* Neon database connection works.
* Better Auth API is available.
* Resend is configured and can send emails.
* Google OAuth credentials include the correct callback URL.
* Database migrations have been applied.
* The first `ADMIN` seed has been executed.
* Browser DevTools is open on the Network and Console tabs.

Prepare these test accounts:

| Account             | Purpose                       |
| ------------------- | ----------------------------- |
| New unused email    | Registration and verification |
| Existing `CUSTOMER` | Customer access tests         |
| Existing `STAFF`    | Staff authorization tests     |
| Existing `ADMIN`    | Admin authorization tests     |
| Google account      | Google authentication         |
| Nonexistent email   | Password-reset privacy test   |

Use a private/incognito window to avoid interference from existing sessions.

Record every test as:

```text
Test:
Environment:
Account:
Expected result:
Actual result:
Status: PASS / FAIL
Screenshot or error:
```

# 2. General smoke test

## Test 2.1 — Public pages

1. Open the home page.
2. Open `/login`.
3. Open `/register`.
4. Refresh each page.
5. Check the browser console.

Expected:

* All pages load without server errors.
* Login and registration forms are visible.
* No hydration errors appear.
* There are no failed authentication requests on initial page load.
* The UI maintains the existing Kuraishi design.

## Test 2.2 — Better Auth endpoint availability

1. Open the login page.
2. Open DevTools → Network.
3. Perform an intentionally invalid login.
4. Find the request sent to `/api/auth/...`.

Expected:

* The request reaches the Better Auth handler.
* The response is an authentication error, not `404` or `500`.
* No database connection error appears.
* No secret, password, token or connection string appears in the response.

# 3. Registration form validation

## Test 3.1 — Empty submission

1. Open `/register`.
2. Leave every field empty.
3. Select Create account.

Expected:

* Submission is blocked.
* Required-field messages appear.
* The first invalid field receives focus or is clearly identified.
* No registration request is sent.
* The role field is not shown.

## Test 3.2 — Invalid email

1. Enter valid values in the other fields.
2. Enter `wrong-email` as the email.
3. Submit.

Expected:

* A valid email error appears.
* No account is created.

## Test 3.3 — Invalid phone

Try values such as:

```text
abc123
123
```

Expected:

* Invalid formats are rejected according to the project’s phone rules.
* A valid international number is accepted.

## Test 3.4 — Weak password

Test:

* Too short
* Missing required character types, if required
* Password equal to easily guessed values

Expected:

* The password policy is clearly displayed or explained through validation.
* Weak passwords are rejected before registration.

## Test 3.5 — Password mismatch

1. Enter different values in Password and Confirm password.
2. Submit.

Expected:

* A password mismatch error appears.
* No API request creates an account.

## Test 3.6 — Consent not accepted

1. Complete the form correctly.
2. Leave consent unchecked.
3. Submit.

Expected:

* Registration is blocked.
* Consent validation appears.
* No account is created.

This must also be protected server-side, but that cannot be proven by normal UI testing alone.

## Test 3.7 — Password visibility

1. Enter a password.
2. Select the eye icon.
3. Select it again.

Expected:

* The password switches between visible and hidden.
* The field value does not change.
* The button has an accessible label.

# 4. Successful email registration

Use an email address that has never been registered.

1. Complete all registration fields.
2. Accept consent.
3. Select Create account.
4. Observe the loading state.
5. Attempt to click the button repeatedly.
6. Check the Network response.
7. Check the resulting page/message.

Expected:

* The button becomes disabled while submitting.
* Only one account is created.
* The user receives the `CUSTOMER` role automatically.
* The browser never submits a role.
* A neutral “check your email” message appears.
* The user is not allowed into protected areas before verification.
* No password appears in logs, responses or URLs.
* The verification email arrives.

Recommended database confirmation:

* One User record exists.
* The user has `CUSTOMER`.
* `emailVerified` is initially false.
* Credential/account records exist correctly.
* The password is stored only as a hash in the appropriate account record.
* Consent timestamp/version is recorded.

# 5. Duplicate registration

1. Return to `/register`.
2. Register using the same email again.
3. Try both uppercase and lowercase variations:

```text
customer@example.com
Customer@Example.com
```

Expected:

* No duplicate account is created.
* The response does not expose sensitive account information.
* The UI displays a safe, understandable message.
* Repeated requests do not produce a `500` error.

# 6. Unverified-email login

Before clicking the verification email:

1. Open `/login`.
2. Enter the newly registered credentials.
3. Select Login.

Expected:

* Login is rejected because the email is unverified.
* The user does not receive an authenticated session.
* The UI explains that verification is required.
* A resend-verification option is available if implemented.
* `/admin` and other protected areas remain inaccessible.

# 7. Email verification

## Test 7.1 — Valid verification link

1. Open the verification email.
2. Confirm the sender, subject and branding.
3. Select the verification link.
4. Observe the destination.
5. Attempt login again.

Expected:

* The link uses the correct application domain.
* It uses HTTPS in production.
* Verification succeeds.
* The user sees a success message.
* Credential login now works.
* The database marks the email as verified.

## Test 7.2 — Reuse the same verification link

1. Open the same link again.

Expected:

* No security error or server crash occurs.
* The UI safely reports that the link is already used or invalid.
* No duplicate record is created.

## Test 7.3 — Invalid verification token

1. Copy the verification URL.
2. Change part of the token.
3. Open the modified URL.

Expected:

* Verification is rejected.
* No session is created.
* No token details or stack trace are exposed.

## Test 7.4 — Resend verification

Using another unverified test account:

1. Request another verification email.
2. Repeat the request quickly several times.
3. Open the newest email.

Expected:

* The UI shows a neutral response.
* Rate limiting or controlled behaviour prevents abuse.
* The latest valid link works.
* Older-link behaviour matches the configured Better Auth policy.

# 8. Credential login

## Test 8.1 — Correct credentials

1. Open `/login`.
2. Enter the verified customer credentials.
3. Leave Remember this device unchecked.
4. Select Login.

Expected:

* Login succeeds.
* The browser redirects to the intended page.
* Navigation changes to the authenticated state.
* A secure session cookie is created.
* The password is not present in the URL, logs or stored browser data.
* Refreshing the page keeps the user logged in.

## Test 8.2 — Wrong password

1. Log out.
2. Enter the correct email with a wrong password.
3. Submit.

Expected:

* Login fails.
* No session is created.
* The message does not reveal excessive account information.
* The password field is handled safely.

## Test 8.3 — Nonexistent email

1. Enter an email that does not exist.
2. Enter any valid-format password.
3. Submit.

Expected:

* The result is similar to the wrong-password result.
* The UI should not make it easy to determine whether the account exists.

## Test 8.4 — Email normalization

Try logging in with:

* Leading or trailing spaces
* Different email capitalization

Expected:

* Behaviour follows the implemented normalization rules.
* It must not create or authenticate an unintended duplicate identity.

## Test 8.5 — Multiple submissions

1. Slow the network using DevTools.
2. Select Login several times.

Expected:

* The button remains disabled during submission.
* Only one effective login request occurs.
* The loading state is visible.

# 9. Remember this device

## Test 9.1 — Remember Me disabled

1. Log in with Remember this device unchecked.
2. Close all application tabs.
3. Close the browser completely.
4. Reopen the browser and application.

Expected:

* Behaviour matches the configured non-persistent session policy.

## Test 9.2 — Remember Me enabled

1. Log out.
2. Log in with Remember this device checked.
3. Close the browser completely.
4. Reopen the application.

Expected:

* The user remains signed in for the configured persistent-session period.
* The session is not permanent.
* Logout can still revoke it.

For stronger confirmation, compare the session-cookie expiry in DevTools for the checked and unchecked cases. Do not copy the cookie value into bug reports.

# 10. Safe return URL

1. While logged out, open `/admin`.
2. Confirm you are redirected to login.
3. Log in with an `ADMIN`.
4. Confirm the application returns to `/admin`.

Then test a malicious callback:

```text
/login?callbackURL=https://malicious-example.com
```

Expected:

* Internal callback URLs work.
* External or malformed callback URLs are rejected or replaced with a safe default.
* The application never redirects to an untrusted domain.

# 11. Logout

1. Log in.
2. Open an authenticated page.
3. Select Logout.
4. Refresh the page.
5. Use the browser Back button.
6. Attempt to reopen a protected URL.

Expected:

* The authenticated session is removed.
* Navigation returns to the logged-out state.
* Refresh does not restore the session.
* Protected content is not accessible from browser history.
* A protected URL redirects to login.

# 12. Forgot-password request

## Test 12.1 — Existing account

1. Open `/login`.
2. Select Forgot password.
3. Enter a registered email.
4. Submit.

Expected:

* A neutral confirmation appears.
* A reset email arrives.
* The message does not display a token.
* The email link uses the correct application domain.

## Test 12.2 — Nonexistent account

1. Repeat with an unregistered email.

Expected:

* The UI shows substantially the same confirmation as for an existing email.
* It does not reveal that the account is missing.
* No server error occurs.

## Test 12.3 — Repeated requests

1. Submit the same email several times quickly.

Expected:

* The application handles requests safely.
* Abuse protection or rate limiting applies.
* The UI does not freeze or expose internal errors.

# 13. Reset password

## Test 13.1 — Valid reset

1. Open the latest reset email.
2. Follow the link.
3. Enter matching valid new passwords.
4. Submit.
5. Attempt login with the old password.
6. Attempt login with the new password.

Expected:

* Reset succeeds.
* The old password no longer works.
* The new password works.
* Existing sessions are revoked if configured.
* The user is redirected to login or a clear success page.

## Test 13.2 — Password mismatch

Expected:

* Client validation blocks submission.
* No password change occurs.

## Test 13.3 — Weak new password

Expected:

* The same password policy as registration applies.

## Test 13.4 — Reused token

1. Open the same reset link after a successful reset.

Expected:

* The token is rejected.
* The password is not changed again.

## Test 13.5 — Modified or expired token

Expected:

* A safe invalid/expired-link message appears.
* No stack trace, token value or account information is exposed.
* The user can request a new reset email.

# 14. Google authentication

## Test 14.1 — New Google customer

Use a Google email not already registered.

1. Select Continue with Google.
2. Select the Google account.
3. Approve the requested permissions.
4. Return to the application.

Expected:

* Only basic identity scopes are requested.
* Authentication succeeds.
* The callback returns to the correct domain.
* A new `CUSTOMER` user is created.
* Google profile name/image are handled correctly.
* Missing phone information does not crash registration.
* The user can be directed to profile completion later.

## Test 14.2 — Cancel Google login

1. Start Google authentication.
2. Cancel it.

Expected:

* The user returns safely to the application.
* No incomplete authenticated session remains.
* A helpful or neutral message appears.

## Test 14.3 — Existing credential email

Use a Google account whose email matches an existing credential account.

Expected:

* Behaviour follows the chosen secure account-linking policy.
* No duplicate user is silently created.
* Accounts are not linked merely through an unverified email.
* The original account’s role is not changed.

## Test 14.4 — Existing Google user

1. Log out.
2. Sign in with the same Google account again.

Expected:

* The existing user is reused.
* No duplicate User or Account record is created.
* The role remains unchanged.

## Test 14.5 — Redirect mismatch check

Expected:

* Local testing returns to:

```text
http://localhost:3000/api/auth/callback/google
```

* Production returns to:

```text
https://kuraishi-car-dealer.vercel.app/api/auth/callback/google
```

* No `redirect_uri_mismatch` error occurs.

# 15. Role and `/admin` authorization

Prepare one account for each role before this segment.

| User state | Open `/admin` | Expected                           |
| ---------- | ------------- | ---------------------------------- |
| Logged out | Direct URL    | Redirect to login                  |
| `CUSTOMER` | Direct URL    | Unauthorized/403; no admin content |
| `STAFF`    | Direct URL    | Unauthorized/403; no admin content |
| `ADMIN`    | Direct URL    | Admin page loads                   |

## Test each role

For each account:

1. Log in.
2. Manually type `/admin` in the address bar.
3. Open known nested admin URLs.
4. Refresh the nested page.
5. Use browser Back and Forward.
6. Try opening the page in a new tab.

Expected:

* Only `ADMIN` gains access.
* Hiding the admin menu is not the only protection.
* `CUSTOMER` and `STAFF` never briefly see protected content.
* Refreshing a protected page does not bypass authorization.
* Direct nested URLs are also protected.
* The user’s role cannot be changed through profile forms or browser requests.

# 16. Session security tests

## Test 16.1 — Multiple browser sessions

1. Log in using Browser A.
2. Log in using Browser B or incognito.
3. Change/reset the password.
4. Refresh both sessions.

Expected:

* Session behaviour matches the configured revocation policy.
* Password reset should revoke existing sessions if that was configured.

## Test 16.2 — Deleted or disabled user

After signing in, disable the test account through a trusted admin/database process.

Expected:

* The disabled user cannot start a new session.
* Existing-session handling follows the configured policy.
* The UI does not crash.

## Test 16.3 — Role change during a session

1. Log in as `CUSTOMER`.
2. Change that account to `ADMIN` through a trusted operation.
3. Refresh or reauthenticate.
4. Reverse the role change.

Expected:

* Authorization uses current trusted server data.
* A stale client-side role does not permanently grant access.
* Removing `ADMIN` removes access.

# 17. UI and accessibility checks

Test every authentication page using:

* Desktop
* Narrow mobile viewport
* Keyboard only
* Light and dark themes, if supported
* Slow network
* Browser refresh during submission

Confirm:

* Labels are connected to fields.
* Tab order is logical.
* Focus indicators are visible.
* Errors are associated with their fields.
* Buttons expose loading and disabled states.
* Password visibility buttons have accessible names.
* Toasts are not the only source of essential information.
* Long email addresses do not break layouts.
* Forms do not submit twice.
* Pages do not horizontally overflow.
* Authentication errors remain understandable without exposing internals.

# 18. Production-only smoke test

After deployment, repeat these tests using real production configuration:

1. Open production login and registration.
2. Register a fresh test user.
3. Receive and open the verification email.
4. Log in.
5. Test logout.
6. Request and complete password reset.
7. Test Google login.
8. Test `/admin` with all three roles.
9. Refresh authenticated and protected pages.
10. Review Vercel logs for errors—without logging secrets.

Confirm:

* Emails contain production HTTPS links.
* Google returns to the production callback.
* Cookies are secure in production.
* Neon connections remain stable.
* No localhost URL appears in emails or redirects.
* No API request returns `500`.
* The production build does not expose server environment variables.

# 19. Final acceptance checklist

The implementation is ready only when all of these pass:

* [ ] Public registration works.
* [ ] New public users always receive `CUSTOMER`.
* [ ] Consent is enforced server-side.
* [ ] Email verification is required for credential login.
* [ ] Verification resend works safely.
* [ ] Credential login works.
* [ ] Remember Me behaves correctly.
* [ ] Logout invalidates the session.
* [ ] Password reset works without account enumeration.
* [ ] Reset tokens cannot be reused.
* [ ] Password reset revokes existing sessions.
* [ ] Google registration and login work.
* [ ] Google does not create duplicate users unexpectedly.
* [ ] Anonymous users cannot access `/admin`.
* [ ] `CUSTOMER` cannot access `/admin`.
* [ ] `STAFF` cannot access `/admin`.
* [ ] `ADMIN` can access `/admin`.
* [ ] Nested admin URLs and server operations are protected.
* [ ] No password, secret or token appears in logs/URLs.
* [ ] Mobile and keyboard interaction work.
* [ ] Production emails and OAuth callbacks use the production domain.
* [ ] Browser console and application logs have no unexpected errors.

The best testing order is: **registration → verification → login/session → logout → password reset → Google → roles/admin → security/session → production smoke test**.
