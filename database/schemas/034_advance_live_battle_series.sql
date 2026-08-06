-- ============================================================
-- VYRO ADVANCE LIVE BATTLE SERIES RPC
-- Sprint 219.3
-- ============================================================

begin;

create or replace function public.advance_live_battle_series(
    p_series_id uuid,
    p_battle_id uuid
)
returns table (
    series_id uuid,
    finished_battle_id uuid,
    next_battle_id uuid,
    series_status public.live_battle_series_status,
    series_winner_id uuid
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_user_id uuid;

    v_series public.live_battle_series%rowtype;
    v_battle public.live_battles%rowtype;
    v_scores public.live_battle_scores%rowtype;

    v_round_winner_id uuid;
    v_series_winner_id uuid;

    v_left_wins integer;
    v_right_wins integer;
    v_draws integer;

    v_next_position integer;
    v_next_battle_id uuid;
    v_next_battle_at timestamptz;

    v_next_battle_status public.live_battle_status;
    v_next_event_type text;
begin
    v_user_id := auth.uid();

    if v_user_id is null then
        raise exception
            'Debes iniciar sesión para avanzar una Battle Series.';
    end if;

    if p_series_id is null then
        raise exception
            'El identificador de la Battle Series es obligatorio.';
    end if;

    if p_battle_id is null then
        raise exception
            'El identificador de la batalla es obligatorio.';
    end if;

    -- Bloquear la serie para impedir avances simultáneos.

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
            'No tienes permiso para avanzar esta Battle Series.';
    end if;

    if v_series.status in (
        'finished',
        'cancelled'
    ) then
        raise exception
            'La Battle Series ya terminó o fue cancelada.';
    end if;

    -- Bloquear la batalla actual.

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
            'La batalla indicada no es la ronda actual de la serie.';
    end if;

    if v_battle.status = 'finished' then
        raise exception
            'Esta batalla ya fue finalizada.';
    end if;

    if v_battle.status = 'cancelled' then
        raise exception
            'No se puede avanzar una batalla cancelada.';
    end if;

    select *
    into v_scores
    from public.live_battle_scores
    where battle_id = p_battle_id
    for update;

    if not found then
        raise exception
            'La batalla no tiene un marcador inicial.';
    end if;

    -- --------------------------------------------------------
    -- Determinar ganador de la ronda
    -- --------------------------------------------------------

    if v_scores.left_score > v_scores.right_score then
        v_round_winner_id :=
            v_series.left_creator_id;

        v_left_wins :=
            v_series.left_wins + 1;

        v_right_wins :=
            v_series.right_wins;

        v_draws :=
            v_series.draws;

    elsif v_scores.right_score > v_scores.left_score then
        v_round_winner_id :=
            v_series.right_creator_id;

        v_left_wins :=
            v_series.left_wins;

        v_right_wins :=
            v_series.right_wins + 1;

        v_draws :=
            v_series.draws;

    else
        v_round_winner_id := null;

        v_left_wins :=
            v_series.left_wins;

        v_right_wins :=
            v_series.right_wins;

        v_draws :=
            v_series.draws + 1;
    end if;

    -- --------------------------------------------------------
    -- Finalizar la batalla actual
    -- --------------------------------------------------------

    update public.live_battles
    set
        status = 'finished',
        winner_id = v_round_winner_id,
        finished_at = now(),
        ends_at = coalesce(
            ends_at,
            now()
        )
    where id = p_battle_id;

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
        'finished',
        v_user_id,
        v_round_winner_id,
        jsonb_build_object(
            'seriesId',
                p_series_id,
            'seriesPosition',
                v_series.current_position,
            'leftScore',
                v_scores.left_score,
            'rightScore',
                v_scores.right_score,
            'winnerId',
                v_round_winner_id
        )
    );

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
        case
            when v_round_winner_id is null
                then 'draw'
            else 'winner'
        end,
        v_user_id,
        v_round_winner_id,
        jsonb_build_object(
            'seriesId',
                p_series_id,
            'seriesPosition',
                v_series.current_position,
            'leftWins',
                v_left_wins,
            'rightWins',
                v_right_wins,
            'draws',
                v_draws
        )
    );

    -- --------------------------------------------------------
    -- Finalizar la serie cuando no quedan rondas
    -- --------------------------------------------------------

    if v_series.current_position
       >= v_series.total_battles then

        if v_left_wins > v_right_wins then
            v_series_winner_id :=
                v_series.left_creator_id;

        elsif v_right_wins > v_left_wins then
            v_series_winner_id :=
                v_series.right_creator_id;

        else
            v_series_winner_id := null;
        end if;

        update public.live_battle_series
        set
            status = 'finished',
            left_wins = v_left_wins,
            right_wins = v_right_wins,
            draws = v_draws,
            winner_id = v_series_winner_id,
            next_battle_at = null,
            finished_at = now()
        where id = p_series_id;

        return query
        select
            p_series_id,
            p_battle_id,
            null::uuid,
            'finished'::public.live_battle_series_status,
            v_series_winner_id;

        return;
    end if;

    -- --------------------------------------------------------
    -- Preparar la siguiente ronda
    -- --------------------------------------------------------

    v_next_position :=
        v_series.current_position + 1;

    v_next_battle_at :=
        now() +
        make_interval(
            secs =>
                v_series.break_duration_seconds
        );

    if v_series.break_duration_seconds > 0 then
        v_next_battle_status := 'scheduled';
        v_next_event_type := 'scheduled';
    else
        v_next_battle_status := 'waiting';
        v_next_event_type := 'waiting';
    end if;

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
        v_series.room_id,
        v_series.left_creator_id,
        v_series.right_creator_id,
        v_next_battle_status,
        'series',
        v_series.battle_duration_seconds,
        case
            when v_next_battle_status = 'scheduled'
                then v_next_battle_at
            else null
        end,
        p_series_id,
        v_next_position,
        v_series.auto_start_next,
        v_series.break_duration_seconds,
        v_series.created_by
    )
    returning id
    into v_next_battle_id;

    insert into public.live_battle_scores (
        battle_id
    )
    values (
        v_next_battle_id
    );

    insert into public.live_battle_events (
        battle_id,
        room_id,
        event_type,
        actor_user_id,
        target_user_id,
        payload
    )
    values (
        v_next_battle_id,
        v_series.room_id,
        v_next_event_type,
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
                v_next_position,
            'previousBattleId',
                p_battle_id,
            'nextBattleAt',
                v_next_battle_at,
            'leftWins',
                v_left_wins,
            'rightWins',
                v_right_wins,
            'draws',
                v_draws
        )
    );

    update public.live_battle_series
    set
        status = case
            when v_series.break_duration_seconds > 0
                then 'intermission'
                    ::public.live_battle_series_status
            else 'active'
                    ::public.live_battle_series_status
        end,
        current_position = v_next_position,
        left_wins = v_left_wins,
        right_wins = v_right_wins,
        draws = v_draws,
        next_battle_at = case
            when v_series.break_duration_seconds > 0
                then v_next_battle_at
            else null
        end
    where id = p_series_id;

    return query
    select
        p_series_id,
        p_battle_id,
        v_next_battle_id,
        case
            when v_series.break_duration_seconds > 0
                then 'intermission'
                    ::public.live_battle_series_status
            else 'active'
                    ::public.live_battle_series_status
        end,
        null::uuid;
end;
$$;

-- ------------------------------------------------------------
-- Permisos
-- ------------------------------------------------------------

revoke all
on function public.advance_live_battle_series(
    uuid,
    uuid
)
from public;

grant execute
on function public.advance_live_battle_series(
    uuid,
    uuid
)
to authenticated;

commit;
