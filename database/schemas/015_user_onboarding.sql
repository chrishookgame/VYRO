create or replace function public.handle_new_vyro_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    new_username text;
    new_referral_code text;
begin
    new_username :=
        coalesce(
            nullif(
                trim(
                    new.raw_user_meta_data
                        ->> 'username'
                ),
                ''
            ),
            split_part(new.email, '@', 1),
            'vyro_user'
        );

    new_referral_code :=
        upper(
            substring(
                replace(
                    new.id::text,
                    '-',
                    ''
                )
                from 1 for 10
            )
        );

    insert into public.profiles (
        id,
        username,
        full_name,
        bio,
        avatar_url,
        referral_code,
        role,
        verified
    )
    values (
        new.id,
        new_username,
        new_username,
        '',
        '',
        new_referral_code,
        'user',
        false
    )
    on conflict (id) do nothing;

    insert into public.wallets (
        user_id,
        available_balance,
        pending_balance,
        lifetime_earnings,
        lifetime_withdrawals
    )
    values (
        new.id,
        0,
        0,
        0,
        0
    )
    on conflict (user_id) do nothing;

    insert into public.notifications (
        user_id,
        title,
        message,
        type,
        action_url
    )
    values (
        new.id,
        'Bienvenido a VYRO',
        'Tu cuenta, perfil y wallet fueron creados correctamente.',
        'success',
        '/dashboard'
    );

    return new;
end;
$$;

drop trigger if exists
    on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_vyro_user();
