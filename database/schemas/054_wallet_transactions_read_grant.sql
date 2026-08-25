-- ============================================================
-- VYRO - Wallet Transactions Read Grant
-- ============================================================
--
-- Permite a usuarios autenticados ejecutar SELECT sobre
-- public.wallet_transactions.
--
-- La visibilidad efectiva de filas permanece protegida por RLS.
-- No se concede SELECT al rol anon.
-- ============================================================

grant select
on table public.wallet_transactions
to authenticated;