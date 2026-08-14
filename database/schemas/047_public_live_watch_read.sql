begin;

-- ============================================================
-- VYRO PUBLIC WATCH
-- Public viewers may READ presentation data only when
-- the associated LIVE room is public.
-- No anonymous INSERT / UPDATE / DELETE / RPC is granted.
-- ============================================================

-- ------------------------------------------------------------
-- TABLE PRIVILEGES
-- ------------------------------------------------------------

grant select on table public.live_battles
to anon, authenticated;

grant select on table public.live_battle_scores
to anon, authenticated;

grant select on table public.live_battle_series
to anon, authenticated;

grant select on table public.live_ranking_scores
to anon, authenticated;

grant select on table public.live_gifts
to anon, authenticated;

grant select on table public.live_gift_catalog
to anon, authenticated;

grant select on table public.live_gift_categories
to anon, authenticated;


-- ------------------------------------------------------------
-- PUBLIC BATTLES
-- ------------------------------------------------------------

drop policy if exists
"Public viewers can view battles in public rooms"
on public.live_battles;

create policy
"Public viewers can view battles in public rooms"
on public.live_battles
for select
to anon
using (
    exists (
        select 1
        from public.live_rooms room
        where room.id = live_battles.room_id
          and room.visibility = 'public'
    )
);


-- ------------------------------------------------------------
-- PUBLIC BATTLE SCORES
-- Score rows do not contain room_id, so resolve through battle.
-- ------------------------------------------------------------

drop policy if exists
"Public viewers can view battle scores in public rooms"
on public.live_battle_scores;

create policy
"Public viewers can view battle scores in public rooms"
on public.live_battle_scores
for select
to anon
using (
    exists (
        select 1
        from public.live_battles battle
        join public.live_rooms room
          on room.id = battle.room_id
        where battle.id = live_battle_scores.battle_id
          and room.visibility = 'public'
    )
);


-- ------------------------------------------------------------
-- PUBLIC BATTLE SERIES
-- ------------------------------------------------------------

drop policy if exists
"Public viewers can view battle series in public rooms"
on public.live_battle_series;

create policy
"Public viewers can view battle series in public rooms"
on public.live_battle_series
for select
to anon
using (
    exists (
        select 1
        from public.live_rooms room
        where room.id = live_battle_series.room_id
          and room.visibility = 'public'
    )
);


-- ------------------------------------------------------------
-- PUBLIC LIVE RANKING
-- ------------------------------------------------------------

drop policy if exists
"Public viewers can view rankings in public rooms"
on public.live_ranking_scores;

create policy
"Public viewers can view rankings in public rooms"
on public.live_ranking_scores
for select
to anon
using (
    exists (
        select 1
        from public.live_rooms room
        where room.id = live_ranking_scores.room_id
          and room.visibility = 'public'
    )
);


-- ------------------------------------------------------------
-- PUBLIC GIFT EVENTS
-- Viewers may see gifts belonging to a public LIVE.
-- Sending gifts remains authenticated through send_live_gift().
-- ------------------------------------------------------------

drop policy if exists
"Public viewers can view gifts in public rooms"
on public.live_gifts;

create policy
"Public viewers can view gifts in public rooms"
on public.live_gifts
for select
to anon
using (
    exists (
        select 1
        from public.live_rooms room
        where room.id = live_gifts.room_id
          and room.visibility = 'public'
    )
);


-- ------------------------------------------------------------
-- PUBLIC ACTIVE GIFT CATALOG
-- ------------------------------------------------------------

drop policy if exists
"Public viewers can view active gift catalog"
on public.live_gift_catalog;

create policy
"Public viewers can view active gift catalog"
on public.live_gift_catalog
for select
to anon
using (
    active = true
);


-- ------------------------------------------------------------
-- PUBLIC ACTIVE GIFT CATEGORIES
-- ------------------------------------------------------------

drop policy if exists
"Public viewers can view active gift categories"
on public.live_gift_categories;

create policy
"Public viewers can view active gift categories"
on public.live_gift_categories
for select
to anon
using (
    active = true
);

commit;