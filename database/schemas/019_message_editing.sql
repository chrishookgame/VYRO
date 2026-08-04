alter table public.direct_messages
add column if not exists updated_at timestamptz
not null default now();

create or replace function public.set_direct_message_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_direct_messages_updated_at
on public.direct_messages;

create trigger trg_direct_messages_updated_at
before update on public.direct_messages
for each row
execute function public.set_direct_message_updated_at();

drop policy if exists
    "Users can edit own messages"
on public.direct_messages;

create policy
    "Users can edit own messages"
on public.direct_messages
for update
to authenticated
using (
    sender_id = auth.uid()
)
with check (
    sender_id = auth.uid()
);

grant update
on public.direct_messages
to authenticated;
