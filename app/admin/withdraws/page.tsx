"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import WithdrawAdminPanel, {
  type WithdrawAdminItem,
} from "@/components/admin/WithdrawAdminPanel";

import {
  approveWithdraw,
  getWithdrawRequests,
  markWithdrawPaid,
  rejectWithdraw,
} from "@/lib/admin";

type WithdrawRow = {
  id: string;
  user_id: string;
  amount: number | string;
  status: string;
  created_at: string;
};

function normalizeStatus(
  status: string,
): WithdrawAdminItem["status"] {
  switch (status.trim().toLowerCase()) {
    case "approved":
      return "approved";

    case "rejected":
      return "rejected";

    case "paid":
      return "paid";

    default:
      return "pending";
  }
}

function toAmount(
  value: number | string,
): number {
  const amount =
    typeof value === "number"
      ? value
      : Number(value);

  return Number.isFinite(amount)
    ? amount
    : 0;
}

export default function AdminWithdrawsPage() {
  const [
    requests,
    setRequests,
  ] = useState<WithdrawAdminItem[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    actionId,
    setActionId,
  ] = useState<string | null>(null);

  const loadRequests =
    useCallback(async () => {
      setLoading(true);
      setError(null);

      const {
        data,
        error: withdrawError,
      } = await getWithdrawRequests();

      if (withdrawError) {
        console.error(
          "VYRO Admin Withdraws load error:",
          withdrawError,
        );

        setRequests([]);
        setError(
          "No se pudieron cargar las solicitudes de retiro.",
        );
        setLoading(false);
        return;
      }

      const rows =
        (data ?? []) as WithdrawRow[];

      setRequests(
        rows.map((row) => ({
          id: row.id,
          userName: row.user_id,
          amount: toAmount(row.amount),
          createdAt: row.created_at,
          status: normalizeStatus(
            row.status,
          ),
        })),
      );

      setLoading(false);
    }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  async function runAction(
    id: string,
    action: (
      withdrawId: string,
    ) => ReturnType<
      typeof approveWithdraw
    >,
  ) {
    if (actionId !== null) {
      return;
    }

    setActionId(id);
    setError(null);

    const {
      error: actionError,
    } = await action(id);

    if (actionError) {
      console.error(
        "VYRO Admin Withdraw action error:",
        actionError,
      );

      setError(
        "No se pudo actualizar la solicitud de retiro.",
      );

      setActionId(null);
      return;
    }

    await loadRequests();
    setActionId(null);
  }

  return (
    <section className="space-y-8">
      {loading && (
        <p className="text-sm text-slate-400">
          Cargando solicitudes de retiro...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        requests.length === 0 && (
          <p className="text-sm text-slate-400">
            No hay solicitudes de retiro registradas.
          </p>
        )}

      <WithdrawAdminPanel
        requests={requests}
        onApprove={(id) => {
          void runAction(
            id,
            approveWithdraw,
          );
        }}
        onReject={(id) => {
          void runAction(
            id,
            rejectWithdraw,
          );
        }}
        onPay={(id) => {
          void runAction(
            id,
            markWithdrawPaid,
          );
        }}
      />

      {actionId && (
        <p className="text-sm text-cyan-300">
          Actualizando solicitud...
        </p>
      )}
    </section>
  );
}
