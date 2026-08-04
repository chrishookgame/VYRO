create table if not exists public.post_comments (

    id uuid primary key
        default gen_random_uuid(),

    post_id uuid not null
        references public.posts(id)
        on delete cascade,

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    content text not null
        check (
            char_length(trim(content)) between 1 and 500
        ),

    created_at timestamptz
        not null default now()
);

create index if not exists idx_post_comments_post
on public.post_comments(post_id, created_at desc);

create index if not exists idx_post_comments_user
on public.post_comments(user_id, created_at desc);

alter table public.post_comments
enable row level security;

drop policy if exists
    "Comments are readable"
on public.post_comments;

create policy
    "Comments are readable"
on public.post_comments
for select
to authenticated
using (true);

drop policy if exists
    "Users can create own comments"
on public.post_comments;

create policy
    "Users can create own comments"
on public.post_comments
for insert
to authenticated
with check (
    auth.uid() = user_id
);

drop policy if exists
    "Users can delete own comments"
on public.post_comments;

create policy
    "Users can delete own comments"
on public.post_comments
for delete
to authenticated
using (
    auth.uid() = user_id
);

grant usage on schema public
to authenticated;

grant select, insert, delete
on table public.post_comments
to authenticated;
