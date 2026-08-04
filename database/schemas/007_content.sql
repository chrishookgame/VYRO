create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    title text not null,
    description text,
    status text not null default 'draft',
    visibility text not null default 'private',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.videos (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete set null,
    user_id uuid not null references public.profiles(id) on delete cascade,
    title text not null,
    description text,
    video_url text not null,
    thumbnail_url text,
    visibility text not null default 'public',
    views bigint not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    project_id uuid references public.projects(id) on delete cascade,
    file_name text not null,
    file_url text not null,
    mime_type text,
    file_size bigint,
    created_at timestamptz not null default now()
);

create index if not exists idx_projects_user
on public.projects(user_id);

create index if not exists idx_videos_user
on public.videos(user_id);

create index if not exists idx_videos_created
on public.videos(created_at desc);
