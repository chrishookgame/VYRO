create table if not exists public.ai_project_content (
    project_id uuid primary key references public.projects(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    source_prompt text not null,
    script text not null,
    scenes jsonb not null default '[]'::jsonb,
    seo jsonb not null default '{}'::jsonb,
    thumbnail_data_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_ai_project_content_user
on public.ai_project_content(user_id);

alter table public.ai_project_content enable row level security;

drop policy if exists "Users can read own AI project content"
on public.ai_project_content;

create policy "Users can read own AI project content"
on public.ai_project_content
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own AI project content"
on public.ai_project_content;

create policy "Users can insert own AI project content"
on public.ai_project_content
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own AI project content"
on public.ai_project_content;

create policy "Users can update own AI project content"
on public.ai_project_content
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own AI project content"
on public.ai_project_content;

create policy "Users can delete own AI project content"
on public.ai_project_content
for delete
using (auth.uid() = user_id);
grant select, insert, update, delete
on table public.ai_project_content
to authenticated;
