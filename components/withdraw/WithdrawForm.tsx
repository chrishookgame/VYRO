"use client";

import { useState } from "react";

type WithdrawFormProps = {
  availableBalance: number;
  onSubmit: (amount: number) => void;
};

export default function WithdrawForm({
  availableBalance,
  onSubmit,
}: WithdrawFormProps) {

  const [amount, setAmount] =
    useState("");

  function handleSubmit() {

    const value =
      Number(amount);

    if (
      Number.isNaN(value) ||
      value <= 0
    ) {
      window.alert(
        "Ingrese un monto válido.",
      );
      return;
    }

    if (
      value >
      availableBalance
    ) {
      window.alert(
        "Saldo insuficiente.",
      );
      return;
    }

    onSubmit(value);

    setAmount("");

  }

  return (

    <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">

      <h2 className="text-3xl font-bold">
        Solicitar Retiro
      </h2>

      <p className="mt-2 text-gray-400">
        Saldo disponible
      </p>

      <h3 className="mb-8 mt-2 text-4xl font-bold text-green-400">
        ${availableBalance.toFixed(2)}
      </h3>

      <input
        type="number"
        min="1"
        step="0.01"
        value={amount}
        onChange={(e) =>
          setAmount(
            e.target.value,
          )
        }
        placeholder="Monto a retirar"
        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none"
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-6 w-full rounded-xl bg-emerald-500 py-4 font-bold text-black transition hover:bg-emerald-400"
      >
        Enviar Solicitud
      </button>

      <p className="mt-4 text-sm text-gray-500">
        Todas las solicitudes serán revisadas por el
        Admin Maestro antes de liberar el pago.
      </p>

    </section>

  );

}
