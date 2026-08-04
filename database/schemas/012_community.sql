create table if not exists public.followers (
    follower_id uuid not null references public.profiles(id) on delete cascade,
    following_id uuid not null references public.profiles(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (follower_id, following_id),
    check (follower_id <> following_id)
);

create table if not exists public.likes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    video_id uuid not null references public.videos(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique(user_id, video_id)
);

create table if not exists public.comments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    video_id uuid not null references public.videos(id) on delete cascade,
    parent_id uuid references public.comments(id) on delete cascade,
    content text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_followers_following
on public.followers(following_id);

create index if not exists idx_comments_video
on public.comments(video_id, created_at desc);
