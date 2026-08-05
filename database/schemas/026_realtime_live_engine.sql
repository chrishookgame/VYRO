-- ============================================================
-- VYRO 3090
-- Sprint 210.9 - Realtime LIVE Engine
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Eventos unificados del LIVE
-- ------------------------------------------------------------

create table if not exists public.live_realtime_events (
    id uuid primary key default gen_random_uuid(),

    room_id uuid not null
        references public.live_rooms(id)
        on delete cascade,

    user_id uuid
        references public.profiles(id)
        on delete set null,

    event_type text not null
        check (
            event_type in (
                'viewer_joined',
                'viewer_left',
                'reaction_created',
                'gift_sent',
                'energy_updated',
                'ranking_updated',
                'presence_updated',
                'platform_moment'
            )
        ),

    event_key text,
    payload jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now()
);

create index if not exists idx_live_realtime_events_room
on public.live_realtime_events (
    room_id,
    created_at desc
);

create index if not exists idx_live_realtime_events_type
on public.live_realtime_events (
    event_type,
    created_at desc
);

create index if not exists idx_live_realtime_events_user
on public.live_realtime_events (
    user_id,
    created_at desc
);

-- ------------------------------------------------------------
-- Canales y configuración Realtime por sala
-- ------------------------------------------------------------

create table if not exists public.live_realtime_channels (
    room_id uuid primary key
        references public.live_rooms(id)
        on delete cascade,

    channel_name text not null unique,

    presence_enabled boolean not null default true,
    reactions_enabled boolean not null default true,
    gifts_enabled boolean not null default true,
    ranking_enabled boolean not null default true,
    counters_enabled boolean not null default true,
    platform_moments_enabled boolean not null default true,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

drop trigger if exists trg_live_realtime_channels_updated_at
on public.live_realtime_channels;

create trigger trg_live_realtime_channels_updated_at
before update on public.live_realtime_channels
for each row
execute function public.set_live_updated_at();

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------

alter table public.live_realtime_events
enable row level security;

alter table public.live_realtime_channels
enable row level security;

drop policy if exists
"Authenticated users can view live realtime events"
on public.live_realtime_events;

create policy
"Authenticated users can view live realtime events"
on public.live_realtime_events
for select
to authenticated
using (true);

drop policy if exists
"Authenticated users can create live realtime events"
on public.live_realtime_events;

create policy
"Authenticated users can create live realtime events"
on public.live_realtime_events
for insert
to authenticated
with check (
    user_id is null
    or auth.uid() = user_id
);

drop policy if exists
"Authenticated users can view live realtime channels"
on public.live_realtime_channels;

create policy
"Authenticated users can view live realtime channels"
on public.live_realtime_channels
for select
to authenticated
using (true);

drop policy if exists
"Hosts can manage live realtime channels"
on public.live_realtime_channels;

create policy
"Hosts can manage live realtime channels"
on public.live_realtime_channels
for all
to authenticated
using (
    exists (
        select 1
        from public.live_rooms
        where live_rooms.id = live_realtime_channels.room_id
          and live_rooms.host_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.live_rooms
        where live_rooms.id = live_realtime_channels.room_id
          and live_rooms.host_id = auth.uid()
    )
);

-- ------------------------------------------------------------
-- Supabase Realtime publication
-- ------------------------------------------------------------

do $$
begin
    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'live_realtime_events'
    ) then
        execute 'alter publication supabase_realtime add table public.live_realtime_events';
    end if;

    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'live_room_counters'
    ) then
        execute 'alter publication supabase_realtime add table public.live_room_counters';
    end if;

    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'live_ranking_scores'
    ) then
        execute 'alter publication supabase_realtime add table public.live_ranking_scores';
    end if;

    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'live_reactions'
    ) then
        execute 'alter publication supabase_realtime add table public.live_reactions';
    end if;

    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'live_gifts'
    ) then
        execute 'alter publication supabase_realtime add table public.live_gifts';
    end if;
end;
$$;

commit;
