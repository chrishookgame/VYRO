-- ============================================================
-- VYRO HARDEN LIVE BATTLES DIRECT UPDATE
-- La autoridad de mutacion pertenece a RPCs SECURITY DEFINER.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- El cliente autenticado no debe modificar directamente
-- el estado autoritativo de una LIVE Battle.
--
-- Las mutaciones legitimas continuan mediante:
--   create_live_battle_series
--   start_live_battle_round
--   advance_live_battle_series
-- ------------------------------------------------------------

drop policy if exists
"Battle creators can update live battles"
on public.live_battles;

revoke update
on table public.live_battles
from authenticated;

revoke update
on table public.live_battles
from anon;

commit;