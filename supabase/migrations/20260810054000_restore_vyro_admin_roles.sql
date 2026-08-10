begin;

create or replace function public.is_vyro_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles
        where profiles.id = auth.uid()
          and profiles.role in (
              'super_admin',
              'admin',
              'support',
              'finance'
          )
    );
$$;

revoke all
on function public.is_vyro_admin()
from public;

grant execute
on function public.is_vyro_admin()
to authenticated;

commit;