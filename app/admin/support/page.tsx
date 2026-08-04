"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Badge,
  Card,
  Search,
  StatCard,
  Table,
} from "@/components/ui";

type TicketStatus =
  | "Abierto"
  | "En revisión"
  | "Esperando usuario"
  | "Resuelto";

type TicketPriority =
  | "Baja"
  | "Normal"
  | "Alta"
  | "Urgente";

type SupportTicket = {
  id: string;
  user: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  updatedAt: string;
};

const tickets: SupportTicket[] = [
  {
    id: "TCK-0001",
    user: "Demo User",
    subject: "Problema con Wallet",
    category: "Wallet",
    priority: "Alta",
    status: "Abierto",
    updatedAt: "2026-08-04T00:15:00.000Z",
  },
  {
    id: "TCK-0002",
    user: "María López",
    subject: "No puedo verificar mi identidad",
    category: "Member ID",
    priority: "Normal",
    status: "En revisión",
    updatedAt: "2026-08-03T22:40:00.000Z",
  },
  {
    id: "TCK-0003",
    user: "Carlos Pérez",
    subject: "Retiro pendiente",
    category: "Retiros",
    priority: "Urgente",
    status: "Esperando usuario",
    updatedAt: "2026-08-03T20:05:00.000Z",
  },
  {
    id: "TCK-0004",
    user: "Ana Torres",
    subject: "Consulta sobre Academy",
    category: "Academy",
    priority: "Baja",
    status: "Resuelto",
    updatedAt: "2026-08-02T18:30:00.000Z",
  },
];

export default function AdminSupportPage() {
  const [query, setQuery] =
    useState("");

  const filteredTickets =
    useMemo(() => {
      const normalized =
        query.trim().toLowerCase();

      if (!normalized) {
        return tickets;
      }

      return tickets.filter((ticket) =>
        [
          ticket.id,
          ticket.user,
          ticket.subject,
          ticket.category,
          ticket.priority,
          ticket.status,
        ].some((value) =>
          value
            .toLowerCase()
            .includes(normalized),
        ),
      );
    }, [query]);

  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "Abierto",
    ).length;

  const reviewTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "En revisión",
    ).length;

  const urgentTickets =
    tickets.filter(
      (ticket) =>
        ticket.priority === "Urgente",
    ).length;

  const resolvedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "Resuelto",
    ).length;

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-white">
          Centro de Soporte
        </h1>

        <p className="mt-2 text-slate-400">
          Gestiona tickets, prioridades y conversaciones con usuarios.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Tickets abiertos"
          value={openTickets}
          icon="🎫"
          description="Pendientes de atención"
        />

        <StatCard
          title="En revisión"
          value={reviewTickets}
          icon="🟡"
          description="Casos en análisis"
        />

        <StatCard
          title="Urgentes"
          value={urgentTickets}
          icon="🚨"
          description="Requieren atención inmediata"
        />

        <StatCard
          title="Resueltos"
          value={resolvedTickets}
          icon="✅"
          description="Casos finalizados"
        />
      </section>

      <Card>
        <Card.Header>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Tickets de soporte
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Busca y abre conversaciones con los usuarios.
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <Search
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value,
                  )
                }
                onClear={() =>
                  setQuery("")
                }
                placeholder="Buscar ticket, usuario o categoría..."
              />
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>
                  Ticket
                </Table.Header>

                <Table.Header>
                  Usuario
                </Table.Header>

                <Table.Header>
                  Asunto
                </Table.Header>

                <Table.Header>
                  Categoría
                </Table.Header>

                <Table.Header>
                  Prioridad
                </Table.Header>

                <Table.Header>
                  Estado
                </Table.Header>

                <Table.Header>
                  Actualizado
                </Table.Header>

                <Table.Header>
                  Acción
                </Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {filteredTickets.map(
                (ticket) => (
                  <Table.Row
                    key={ticket.id}
                  >
                    <Table.Cell className="font-mono text-cyan-300">
                      {ticket.id}
                    </Table.Cell>

                    <Table.Cell>
                      {ticket.user}
                    </Table.Cell>

                    <Table.Cell>
                      {ticket.subject}
                    </Table.Cell>

                    <Table.Cell>
                      {ticket.category}
                    </Table.Cell>

                    <Table.Cell>
                      <Badge
                        variant={getPriorityVariant(
                          ticket.priority,
                        )}
                      >
                        {ticket.priority}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell>
                      <Badge
                        variant={getStatusVariant(
                          ticket.status,
                        )}
                      >
                        {ticket.status}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell className="text-slate-400">
                      {new Date(
                        ticket.updatedAt,
                      ).toLocaleString()}
                    </Table.Cell>

                    <Table.Cell>
                      <Link
                        href={`/admin/support/${ticket.id}`}
                        className="inline-flex rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-cyan-400"
                      >
                        Abrir
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ),
              )}

              {filteredTickets.length ===
                0 && (
                <Table.Row>
                  <Table.Cell
                    colSpan={8}
                    className="py-10 text-center text-slate-400"
                  >
                    No se encontraron tickets.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>
    </main>
  );
}

function getPriorityVariant(
  priority: TicketPriority,
):
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "premium" {
  if (priority === "Urgente") {
    return "danger";
  }

  if (priority === "Alta") {
    return "warning";
  }

  if (priority === "Normal") {
    return "info";
  }

  return "default";
}

function getStatusVariant(
  status: TicketStatus,
):
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "premium" {
  if (status === "Resuelto") {
    return "success";
  }

  if (
    status === "En revisión" ||
    status === "Esperando usuario"
  ) {
    return "warning";
  }

  return "info";
}
