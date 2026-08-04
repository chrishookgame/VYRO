create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    seller_id uuid not null references public.profiles(id) on delete cascade,
    title text not null,
    description text,
    price numeric(18,2) not null,
    status text not null default 'draft',
    stock integer,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    buyer_id uuid not null references public.profiles(id),
    status text not null default 'pending',
    subtotal numeric(18,2) not null default 0,
    commission numeric(18,2) not null default 0,
    total numeric(18,2) not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid not null references public.products(id),
    seller_id uuid not null references public.profiles(id),
    quantity integer not null default 1,
    unit_price numeric(18,2) not null,
    total numeric(18,2) not null
);

create index if not exists idx_products_seller
on public.products(seller_id);

create index if not exists idx_orders_buyer
on public.orders(buyer_id, created_at desc);
