"use client";

export type WalletMovement = {
  id: string;
  title: string;
  amount: number;
  type: "credit" | "debit";
  date: string;
};

type Props = {
  movements: WalletMovement[];
};

export default function WalletHistory({
  movements,
}: Props) {
  return (
    <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">

      <h2 className="mb-6 text-2xl font-bold">
        Historial de Movimientos
      </h2>

      <div className="space-y-4">

        {movements.length === 0 ? (

          <div className="rounded-xl bg-slate-800 p-6 text-center text-gray-400">
            No hay movimientos todavía.
          </div>

        ) : (

          movements.map((movement) => (

            <div
              key={movement.id}
              className="flex items-center justify-between rounded-xl bg-slate-800 p-4"
            >
              <div>

                <h3 className="font-semibold">
                  {movement.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {movement.date}
                </p>

              </div>

              <span
                className={
                  movement.type === "credit"
                    ? "font-bold text-green-400"
                    : "font-bold text-red-400"
                }
              >
                {movement.type === "credit"
                  ? "+"
                  : "-"}
                $
                {movement.amount.toFixed(2)}
              </span>

            </div>

          ))

        )}

      </div>

    </section>
  );
}
