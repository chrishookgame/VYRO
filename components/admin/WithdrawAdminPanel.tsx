"use client";

import { useState } from "react";

export type WithdrawAdminItem = {
  id: string;
  userName: string;
  amount: number;
  createdAt: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "paid";
};

type Props = {
  requests: WithdrawAdminItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPay: (id: string) => void;
};

export default function WithdrawAdminPanel({
  requests,
  onApprove,
  onReject,
  onPay,
}: Props) {

  const [filter] =
    useState<
      "all" |
      "pending" |
      "approved" |
      "rejected" |
      "paid"
    >("all");

  const data =
    filter === "all"
      ? requests
      : requests.filter(
          item =>
            item.status === filter,
        );

  return (

    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">

      <h1 className="text-3xl font-bold">
        Admin Maestro
      </h1>

      <p className="mt-2 text-slate-400">
        Gestión de Solicitudes de Retiro
      </p>

      <div className="mt-8 space-y-4">

        {data.map(item => (

          <div
            key={item.id}
            className="rounded-2xl border border-slate-700 bg-slate-900 p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-bold">
                  {item.userName}
                </h2>

                <p className="text-sm text-slate-400">
                  {item.createdAt}
                </p>

              </div>

              <div className="text-right">

                <p className="text-2xl font-bold text-green-400">
                  ${item.amount.toFixed(2)}
                </p>

                <p className="text-sm uppercase text-cyan-300">
                  {item.status}
                </p>

              </div>

            </div>

            <div className="mt-5 flex gap-3">

              <button
                onClick={() =>
                  onApprove(item.id)
                }
                className="rounded-lg bg-green-500 px-4 py-2 font-bold text-black"
              >
                Aprobar
              </button>

              <button
                onClick={() =>
                  onReject(item.id)
                }
                className="rounded-lg bg-red-500 px-4 py-2 font-bold"
              >
                Rechazar
              </button>

              <button
                onClick={() =>
                  onPay(item.id)
                }
                className="rounded-lg bg-cyan-500 px-4 py-2 font-bold text-black"
              >
                Liberar Pago
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}
