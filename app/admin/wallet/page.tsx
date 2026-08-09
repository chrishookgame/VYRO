"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Badge,
  Card,
  EmptyState,
  StatCard,
  Table,
} from "@/components/ui";

import {
  getAdminWalletSnapshot,
  type AdminWalletSnapshot,
  type AdminWalletTransactionRow,
} from "@/lib/admin/wallet";

type WalletMovement = {
  id: string;
  user: string;
  type: string;
  amount: number;
  status: "Completado" | "Pendiente";
  date: string;
};

function toNumber(
  value: number | string | null,
): number {
  const parsed =
    typeof value === "number"
      ? value
      : Number(value ?? 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function getProfileName(
  snapshot: AdminWalletSnapshot,
  userId: string,
): string {
  const profile =
    snapshot.profiles.find(
      (item) => item.id === userId,
    );

  return (
    profile?.full_name?.trim() ||
    profile?.username?.trim() ||
    userId
  );
}

function getMovementStatus(
  transaction: AdminWalletTransactionRow,
): WalletMovement["status"] {
  const type =
    transaction.type
      .trim()
      .toLowerCase();

  if (
    type.includes("pending") ||
    type.includes("pendiente")
  ) {
    return "Pendiente";
  }

  return "Completado";
}

export default function AdminWalletPage() {
  const [snapshot, setSnapshot] =
    useState<AdminWalletSnapshot>({
      wallets: [],
      transactions: [],
      profiles: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadWallet() {
      setLoading(true);
      setError(null);

      try {
        const realSnapshot =
          await getAdminWalletSnapshot();

        if (!active) {
          return;
        }

        setSnapshot(realSnapshot);
      } catch (loadError) {
        console.error(
          "VYRO Admin Wallet load error:",
          loadError,
        );

        if (!active) {
          return;
        }

        setSnapshot({
          wallets: [],
          transactions: [],
          profiles: [],
        });

        setError(
          "No se pudieron cargar los datos financieros.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadWallet();

    return () => {
      active = false;
    };
  }, []);

  const walletById =
    useMemo(
      () =>
        new Map(
          snapshot.wallets.map(
            (wallet) => [
              wallet.id,
              wallet,
            ],
          ),
        ),
      [snapshot.wallets],
    );

  const movements =
    useMemo<WalletMovement[]>(
      () =>
        snapshot.transactions.map(
          (transaction) => {
            const wallet =
              walletById.get(
                transaction.wallet_id,
              );

            const rawAmount =
              toNumber(transaction.amount);

            const normalizedType =
              transaction.type
                .trim()
                .toLowerCase();

            const isWithdrawal =
              normalizedType.includes(
                "withdraw",
              ) ||
              normalizedType.includes(
                "retiro",
              );

            const amount =
              isWithdrawal
                ? -Math.abs(rawAmount)
                : rawAmount;

            return {
              id:
                transaction.reference?.trim() ||
                transaction.id,
              user: wallet
                ? getProfileName(
                    snapshot,
                    wallet.user_id,
                  )
                : transaction.wallet_id,
              type:
                transaction.description?.trim() ||
                transaction.type,
              amount,
              status:
                getMovementStatus(
                  transaction,
                ),
              date:
                transaction.created_at,
            };
          },
        ),
      [
        snapshot,
        walletById,
      ],
    );

  const totalAvailable =
    useMemo(
      () =>
        snapshot.wallets.reduce(
          (total, wallet) =>
            total +
            toNumber(
              wallet.available_balance,
            ),
          0,
        ),
      [snapshot.wallets],
    );

  const totalPending =
    useMemo(
      () =>
        snapshot.wallets.reduce(
          (total, wallet) =>
            total +
            toNumber(
              wallet.pending_balance,
            ),
          0,
        ),
      [snapshot.wallets],
    );

  const totalEarned =
    useMemo(
      () =>
        snapshot.wallets.reduce(
          (total, wallet) =>
            total +
            toNumber(
              wallet.lifetime_earnings,
            ),
          0,
        ),
      [snapshot.wallets],
    );

  const totalMovements =
    movements.length;

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

            <Badge variant="success">
              Datos reales
            </Badge>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {loading ? (
            <div className="p-6">
              <EmptyState
                title="Cargando Wallet"
                description="Consultando información financiera."
                icon="⏳"
              />
            </div>
          ) : error ? (
            <div className="p-6">
              <EmptyState
                title="No se pudo cargar Wallet"
                description={error}
                icon="⚠️"
              />
            </div>
          ) : movements.length === 0 ? (
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
                {movements.map(
                  (movement) => (
                    <Table.Row
                      key={movement.id}
                    >
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
                        $
                        {movement.amount.toFixed(
                          2,
                        )}
                      </Table.Cell>

                      <Table.Cell>
                        <Badge
                          variant={
                            movement.status ===
                            "Completado"
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
                  ),
                )}
              </Table.Body>
            </Table>
          )}
        </Card.Body>
      </Card>
    </section>
  );
}