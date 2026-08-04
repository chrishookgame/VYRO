create table if not exists public.ai_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    module text not null,
    provider text,
    model text,
    prompt text not null,
    status text not null default 'pending',
    tokens_used integer not null default 0,
    cost numeric(18,6) not null default 0,
    created_at timestamptz not null default now(),
    completed_at timestamptz
);

create table if not exists public.ai_generations (
    id uuid primary key default gen_random_uuid(),
    request_id uuid not null references public.ai_requests(id) on delete cascade,
    output_type text not null,
    content text,
    asset_url text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists idx_ai_requests_user
on public.ai_requests(user_id, created_at desc);

create index if not exists idx_ai_requests_module
on public.ai_requests(module);
