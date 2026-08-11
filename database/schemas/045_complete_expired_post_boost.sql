-- ============================================================
-- VYRO 045 - COMPLETE EXPIRED POST BOOST
-- ============================================================

create or replace function public.complete_expired_post_boost(
    target_post_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    current_user_id uuid := auth.uid();
    updated_count integer := 0;
begin
    if current_user_id is null then
        raise exception 'Debes iniciar sesión.';
    end if;

    if target_post_id is null then
        raise exception 'La publicación es obligatoria.';
    end if;

    update public.post_boost_campaigns
    set status = 'completed'
    where post_id = target_post_id
      and user_id = current_user_id
      and status = 'active'
      and ends_at <= now();

    get diagnostics
        updated_count = row_count;

    return updated_count > 0;
end;
$$;

revoke all
on function public.complete_expired_post_boost(uuid)
from public;

grant execute
on function public.complete_expired_post_boost(uuid)
to authenticated;
