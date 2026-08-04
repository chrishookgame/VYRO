create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),

    user_one_id uuid not null
        references public.profiles(id)
        on delete cascade,

    user_two_id uuid not null
        references public.profiles(id)
        on delete cascade,

    created_at timestamptz
        not null default now(),

    updated_at timestamptz
        not null default now(),

    check (
        user_one_id <> user_two_id
    ),

    check (
        user_one_id::text < user_two_id::text
    ),

    unique (
        user_one_id,
        user_two_id
    )
);

create table if not exists public.direct_messages (
    id uuid primary key default gen_random_uuid(),

    conversation_id uuid not null
        references public.conversations(id)
        on delete cascade,

    sender_id uuid not null
        references public.profiles(id)
        on delete cascade,

    content text not null
        check (
            char_length(trim(content))
            between 1 and 2000
        ),

    message_type text not null
        default 'text'
        check (
            message_type in (
                'text',
                'image',
                'video',
                'file'
            )
        ),

    media_url text,

    read_at timestamptz,

    created_at timestamptz
        not null default now()
);

create index if not exists
    idx_conversations_user_one
on public.conversations(user_one_id);

create index if not exists
    idx_conversations_user_two
on public.conversations(user_two_id);

create index if not exists
    idx_conversations_updated
on public.conversations(updated_at desc);

create index if not exists
    idx_direct_messages_conversation
on public.direct_messages(
    conversation_id,
    created_at asc
);

create index if not exists
    idx_direct_messages_sender
on public.direct_messages(sender_id);

create index if not exists
    idx_direct_messages_unread
on public.direct_messages(
    conversation_id,
    created_at desc
)
where read_at is null;

alter table public.conversations
enable row level security;

alter table public.direct_messages
enable row level security;

drop policy if exists
    "Participants can read conversations"
on public.conversations;

create policy
    "Participants can read conversations"
on public.conversations
for select
to authenticated
using (
    auth.uid() = user_one_id
    or auth.uid() = user_two_id
);

drop policy if exists
    "Users can create conversations"
on public.conversations;

create policy
    "Users can create conversations"
on public.conversations
for insert
to authenticated
with check (
    (
        auth.uid() = user_one_id
        or auth.uid() = user_two_id
    )
    and user_one_id <> user_two_id
    and user_one_id::text < user_two_id::text
);

drop policy if exists
    "Participants can update conversations"
on public.conversations;

create policy
    "Participants can update conversations"
on public.conversations
for update
to authenticated
using (
    auth.uid() = user_one_id
    or auth.uid() = user_two_id
)
with check (
    auth.uid() = user_one_id
    or auth.uid() = user_two_id
);

drop policy if exists
    "Participants can read messages"
on public.direct_messages;

create policy
    "Participants can read messages"
on public.direct_messages
for select
to authenticated
using (
    exists (
        select 1
        from public.conversations
        where conversations.id =
            direct_messages.conversation_id
          and (
              conversations.user_one_id =
                  auth.uid()
              or conversations.user_two_id =
                  auth.uid()
          )
    )
);

drop policy if exists
    "Participants can send messages"
on public.direct_messages;

create policy
    "Participants can send messages"
on public.direct_messages
for insert
to authenticated
with check (
    sender_id = auth.uid()
    and exists (
        select 1
        from public.conversations
        where conversations.id =
            direct_messages.conversation_id
          and (
              conversations.user_one_id =
                  auth.uid()
              or conversations.user_two_id =
                  auth.uid()
          )
    )
);

drop policy if exists
    "Participants can mark messages read"
on public.direct_messages;

create policy
    "Participants can mark messages read"
on public.direct_messages
for update
to authenticated
using (
    sender_id <> auth.uid()
    and exists (
        select 1
        from public.conversations
        where conversations.id =
            direct_messages.conversation_id
          and (
              conversations.user_one_id =
                  auth.uid()
              or conversations.user_two_id =
                  auth.uid()
          )
    )
)
with check (
    sender_id <> auth.uid()
);

drop policy if exists
    "Users can delete own messages"
on public.direct_messages;

create policy
    "Users can delete own messages"
on public.direct_messages
for delete
to authenticated
using (
    sender_id = auth.uid()
);

grant usage on schema public
to authenticated;

grant select, insert, update
on public.conversations
to authenticated;

grant select, insert, update, delete
on public.direct_messages
to authenticated;
