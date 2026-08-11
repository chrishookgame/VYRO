-- ============================================================
-- VYRO PROFILE -> MEMBER CARD IDENTITY SYNC
-- Keeps platform-managed Member Card identity synchronized
-- with the canonical public.profiles identity.
-- ============================================================

create or replace function public.sync_vyro_member_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.member_cards
    set
        full_name = coalesce(
            nullif(btrim(new.full_name), ''),
            nullif(btrim(new.username), ''),
            'VYRO Member'
        ),
        username = coalesce(
            nullif(btrim(new.username), ''),
            nullif(btrim(new.full_name), ''),
            'vyro-member'
        ),
        avatar_url = new.avatar_url
    where user_id = new.id;

    return new;
end;
$$;

drop trigger if exists
    on_vyro_profile_identity_updated
on public.profiles;

create trigger on_vyro_profile_identity_updated
after update of full_name, username, avatar_url
on public.profiles
for each row
when (
    old.full_name is distinct from new.full_name
    or old.username is distinct from new.username
    or old.avatar_url is distinct from new.avatar_url
)
execute function public.sync_vyro_member_identity();
