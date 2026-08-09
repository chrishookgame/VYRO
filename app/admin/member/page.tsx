"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import MemberCardView from "@/components/member/MemberCardView";

import type {
  MemberCard,
  MemberLevel,
} from "@/lib/member";

import {
  supabase,
} from "@/lib/supabase";

type MemberCardRow = {
  member_id: string;
  user_id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  level: string;
  verified: boolean | null;
  joined_at: string | null;
  status: string | null;
};

const validLevels: MemberLevel[] = [
  "Starter",
  "Bronze",
  "Silver",
  "Gold",
  "Diamond",
  "Legend",
];

function normalizeLevel(
  value: string,
): MemberLevel {
  return validLevels.includes(
    value as MemberLevel,
  )
    ? (value as MemberLevel)
    : "Starter";
}

function toMemberCard(
  row: MemberCardRow,
): MemberCard {
  return {
    memberId: row.member_id,
    userId: row.user_id,
    fullName: row.full_name,
    username: row.username,
    avatarUrl: row.avatar_url ?? "",
    level: normalizeLevel(row.level),
    joinedAt:
      row.joined_at ??
      new Date(0).toISOString(),
    verified:
      row.verified ?? false,
  };
}

export default function AdminMemberPage() {
  const [members, setMembers] =
    useState<MemberCard[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMembers() {
      setLoading(true);
      setError(null);

      const {
        data,
        error: memberError,
      } = await supabase
        .from("member_cards")
        .select(
          "member_id,user_id,full_name,username,avatar_url,level,verified,joined_at,status",
        )
        .order("joined_at", {
          ascending: false,
        });

      if (!active) {
        return;
      }

      if (memberError) {
        console.error(
          "VYRO Admin Member load error:",
          memberError,
        );

        setMembers([]);
        setError(
          "No se pudieron cargar las identidades Member.",
        );
        setLoading(false);
        return;
      }

      const rows =
        (data ?? []) as MemberCardRow[];

      setMembers(
        rows
          .filter(
            (row) =>
              row.status === null ||
              row.status === "active",
          )
          .map(toMemberCard),
      );

      setLoading(false);
    }

    void loadMembers();

    return () => {
      active = false;
    };
  }, []);

  const primaryMember =
    useMemo(
      () =>
        members.length > 0
          ? members[0]
          : null,
      [members],
    );

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          VYRO Digital Identity
        </h1>

        <p className="mt-2 text-slate-400">
          Gestión de credenciales digitales.
        </p>
      </div>

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
          Cargando identidades Member...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-8 text-red-200">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        !primaryMember && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
            No hay identidades Member registradas.
          </div>
        )}

      {!loading &&
        !error &&
        primaryMember && (
          <div className="space-y-8">
            <div className="max-w-3xl">
              <MemberCardView
                card={primaryMember}
              />
            </div>

            {members.length > 1 && (
              <div className="grid gap-6 xl:grid-cols-2">
                {members
                  .slice(1)
                  .map((member) => (
                    <MemberCardView
                      key={member.memberId}
                      card={member}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
    </section>
  );
}