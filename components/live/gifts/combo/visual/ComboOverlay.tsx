"use client";

import {
  getGiftComboProgress,
  type GiftComboState,
} from "../index";

import ComboCounter from "./ComboCounter";
import ComboProgress from "./ComboProgress";
import ComboTierBadge from "./ComboTierBadge";

interface ComboOverlayProps {
  combo: GiftComboState | null;
}

export default function ComboOverlay({
  combo,
}: ComboOverlayProps) {
  if (!combo) {
    return null;
  }

  const progress =
    getGiftComboProgress(
      combo.count,
    );

  return (
    <aside className="pointer-events-none fixed bottom-6 left-6 z-[95] w-[min(24rem,calc(100vw-3rem))]">
      <div className="rounded-[2rem] border border-white/10 bg-[#050812]/90 p-4 shadow-[0_25px_90px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <ComboCounter
              count={combo.count}
              tier={combo.tier}
            />
          </div>

          <div className="min-w-0 flex-1">
            <ComboTierBadge
              tier={combo.tier}
              multiplier={
                combo.multiplier
              }
            />

            <div className="mt-4 flex items-center gap-3">
              <div className="text-4xl">
                {combo.lastGift.icon}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">
                  {combo.lastGift.name}
                </p>

                <p className="mt-1 text-xs text-white/50">
                  Combo activo de regalos
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <ComboProgress
            progress={
              progress.progressToNextTier
            }
            nextTierAt={
              progress.nextTierAt
            }
            count={combo.count}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Valor acumulado
            </p>

            <p className="mt-1 text-lg font-black text-white">
              {combo.totalAmount.toLocaleString(
                "es-419",
              )}{" "}
              VYRO
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/50">
              Energía acumulada
            </p>

            <p className="mt-1 text-lg font-black text-cyan-100">
              ⚡ +
              {combo.totalEnergy.toLocaleString(
                "es-419",
              )}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
