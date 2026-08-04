-- ============================================================
-- VYRO 3090
-- Sprint 210.1 - Live Experience Engine Foundation
-- Extiende 010_live.sql sin reemplazar estructuras anteriores.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Espectadores y participantes
-- ------------------------------------------------------------

create table if not exists public.live_viewers (
    id uuid primary key default gen_random_uuid(),
    room_id uuid not null references public.live_rooms(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    role text not null default 'viewer'
        check (role in ('viewer', 'guest', 'speaker', 'moderator', 'host')),
    joined_at timestamptz not null default now(),
    left_at timestamptz,
    last_seen_at timestamptz not null default now(),
    metadata jsonb not null default '{}'::jsonb
);

create unique index if not exists idx_live_viewers_active_unique
on public.live_viewers(room_id, user_id)
where left_at is null;

create index if not exists idx_live_viewers_room_active
on public.live_viewers(room_id, joined_at desc)
where left_at is null;

create index if not exists idx_live_viewers_user
on public.live_viewers(user_id, joined_at desc);

-- ------------------------------------------------------------
-- Reacciones en tiempo real
-- ------------------------------------------------------------

create table if not exists public.live_reactions (
    id uuid primary key default gen_random_uuid(),
    room_id uuid not null references public.live_rooms(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    reaction_type text not null
        check (
            reaction_type in (
                'like',
                'love',
                'fire',
                'wow',
                'celebrate',
                'support',
                'vyro_energy'
            )
        ),
    intensity smallint not null default 1
        check (intensity between 1 and 10),
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists idx_live_reactions_room_created
on public.live_reactions(room_id, created_at desc);

create index if not exists idx_live_reactions_user_created
on public.live_reactions(user_id, created_at desc);

-- ------------------------------------------------------------
-- VYRO Energy Core
-- ------------------------------------------------------------

create table if not exists public.live_energy_states (
    room_id uuid primary key references public.live_rooms(id) on delete cascade,
    current_energy bigint not null default 0
        check (current_energy >= 0),
    maximum_energy bigint not null default 1000
        check (maximum_energy > 0),
    energy_level integer not null default 1
        check (energy_level >= 1),
    combo_count integer not null default 0
        check (combo_count >= 0),
    multiplier numeric(8,2) not null default 1
        check (multiplier >= 1),
    event_state text not null default 'charging'
        check (
            event_state in (
                'charging',
                'ready',
                'activated',
                'cooldown',
                'paused'
            )
        ),
    last_activation_at timestamptz,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Moderadores
-- ------------------------------------------------------------

create table if not exists public.live_moderators (
    room_id uuid not null references public.live_rooms(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    added_by uuid not null references public.profiles(id) on delete cascade,
    permissions jsonb not null default '{
        "delete_messages": true,
        "mute_users": true,
        "remove_users": true,
        "ban_users": false,
        "manage_guests": false
    }'::jsonb,
    created_at timestamptz not null default now(),
    primary key (room_id, user_id)
);

create index if not exists idx_live_moderators_user
on public.live_moderators(user_id);

-- ------------------------------------------------------------
-- Bloqueos y seguridad
-- ------------------------------------------------------------

create table if not exists public.live_bans (
    room_id uuid not null references public.live_rooms(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    banned_by uuid not null references public.profiles(id) on delete cascade,
    reason text,
    expires_at timestamptz,
    created_at timestamptz not null default now(),
    primary key (room_id, user_id)
);

create index if not exists idx_live_bans_expiration
on public.live_bans(room_id, expires_at);

-- ------------------------------------------------------------
-- Estadísticas agregadas
-- ------------------------------------------------------------

create table if not exists public.live_statistics (
    room_id uuid primary key references public.live_rooms(id) on delete cascade,
    peak_viewers integer not null default 0
        check (peak_viewers >= 0),
    total_viewers bigint not null default 0
        check (total_viewers >= 0),
    total_messages bigint not null default 0
        check (total_messages >= 0),
    total_reactions bigint not null default 0
        check (total_reactions >= 0),
    total_gifts bigint not null default 0
        check (total_gifts >= 0),
    gross_gift_value numeric(18,2) not null default 0
        check (gross_gift_value >= 0),
    total_watch_seconds bigint not null default 0
        check (total_watch_seconds >= 0),
    unique_viewers bigint not null default 0
        check (unique_viewers >= 0),
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Función para updated_at
-- ------------------------------------------------------------

create or replace function public.set_live_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_live_energy_updated_at
on public.live_energy_states;

create trigger trg_live_energy_updated_at
before update on public.live_energy_states
for each row
execute function public.set_live_updated_at();

drop trigger if exists trg_live_statistics_updated_at
on public.live_statistics;

create trigger trg_live_statistics_updated_at
before update on public.live_statistics
for each row
execute function public.set_live_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table public.live_viewers enable row level security;
alter table public.live_reactions enable row level security;
alter table public.live_energy_states enable row level security;
alter table public.live_moderators enable row level security;
alter table public.live_bans enable row level security;
alter table public.live_statistics enable row level security;

-- Espectadores: lectura autenticada
drop policy if exists "Authenticated users can view live viewers"
on public.live_viewers;

create policy "Authenticated users can view live viewers"
on public.live_viewers
for select
to authenticated
using (true);

-- Cada persona gestiona únicamente su propia presencia
drop policy if exists "Users can join live rooms"
on public.live_viewers;

create policy "Users can join live rooms"
on public.live_viewers
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own live presence"
on public.live_viewers;

create policy "Users can update own live presence"
on public.live_viewers
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Reacciones
drop policy if exists "Authenticated users can view live reactions"
on public.live_reactions;

create policy "Authenticated users can view live reactions"
on public.live_reactions
for select
to authenticated
using (true);

drop policy if exists "Users can create own live reactions"
on public.live_reactions;

create policy "Users can create own live reactions"
on public.live_reactions
for insert
to authenticated
with check (auth.uid() = user_id);

-- Energy Core: visible para usuarios autenticados
drop policy if exists "Authenticated users can view energy states"
on public.live_energy_states;

create policy "Authenticated users can view energy states"
on public.live_energy_states
for select
to authenticated
using (true);

-- Los anfitriones pueden administrar el Energy Core
drop policy if exists "Hosts can manage energy states"
on public.live_energy_states;

create policy "Hosts can manage energy states"
on public.live_energy_states
for all
to authenticated
using (
    exists (
        select 1
        from public.live_rooms
        where live_rooms.id = live_energy_states.room_id
          and live_rooms.host_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.live_rooms
        where live_rooms.id = live_energy_states.room_id
          and live_rooms.host_id = auth.uid()
    )
);

-- Moderadores: el anfitrión administra
drop policy if exists "Hosts can manage live moderators"
on public.live_moderators;

create policy "Hosts can manage live moderators"
on public.live_moderators
for all
to authenticated
using (
    exists (
        select 1
        from public.live_rooms
        where live_rooms.id = live_moderators.room_id
          and live_rooms.host_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.live_rooms
        where live_rooms.id = live_moderators.room_id
          and live_rooms.host_id = auth.uid()
    )
);

drop policy if exists "Moderators can view own permissions"
on public.live_moderators;

create policy "Moderators can view own permissions"
on public.live_moderators
for select
to authenticated
using (auth.uid() = user_id);

-- Bloqueos: visibles y administrables por host o moderador autorizado
drop policy if exists "Hosts and moderators can view live bans"
on public.live_bans;

create policy "Hosts and moderators can view live bans"
on public.live_bans
for select
to authenticated
using (
    exists (
        select 1
        from public.live_rooms
        where live_rooms.id = live_bans.room_id
          and live_rooms.host_id = auth.uid()
    )
    or exists (
        select 1
        from public.live_moderators
        where live_moderators.room_id = live_bans.room_id
          and live_moderators.user_id = auth.uid()
    )
);

drop policy if exists "Hosts and authorized moderators can manage live bans"
on public.live_bans;

create policy "Hosts and authorized moderators can manage live bans"
on public.live_bans
for all
to authenticated
using (
    exists (
        select 1
        from public.live_rooms
        where live_rooms.id = live_bans.room_id
          and live_rooms.host_id = auth.uid()
    )
    or exists (
        select 1
        from public.live_moderators
        where live_moderators.room_id = live_bans.room_id
          and live_moderators.user_id = auth.uid()
          and coalesce(
              (live_moderators.permissions ->> 'ban_users')::boolean,
              false
          )
    )
)
with check (
    exists (
        select 1
        from public.live_rooms
        where live_rooms.id = live_bans.room_id
          and live_rooms.host_id = auth.uid()
    )
    or exists (
        select 1
        from public.live_moderators
        where live_moderators.room_id = live_bans.room_id
          and live_moderators.user_id = auth.uid()
          and coalesce(
              (live_moderators.permissions ->> 'ban_users')::boolean,
              false
          )
    )
);

-- Estadísticas: visibles para el anfitrión
drop policy if exists "Hosts can view live statistics"
on public.live_statistics;

create policy "Hosts can view live statistics"
on public.live_statistics
for select
to authenticated
using (
    exists (
        select 1
        from public.live_rooms
        where live_rooms.id = live_statistics.room_id
          and live_rooms.host_id = auth.uid()
    )
);

commit;
