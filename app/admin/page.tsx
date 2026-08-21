"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  Badge,
  Card,
  StatCard,
  Table,
} from "@/components/ui";

import {
  useAdminRole,
} from "@/components/admin/AdminRoleContext";

import {
  canAccessPage,
  getAdminAuditLogs,
  getAdminUsers,
  getWithdrawRequests,
} from "@/lib/admin";

import type {
  Permission,
} from "@/lib/roles";

import {
  getAdminWalletSnapshot,
} from "@/lib/admin/wallet";

import {
  getTickets,
} from "@/lib/support";

type WithdrawRow = {
  status: string;
};

type TicketRow = {
  status: string;
};

type AuditRow = {
  id?: string;
  action: string;
  target_id: string;
  details: string | null;
  created_at: string;
};

type DashboardState = {
  users: number;
  pendingWithdraws: number;
  availableBalance: number;
  openTickets: number;
  activity: AuditRow[];
};

type AdminModule = {
  name: string;
  status: string;
  href: string;
  permission: Permission;
};

const modules: readonly AdminModule[] = [
  {
    name: "Usuarios",
    status: "Operativo",
    href: "/admin/users",
    permission: "users.read",
  },
  {
    name: "Wallet",
    status: "Operativo",
    href: "/admin/wallet",
    permission: "wallet.read",
  },
  {
    name: "Retiros",
    status: "Operativo",
    href: "/admin/withdraws",
    permission: "withdraw.read",
  },
  {
    name: "Soporte",
    status: "Operativo",
    href: "/admin/support",
    permission: "tickets.read",
  },
  {
    name: "Auditoría",
    status: "Operativo",
    href: "/admin/audit",
    permission: "reports.read",
  },
  {
    name: "Configuración",
    status: "Operativo",
    href: "/admin/settings",
    permission: "settings.update",
  },
];

function toNumber(
  value: number | string | null,
): number {
  const result =
    typeof value === "number"
      ? value
      : Number(value ?? 0);

  return Number.isFinite(result)
    ? result
    : 0;
}

function isPendingWithdraw(
  status: string,
): boolean {
  return status
    .trim()
    .toLowerCase() === "pending";
}

function isOpenTicket(
  status: string,
): boolean {
  const normalized =
    status
      .trim()
      .toLowerCase();

  return (
    normalized === "open" ||
    normalized === "abierto"
  );
}

function formatAction(
  action: string,
): string {
  return action
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

export default function AdminHomePage() {
  const role = useAdminRole();

  const canUsers =
    canAccessPage(role, "users.read");

  const canWithdraw =
    canAccessPage(role, "withdraw.read");

  const canWallet =
    canAccessPage(role, "wallet.read");

  const canTickets =
    canAccessPage(role, "tickets.read");

  const canAudit =
    canAccessPage(role, "reports.read");

  const visibleModules =
    modules.filter((module) =>
      canAccessPage(
        role,
        module.permission,
      ),
    );

  const [
    dashboard,
    setDashboard,
  ] = useState<DashboardState>({
    users: 0,
    pendingWithdraws: 0,
    availableBalance: 0,
    openTickets: 0,
    activity: [],
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const [
          usersResult,
          withdrawResult,
          walletSnapshot,
          ticketResult,
          auditResult,
        ] = await Promise.all([
          canUsers
            ? getAdminUsers()
            : Promise.resolve({
                data: [],
                error: null,
              }),
          canWithdraw
            ? getWithdrawRequests()
            : Promise.resolve({
                data: [],
                error: null,
              }),
          canWallet
            ? getAdminWalletSnapshot()
            : Promise.resolve({
                wallets: [],
                transactions: [],
                profiles: [],
              }),
          canTickets
            ? getTickets()
            : Promise.resolve({
                data: [],
                error: null,
              }),
          canAudit
            ? getAdminAuditLogs()
            : Promise.resolve({
                data: [],
                error: null,
              }),
        ]);

        if (usersResult.error) {
          throw usersResult.error;
        }

        if (withdrawResult.error) {
          throw withdrawResult.error;
        }

        if (ticketResult.error) {
          throw ticketResult.error;
        }

        if (auditResult.error) {
          throw auditResult.error;
        }

        const withdrawals =
          (withdrawResult.data ??
            []) as WithdrawRow[];

        const tickets =
          (ticketResult.data ??
            []) as TicketRow[];

        const activity =
          (auditResult.data ??
            []) as AuditRow[];

        const availableBalance =
          walletSnapshot.wallets.reduce(
            (
              total,
              wallet,
            ) =>
              total +
              toNumber(
                wallet.available_balance,
              ),
            0,
          );

        if (active) {
          setDashboard({
            users:
              usersResult.data?.length ??
              0,

            pendingWithdraws:
              withdrawals.filter(
                (withdraw) =>
                  isPendingWithdraw(
                    withdraw.status,
                  ),
              ).length,

            availableBalance,

            openTickets:
              tickets.filter(
                (ticket) =>
                  isOpenTicket(
                    ticket.status,
                  ),
              ).length,

            activity:
              activity.slice(0, 8),
          });

          setLoading(false);
        }
      }
      catch (loadError) {
        console.error(
          "VYRO Admin Command Center load error:",
          loadError,
        );

        if (active) {
          setError(
            "No se pudo cargar el Command Center.",
          );
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [
    canAudit,
    canTickets,
    canUsers,
    canWallet,
    canWithdraw,
  ]);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-white">
          VYRO Command Center
        </h1>

        <p className="mt-2 text-slate-400">
          Control operativo y ejecutivo de toda la plataforma.
        </p>
      </header>

      {loading && (
        <p className="text-sm text-slate-400">
          Cargando datos operativos...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-300">
          {error}
        </p>
      )}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {canUsers && (
          <StatCard
            title="Usuarios"
            value={dashboard.users}
            icon="👥"
            description="Usuarios registrados"
          />
        )}

        {canWithdraw && (
          <StatCard
            title="Retiros pendientes"
            value={dashboard.pendingWithdraws}
            icon="💸"
            description="Solicitudes por revisar"
          />
        )}

        {canWallet && (
          <StatCard
            title="Saldo disponible"
            value={`$${dashboard.availableBalance.toFixed(2)}`}
            icon="💰"
            description="Balance disponible en wallets"
          />
        )}

        {canTickets && (
          <StatCard
            title="Tickets abiertos"
            value={dashboard.openTickets}
            icon="💬"
            description="Casos pendientes"
          />
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">
                  Estado de módulos
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Supervisión general del ecosistema.
                </p>
              </div>

              <Badge variant="success">
                Sistema estable
              </Badge>
            </div>
          </Card.Header>

          <Card.Body className="p-0">
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>
                    Módulo
                  </Table.Header>

                  <Table.Header>
                    Estado
                  </Table.Header>

                  <Table.Header>
                    Acción
                  </Table.Header>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {visibleModules.map(
                  (module) => (
                    <Table.Row
                      key={
                        module.name
                      }
                    >
                      <Table.Cell className="font-semibold">
                        {
                          module.name
                        }
                      </Table.Cell>

                      <Table.Cell>
                        <Badge variant="success">
                          {
                            module.status
                          }
                        </Badge>
                      </Table.Cell>

                      <Table.Cell>
                        <Link
                          href={
                            module.href
                          }
                          className="inline-flex rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-cyan-400"
                        >
                          Abrir
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold">
              Accesos rápidos
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Herramientas principales del administrador.
            </p>
          </Card.Header>

          <Card.Body>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {visibleModules.map(
                (module) => (
                  <Link
                    key={
                      module.href
                    }
                    href={
                      module.href
                    }
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-cyan-400"
                  >
                    <span className="font-semibold">
                      {
                        module.name
                      }
                    </span>

                    <span className="text-cyan-300">
                      →
                    </span>
                  </Link>
                ),
              )}
            </div>
          </Card.Body>
        </Card>
      </section>

      {canAudit && (
        <Card>
        <Card.Header>
          <h2 className="text-xl font-bold">
            Actividad reciente
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Últimos eventos reales registrados por la plataforma.
          </p>
        </Card.Header>

        <Card.Body className="p-0">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>
                  Acción
                </Table.Header>

                <Table.Header>
                  Objetivo
                </Table.Header>

                <Table.Header>
                  Detalle
                </Table.Header>

                <Table.Header>
                  Fecha
                </Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {dashboard.activity.length ===
              0 ? (
                <Table.Row>
                  <Table.Cell
                    colSpan={4}
                    className="py-10 text-center text-slate-400"
                  >
                    No hay actividad administrativa registrada.
                  </Table.Cell>
                </Table.Row>
              ) : (
                dashboard.activity.map(
                  (
                    activity,
                    index,
                  ) => (
                    <Table.Row
                      key={
                        activity.id ??
                        `${activity.target_id}-${activity.created_at}-${index}`
                      }
                    >
                      <Table.Cell className="font-semibold">
                        {formatAction(
                          activity.action,
                        )}
                      </Table.Cell>

                      <Table.Cell className="font-mono text-cyan-300">
                        {
                          activity.target_id
                        }
                      </Table.Cell>

                      <Table.Cell>
                        {
                          activity.details ??
                          "Sin detalle"
                        }
                      </Table.Cell>

                      <Table.Cell className="text-slate-400">
                        {new Date(
                          activity.created_at,
                        ).toLocaleString()}
                      </Table.Cell>
                    </Table.Row>
                  ),
                )
              )}
            </Table.Body>
          </Table>
        </Card.Body>
        </Card>
      )}
    </main>
  );
}