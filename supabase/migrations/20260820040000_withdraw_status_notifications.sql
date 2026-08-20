-- ======================================================
-- VYRO - WITHDRAW STATUS NOTIFICATIONS
-- ======================================================

create or replace function public.notify_withdraw_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_title text;
  v_message text;
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  case new.status
    when 'approved' then
      v_title := 'Retiro aprobado';
      v_message :=
        'Tu solicitud de retiro fue aprobada.';

    when 'rejected' then
      v_title := 'Retiro rechazado';
      v_message :=
        'Tu solicitud de retiro fue rechazada.';

    when 'paid' then
      v_title := 'Retiro pagado';
      v_message :=
        'Tu retiro fue marcado como pagado.';

    else
      return new;
  end case;

  insert into public.notifications (
    user_id,
    title,
    message,
    type,
    action_url,
    metadata
  )
  values (
    new.user_id,
    v_title,
    v_message,
    'withdraw',
    '/account',
    jsonb_build_object(
      'withdraw_id', new.id,
      'status', new.status,
      'amount', new.amount,
      'currency', new.currency
    )
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_withdraw_status
on public.withdraw_requests;

create trigger trg_notify_withdraw_status
after update of status
on public.withdraw_requests
for each row
when (
  old.status is distinct from new.status
)
execute function public.notify_withdraw_status();
