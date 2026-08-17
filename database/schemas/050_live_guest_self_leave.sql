-- ============================================================
-- VYRO 050 - LIVE GUEST SELF LEAVE
-- Guest voluntarily leaves Stage and returns to Waiting Room
-- ============================================================

begin;

create or replace function public.leave_live_guest_stage(
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

    if invitation.guest_id <> current_user_id then
        raise exception 'Solo este Guest puede salir voluntariamente del Stage.';
    end if;

    if invitation.stage_status <> 'on_stage' then
        raise exception 'El Guest no esta actualmente en el Stage.';
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

revoke all
on function public.leave_live_guest_stage(uuid)
from public;

grant execute
on function public.leave_live_guest_stage(uuid)
to authenticated;

commit;
