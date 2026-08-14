-- ============================================================
-- VYRO 048 - LIVE GUEST STAGE CONTROL
-- Waiting Room + Stage admission
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Estado de escenario separado del estado de invitacion
-- ------------------------------------------------------------

alter table public.live_guest_invitations
add column if not exists stage_status text
not null default 'waiting';

alter table public.live_guest_invitations
add column if not exists staged_at timestamptz;

alter table public.live_guest_invitations
add column if not exists unstaged_at timestamptz;

-- ------------------------------------------------------------
-- Constraint
-- ------------------------------------------------------------

alter table public.live_guest_invitations
drop constraint if exists live_guest_invitations_stage_status_check;

alter table public.live_guest_invitations
add constraint live_guest_invitations_stage_status_check
check (
    stage_status in (
        'waiting',
        'on_stage'
    )
);

-- ------------------------------------------------------------
-- Indice para Waiting Room / Stage
-- ------------------------------------------------------------

create index if not exists
idx_live_guest_invitations_room_stage
on public.live_guest_invitations (
    room_id,
    stage_status,
    created_at desc
);

-- ------------------------------------------------------------
-- HOST: subir invitado al Stage
-- ------------------------------------------------------------

create or replace function public.put_live_guest_on_stage(
    target_invitation_id uuid
)
returns public.live_guest_invitations
language plpgsql
security definer
set search_path = public
as $$
declare
    current_user_id uuid := auth.uid();
    invitation public.live_guest_invitations;
begin
    if current_user_id is null then
        raise exception 'Debes iniciar sesion.';
    end if;

    select *
    into invitation
    from public.live_guest_invitations
    where id = target_invitation_id
    for update;

    if invitation.id is null then
        raise exception 'Invitacion Guest no encontrada.';
    end if;

    if invitation.status <> 'accepted' then
        raise exception 'El Guest debe haber aceptado la invitacion.';
    end if;

    if not exists (
        select 1
        from public.live_rooms room
        where room.id = invitation.room_id
          and room.host_id = current_user_id
    ) then
        raise exception 'Solo el creador puede subir este Guest al Stage.';
    end if;

    update public.live_guest_invitations
    set
        stage_status = 'on_stage',
        staged_at = now(),
        unstaged_at = null,
        updated_at = now()
    where id = target_invitation_id
    returning *
    into invitation;

    return invitation;
end;
$$;

-- ------------------------------------------------------------
-- HOST: bajar invitado a Waiting Room
-- ------------------------------------------------------------

create or replace function public.return_live_guest_to_waiting(
    target_invitation_id uuid
)
returns public.live_guest_invitations
language plpgsql
security definer
set search_path = public
as $$
declare
    current_user_id uuid := auth.uid();
    invitation public.live_guest_invitations;
begin
    if current_user_id is null then
        raise exception 'Debes iniciar sesion.';
    end if;

    select *
    into invitation
    from public.live_guest_invitations
    where id = target_invitation_id
    for update;

    if invitation.id is null then
        raise exception 'Invitacion Guest no encontrada.';
    end if;

    if invitation.status <> 'accepted' then
        raise exception 'El Guest no tiene acceso activo.';
    end if;

    if not exists (
        select 1
        from public.live_rooms room
        where room.id = invitation.room_id
          and room.host_id = current_user_id
    ) then
        raise exception 'Solo el creador puede bajar este Guest del Stage.';
    end if;

    update public.live_guest_invitations
    set
        stage_status = 'waiting',
        unstaged_at = now(),
        updated_at = now()
    where id = target_invitation_id
    returning *
    into invitation;

    return invitation;
end;
$$;

-- ------------------------------------------------------------
-- Permisos RPC
-- ------------------------------------------------------------

revoke all
on function public.put_live_guest_on_stage(uuid)
from public;

revoke all
on function public.return_live_guest_to_waiting(uuid)
from public;

grant execute
on function public.put_live_guest_on_stage(uuid)
to authenticated;

grant execute
on function public.return_live_guest_to_waiting(uuid)
to authenticated;

commit;