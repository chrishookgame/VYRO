"use client";

import type { MemberCard } from "@/lib/member";

type Props = {
  card: MemberCard;
};

export default function MemberCardView({
  card,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-[#08111F] via-[#0B1D2F] to-[#051019] p-8 text-white shadow-2xl">

      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      <p className="text-xs font-bold tracking-[0.35em] text-cyan-300">
        VYRO MEMBER
      </p>

      <h2 className="mt-2 text-3xl font-extrabold">
        {card.fullName}
      </h2>

      <p className="text-cyan-300">
        @{card.username}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <div>
          <p className="text-xs uppercase text-gray-400">
            Member ID
          </p>

          <p className="font-mono text-lg">
            {card.memberId}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-400">
            Nivel
          </p>

          <p className="font-bold text-yellow-300">
            {card.level}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-400">
            Miembro desde
          </p>

          <p>
            {new Date(
              card.joinedAt,
            ).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-400">
            Estado
          </p>

          <p className="font-bold text-green-400">
            {card.verified
              ? "Verificado"
              : "Pendiente"}
          </p>
        </div>

      </div>

      <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">

        <span className="text-sm text-cyan-300">
          Global Digital Identity
        </span>

        <span className="rounded-full bg-cyan-500 px-4 py-1 text-xs font-bold text-black">
          VYRO
        </span>

      </div>

    </section>
  );
}
