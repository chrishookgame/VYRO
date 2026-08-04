create table if not exists public.academy_courses (
    id uuid primary key default gen_random_uuid(),
    creator_id uuid references public.profiles(id) on delete set null,
    title text not null,
    description text,
    level text not null default 'beginner',
    status text not null default 'draft',
    price numeric(18,2) not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.academy_lessons (
    id uuid primary key default gen_random_uuid(),
    course_id uuid not null references public.academy_courses(id) on delete cascade,
    title text not null,
    content text,
    video_url text,
    position integer not null default 0,
    created_at timestamptz not null default now()
);

create table if not exists public.academy_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    course_id uuid not null references public.academy_courses(id) on delete cascade,
    progress integer not null default 0 check (progress between 0 and 100),
    completed_at timestamptz,
    updated_at timestamptz not null default now(),
    unique(user_id, course_id)
);

create table if not exists public.academy_certificates (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    course_id uuid not null references public.academy_courses(id) on delete cascade,
    verification_code text unique not null,
    issued_at timestamptz not null default now(),
    revoked_at timestamptz
);

create index if not exists idx_academy_progress_user
on public.academy_progress(user_id);
