-- VYRO LIVE presentation state persistence.
-- Mirrors the deployed public.live_rooms.presentation_state definition.

alter table public.live_rooms
    add column if not exists presentation_state jsonb;

alter table public.live_rooms
    alter column presentation_state
    set default
    '{
        "type": "vyro.presentation",
        "scene": "focus",
        "stage": {
            "layout": "auto",
            "enabled": false,
            "hostMode": "fullscreen",
            "maxGuests": 10
        },
        "sentAt": 0,
        "overlay": {
            "cta": "",
            "title": "",
            "eyebrow": "",
            "message": "",
            "visible": false
        },
        "version": 1,
        "freeCamera": {
            "x": 0,
            "y": 0,
            "zoom": 1,
            "enabled": false
        }
    }'::jsonb;

update public.live_rooms
set presentation_state =
    '{
        "type": "vyro.presentation",
        "scene": "focus",
        "stage": {
            "layout": "auto",
            "enabled": false,
            "hostMode": "fullscreen",
            "maxGuests": 10
        },
        "sentAt": 0,
        "overlay": {
            "cta": "",
            "title": "",
            "eyebrow": "",
            "message": "",
            "visible": false
        },
        "version": 1,
        "freeCamera": {
            "x": 0,
            "y": 0,
            "zoom": 1,
            "enabled": false
        }
    }'::jsonb
where presentation_state is null;

alter table public.live_rooms
    alter column presentation_state
    set not null;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname =
            'live_rooms_presentation_state_object'
          and conrelid =
            'public.live_rooms'::regclass
    ) then
        alter table public.live_rooms
            add constraint
                live_rooms_presentation_state_object
            check (
                jsonb_typeof(presentation_state) =
                'object'::text
            );
    end if;
end;
$$;
