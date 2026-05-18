# Supabase setup

One-time setup for the v0 demo database.

## 1. Create a Supabase project

1. Go to https://supabase.com/dashboard
2. New project → name it `dbt-companion-dev` (or anything you like)
3. Pick a region close to you
4. Wait ~2 minutes for provisioning

## 2. Run the schema

1. Supabase dashboard → SQL Editor → New query
2. Paste the contents of `schema.sql` and Run
3. This creates 4 tables and seeds 2 demo accounts (one clinician, one student)

## 3. Copy credentials into `.env.local`

In the project root (one level up from this folder), create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...  # from Project Settings → API → service_role (secret)
DEMO_COOKIE_SECRET=any-long-random-string-you-pick
```

Get the URL and service role key from: Supabase dashboard → Project Settings → API.

> The service role key bypasses RLS. We use it on the server only — never expose it to the browser. RLS is off in v0 anyway (demo, no real PHI).

## 4. Verify

After `.env.local` is in place, `npm run dev` and visit `http://localhost:3000`. You should be able to sign in as either role.
