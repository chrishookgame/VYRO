begin;

-- ============================================================
-- VYRO POST BOOST ENGINE
-- Paid distribution campaigns with atomic Wallet debit.
-- Boost increases distribution priority only.
-- It never creates artificial likes, views or engagement.
-- ============================================================

-- ------------------------------------------------------------
-- 1. ADMINISTRABLE BOOST CATALOG
-- ------------------------------------------------------------

create table if not exists public.post_boost_catalog (
    code text primary key,

    name text not null,

    description text,

    price numeric(18,2) not null
        check (price > 0),

    duration_hours integer not null
        check (duration_hours > 0),

    priority_boost integer not null
        check (priority_boost > 0),

    active boolean not null
        default true,

    display_order integer not null
        default 0,

    metadata jsonb not null
        default '{}'::jsonb,

    created_at timestamptz not null
        default now(),

    updated_at timestamptz not null
        default now()
);

-- Initial values are administrable later.
insert into public.post_boost_catalog (
    code,
    name,
    description,
    price,
    duration_hours,
    priority_boost,
    display_order
)
values
    (
        'spark',
        'Spark',
        'Impulso inicial de distribución.',
        1.00,
        6,
        10,
        10
    ),
    (
        'surge',
        'Surge',
        'Mayor prioridad temporal en distribución.',
        3.00,
        24,
        25,
        20
    ),
    (
        'nova',
        'Nova',
        'Máxima prioridad Boost disponible.',
        5.00,
        48,
        40,
        30
    )
on conflict (code)
do nothing;

-- ------------------------------------------------------------
-- 2. POST BOOST CAMPAIGNS
-- ------------------------------------------------------------

create table if not exists public.post_boost_campaigns (
    id uuid primary key
        default gen_random_uuid(),

    post_id uuid not null
        references public.posts(id)
        on delete cascade,

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    package_code text not null
        references public.post_boost_catalog(code),

    amount_paid numeric(18,2) not null
        check (amount_paid > 0),

    priority_boost integer not null
        check (priority_boost > 0),

    status text not null
        default 'active'
        check (
            status in (
                'active',
                'completed',
                'cancelled'
            )
        ),

    starts_at timestamptz not null
        default now(),

    ends_at timestamptz not null,

    created_at timestamptz not null
        default now(),

    updated_at timestamptz not null
        default now(),

    check (ends_at > starts_at)
);

create index if not exists
idx_post_boost_campaigns_post
on public.post_boost_campaigns(
    post_id,
    status,
    ends_at desc
);

create index if not exists
idx_post_boost_campaigns_user
on public.post_boost_campaigns(
    user_id,
    created_at desc
);

create index if not exists
idx_post_boost_campaigns_active
on public.post_boost_campaigns(
    ends_at desc,
    priority_boost desc
)
where status = 'active';

-- Only one ACTIVE Boost campaign per post.
create unique index if not exists
idx_post_boost_one_active_per_post
on public.post_boost_campaigns(post_id)
where status = 'active';

-- ------------------------------------------------------------
-- 3. UPDATED_AT
-- ------------------------------------------------------------

drop trigger if exists
post_boost_catalog_set_updated_at
on public.post_boost_catalog;

create trigger
post_boost_catalog_set_updated_at
before update
on public.post_boost_catalog
for each row
execute function public.set_updated_at();

drop trigger if exists
post_boost_campaigns_set_updated_at
on public.post_boost_campaigns;

create trigger
post_boost_campaigns_set_updated_at
before update
on public.post_boost_campaigns
for each row
execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 4. RLS
-- ------------------------------------------------------------

alter table public.post_boost_catalog
enable row level security;

alter table public.post_boost_campaigns
enable row level security;

drop policy if exists
"Authenticated users can view active boost packages"
on public.post_boost_catalog;

create policy
"Authenticated users can view active boost packages"
on public.post_boost_catalog
for select
to authenticated
using (
    active = true
    or public.is_vyro_admin()
);

drop policy if exists
"Admins can manage boost packages"
on public.post_boost_catalog;

create policy
"Admins can manage boost packages"
on public.post_boost_catalog
for all
to authenticated
using (
    public.is_vyro_admin()
)
with check (
    public.is_vyro_admin()
);

drop policy if exists
"Users can view own boost campaigns"
on public.post_boost_campaigns;

create policy
"Users can view own boost campaigns"
on public.post_boost_campaigns
for select
to authenticated
using (
    user_id = auth.uid()
    or public.is_vyro_admin()
);

drop policy if exists
"Admins can manage boost campaigns"
on public.post_boost_campaigns;

create policy
"Admins can manage boost campaigns"
on public.post_boost_campaigns
for all
to authenticated
using (
    public.is_vyro_admin()
)
with check (
    public.is_vyro_admin()
);

-- There is intentionally NO client INSERT policy.
-- Campaign creation must pass through activate_post_boost().

-- ------------------------------------------------------------
-- 5. ATOMIC BOOST ACTIVATION RPC
-- ------------------------------------------------------------

create or replace function public.activate_post_boost(
    target_post_id uuid,
    target_package_code text
)
returns table (
    campaign_id uuid,
    post_id uuid,
    package_code text,
    amount_paid numeric,
    priority_boost integer,
    starts_at timestamptz,
    ends_at timestamptz,
    remaining_balance numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
    current_user_id uuid :=
        auth.uid();

    sender_wallet_id uuid;

    current_balance numeric(18,2);

    selected_package
        public.post_boost_catalog%rowtype;

    post_owner_id uuid;

    new_campaign_id uuid :=
        gen_random_uuid();

    campaign_start timestamptz :=
        now();

    campaign_end timestamptz;
begin
    if current_user_id is null then
        raise exception
            'Debes iniciar sesión para usar Boost.';
    end if;

    if target_post_id is null then
        raise exception
            'La publicación es obligatoria.';
    end if;

    if nullif(
        trim(target_package_code),
        ''
    ) is null then
        raise exception
            'Debes seleccionar un paquete Boost.';
    end if;

    -- Lock target post and confirm ownership.
    select posts.user_id
    into post_owner_id
    from public.posts
    where posts.id = target_post_id
    for update;

    if post_owner_id is null then
        raise exception
            'La publicación no existe.';
    end if;

    if post_owner_id <> current_user_id then
        raise exception
            'Solo puedes impulsar tus propias publicaciones.';
    end if;

    select *
    into selected_package
    from public.post_boost_catalog
    where code =
        lower(
            trim(target_package_code)
        )
      and active = true;

    if not found then
        raise exception
            'El paquete Boost seleccionado no está disponible.';
    end if;

    -- Expired campaigns cease to be active before creating another.
    update public.post_boost_campaigns
    set status = 'completed'
    where post_id = target_post_id
      and status = 'active'
      and ends_at <= now();

    if exists (
        select 1
        from public.post_boost_campaigns
        where post_id = target_post_id
          and status = 'active'
          and ends_at > now()
    ) then
        raise exception
            'Esta publicación ya tiene un Boost activo.';
    end if;

    -- Guarantee a Wallet exists.
    insert into public.wallets (
        user_id
    )
    values (
        current_user_id
    )
    on conflict (user_id)
    do nothing;

    -- Lock Wallet before checking/debiting balance.
    select
        wallets.id,
        wallets.available_balance
    into
        sender_wallet_id,
        current_balance
    from public.wallets
    where wallets.user_id =
        current_user_id
    for update;

    if sender_wallet_id is null then
        raise exception
            'No se encontró tu Wallet.';
    end if;

    if current_balance <
        selected_package.price
    then
        raise exception
            'Saldo insuficiente para activar este Boost.';
    end if;

    campaign_end :=
        campaign_start
        + make_interval(
            hours =>
                selected_package.duration_hours
        );

    -- Debit occurs inside the same database transaction.
    update public.wallets
    set available_balance =
        available_balance
        - selected_package.price
    where id = sender_wallet_id;

    insert into public.post_boost_campaigns (
        id,
        post_id,
        user_id,
        package_code,
        amount_paid,
        priority_boost,
        status,
        starts_at,
        ends_at
    )
    values (
        new_campaign_id,
        target_post_id,
        current_user_id,
        selected_package.code,
        selected_package.price,
        selected_package.priority_boost,
        'active',
        campaign_start,
        campaign_end
    );

    insert into public.wallet_transactions (
        wallet_id,
        type,
        amount,
        description,
        reference
    )
    values (
        sender_wallet_id,
        'post_boost_debit',
        -selected_package.price,
        'Boost de publicación: '
            || selected_package.name,
        new_campaign_id::text
    );

    return query
    select
        new_campaign_id,
        target_post_id,
        selected_package.code,
        selected_package.price,
        selected_package.priority_boost,
        campaign_start,
        campaign_end,
        current_balance
            - selected_package.price;
end;
$$;

revoke all
on function public.activate_post_boost(
    uuid,
    text
)
from public;

grant execute
on function public.activate_post_boost(
    uuid,
    text
)
to authenticated;

grant usage on schema public
to authenticated;

grant select
on table public.post_boost_catalog
to authenticated;

grant select
on table public.post_boost_campaigns
to authenticated;

commit;
