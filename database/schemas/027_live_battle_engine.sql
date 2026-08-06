-- ============================================================
-- VYRO LIVE BATTLE ENGINE
-- Sprint 216.8 / 216.9
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Tipos
-- ------------------------------------------------------------

do $$
begin
    if not exists (
        select 1
        from pg_type t
        join pg_namespace n
            on n.oid = t.typnamespace
        where n.nspname = 'public'
          and t.typname = 'live_battle_status'
    ) then
        create type public.live_battle_status as enum (
            'scheduled',
            'waiting',
            'active',
            'finished',
            'cancelled'
        );
    end if;

    if not exists (
        select 1
        from pg_type t
        join pg_namespace n
            on n.oid = t.typnamespace
        where n.nspname = 'public'
          and t.typname = 'live_battle_mode'
    ) then
        create type public.live_battle_mode as enum (
            'one_vs_one',
            'team',
            'series',
            'tournament'
        );
    end if;
end
$$;

-- ------------------------------------------------------------
-- Tabla principal
-- ------------------------------------------------------------

create table if not exists public.live_battles (
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

    status public.live_battle_status not null
        default 'waiting',

    mode public.live_battle_mode not null
        default 'one_vs_one',

    duration_seconds integer not null
        default 300
        check (duration_seconds > 0),

    scheduled_at timestamptz,
    started_at timestamptz,
    ends_at timestamptz,
    finished_at timestamptz,

    winner_id uuid
        references public.profiles(id)
        on delete set null,

    series_id uuid,

    series_position integer
        check (
            series_position is null
            or series_position > 0
        ),

    auto_start_next boolean not null
        default false,

    break_duration_seconds integer not null
        default 60
        check (break_duration_seconds >= 0),

    created_by uuid not null
        references public.profiles(id)
        on delete cascade,

    created_at timestamptz not null
        default now(),

    updated_at timestamptz not null
        default now(),

    constraint live_battles_distinct_creators
        check (
            left_creator_id <> right_creator_id
        ),

    constraint live_battles_valid_dates
        check (
            ends_at is null
            or started_at is null
            or ends_at > started_at
        )
);

-- ------------------------------------------------------------
-- Puntuaciones
-- ------------------------------------------------------------

create table if not exists public.live_battle_scores (
    id uuid primary key default gen_random_uuid(),

    battle_id uuid not null
        references public.live_battles(id)
        on delete cascade,

    left_score numeric(18, 2) not null
        default 0
        check (left_score >= 0),

    right_score numeric(18, 2) not null
        default 0
        check (right_score >= 0),

    left_energy bigint not null
        default 0
        check (left_energy >= 0),

    right_energy bigint not null
        default 0
        check (right_energy >= 0),

    left_gift_count integer not null
        default 0
        check (left_gift_count >= 0),

    right_gift_count integer not null
        default 0
        check (right_gift_count >= 0),

    last_gift_id uuid
        references public.live_gifts(id)
        on delete set null,

    created_at timestamptz not null
        default now(),

    updated_at timestamptz not null
        default now(),

    constraint live_battle_scores_unique_battle
        unique (battle_id)
);

-- ------------------------------------------------------------
-- Historial de eventos
-- ------------------------------------------------------------

create table if not exists public.live_battle_events (
    id uuid primary key default gen_random_uuid(),

    battle_id uuid not null
        references public.live_battles(id)
        on delete cascade,

    room_id uuid not null
        references public.live_rooms(id)
        on delete cascade,

    event_type text not null
        check (
            event_type in (
                'scheduled',
                'waiting',
                'started',
                'gift',
                'score_updated',
                'leader_changed',
                'countdown',
                'finished',
                'cancelled',
                'winner',
                'draw'
            )
        ),

    actor_user_id uuid
        references public.profiles(id)
        on delete set null,

    target_user_id uuid
        references public.profiles(id)
        on delete set null,

    gift_id uuid
        references public.live_gifts(id)
        on delete set null,

    score_delta numeric(18, 2) not null
        default 0,

    energy_delta bigint not null
        default 0,

    payload jsonb not null
        default '{}'::jsonb,

    created_at timestamptz not null
        default now()
);

-- ------------------------------------------------------------
-- Índices
-- ------------------------------------------------------------

create index if not exists idx_live_battles_room_status
on public.live_battles (
    room_id,
    status,
    created_at desc
);

create index if not exists idx_live_battles_schedule
on public.live_battles (
    scheduled_at,
    status
);

create index if not exists idx_live_battles_series
on public.live_battles (
    series_id,
    series_position
);

create index if not exists idx_live_battle_scores_battle
on public.live_battle_scores (
    battle_id
);

create index if not exists idx_live_battle_events_battle_created
on public.live_battle_events (
    battle_id,
    created_at desc
);

create index if not exists idx_live_battle_events_room_created
on public.live_battle_events (
    room_id,
    created_at desc
);

-- ------------------------------------------------------------
-- Triggers updated_at
-- ------------------------------------------------------------

drop trigger if exists trg_live_battles_updated_at
on public.live_battles;

create trigger trg_live_battles_updated_at
before update on public.live_battles
for each row
execute function public.set_live_updated_at();

drop trigger if exists trg_live_battle_scores_updated_at
on public.live_battle_scores;

create trigger trg_live_battle_scores_updated_at
before update on public.live_battle_scores
for each row
execute function public.set_live_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table public.live_battles
enable row level security;

alter table public.live_battle_scores
enable row level security;

alter table public.live_battle_events
enable row level security;

drop policy if exists
"Authenticated users can view live battles"
on public.live_battles;

create policy
"Authenticated users can view live battles"
on public.live_battles
for select
to authenticated
using (true);

drop policy if exists
"Battle creators can create live battles"
on public.live_battles;

create policy
"Battle creators can create live battles"
on public.live_battles
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
"Battle creators can update live battles"
on public.live_battles;

create policy
"Battle creators can update live battles"
on public.live_battles
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

drop policy if exists
"Authenticated users can view battle scores"
on public.live_battle_scores;

create policy
"Authenticated users can view battle scores"
on public.live_battle_scores
for select
to authenticated
using (true);

drop policy if exists
"Authenticated users can view battle events"
on public.live_battle_events;

create policy
"Authenticated users can view battle events"
on public.live_battle_events
for select
to authenticated
using (true);

-- Las puntuaciones y los eventos no permiten escritura directa
-- desde el cliente. Se actualizarán mediante RPC seguras.

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
          and tablename = 'live_battles'
    ) then
        execute
            'alter publication supabase_realtime add table public.live_battles';
    end if;

    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'live_battle_scores'
    ) then
        execute
            'alter publication supabase_realtime add table public.live_battle_scores';
    end if;

    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'live_battle_events'
    ) then
        execute
            'alter publication supabase_realtime add table public.live_battle_events';
    end if;
end
$$;

commit;
