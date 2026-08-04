"use client";

import type {
  MemberCard,
} from "@/lib/member";

type Props = {
  card: MemberCard;
  walletBalance: number;
  xp: number;
  trustScore: number;
  reputation: number;
};

export default function MemberDashboard({
  card,
  walletBalance,
  xp,
  trustScore,
  reputation,
}: Props) {

  return (
    <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 p-8 text-white shadow-2xl">

      <h1 className="text-3xl font-bold">
        VYRO MEMBER ID
      </h1>

      <p className="mt-2 text-cyan-300">
        {card.fullName}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-gray-400">
            Member ID
          </p>
          <h2 className="mt-2 font-mono text-lg">
            {card.memberId}
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-gray-400">
            Nivel
          </p>
          <h2 className="mt-2 text-xl font-bold">
            {card.level}
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-gray-400">
            Wallet
          </p>
          <h2 className="mt-2 text-xl font-bold text-green-400">
            ${walletBalance}
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-gray-400">
            XP
          </p>
          <h2 className="mt-2 text-xl font-bold">
            {xp}
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-gray-400">
            Trust Score
          </p>
          <h2 className="mt-2 text-xl font-bold">
            {trustScore}/100
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-gray-400">
            Reputation
          </p>
          <h2 className="mt-2 text-xl font-bold text-yellow-400">
            {reputation}/100
          </h2>
        </div>

      </div>

    </section>
  );

}
