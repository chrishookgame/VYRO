-- ============================================================
-- VYRO 049 - LIVE MODERATORS READ GRANT
--
-- Permite que las policies RLS relacionadas con moderadores
-- puedan consultar live_moderators.
--
-- RLS permanece activo y sigue controlando las filas visibles.
-- No se concede INSERT / UPDATE / DELETE.
-- ============================================================

begin;

grant select
on table public.live_moderators
to authenticated;

commit;