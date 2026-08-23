begin;

create or replace function public.is_vyro_wallet_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
    select exists (
        select 1
        from public.profiles
        where profiles.id = auth.uid()
          and profiles.role in (
              'super_admin',
              'admin',
              'finance'
          )
    );
$$;

revoke all
on function public.is_vyro_wallet_staff()
from public;

grant execute
on function public.is_vyro_wallet_staff()
to authenticated;

alter table public.wallets
enable row level security;

alter table public.wallet_transactions
enable row level security;

drop policy if exists "wallets_select_own"
on public.wallets;

create policy "wallets_select_own"
on public.wallets
for select
to authenticated
using (
    user_id = (select auth.uid())
    or public.is_vyro_wallet_staff()
);

drop policy if exists "wallets_admin_manage"
on public.wallets;

create policy "wallets_admin_manage"
on public.wallets
for all
to authenticated
using (
    public.is_vyro_wallet_staff()
)
with check (
    public.is_vyro_wallet_staff()
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
              or public.is_vyro_wallet_staff()
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
    public.is_vyro_wallet_staff()
)
with check (
    public.is_vyro_wallet_staff()
);

commit;