-- ============================================================
-- VYRO 3090
-- Sprint 210.8 - Live Presence Engine
-- ============================================================

begin;

create table if not exists public.live_presence (
    user_id uuid primary key
        references public.profiles(id)
        on delete cascade,

    status text not null default 'offline'
        check (
            status in (
                'online',
                'offline',
                'away',
                'live'
            )
        ),

    current_room_id uuid
        references public.live_rooms(id)
        on delete set null,

    last_seen_at timestamptz not null default now(),
    connected_at timestamptz,
    disconnected_at timestamptz,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_live_presence_status
on public.live_presence (
    status,
    last_seen_at desc
);

create index if not exists idx_live_presence_room
on public.live_presence (
    current_room_id,
    status
);

create table if not exists public.live_presence_events (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    room_id uuid
        references public.live_rooms(id)
        on delete cascade,

    event_type text not null
        check (
            event_type in (
                'connected',
                'disconnected',
                'joined_room',
                'left_room',
                'went_live',
                'ended_live',
                'heartbeat'
            )
        ),

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now()
);

create index if not exists idx_live_presence_events_user
on public.live_presence_events (
    user_id,
    created_at desc
);

create index if not exists idx_live_presence_events_room
on public.live_presence_events (
    room_id,
    created_at desc
);

create table if not exists public.live_room_counters (
    room_id uuid primary key
        references public.live_rooms(id)
        on delete cascade,

    active_viewers integer not null default 0
        check (active_viewers >= 0),

    peak_viewers integer not null default 0
        check (peak_viewers >= 0),

    total_joins bigint not null default 0
        check (total_joins >= 0),

    total_reactions bigint not null default 0
        check (total_reactions >= 0),

    total_gifts bigint not null default 0
        check (total_gifts >= 0),

    updated_at timestamptz not null default now()
);

drop trigger if exists trg_live_presence_updated_at
on public.live_presence;

create trigger trg_live_presence_updated_at
before update on public.live_presence
for each row
execute function public.set_live_updated_at();

drop trigger if exists trg_live_room_counters_updated_at
on public.live_room_counters;

create trigger trg_live_room_counters_updated_at
before update on public.live_room_counters
for each row
execute function public.set_live_updated_at();

alter table public.live_presence enable row level security;
alter table public.live_presence_events enable row level security;
alter table public.live_room_counters enable row level security;

drop policy if exists
"Authenticated users can view live presence"
on public.live_presence;

create policy
"Authenticated users can view live presence"
on public.live_presence
for select
to authenticated
using (true);

drop policy if exists
"Users can manage own live presence"
on public.live_presence;

create policy
"Users can manage own live presence"
on public.live_presence
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists
"Users can create own live presence events"
on public.live_presence_events;

create policy
"Users can create own live presence events"
on public.live_presence_events
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists
"Users can view own live presence events"
on public.live_presence_events;

create policy
"Users can view own live presence events"
on public.live_presence_events
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists
"Authenticated users can view live room counters"
on public.live_room_counters;

create policy
"Authenticated users can view live room counters"
on public.live_room_counters
for select
to authenticated
using (true);

commit;
