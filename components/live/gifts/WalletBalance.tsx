"use client";

interface WalletBalanceProps {
  balance: number;
}

export default function WalletBalance({
  balance,
}: WalletBalanceProps) {
  return (
    <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
        Saldo disponible
      </p>

      <p className="mt-1 text-xl font-black text-white">
        {balance.toLocaleString("es-419")} VYRO
      </p>
    </div>
  );
}
