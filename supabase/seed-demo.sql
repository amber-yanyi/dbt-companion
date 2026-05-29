-- DBT Companion · demo seed
-- Wipes existing data and reseeds with 4 students under one clinician.
-- Run this in the Supabase SQL editor after schema.sql has been applied.
--
-- All dates are anchored to the current ISO week's Monday, so the demo
-- always lives in "this week" no matter when the seed is run.

set timezone = 'UTC';

truncate skill_entries, assignments, clinician_notes restart identity cascade;

-- Date helpers: offsets from current Monday.
--   _wk(N)         → date         : this Monday + N days
--   _wkts(N, H, M) → timestamptz  : this Monday + N days at H:M UTC
create or replace function _wk(days int) returns date as $$
  select (date_trunc('week', current_date) + (days || ' days')::interval)::date
$$ language sql stable;

create or replace function _wkts(days int, h int, m int) returns timestamptz as $$
  select date_trunc('week', current_date)
       + (days || ' days')::interval
       + (h || ' hours')::interval
       + (m || ' minutes')::interval
$$ language sql stable;

-- Users (idempotent)
insert into users (id, role, name, linked_clinician_id) values
  ('00000000-0000-0000-0000-000000000001', 'clinician', 'Dr. Park', null)
on conflict (id) do update set role = excluded.role, name = excluded.name;

insert into users (id, role, name, linked_clinician_id) values
  ('00000000-0000-0000-0000-000000000002', 'student', 'Maya',   '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000003', 'student', 'Luke',   '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000004', 'student', 'Sarah',  '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000005', 'student', 'Jordan', '00000000-0000-0000-0000-000000000001')
on conflict (id) do update
  set role = excluded.role,
      name = excluded.name,
      linked_clinician_id = excluded.linked_clinician_id;

-- Remove any leftover users from earlier demo iterations
delete from users
where role = 'student'
  and id not in (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
  );

-- ────────────────────────────────────────────────────────────────────────
-- Assignments (this week, Monday-anchored)
-- ────────────────────────────────────────────────────────────────────────
insert into assignments (student_id, clinician_id, week_starting, focus_skill_id, daily_checkins, note) values
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', _wk(0), 'dearman', array['please']::text[],
   'We talked about using DEARMAN with Alex about the kitchen. Take your time — the goal is to feel ready before the actual conversation, not to rush.'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', _wk(0), 'dearman', array['please']::text[],
   'No deadline this week. When you''re ready to tell your dad, the planning is here. Just chip at it.'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', _wk(0), 'please', array['please']::text[],
   'Let''s just observe your sleep and routines this week. Nothing to change yet — just notice.'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', _wk(0), 'dearman', array['please']::text[],
   'If this week feels like a lot, that''s okay. The conversation with your sister can wait. We''ll talk Monday either way.');

-- ────────────────────────────────────────────────────────────────────────
-- Maya — full happy path
-- ────────────────────────────────────────────────────────────────────────

-- DEARMAN reflected (planned Tue, reflected Thu)
insert into skill_entries (user_id, skill_id, status, data, created_at, updated_at) values
('00000000-0000-0000-0000-000000000002', 'dearman', 'reflected',
 '{
   "situation": "My roommate Alex has been leaving dishes in the sink for almost two weeks. Every time I come home and see the pile I get tense.",
   "concrete_goal": "I want us to agree on a baseline — washing our own dishes within a day of using them.",
   "relationship_goal": "I want to still feel like Alex and I are good roommates, not roommates who avoid each other.",
   "describe": "Over the past two weeks I''ve come home most evenings to find dishes piling up in the sink. Sometimes more than a day''s worth.",
   "express": "I feel anxious and a bit resentful when I walk into a kitchen I have to clean before I can use it. It makes me dread coming home.",
   "assert": "Can we agree to wash our own dishes within 24 hours of using them?",
   "reinforce": "It would help both of us — neither of us has to inherit a sink full of someone else''s dishes, and we won''t keep having this low-level friction between us.",
   "mindful": "If she gets defensive or starts bringing up other things, come back to the 24-hour ask. That''s the thing I need to settle.",
   "appear": "Sit down at the kitchen table, even tone, look at her. Don''t apologize for bringing it up.",
   "negotiate": "If 24 hours is too tight, I could live with 36 — but I want a number we both stick to, not ''eventually.''",
   "script": "Hey, I want to talk about something that''s been bothering me. Over the past couple of weeks I''ve come home most evenings to find dishes piling up in the sink. I feel anxious and a bit resentful when I have to clean someone else''s dishes before I can use the kitchen. Can we agree to wash our own dishes within 24 hours of using them? It would help us both come home to a clean space.",
   "flagged": true,
   "reflection": {
     "happened": "yes",
     "overall": 4,
     "got_what_asked": "partially",
     "relationship": "better",
     "notes": "Alex got a little defensive at first — said she''d been busy with midterms and felt like I was attacking her. I stayed calm and came back to the ask. We ended up settling on 36 hours instead of 24. Honestly the bigger thing was just saying it out loud — I''d been avoiding her for two weeks."
   }
 }'::jsonb,
 _wkts(1, 20, 14), _wkts(3, 22, 8));

-- PLEASE entries (skipping Wed and Sun — sparse is normal)
insert into skill_entries (user_id, skill_id, status, data, created_at, updated_at) values
('00000000-0000-0000-0000-000000000002', 'please', 'logged',
 jsonb_build_object(
   'date', _wk(0),
   'sleep_hours', 5.5,
   'exercise_level', 'light',
   'exercise_minutes', 20,
   'meals', jsonb_build_object('breakfast', true, 'lunch', true, 'dinner', false),
   'illness', jsonb_build_object('present', false)
 ),
 _wkts(0, 22, 30), _wkts(0, 22, 30)),
('00000000-0000-0000-0000-000000000002', 'please', 'logged',
 jsonb_build_object(
   'date', _wk(1),
   'sleep_hours', 6,
   'exercise_level', 'none',
   'meals', jsonb_build_object('breakfast', true, 'lunch', true, 'dinner', true),
   'illness', jsonb_build_object('present', false)
 ),
 _wkts(1, 22, 50), _wkts(1, 22, 50)),
('00000000-0000-0000-0000-000000000002', 'please', 'logged',
 jsonb_build_object(
   'date', _wk(3),
   'sleep_hours', 7,
   'exercise_level', 'moderate',
   'exercise_minutes', 30,
   'meals', jsonb_build_object('breakfast', true, 'lunch', true, 'dinner', true),
   'illness', jsonb_build_object('present', false),
   'flagged', true
 ),
 _wkts(3, 22, 18), _wkts(3, 22, 18)),
('00000000-0000-0000-0000-000000000002', 'please', 'logged',
 jsonb_build_object(
   'date', _wk(4),
   'sleep_hours', 6.5,
   'exercise_level', 'none',
   'meals', jsonb_build_object('breakfast', true, 'lunch', true, 'dinner', false),
   'illness', jsonb_build_object('present', false)
 ),
 _wkts(4, 23, 11), _wkts(4, 23, 11)),
('00000000-0000-0000-0000-000000000002', 'please', 'logged',
 jsonb_build_object(
   'date', _wk(5),
   'sleep_hours', 6,
   'exercise_level', 'light',
   'exercise_minutes', 15,
   'meals', jsonb_build_object('breakfast', true, 'lunch', false, 'dinner', false),
   'illness', jsonb_build_object('present', false)
 ),
 _wkts(5, 11, 40), _wkts(5, 11, 40));

-- Opposite Action — self-initiated Saturday
insert into skill_entries (user_id, skill_id, status, data, created_at) values
('00000000-0000-0000-0000-000000000002', 'opposite-action', 'logged',
 '{
   "situation": "Felt anxious about econ midterm. Urge was to isolate in my room and ruminate.",
   "shift": "some",
   "note": "Went to study group at the library. Anxiety didn''t vanish but I stopped spinning."
 }'::jsonb,
 _wkts(5, 14, 22));

-- ────────────────────────────────────────────────────────────────────────
-- Luke — DEARMAN stuck at step 5/10
-- ────────────────────────────────────────────────────────────────────────

insert into skill_entries (user_id, skill_id, status, data, created_at, updated_at) values
('00000000-0000-0000-0000-000000000003', 'dearman', 'in_progress',
 '{
   "situation": "I want to tell my dad I''m switching from pre-med to philosophy. He''s been planning the medical school path with me since I was 14. Every call he asks how MCAT prep is going.",
   "concrete_goal": "Tell him clearly I''m switching majors next semester, and ask him to give me space to figure out what I want with it.",
   "relationship_goal": "I don''t want him to feel like I''ve been lying for years. I want him to know I love him even if I''m choosing differently.",
   "describe": "I haven''t actually been doing MCAT prep for the last six months. I''ve been taking philosophy classes that don''t fit the pre-med track. I want to officially switch my major next semester but I haven''t told him yet.",
   "express": "I feel like I''ve been carrying a secret for months. I''m exhausted from the small lies on every phone call."
 }'::jsonb,
 _wkts(1, 23, 2), _wkts(2, 0, 48));

-- PLEASE — sparse
insert into skill_entries (user_id, skill_id, status, data, created_at, updated_at) values
('00000000-0000-0000-0000-000000000003', 'please', 'logged',
 jsonb_build_object(
   'date', _wk(0),
   'sleep_hours', 4.5,
   'exercise_level', 'none',
   'meals', jsonb_build_object('breakfast', false, 'lunch', true, 'dinner', false),
   'illness', jsonb_build_object('present', false)
 ),
 _wkts(1, 1, 10), _wkts(1, 1, 10)),
('00000000-0000-0000-0000-000000000003', 'please', 'logged',
 jsonb_build_object(
   'date', _wk(2),
   'sleep_hours', 5,
   'exercise_level', 'none',
   'meals', jsonb_build_object('breakfast', true, 'lunch', true, 'dinner', false),
   'illness', jsonb_build_object('present', false)
 ),
 _wkts(2, 22, 40), _wkts(2, 22, 40));

-- ────────────────────────────────────────────────────────────────────────
-- Sarah — PLEASE only, no DEARMAN
-- ────────────────────────────────────────────────────────────────────────

insert into skill_entries (user_id, skill_id, status, data, created_at, updated_at) values
('00000000-0000-0000-0000-000000000004', 'please', 'logged',
 jsonb_build_object(
   'date', _wk(0),
   'sleep_hours', 5.5,
   'exercise_level', 'moderate',
   'exercise_minutes', 45,
   'meals', jsonb_build_object('breakfast', true, 'lunch', true, 'dinner', true),
   'illness', jsonb_build_object('present', false)
 ),
 _wkts(0, 22, 0), _wkts(0, 22, 0)),
('00000000-0000-0000-0000-000000000004', 'please', 'logged',
 jsonb_build_object(
   'date', _wk(1),
   'sleep_hours', 6,
   'exercise_level', 'none',
   'meals', jsonb_build_object('breakfast', true, 'lunch', true, 'dinner', false),
   'illness', jsonb_build_object('present', false)
 ),
 _wkts(1, 22, 10), _wkts(1, 22, 10)),
('00000000-0000-0000-0000-000000000004', 'please', 'logged',
 jsonb_build_object(
   'date', _wk(2),
   'sleep_hours', 6.5,
   'exercise_level', 'light',
   'exercise_minutes', 20,
   'meals', jsonb_build_object('breakfast', true, 'lunch', true, 'dinner', true),
   'illness', jsonb_build_object('present', false)
 ),
 _wkts(2, 22, 30), _wkts(2, 22, 30)),
('00000000-0000-0000-0000-000000000004', 'please', 'logged',
 jsonb_build_object(
   'date', _wk(4),
   'sleep_hours', 6,
   'exercise_level', 'none',
   'meals', jsonb_build_object('breakfast', true, 'lunch', true, 'dinner', true),
   'illness', jsonb_build_object('present', false)
 ),
 _wkts(4, 22, 45), _wkts(4, 22, 45));

-- ────────────────────────────────────────────────────────────────────────
-- Jordan — assigned but no activity
-- (no skill_entries)
-- ────────────────────────────────────────────────────────────────────────

-- ────────────────────────────────────────────────────────────────────────
-- Clinician's private notes — one per student so the demo has texture
-- ────────────────────────────────────────────────────────────────────────
insert into clinician_notes (clinician_id, student_id, content) values
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002',
 'Maya finally had the conversation with Alex — significant. The 36-hour compromise is fine; the bigger win is that she stopped avoiding. Next session: explore the avoidance pattern more broadly. She mentioned a TA she''s been dodging.'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003',
 'Luke''s DEARMAN sitting at step 5 for 3 days is itself the data. Don''t push to finish it. The stuck point is the relationship goal — that''s where his ambivalence lives. Worth sitting with in session.'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004',
 'Sleep average around 6h all week — consistent pattern, not a one-off. Sarah doesn''t see it as a problem yet. Want to gently raise it without making her defensive.'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005',
 'Jordan no-engaged this week. In Monday''s session he was flat. Could be a low patch, could be ambivalence about the work. Check in early in next session before going to content.');

-- Clean up helpers so they don't linger in the schema
drop function _wk(int);
drop function _wkts(int, int, int);
