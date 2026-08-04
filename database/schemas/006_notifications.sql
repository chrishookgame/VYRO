create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    title text not null,
    message text not null,
    type text not null default 'info',
    action_url text,
    metadata jsonb not null default '{}'::jsonb,
    read_at timestamptz,
    created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user
on public.notifications(user_id, created_at desc);

create index if not exists idx_notifications_unread
on public.notifications(user_id)
where read_at is null;
