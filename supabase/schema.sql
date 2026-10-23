-- =====================================================================
--  KORAK PO KORAK – baza podataka (Supabase / PostgreSQL)
--  Platforma za stručnjake (defektologe, logopede, terapeute) i njihove porodice.
--
--  Kako se koristi: Supabase → SQL Editor → New query → nalepite ceo
--  ovaj fajl → Run. Skripta sme da se pokrene više puta (ne briše podatke).
--
--  Bezbednost:
--   • Nijedna tabela nije direktno dostupna spolja (RLS uključen, bez polisa).
--   • Porodica pristupa SAMO svojim podacima preko funkcija family_*,
--     uz svoj tajni kod.
--   • Stručnjak (prijavljen nalog) pristupa SAMO svojim porodicama
--     preko funkcija admin_* i svom profilu preko pro_*.
--   • Vlasnik platforme (tabela platform_admins) vidi stručnjake i
--     produžava članarine preko owner_*.
-- =====================================================================

-- ---------------------------------------------------------------- TABELE

create table if not exists public.families (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null default auth.uid(),
  name          text not null,
  children      text not null default '',
  access_code   text not null unique,
  is_test       boolean not null default false,
  archived      boolean not null default false,
  notes         text not null default '',
  consent_at    timestamptz,
  last_seen_at  timestamptz,
  owner_seen_at timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create table if not exists public.programs (
  id           uuid primary key default gen_random_uuid(),
  family_id    uuid not null references public.families(id) on delete cascade,
  title        text not null default '',
  status       text not null default 'draft' check (status in ('draft','active','archived')),
  start_date   date,
  content      jsonb not null default '{}'::jsonb,
  source_name  text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.images (
  id          uuid primary key default gen_random_uuid(),
  program_id  uuid not null references public.programs(id) on delete cascade,
  mime        text not null default 'image/jpeg',
  data        text not null,
  width       int,
  height      int,
  created_at  timestamptz not null default now()
);

create table if not exists public.observations (
  id             uuid primary key default gen_random_uuid(),
  family_id      uuid not null references public.families(id) on delete cascade,
  program_id     uuid references public.programs(id) on delete set null,
  activity_code  text not null default '',
  activity_title text not null default '',
  obs_date       date not null default current_date,
  obs_time       text not null default '',
  tried          text not null default 'da',
  experience     text not null default '',
  alert_before   text not null default '',
  alert_after    text not null default '',
  details        text not null default '',
  remember       text not null default '',
  created_at     timestamptz not null default now()
);

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references public.families(id) on delete cascade,
  program_id  uuid references public.programs(id) on delete set null,
  week        int not null default 1,
  review_date date not null default current_date,
  good        text not null default '',
  hard        text not null default '',
  next_steps  text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.tried (
  family_id     uuid not null references public.families(id) on delete cascade,
  program_id    uuid not null references public.programs(id) on delete cascade,
  activity_code text not null,
  created_at    timestamptz not null default now(),
  primary key (family_id, program_id, activity_code)
);

create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references public.families(id) on delete cascade,
  sender     text not null check (sender in ('family','owner')),
  body       text not null,
  created_at timestamptz not null default now(),
  read_at    timestamptz
);


-- Stručnjaci (jedan red po nalogu; id = auth.users.id)
create table if not exists public.professionals (
  id             uuid primary key,
  email          text not null default '',
  full_name      text not null default '',
  first_name     text not null default '',
  name_dative    text not null default '',
  name_genitive  text not null default '',
  title          text not null default '',
  role           text not null default '',
  bio            text not null default '',
  motto          text not null default '',
  welcome        text not null default '',
  photo          text not null default '',
  notify_messages boolean not null default true,
  notify_digest  boolean not null default true,
  trial_until    date not null default (current_date + 30),
  paid_until     date,
  paused         boolean not null default false,
  ref_code       text unique,
  owner_note     text not null default '',
  created_at     timestamptz not null default now(),
  last_login_at  timestamptz
);

create table if not exists public.platform_admins (
  user_id uuid primary key
);

create table if not exists public.platform_settings (
  id          int primary key default 1 check (id = 1),
  price_rsd   int not null default 1500,
  recipient   text not null default '',
  account     text not null default '',
  purpose     text not null default 'Članarina – Korak po korak',
  model       text not null default '97',
  pay_note    text not null default 'Posle uplate članarina se produžava u roku od jednog radnog dana.',
  trial_days  int not null default 30,
  grace_days  int not null default 7
);
insert into public.platform_settings (id) values (1) on conflict (id) do nothing;


-- Dosije deteta / učenika (za stručnjake u školi, vrtiću ili kabinetu)
alter table public.families add column if not exists kind       text not null default 'porodica';
alter table public.families add column if not exists class_name text not null default '';
alter table public.families add column if not exists school     text not null default '';
alter table public.families add column if not exists birth_year int;
alter table public.families add column if not exists dossier    jsonb not null default '{}'::jsonb;

create table if not exists public.dossier_notes (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references public.families(id) on delete cascade,
  kind       text not null default 'beleška',
  note_date  date not null default current_date,
  body       text not null,
  created_at timestamptz not null default now()
);

-- Individualni obrazovni planovi (nacrti koje stručnjak priprema za tim)
create table if not exists public.iops (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references public.families(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sopstvene aktivnosti stručnjaka (njegova lična biblioteka)
create table if not exists public.pro_activities (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null,
  data       jsonb not null default '{}'::jsonb,
  photo      text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists dossier_notes_family_idx on public.dossier_notes(family_id, note_date desc);
create index if not exists iops_family_idx on public.iops(family_id);
create index if not exists pro_activities_owner_idx on public.pro_activities(owner_id);
create table if not exists public.visuals (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null,
  family_id  uuid references public.families(id) on delete cascade,
  kind       text not null,
  title      text not null default '',
  data       jsonb not null default '{}'::jsonb,
  shared     boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists visuals_owner_idx on public.visuals(owner_id);
create index if not exists visuals_family_idx on public.visuals(family_id);

create index if not exists programs_family_idx     on public.programs(family_id);
create index if not exists images_program_idx      on public.images(program_id);
create index if not exists observations_family_idx on public.observations(family_id, created_at desc);
create index if not exists reviews_family_idx      on public.reviews(family_id);
create index if not exists messages_family_idx     on public.messages(family_id, created_at);

-- Niko ne pristupa tabelama direktno – samo kroz funkcije ispod.
alter table public.families     enable row level security;
alter table public.programs     enable row level security;
alter table public.images       enable row level security;
alter table public.observations enable row level security;
alter table public.reviews      enable row level security;
alter table public.tried        enable row level security;
alter table public.messages     enable row level security;
alter table public.professionals     enable row level security;
alter table public.dossier_notes     enable row level security;
alter table public.iops              enable row level security;
alter table public.pro_activities    enable row level security;
alter table public.visuals           enable row level security;
alter table public.platform_admins   enable row level security;
alter table public.platform_settings enable row level security;
revoke all on public.families, public.programs, public.images, public.observations,
              public.reviews, public.tried, public.messages, public.professionals,
              public.platform_admins, public.platform_settings, public.dossier_notes, public.iops,
              public.pro_activities, public.visuals from anon, authenticated;

-- ---------------------------------------------------------------- POMOĆNE

-- Kod porodice: 8 znakova bez slova/brojeva koji se mešaju (0/O, 1/I/L).
create or replace function public._new_code() returns text
language plpgsql volatile set search_path = public as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  raw bytea;
  code text;
begin
  loop
    raw := decode(replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''), 'hex');
    code := '';
    for i in 0..7 loop
      code := code || substr(alphabet, (get_byte(raw, i) % length(alphabet)) + 1, 1);
    end loop;
    exit when not exists (select 1 from families where access_code = code);
  end loop;
  return code;
end $$;

create or replace function public._norm_code(c text) returns text
language sql immutable as $$ select upper(regexp_replace(coalesce(c, ''), '[^A-Za-z0-9]', '', 'g')) $$;


-- ---------------------------------------------------------------- ČLANARINA

create or replace function public._is_owner(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from platform_admins where user_id = uid)
$$;

-- do kog datuma stručnjak ima pristup (probni period ili plaćeno)
create or replace function public._access_until(pr professionals) returns date
language sql stable as $$
  select greatest(pr.trial_until, coalesce(pr.paid_until, pr.trial_until))
$$;

create or replace function public._pro_active(pr professionals) returns boolean
language sql stable security definer set search_path = public as $$
  select _is_owner(pr.id) or (not pr.paused and _access_until(pr) >= current_date)
$$;

-- porodice imaju još nekoliko dana pristupa posle isteka članarine
create or replace function public._pro_family_ok(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((
    select _is_owner(pr.id) or (not pr.paused and _access_until(pr) + (select grace_days from platform_settings where id = 1) >= current_date)
    from professionals pr where pr.id = uid
  ), true)
$$;

create or replace function public._new_ref() returns text
language plpgsql volatile set search_path = public as $$
declare r text;
begin
  loop
    r := lpad((floor(random() * 900000) + 100000)::int::text, 6, '0');
    exit when not exists (select 1 from professionals where ref_code = r);
  end loop;
  return r;
end $$;

-- profil prijavljenog stručnjaka (pravi se sam pri prvoj prijavi)
create or replace function public._me() returns public.professionals
language plpgsql volatile security definer set search_path = public as $$
declare pr professionals; uid uuid := auth.uid(); mail text;
begin
  if uid is null then raise exception 'niste_prijavljeni' using errcode = '42501'; end if;
  select * into pr from professionals where id = uid;
  if not found then
    mail := coalesce(auth.jwt() ->> 'email', '');
    insert into professionals (id, email, trial_until, ref_code)
    values (uid, mail, current_date + (select trial_days from platform_settings where id = 1), _new_ref())
    returning * into pr;
  end if;
  return pr;
end $$;

create or replace function public._require_active() returns void
language plpgsql volatile security definer set search_path = public as $$
declare pr professionals;
begin
  pr := _me();
  if not _pro_active(pr) then
    raise exception 'clanarina_istekla' using errcode = '42501';
  end if;
end $$;

create or replace function public._family(p jsonb) returns public.families
language plpgsql stable security definer set search_path = public as $$
declare f families;
begin
  select * into f from families where access_code = _norm_code(p->>'code') and not archived;
  if not found then raise exception 'pogresan_kod' using errcode = 'P0002'; end if;
  if not _pro_family_ok(f.owner_id) then raise exception 'pauzirano' using errcode = 'P0003'; end if;
  return f;
end $$;

create or replace function public._owned(fid uuid) returns public.families
language plpgsql stable security definer set search_path = public as $$
declare f families;
begin
  if auth.uid() is null then raise exception 'niste_prijavljeni' using errcode = '42501'; end if;
  select * into f from families where id = fid and owner_id = auth.uid();
  if not found then raise exception 'nije_dozvoljeno' using errcode = '42501'; end if;
  return f;
end $$;

create or replace function public._active_program(fid uuid) returns public.programs
language sql stable security definer set search_path = public as $$
  select * from programs where family_id = fid and status = 'active'
  order by published_at desc nulls last limit 1
$$;

create or replace function public._family_data(fid uuid, include_all_programs boolean) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  f families;
  prog programs;
  result jsonb;
begin
  select * into f from families where id = fid;
  prog := _active_program(fid);
  result := jsonb_build_object(
    'family', jsonb_build_object(
      'id', f.id, 'name', f.name, 'children', f.children, 'consent_at', f.consent_at,
      'code', f.access_code, 'is_test', f.is_test, 'archived', f.archived,
      'notes', case when include_all_programs then f.notes else null end,
      'kind', f.kind,
      'class_name', case when include_all_programs then f.class_name else null end,
      'school', case when include_all_programs then f.school else null end,
      'birth_year', case when include_all_programs then f.birth_year else null end,
      'dossier', case when include_all_programs then f.dossier else null end,
      'last_seen_at', f.last_seen_at, 'created_at', f.created_at),
    'program', case when prog.id is null then null else jsonb_build_object(
      'id', prog.id, 'title', prog.title, 'start_date', prog.start_date,
      'published_at', prog.published_at, 'content', prog.content) end,
    'history', coalesce((select jsonb_agg(jsonb_build_object(
        'id', id, 'title', title, 'status', status, 'start_date', start_date,
        'published_at', published_at, 'created_at', created_at, 'source_name', source_name,
        'content', case when include_all_programs then content else null end)
        order by created_at desc)
      from programs where family_id = fid and (include_all_programs or status = 'archived')), '[]'::jsonb),
    'tried', coalesce((select jsonb_agg(activity_code) from tried
      where family_id = fid and program_id = prog.id), '[]'::jsonb),
    'observations', coalesce((select jsonb_agg(to_jsonb(o) - 'family_id' order by o.created_at)
      from (select * from observations where family_id = fid order by created_at desc limit 1000) o), '[]'::jsonb),
    'reviews', coalesce((select jsonb_agg(to_jsonb(r) - 'family_id' order by r.created_at)
      from reviews r where family_id = fid), '[]'::jsonb),
    'messages', coalesce((select jsonb_agg(to_jsonb(m) - 'family_id' order by m.created_at)
      from messages m where family_id = fid), '[]'::jsonb),
    'dossier_notes', case when include_all_programs then coalesce((select jsonb_agg(to_jsonb(n) - 'family_id' order by n.note_date desc, n.created_at desc)
      from dossier_notes n where n.family_id = fid), '[]'::jsonb) else null end,
    'visuals', coalesce((select jsonb_agg(jsonb_build_object('id', v.id, 'kind', v.kind, 'title', v.title, 'data', v.data, 'shared', v.shared, 'updated_at', v.updated_at)
      order by v.updated_at desc) from visuals v where v.family_id = fid and (include_all_programs or v.shared)), '[]'::jsonb),
    'iops', case when include_all_programs then coalesce((select jsonb_agg(jsonb_build_object('id', i.id, 'data', i.data, 'created_at', i.created_at, 'updated_at', i.updated_at)
      order by i.created_at desc) from iops i where i.family_id = fid), '[]'::jsonb) else null end,
    'pro', (select jsonb_build_object('full_name', pr.full_name, 'first_name', pr.first_name,
              'name_dative', pr.name_dative, 'name_genitive', pr.name_genitive, 'title', pr.title, 'role', pr.role,
              'bio', pr.bio, 'motto', pr.motto, 'welcome', pr.welcome, 'photo', pr.photo)
            from professionals pr where pr.id = f.owner_id)
  );
  return result;
end $$;

-- ---------------------------------------------------------------- PORODICA (kod)

create or replace function public.family_get(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families;
begin
  f := _family(p);
  update families set last_seen_at = now() where id = f.id;
  return _family_data(f.id, false);
end $$;

create or replace function public.family_consent(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families;
begin
  f := _family(p);
  update families set consent_at = coalesce(consent_at, now()) where id = f.id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.family_add_observation(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  f families;
  prog programs;
  o jsonb := coalesce(p->'observation', '{}'::jsonb);
  rec observations;
begin
  f := _family(p);
  prog := _active_program(f.id);
  insert into observations (family_id, program_id, activity_code, activity_title, obs_date, obs_time,
                            tried, experience, alert_before, alert_after, details, remember)
  values (f.id, prog.id,
          left(coalesce(o->>'activity_code', ''), 40), left(coalesce(o->>'activity_title', ''), 300),
          coalesce(nullif(o->>'obs_date', '')::date, current_date), left(coalesce(o->>'obs_time', ''), 10),
          left(coalesce(nullif(o->>'tried', ''), 'da'), 20), left(coalesce(o->>'experience', ''), 40),
          left(coalesce(o->>'alert_before', ''), 80), left(coalesce(o->>'alert_after', ''), 80),
          left(coalesce(o->>'details', ''), 4000), left(coalesce(o->>'remember', ''), 4000))
  returning * into rec;
  if prog.id is not null and rec.activity_code <> '' and rec.tried <> 'ne' then
    insert into tried (family_id, program_id, activity_code) values (f.id, prog.id, rec.activity_code)
    on conflict do nothing;
  end if;
  return to_jsonb(rec) - 'family_id';
end $$;

create or replace function public.family_delete_observation(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families;
begin
  f := _family(p);
  delete from observations where id = (p->>'id')::uuid and family_id = f.id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.family_set_tried(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  f families;
  prog programs;
begin
  f := _family(p);
  prog := _active_program(f.id);
  if prog.id is null then return jsonb_build_object('ok', false); end if;
  if coalesce((p->>'value')::boolean, true) then
    insert into tried (family_id, program_id, activity_code)
    values (f.id, prog.id, left(p->>'activity_code', 40)) on conflict do nothing;
  else
    delete from tried where family_id = f.id and program_id = prog.id and activity_code = p->>'activity_code';
  end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.family_add_review(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  f families;
  r jsonb := coalesce(p->'review', '{}'::jsonb);
  rec reviews;
begin
  f := _family(p);
  insert into reviews (family_id, program_id, week, review_date, good, hard, next_steps)
  values (f.id, (_active_program(f.id)).id, coalesce(nullif(r->>'week', '')::int, 1),
          coalesce(nullif(r->>'review_date', '')::date, current_date),
          left(coalesce(r->>'good', ''), 4000), left(coalesce(r->>'hard', ''), 4000),
          left(coalesce(r->>'next_steps', ''), 4000))
  returning * into rec;
  return to_jsonb(rec) - 'family_id';
end $$;

create or replace function public.family_delete_review(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families;
begin
  f := _family(p);
  delete from reviews where id = (p->>'id')::uuid and family_id = f.id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.family_send_message(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  f families;
  rec messages;
begin
  f := _family(p);
  if coalesce(trim(p->>'body'), '') = '' then raise exception 'prazna_poruka'; end if;
  insert into messages (family_id, sender, body) values (f.id, 'family', left(p->>'body', 5000))
  returning * into rec;
  update messages set read_at = now() where family_id = f.id and sender = 'owner' and read_at is null;
  return to_jsonb(rec) - 'family_id';
end $$;

create or replace function public.family_read_messages(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families;
begin
  f := _family(p);
  update messages set read_at = now() where family_id = f.id and sender = 'owner' and read_at is null;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.family_get_images(p jsonb) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare f families;
begin
  f := _family(p);
  return coalesce((
    select jsonb_object_agg(i.id, i.data)
    from images i join programs pr on pr.id = i.program_id
    where pr.family_id = f.id and pr.status in ('active', 'archived')
      and i.id::text in (select jsonb_array_elements_text(coalesce(p->'ids', '[]'::jsonb)))
  ), '{}'::jsonb);
end $$;

-- ---------------------------------------------------------------- DEFEKTOLOG (prijava)

create or replace function public.admin_overview(p jsonb) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'niste_prijavljeni' using errcode = '42501'; end if;
  return coalesce((
    select jsonb_agg(row_data order by (row_data->>'archived')::boolean, row_data->>'name')
    from (
      select jsonb_build_object(
        'id', f.id, 'name', f.name, 'children', f.children, 'code', f.access_code,
        'is_test', f.is_test, 'archived', f.archived, 'created_at', f.created_at,
        'last_seen_at', f.last_seen_at, 'consent_at', f.consent_at,
        'kind', f.kind, 'class_name', f.class_name, 'school', f.school,
        'iops', (select count(*) from iops i where i.family_id = f.id),
        'program', (select jsonb_build_object('id', pr.id, 'title', pr.title, 'start_date', pr.start_date,
                      'weeks', coalesce(nullif(pr.content->>'durationWeeks', '')::int, 4),
                      'activities', jsonb_array_length(coalesce(pr.content->'activities', '[]'::jsonb)))
                    from programs pr where pr.family_id = f.id and pr.status = 'active'
                    order by pr.published_at desc nulls last limit 1),
        'drafts', (select count(*) from programs pr where pr.family_id = f.id and pr.status = 'draft'),
        'obs_total', (select count(*) from observations o where o.family_id = f.id),
        'obs_7d', (select count(*) from observations o where o.family_id = f.id and o.created_at > now() - interval '7 days'),
        'last_obs_at', (select max(created_at) from observations o where o.family_id = f.id),
        'new_obs', (select count(*) from observations o where o.family_id = f.id and o.created_at > f.owner_seen_at),
        'unread', (select count(*) from messages m where m.family_id = f.id and m.sender = 'family' and m.read_at is null),
        'tried', (select count(*) from tried t join programs pr on pr.id = t.program_id
                  where t.family_id = f.id and pr.status = 'active')
      ) as row_data
      from families f where f.owner_id = auth.uid()
    ) s
  ), '[]'::jsonb);
end $$;

create or replace function public.admin_family(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families;
begin
  f := _owned((p->>'id')::uuid);
  if coalesce((p->>'mark_seen')::boolean, true) then
    update families set owner_seen_at = now() where id = f.id;
    update messages set read_at = now() where family_id = f.id and sender = 'family' and read_at is null;
  end if;
  return _family_data(f.id, true) || jsonb_build_object('owner_seen_at', f.owner_seen_at);
end $$;

create or replace function public.admin_save_family(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families;
begin
  perform _require_active();
  if auth.uid() is null then raise exception 'niste_prijavljeni' using errcode = '42501'; end if;
  if nullif(p->>'id', '') is null then
    insert into families (owner_id, name, children, is_test, notes, access_code, kind, class_name, school, birth_year)
    values (auth.uid(), coalesce(nullif(trim(p->>'name'), ''), 'Nova porodica'), coalesce(p->>'children', ''),
            coalesce((p->>'is_test')::boolean, false), coalesce(p->>'notes', ''), _new_code(),
            case when p->>'kind' = 'ucenik' then 'ucenik' else 'porodica' end,
            left(coalesce(p->>'class_name', ''), 80), left(coalesce(p->>'school', ''), 160), nullif(p->>'birth_year', '')::int)
    returning * into f;
  else
    f := _owned((p->>'id')::uuid);
    update families set
      name     = coalesce(nullif(trim(p->>'name'), ''), name),
      children = coalesce(p->>'children', children),
      is_test  = coalesce((p->>'is_test')::boolean, is_test),
      archived = coalesce((p->>'archived')::boolean, archived),
      notes    = coalesce(p->>'notes', notes)
    where id = f.id returning * into f;
  end if;
  return to_jsonb(f) - 'owner_id';
end $$;

create or replace function public.admin_regenerate_code(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families;
begin
  perform _require_active();
  f := _owned((p->>'id')::uuid);
  update families set access_code = _new_code() where id = f.id returning * into f;
  return jsonb_build_object('code', f.access_code);
end $$;

create or replace function public.admin_delete_family(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families;
begin
  f := _owned((p->>'id')::uuid);
  delete from families where id = f.id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.admin_delete_test_families(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare n int;
begin
  if auth.uid() is null then raise exception 'niste_prijavljeni' using errcode = '42501'; end if;
  with d as (delete from families where owner_id = auth.uid() and is_test returning 1)
  select count(*) into n from d;
  return jsonb_build_object('deleted', n);
end $$;

create or replace function public.admin_save_program(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  f families;
  prog programs;
begin
  perform _require_active();
  if nullif(p->>'id', '') is null then
    f := _owned((p->>'family_id')::uuid);
    insert into programs (family_id, title, content, source_name, start_date)
    values (f.id, coalesce(p->>'title', ''), coalesce(p->'content', '{}'::jsonb),
            coalesce(p->>'source_name', ''), nullif(p->>'start_date', '')::date)
    returning * into prog;
  else
    select * into prog from programs where id = (p->>'id')::uuid;
    if not found then raise exception 'nema_programa'; end if;
    f := _owned(prog.family_id);
    update programs set
      title      = coalesce(p->>'title', title),
      content    = coalesce(p->'content', content),
      start_date = case when p ? 'start_date' then nullif(p->>'start_date', '')::date else start_date end,
      updated_at = now()
    where id = prog.id returning * into prog;
  end if;
  return jsonb_build_object('id', prog.id, 'status', prog.status);
end $$;

create or replace function public.admin_publish_program(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare prog programs;
begin
  perform _require_active();
  select * into prog from programs where id = (p->>'id')::uuid;
  if not found then raise exception 'nema_programa'; end if;
  perform _owned(prog.family_id);
  update programs set status = 'archived' where family_id = prog.family_id and status = 'active' and id <> prog.id;
  update programs set status = 'active', published_at = now(),
         start_date = coalesce(nullif(p->>'start_date', '')::date, start_date, current_date)
  where id = prog.id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.admin_set_program_status(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare prog programs;
begin
  perform _require_active();
  select * into prog from programs where id = (p->>'id')::uuid;
  if not found then raise exception 'nema_programa'; end if;
  perform _owned(prog.family_id);
  if p->>'status' not in ('draft', 'archived') then raise exception 'los_status'; end if;
  update programs set status = p->>'status' where id = prog.id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.admin_delete_program(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare prog programs;
begin
  select * into prog from programs where id = (p->>'id')::uuid;
  if not found then return jsonb_build_object('ok', true); end if;
  perform _owned(prog.family_id);
  delete from programs where id = prog.id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.admin_add_image(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  prog programs;
  new_id uuid;
begin
  perform _require_active();
  select * into prog from programs where id = (p->>'program_id')::uuid;
  if not found then raise exception 'nema_programa'; end if;
  perform _owned(prog.family_id);
  if length(p->>'data') > 3000000 then raise exception 'slika_prevelika'; end if;
  insert into images (program_id, mime, data, width, height)
  values (prog.id, coalesce(p->>'mime', 'image/jpeg'), p->>'data',
          nullif(p->>'width', '')::int, nullif(p->>'height', '')::int)
  returning id into new_id;
  return jsonb_build_object('id', new_id);
end $$;

create or replace function public.admin_get_images(p jsonb) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'niste_prijavljeni' using errcode = '42501'; end if;
  return coalesce((
    select jsonb_object_agg(i.id, i.data)
    from images i join programs pr on pr.id = i.program_id join families f on f.id = pr.family_id
    where f.owner_id = auth.uid()
      and i.id::text in (select jsonb_array_elements_text(coalesce(p->'ids', '[]'::jsonb)))
  ), '{}'::jsonb);
end $$;

create or replace function public.admin_reply(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  f families;
  rec messages;
begin
  perform _require_active();
  f := _owned((p->>'family_id')::uuid);
  if coalesce(trim(p->>'body'), '') = '' then raise exception 'prazna_poruka'; end if;
  insert into messages (family_id, sender, body) values (f.id, 'owner', left(p->>'body', 5000))
  returning * into rec;
  update messages set read_at = now() where family_id = f.id and sender = 'family' and read_at is null;
  return to_jsonb(rec) - 'family_id';
end $$;

-- ---------------------------------------------------------------- STRUČNJAK: PROFIL I ČLANARINA

create or replace function public._pro_status(pr professionals) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'active', _pro_active(pr),
    'owner', _is_owner(pr.id),
    'paused', pr.paused,
    'trial', pr.paid_until is null or pr.paid_until < pr.trial_until,
    'trial_until', pr.trial_until,
    'paid_until', pr.paid_until,
    'access_until', _access_until(pr),
    'days_left', _access_until(pr) - current_date,
    'grace_days', (select grace_days from platform_settings where id = 1),
    'family_until', _access_until(pr) + (select grace_days from platform_settings where id = 1))
$$;

create or replace function public._payment() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('price_rsd', price_rsd, 'recipient', recipient, 'account', account, 'purpose', purpose,
                            'model', model, 'pay_note', pay_note, 'trial_days', trial_days, 'grace_days', grace_days)
  from platform_settings where id = 1
$$;

-- p: {}  ->  { profile, status, payment }
create or replace function public.pro_me(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare pr professionals;
begin
  pr := _me();
  update professionals set last_login_at = now(),
    email = coalesce(nullif(auth.jwt() ->> 'email', ''), email)
  where id = pr.id returning * into pr;
  return jsonb_build_object('profile', to_jsonb(pr) - 'owner_note' - 'paused' - 'trial_until' - 'paid_until',
                            'status', _pro_status(pr), 'payment', _payment());
end $$;

create or replace function public.pro_save_profile(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare pr professionals;
begin
  pr := _me();
  if length(coalesce(p->>'photo', '')) > 600000 then raise exception 'slika_prevelika'; end if;
  update professionals set
    full_name     = left(coalesce(p->>'full_name', full_name), 120),
    first_name    = left(coalesce(p->>'first_name', first_name), 60),
    name_dative   = left(coalesce(p->>'name_dative', name_dative), 60),
    name_genitive = left(coalesce(p->>'name_genitive', name_genitive), 60),
    title         = left(coalesce(p->>'title', title), 160),
    role          = left(coalesce(p->>'role', role), 160),
    bio           = left(coalesce(p->>'bio', bio), 1500),
    motto         = left(coalesce(p->>'motto', motto), 300),
    welcome       = left(coalesce(p->>'welcome', welcome), 1500),
    photo         = coalesce(p->>'photo', photo),
    notify_messages = coalesce((p->>'notify_messages')::boolean, notify_messages),
    notify_digest   = coalesce((p->>'notify_digest')::boolean, notify_digest)
  where id = pr.id returning * into pr;
  return jsonb_build_object('profile', to_jsonb(pr) - 'owner_note' - 'paused' - 'trial_until' - 'paid_until',
                            'status', _pro_status(pr), 'payment', _payment());
end $$;

-- javno (bez prijave): cena i probni period za stranicu „Za stručnjake“
create or replace function public.platform_public(p jsonb) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('price_rsd', price_rsd, 'trial_days', trial_days) from platform_settings where id = 1
$$;

-- ---------------------------------------------------------------- VLASNIK PLATFORME

create or replace function public._require_owner() returns void
language plpgsql stable security definer set search_path = public as $$
begin
  if auth.uid() is null or not _is_owner(auth.uid()) then raise exception 'nije_dozvoljeno' using errcode = '42501'; end if;
end $$;

create or replace function public.owner_overview(p jsonb) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform _require_owner();
  return jsonb_build_object(
    'settings', (select to_jsonb(ps) - 'id' from platform_settings ps where id = 1),
    'pros', coalesce((select jsonb_agg(x order by (x->>'created_at') desc) from (
      select jsonb_build_object(
        'id', pr.id, 'email', pr.email, 'full_name', pr.full_name, 'title', pr.title, 'ref_code', pr.ref_code,
        'owner_note', pr.owner_note, 'created_at', pr.created_at, 'last_login_at', pr.last_login_at,
        'status', _pro_status(pr),
        'families', (select count(*) from families f where f.owner_id = pr.id and not f.archived and not f.is_test),
        'test_families', (select count(*) from families f where f.owner_id = pr.id and f.is_test),
        'obs_30d', (select count(*) from observations o join families f on f.id = o.family_id
                    where f.owner_id = pr.id and o.created_at > now() - interval '30 days')
      ) as x from professionals pr) s), '[]'::jsonb));
end $$;

-- p: { id, days }  ->  produžava od isteka (ili od danas, ako je već isteklo)
create or replace function public.owner_extend(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare pr professionals; d int := coalesce((p->>'days')::int, 30);
begin
  perform _require_owner();
  select * into pr from professionals where id = (p->>'id')::uuid;
  if not found then raise exception 'nije_pronadjeno'; end if;
  update professionals set
    paid_until = greatest(current_date - 1, _access_until(pr)) + d,
    paused = false
  where id = pr.id returning * into pr;
  return _pro_status(pr);
end $$;

-- p: { id, paused?, paid_until?, owner_note? }
create or replace function public.owner_update_pro(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare pr professionals;
begin
  perform _require_owner();
  update professionals set
    paused     = coalesce((p->>'paused')::boolean, paused),
    paid_until = case when p ? 'paid_until' then nullif(p->>'paid_until', '')::date else paid_until end,
    owner_note = coalesce(p->>'owner_note', owner_note)
  where id = (p->>'id')::uuid returning * into pr;
  if not found then raise exception 'nije_pronadjeno'; end if;
  return _pro_status(pr);
end $$;

create or replace function public.owner_save_settings(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
begin
  perform _require_owner();
  update platform_settings set
    price_rsd  = coalesce((p->>'price_rsd')::int, price_rsd),
    recipient  = coalesce(p->>'recipient', recipient),
    account    = coalesce(p->>'account', account),
    purpose    = coalesce(p->>'purpose', purpose),
    model      = coalesce(p->>'model', model),
    pay_note   = coalesce(p->>'pay_note', pay_note),
    trial_days = coalesce((p->>'trial_days')::int, trial_days),
    grace_days = coalesce((p->>'grace_days')::int, grace_days)
  where id = 1;
  return (select to_jsonb(ps) - 'id' from platform_settings ps where id = 1);
end $$;

-- ---------------------------------------------------------------- DOSIJE, IOP, MOJE AKTIVNOSTI

-- p: { id, kind?, children?, class_name?, school?, birth_year?, dossier? }
create or replace function public.admin_save_dossier(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families;
begin
  perform _require_active();
  f := _owned((p->>'id')::uuid);
  if length(coalesce(p->>'dossier', '')) > 200000 then raise exception 'previse_teksta'; end if;
  update families set
    kind       = case when p ? 'kind' then (case when p->>'kind' = 'ucenik' then 'ucenik' else 'porodica' end) else kind end,
    children   = left(coalesce(p->>'children', children), 120),
    class_name = left(coalesce(p->>'class_name', class_name), 80),
    school     = left(coalesce(p->>'school', school), 160),
    birth_year = case when p ? 'birth_year' then nullif(p->>'birth_year', '')::int else birth_year end,
    dossier    = coalesce(p->'dossier', dossier)
  where id = f.id returning * into f;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.admin_add_note(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families; rec dossier_notes;
begin
  perform _require_active();
  f := _owned((p->>'family_id')::uuid);
  if length(trim(coalesce(p->>'body', ''))) = 0 then raise exception 'prazna_poruka'; end if;
  insert into dossier_notes (family_id, kind, note_date, body)
  values (f.id, left(coalesce(nullif(p->>'kind', ''), 'beleška'), 40), coalesce(nullif(p->>'note_date', '')::date, current_date), left(p->>'body', 8000))
  returning * into rec;
  return to_jsonb(rec) - 'family_id';
end $$;

create or replace function public.admin_delete_note(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare rec dossier_notes;
begin
  select * into rec from dossier_notes where id = (p->>'id')::uuid;
  if not found then return jsonb_build_object('ok', true); end if;
  perform _owned(rec.family_id);
  delete from dossier_notes where id = rec.id;
  return jsonb_build_object('ok', true);
end $$;

-- p: { family_id, id?, data }
create or replace function public.admin_save_iop(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare f families; rec iops;
begin
  perform _require_active();
  f := _owned((p->>'family_id')::uuid);
  if length(coalesce(p->>'data', '')) > 300000 then raise exception 'previse_teksta'; end if;
  if nullif(p->>'id', '') is null then
    insert into iops (family_id, data) values (f.id, coalesce(p->'data', '{}'::jsonb)) returning * into rec;
  else
    update iops set data = coalesce(p->'data', data), updated_at = now()
    where id = (p->>'id')::uuid and family_id = f.id returning * into rec;
    if not found then raise exception 'nije_pronadjeno'; end if;
  end if;
  return jsonb_build_object('id', rec.id, 'data', rec.data, 'created_at', rec.created_at, 'updated_at', rec.updated_at);
end $$;

create or replace function public.admin_delete_iop(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare rec iops;
begin
  select * into rec from iops where id = (p->>'id')::uuid;
  if not found then return jsonb_build_object('ok', true); end if;
  perform _owned(rec.family_id);
  delete from iops where id = rec.id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.pro_activities_list(p jsonb) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'niste_prijavljeni' using errcode = '42501'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id', a.id, 'data', a.data, 'photo', a.photo, 'updated_at', a.updated_at)
                   order by a.created_at) from pro_activities a where a.owner_id = auth.uid()), '[]'::jsonb);
end $$;

-- p: { id?, data, photo? }
create or replace function public.pro_activity_save(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare rec pro_activities;
begin
  perform _require_active();
  if length(coalesce(p->>'photo', '')) > 1500000 then raise exception 'slika_prevelika'; end if;
  if length(coalesce(p->>'data', '')) > 60000 then raise exception 'previse_teksta'; end if;
  if nullif(p->>'id', '') is null then
    insert into pro_activities (owner_id, data, photo) values (auth.uid(), coalesce(p->'data', '{}'::jsonb), coalesce(p->>'photo', ''))
    returning * into rec;
  else
    update pro_activities set data = coalesce(p->'data', data), photo = coalesce(p->>'photo', photo), updated_at = now()
    where id = (p->>'id')::uuid and owner_id = auth.uid() returning * into rec;
    if not found then raise exception 'nije_pronadjeno'; end if;
  end if;
  return jsonb_build_object('id', rec.id, 'data', rec.data, 'photo', rec.photo, 'updated_at', rec.updated_at);
end $$;

create or replace function public.pro_activity_delete(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'niste_prijavljeni' using errcode = '42501'; end if;
  delete from pro_activities where id = (p->>'id')::uuid and owner_id = auth.uid();
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------- VIZUELNA PODRŠKA

create or replace function public.pro_visuals_list(p jsonb) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'niste_prijavljeni' using errcode = '42501'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id', v.id, 'kind', v.kind, 'title', v.title, 'data', v.data, 'shared', v.shared,
                     'family_id', v.family_id, 'family_name', f.name, 'updated_at', v.updated_at) order by v.updated_at desc)
                   from visuals v left join families f on f.id = v.family_id
                   where v.owner_id = auth.uid() and (nullif(p->>'family_id', '') is null or v.family_id = (p->>'family_id')::uuid)), '[]'::jsonb);
end $$;

create or replace function public.pro_visual_get(p jsonb) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare r jsonb;
begin
  if auth.uid() is null then raise exception 'niste_prijavljeni' using errcode = '42501'; end if;
  select jsonb_build_object('id', v.id, 'kind', v.kind, 'title', v.title, 'data', v.data, 'shared', v.shared,
           'family_id', v.family_id, 'family_name', f.name, 'updated_at', v.updated_at) into r
  from visuals v left join families f on f.id = v.family_id
  where v.id = (p->>'id')::uuid and v.owner_id = auth.uid();
  if r is null then raise exception 'nije_pronadjeno'; end if;
  return r;
end $$;

-- p: { id?, family_id?, kind, title, data, shared }
create or replace function public.pro_visual_save(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare rec visuals; fid uuid := nullif(p->>'family_id', '')::uuid;
begin
  perform _require_active();
  if length(coalesce(p->>'data', '')) > 3000000 then raise exception 'previse_teksta'; end if;
  if fid is not null then perform _owned(fid); end if;
  if nullif(p->>'id', '') is null then
    insert into visuals (owner_id, family_id, kind, title, data, shared)
    values (auth.uid(), fid, left(coalesce(p->>'kind', 'raspored'), 30), left(coalesce(p->>'title', ''), 160),
            coalesce(p->'data', '{}'::jsonb), coalesce((p->>'shared')::boolean, false) and fid is not null)
    returning * into rec;
  else
    update visuals set title = left(coalesce(p->>'title', title), 160), data = coalesce(p->'data', data),
      shared = coalesce((p->>'shared')::boolean, shared) and family_id is not null, updated_at = now()
    where id = (p->>'id')::uuid and owner_id = auth.uid() returning * into rec;
    if not found then raise exception 'nije_pronadjeno'; end if;
  end if;
  return jsonb_build_object('id', rec.id, 'updated_at', rec.updated_at);
end $$;

create or replace function public.pro_visual_delete(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'niste_prijavljeni' using errcode = '42501'; end if;
  delete from visuals where id = (p->>'id')::uuid and owner_id = auth.uid();
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------- OBAVEŠTENJA MEJLOM
-- Vercel funkcija api/notify.js poziva notify_collect sa tajnom (NOTIFY_SECRET)
-- i šalje Dragani mejl. Tajna se upisuje jednom: insert into app_settings ...

create table if not exists public.app_settings (
  key   text primary key,
  value text not null
);
alter table public.app_settings enable row level security;
revoke all on public.app_settings from anon, authenticated;

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'messages' and column_name = 'notified_at') then
    alter table public.messages add column notified_at timestamptz;
    update public.messages set notified_at = now();
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'observations' and column_name = 'notified_at') then
    alter table public.observations add column notified_at timestamptz;
    update public.observations set notified_at = now();
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'reviews' and column_name = 'notified_at') then
    alter table public.reviews add column notified_at timestamptz;
    update public.reviews set notified_at = now();
  end if;
end $$;

-- p: { secret, kind: 'message' | 'all' }  ->  nova (još neprijavljena) dešavanja
create or replace function public.notify_collect(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  s text;
  kind text := coalesce(p->>'kind', 'all');
  msgs jsonb := '[]'::jsonb;
  obs jsonb := '[]'::jsonb;
  revs jsonb := '[]'::jsonb;
begin
  select value into s from app_settings where key = 'notify_secret';
  if s is null or length(s) < 16 or (p->>'secret') is distinct from s then
    raise exception 'Nije dozvoljeno.' using errcode = '42501';
  end if;

  with u as (
    update messages m set notified_at = now()
    where m.sender = 'family' and m.notified_at is null
    returning m.family_id, m.body, m.created_at
  )
  select coalesce(jsonb_agg(jsonb_build_object('family_id', f.id, 'family', f.name, 'is_test', f.is_test,
           'body', u.body, 'created_at', u.created_at, 'pro_id', pr.id, 'pro_email', pr.email, 'pro_name', pr.first_name,
           'pro_notify', pr.notify_messages) order by u.created_at), '[]'::jsonb)
    into msgs from u join families f on f.id = u.family_id left join professionals pr on pr.id = f.owner_id;

  if kind = 'all' then
    with u as (
      update observations o set notified_at = now()
      where o.notified_at is null
      returning o.family_id, o.activity_title, o.experience, o.obs_date, o.details, o.remember, o.created_at
    )
    select coalesce(jsonb_agg(jsonb_build_object('family_id', f.id, 'family', f.name, 'is_test', f.is_test,
             'activity', u.activity_title, 'experience', u.experience, 'date', u.obs_date,
             'details', u.details, 'remember', u.remember, 'pro_id', pr.id, 'pro_email', pr.email, 'pro_name', pr.first_name,
             'pro_notify', pr.notify_digest) order by u.created_at), '[]'::jsonb)
      into obs from u join families f on f.id = u.family_id left join professionals pr on pr.id = f.owner_id;

    with u as (
      update reviews r set notified_at = now()
      where r.notified_at is null
      returning r.family_id, r.week, r.good, r.hard, r.next_steps, r.created_at
    )
    select coalesce(jsonb_agg(jsonb_build_object('family_id', f.id, 'family', f.name, 'is_test', f.is_test,
             'week', u.week, 'good', u.good, 'hard', u.hard, 'next', u.next_steps, 'pro_id', pr.id, 'pro_email', pr.email,
             'pro_name', pr.first_name, 'pro_notify', pr.notify_digest) order by u.created_at), '[]'::jsonb)
      into revs from u join families f on f.id = u.family_id left join professionals pr on pr.id = f.owner_id;
  end if;

  return jsonb_build_object('messages', msgs, 'observations', obs, 'reviews', revs);
end $$;

-- Ako slanje mejla ne uspe, Vercel funkcija vraća dešavanja kao neprijavljena.
create or replace function public.notify_undo(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare s text; since timestamptz := (p->>'since')::timestamptz;
begin
  select value into s from app_settings where key = 'notify_secret';
  if s is null or length(s) < 16 or (p->>'secret') is distinct from s then
    raise exception 'Nije dozvoljeno.' using errcode = '42501';
  end if;
  update messages set notified_at = null where notified_at >= since;
  update observations set notified_at = null where notified_at >= since;
  update reviews set notified_at = null where notified_at >= since;
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------- PRAVA

revoke execute on all functions in schema public from public, anon, authenticated;

grant execute on function
  public.family_get(jsonb), public.family_consent(jsonb), public.family_add_observation(jsonb),
  public.family_delete_observation(jsonb), public.family_set_tried(jsonb), public.family_add_review(jsonb),
  public.family_delete_review(jsonb), public.family_send_message(jsonb), public.family_read_messages(jsonb),
  public.family_get_images(jsonb)
to anon, authenticated;

grant execute on function public.notify_collect(jsonb), public.notify_undo(jsonb) to anon, authenticated;

grant execute on function public.platform_public(jsonb) to anon, authenticated;

grant execute on function
  public.admin_save_dossier(jsonb), public.admin_add_note(jsonb), public.admin_delete_note(jsonb),
  public.admin_save_iop(jsonb), public.admin_delete_iop(jsonb),
  public.pro_activities_list(jsonb), public.pro_activity_save(jsonb), public.pro_activity_delete(jsonb),
  public.pro_visuals_list(jsonb), public.pro_visual_get(jsonb), public.pro_visual_save(jsonb), public.pro_visual_delete(jsonb),
  public.pro_me(jsonb), public.pro_save_profile(jsonb),
  public.owner_overview(jsonb), public.owner_extend(jsonb), public.owner_update_pro(jsonb), public.owner_save_settings(jsonb)
to authenticated;

grant execute on function
  public.admin_overview(jsonb), public.admin_family(jsonb), public.admin_save_family(jsonb),
  public.admin_regenerate_code(jsonb), public.admin_delete_family(jsonb), public.admin_delete_test_families(jsonb),
  public.admin_save_program(jsonb), public.admin_publish_program(jsonb), public.admin_set_program_status(jsonb),
  public.admin_delete_program(jsonb), public.admin_add_image(jsonb), public.admin_get_images(jsonb),
  public.admin_reply(jsonb)
to authenticated;
