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
