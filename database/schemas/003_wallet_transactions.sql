create table if not exists public.wallet_transactions (

    id uuid primary key default gen_random_uuid(),

    wallet_id uuid
        not null references public.wallets(id)
        on delete cascade,

    type text not null,

    amount numeric(18,2)
        not null,

    description text,

    reference text,

    created_at timestamptz
        not null default now()
);

create index if not exists idx_wallet_transactions_wallet
on public.wallet_transactions(wallet_id);

create index if not exists idx_wallet_transactions_date
on public.wallet_transactions(created_at desc);
