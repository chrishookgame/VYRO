-- ======================================================
-- VYRO - MESSAGE NOTIFICATIONS
-- ======================================================

create or replace function public.notify_direct_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recipient_id uuid;
begin
  select
    case
      when c.user_one_id = new.sender_id
        then c.user_two_id
      when c.user_two_id = new.sender_id
        then c.user_one_id
      else null
    end
  into v_recipient_id
  from public.conversations c
  where c.id = new.conversation_id;

  if v_recipient_id is null then
    return new;
  end if;

  insert into public.notifications (
    user_id,
    actor_id,
    title,
    message,
    type,
    action_url,
    metadata
  )
  values (
    v_recipient_id,
    new.sender_id,
    'Nuevo mensaje',
    'Tienes un nuevo mensaje privado.',
    'message',
    '/messages',
    jsonb_build_object(
      'conversation_id', new.conversation_id,
      'message_id', new.id
    )
  );

  return new;
end;
$$;

revoke all
on function public.notify_direct_message()
from public;

drop trigger if exists trg_notify_direct_message
on public.direct_messages;

create trigger trg_notify_direct_message
after insert
on public.direct_messages
for each row
execute function public.notify_direct_message();