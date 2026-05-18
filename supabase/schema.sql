-- DBT Companion v0 schema
-- Run this in the Supabase SQL editor on a fresh project.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('student', 'clinician')),
  name text not null,
  linked_clinician_id uuid references users(id),
  created_at timestamptz not null default now()
);

create table if not exists skill_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  skill_id text not null,
  status text not null check (status in ('in_progress', 'planned', 'executed', 'reflected', 'logged')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists skill_entries_user_id_idx on skill_entries(user_id);
create index if not exists skill_entries_user_skill_idx on skill_entries(user_id, skill_id);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references users(id) on delete cascade,
  clinician_id uuid not null references users(id) on delete cascade,
  week_starting date not null,
  focus_skill_id text,
  daily_checkins text[] not null default '{}',
  note text,
  created_at timestamptz not null default now(),
  unique (student_id, week_starting)
);

create index if not exists assignments_student_id_idx on assignments(student_id);

create table if not exists clinician_notes (
  id uuid primary key default gen_random_uuid(),
  clinician_id uuid not null references users(id) on delete cascade,
  student_id uuid not null references users(id) on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now(),
  unique (clinician_id, student_id)
);

-- Seed two demo accounts: one student, one clinician, linked.
insert into users (id, role, name) values
  ('00000000-0000-0000-0000-000000000001', 'clinician', 'Clinician')
on conflict (id) do nothing;

insert into users (id, role, name, linked_clinician_id) values
  ('00000000-0000-0000-0000-000000000002', 'student', 'Student', '00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;
