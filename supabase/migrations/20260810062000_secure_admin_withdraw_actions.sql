begin;

create or replace function public.admin_list_withdraw_requests()
returns table (
    id uuid,
    user_id uuid,
    amount numeric,
    currency text,
    payment_method text,
    payment_account text,
    status text,
    admin_notes text,
    created_at timestamptz,
    approved_at timestamptz,
    rejected_at timestamptz,
    paid_at timestamptz,
    approved_by uuid,
    transaction_id text
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
    v_actor_id uuid;
    v_actor_role text;
begin
    v_actor_id := auth.uid();

    if v_actor_id is null then
        raise exception 'Authentication required.';
    end if;

    select profiles.role
    into v_actor_role
    from public.profiles
    where profiles.id = v_actor_id;

    if v_actor_role not in (
        'super_admin',
        'admin',
        'finance'
    ) then
        raise exception 'Permission denied.';
    end if;

    return query
    select
        wr.id,
        wr.user_id,
        wr.amount,
        wr.currency,
        wr.payment_method,
        wr.payment_account,
        wr.status,
        wr.admin_notes,
        wr.created_at,
        wr.approved_at,
        wr.rejected_at,
        wr.paid_at,
        wr.approved_by,
        wr.transaction_id
    from public.withdraw_requests wr
    order by wr.created_at desc;
end;
$$;

create or replace function public.admin_process_withdraw(
    p_withdraw_id uuid,
    p_action text
)
returns table (
    id uuid,
    status text,
    approved_at timestamptz,
    rejected_at timestamptz,
    paid_at timestamptz,
    approved_by uuid
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_actor_id uuid;
    v_actor_role text;
begin
    v_actor_id := auth.uid();

    if v_actor_id is null then
        raise exception 'Authentication required.';
    end if;

    select profiles.role
    into v_actor_role
    from public.profiles
    where profiles.id = v_actor_id;

    if v_actor_role is null then
        raise exception 'Administrative profile not found.';
    end if;

    if p_action in ('approve', 'reject') then
        if v_actor_role not in (
            'super_admin',
            'admin',
            'finance'
        ) then
            raise exception 'Permission denied.';
        end if;

        if p_action = 'approve' then
            return query
            update public.withdraw_requests wr
            set
                status = 'approved',
                approved_at = now(),
                rejected_at = null,
                paid_at = null,
                approved_by = v_actor_id
            where wr.id = p_withdraw_id
              and wr.status = 'pending'
            returning
                wr.id,
                wr.status,
                wr.approved_at,
                wr.rejected_at,
                wr.paid_at,
                wr.approved_by;

            if not found then
                raise exception
                    'Withdraw must exist and be pending.';
            end if;

            return;
        end if;

        return query
        update public.withdraw_requests wr
        set
            status = 'rejected',
            rejected_at = now(),
            approved_at = null,
            paid_at = null,
            approved_by = null
        where wr.id = p_withdraw_id
          and wr.status = 'pending'
        returning
            wr.id,
            wr.status,
            wr.approved_at,
            wr.rejected_at,
            wr.paid_at,
            wr.approved_by;

        if not found then
            raise exception
                'Withdraw must exist and be pending.';
        end if;

        return;
    end if;

    if p_action = 'pay' then
        if v_actor_role not in (
            'super_admin',
            'finance'
        ) then
            raise exception 'Permission denied.';
        end if;

        return query
        update public.withdraw_requests wr
        set
            status = 'paid',
            paid_at = now()
        where wr.id = p_withdraw_id
          and wr.status = 'approved'
        returning
            wr.id,
            wr.status,
            wr.approved_at,
            wr.rejected_at,
            wr.paid_at,
            wr.approved_by;

        if not found then
            raise exception
                'Withdraw must exist and be approved.';
        end if;

        return;
    end if;

    raise exception 'Unsupported withdraw action.';
end;
$$;

revoke all
on function public.admin_list_withdraw_requests()
from public;

revoke all
on function public.admin_process_withdraw(uuid, text)
from public;

grant execute
on function public.admin_list_withdraw_requests()
to authenticated;

grant execute
on function public.admin_process_withdraw(uuid, text)
to authenticated;

commit;
