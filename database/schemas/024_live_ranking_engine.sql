-- ============================================================
-- VYRO 3090
-- Sprint 210.6 - Live Ranking Engine
-- ============================================================

begin;

create table if not exists public.live_ranking_scores (
    id uuid primary key default gen_random_uuid(),

    room_id uuid not null
        references public.live_rooms(id)
        on delete cascade,

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    ranking_type text not null
        check (
            ranking_type in (
                'gifter',
                'energy',
                'viewer',
                'creator'
            )
        ),

    ranking_period text not null
        check (
            ranking_period in (
                'live',
                'daily',
                'weekly',
                'monthly',
                'all_time'
            )
        ),

    score numeric(20,2) not null default 0
        check (score >= 0),

    gifts_sent bigint not null default 0
        check (gifts_sent >= 0),

    gift_value numeric(18,2) not null default 0
        check (gift_value >= 0),

    energy_contributed bigint not null default 0
        check (energy_contributed >= 0),

    watch_seconds bigint not null default 0
        check (watch_seconds >= 0),

    reactions_sent bigint not null default 0
        check (reactions_sent >= 0),

    period_started_at timestamptz not null,
    period_ended_at timestamptz,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    unique (
        room_id,
        user_id,
        ranking_type,
        ranking_period,
        period_started_at
    ),

    check (
        period_ended_at is null
        or period_ended_at > period_started_at
    )
);

create index if not exists idx_live_ranking_room_type_score
on public.live_ranking_scores (
    room_id,
    ranking_type,
    ranking_period,
    score desc
);

create index if not exists idx_live_ranking_user
on public.live_ranking_scores (
    user_id,
    ranking_period,
    score desc
);

create index if not exists idx_live_ranking_period
on public.live_ranking_scores (
    ranking_period,
    period_started_at desc
);

create table if not exists public.live_ranking_records (
    id uuid primary key default gen_random_uuid(),

    room_id uuid
        references public.live_rooms(id)
        on delete cascade,

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    record_type text not null
        check (
            record_type in (
                'top_gifter',
                'energy_legend',
                'viewer_streak',
                'reaction_master',
                'creator_peak'
            )
        ),

    record_name text not null,
    record_value numeric(20,2) not null default 0
        check (record_value >= 0),

    achieved_at timestamptz not null default now(),
    expires_at timestamptz,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),

    check (
        expires_at is null
        or expires_at > achieved_at
    )
);

create index if not exists idx_live_ranking_records_user
on public.live_ranking_records (
    user_id,
    achieved_at desc
);

create index if not exists idx_live_ranking_records_type
on public.live_ranking_records (
    record_type,
    record_value desc
);

drop trigger if exists trg_live_ranking_scores_updated_at
on public.live_ranking_scores;

create trigger trg_live_ranking_scores_updated_at
before update on public.live_ranking_scores
for each row
execute function public.set_live_updated_at();

alter table public.live_ranking_scores
enable row level security;

alter table public.live_ranking_records
enable row level security;

drop policy if exists
"Authenticated users can view live rankings"
on public.live_ranking_scores;

create policy
"Authenticated users can view live rankings"
on public.live_ranking_scores
for select
to authenticated
using (true);

drop policy if exists
"Users can view live ranking records"
on public.live_ranking_records;

create policy
"Users can view live ranking records"
on public.live_ranking_records
for select
to authenticated
using (true);

commit;
