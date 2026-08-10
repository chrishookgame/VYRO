"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getWithdrawRequests,
} from "@/lib/admin";

type WithdrawRequest = {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
};

export default function WithdrawRequestsPage() {

  const [
    requests,
    setRequests,
  ] = useState<
    WithdrawRequest[]
  >([]);

  useEffect(() => {

    async function load() {

      const {
        data,
      } =
        await getWithdrawRequests();

      setRequests(
    (data ?? []).map((item) => ({
      id: item.id,
      user_id: item.user_id,
      amount:
        typeof item.amount === "number"
          ? item.amount
          : Number(item.amount),
      status: item.status,
      created_at: item.created_at,
    })),
  );

    }

    void load();

  }, []);

  return (

    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">

      <h1 className="text-3xl font-bold">
        Solicitudes de Retiro
      </h1>

      <p className="mt-2 text-slate-400">
        Admin Maestro
      </p>

      <div className="mt-8 space-y-4">

        {requests.map(
          request => (

            <div
              key={request.id}
              className="rounded-xl bg-slate-900 p-5"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-bold">
                    Usuario
                  </h2>

                  <p className="text-sm text-slate-400">
                    {request.user_id}
                  </p>

                </div>

                <div className="text-right">

                  <h2 className="text-xl font-bold text-green-400">
                    $
                    {request.amount.toFixed(2)}
                  </h2>

                  <p className="text-cyan-300">
                    {request.status}
                  </p>

                </div>

              </div>

              <p className="mt-4 text-sm text-slate-500">
                {new Date(
                  request.created_at,
                ).toLocaleString()}
              </p>

            </div>

          ),
        )}

      </div>

    </section>

  );

}
