-- ============================================================
-- VYRO START LIVE BATTLE ROUND RPC
-- Sprint 220.6
-- ============================================================

begin;

create or replace function public.start_live_battle_round(
    p_series_id uuid,
    p_battle_id uuid
)
returns table (
    series_id uuid,
    battle_id uuid,
    battle_status public.live_battle_status,
    started_at timestamptz,
    ends_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_user_id uuid;

    v_series public.live_battle_series%rowtype;
    v_battle public.live_battles%rowtype;

    v_started_at timestamptz;
    v_ends_at timestamptz;
begin
    v_user_id := auth.uid();

    if v_user_id is null then
        raise exception
            'Debes iniciar sesión para comenzar una batalla.';
    end if;

    if p_series_id is null then
        raise exception
            'El identificador de la Battle Series es obligatorio.';
    end if;

    if p_battle_id is null then
        raise exception
            'El identificador de la batalla es obligatorio.';
    end if;

    -- --------------------------------------------------------
    -- Bloquear la serie para evitar inicios simultáneos
    -- --------------------------------------------------------

    select *
    into v_series
    from public.live_battle_series
    where id = p_series_id
    for update;

    if not found then
        raise exception
            'La Battle Series no existe.';
    end if;

    if v_user_id <> v_series.created_by
       and v_user_id <> v_series.left_creator_id
       and v_user_id <> v_series.right_creator_id then
        raise exception
            'No tienes permiso para iniciar esta batalla.';
    end if;

    if v_series.status in (
        'finished',
        'cancelled'
    ) then
        raise exception
            'La Battle Series ya terminó o fue cancelada.';
    end if;

    -- --------------------------------------------------------
    -- Bloquear y validar la batalla
    -- --------------------------------------------------------

    select *
    into v_battle
    from public.live_battles
    where id = p_battle_id
      and series_id = p_series_id
    for update;

    if not found then
        raise exception
            'La batalla no pertenece a esta Battle Series.';
    end if;

    if v_battle.series_position
       <> v_series.current_position then
        raise exception
            'La batalla indicada no es la ronda actual.';
    end if;

    if v_battle.status = 'active' then
        return query
        select
            p_series_id,
            p_battle_id,
            v_battle.status,
            v_battle.started_at,
            v_battle.ends_at;

        return;
    end if;

    if v_battle.status not in (
        'scheduled',
        'waiting'
    ) then
        raise exception
            'La batalla no puede iniciarse desde su estado actual.';
    end if;

    if v_battle.scheduled_at is not null
       and v_battle.scheduled_at > now() then
        raise exception
            'La batalla todavía no ha llegado a su hora programada.';
    end if;

    if v_battle.duration_seconds <= 0 then
        raise exception
            'La duración de la batalla no es válida.';
    end if;

    v_started_at := now();

    v_ends_at :=
        v_started_at +
        make_interval(
            secs =>
                v_battle.duration_seconds
        );

    -- --------------------------------------------------------
    -- Activar la batalla
    -- --------------------------------------------------------

    update public.live_battles
    set
        status = 'active',
        started_at = v_started_at,
        ends_at = v_ends_at,
        finished_at = null,
        winner_id = null
    where id = p_battle_id;

    -- --------------------------------------------------------
    -- Activar la Battle Series
    -- --------------------------------------------------------

    update public.live_battle_series
    set
        status = 'active',
        started_at = coalesce(
            started_at,
            v_started_at
        ),
        next_battle_at = null
    where id = p_series_id;

    -- --------------------------------------------------------
    -- Registrar el evento de inicio
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
        p_battle_id,
        v_series.room_id,
        'started',
        v_user_id,
        case
            when v_user_id =
                 v_series.left_creator_id
                then v_series.right_creator_id
            else v_series.left_creator_id
        end,
        jsonb_build_object(
            'seriesId',
                p_series_id,
            'seriesPosition',
                v_series.current_position,
            'startedAt',
                v_started_at,
            'endsAt',
                v_ends_at,
            'durationSeconds',
                v_battle.duration_seconds
        )
    );

    return query
    select
        p_series_id,
        p_battle_id,
        'active'::public.live_battle_status,
        v_started_at,
        v_ends_at;
end;
$$;

-- ------------------------------------------------------------
-- Permisos
-- ------------------------------------------------------------

revoke all
on function public.start_live_battle_round(
    uuid,
    uuid
)
from public;

grant execute
on function public.start_live_battle_round(
    uuid,
    uuid
)
to authenticated;

commit;
