-- ============================================================
-- VYRO MEMBER CARDS
-- Production-compatible persistent global member identity
-- ============================================================

create table if not exists public.member_cards (
    member_id text primary key,

    user_id uuid not null unique
        references public.profiles(id)
        on delete cascade,

    full_name text not null,
    username text not null,
    avatar_url text,

    level text not null default 'Starter',

    trust_score integer default 100,
    reputation integer default 0,
    verified boolean default false,

    joined_at timestamptz default now(),
    status text default 'active'
);

create unique index if not exists
    idx_member_cards_user_id
on public.member_cards(user_id);

-- ------------------------------------------------------------
-- Stable VYRO Member ID
-- ------------------------------------------------------------

create or replace function public.generate_vyro_member_id()
returns text
language plpgsql
set search_path = public
as $$
declare
    generated_id text;
begin
    loop
        generated_id :=
            'VYR-' ||
            extract(year from now())::text ||
            '-' ||
            upper(
                substring(
                    replace(
                        gen_random_uuid()::text,
                        '-',
                        ''
                    )
                    from 1 for 10
                )
            );

        exit when not exists (
            select 1
            from public.member_cards
            where member_id = generated_id
        );
    end loop;

    return generated_id;
end;
$$;

-- ------------------------------------------------------------
-- Automatically create Member Card for future profiles.
-- Compatible with the real production member_cards structure.
-- ------------------------------------------------------------

create or replace function public.handle_new_vyro_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.member_cards (
        member_id,
        user_id,
        full_name,
        username,
        avatar_url,
        level,
        trust_score,
        reputation,
        verified,
        joined_at,
        status
    )
    values (
        public.generate_vyro_member_id(),
        new.id,
        coalesce(
            nullif(btrim(new.full_name), ''),
            nullif(btrim(new.username), ''),
            'VYRO Member'
        ),
        coalesce(
            nullif(btrim(new.username), ''),
            nullif(btrim(new.full_name), ''),
            'vyro-member'
        ),
        new.avatar_url,
        'Starter',
        100,
        0,
        coalesce(new.verified, false),
        coalesce(new.created_at, now()),
        'active'
    )
    on conflict do nothing;

    return new;
end;
$$;

drop trigger if exists
    on_vyro_profile_created_member
on public.profiles;

create trigger on_vyro_profile_created_member
after insert on public.profiles
for each row
execute function public.handle_new_vyro_member();

-- ------------------------------------------------------------
-- Backfill existing profiles missing a Member Card.
-- ------------------------------------------------------------

insert into public.member_cards (
    member_id,
    user_id,
    full_name,
    username,
    avatar_url,
    level,
    trust_score,
    reputation,
    verified,
    joined_at,
    status
)
select
    public.generate_vyro_member_id(),
    p.id,
    coalesce(
        nullif(btrim(p.full_name), ''),
        nullif(btrim(p.username), ''),
        'VYRO Member'
    ),
    coalesce(
        nullif(btrim(p.username), ''),
        nullif(btrim(p.full_name), ''),
        'vyro-member'
    ),
    p.avatar_url,
    'Starter',
    100,
    0,
    coalesce(p.verified, false),
    coalesce(p.created_at, now()),
    'active'
from public.profiles p
where not exists (
    select 1
    from public.member_cards mc
    where mc.user_id = p.id
);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table public.member_cards
enable row level security;

drop policy if exists
    "member_cards_select_authenticated"
on public.member_cards;

create policy
    "member_cards_select_authenticated"
on public.member_cards
for select
to authenticated
using (true);

-- ------------------------------------------------------------
-- Member identity is platform-managed.
-- Direct authenticated UPDATE access is not granted.
-- ------------------------------------------------------------

drop policy if exists
    "member_cards_update_own"
on public.member_cards;