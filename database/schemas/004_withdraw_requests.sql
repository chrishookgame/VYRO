create table if not exists public.withdraw_requests (

    id uuid primary key default gen_random_uuid(),

    wallet_id uuid
        not null references public.wallets(id)
        on delete cascade,

    amount numeric(18,2)
        not null,

    method text
        not null,

    destination text
        not null,

    status text
        not null default 'pending',

    admin_notes text,

    processed_by uuid
        references public.profiles(id),

    requested_at timestamptz
        not null default now(),

    processed_at timestamptz
);

create index if not exists idx_withdraw_status
on public.withdraw_requests(status);

create index if not exists idx_withdraw_wallet
on public.withdraw_requests(wallet_id);
