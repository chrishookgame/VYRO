begin;

-- ============================================================
-- VYRO 052
-- Battle Gift Authority
--
-- Objetivos:
-- 1. Mantener Gifts normales dirigidos al host.
-- 2. Durante una Battle ACTIVE, permitir exclusivamente LEFT/RIGHT.
-- 3. Acreditar Wallet, live_gifts.receiver_id y Battle Score
--    al mismo receptor validado por PostgreSQL.
-- 4. Hacer del backend la autoridad del marcador.
-- ============================================================

-- ------------------------------------------------------------
-- Una sola Battle ACTIVE por sala.
-- Si existieran datos históricos inválidos, la creación del
-- índice falla en lugar de corregirlos silenciosamente.
-- ------------------------------------------------------------

create unique index if not exists
idx_live_battles_one_active_per_room
on public.live_battles (room_id)
where status = 'active';

-- ------------------------------------------------------------
-- Un Gift físico solo puede producir un evento Battle "gift".
-- ------------------------------------------------------------

create unique index if not exists
idx_live_battle_events_unique_gift
on public.live_battle_events (gift_id)
where gift_id is not null
  and event_type = 'gift';

-- ------------------------------------------------------------
-- Evolucionar firma del Gift RPC.
--
-- Se elimina la firma antigua dentro de esta misma transacción
-- y se crea la nueva con target_receiver_id DEFAULT NULL.
--
-- LIVE normal:
--     target_receiver_id se ignora y receptor = host.
--
-- Battle ACTIVE:
--     target_receiver_id es obligatorio y debe ser LEFT/RIGHT.
-- ------------------------------------------------------------

drop function if exists public.send_live_gift(uuid, text);

create function public.send_live_gift(
    target_room_id uuid,
    target_gift_code text,
    target_receiver_id uuid default null
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
    resolved_receiver_id uuid;

    sender_wallet_id uuid;
    creator_wallet_id uuid;

    current_sender_balance numeric(18,2);

    selected_gift public.live_gift_catalog%rowtype;

    active_battle public.live_battles%rowtype;

    new_gift_id uuid := gen_random_uuid();

    calculated_creator_earnings numeric(18,2);
    calculated_platform_share numeric(18,2);

    updated_energy bigint;

    battle_score_delta numeric(18,2);
    battle_side text;
begin
    -- --------------------------------------------------------
    -- Sesión / argumentos
    -- --------------------------------------------------------

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

    -- --------------------------------------------------------
    -- Sala LIVE válida + lock
    -- --------------------------------------------------------

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

    -- --------------------------------------------------------
    -- Resolver Battle ACTIVE de la sala.
    -- El índice parcial UNIQUE garantiza como máximo una.
    -- --------------------------------------------------------

    select battle.*
    into active_battle
    from public.live_battles battle
    where battle.room_id = target_room_id
      and battle.status = 'active'
    for update;

    if found then
        if target_receiver_id is null then
            raise exception
                'Selecciona a qué creador de la Battle enviar el regalo.';
        end if;

        if target_receiver_id = active_battle.left_creator_id then
            resolved_receiver_id :=
                active_battle.left_creator_id;

            battle_side := 'left';

        elsif target_receiver_id =
              active_battle.right_creator_id then

            resolved_receiver_id :=
                active_battle.right_creator_id;

            battle_side := 'right';

        else
            raise exception
                'El destinatario no pertenece a la Battle activa.';
        end if;
    else
        -- En un LIVE normal el receptor sigue siendo el host.
        resolved_receiver_id := host_user_id;
        battle_side := null;
    end if;

    -- --------------------------------------------------------
    -- Anti self-gift contra el RECEPTOR REAL.
    -- --------------------------------------------------------

    if resolved_receiver_id = current_user_id then
        raise exception
            'El creador no puede enviarse regalos a sí mismo.';
    end if;

    -- --------------------------------------------------------
    -- Catálogo Gift
    -- --------------------------------------------------------

    select *
    into selected_gift
    from public.live_gift_catalog
    where code = lower(trim(target_gift_code))
      and active = true;

    if not found then
        raise exception
            'El regalo seleccionado no está disponible.';
    end if;

    -- --------------------------------------------------------
    -- Garantizar Wallet sender + receiver
    -- --------------------------------------------------------

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
        resolved_receiver_id
    )
    on conflict (user_id)
    do nothing;

    -- --------------------------------------------------------
    -- Locks Wallet
    -- --------------------------------------------------------

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
    where wallets.user_id = resolved_receiver_id
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

    -- --------------------------------------------------------
    -- Economía
    -- --------------------------------------------------------

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

    -- --------------------------------------------------------
    -- Gift real
    -- --------------------------------------------------------

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
        resolved_receiver_id,
        selected_gift.code,
        selected_gift.price
    );

    -- --------------------------------------------------------
    -- Wallet transactions
    -- --------------------------------------------------------

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

    -- --------------------------------------------------------
    -- LIVE counters / statistics
    -- --------------------------------------------------------

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

    -- --------------------------------------------------------
    -- LIVE Energy global
    -- --------------------------------------------------------

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

    -- --------------------------------------------------------
    -- BATTLE AUTHORITY
    --
    -- Misma fórmula actual de BattleGiftEngine con:
    -- quantity = 1
    -- intelligenceMultiplier = 1
    --
    -- score =
    -- round(price * 100 + energy_value)
    -- --------------------------------------------------------

    if active_battle.id is not null then
        battle_score_delta :=
            round(
                selected_gift.price * 100
                + selected_gift.energy_value
            );

        -- Garantía defensiva: el marcador debe existir.
        insert into public.live_battle_scores (
            battle_id
        )
        values (
            active_battle.id
        )
        on conflict (battle_id)
        do nothing;

        if battle_side = 'left' then
            update public.live_battle_scores
            set
                left_score =
                    left_score
                    + battle_score_delta,

                left_energy =
                    left_energy
                    + selected_gift.energy_value,

                left_gift_count =
                    left_gift_count + 1,

                last_gift_id =
                    new_gift_id
            where battle_id = active_battle.id;

        elsif battle_side = 'right' then
            update public.live_battle_scores
            set
                right_score =
                    right_score
                    + battle_score_delta,

                right_energy =
                    right_energy
                    + selected_gift.energy_value,

                right_gift_count =
                    right_gift_count + 1,

                last_gift_id =
                    new_gift_id
            where battle_id = active_battle.id;
        end if;

        insert into public.live_battle_events (
            battle_id,
            room_id,
            event_type,
            actor_user_id,
            target_user_id,
            gift_id,
            score_delta,
            energy_delta,
            payload
        )
        values (
            active_battle.id,
            target_room_id,
            'gift',
            current_user_id,
            resolved_receiver_id,
            new_gift_id,
            battle_score_delta,
            selected_gift.energy_value,
            jsonb_build_object(
                'gift_code',
                selected_gift.code,
                'gift_name',
                selected_gift.name,
                'gift_icon',
                selected_gift.icon,
                'gift_value',
                selected_gift.price,
                'side',
                battle_side,
                'quantity',
                1,
                'intelligence_multiplier',
                1
            )
        );
    end if;

    -- --------------------------------------------------------
    -- Realtime Gift
    -- --------------------------------------------------------

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
            'receiver_id',
            resolved_receiver_id,
            'battle_id',
            active_battle.id,
            'battle_side',
            battle_side,
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

    -- --------------------------------------------------------
    -- Resultado
    -- --------------------------------------------------------

    return query
    select
        new_gift_id,
        target_room_id,
        current_user_id,
        resolved_receiver_id,
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
-- Permisos
-- ------------------------------------------------------------

revoke all
on function public.send_live_gift(uuid, text, uuid)
from public;

grant execute
on function public.send_live_gift(uuid, text, uuid)
to authenticated;

commit;