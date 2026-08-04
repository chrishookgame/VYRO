create table if not exists public.live_rooms (
    id uuid primary key default gen_random_uuid(),
    host_id uuid not null references public.profiles(id) on delete cascade,
    title text not null,
    description text,
    status text not null default 'scheduled',
    stream_key text unique,
    started_at timestamptz,
    ended_at timestamptz,
    created_at timestamptz not null default now()
);

create table if not exists public.live_messages (
    id uuid primary key default gen_random_uuid(),
    room_id uuid not null references public.live_rooms(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    message text not null,
    created_at timestamptz not null default now()
);

create table if not exists public.live_gifts (
    id uuid primary key default gen_random_uuid(),
    room_id uuid not null references public.live_rooms(id) on delete cascade,
    sender_id uuid not null references public.profiles(id),
    receiver_id uuid not null references public.profiles(id),
    gift_type text not null,
    amount numeric(18,2) not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_live_rooms_host
on public.live_rooms(host_id);

create index if not exists idx_live_messages_room
on public.live_messages(room_id, created_at);
