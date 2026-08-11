-- ============================================================
-- VYRO 043 - BOOST FEED RANKING
-- Secure server-side ranking for the public feed.
-- ============================================================

create or replace function public.get_ranked_feed()
returns table (
    id uuid,
    user_id uuid,
    caption text,
    video_url text,
    likes integer,
    created_at timestamptz,
    priority_boost integer
)
language sql
stable
security definer
set search_path = public
as $$
    select
        p.id,
        p.user_id,
        p.caption,
        p.video_url,
        coalesce(p.likes, 0)::integer as likes,
        p.created_at,
        coalesce(
            max(
                case
                    when b.status = 'active'
                     and b.starts_at <= now()
                     and b.ends_at > now()
                    then b.priority_boost
                    else 0
                end
            ),
            0
        )::integer as priority_boost
    from public.posts p
    left join public.post_boost_campaigns b
        on b.post_id = p.id
       and b.status = 'active'
       and b.starts_at <= now()
       and b.ends_at > now()
    group by
        p.id,
        p.user_id,
        p.caption,
        p.video_url,
        p.likes,
        p.created_at
    order by
        priority_boost desc,
        p.created_at desc;
$$;

revoke all
on function public.get_ranked_feed()
from public;

grant execute
on function public.get_ranked_feed()
to authenticated;

comment on function public.get_ranked_feed()
is 'Returns the VYRO feed ordered by active Boost priority and publication recency without exposing boost campaign data.';
