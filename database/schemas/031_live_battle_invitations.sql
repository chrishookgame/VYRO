-- ============================================================
-- VYRO LIVE BATTLE INVITATIONS
-- Sprint 218.2
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Tipo de estado
-- ------------------------------------------------------------

do $$
begin
    if not exists (
        select 1
        from pg_type t
        join pg_namespace n
            on n.oid = t.typnamespace
        where n.nspname = 'public'
          and t.typname = 'live_battle_invitation_status'
    ) then
        create type public.live_battle_invitation_status as enum (
            'pending',
            'accepted',
            'declined',
            'expired',
            'cancelled'
        );
    end if;
end
$$;

-- ------------------------------------------------------------
-- Tabla principal
-- ------------------------------------------------------------

create table if not exists public.live_battle_invitations (
    id uuid primary key default gen_random_uuid(),

    room_id uuid not null
        references public.live_rooms(id)
        on delete cascade,

    sender_id uuid not null
        references public.profiles(id)
        on delete cascade,

    receiver_id uuid not null
        references public.profiles(id)
        on delete cascade,

    status public.live_battle_invitation_status not null
        default 'pending',

    series_config jsonb not null
        default jsonb_build_object(
            'totalBattles', 1,
            'battleDurationSeconds', 180,
            'breakDurationSeconds', 60,
            'autoStartNext', true
        ),

    message text,

    expires_at timestamptz not null
        default (now() + interval '2 minutes'),

    responded_at timestamptz,
    accepted_at timestamptz,
    declined_at timestamptz,
    cancelled_at timestamptz,

    created_at timestamptz not null
        default now(),

    updated_at timestamptz not null
        default now(),

    constraint live_battle_invitations_distinct_users
        check (
            sender_id <> receiver_id
        ),

    constraint live_battle_invitations_valid_expiration
        check (
            expires_at > created_at
        ),

    constraint live_battle_invitations_valid_series_config
        check (
            jsonb_typeof(series_config) = 'object'
            and coalesce(
                (series_config ->> 'totalBattles')::integer,
                0
            ) > 0
            and coalesce(
                (series_config ->> 'battleDurationSeconds')::integer,
                0
            ) > 0
            and coalesce(
                (series_config ->> 'breakDurationSeconds')::integer,
                -1
            ) >= 0
        )
);

-- ------------------------------------------------------------
-- Evitar invitaciones pendientes duplicadas
-- ------------------------------------------------------------

create unique index if not exists
idx_live_battle_invitations_unique_pending
on public.live_battle_invitations (
    sender_id,
    receiver_id,
    room_id
)
where status = 'pending';

-- ------------------------------------------------------------
-- Índices
-- ------------------------------------------------------------

create index if not exists
idx_live_battle_invitations_receiver_status
on public.live_battle_invitations (
    receiver_id,
    status,
    created_at desc
);

create index if not exists
idx_live_battle_invitations_sender_status
on public.live_battle_invitations (
    sender_id,
    status,
    created_at desc
);

create index if not exists
idx_live_battle_invitations_room_status
on public.live_battle_invitations (
    room_id,
    status,
    created_at desc
);

create index if not exists
idx_live_battle_invitations_expiration
on public.live_battle_invitations (
    expires_at,
    status
);

-- ------------------------------------------------------------
-- Trigger updated_at
-- ------------------------------------------------------------

drop trigger if exists
trg_live_battle_invitations_updated_at
on public.live_battle_invitations;

create trigger
trg_live_battle_invitations_updated_at
before update on public.live_battle_invitations
for each row
execute function public.set_live_updated_at();

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------

alter table public.live_battle_invitations
enable row level security;

drop policy if exists
"Battle participants can view invitations"
on public.live_battle_invitations;

create policy
"Battle participants can view invitations"
on public.live_battle_invitations
for select
to authenticated
using (
    auth.uid() = sender_id
    or auth.uid() = receiver_id
);

drop policy if exists
"Users can send battle invitations"
on public.live_battle_invitations;

create policy
"Users can send battle invitations"
on public.live_battle_invitations
for insert
to authenticated
with check (
    auth.uid() = sender_id
    and sender_id <> receiver_id
    and status = 'pending'
);

drop policy if exists
"Receivers can respond to battle invitations"
on public.live_battle_invitations;

create policy
"Receivers can respond to battle invitations"
on public.live_battle_invitations
for update
to authenticated
using (
    auth.uid() = receiver_id
    and status = 'pending'
)
with check (
    auth.uid() = receiver_id
    and status in (
        'accepted',
        'declined'
    )
);

drop policy if exists
"Senders can cancel battle invitations"
on public.live_battle_invitations;

create policy
"Senders can cancel battle invitations"
on public.live_battle_invitations
for update
to authenticated
using (
    auth.uid() = sender_id
    and status = 'pending'
)
with check (
    auth.uid() = sender_id
    and status = 'cancelled'
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
          and tablename = 'live_battle_invitations'
    ) then
        execute
            'alter publication supabase_realtime add table public.live_battle_invitations';
    end if;
end
$$;

commit;
