begin;

revoke update
on table public.profiles
from anon;

revoke update
on table public.profiles
from authenticated;

grant update (
    username,
    full_name,
    bio,
    avatar_url
)
on table public.profiles
to authenticated;

commit;