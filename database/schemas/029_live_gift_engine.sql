-- ============================================================
-- VYRO 3090
-- Sprint 212.7 - Secure LIVE Gift Engine
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Función segura para reconocer administradores
-- ------------------------------------------------------------

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
        where profiles.id = auth.uid()
          and profiles.role in (
              'super_admin',
              'admin',
              'support',
              'finance'
          )
    );
$$;

revoke all
on function public.is_vyro_admin()
from public;

grant execute
on function public.is_vyro_admin()
to authenticated;

-- ------------------------------------------------------------
-- Catálogo administrable de regalos
-- ------------------------------------------------------------

create table if not exists public.live_gift_catalog (
    code text primary key,

    name text not null,
    icon text not null,

    price numeric(18,2) not null
        check (price > 0),

    energy_value bigint not null default 0
        check (energy_value >= 0),

    creator_share_percent numeric(5,2) not null default 70
        check (
            creator_share_percent >= 0
            and creator_share_percent <= 100
        ),

    rarity text not null default 'common'
        check (
            rarity in (
                'common',
                'rare',
                'epic',
                'legendary',
                'mythic'
            )
        ),

    animation_key text not null default 'basic',
    display_order integer not null default 0,

    active boolean not null default true,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

drop trigger if exists trg_live_gift_catalog_updated_at
on public.live_gift_catalog;

create trigger trg_live_gift_catalog_updated_at
before update on public.live_gift_catalog
for each row
execute function public.set_live_updated_at();

insert into public.live_gift_catalog (
    code,
    name,
    icon,
    price,
    energy_value,
    creator_share_percent,
    rarity,
    animation_key,
    display_order
)
values
    (
        'rose',
        'VYRO Rose',
        '🌹',
        1,
        1,
        70,
        'common',
        'rose',
        10
    ),
    (
        'heart',
        'VYRO Heart',
        '❤️',
        5,
        5,
        70,
        'common',
        'heart',
        20
    ),
    (
        'star',
        'VYRO Star',
        '⭐',
        10,
        12,
        70,
        'rare',
        'star',
        30
    ),
    (
        'diamond',
        'VYRO Diamond',
        '💎',
        50,
        70,
        70,
        'epic',
        'diamond',
        40
    ),
    (
        'rocket',
        'VYRO Rocket',
        '🚀',
        200,
        320,
        70,
        'epic',
        'rocket',
        50
    ),
    (
        'crown',
        'VYRO Crown',
        '👑',
        500,
        900,
        70,
        'legendary',
        'crown',
        60
    ),
    (
        'lion',
        'VYRO Lion',
        '🦁',
        1000,
        2000,
        70,
        'mythic',
        'lion',
        70
    )
on conflict (code)
do nothing;

-- ------------------------------------------------------------
-- Seguridad del catálogo y regalos
-- ------------------------------------------------------------

alter table public.live_gift_catalog
enable row level security;

alter table public.live_gifts
enable row level security;

drop policy if exists
"Authenticated users can view active gift catalog"
on public.live_gift_catalog;

create policy
"Authenticated users can view active gift catalog"
on public.live_gift_catalog
for select
to authenticated
using (
    active = true
    or public.is_vyro_admin()
);

drop policy if exists
"Admins can manage gift catalog"
on public.live_gift_catalog;

create policy
"Admins can manage gift catalog"
on public.live_gift_catalog
for all
to authenticated
using (
    public.is_vyro_admin()
)
with check (
    public.is_vyro_admin()
);

drop policy if exists
"Authenticated users can view live gifts"
on public.live_gifts;

create policy
"Authenticated users can view live gifts"
on public.live_gifts
for select
to authenticated
using (true);

-- No se permite insertar regalos directamente desde el cliente.
-- Todos los envíos pasan por send_live_gift().

-- ------------------------------------------------------------
-- RPC atómico para enviar regalos
-- ------------------------------------------------------------

create or replace function public.send_live_gift(
    target_room_id uuid,
    target_gift_code text
)
returns table (
    gift_id uuid,
    room_id uuid,
    sender_id uuid,
    receiver_id uuid,
    gift_type text,
    gift_name text,
    gift_icon text,
    gross_amount numeric,
    creator_earnings numeric,
    energy_added bigint,
    sender_balance numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
    current_user_id uuid := auth.uid();

    host_user_id uuid;

    sender_wallet_id uuid;
    creator_wallet_id uuid;

    current_sender_balance numeric(18,2);

    selected_gift public.live_gift_catalog%rowtype;

    new_gift_id uuid := gen_random_uuid();

    calculated_creator_earnings numeric(18,2);
    calculated_platform_share numeric(18,2);

    updated_energy bigint;
begin
    if current_user_id is null then
        raise exception
            'Debes iniciar sesión para enviar regalos.';
    end if;

    if target_room_id is null then
        raise exception
            'La sala LIVE es obligatoria.';
    end if;

    if nullif(trim(target_gift_code), '') is null then
        raise exception
            'El regalo es obligatorio.';
    end if;

    select live_rooms.host_id
    into host_user_id
    from public.live_rooms
    where live_rooms.id = target_room_id
      and live_rooms.status in (
          'live',
          'active'
      )
    for update;

    if host_user_id is null then
        raise exception
            'La sala LIVE no existe o no está activa.';
    end if;

    if host_user_id = current_user_id then
        raise exception
            'El creador no puede enviarse regalos a sí mismo.';
    end if;

    select *
    into selected_gift
    from public.live_gift_catalog
    where code = lower(trim(target_gift_code))
      and active = true;

    if not found then
        raise exception
            'El regalo seleccionado no está disponible.';
    end if;

    insert into public.wallets (
        user_id
    )
    values (
        current_user_id
    )
    on conflict (user_id)
    do nothing;

    insert into public.wallets (
        user_id
    )
    values (
        host_user_id
    )
    on conflict (user_id)
    do nothing;

    select
        wallets.id,
        wallets.available_balance
    into
        sender_wallet_id,
        current_sender_balance
    from public.wallets
    where wallets.user_id = current_user_id
    for update;

    select wallets.id
    into creator_wallet_id
    from public.wallets
    where wallets.user_id = host_user_id
    for update;

    if sender_wallet_id is null then
        raise exception
            'No se encontró la Wallet del espectador.';
    end if;

    if creator_wallet_id is null then
        raise exception
            'No se encontró la Wallet del creador.';
    end if;

    if current_sender_balance < selected_gift.price then
        raise exception
            'Saldo insuficiente para enviar este regalo.';
    end if;

    calculated_creator_earnings :=
        round(
            selected_gift.price
            * selected_gift.creator_share_percent
            / 100,
            2
        );

    calculated_platform_share :=
        selected_gift.price
        - calculated_creator_earnings;

    update public.wallets
    set available_balance =
        available_balance
        - selected_gift.price
    where id = sender_wallet_id;

    update public.wallets
    set
        pending_balance =
            pending_balance
            + calculated_creator_earnings,

        lifetime_earnings =
            lifetime_earnings
            + calculated_creator_earnings
    where id = creator_wallet_id;

    insert into public.live_gifts (
        id,
        room_id,
        sender_id,
        receiver_id,
        gift_type,
        amount
    )
    values (
        new_gift_id,
        target_room_id,
        current_user_id,
        host_user_id,
        selected_gift.code,
        selected_gift.price
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
        'live_gift_debit',
        -selected_gift.price,
        'Regalo enviado: ' || selected_gift.name,
        new_gift_id::text
    );

    insert into public.wallet_transactions (
        wallet_id,
        type,
        amount,
        description,
        reference
    )
    values (
        creator_wallet_id,
        'live_gift_credit',
        calculated_creator_earnings,
        'Ganancia pendiente por regalo: '
            || selected_gift.name,
        new_gift_id::text
    );

    insert into public.live_room_counters (
        room_id,
        total_gifts
    )
    values (
        target_room_id,
        1
    )
    on conflict (room_id)
    do update set
        total_gifts =
            public.live_room_counters.total_gifts + 1;

    insert into public.live_statistics (
        room_id,
        total_gifts,
        gross_gift_value
    )
    values (
        target_room_id,
        1,
        selected_gift.price
    )
    on conflict (room_id)
    do update set
        total_gifts =
            public.live_statistics.total_gifts + 1,

        gross_gift_value =
            public.live_statistics.gross_gift_value
            + selected_gift.price;

    insert into public.live_energy_states (
        room_id,
        current_energy
    )
    values (
        target_room_id,
        selected_gift.energy_value
    )
    on conflict (room_id)
    do update set
        current_energy =
            least(
                public.live_energy_states.maximum_energy,
                public.live_energy_states.current_energy
                    + selected_gift.energy_value
            )
    returning current_energy
    into updated_energy;

    insert into public.live_realtime_events (
        room_id,
        user_id,
        event_type,
        event_key,
        payload
    )
    values (
        target_room_id,
        current_user_id,
        'gift_sent',
        selected_gift.code,
        jsonb_build_object(
            'gift_id',
            new_gift_id,
            'gift_code',
            selected_gift.code,
            'gift_name',
            selected_gift.name,
            'gift_icon',
            selected_gift.icon,
            'amount',
            selected_gift.price,
            'creator_earnings',
            calculated_creator_earnings,
            'platform_share',
            calculated_platform_share,
            'energy_added',
            selected_gift.energy_value,
            'animation_key',
            selected_gift.animation_key,
            'rarity',
            selected_gift.rarity
        )
    );

    insert into public.live_realtime_events (
        room_id,
        user_id,
        event_type,
        event_key,
        payload
    )
    values (
        target_room_id,
        current_user_id,
        'energy_updated',
        'gift_energy',
        jsonb_build_object(
            'gift_id',
            new_gift_id,
            'energy_added',
            selected_gift.energy_value,
            'current_energy',
            updated_energy
        )
    );

    return query
    select
        new_gift_id,
        target_room_id,
        current_user_id,
        host_user_id,
        selected_gift.code,
        selected_gift.name,
        selected_gift.icon,
        selected_gift.price,
        calculated_creator_earnings,
        selected_gift.energy_value,
        (
            current_sender_balance
            - selected_gift.price
        );
end;
$$;

-- ------------------------------------------------------------
-- Permisos RPC
-- ------------------------------------------------------------

revoke all
on function public.send_live_gift(uuid, text)
from public;

grant execute
on function public.send_live_gift(uuid, text)
to authenticated;

commit;
