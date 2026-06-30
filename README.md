# SmartTour

Self-guided apartment tour booking platform. Prospects book a tour slot, a property manager approves it, and an access code is issued for smart-lock entry — no agent coordination required.

Built as a portfolio project targeting a Junior Full-Stack Developer role at a PropTech company.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | Prisma 5 + SQLite (dev) / PostgreSQL (prod) |
| Auth | Clerk v6 |
| Validation | Zod v3 |
| Email | Resend |
| Testing | Playwright e2e |

---

## Workflow

```
Prospect → /tours/book → selects slot → fills details → POST /api/tours
  → atomic transaction: upsert lead + claim slot + create tour
  → redirect to /tours/confirmation/[publicToken]
  → confirmation email sent via Resend

Manager → /admin (Clerk auth + RBAC required)
  → sees pending tours table
  → clicks Approve or Reject
  → PATCH /api/admin/tours/[id]
  → on approve: AccessProvisioningService generates access code
  → tour updated, approval email sent to prospect

Prospect → reloads /tours/confirmation/[publicToken]
  → sees access code
```

---

## Key Architecture Decisions

**Atomic booking transaction**
`POST /api/tours` runs lead upsert + slot claim + tour create inside a single `prisma.$transaction`. The slot is claimed with `updateMany({ where: { id, isAvailable: true } })` — if 0 rows updated, the slot was taken by a concurrent request and a 409 is returned. No double-bookings possible.

**UUID confirmation URLs**
Confirmation page uses `/tours/confirmation/[publicToken]` where `publicToken` is a `@default(uuid())` column on Tour. Sequential integer IDs (`/confirmation/3`) would let anyone enumerate all bookings and read access codes — a direct physical security risk for a PropTech app.

**RBAC via Clerk session claims**
Manager role stored in Clerk `publicMetadata: { "role": "manager" }`. The Clerk JWT template is customized to include `{"metadata": "{{user.public_metadata}}"}` so the role is available in `sessionClaims` without an extra DB lookup on every request. `proxy.ts` enforces this on all `/admin` and `/api/admin` routes.

**TourStatus as const-object, not Prisma enum**
SQLite doesn't support native Prisma enums. Status is stored as `String` with a TypeScript `const` type providing compile-time safety. Switches to a real Postgres enum on production migration.

**MockLockProvider**
`AccessProvisioningService` delegates to `MockLockProvider` which generates a random 6-character alphanumeric code. In production this would be replaced with a real smart-lock API (e.g. Salto, Latch, Brivo). The interface is stable — swap the provider, nothing else changes.

**Non-blocking emails**
Email sends are fire-and-forget (`.catch` logs errors). A Resend failure never blocks a booking or an approval — the core transaction commits first.

---

## Local Setup

### Prerequisites
- Node.js 20+
- A [Clerk](https://clerk.com) account (free)
- A [Resend](https://resend.com) account (free)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env

# 3. Apply migrations and seed demo data
npx prisma migrate reset

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Clerk Configuration

1. Create a Clerk app at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` into `.env`
3. Dashboard → **Sessions** → **Customize session token** → add:
   ```json
   { "metadata": "{{user.public_metadata}}" }
   ```
4. To create a manager account: Dashboard → **Users** → select user → **Public Metadata**:
   ```json
   { "role": "manager" }
   ```

### Testing the full flow

1. Book a tour at `/tours/book` — use your Resend account email to receive real emails
2. Sign in at `/sign-in` with your manager account
3. Go to `/admin` → approve the booking
4. Check your email for the access code, or reload the confirmation page

---

## Running Tests

```bash
# Make sure dev server is running first
npm run dev

# Run Playwright e2e tests
npm test
```

Tests cover:
- Prospect booking happy path
- Double-booking returns 409
- Zod validation returns 400 with field errors
- Manager approval flow (skipped without Clerk session in CI)

---

## Production Deployment (Vercel + Neon)

SQLite doesn't persist on Vercel's serverless filesystem. Use [Neon](https://neon.tech) (free Postgres):

1. Create a Neon project, copy the connection string
2. In `prisma/schema.prisma` change `provider = "sqlite"` → `provider = "postgresql"`
3. Set `DATABASE_URL` in Vercel environment variables to the Neon connection string
4. Run `npx prisma migrate deploy` before first deploy
5. Add all other env vars to Vercel dashboard

---

## Project Structure

```
src/
  app/
    api/
      tours/          # GET slots, POST booking
      admin/tours/    # GET pending list, PATCH approve/reject
    admin/            # Manager dashboard (Clerk-protected)
    tours/
      book/           # Prospect booking form
      confirmation/   # Post-booking status page (UUID token in URL)
  lib/
    db/               # Prisma client singleton
    email/            # Resend mailer (booking + approval emails)
    services/         # AccessProvisioningService + MockLockProvider
    types/            # TourStatus const-object, Result<T,E> type
  proxy.ts            # Clerk auth + RBAC middleware
prisma/
  schema.prisma
  seed.ts             # 3 properties, 8 units, ~280 slots
tests/
  e2e/                # Playwright tests
```
