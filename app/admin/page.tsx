import Link from "next/link";

import {
  Badge,
  Card,
  StatCard,
  Table,
} from "@/components/ui";

const modules = [
  {
    name: "Usuarios",
    status: "Operativo",
    href: "/admin/users",
  },
  {
    name: "Wallet",
    status: "Operativo",
    href: "/admin/wallet",
  },
  {
    name: "Retiros",
    status: "En revisión",
    href: "/admin/withdraws",
  },
  {
    name: "Soporte",
    status: "Operativo",
    href: "/admin/support",
  },
  {
    name: "Auditoría",
    status: "Operativo",
    href: "/admin/audit",
  },
  {
    name: "Configuración",
    status: "Operativo",
    href: "/admin/settings",
  },
];

const recentActivity = [
  {
    id: "ACT-001",
    action: "Ticket abierto",
    module: "Soporte",
    status: "Pendiente",
  },
  {
    id: "ACT-002",
    action: "Retiro solicitado",
    module: "Wallet",
    status: "En revisión",
  },
  {
    id: "ACT-003",
    action: "Usuario verificado",
    module: "Identity",
    status: "Completado",
  },
];

export default function AdminHomePage() {
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

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Usuarios"
          value={0}
          icon="👥"
          description="Usuarios registrados"
        />

        <StatCard
          title="Retiros pendientes"
          value={0}
          icon="💸"
          description="Solicitudes por revisar"
        />

        <StatCard
          title="Ingresos"
          value="$0.00"
          icon="💰"
          description="Ingresos acumulados"
        />

        <StatCard
          title="Tickets abiertos"
          value={1}
          icon="💬"
          description="Casos pendientes"
        />
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
                {modules.map((module) => (
                  <Table.Row key={module.name}>
                    <Table.Cell className="font-semibold">
                      {module.name}
                    </Table.Cell>

                    <Table.Cell>
                      <Badge
                        variant={
                          module.status === "Operativo"
                            ? "success"
                            : "warning"
                        }
                      >
                        {module.status}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell>
                      <Link
                        href={module.href}
                        className="inline-flex rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-cyan-400"
                      >
                        Abrir
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
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
              {modules.slice(0, 6).map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-cyan-400"
                >
                  <span className="font-semibold">
                    {module.name}
                  </span>

                  <span className="text-cyan-300">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </Card.Body>
        </Card>
      </section>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-bold">
            Actividad reciente
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Últimos eventos registrados por la plataforma.
          </p>
        </Card.Header>

        <Card.Body className="p-0">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>
                  ID
                </Table.Header>

                <Table.Header>
                  Acción
                </Table.Header>

                <Table.Header>
                  Módulo
                </Table.Header>

                <Table.Header>
                  Estado
                </Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {recentActivity.map((activity) => (
                <Table.Row key={activity.id}>
                  <Table.Cell className="font-mono text-cyan-300">
                    {activity.id}
                  </Table.Cell>

                  <Table.Cell>
                    {activity.action}
                  </Table.Cell>

                  <Table.Cell>
                    {activity.module}
                  </Table.Cell>

                  <Table.Cell>
                    <Badge
                      variant={
                        activity.status === "Completado"
                          ? "success"
                          : "warning"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>
    </main>
  );
}
