-- ============================================================
-- VYRO 3090
-- Sprint 212.8 - Complete Categorized LIVE Gift Catalog
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Categorías administrables
-- ------------------------------------------------------------

create table if not exists public.live_gift_categories (
    code text primary key,

    name text not null,
    icon text not null,

    description text,

    display_order integer not null default 0,

    active boolean not null default true,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

drop trigger if exists trg_live_gift_categories_updated_at
on public.live_gift_categories;

create trigger trg_live_gift_categories_updated_at
before update on public.live_gift_categories
for each row
execute function public.set_live_updated_at();

insert into public.live_gift_categories (
    code,
    name,
    icon,
    description,
    display_order,
    active
)
values
    (
        'love',
        'Flores y Amor',
        '❤️',
        'Regalos románticos, flores y demostraciones de cariño.',
        10,
        true
    ),
    (
        'celebration',
        'Celebración',
        '🎉',
        'Cumpleaños, logros, fiestas y momentos especiales.',
        20,
        true
    ),
    (
        'food',
        'Comida y Bebidas',
        '🍕',
        'Comida, bebidas y regalos divertidos para compartir.',
        30,
        true
    ),
    (
        'animals',
        'Animales',
        '🦁',
        'Mascotas, animales majestuosos y criaturas legendarias.',
        40,
        true
    ),
    (
        'luxury',
        'Joyas y Lujo',
        '💎',
        'Joyas, coronas y símbolos exclusivos de prestigio.',
        50,
        true
    ),
    (
        'vehicles',
        'Vehículos',
        '🚀',
        'Desde bicicletas hasta jets y naves espaciales.',
        60,
        true
    ),
    (
        'nature',
        'Mundo y Naturaleza',
        '🌎',
        'Regalos inspirados en la Tierra, el cielo y el universo.',
        70,
        true
    ),
    (
        'vyro',
        'Exclusivos VYRO',
        '⚡',
        'Regalos únicos y representativos del universo VYRO.',
        80,
        true
    ),
    (
        'seasonal',
        'Temporadas y Eventos',
        '🎊',
        'Regalos especiales para fechas y celebraciones mundiales.',
        90,
        true
    )
on conflict (code)
do update set
    name = excluded.name,
    icon = excluded.icon,
    description = excluded.description,
    display_order = excluded.display_order,
    active = excluded.active;

-- ------------------------------------------------------------
-- Agregar categoría al catálogo
-- ------------------------------------------------------------

alter table public.live_gift_catalog
add column if not exists category_code text;

update public.live_gift_catalog
set category_code = case code
    when 'rose' then 'love'
    when 'heart' then 'love'
    when 'star' then 'luxury'
    when 'diamond' then 'luxury'
    when 'rocket' then 'vehicles'
    when 'crown' then 'luxury'
    when 'lion' then 'animals'
    else 'vyro'
end
where category_code is null;

alter table public.live_gift_catalog
alter column category_code set not null;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'live_gift_catalog_category_code_fkey'
          and conrelid =
              'public.live_gift_catalog'::regclass
    ) then
        alter table public.live_gift_catalog
        add constraint live_gift_catalog_category_code_fkey
        foreign key (category_code)
        references public.live_gift_categories(code);
    end if;
end;
$$;

create index if not exists idx_live_gift_catalog_category
on public.live_gift_catalog (
    category_code,
    active,
    display_order
);

-- ------------------------------------------------------------
-- Catálogo completo: 50 regalos
-- ------------------------------------------------------------

insert into public.live_gift_catalog (
    code,
    category_code,
    name,
    icon,
    price,
    energy_value,
    creator_share_percent,
    rarity,
    animation_key,
    display_order,
    active
)
values
    -- FLORES Y AMOR
    ('rose', 'love', 'VYRO Rose', '🌹', 1, 1, 70, 'common', 'rose', 10, true),
    ('heart', 'love', 'VYRO Heart', '❤️', 5, 5, 70, 'common', 'heart', 20, true),
    ('kiss', 'love', 'VYRO Kiss', '💋', 8, 9, 70, 'common', 'kiss', 30, true),
    ('teddy_bear', 'love', 'Teddy Bear', '🧸', 15, 18, 70, 'rare', 'teddy_bear', 40, true),
    ('love_letter', 'love', 'Love Letter', '💌', 25, 32, 70, 'rare', 'love_letter', 50, true),
    ('engagement_ring', 'love', 'Engagement Ring', '💍', 100, 150, 70, 'epic', 'engagement_ring', 60, true),
    ('eternal_rose', 'love', 'Eternal Rose', '🥀', 300, 500, 70, 'legendary', 'eternal_rose', 70, true),

    -- CELEBRACIÓN
    ('balloon', 'celebration', 'Celebration Balloon', '🎈', 2, 2, 70, 'common', 'balloon', 110, true),
    ('cake', 'celebration', 'Birthday Cake', '🎂', 12, 15, 70, 'common', 'cake', 120, true),
    ('confetti', 'celebration', 'VYRO Confetti', '🎊', 20, 25, 70, 'rare', 'confetti', 130, true),
    ('fireworks', 'celebration', 'Fireworks Show', '🎆', 80, 120, 70, 'epic', 'fireworks', 140, true),
    ('trophy', 'celebration', 'Golden Trophy', '🏆', 150, 240, 70, 'epic', 'trophy', 150, true),
    ('birthday_party', 'celebration', 'Birthday Party', '🥳', 350, 600, 70, 'legendary', 'birthday_party', 160, true),

    -- COMIDA Y BEBIDAS
    ('coffee', 'food', 'VYRO Coffee', '☕', 3, 3, 70, 'common', 'coffee', 210, true),
    ('pizza', 'food', 'VYRO Pizza', '🍕', 7, 8, 70, 'common', 'pizza', 220, true),
    ('burger', 'food', 'VYRO Burger', '🍔', 10, 12, 70, 'common', 'burger', 230, true),
    ('sushi', 'food', 'Premium Sushi', '🍣', 18, 24, 70, 'rare', 'sushi', 240, true),
    ('ice_cream', 'food', 'Magic Ice Cream', '🍦', 30, 42, 70, 'rare', 'ice_cream', 250, true),

    -- ANIMALES
    ('cat', 'animals', 'VYRO Cat', '🐱', 6, 7, 70, 'common', 'cat', 310, true),
    ('dog', 'animals', 'VYRO Dog', '🐶', 9, 11, 70, 'common', 'dog', 320, true),
    ('horse', 'animals', 'Royal Horse', '🐎', 75, 110, 70, 'rare', 'horse', 330, true),
    ('eagle', 'animals', 'Golden Eagle', '🦅', 180, 280, 70, 'epic', 'eagle', 340, true),
    ('lion', 'animals', 'VYRO Lion', '🦁', 1000, 2000, 70, 'mythic', 'lion', 350, true),
    ('phoenix', 'animals', 'Eternal Phoenix', '🔥', 1500, 3200, 70, 'mythic', 'phoenix', 360, true),
    ('dragon', 'animals', 'Celestial Dragon', '🐉', 2500, 5500, 70, 'mythic', 'dragon', 370, true),

    -- JOYAS Y LUJO
    ('star', 'luxury', 'VYRO Star', '⭐', 10, 12, 70, 'rare', 'star', 410, true),
    ('diamond', 'luxury', 'VYRO Diamond', '💎', 50, 70, 70, 'epic', 'diamond', 420, true),
    ('crown', 'luxury', 'VYRO Crown', '👑', 500, 900, 70, 'legendary', 'crown', 430, true),
    ('gold_watch', 'luxury', 'Golden Watch', '⌚', 650, 1200, 70, 'legendary', 'gold_watch', 440, true),
    ('pearl_necklace', 'luxury', 'Pearl Necklace', '📿', 800, 1500, 70, 'legendary', 'pearl_necklace', 450, true),
    ('royal_throne', 'luxury', 'Royal Throne', '🪑', 1800, 3900, 70, 'mythic', 'royal_throne', 460, true),
    ('golden_palace', 'luxury', 'Golden Palace', '🏰', 5000, 12000, 70, 'mythic', 'golden_palace', 470, true),

    -- VEHÍCULOS
    ('bicycle', 'vehicles', 'VYRO Bicycle', '🚲', 15, 18, 70, 'common', 'bicycle', 510, true),
    ('motorcycle', 'vehicles', 'Super Motorcycle', '🏍️', 120, 180, 70, 'rare', 'motorcycle', 520, true),
    ('sports_car', 'vehicles', 'VYRO Sports Car', '🏎️', 400, 720, 70, 'legendary', 'sports_car', 530, true),
    ('yacht', 'vehicles', 'Luxury Yacht', '🛥️', 1200, 2500, 70, 'legendary', 'yacht', 540, true),
    ('helicopter', 'vehicles', 'VYRO Helicopter', '🚁', 1800, 3900, 70, 'mythic', 'helicopter', 550, true),
    ('private_jet', 'vehicles', 'Private Jet', '✈️', 3500, 8000, 70, 'mythic', 'private_jet', 560, true),
    ('space_shuttle', 'vehicles', 'Space Shuttle', '🚀', 7500, 18000, 70, 'mythic', 'space_shuttle', 570, true),

    -- MUNDO Y NATURALEZA
    ('rainbow', 'nature', 'Magic Rainbow', '🌈', 35, 50, 70, 'rare', 'rainbow', 610, true),
    ('moon', 'nature', 'VYRO Moon', '🌙', 250, 420, 70, 'epic', 'moon', 620, true),
    ('sun', 'nature', 'VYRO Sun', '☀️', 450, 800, 70, 'legendary', 'sun', 630, true),
    ('volcano', 'nature', 'Power Volcano', '🌋', 900, 1700, 70, 'legendary', 'volcano', 640, true),
    ('planet_earth', 'nature', 'Planet Earth', '🌎', 3000, 6800, 70, 'mythic', 'planet_earth', 650, true),

    -- EXCLUSIVOS VYRO
    ('vyro_energy', 'vyro', 'VYRO Energy Core', '⚡', 100, 160, 70, 'epic', 'vyro_energy', 710, true),
    ('vyro_galaxy', 'vyro', 'VYRO Galaxy', '🌌', 2000, 4500, 70, 'mythic', 'vyro_galaxy', 720, true),
    ('vyro_king', 'vyro', 'VYRO King', '🤴', 4000, 9500, 70, 'mythic', 'vyro_king', 730, true),
    ('vyro_universe', 'vyro', 'VYRO Universe', '🪐', 10000, 25000, 70, 'mythic', 'vyro_universe', 740, true),

    -- TEMPORADAS Y EVENTOS
    ('christmas_magic', 'seasonal', 'Christmas Magic', '🎄', 350, 600, 70, 'legendary', 'christmas_magic', 810, true),
    ('halloween_night', 'seasonal', 'Halloween Night', '🎃', 350, 600, 70, 'legendary', 'halloween_night', 820, true)

on conflict (code)
do update set
    category_code = excluded.category_code,
    name = excluded.name,
    icon = excluded.icon,
    price = excluded.price,
    energy_value = excluded.energy_value,
    creator_share_percent = excluded.creator_share_percent,
    rarity = excluded.rarity,
    animation_key = excluded.animation_key,
    display_order = excluded.display_order,
    active = excluded.active;

-- ------------------------------------------------------------
-- Seguridad de categorías
-- ------------------------------------------------------------

alter table public.live_gift_categories
enable row level security;

drop policy if exists
"Authenticated users can view active gift categories"
on public.live_gift_categories;

create policy
"Authenticated users can view active gift categories"
on public.live_gift_categories
for select
to authenticated
using (
    active = true
    or public.is_vyro_admin()
);

drop policy if exists
"Admins can manage gift categories"
on public.live_gift_categories;

create policy
"Admins can manage gift categories"
on public.live_gift_categories
for all
to authenticated
using (
    public.is_vyro_admin()
)
with check (
    public.is_vyro_admin()
);

commit;
