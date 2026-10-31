# Atmalis development configuration

## Payments
- NOWPayments is a local mock, not the official provider sandbox. `supabase/functions/atmalis-payment-mock/index.ts` contains an explicitly non-functional mock key.
- Test success, failure, and pending outcomes from `/payments/sandbox`. Guest results are not persisted; authenticated results are stored in `atmalis_sandbox_payments`.
- Mock results never write to `academy_orders`, `academy_enrollments`, or `academy_commissions`. A successful mock test cannot unlock a paid course.
- Payeer is unavailable, as previously agreed.
- Sham Cash is a real manually reviewed workflow, not API verification. An administrator must enter their verified account and transfer/currency instructions in Settings. Students upload private receipts; administrator approval uses the existing enrollment/commission trigger.
- Live NOWPayments integration is deferred until a real merchant API key is securely configured. Do not replace the mock key with a secret in source control. Add live integration through server-side secrets, separate provider verification, and idempotent order fulfillment.

## Password recovery
- Email recovery uses the existing single PKCE Supabase-compatible client and email recovery OTP verification. Passwords are never sent by email.
- Recovery template: `supabase/templates/recovery.html`; subject: `Atmalis | Secure password recovery`.
- Apply this template in OnSpace Cloud → Emails → Password Recovery. Local files alone do not change hosted Auth email templates.
- Add the published site's `/auth/recovery` address to allowed Auth redirects. Open the recovery email in the requesting browser for PKCE; the template also supplies the configured 4-digit recovery code for other-browser verification.
- Test expired links, invalid codes, password mismatch, and successful reset separately after dashboard configuration.

## AI workplace practice
- Uses OnSpace AI, `google/gemini-3-flash-preview`, through injected backend environment variables.
- Programs: 12 or 24 suggested weekly assignments, self-paced. Not employment or independently verified professional experience.
- Tasks, submissions, feedback and scores are private to the signed-in learner. Changes are server-only, with passing-score gates and limited attempts.

## Certificates
- A genuine course enrollment and completion of every lesson is required. No certificate is issued from mock checkout.
- Automatic progress trigger plus an idempotent backfill when the learner visits `/certificates`.
- Unique unguessable Atmalis serial, immutable learner/course snapshots, dynamic QR link to `/verify/:serial`, and browser Print / Save PDF.
- Public verification exposes only certificate details, never emails or account identifiers. Print certificates from the published domain for durable QR links.

## Validation checklist
- Switch Arabic, English and Turkish; check sidebar positioning, labels, mobile controls and course filters.
- Run all three mock outcomes as guest and authenticated learner; verify real enrollment/commission tables are unchanged.
- Configure Sham Cash, upload a receipt, inspect it as administrator, approve it, and confirm exactly one enrollment and commission.
- Complete all lessons in a genuinely enrolled course; verify the certificate serial in a signed-out browser.
- Start a practice program, submit a failed and passing deliverable, then advance. Confirm another account cannot read or modify it.
- Browser/payment/email end-to-end cases require running the preview and the hosted email configuration; source changes are not proof of live provider verification.
