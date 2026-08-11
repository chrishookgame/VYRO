-- ============================================================
-- VYRO 044 - WALLET READ GRANT
-- Allows authenticated users to SELECT from public.wallets.
-- RLS remains responsible for restricting access to own Wallet.
-- ============================================================

grant select
on table public.wallets
to authenticated;