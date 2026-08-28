-- ============================================================
-- VYRO HARDEN LIVE BATTLE SERIES DIRECT UPDATE
-- La autoridad de mutacion pertenece a RPCs SECURITY DEFINER.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- El cliente autenticado no debe modificar directamente
-- el estado autoritativo de una Battle Series.
--
-- Las mutaciones legitimas continuan mediante:
--   create_live_battle_series
--   start_live_battle_round
--   advance_live_battle_series
-- ------------------------------------------------------------

drop policy if exists
"Battle participants can update series"
on public.live_battle_series;

revoke update
on table public.live_battle_series
from authenticated;

revoke update
on table public.live_battle_series
from anon;

commit;