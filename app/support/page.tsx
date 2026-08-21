"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  StatCard,
  Textarea,
} from "@/components/ui";
import { supabase } from "@/lib/supabase";
import {
  createTicket,
  getOwnTickets,
  getTicketMessages,
  sendMessage,
  subscribeToSupportMessages,
  unsubscribeSupportChannel,
} from "@/lib/support";

type TicketStatus =
  | "Abierto"
  | "En revisión"
  | "Resuelto";

type TicketPriority =
  | "Normal"
  | "Alta"
  | "Urgente";

type SupportTicketRow = {
  id: string;
  subject: string;
  category: string;
  status: string | null;
  priority: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type UserTicket = {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  updatedAt: string;
};

type SupportMessageRow = {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

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
    useState<UserTicket[]>([]);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [loadingTickets, setLoadingTickets] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [feedback, setFeedback] =
    useState("");

  const [
    selectedTicketId,
    setSelectedTicketId,
  ] = useState<string | null>(null);

  const [
    ticketMessages,
    setTicketMessages,
  ] = useState<SupportMessageRow[]>([]);

  const [
    replyMessage,
    setReplyMessage,
  ] = useState("");

  const [
    loadingConversation,
    setLoadingConversation,
  ] = useState(false);

  const [
    sendingReply,
    setSendingReply,
  ] = useState(false);

  const loadOwnTickets = useCallback(
    async (userId: string) => {
      const {
        data,
        error,
      } = await getOwnTickets(userId);

      if (error) {
        throw error;
      }

      const rows =
        (data ?? []) as SupportTicketRow[];

      setTickets(
        rows.map((ticket) => ({
          id: ticket.id,
          subject: ticket.subject,
          category: ticket.category,
          status: normalizeTicketStatus(
            ticket.status,
          ),
          priority: normalizeTicketPriority(
            ticket.priority,
          ),
          updatedAt:
            ticket.updated_at ??
            ticket.created_at ??
            "",
        })),
      );
    },
    [],
  );

  useEffect(() => {
    let active = true;

    async function initialize() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (userError || !user) {
        setCurrentUserId(null);
        setTickets([]);
        setLoadingTickets(false);
        setFeedback(
          "Debes iniciar sesión para utilizar el Centro de Soporte.",
        );
        return;
      }

      setCurrentUserId(user.id);

      try {
        await loadOwnTickets(user.id);
      }
      catch (error) {
        console.error(
          "VYRO Support load error:",
          error,
        );

        if (active) {
          setFeedback(
            "No fue posible cargar tus solicitudes de soporte.",
          );
        }
      }
      finally {
        if (active) {
          setLoadingTickets(false);
        }
      }
    }

    void initialize();

    return () => {
      active = false;
    };
  }, [loadOwnTickets]);

  const loadTicketMessages = useCallback(
    async (ticketId: string) => {
      const {
        data,
        error,
      } = await getTicketMessages(ticketId);

      if (error) {
        throw error;
      }

      setTicketMessages(
        (data ?? []) as SupportMessageRow[],
      );
    },
    [],
  );

  useEffect(() => {
    if (selectedTicketId === null) {
      setTicketMessages([]);
      return;
    }

    const ticketId: string =
      selectedTicketId;

    let active = true;

    async function loadConversation() {
      setLoadingConversation(true);

      try {
        await loadTicketMessages(ticketId);
      }
      catch (error) {
        console.error(
          "VYRO Support conversation load error:",
          error,
        );

        if (active) {
          setFeedback(
            "No fue posible cargar la conversación.",
          );
        }
      }
      finally {
        if (active) {
          setLoadingConversation(false);
        }
      }
    }

    void loadConversation();

    const channel =
      subscribeToSupportMessages(
        ticketId,
        () => {
          if (active) {
            void loadTicketMessages(ticketId);
          }
        },
      );

    return () => {
      active = false;

      void unsubscribeSupportChannel(
        channel,
      );
    };
  }, [
    loadTicketMessages,
    selectedTicketId,
  ]);

  async function sendReply() {
    if (selectedTicketId === null) {
      return;
    }

    const ticketId: string =
      selectedTicketId;

    const text =
      replyMessage.trim();

    if (!text) {
      return;
    }

    setSendingReply(true);
    setFeedback("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setFeedback(
          "Debes iniciar sesión para responder.",
        );
        return;
      }

      const {
        error,
      } = await sendMessage({
        ticket_id: ticketId,
        sender_id: user.id,
        message: text,
      });

      if (error) {
        throw error;
      }

      setReplyMessage("");

      await loadTicketMessages(ticketId);
    }
    catch (error) {
      console.error(
        "VYRO Support reply error:",
        error,
      );

      setFeedback(
        error instanceof Error
          ? error.message
          : "No fue posible enviar el mensaje.",
      );
    }
    finally {
      setSendingReply(false);
    }
  }
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

  async function submitTicket() {
    if (
      !subject.trim() ||
      !message.trim()
    ) {
      setFeedback(
        "Completa el asunto y la descripción.",
      );
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (
        userError ||
        !user ||
        !currentUserId ||
        user.id !== currentUserId
      ) {
        setFeedback(
          "Debes iniciar sesión para enviar una solicitud.",
        );
        return;
      }

      const {
        data: createdTicket,
        error: ticketError,
      } = await createTicket({
        user_id: user.id,
        subject: subject.trim(),
        category,
        priority:
          toDatabasePriority(priority),
      });

      if (
        ticketError ||
        !createdTicket
      ) {
        throw (
          ticketError ??
          new Error(
            "Supabase no devolvió el ticket creado.",
          )
        );
      }

      const {
        error: messageError,
      } = await sendMessage({
        ticket_id: createdTicket.id,
        sender_id: user.id,
        message: message.trim(),
      });

      if (messageError) {
        throw new Error(
          `El ticket fue creado, pero no se pudo guardar la descripción: ${messageError.message}`,
        );
      }

      await loadOwnTickets(user.id);

      setSubject("");
      setCategory("General");
      setPriority("Normal");
      setMessage("");

      setFeedback(
        "Solicitud creada correctamente.",
      );
    }
    catch (error) {
      console.error(
        "VYRO Support submit error:",
        error,
      );

      setFeedback(
        error instanceof Error
          ? error.message
          : "No fue posible crear la solicitud.",
      );
    }
    finally {
      setSubmitting(false);
    }
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
                onClick={() => {
                  void submitTicket();
                }}
                disabled={
                  submitting ||
                  !currentUserId
                }
                className="w-full"
              >
                {submitting
                  ? "Enviando..."
                  : "Enviar solicitud"}
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
              {loadingTickets ? (
                <p className="text-sm text-slate-400">
                  Cargando solicitudes...
                </p>
              ) : tickets.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Todavía no tienes solicitudes de soporte.
                </p>
              ) : (
                tickets.map((ticket) => (
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
                        {ticket.updatedAt
                          ? new Date(
                              ticket.updatedAt,
                            ).toLocaleString()
                          : "Sin fecha"}
                      </span>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedTicketId(
                            ticket.id,
                          );
                          setFeedback("");
                        }}
                      >
                        Abrir conversación
                      </Button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </Card.Body>
        </Card>
      </section>

      {selectedTicketId && (
        <Card>
          <Card.Header>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Conversación
                </h2>

                <p className="mt-1 font-mono text-xs text-cyan-300">
                  {selectedTicketId}
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedTicketId(null);
                  setReplyMessage("");
                  setTicketMessages([]);
                }}
              >
                Cerrar conversación
              </Button>
            </div>
          </Card.Header>

          <Card.Body>
            <div className="space-y-5">
              {loadingConversation ? (
                <p className="text-sm text-slate-400">
                  Cargando conversación...
                </p>
              ) : ticketMessages.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Este ticket todavía no tiene mensajes.
                </p>
              ) : (
                <div className="space-y-3">
                  {ticketMessages.map(
                    (supportMessage) => {
                      const ownMessage =
                        supportMessage.sender_id ===
                        currentUserId;

                      return (
                        <article
                          key={supportMessage.id}
                          className={
                            ownMessage
                              ? "ml-auto max-w-3xl rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4"
                              : "mr-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
                          }
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-cyan-300">
                              {ownMessage
                                ? "Tú"
                                : "Soporte VYRO"}
                            </span>

                            <span className="text-xs text-slate-500">
                              {new Date(
                                supportMessage.created_at,
                              ).toLocaleString()}
                            </span>
                          </div>

                          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
                            {supportMessage.message}
                          </p>
                        </article>
                      );
                    },
                  )}
                </div>
              )}

              <div className="border-t border-slate-800 pt-5">
                <Textarea
                  label="Responder"
                  placeholder="Escribe un mensaje para el equipo de soporte."
                  value={replyMessage}
                  onChange={(event) =>
                    setReplyMessage(
                      event.target.value,
                    )
                  }
                />

                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => {
                      void sendReply();
                    }}
                    disabled={
                      sendingReply ||
                      !replyMessage.trim()
                    }
                  >
                    {sendingReply
                      ? "Enviando..."
                      : "Enviar mensaje"}
                  </Button>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </main>
  );
}

function normalizeTicketPriority(
  value: string | null,
): TicketPriority {
  const normalized =
    value?.trim().toLowerCase() ?? "";

  if (
    normalized === "urgent" ||
    normalized === "urgente"
  ) {
    return "Urgente";
  }

  if (
    normalized === "high" ||
    normalized === "alta"
  ) {
    return "Alta";
  }

  return "Normal";
}

function normalizeTicketStatus(
  value: string | null,
): TicketStatus {
  const normalized =
    value?.trim().toLowerCase() ?? "";

  if (
    normalized === "resolved" ||
    normalized === "closed" ||
    normalized === "resuelto"
  ) {
    return "Resuelto";
  }

  if (
    normalized === "review" ||
    normalized === "in_review" ||
    normalized === "in review" ||
    normalized === "en revisión"
  ) {
    return "En revisión";
  }

  return "Abierto";
}

function toDatabasePriority(
  priority: TicketPriority,
) {
  if (priority === "Urgente") {
    return "urgent";
  }

  if (priority === "Alta") {
    return "high";
  }

  return "normal";
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
