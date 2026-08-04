-- ============================================================
-- VYRO 3090
-- Sprint 210.4 - VYRO Day & Birthday Engine Foundation
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Datos privados de cumpleaños en el perfil
-- ------------------------------------------------------------

alter table public.profiles
add column if not exists birth_date date;

alter table public.profiles
add column if not exists timezone text not null default 'UTC';

alter table public.profiles
add column if not exists birthday_visibility text not null default 'private';

alter table public.profiles
add column if not exists birthday_greetings_enabled boolean not null default true;

alter table public.profiles
add column if not exists birthday_live_experience_enabled boolean not null default true;

alter table public.profiles
add column if not exists birthday_gifts_enabled boolean not null default true;

-- Valores permitidos de privacidad
do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'profiles_birthday_visibility_check'
    ) then
        alter table public.profiles
        add constraint profiles_birthday_visibility_check
        check (
            birthday_visibility in (
                'private',
                'friends',
                'followers',
                'public'
            )
        );
    end if;
end;
$$;

-- Valida la fecha de nacimiento dinámicamente.
-- Se usa un trigger porque current_date cambia con el tiempo.
create or replace function public.validate_profile_birth_date()
returns trigger
language plpgsql
security invoker
set search_path = public
as $
begin
    if new.birth_date is not null then
        if new.birth_date < date '1900-01-01' then
            raise exception 'La fecha de nacimiento no puede ser anterior a 1900-01-01.';
        end if;

        if new.birth_date > current_date then
            raise exception 'La fecha de nacimiento no puede estar en el futuro.';
        end if;
    end if;

    return new;
end;
$;

drop trigger if exists trg_profiles_validate_birth_date
on public.profiles;

create trigger trg_profiles_validate_birth_date
before insert or update of birth_date
on public.profiles
for each row
execute function public.validate_profile_birth_date();

-- ------------------------------------------------------------
-- Registro anual de celebraciones enviadas
-- Evita felicitar varias veces a la misma persona en el mismo año.
-- ------------------------------------------------------------

create table if not exists public.vyro_day_deliveries (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    celebration_year integer not null
        check (celebration_year between 2000 and 4000),
    delivery_type text not null default 'notification'
        check (
            delivery_type in (
                'notification',
                'profile_effect',
                'live_effect',
                'gift_unlock',
                'email'
            )
        ),
    status text not null default 'pending'
        check (
            status in (
                'pending',
                'processing',
                'delivered',
                'failed',
                'cancelled'
            )
        ),
    scheduled_for timestamptz not null,
    delivered_at timestamptz,
    error_message text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, celebration_year, delivery_type)
);

create index if not exists idx_vyro_day_deliveries_pending
on public.vyro_day_deliveries(status, scheduled_for)
where status in ('pending', 'processing');

create index if not exists idx_vyro_day_deliveries_user
on public.vyro_day_deliveries(user_id, celebration_year desc);

-- ------------------------------------------------------------
-- Configuración administrable de la experiencia VYRO Day
-- ------------------------------------------------------------

create table if not exists public.vyro_day_settings (
    id uuid primary key default gen_random_uuid(),
    setting_key text not null unique,
    setting_value jsonb not null default '{}'::jsonb,
    enabled boolean not null default true,
    description text,
    updated_by uuid references public.profiles(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

insert into public.vyro_day_settings (
    setting_key,
    setting_value,
    enabled,
    description
)
values
(
    'global_experience',
    '{
        "notification_title": "Feliz VYRO Day",
        "notification_message": "Hoy el Universo VYRO celebra contigo.",
        "profile_confetti": true,
        "birthday_badge": "VYRO Birthday Star",
        "live_banner": true,
        "gift_collection": true
    }'::jsonb,
    true,
    'Configuración mundial de la experiencia anual VYRO Day.'
)
on conflict (setting_key) do nothing;

-- ------------------------------------------------------------
-- updated_at
-- ------------------------------------------------------------

drop trigger if exists trg_vyro_day_deliveries_updated_at
on public.vyro_day_deliveries;

create trigger trg_vyro_day_deliveries_updated_at
before update on public.vyro_day_deliveries
for each row
execute function public.set_live_updated_at();

drop trigger if exists trg_vyro_day_settings_updated_at
on public.vyro_day_settings;

create trigger trg_vyro_day_settings_updated_at
before update on public.vyro_day_settings
for each row
execute function public.set_live_updated_at();

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------

alter table public.vyro_day_deliveries enable row level security;
alter table public.vyro_day_settings enable row level security;

drop policy if exists "Users can view own VYRO Day deliveries"
on public.vyro_day_deliveries;

create policy "Users can view own VYRO Day deliveries"
on public.vyro_day_deliveries
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Authenticated users can view enabled VYRO Day settings"
on public.vyro_day_settings;

create policy "Authenticated users can view enabled VYRO Day settings"
on public.vyro_day_settings
for select
to authenticated
using (enabled = true);

commit;
