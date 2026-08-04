create extension if not exists pgcrypto;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,

    username text unique not null,
    full_name text,
    bio text,
    avatar_url text,

    referral_code text unique,

    role text not null default 'user',

    verified boolean not null default false,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_username
on public.profiles(username);

create index if not exists idx_profiles_role
on public.profiles(role);

create table if not exists public.wallets (

    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    available_balance numeric(18,2)
        not null default 0,

    pending_balance numeric(18,2)
        not null default 0,

    lifetime_earnings numeric(18,2)
        not null default 0,

    lifetime_withdrawals numeric(18,2)
        not null default 0,

    created_at timestamptz
        not null default now(),

    updated_at timestamptz
        not null default now(),

    unique(user_id)
);

create index if not exists idx_wallet_user
on public.wallets(user_id);

create table if not exists public.wallet_transactions (

    id uuid primary key default gen_random_uuid(),

    wallet_id uuid
        not null references public.wallets(id)
        on delete cascade,

    type text not null,

    amount numeric(18,2)
        not null,

    description text,

    reference text,

    created_at timestamptz
        not null default now()
);

create index if not exists idx_wallet_transactions_wallet
on public.wallet_transactions(wallet_id);

create index if not exists idx_wallet_transactions_date
on public.wallet_transactions(created_at desc);

create table if not exists public.withdraw_requests (

    id uuid primary key default gen_random_uuid(),

    wallet_id uuid
        not null references public.wallets(id)
        on delete cascade,

    amount numeric(18,2)
        not null,

    method text
        not null,

    destination text
        not null,

    status text
        not null default 'pending',

    admin_notes text,

    processed_by uuid
        references public.profiles(id),

    requested_at timestamptz
        not null default now(),

    processed_at timestamptz
);

create index if not exists idx_withdraw_status
on public.withdraw_requests(status);

create index if not exists idx_withdraw_wallet
on public.withdraw_requests(wallet_id);

create table if not exists public.support_tickets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    assigned_admin_id uuid references public.profiles(id),
    subject text not null,
    category text not null default 'general',
    priority text not null default 'normal',
    status text not null default 'open',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    closed_at timestamptz
);

create table if not exists public.support_messages (
    id uuid primary key default gen_random_uuid(),
    ticket_id uuid not null references public.support_tickets(id) on delete cascade,
    sender_id uuid not null references public.profiles(id) on delete cascade,
    message text not null,
    read_at timestamptz,
    created_at timestamptz not null default now()
);

create table if not exists public.support_attachments (
    id uuid primary key default gen_random_uuid(),
    ticket_id uuid not null references public.support_tickets(id) on delete cascade,
    message_id uuid references public.support_messages(id) on delete cascade,
    uploaded_by uuid not null references public.profiles(id),
    file_name text not null,
    file_url text not null,
    mime_type text,
    file_size bigint,
    created_at timestamptz not null default now()
);

create index if not exists idx_support_tickets_user
on public.support_tickets(user_id);

create index if not exists idx_support_tickets_status
on public.support_tickets(status);

create index if not exists idx_support_messages_ticket
on public.support_messages(ticket_id, created_at);

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

create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    seller_id uuid not null references public.profiles(id) on delete cascade,
    title text not null,
    description text,
    price numeric(18,2) not null,
    status text not null default 'draft',
    stock integer,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    buyer_id uuid not null references public.profiles(id),
    status text not null default 'pending',
    subtotal numeric(18,2) not null default 0,
    commission numeric(18,2) not null default 0,
    total numeric(18,2) not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid not null references public.products(id),
    seller_id uuid not null references public.profiles(id),
    quantity integer not null default 1,
    unit_price numeric(18,2) not null,
    total numeric(18,2) not null
);

create index if not exists idx_products_seller
on public.products(seller_id);

create index if not exists idx_orders_buyer
on public.orders(buyer_id, created_at desc);

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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists wallets_set_updated_at on public.wallets;
create trigger wallets_set_updated_at
before update on public.wallets
for each row execute function public.set_updated_at();

drop trigger if exists support_tickets_set_updated_at on public.support_tickets;
create trigger support_tickets_set_updated_at
before update on public.support_tickets
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists videos_set_updated_at on public.videos;
create trigger videos_set_updated_at
before update on public.videos
for each row execute function public.set_updated_at();

