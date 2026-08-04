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
