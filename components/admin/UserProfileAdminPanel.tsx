"use client";

export type UserProfileAdmin = {
  id: string;
  fullName: string;
  email: string;
  memberId: string;
  level: string;
  walletBalance: number;
  xp: number;
  trustScore: number;
  reputation: number;
  referrals: number;
  academyCourses: number;
  verified: boolean;
  accountStatus:
    | "active"
    | "suspended"
    | "blocked";
};

type Props = {
  user: UserProfileAdmin;
};

export default function UserProfileAdminPanel({
  user,
}: Props) {

  return (

    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">

      <h1 className="text-3xl font-bold">
        Perfil del Usuario
      </h1>

      <p className="mt-2 text-slate-400">
        Vista del Admin Maestro
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <Info title="Nombre" value={user.fullName} />
        <Info title="Email" value={user.email} />
        <Info title="Member ID" value={user.memberId} />
        <Info title="Nivel" value={user.level} />
        <Info title="Wallet" value={`$${user.walletBalance.toFixed(2)}`} />
        <Info title="XP" value={user.xp.toString()} />
        <Info title="Trust Score" value={`${user.trustScore}/100`} />
        <Info title="Reputation" value={`${user.reputation}/100`} />
        <Info title="Referidos" value={user.referrals.toString()} />
        <Info title="Cursos Academy" value={user.academyCourses.toString()} />
        <Info
          title="Verificación"
          value={user.verified ? "✔ Verificado" : "Pendiente"}
        />
        <Info title="Estado" value={user.accountStatus} />

      </div>

    </section>

  );

}

type InfoProps = {
  title: string;
  value: string;
};

function Info({
  title,
  value,
}: InfoProps) {

  return (

    <div className="rounded-2xl bg-slate-900 p-5">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2 className="mt-2 text-lg font-bold">
        {value}
      </h2>

    </div>

  );

}
