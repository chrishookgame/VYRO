begin;

alter table public.platform_settings
enable row level security;

revoke all
on table public.platform_settings
from anon;

revoke all
on table public.platform_settings
from authenticated;

grant select, insert, update
on table public.platform_settings
to authenticated;

drop policy if exists "platform_settings_select"
on public.platform_settings;

create policy "platform_settings_select"
on public.platform_settings
for select
to authenticated
using (
    public.is_vyro_user_manager()
);

drop policy if exists "platform_settings_insert"
on public.platform_settings;

create policy "platform_settings_insert"
on public.platform_settings
for insert
to authenticated
with check (
    public.is_vyro_user_manager()
    and updated_by = (select auth.uid())
);

drop policy if exists "platform_settings_update"
on public.platform_settings;

create policy "platform_settings_update"
on public.platform_settings
for update
to authenticated
using (
    public.is_vyro_user_manager()
)
with check (
    public.is_vyro_user_manager()
    and updated_by = (select auth.uid())
);

insert into public.platform_settings (
    key,
    value
)
values
    (
        'liveCommission',
        '20'::jsonb
    ),
    (
        'marketplaceCommission',
        '10'::jsonb
    ),
    (
        'referralBonus',
        '5'::jsonb
    ),
    (
        'academyReward',
        '100'::jsonb
    ),
    (
        'minimumWithdraw',
        '50'::jsonb
    )
on conflict (key)
do nothing;

commit;
