begin;

create or replace function public.admin_set_user_verified(
    p_user_id uuid,
    p_verified boolean
)
returns table (
    id uuid,
    verified boolean
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_actor_id uuid;
    v_actor_role text;
    v_target_role text;
begin
    v_actor_id := auth.uid();

    if v_actor_id is null then
        raise exception 'Authentication required.';
    end if;

    if not public.is_vyro_user_manager() then
        raise exception 'Permission denied.';
    end if;

    select profile.role
    into v_actor_role
    from public.profiles profile
    where profile.id = v_actor_id;

    if v_actor_role not in (
        'super_admin',
        'admin'
    ) then
        raise exception 'Permission denied.';
    end if;

    if p_user_id is null then
        raise exception 'User id is required.';
    end if;

    select profile.role
    into v_target_role
    from public.profiles profile
    where profile.id = p_user_id
    for update;

    if not found then
        raise exception 'User not found.';
    end if;

    if
        v_actor_role = 'admin'
        and v_target_role in (
            'admin',
            'super_admin'
        )
    then
        raise exception 'Permission denied for administrative target.';
    end if;

    return query
    update public.profiles profile
    set verified = p_verified
    where profile.id = p_user_id
    returning
        profile.id,
        profile.verified;

    insert into public.admin_audit_logs (
        admin_id,
        action,
        target_id,
        details
    )
    values (
        v_actor_id,
        'verify_user',
        p_user_id,
        case
            when p_verified then
                'User verification enabled.'
            else
                'User verification disabled.'
        end
    );
end;
$$;

revoke all
on function public.admin_set_user_verified(uuid, boolean)
from public;

grant execute
on function public.admin_set_user_verified(uuid, boolean)
to authenticated;

commit;
