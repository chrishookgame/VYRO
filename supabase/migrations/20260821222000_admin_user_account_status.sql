begin;

alter table public.profiles
add column if not exists account_status text;

update public.profiles
set account_status = 'active'
where account_status is null;

alter table public.profiles
alter column account_status set default 'active';

alter table public.profiles
alter column account_status set not null;

alter table public.profiles
drop constraint if exists profiles_account_status_check;

alter table public.profiles
add constraint profiles_account_status_check
check (
    account_status in (
        'active',
        'suspended',
        'blocked'
    )
);

create or replace function public.admin_set_user_status(
    p_user_id uuid,
    p_status text
)
returns table (
    id uuid,
    account_status text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_actor_id uuid;
    v_actor_role text;
    v_target_role text;
    v_previous_status text;
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

    if p_status is null then
        raise exception 'Status is required.';
    end if;

    if p_status not in (
        'active',
        'suspended',
        'blocked'
    ) then
        raise exception 'Unsupported account status.';
    end if;

    select
        profile.account_status,
        profile.role
    into
        v_previous_status,
        v_target_role
    from public.profiles profile
    where profile.id = p_user_id
    for update;

    if not found then
        raise exception 'User not found.';
    end if;

    if p_user_id = v_actor_id then
        raise exception 'You cannot change your own account status.';
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

    update public.profiles profile
    set
        account_status = p_status,
        updated_at = now()
    where profile.id = p_user_id;

    insert into public.admin_audit_logs (
        admin_id,
        action,
        target_id,
        details
    )
    values (
        v_actor_id,
        case p_status
            when 'suspended' then 'suspend_user'
            when 'blocked' then 'block_user'
            else 'restore_user'
        end,
        p_user_id,
        'Account status changed from ' ||
        v_previous_status ||
        ' to ' ||
        p_status ||
        '.'
    );

    return query
    select
        profile.id,
        profile.account_status
    from public.profiles profile
    where profile.id = p_user_id;
end;
$$;

revoke all
on function public.admin_set_user_status(uuid, text)
from public;

grant execute
on function public.admin_set_user_status(uuid, text)
to authenticated;

commit;