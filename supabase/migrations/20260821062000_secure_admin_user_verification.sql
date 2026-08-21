begin;

create or replace function public.is_vyro_user_manager()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
    select exists (
        select 1
        from public.profiles
        where profiles.id = auth.uid()
          and profiles.role in (
              'super_admin',
              'admin'
          )
    );
$$;

revoke all
on function public.is_vyro_user_manager()
from public;

grant execute
on function public.is_vyro_user_manager()
to authenticated;

create table if not exists public.admin_audit_logs (
    id uuid primary key default gen_random_uuid(),
    admin_id uuid not null,
    action text not null,
    target_id uuid not null,
    details text not null,
    created_at timestamptz not null default now()
);

alter table public.admin_audit_logs
enable row level security;

revoke all
on table public.admin_audit_logs
from public;

revoke all
on table public.admin_audit_logs
from anon;

revoke all
on table public.admin_audit_logs
from authenticated;

grant select
on table public.admin_audit_logs
to authenticated;

drop policy if exists admin_audit_logs_select
on public.admin_audit_logs;

create policy admin_audit_logs_select
on public.admin_audit_logs
for select
to authenticated
using (
    public.is_vyro_user_manager()
);

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
begin
    v_actor_id := auth.uid();

    if v_actor_id is null then
        raise exception 'Authentication required.';
    end if;

    if not public.is_vyro_user_manager() then
        raise exception 'Permission denied.';
    end if;

    if p_user_id is null then
        raise exception 'User id is required.';
    end if;

    return query
    update public.profiles profile
    set verified = p_verified
    where profile.id = p_user_id
    returning
        profile.id,
        profile.verified;

    if not found then
        raise exception 'User not found.';
    end if;

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
            when p_verified then 'User verification enabled.'
            else 'User verification disabled.'
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