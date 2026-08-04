"use client";

import { useMemo, useState } from "react";

import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  StatCard,
  Textarea,
} from "@/components/ui";

type TicketStatus =
  | "Abierto"
  | "En revisión"
  | "Resuelto";

type TicketPriority =
  | "Normal"
  | "Alta"
  | "Urgente";

type UserTicket = {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  updatedAt: string;
};

const initialTickets: UserTicket[] = [
  {
    id: "TCK-0001",
    subject: "Problema con Wallet",
    category: "Wallet",
    status: "En revisión",
    priority: "Alta",
    updatedAt: "2026-08-04T00:15:00.000Z",
  },
  {
    id: "TCK-0002",
    subject: "Consulta sobre Academy",
    category: "Academy",
    status: "Resuelto",
    priority: "Normal",
    updatedAt: "2026-08-02T18:30:00.000Z",
  },
];

export default function SupportPage() {
  const [subject, setSubject] =
    useState("");

  const [category, setCategory] =
    useState("General");

  const [priority, setPriority] =
    useState<TicketPriority>("Normal");

  const [message, setMessage] =
    useState("");

  const [tickets, setTickets] =
    useState<UserTicket[]>(
      initialTickets,
    );

  const [feedback, setFeedback] =
    useState("");

  const openCount = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          ticket.status !== "Resuelto",
      ).length,
    [tickets],
  );

  const resolvedCount = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          ticket.status === "Resuelto",
      ).length,
    [tickets],
  );

  function submitTicket() {
    if (
      !subject.trim() ||
      !message.trim()
    ) {
      setFeedback(
        "Completa el asunto y la descripción.",
      );
      return;
    }

    const ticket: UserTicket = {
      id:
        `TCK-${String(
          tickets.length + 1,
        ).padStart(4, "0")}`,
      subject: subject.trim(),
      category,
      status: "Abierto",
      priority,
      updatedAt:
        new Date().toISOString(),
    };

    setTickets((current) => [
      ticket,
      ...current,
    ]);

    setSubject("");
    setCategory("General");
    setPriority("Normal");
    setMessage("");

    setFeedback(
      "Solicitud creada correctamente. La conexión con Supabase se añadirá en el siguiente bloque.",
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-4xl font-bold text-white">
          Centro de Soporte
        </h1>

        <p className="mt-2 text-slate-400">
          Solicita ayuda y consulta el estado de tus conversaciones.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Tickets abiertos"
          value={openCount}
          icon="🎫"
          description="Solicitudes activas"
        />

        <StatCard
          title="Tickets resueltos"
          value={resolvedCount}
          icon="✅"
          description="Casos finalizados"
        />

        <StatCard
          title="Soporte"
          value="Disponible"
          icon="💬"
          description="Equipo administrativo"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold">
              Nueva solicitud
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Describe el problema con la mayor claridad posible.
            </p>
          </Card.Header>

          <Card.Body>
            <div className="space-y-5">
              <Input
                label="Asunto"
                placeholder="Ejemplo: No puedo retirar fondos"
                value={subject}
                onChange={(event) =>
                  setSubject(
                    event.target.value,
                  )
                }
              />

              <Select
                label="Categoría"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value,
                  )
                }
              >
                <option value="General">
                  General
                </option>

                <option value="Wallet">
                  Wallet
                </option>

                <option value="Marketplace">
                  Marketplace
                </option>

                <option value="Academy">
                  Academy
                </option>

                <option value="Live">
                  Live
                </option>

                <option value="VYRO Card">
                  VYRO Card
                </option>

                <option value="Cuenta">
                  Cuenta
                </option>
              </Select>

              <Select
                label="Prioridad"
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target
                      .value as TicketPriority,
                  )
                }
              >
                <option value="Normal">
                  Normal
                </option>

                <option value="Alta">
                  Alta
                </option>

                <option value="Urgente">
                  Urgente
                </option>
              </Select>

              <Textarea
                label="Descripción"
                placeholder="Explica qué ocurrió, cuándo comenzó y qué intentaste hacer."
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value,
                  )
                }
              />

              {feedback && (
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-200">
                  {feedback}
                </div>
              )}

              <Button
                onClick={submitTicket}
                className="w-full"
              >
                Enviar solicitud
              </Button>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold">
              Mis conversaciones
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Historial de tickets y respuestas del equipo.
            </p>
          </Card.Header>

          <Card.Body>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <article
                  key={ticket.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-mono text-sm text-cyan-300">
                        {ticket.id}
                      </p>

                      <h3 className="mt-2 font-bold text-white">
                        {ticket.subject}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {ticket.category}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={getPriorityVariant(
                          ticket.priority,
                        )}
                      >
                        {ticket.priority}
                      </Badge>

                      <Badge
                        variant={getStatusVariant(
                          ticket.status,
                        )}
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-slate-500">
                      Actualizado{" "}
                      {new Date(
                        ticket.updatedAt,
                      ).toLocaleString()}
                    </span>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setFeedback(
                          `Abriremos el chat de ${ticket.id} cuando conectemos la ruta dinámica con Supabase.`,
                        )
                      }
                    >
                      Abrir conversación
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </Card.Body>
        </Card>
      </section>
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

  return "info";
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

  if (status === "En revisión") {
    return "warning";
  }

  return "info";
}
