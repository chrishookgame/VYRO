create or replace function public.is_vyro_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role in (
              'super_admin',
              'admin',
              'support',
              'finance'
          )
    );
$$;

grant execute
on function public.is_vyro_admin()
to authenticated;

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.withdraw_requests enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
alter table public.support_attachments enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "profiles_select_authenticated"
on public.profiles;

create policy "profiles_select_authenticated"
on public.profiles
for select
to authenticated
using (
    id = (select auth.uid())
    or public.is_vyro_admin()
);

drop policy if exists "profiles_insert_own"
on public.profiles;

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (
    id = (select auth.uid())
);

drop policy if exists "profiles_update_own"
on public.profiles;

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (
    id = (select auth.uid())
    or public.is_vyro_admin()
)
with check (
    id = (select auth.uid())
    or public.is_vyro_admin()
);

drop policy if exists "wallets_select_own"
on public.wallets;

create policy "wallets_select_own"
on public.wallets
for select
to authenticated
using (
    user_id = (select auth.uid())
    or public.is_vyro_admin()
);

drop policy if exists "wallets_admin_manage"
on public.wallets;

create policy "wallets_admin_manage"
on public.wallets
for all
to authenticated
using (
    public.is_vyro_admin()
)
with check (
    public.is_vyro_admin()
);

drop policy if exists "transactions_select_own"
on public.wallet_transactions;

create policy "transactions_select_own"
on public.wallet_transactions
for select
to authenticated
using (
    exists (
        select 1
        from public.wallets
        where wallets.id =
              wallet_transactions.wallet_id
          and (
              wallets.user_id =
              (select auth.uid())
              or public.is_vyro_admin()
          )
    )
);

drop policy if exists "transactions_admin_manage"
on public.wallet_transactions;

create policy "transactions_admin_manage"
on public.wallet_transactions
for all
to authenticated
using (
    public.is_vyro_admin()
)
with check (
    public.is_vyro_admin()
);

drop policy if exists "withdraw_select_own"
on public.withdraw_requests;

create policy "withdraw_select_own"
on public.withdraw_requests
for select
to authenticated
using (
    exists (
        select 1
        from public.wallets
        where wallets.id =
              withdraw_requests.wallet_id
          and (
              wallets.user_id =
              (select auth.uid())
              or public.is_vyro_admin()
          )
    )
);

drop policy if exists "withdraw_create_own"
on public.withdraw_requests;

create policy "withdraw_create_own"
on public.withdraw_requests
for insert
to authenticated
with check (
    exists (
        select 1
        from public.wallets
        where wallets.id =
              withdraw_requests.wallet_id
          and wallets.user_id =
              (select auth.uid())
    )
);

drop policy if exists "withdraw_admin_update"
on public.withdraw_requests;

create policy "withdraw_admin_update"
on public.withdraw_requests
for update
to authenticated
using (
    public.is_vyro_admin()
)
with check (
    public.is_vyro_admin()
);

drop policy if exists "tickets_select_own"
on public.support_tickets;

create policy "tickets_select_own"
on public.support_tickets
for select
to authenticated
using (
    user_id = (select auth.uid())
    or assigned_admin_id =
       (select auth.uid())
    or public.is_vyro_admin()
);

drop policy if exists "tickets_create_own"
on public.support_tickets;

create policy "tickets_create_own"
on public.support_tickets
for insert
to authenticated
with check (
    user_id = (select auth.uid())
);

drop policy if exists "tickets_update_admin"
on public.support_tickets;

create policy "tickets_update_admin"
on public.support_tickets
for update
to authenticated
using (
    assigned_admin_id =
    (select auth.uid())
    or public.is_vyro_admin()
)
with check (
    assigned_admin_id =
    (select auth.uid())
    or public.is_vyro_admin()
);

drop policy if exists "messages_select_ticket_member"
on public.support_messages;

create policy "messages_select_ticket_member"
on public.support_messages
for select
to authenticated
using (
    exists (
        select 1
        from public.support_tickets
        where support_tickets.id =
              support_messages.ticket_id
          and (
              support_tickets.user_id =
              (select auth.uid())
              or support_tickets.assigned_admin_id =
                 (select auth.uid())
              or public.is_vyro_admin()
          )
    )
);

drop policy if exists "messages_insert_ticket_member"
on public.support_messages;

create policy "messages_insert_ticket_member"
on public.support_messages
for insert
to authenticated
with check (
    sender_id = (select auth.uid())
    and exists (
        select 1
        from public.support_tickets
        where support_tickets.id =
              support_messages.ticket_id
          and (
              support_tickets.user_id =
              (select auth.uid())
              or support_tickets.assigned_admin_id =
                 (select auth.uid())
              or public.is_vyro_admin()
          )
    )
);

drop policy if exists "attachments_select_ticket_member"
on public.support_attachments;

create policy "attachments_select_ticket_member"
on public.support_attachments
for select
to authenticated
using (
    exists (
        select 1
        from public.support_tickets
        where support_tickets.id =
              support_attachments.ticket_id
          and (
              support_tickets.user_id =
              (select auth.uid())
              or support_tickets.assigned_admin_id =
                 (select auth.uid())
              or public.is_vyro_admin()
          )
    )
);

drop policy if exists "attachments_insert_ticket_member"
on public.support_attachments;

create policy "attachments_insert_ticket_member"
on public.support_attachments
for insert
to authenticated
with check (
    uploaded_by = (select auth.uid())
);

drop policy if exists "notifications_select_own"
on public.notifications;

create policy "notifications_select_own"
on public.notifications
for select
to authenticated
using (
    user_id = (select auth.uid())
    or public.is_vyro_admin()
);

drop policy if exists "notifications_update_own"
on public.notifications;

create policy "notifications_update_own"
on public.notifications
for update
to authenticated
using (
    user_id = (select auth.uid())
)
with check (
    user_id = (select auth.uid())
);

drop policy if exists "notifications_admin_insert"
on public.notifications;

create policy "notifications_admin_insert"
on public.notifications
for insert
to authenticated
with check (
    public.is_vyro_admin()
);
