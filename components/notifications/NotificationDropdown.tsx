"use client";

import Link from "next/link";
import type { Notification } from "@/lib/notifications/types";

interface NotificationDropdownProps {
  notifications: Notification[];
  loading?: boolean;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

export default function NotificationDropdown({
  notifications,
  loading = false,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  if (loading) {
    return (
      <div className="w-96 rounded-2xl border border-white/10 bg-zinc-950 p-5 text-sm text-zinc-400 shadow-2xl">
        Cargando notificaciones...
      </div>
    );
  }

  return (
    <div className="w-96 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <h2 className="font-semibold text-white">Notificaciones</h2>
          <p className="text-xs text-zinc-400">
            Actividad reciente de tu cuenta
          </p>
        </div>

        <button
          type="button"
          onClick={onMarkAllAsRead}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
        >
          Marcar todas
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="font-medium text-white">
              No tienes notificaciones
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Cuando haya actividad nueva aparecerá aquí.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const unread = !notification.read_at;

            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => onMarkAsRead?.(notification.id)}
                className={`block w-full border-b border-white/5 px-4 py-4 text-left transition hover:bg-white/5 ${
                  unread ? "bg-cyan-500/5" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className="mt-2">
                    <span
                      className={`block h-2 w-2 rounded-full ${
                        unread ? "bg-cyan-400" : "bg-zinc-700"
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">
                      {notification.title}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-zinc-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="border-t border-white/10 px-4 py-3 text-center">
        <Link
          href="/notifications"
          className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          Ver todas las notificaciones
        </Link>
      </div>
    </div>
  );
}
