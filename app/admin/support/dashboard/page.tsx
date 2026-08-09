"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getTickets,
} from "@/lib/support";

type TicketRow = {
  id: string;
  priority: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

function normalized(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

function isOpen(
  value: string,
): boolean {
  const status =
    normalized(value);

  return (
    status === "open" ||
    status === "abierto"
  );
}

function isReview(
  value: string,
): boolean {
  const status =
    normalized(value);

  return (
    status === "in_review" ||
    status === "review" ||
    status === "en revisión" ||
    status === "en revision"
  );
}

function isResolved(
  value: string,
): boolean {
  const status =
    normalized(value);

  return (
    status === "resolved" ||
    status === "closed" ||
    status === "resuelto"
  );
}

function isUrgent(
  value: string,
): boolean {
  const priority =
    normalized(value);

  return (
    priority === "urgent" ||
    priority === "urgente"
  );
}

function happenedToday(
  value: string | null,
): boolean {
  if (!value) {
    return false;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return false;
  }

  const now =
    new Date();

  return (
    date.getFullYear() ===
      now.getFullYear() &&
    date.getMonth() ===
      now.getMonth() &&
    date.getDate() ===
      now.getDate()
  );
}

export default function SupportDashboardPage() {
  const [
    tickets,
    setTickets,
  ] = useState<TicketRow[]>([]);

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

    async function loadTickets() {
      setLoading(true);
      setError(null);

      const {
        data,
        error: loadError,
      } = await getTickets();

      if (!active) {
        return;
      }

      if (loadError) {
        console.error(
          "VYRO Support Dashboard load error:",
          loadError,
        );

        setTickets([]);
        setError(
          "No se pudieron cargar las métricas de soporte.",
        );
        setLoading(false);

        return;
      }

      setTickets(
        (data ?? []) as TicketRow[],
      );

      setLoading(false);
    }

    void loadTickets();

    return () => {
      active = false;
    };
  }, []);

  const stats =
    useMemo(() => {
      const open =
        tickets.filter(
          (ticket) =>
            isOpen(
              ticket.status,
            ),
        ).length;

      const review =
        tickets.filter(
          (ticket) =>
            isReview(
              ticket.status,
            ),
        ).length;

      const urgent =
        tickets.filter(
          (ticket) =>
            isUrgent(
              ticket.priority,
            ),
        ).length;

      const resolved =
        tickets.filter(
          (ticket) =>
            isResolved(
              ticket.status,
            ),
        );

      const resolvedToday =
        resolved.filter(
          (ticket) =>
            happenedToday(
              ticket.updated_at,
            ),
        ).length;

      return [
        {
          title:
            "Tickets abiertos",
          value: open,
          icon: "🎫",
        },
        {
          title:
            "En revisión",
          value: review,
          icon: "🟡",
        },
        {
          title:
            "Urgentes",
          value: urgent,
          icon: "🔴",
        },
        {
          title:
            "Resueltos hoy",
          value: resolvedToday,
          icon: "✅",
        },
        {
          title:
            "Total tickets",
          value:
            tickets.length,
          icon: "📊",
        },
        {
          title:
            "Total resueltos",
          value:
            resolved.length,
          icon: "🏁",
        },
      ];
    }, [tickets]);

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          💬 Dashboard de Soporte
        </h1>

        <p className="mt-2 text-slate-400">
          Centro de monitoreo del equipo de soporte.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-slate-400">
          Cargando métricas reales...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stats.map(
          (item) => (
            <div
              key={
                item.title
              }
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">
                  {
                    item.icon
                  }
                </span>

                <span className="text-3xl font-bold text-cyan-400">
                  {
                    item.value
                  }
                </span>
              </div>

              <p className="mt-4 text-slate-300">
                {
                  item.title
                }
              </p>
            </div>
          ),
        )}
      </div>
    </main>
  );
}