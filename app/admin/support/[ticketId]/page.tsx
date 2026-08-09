"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  Badge,
  Card,
} from "@/components/ui";

import {
  getSupportUserProfiles,
  getTicketMessages,
  getTickets,
} from "@/lib/support";

type TicketRow = {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

type ProfileRow = {
  id: string;
  username: string;
  full_name: string | null;
};

type MessageRow = {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

type TicketDetail = {
  ticket: TicketRow;
  user: ProfileRow | null;
  messages: MessageRow[];
};

function formatDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return date.toLocaleString();
}

export default function AdminSupportTicketPage({
  params,
}: {
  params: Promise<{
    ticketId: string;
  }>;
}) {
  const [ticketId, setTicketId] =
    useState<string | null>(null);

  const [detail, setDetail] =
    useState<TicketDetail | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function resolveParams() {
      const resolved = await params;

      if (active) {
        setTicketId(resolved.ticketId);
      }
    }

    void resolveParams();

    return () => {
      active = false;
    };
  }, [params]);

  useEffect(() => {
    if (!ticketId) {
      return;
    }

    let active = true;

    async function loadTicket() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: ticketData,
          error: ticketError,
        } = await getTickets();

        if (ticketError) {
          throw ticketError;
        }

        const tickets =
          (ticketData ?? []) as TicketRow[];

        const ticket =
          tickets.find(
            (item) =>
              item.id === ticketId,
          ) ?? null;

        if (!ticket) {
          if (active) {
            setDetail(null);
            setError(
              "El ticket solicitado no existe o no está disponible.",
            );
            setLoading(false);
          }

          return;
        }

        const [
          profileResult,
          messageResult,
        ] = await Promise.all([
          getSupportUserProfiles([
            ticket.user_id,
          ]),
          getTicketMessages(
            ticket.id,
          ),
        ]);

        if (profileResult.error) {
          throw profileResult.error;
        }

        if (messageResult.error) {
          throw messageResult.error;
        }

        const profiles =
          (profileResult.data ??
            []) as ProfileRow[];

        const messages =
          (messageResult.data ??
            []) as MessageRow[];

        if (active) {
          setDetail({
            ticket,
            user:
              profiles.find(
                (profile) =>
                  profile.id ===
                  ticket.user_id,
              ) ?? null,
            messages,
          });

          setLoading(false);
        }
      }
      catch (loadError) {
        console.error(
          "VYRO Admin Support ticket detail load error:",
          loadError,
        );

        if (active) {
          setDetail(null);
          setError(
            "No se pudo cargar el ticket.",
          );
          setLoading(false);
        }
      }
    }

    void loadTicket();

    return () => {
      active = false;
    };
  }, [ticketId]);

  if (loading || !ticketId) {
    return (
      <main className="space-y-6">
        <p className="text-slate-400">
          Cargando ticket...
        </p>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className="space-y-6">
        <Link
          href="/admin/support"
          className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          ← Volver a soporte
        </Link>

        <Card>
          <Card.Body>
            <p className="text-red-300">
              {error ??
                "No se pudo cargar el ticket."}
            </p>
          </Card.Body>
        </Card>
      </main>
    );
  }

  const {
    ticket,
    user,
    messages,
  } = detail;

  const userName =
    user?.full_name?.trim() ||
    user?.username?.trim() ||
    ticket.user_id;

  return (
    <main className="space-y-8">
      <header className="space-y-4">
        <Link
          href="/admin/support"
          className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          ← Volver a soporte
        </Link>

        <div>
          <h1 className="text-4xl font-bold text-white">
            Ticket de soporte
          </h1>

          <p className="mt-2 font-mono text-sm text-cyan-300">
            {ticket.id}
          </p>
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-slate-400">
              Usuario
            </p>

            <p className="mt-2 font-semibold text-white">
              {userName}
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-slate-400">
              Categoría
            </p>

            <p className="mt-2 font-semibold text-white">
              {ticket.category}
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-slate-400">
              Prioridad
            </p>

            <div className="mt-2">
              <Badge variant="warning">
                {ticket.priority}
              </Badge>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-slate-400">
              Estado
            </p>

            <div className="mt-2">
              <Badge>
                {ticket.status}
              </Badge>
            </div>
          </Card.Body>
        </Card>
      </section>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-bold">
            {ticket.subject}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Creado:{" "}
            {formatDate(
              ticket.created_at,
            )}
          </p>

          <p className="text-sm text-slate-400">
            Actualizado:{" "}
            {formatDate(
              ticket.updated_at,
            )}
          </p>
        </Card.Header>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-bold">
            Conversación
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {messages.length} mensaje(s)
          </p>
        </Card.Header>

        <Card.Body>
          {messages.length === 0 ? (
            <p className="text-slate-400">
              Este ticket todavía no tiene mensajes.
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map(
                (message) => (
                  <article
                    key={message.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-xs text-cyan-300">
                        {message.sender_id}
                      </span>

                      <span className="text-xs text-slate-500">
                        {formatDate(
                          message.created_at,
                        )}
                      </span>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-slate-200">
                      {message.message}
                    </p>
                  </article>
                ),
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </main>
  );
}
