# Number Results Portal

Informational number-results portal with public results, history, and an admin-managed database. No real-money betting, payments, wallets, or wagering.

Hosted on Netlify:

- `public/` holds the static site that Netlify publishes.
- `netlify/functions/` holds the `/api/*` endpoints.
- `db/schema.ts` and `netlify/database/migrations/` define the Netlify Database (Postgres). Migrations are applied automatically on deploy.
- `/admin/` is protected by Netlify Identity. Only users with the `admin` role can use it.
