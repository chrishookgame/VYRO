-- ======================================================
-- VYRO - SUPPORT SECURITY
-- ======================================================

begin;

-- ------------------------------------------------------
-- Support-specific administrative authority.
-- Keep this narrower than is_vyro_admin():
-- only super_admin and support may operate Support data.
-- ------------------------------------------------------

create or replace function public.is_vyro_support_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles
        where profiles.id = auth.uid()
          and profiles.role in (
              'super_admin',
              'support'
          )
    );
$$;

revoke all
on function public.is_vyro_support_staff()
from public;

grant execute
on function public.is_vyro_support_staff()
to authenticated;

alter table public.support_tickets
enable row level security;

alter table public.support_messages
enable row level security;

-- ------------------------------------------------------
-- Remove broad/default access first
-- ------------------------------------------------------

revoke all
on table public.support_tickets
from public;

revoke all
on table public.support_tickets
from anon;

revoke all
on table public.support_tickets
from authenticated;

revoke all
on table public.support_messages
from public;

revoke all
on table public.support_messages
from anon;

revoke all
on table public.support_messages
from authenticated;

-- ------------------------------------------------------
-- Minimum authenticated privileges
-- RLS policies below still control which rows are allowed.
-- ------------------------------------------------------

grant select, insert, update
on table public.support_tickets
to authenticated;

grant select, insert
on table public.support_messages
to authenticated;

-- ------------------------------------------------------
-- support_tickets
-- ------------------------------------------------------

drop policy if exists support_tickets_select
on public.support_tickets;

create policy support_tickets_select
on public.support_tickets
for select
to authenticated
using (
    user_id = auth.uid()
    or public.is_vyro_support_staff()
);

drop policy if exists support_tickets_insert_own
on public.support_tickets;

create policy support_tickets_insert_own
on public.support_tickets
for insert
to authenticated
with check (
    user_id = auth.uid()
);

drop policy if exists support_tickets_admin_update
on public.support_tickets;

create policy support_tickets_admin_update
on public.support_tickets
for update
to authenticated
using (
    public.is_vyro_support_staff()
)
with check (
    public.is_vyro_support_staff()
);

-- ------------------------------------------------------
-- support_messages
-- ------------------------------------------------------

drop policy if exists support_messages_select
on public.support_messages;

create policy support_messages_select
on public.support_messages
for select
to authenticated
using (
    exists (
        select 1
        from public.support_tickets ticket
        where ticket.id = support_messages.ticket_id
          and (
              ticket.user_id = auth.uid()
              or public.is_vyro_support_staff()
          )
    )
);

drop policy if exists support_messages_insert
on public.support_messages;

create policy support_messages_insert
on public.support_messages
for insert
to authenticated
with check (
    sender_id = auth.uid()
    and exists (
        select 1
        from public.support_tickets ticket
        where ticket.id = support_messages.ticket_id
          and (
              ticket.user_id = auth.uid()
              or public.is_vyro_support_staff()
          )
    )
);

commit;