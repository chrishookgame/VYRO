-- ============================================================
-- VYRO 3090
-- Sprint 210.5 - Platform Moments & Faith Moments
-- Mensajes oficiales, transparentes y administrables para LIVE.
-- ============================================================

begin;

create table if not exists public.platform_moments (
    id uuid primary key default gen_random_uuid(),

    internal_name text not null unique,
    moment_type text not null default 'platform'
        check (
            moment_type in (
                'platform',
                'faith',
                'world_event',
                'celebration',
                'safety',
                'campaign'
            )
        ),

    title text not null,
    message text not null,
    locale text not null default 'en',

    official_label text not null default 'Official VYRO message',

    action_label text,
    action_url text,

    display_style text not null default 'banner'
        check (
            display_style in (
                'banner',
                'toast',
                'overlay',
                'card'
            )
        ),

    frequency_minutes integer not null default 30
        check (frequency_minutes between 5 and 1440),

    duration_seconds integer not null default 8
        check (duration_seconds between 3 and 60),

    dismissible boolean not null default true,
    enabled boolean not null default true,

    starts_at timestamptz,
    ends_at timestamptz,

    countries text[] not null default '{}',
    live_categories text[] not null default '{}',

    priority integer not null default 100
        check (priority between 1 and 1000),

    metadata jsonb not null default '{}'::jsonb,

    created_by uuid references public.profiles(id) on delete set null,
    updated_by uuid references public.profiles(id) on delete set null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    check (
        ends_at is null
        or starts_at is null
        or ends_at > starts_at
    )
);

create index if not exists idx_platform_moments_active
on public.platform_moments(enabled, starts_at, ends_at, priority);

create index if not exists idx_platform_moments_type_locale
on public.platform_moments(moment_type, locale);

create table if not exists public.platform_moment_impressions (
    id uuid primary key default gen_random_uuid(),

    moment_id uuid not null
        references public.platform_moments(id)
        on delete cascade,

    room_id uuid
        references public.live_rooms(id)
        on delete cascade,

    user_id uuid
        references public.profiles(id)
        on delete set null,

    impression_type text not null default 'shown'
        check (
            impression_type in (
                'shown',
                'dismissed',
                'clicked',
                'responded'
            )
        ),

    response_value text,

    created_at timestamptz not null default now()
);

create index if not exists idx_platform_moment_impressions_moment
on public.platform_moment_impressions(moment_id, created_at desc);

create index if not exists idx_platform_moment_impressions_room
on public.platform_moment_impressions(room_id, created_at desc);

insert into public.platform_moments (
    internal_name,
    moment_type,
    title,
    message,
    locale,
    official_label,
    display_style,
    frequency_minutes,
    duration_seconds,
    dismissible,
    enabled,
    priority,
    metadata
)
values
(
    'thank_you_jesus_en',
    'faith',
    'Thank You Jesus',
    'A moment of gratitude and hope from VYRO.',
    'en',
    'Official VYRO message',
    'banner',
    45,
    8,
    true,
    true,
    200,
    '{
        "responses": [
            "Amen",
            "Share hope"
        ],
        "transparent_source": true
    }'::jsonb
),
(
    'believe_in_jesus_en',
    'faith',
    'Do you believe in Jesus?',
    'You may respond, dismiss this message, or continue watching.',
    'en',
    'Official VYRO message',
    'card',
    60,
    10,
    true,
    true,
    190,
    '{
        "responses": [
            "I believe",
            "Amen",
            "Not now"
        ],
        "transparent_source": true
    }'::jsonb
)
on conflict do nothing;

drop trigger if exists trg_platform_moments_updated_at
on public.platform_moments;

create trigger trg_platform_moments_updated_at
before update on public.platform_moments
for each row
execute function public.set_live_updated_at();

alter table public.platform_moments enable row level security;
alter table public.platform_moment_impressions enable row level security;

drop policy if exists "Authenticated users can view active platform moments"
on public.platform_moments;

create policy "Authenticated users can view active platform moments"
on public.platform_moments
for select
to authenticated
using (
    enabled = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
);

drop policy if exists "Users can create own platform moment impressions"
on public.platform_moment_impressions;

create policy "Users can create own platform moment impressions"
on public.platform_moment_impressions
for insert
to authenticated
with check (
    user_id is null
    or auth.uid() = user_id
);

drop policy if exists "Users can view own platform moment impressions"
on public.platform_moment_impressions;

create policy "Users can view own platform moment impressions"
on public.platform_moment_impressions
for select
to authenticated
using (auth.uid() = user_id);

commit;
