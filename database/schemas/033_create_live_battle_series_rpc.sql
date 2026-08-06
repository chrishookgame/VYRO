-- ============================================================
-- VYRO CREATE LIVE BATTLE SERIES RPC
-- Sprint 219.2
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Impedir más de una serie activa por sala
-- ------------------------------------------------------------

create unique index if not exists
idx_live_battle_series_one_active_per_room
on public.live_battle_series (room_id)
where status in (
    'scheduled',
    'waiting',
    'active',
    'intermission'
);

-- Una invitación aceptada solo puede originar una serie.

create unique index if not exists
idx_live_battle_series_unique_invitation
on public.live_battle_series (invitation_id)
where invitation_id is not null;

-- ------------------------------------------------------------
-- RPC transaccional
-- ------------------------------------------------------------

create or replace function public.create_live_battle_series(
    p_room_id uuid,
    p_left_creator_id uuid,
    p_right_creator_id uuid,
    p_invitation_id uuid default null,
    p_total_battles integer default 1,
    p_battle_duration_seconds integer default 180,
    p_break_duration_seconds integer default 60,
    p_auto_start_next boolean default true,
    p_scheduled_at timestamptz default null
)
returns table (
    series_id uuid,
    battle_id uuid
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_user_id uuid;
    v_series_id uuid;
    v_battle_id uuid;
    v_series_status public.live_battle_series_status;
    v_battle_status public.live_battle_status;
    v_event_type text;
begin
    v_user_id := auth.uid();

    if v_user_id is null then
        raise exception
            'Debes iniciar sesión para crear una Battle Series.';
    end if;

    if p_room_id is null then
        raise exception
            'La sala LIVE es obligatoria.';
    end if;

    if p_left_creator_id is null
       or p_right_creator_id is null then
        raise exception
            'Los dos creadores son obligatorios.';
    end if;

    if p_left_creator_id = p_right_creator_id then
        raise exception
            'Una Battle Series necesita dos creadores diferentes.';
    end if;

    if v_user_id <> p_left_creator_id
       and v_user_id <> p_right_creator_id then
        raise exception
            'Solo un participante puede crear la Battle Series.';
    end if;

    if p_total_battles <= 0 then
        raise exception
            'La cantidad de batallas debe ser mayor que cero.';
    end if;

    if p_battle_duration_seconds <= 0 then
        raise exception
            'La duración de cada batalla debe ser mayor que cero.';
    end if;

    if p_break_duration_seconds < 0 then
        raise exception
            'El descanso no puede ser negativo.';
    end if;

    if not exists (
        select 1
        from public.live_rooms room
        where room.id = p_room_id
          and room.host_id = v_user_id
    ) then
        raise exception
            'Solo el anfitrión puede crear una serie en esta sala LIVE.';
    end if;

    -- Bloquea la sala durante esta transacción para evitar
    -- creaciones simultáneas.
    perform pg_advisory_xact_lock(
        hashtextextended(
            p_room_id::text,
            0
        )
    );

    if exists (
        select 1
        from public.live_battle_series battle_series
        where battle_series.room_id = p_room_id
          and battle_series.status in (
              'scheduled',
              'waiting',
              'active',
              'intermission'
          )
    ) then
        raise exception
            'Esta sala ya tiene una Battle Series activa.';
    end if;

    if p_invitation_id is not null then
        if not exists (
            select 1
            from public.live_battle_invitations invitation
            where invitation.id = p_invitation_id
              and invitation.room_id = p_room_id
              and invitation.status = 'accepted'
              and (
                  (
                      invitation.sender_id = p_left_creator_id
                      and invitation.receiver_id = p_right_creator_id
                  )
                  or
                  (
                      invitation.sender_id = p_right_creator_id
                      and invitation.receiver_id = p_left_creator_id
                  )
              )
        ) then
            raise exception
                'La invitación no es válida, no está aceptada o no corresponde a estos creadores.';
        end if;
    end if;

    if p_scheduled_at is not null
       and p_scheduled_at > now() then
        v_series_status := 'scheduled';
        v_battle_status := 'scheduled';
        v_event_type := 'scheduled';
    else
        v_series_status := 'waiting';
        v_battle_status := 'waiting';
        v_event_type := 'waiting';
    end if;

    -- --------------------------------------------------------
    -- Crear la serie
    -- --------------------------------------------------------

    insert into public.live_battle_series (
        room_id,
        left_creator_id,
        right_creator_id,
        created_by,
        invitation_id,
        status,
        total_battles,
        battle_duration_seconds,
        break_duration_seconds,
        auto_start_next,
        current_position,
        left_wins,
        right_wins,
        draws,
        scheduled_at,
        next_battle_at
    )
    values (
        p_room_id,
        p_left_creator_id,
        p_right_creator_id,
        v_user_id,
        p_invitation_id,
        v_series_status,
        p_total_battles,
        p_battle_duration_seconds,
        p_break_duration_seconds,
        p_auto_start_next,
        1,
        0,
        0,
        0,
        p_scheduled_at,
        case
            when v_series_status = 'scheduled'
                then p_scheduled_at
            else null
        end
    )
    returning id
    into v_series_id;

    -- --------------------------------------------------------
    -- Crear la primera batalla
    -- --------------------------------------------------------

    insert into public.live_battles (
        room_id,
        left_creator_id,
        right_creator_id,
        status,
        mode,
        duration_seconds,
        scheduled_at,
        series_id,
        series_position,
        auto_start_next,
        break_duration_seconds,
        created_by
    )
    values (
        p_room_id,
        p_left_creator_id,
        p_right_creator_id,
        v_battle_status,
        'series',
        p_battle_duration_seconds,
        p_scheduled_at,
        v_series_id,
        1,
        p_auto_start_next,
        p_break_duration_seconds,
        v_user_id
    )
    returning id
    into v_battle_id;

    -- --------------------------------------------------------
    -- Crear marcador inicial
    -- --------------------------------------------------------

    insert into public.live_battle_scores (
        battle_id
    )
    values (
        v_battle_id
    );

    -- --------------------------------------------------------
    -- Registrar evento inicial
    -- --------------------------------------------------------

    insert into public.live_battle_events (
        battle_id,
        room_id,
        event_type,
        actor_user_id,
        target_user_id,
        payload
    )
    values (
        v_battle_id,
        p_room_id,
        v_event_type,
        v_user_id,
        case
            when v_user_id = p_left_creator_id
                then p_right_creator_id
            else p_left_creator_id
        end,
        jsonb_build_object(
            'seriesId', v_series_id,
            'seriesPosition', 1,
            'totalBattles', p_total_battles,
            'battleDurationSeconds',
                p_battle_duration_seconds,
            'breakDurationSeconds',
                p_break_duration_seconds,
            'autoStartNext',
                p_auto_start_next
        )
    );

    return query
    select
        v_series_id,
        v_battle_id;
end;
$$;

-- ------------------------------------------------------------
-- Permisos
-- ------------------------------------------------------------

revoke all
on function public.create_live_battle_series(
    uuid,
    uuid,
    uuid,
    uuid,
    integer,
    integer,
    integer,
    boolean,
    timestamptz
)
from public;

grant execute
on function public.create_live_battle_series(
    uuid,
    uuid,
    uuid,
    uuid,
    integer,
    integer,
    integer,
    boolean,
    timestamptz
)
to authenticated;

commit;
