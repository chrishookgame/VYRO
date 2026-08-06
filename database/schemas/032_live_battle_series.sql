-- ============================================================
-- VYRO LIVE BATTLE SERIES
-- Sprint 218.7
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Estado de la serie
-- ------------------------------------------------------------

do $$
begin
    if not exists (
        select 1
        from pg_type t
        join pg_namespace n
            on n.oid = t.typnamespace
        where n.nspname = 'public'
          and t.typname = 'live_battle_series_status'
    ) then
        create type public.live_battle_series_status as enum (
            'scheduled',
            'waiting',
            'active',
            'intermission',
            'finished',
            'cancelled'
        );
    end if;
end
$$;

-- ------------------------------------------------------------
-- Tabla principal de series
-- ------------------------------------------------------------

create table if not exists public.live_battle_series (
    id uuid primary key default gen_random_uuid(),

    room_id uuid not null
        references public.live_rooms(id)
        on delete cascade,

    left_creator_id uuid not null
        references public.profiles(id)
        on delete cascade,

    right_creator_id uuid not null
        references public.profiles(id)
        on delete cascade,

    created_by uuid not null
        references public.profiles(id)
        on delete cascade,

    invitation_id uuid
        references public.live_battle_invitations(id)
        on delete set null,

    status public.live_battle_series_status not null
        default 'scheduled',

    total_battles integer not null
        default 1
        check (total_battles > 0),

    battle_duration_seconds integer not null
        default 180
        check (battle_duration_seconds > 0),

    break_duration_seconds integer not null
        default 60
        check (break_duration_seconds >= 0),

    auto_start_next boolean not null
        default true,

    current_position integer not null
        default 0
        check (
            current_position >= 0
            and current_position <= total_battles
        ),

    left_wins integer not null
        default 0
        check (left_wins >= 0),

    right_wins integer not null
        default 0
        check (right_wins >= 0),

    draws integer not null
        default 0
        check (draws >= 0),

    winner_id uuid
        references public.profiles(id)
        on delete set null,

    scheduled_at timestamptz,
    started_at timestamptz,
    next_battle_at timestamptz,
    finished_at timestamptz,
    cancelled_at timestamptz,

    created_at timestamptz not null
        default now(),

    updated_at timestamptz not null
        default now(),

    constraint live_battle_series_distinct_creators
        check (
            left_creator_id <> right_creator_id
        ),

    constraint live_battle_series_valid_results
        check (
            left_wins + right_wins + draws
            <= total_battles
        )
);

-- ------------------------------------------------------------
-- Relación entre batallas y series
-- ------------------------------------------------------------

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname =
            'live_battles_series_id_fkey'
    ) then
        alter table public.live_battles
        add constraint live_battles_series_id_fkey
        foreign key (series_id)
        references public.live_battle_series(id)
        on delete set null;
    end if;
end
$$;

-- Una posición no puede repetirse dentro de la misma serie.

create unique index if not exists
idx_live_battles_unique_series_position
on public.live_battles (
    series_id,
    series_position
)
where series_id is not null
  and series_position is not null;

-- ------------------------------------------------------------
-- Índices
-- ------------------------------------------------------------

create index if not exists
idx_live_battle_series_room_status
on public.live_battle_series (
    room_id,
    status,
    created_at desc
);

create index if not exists
idx_live_battle_series_left_creator
on public.live_battle_series (
    left_creator_id,
    status,
    created_at desc
);

create index if not exists
idx_live_battle_series_right_creator
on public.live_battle_series (
    right_creator_id,
    status,
    created_at desc
);

create index if not exists
idx_live_battle_series_schedule
on public.live_battle_series (
    scheduled_at,
    status
);

create index if not exists
idx_live_battle_series_next_battle
on public.live_battle_series (
    next_battle_at,
    status
);

-- ------------------------------------------------------------
-- Trigger updated_at
-- ------------------------------------------------------------

drop trigger if exists
trg_live_battle_series_updated_at
on public.live_battle_series;

create trigger
trg_live_battle_series_updated_at
before update on public.live_battle_series
for each row
execute function public.set_live_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table public.live_battle_series
enable row level security;

drop policy if exists
"Authenticated users can view battle series"
on public.live_battle_series;

create policy
"Authenticated users can view battle series"
on public.live_battle_series
for select
to authenticated
using (true);

drop policy if exists
"Battle participants can create series"
on public.live_battle_series;

create policy
"Battle participants can create series"
on public.live_battle_series
for insert
to authenticated
with check (
    auth.uid() = created_by
    and (
        auth.uid() = left_creator_id
        or auth.uid() = right_creator_id
    )
);

drop policy if exists
"Battle participants can update series"
on public.live_battle_series;

create policy
"Battle participants can update series"
on public.live_battle_series
for update
to authenticated
using (
    auth.uid() = created_by
    or auth.uid() = left_creator_id
    or auth.uid() = right_creator_id
)
with check (
    auth.uid() = created_by
    or auth.uid() = left_creator_id
    or auth.uid() = right_creator_id
);

-- ------------------------------------------------------------
-- Supabase Realtime
-- ------------------------------------------------------------

do $$
begin
    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'live_battle_series'
    ) then
        execute
            'alter publication supabase_realtime add table public.live_battle_series';
    end if;
end
$$;

commit;
