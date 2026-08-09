-- ============================================================
-- VYRO
-- AI distributed rate limiting
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Rate-limit buckets
-- ------------------------------------------------------------

create table if not exists public.ai_rate_limits (
    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    window_started_at timestamptz not null,

    request_count integer not null
        default 0
        check (request_count >= 0),

    updated_at timestamptz not null
        default now(),

    primary key (
        user_id,
        window_started_at
    )
);

create index if not exists
idx_ai_rate_limits_updated_at
on public.ai_rate_limits(updated_at);

alter table public.ai_rate_limits
enable row level security;

-- No direct table access is required by clients.
-- The RPC below is the only supported access path.

revoke all
on table public.ai_rate_limits
from public;

revoke all
on table public.ai_rate_limits
from anon;

revoke all
on table public.ai_rate_limits
from authenticated;

-- ------------------------------------------------------------
-- Atomic rate-limit consumption
--
-- Contract:
--   20 requests / 60 seconds / authenticated user
--
-- Returns:
--   allowed
--   remaining
--   retry_after_seconds
-- ------------------------------------------------------------

create or replace function public.consume_ai_rate_limit()
returns table (
    allowed boolean,
    remaining integer,
    retry_after_seconds integer
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_user_id uuid;
    v_limit constant integer := 20;
    v_window_seconds constant integer := 60;

    v_now timestamptz;
    v_window_start timestamptz;
    v_current_count integer;
    v_retry_after integer;
begin
    v_user_id := auth.uid();

    if v_user_id is null then
        raise exception
            'Debes iniciar sesión para utilizar VYRO AI.';
    end if;

    v_now := clock_timestamp();

    v_window_start :=
        to_timestamp(
            floor(
                extract(epoch from v_now)
                / v_window_seconds
            )
            * v_window_seconds
        );

    -- Serialize requests for the same user so concurrent
    -- server instances cannot bypass the limit.

    perform pg_advisory_xact_lock(
        hashtextextended(
            'vyro-ai-rate-limit:' || v_user_id::text,
            0
        )
    );

    insert into public.ai_rate_limits (
        user_id,
        window_started_at,
        request_count,
        updated_at
    )
    values (
        v_user_id,
        v_window_start,
        1,
        v_now
    )
    on conflict (
        user_id,
        window_started_at
    )
    do update set
        request_count =
            public.ai_rate_limits.request_count + 1,
        updated_at = v_now
    returning request_count
    into v_current_count;

    v_retry_after :=
        greatest(
            1,
            ceil(
                extract(
                    epoch from (
                        v_window_start
                        + make_interval(
                            secs => v_window_seconds
                        )
                        - v_now
                    )
                )
            )::integer
        );

    if v_current_count > v_limit then
        return query
        select
            false,
            0,
            v_retry_after;

        return;
    end if;

    return query
    select
        true,
        greatest(
            v_limit - v_current_count,
            0
        ),
        0;
end;
$$;

-- ------------------------------------------------------------
-- RPC permissions
-- ------------------------------------------------------------

revoke all
on function public.consume_ai_rate_limit()
from public;

revoke all
on function public.consume_ai_rate_limit()
from anon;

grant execute
on function public.consume_ai_rate_limit()
to authenticated;

commit;
