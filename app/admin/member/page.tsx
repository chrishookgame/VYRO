import MemberCardView from "@/components/member/MemberCardView";

export default function AdminMemberPage() {
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

      <div className="max-w-3xl">
        <MemberCardView
          card={{
            memberId: "VYR-2026-000001",
            userId: "demo-user",
            fullName: "Demo User",
            username: "demo",
            avatarUrl: "",
            level: "Starter",
            joinedAt: "2026-08-03T00:00:00.000Z",
            verified: true,
          }}
        />
      </div>
    </section>
  );
}
