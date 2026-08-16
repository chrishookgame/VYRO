-- ============================================================
-- VYRO 3090
-- Sprint 212.4 - LIVE Presence RPC
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Entrar en una sala LIVE
-- ------------------------------------------------------------

create or replace function public.join_live_room(
    target_room_id uuid
)
returns table (
    room_id uuid,
    active_viewers integer,
    peak_viewers integer,
    total_joins bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
    current_user_id uuid := auth.uid();
    previous_room_id uuid;
    already_joined boolean := false;
begin
    if current_user_id is null then
        raise exception
            'Debes iniciar sesión para entrar a una sala LIVE.';
    end if;

    if target_room_id is null then
        raise exception
            'La sala LIVE es obligatoria.';
    end if;

    if not exists (
        select 1
        from public.live_rooms
        where id = target_room_id
          and status in (
              'live',
              'active'
          )
    ) then
        raise exception
            'La sala LIVE no existe o no está activa.';
    end if;

    perform pg_advisory_xact_lock(
        hashtext(current_user_id::text)
    );

    select
        current_room_id,
        (
            current_room_id = target_room_id
            and status in (
                'online',
                'live'
            )
        )
    into
        previous_room_id,
        already_joined
    from public.live_presence
    where user_id = current_user_id
    for update;

    if previous_room_id is not null
       and previous_room_id <> target_room_id then

        update public.live_room_counters as counters
        set active_viewers =
            greatest(
                counters.active_viewers - 1,
                0
            )
        where counters.room_id =
            previous_room_id;

        insert into public.live_presence_events (
            user_id,
            room_id,
            event_type,
            metadata
        )
        values (
            current_user_id,
            previous_room_id,
            'left_room',
            jsonb_build_object(
                'reason',
                'room_changed'
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
            previous_room_id,
            current_user_id,
            'viewer_left',
            'presence',
            jsonb_build_object(
                'reason',
                'room_changed'
            )
        );
    end if;

    insert into public.live_presence (
        user_id,
        status,
        current_room_id,
        last_seen_at,
        connected_at,
        disconnected_at,
        metadata
    )
    values (
        current_user_id,
        'online',
        target_room_id,
        now(),
        now(),
        null,
        jsonb_build_object(
            'source',
            'live_watch'
        )
    )
    on conflict (user_id)
    do update set
        status = 'online',
        current_room_id = excluded.current_room_id,
        last_seen_at = now(),
        connected_at = case
            when public.live_presence.current_room_id
                is distinct from excluded.current_room_id
            then now()
            else public.live_presence.connected_at
        end,
        disconnected_at = null,
        metadata =
            public.live_presence.metadata
            || excluded.metadata;

    if not already_joined then
        insert into public.live_room_counters (
            room_id,
            active_viewers,
            peak_viewers,
            total_joins
        )
        values (
            target_room_id,
            1,
            1,
            1
        )
        on conflict on constraint live_room_counters_pkey
        do update set
            active_viewers =
                public.live_room_counters.active_viewers + 1,
            peak_viewers =
                greatest(
                    public.live_room_counters.peak_viewers,
                    public.live_room_counters.active_viewers + 1
                ),
            total_joins =
                public.live_room_counters.total_joins + 1;

        insert into public.live_presence_events (
            user_id,
            room_id,
            event_type,
            metadata
        )
        values (
            current_user_id,
            target_room_id,
            'joined_room',
            jsonb_build_object(
                'source',
                'live_watch'
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
            'viewer_joined',
            'presence',
            jsonb_build_object(
                'source',
                'live_watch'
            )
        );
    end if;

    return query
    select
        counters.room_id,
        counters.active_viewers,
        counters.peak_viewers,
        counters.total_joins
    from public.live_room_counters as counters
    where counters.room_id = target_room_id;
end;
$$;

-- ------------------------------------------------------------
-- Salir de una sala LIVE
-- ------------------------------------------------------------

create or replace function public.leave_live_room(
    target_room_id uuid
)
returns table (
    room_id uuid,
    active_viewers integer,
    peak_viewers integer,
    total_joins bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
    current_user_id uuid := auth.uid();
    current_presence_room_id uuid;
begin
    if current_user_id is null then
        raise exception
            'Debes iniciar sesión para salir de una sala LIVE.';
    end if;

    if target_room_id is null then
        raise exception
            'La sala LIVE es obligatoria.';
    end if;

    perform pg_advisory_xact_lock(
        hashtext(current_user_id::text)
    );

    select current_room_id
    into current_presence_room_id
    from public.live_presence
    where user_id = current_user_id
    for update;

    if current_presence_room_id is distinct from target_room_id then
        return query
        select
            counters.room_id,
            counters.active_viewers,
            counters.peak_viewers,
            counters.total_joins
        from public.live_room_counters as counters
        where counters.room_id = target_room_id;

        return;
    end if;

    update public.live_presence
    set
        status = 'online',
        current_room_id = null,
        last_seen_at = now(),
        disconnected_at = now(),
        metadata =
            metadata
            || jsonb_build_object(
                'last_live_room_id',
                target_room_id
            )
    where user_id = current_user_id;

    update public.live_room_counters as counters
    set active_viewers =
        greatest(
            counters.active_viewers - 1,
            0
        )
    where counters.room_id =
        target_room_id;

    insert into public.live_presence_events (
        user_id,
        room_id,
        event_type,
        metadata
    )
    values (
        current_user_id,
        target_room_id,
        'left_room',
        jsonb_build_object(
            'source',
            'live_watch'
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
        'viewer_left',
        'presence',
        jsonb_build_object(
            'source',
            'live_watch'
        )
    );

    return query
    select
        counters.room_id,
        counters.active_viewers,
        counters.peak_viewers,
        counters.total_joins
    from public.live_room_counters as counters
    where counters.room_id = target_room_id;
end;
$$;

-- ------------------------------------------------------------
-- Permisos RPC
-- ------------------------------------------------------------

revoke all
on function public.join_live_room(uuid)
from public;

revoke all
on function public.leave_live_room(uuid)
from public;

grant execute
on function public.join_live_room(uuid)
to authenticated;

grant execute
on function public.leave_live_room(uuid)
to authenticated;

commit;
