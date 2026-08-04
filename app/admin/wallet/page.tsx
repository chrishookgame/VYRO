import {
  Badge,
  Card,
  EmptyState,
  StatCard,
  Table,
} from "@/components/ui";

const movements = [
  {
    id: "MOV-001",
    user: "Demo User",
    type: "Recompensa",
    amount: 250,
    status: "Completado",
    date: "2026-08-04",
  },
  {
    id: "MOV-002",
    user: "Demo User",
    type: "Retiro",
    amount: -75,
    status: "Pendiente",
    date: "2026-08-03",
  },
];

export default function AdminWalletPage() {
  const totalAvailable = 0;
  const totalPending = 0;
  const totalEarned = 0;
  const totalMovements = movements.length;

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-white">
          Wallet Enterprise
        </h1>

        <p className="mt-2 text-slate-400">
          Supervisión financiera global de VYRO.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Saldo disponible"
          value={`$${totalAvailable.toFixed(2)}`}
          icon="💰"
          description="Fondos disponibles"
        />

        <StatCard
          title="Saldo pendiente"
          value={`$${totalPending.toFixed(2)}`}
          icon="⏳"
          description="Movimientos en proceso"
        />

        <StatCard
          title="Total generado"
          value={`$${totalEarned.toFixed(2)}`}
          icon="📈"
          description="Ingresos acumulados"
        />

        <StatCard
          title="Movimientos"
          value={totalMovements}
          icon="📋"
          description="Operaciones registradas"
        />
      </section>

      <Card>
        <Card.Header>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Historial financiero
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Movimientos recientes de Wallet.
              </p>
            </div>

            <Badge variant="info">
              Datos de demostración
            </Badge>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {movements.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No hay movimientos"
                description="Los movimientos financieros aparecerán aquí."
                icon="💳"
              />
            </div>
          ) : (
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>
                    Movimiento
                  </Table.Header>

                  <Table.Header>
                    Usuario
                  </Table.Header>

                  <Table.Header>
                    Tipo
                  </Table.Header>

                  <Table.Header>
                    Monto
                  </Table.Header>

                  <Table.Header>
                    Estado
                  </Table.Header>

                  <Table.Header>
                    Fecha
                  </Table.Header>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {movements.map((movement) => (
                  <Table.Row key={movement.id}>
                    <Table.Cell className="font-mono text-cyan-300">
                      {movement.id}
                    </Table.Cell>

                    <Table.Cell>
                      {movement.user}
                    </Table.Cell>

                    <Table.Cell>
                      {movement.type}
                    </Table.Cell>

                    <Table.Cell
                      className={
                        movement.amount >= 0
                          ? "font-semibold text-emerald-300"
                          : "font-semibold text-red-300"
                      }
                    >
                      {movement.amount >= 0
                        ? "+"
                        : ""}
                      ${movement.amount.toFixed(2)}
                    </Table.Cell>

                    <Table.Cell>
                      <Badge
                        variant={
                          movement.status === "Completado"
                            ? "success"
                            : "warning"
                        }
                      >
                        {movement.status}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell className="text-slate-400">
                      {new Date(
                        movement.date,
                      ).toLocaleDateString()}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Card.Body>
      </Card>
    </section>
  );
}
