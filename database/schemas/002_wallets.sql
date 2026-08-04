create table if not exists public.wallets (

    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    available_balance numeric(18,2)
        not null default 0,

    pending_balance numeric(18,2)
        not null default 0,

    lifetime_earnings numeric(18,2)
        not null default 0,

    lifetime_withdrawals numeric(18,2)
        not null default 0,

    created_at timestamptz
        not null default now(),

    updated_at timestamptz
        not null default now(),

    unique(user_id)
);

create index if not exists idx_wallet_user
on public.wallets(user_id);
