begin;

create table if not exists public.post_vault (

    id uuid primary key
        default gen_random_uuid(),

    post_id uuid not null
        references public.posts(id)
        on delete cascade,

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    created_at timestamptz
        not null default now(),

    unique(post_id, user_id)
);

create index if not exists idx_post_vault_post
on public.post_vault(post_id);

create index if not exists idx_post_vault_user
on public.post_vault(user_id, created_at desc);

alter table public.post_vault
enable row level security;

drop policy if exists
    "Users can view own vault"
on public.post_vault;

create policy
    "Users can view own vault"
on public.post_vault
for select
to authenticated
using (
    auth.uid() = user_id
);

drop policy if exists
    "Users can save posts to own vault"
on public.post_vault;

create policy
    "Users can save posts to own vault"
on public.post_vault
for insert
to authenticated
with check (
    auth.uid() = user_id
);

drop policy if exists
    "Users can remove posts from own vault"
on public.post_vault;

create policy
    "Users can remove posts from own vault"
on public.post_vault
for delete
to authenticated
using (
    auth.uid() = user_id
);

grant usage on schema public
to authenticated;

grant select, insert, delete
on table public.post_vault
to authenticated;

commit;
