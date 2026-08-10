begin;

-- ============================================================
-- VYRO 038 - SOCIAL NOTIFICATIONS
-- Like + Comment + Follow -> notifications
-- ============================================================

-- ------------------------------------------------------------
-- LIKE NOTIFICATION
-- ------------------------------------------------------------

create or replace function public.notify_post_like()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    recipient_id uuid;
begin
    select p.user_id
    into recipient_id
    from public.posts p
    where p.id = new.post_id;

    if recipient_id is null
       or recipient_id = new.user_id then
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
        recipient_id,
        new.user_id,
        'Nuevo Me gusta',
        'A alguien le gustó tu publicación.',
        'like',
        '/feed',
        jsonb_build_object(
            'post_id', new.post_id,
            'like_id', new.id
        )
    );

    return new;
end;
$$;

revoke all
on function public.notify_post_like()
from public;

drop trigger if exists trg_notify_post_like
on public.post_likes;

create trigger trg_notify_post_like
after insert on public.post_likes
for each row
execute function public.notify_post_like();


-- ------------------------------------------------------------
-- COMMENT / TALK NOTIFICATION
-- ------------------------------------------------------------

create or replace function public.notify_post_comment()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    recipient_id uuid;
begin
    select p.user_id
    into recipient_id
    from public.posts p
    where p.id = new.post_id;

    if recipient_id is null
       or recipient_id = new.user_id then
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
        recipient_id,
        new.user_id,
        'Nuevo comentario',
        'Alguien comentó en tu publicación.',
        'comment',
        '/feed',
        jsonb_build_object(
            'post_id', new.post_id,
            'comment_id', new.id
        )
    );

    return new;
end;
$$;

revoke all
on function public.notify_post_comment()
from public;

drop trigger if exists trg_notify_post_comment
on public.post_comments;

create trigger trg_notify_post_comment
after insert on public.post_comments
for each row
execute function public.notify_post_comment();


-- ------------------------------------------------------------
-- FOLLOW NOTIFICATION
-- ------------------------------------------------------------

create or replace function public.notify_new_follower()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    if new.follower_id = new.following_id then
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
        new.following_id,
        new.follower_id,
        'Nuevo seguidor',
        'Una persona comenzó a seguirte.',
        'follow',
        '/profile',
        jsonb_build_object(
            'follower_id', new.follower_id
        )
    );

    return new;
end;
$$;

revoke all
on function public.notify_new_follower()
from public;

drop trigger if exists trg_notify_new_follower
on public.followers;

create trigger trg_notify_new_follower
after insert on public.followers
for each row
execute function public.notify_new_follower();

commit;
