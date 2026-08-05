-- ============================================================
-- VYRO 3090
-- Sprint 212.0 - LIVE Room Session Security
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Valores válidos para el estado de una sala
-- ------------------------------------------------------------

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'live_rooms_status_check'
          and conrelid = 'public.live_rooms'::regclass
    ) then
        alter table public.live_rooms
        add constraint live_rooms_status_check
        check (
            status in (
                'scheduled',
                'live',
                'active',
                'ended',
                'cancelled'
            )
        );
    end if;
end;
$$;

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table public.live_rooms
enable row level security;

drop policy if exists
"Authenticated users can view live rooms"
on public.live_rooms;

create policy
"Authenticated users can view live rooms"
on public.live_rooms
for select
to authenticated
using (true);

drop policy if exists
"Users can create own live rooms"
on public.live_rooms;

create policy
"Users can create own live rooms"
on public.live_rooms
for insert
to authenticated
with check (
    auth.uid() = host_id
);

drop policy if exists
"Hosts can update own live rooms"
on public.live_rooms;

create policy
"Hosts can update own live rooms"
on public.live_rooms
for update
to authenticated
using (
    auth.uid() = host_id
)
with check (
    auth.uid() = host_id
);

drop policy if exists
"Hosts can delete own live rooms"
on public.live_rooms;

create policy
"Hosts can delete own live rooms"
on public.live_rooms
for delete
to authenticated
using (
    auth.uid() = host_id
);

commit;
