create table if not exists public.post_likes (

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

create index if not exists idx_post_likes_post
on public.post_likes(post_id);

create index if not exists idx_post_likes_user
on public.post_likes(user_id);
