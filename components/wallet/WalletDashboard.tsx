"use client";

type WalletDashboardProps = {
  available: number;
  pending: number;
  totalEarned: number;
};

export default function WalletDashboard({
  available,
  pending,
  totalEarned,
}: WalletDashboardProps) {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-black p-8 text-white shadow-2xl">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-300 text-sm">
            VYRO Wallet
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            ${available.toFixed(2)}
          </h1>

          <p className="mt-2 text-gray-400">
            Saldo disponible
          </p>
        </div>

        <div className="rounded-full bg-emerald-500/20 p-6 text-5xl">
          💰
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <div className="rounded-2xl bg-white/5 p-5">
          <p className="text-gray-400">
            Pendiente
          </p>

          <h2 className="mt-2 text-2xl font-bold text-yellow-400">
            ${pending.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 p-5">
          <p className="text-gray-400">
            Ganado Total
          </p>

          <h2 className="mt-2 text-2xl font-bold text-cyan-400">
            ${totalEarned.toFixed(2)}
          </h2>
        </div>

      </div>

    </section>
  );
}
