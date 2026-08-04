"use client";

import Image from "next/image";

import type {
  MemberCard,
} from "@/lib/member";

type Props = {
  card: MemberCard;
};

export default function MemberAvatar({
  card,
}: Props) {
  const initial =
    card.fullName
      .trim()
      .charAt(0)
      .toUpperCase() || "V";

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-cyan-400">
        {card.avatarUrl ? (
          <Image
            src={card.avatarUrl}
            alt={card.fullName}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-700 text-3xl font-bold text-white">
            {initial}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white">
          {card.fullName}
        </h2>

        <p className="text-cyan-300">
          @{card.username}
        </p>
      </div>
    </div>
  );
}
