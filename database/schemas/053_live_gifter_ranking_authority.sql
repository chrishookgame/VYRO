begin;

create or replace function public.update_live_gifter_ranking_from_gift()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_period_started_at timestamptz;
begin
    select coalesce(
        live_rooms.started_at,
        live_rooms.created_at
    )
    into v_period_started_at
    from public.live_rooms
    where live_rooms.id = new.room_id;

    if v_period_started_at is null then
        raise exception
            'No se pudo resolver el periodo LIVE para el ranking.';
    end if;

    insert into public.live_ranking_scores (
        room_id,
        user_id,
        ranking_type,
        ranking_period,
        score,
        gifts_sent,
        gift_value,
        energy_contributed,
        watch_seconds,
        reactions_sent,
        period_started_at,
        period_ended_at
    )
    values (
        new.room_id,
        new.sender_id,
        'gifter',
        'live',
        (new.amount * 100) + 10,
        1,
        new.amount,
        0,
        0,
        0,
        v_period_started_at,
        null
    )
    on conflict (
        room_id,
        user_id,
        ranking_type,
        ranking_period,
        period_started_at
    )
    do update set
        gifts_sent =
            public.live_ranking_scores.gifts_sent + 1,

        gift_value =
            public.live_ranking_scores.gift_value
            + excluded.gift_value,

        score =
            (
                (
                    public.live_ranking_scores.gift_value
                    + excluded.gift_value
                ) * 100
            )
            +
            (
                (
                    public.live_ranking_scores.gifts_sent
                    + 1
                ) * 10
            );

    return new;
end;
$$;

drop trigger if exists
    trg_update_live_gifter_ranking_from_gift
on public.live_gifts;

create trigger trg_update_live_gifter_ranking_from_gift
after insert
on public.live_gifts
for each row
execute function public.update_live_gifter_ranking_from_gift();

commit;